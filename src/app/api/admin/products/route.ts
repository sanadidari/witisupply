import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { listProducts, setProductStatus } from '@/lib/admin/shopify';
import sql from '@/lib/db/client';

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [shopifyProducts, dbSettings] = await Promise.all([
    listProducts(),
    sql`SELECT * FROM product_settings`,
  ]);

  const settingsMap = Object.fromEntries(
    dbSettings.map((s: Record<string, unknown>) => [s.shopify_product_id as string, s])
  );

  const merged = shopifyProducts.map((p) => ({
    ...p,
    settings: settingsMap[String(p.id)] ?? null,
  }));

  return NextResponse.json(merged);
}

export async function PATCH(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, active, handle, title } = await req.json();

  const [updated] = await Promise.all([
    setProductStatus(productId, active),
    sql`
      INSERT INTO product_settings (shopify_product_id, shopify_handle, shopify_title, is_active, updated_at)
      VALUES (${String(productId)}, ${handle}, ${title}, ${active}, NOW())
      ON CONFLICT (shopify_product_id)
      DO UPDATE SET is_active = ${active}, updated_at = NOW()
    `,
  ]);

  return NextResponse.json({ ok: true, status: updated.status });
}
