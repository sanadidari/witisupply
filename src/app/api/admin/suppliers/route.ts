import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import sql from '@/lib/db/client';

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  const rows = productId
    ? await sql`SELECT * FROM product_suppliers WHERE shopify_product_id = ${productId} ORDER BY is_active DESC, created_at DESC`
    : await sql`SELECT * FROM product_suppliers ORDER BY created_at DESC`;

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const {
    shopify_product_id, supplier, supplier_product_id,
    supplier_sku, cost_price, sell_price, compare_at_price,
    lead_time_days, notes,
  } = body;

  const [row] = await sql`
    INSERT INTO product_suppliers
      (shopify_product_id, supplier, supplier_product_id, supplier_sku,
       cost_price, sell_price, compare_at_price, lead_time_days, notes)
    VALUES
      (${shopify_product_id}, ${supplier}, ${supplier_product_id}, ${supplier_sku},
       ${cost_price}, ${sell_price}, ${compare_at_price}, ${lead_time_days}, ${notes})
    RETURNING *
  `;
  return NextResponse.json(row);
}

export async function PATCH(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, is_active } = await req.json();

  // Deactivate all suppliers for this product first, then activate selected
  const [current] = await sql`SELECT shopify_product_id FROM product_suppliers WHERE id = ${id}`;
  if (is_active) {
    await sql`UPDATE product_suppliers SET is_active = false WHERE shopify_product_id = ${current.shopify_product_id}`;
  }
  const [row] = await sql`UPDATE product_suppliers SET is_active = ${is_active}, updated_at = NOW() WHERE id = ${id} RETURNING *`;
  return NextResponse.json(row);
}
