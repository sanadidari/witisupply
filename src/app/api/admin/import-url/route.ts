import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import sql from '@/lib/db/client';

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const version = process.env.SHOPIFY_API_VERSION || '2025-01';

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, title, image, costPrice, publishNow = false } = await req.json();

  if (!title || !costPrice) {
    return NextResponse.json({ error: 'title and costPrice are required' }, { status: 400 });
  }

  const cost = parseFloat(costPrice);
  const sellPrice = parseFloat((cost * 2.5).toFixed(2));
  const compareAtPrice = parseFloat((cost * 4).toFixed(2));

  // Create Shopify product
  const shopifyRes = await fetch(
    `https://${domain}/admin/api/${version}/products.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        product: {
          title,
          status: publishNow ? 'active' : 'draft',
          images: image ? [{ src: image }] : [],
          variants: [
            {
              price: String(sellPrice),
              compare_at_price: String(compareAtPrice),
              inventory_management: 'shopify',
            },
          ],
          tags: 'cj,imported',
        },
      }),
      cache: 'no-store',
    }
  );

  if (!shopifyRes.ok) {
    const err = await shopifyRes.text();
    return NextResponse.json({ error: `Shopify error: ${err}` }, { status: 500 });
  }

  const { product: shopifyProduct } = await shopifyRes.json();

  // Save to Neon DB
  await sql`
    INSERT INTO product_settings (shopify_product_id, shopify_handle, shopify_title, is_active, niche)
    VALUES (${String(shopifyProduct.id)}, ${shopifyProduct.handle}, ${shopifyProduct.title}, ${publishNow}, 'cuisine_home')
    ON CONFLICT (shopify_product_id) DO NOTHING
  `;

  await sql`
    INSERT INTO product_suppliers
      (shopify_product_id, supplier, supplier_product_id, cost_price, sell_price, compare_at_price, is_active)
    VALUES
      (${String(shopifyProduct.id)}, 'cj', ${url}, ${cost}, ${sellPrice}, ${compareAtPrice}, true)
  `;

  return NextResponse.json({
    ok: true,
    shopifyProductId: shopifyProduct.id,
    shopifyHandle: shopifyProduct.handle,
    sellPrice,
    compareAtPrice,
    status: shopifyProduct.status,
  });
}
