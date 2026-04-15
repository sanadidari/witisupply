import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { getCJProduct } from '@/lib/cj/products';
import sql from '@/lib/db/client';

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const version = process.env.SHOPIFY_API_VERSION || '2025-01';

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { pid, costMultiplier = 2.5, compareMultiplier = 4, publishNow = false } = await req.json();

  // 1. Fetch full product from CJ
  const cjProduct = await getCJProduct(pid);
  const costPrice = cjProduct.sellPrice;
  const sellPrice = parseFloat((costPrice * costMultiplier).toFixed(2));
  const compareAtPrice = parseFloat((costPrice * compareMultiplier).toFixed(2));

  // 2. Create product in Shopify
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
          title: cjProduct.productNameEn,
          status: publishNow ? 'active' : 'draft',
          images: [{ src: cjProduct.productImage }],
          variants: [{
            price: String(sellPrice),
            compare_at_price: String(compareAtPrice),
            inventory_management: 'shopify',
          }],
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

  // 3. Save supplier mapping in Neon DB
  await sql`
    INSERT INTO product_settings (shopify_product_id, shopify_handle, shopify_title, is_active, niche)
    VALUES (${String(shopifyProduct.id)}, ${shopifyProduct.handle}, ${shopifyProduct.title}, ${publishNow}, 'cuisine_home')
    ON CONFLICT (shopify_product_id) DO NOTHING
  `;

  await sql`
    INSERT INTO product_suppliers
      (shopify_product_id, supplier, supplier_product_id, cost_price, sell_price, compare_at_price, is_active)
    VALUES
      (${String(shopifyProduct.id)}, 'cj', ${pid}, ${costPrice}, ${sellPrice}, ${compareAtPrice}, true)
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
