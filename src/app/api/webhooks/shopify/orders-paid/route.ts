import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db/client';
import { placeCJOrder } from '@/lib/cj/orders';
import { sendEmail, orderConfirmationHtml } from '@/lib/email';

// Shopify sends webhooks even without a secret configured — but we always verify.
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET ?? '';

async function verifyShopifyHmac(req: NextRequest, rawBody: string): Promise<boolean> {
  const hmac = req.headers.get('x-shopify-hmac-sha256');
  if (!hmac || !WEBHOOK_SECRET) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const computed = Buffer.from(sig).toString('base64');
  return computed === hmac;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!(await verifyShopifyHmac(req, rawBody))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let order: ShopifyOrderPayload;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Idempotency: skip if already processed
  const existing = await sql`SELECT id FROM orders WHERE shopify_order_id = ${String(order.id)}`;
  if (existing.length > 0) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const customerName = `${order.shipping_address?.first_name ?? ''} ${order.shipping_address?.last_name ?? ''}`.trim()
    || order.customer?.first_name
    || 'Customer';

  const shippingAddressText = order.shipping_address
    ? [
        `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
        order.shipping_address.address1,
        order.shipping_address.address2,
        `${order.shipping_address.city}, ${order.shipping_address.province} ${order.shipping_address.zip}`,
        order.shipping_address.country_code,
      ].filter(Boolean).join('\n')
    : '';

  // Process each line item
  const cjOrders: CJOrderEntry[] = [];
  let overallStatus: OrderStatus = 'ordered';
  let errorMessage = '';

  for (const item of order.line_items) {
    const suppliers = await sql`
      SELECT * FROM product_suppliers
      WHERE shopify_product_id = ${String(item.product_id)}
        AND is_active = true
      LIMIT 1
    `;

    if (suppliers.length === 0) {
      cjOrders.push({ lineItemId: item.id, supplier: 'unknown', status: 'manual_required' });
      overallStatus = 'manual_required';
      continue;
    }

    const supplier = suppliers[0];

    if (supplier.supplier !== 'cj') {
      cjOrders.push({ lineItemId: item.id, supplier: supplier.supplier, status: 'manual_required' });
      overallStatus = 'manual_required';
      continue;
    }

    if (!order.shipping_address) {
      cjOrders.push({ lineItemId: item.id, supplier: 'cj', status: 'error', error: 'No shipping address' });
      overallStatus = 'error';
      continue;
    }

    try {
      const result = await placeCJOrder({
        pid: supplier.supplier_product_id,
        quantity: item.quantity,
        customerEmail: order.email,
        shippingAddress: order.shipping_address,
        shopifyOrderNumber: String(order.order_number),
      });

      cjOrders.push({
        lineItemId: item.id,
        supplier: 'cj',
        cjOrderId: result.cjOrderId,
        status: 'ordered',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'CJ order failed';
      cjOrders.push({ lineItemId: item.id, supplier: 'cj', status: 'error', error: msg });
      overallStatus = 'error';
      errorMessage = msg;
    }
  }

  // Persist order
  await sql`
    INSERT INTO orders
      (shopify_order_id, shopify_order_number, customer_email, customer_name,
       shipping_address, line_items, total_price, currency, status, cj_orders, error_message)
    VALUES
      (${String(order.id)}, ${String(order.order_number)}, ${order.email}, ${customerName},
       ${JSON.stringify(order.shipping_address)}, ${JSON.stringify(order.line_items)},
       ${parseFloat(order.total_price)}, ${order.currency}, ${overallStatus},
       ${JSON.stringify(cjOrders)}, ${errorMessage || null})
    ON CONFLICT (shopify_order_id) DO NOTHING
  `;

  // Send confirmation email regardless of fulfillment status
  if (order.email) {
    const html = orderConfirmationHtml({
      customerName,
      orderNumber: String(order.order_number),
      lineItems: order.line_items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: shippingAddressText,
      totalPrice: order.total_price,
      currency: order.currency,
    });

    await sendEmail({
      to: order.email,
      subject: `Order Confirmed — #${order.order_number}`,
      html,
    });
  }

  return NextResponse.json({ ok: true, status: overallStatus });
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShopifyLineItem {
  id: number;
  product_id: number;
  variant_id: number;
  title: string;
  quantity: number;
  price: string;
  sku?: string;
  variant_title?: string;
}

interface ShopifyAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country_code: string;
  zip: string;
  phone?: string;
}

interface ShopifyOrderPayload {
  id: number;
  order_number: number;
  email: string;
  total_price: string;
  currency: string;
  line_items: ShopifyLineItem[];
  shipping_address?: ShopifyAddress;
  customer?: { first_name?: string; last_name?: string };
}

type OrderStatus = 'pending' | 'ordered' | 'manual_required' | 'error';

interface CJOrderEntry {
  lineItemId: number;
  supplier: string;
  cjOrderId?: string;
  status: 'ordered' | 'manual_required' | 'error';
  error?: string;
}
