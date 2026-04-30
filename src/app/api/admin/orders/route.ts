import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import sql from '@/lib/db/client';
import { getCJOrderTracking } from '@/lib/cj/orders';

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = 25;
  const offset = (page - 1) * limit;

  const rows = status
    ? await sql`
        SELECT * FROM orders WHERE status = ${status}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    : await sql`
        SELECT * FROM orders
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM orders`;

  return NextResponse.json({ orders: rows, total: count, page, limit });
}

// PATCH: manually update status OR refresh CJ tracking
export async function PATCH(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, action, status } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  if (action === 'refresh_tracking') {
    const [order] = await sql`SELECT * FROM orders WHERE id = ${id}`;
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const cjOrders: CJOrderEntry[] = order.cj_orders ?? [];
    const updated: CJOrderEntry[] = [];

    for (const entry of cjOrders) {
      if (!entry.cjOrderId) { updated.push(entry); continue; }
      try {
        const tracking = await getCJOrderTracking(entry.cjOrderId);
        updated.push({
          ...entry,
          status: tracking.status === 'FINISHED' ? 'fulfilled' : entry.status,
          trackingNumber: tracking.trackingNumber ?? undefined,
          trackingCompany: tracking.trackingCompany ?? undefined,
        });
      } catch {
        updated.push(entry);
      }
    }

    const hasTracking = updated.some((e) => e.trackingNumber);
    const newStatus = hasTracking ? 'fulfilled' : order.status;

    const [row] = await sql`
      UPDATE orders SET cj_orders = ${JSON.stringify(updated)}, status = ${newStatus}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return NextResponse.json(row);
  }

  if (status) {
    const [row] = await sql`
      UPDATE orders SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *
    `;
    return NextResponse.json(row);
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

interface CJOrderEntry {
  lineItemId: number;
  supplier: string;
  cjOrderId?: string;
  status: string;
  trackingNumber?: string;
  trackingCompany?: string;
  error?: string;
}
