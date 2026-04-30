'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';

interface CJEntry {
  lineItemId: number;
  supplier: string;
  cjOrderId?: string;
  status: string;
  trackingNumber?: string;
  trackingCompany?: string;
  error?: string;
}

interface Order {
  id: number;
  shopify_order_id: string;
  shopify_order_number: string;
  customer_email: string;
  customer_name: string;
  total_price: string;
  currency: string;
  status: string;
  cj_orders: CJEntry[];
  error_message: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  ordered: 'bg-blue-500/15 text-blue-400',
  fulfilled: 'bg-green-500/15 text-green-400',
  manual_required: 'bg-yellow-500/15 text-yellow-400',
  error: 'bg-red-500/15 text-red-400',
  pending: 'bg-zinc-500/15 text-zinc-400',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async (p = 1) => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(p), ...(statusFilter && { status: statusFilter }) });
    const res = await fetch(`/api/admin/orders?${qs}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setTotal(data.total ?? 0);
    setPage(p);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchOrders(1); }, [fetchOrders]);

  async function handleRefreshTracking(id: number) {
    setRefreshingId(id);
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'refresh_tracking' }),
    });
    await fetchOrders(page);
    setRefreshingId(null);
  }

  async function handleMarkFulfilled(id: number) {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'fulfilled' }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'fulfilled' } : o));
  }

  const totalPages = Math.ceil(total / 25);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Orders</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">{total} total orders</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none"
          >
            <option value="">All statuses</option>
            <option value="ordered">Ordered</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="manual_required">Manual required</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-sm text-[var(--foreground-muted)]">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--foreground-muted)]">No orders yet.</p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {orders.map((order) => {
                const tracking = order.cj_orders?.find((e) => e.trackingNumber);
                return (
                  <div key={order.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[var(--foreground)]">
                          #{order.shopify_order_number}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${statusColors[order.status] ?? 'bg-zinc-500/15 text-zinc-400'}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--foreground-muted)] shrink-0">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                      <div>
                        <span className="text-[var(--foreground-muted)]">Customer: </span>
                        <span className="text-[var(--foreground)]">{order.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)]">Email: </span>
                        <span className="text-[var(--foreground)]">{order.customer_email}</span>
                      </div>
                      <div>
                        <span className="text-[var(--foreground-muted)]">Total: </span>
                        <span className="text-[var(--foreground)] font-medium">{order.currency} {Number(order.total_price).toFixed(2)}</span>
                      </div>
                      {tracking && (
                        <div>
                          <span className="text-[var(--foreground-muted)]">Tracking: </span>
                          <span className="text-[var(--foreground)] font-mono">{tracking.trackingNumber}</span>
                          {tracking.trackingCompany && (
                            <span className="text-[var(--foreground-muted)]"> via {tracking.trackingCompany}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {order.cj_orders?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {order.cj_orders.map((entry, i) => (
                          <span key={i} className="text-xs bg-[var(--background-secondary)] rounded px-2 py-1 text-[var(--foreground-muted)]">
                            {entry.supplier.toUpperCase()}
                            {entry.cjOrderId ? ` · ${entry.cjOrderId}` : ''}
                            {entry.status === 'error' && entry.error ? ` · ✗ ${entry.error}` : ''}
                          </span>
                        ))}
                      </div>
                    )}

                    {order.error_message && (
                      <p className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 rounded px-3 py-1.5">
                        {order.error_message}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRefreshTracking(order.id)}
                        disabled={refreshingId === order.id}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40"
                      >
                        {refreshingId === order.id ? 'Refreshing…' : '↻ Refresh tracking'}
                      </button>
                      {order.status !== 'fulfilled' && (
                        <button
                          onClick={() => handleMarkFulfilled(order.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--success)]/15 text-[var(--success)] hover:bg-[var(--success)]/25 transition-colors"
                        >
                          ✓ Mark fulfilled
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => fetchOrders(page - 1)}
              disabled={page <= 1 || loading}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm text-[var(--foreground-muted)]">{page} / {totalPages}</span>
            <button
              onClick={() => fetchOrders(page + 1)}
              disabled={page >= totalPages || loading}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
