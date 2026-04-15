import { getAdminSession } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { listProducts } from '@/lib/admin/shopify';

export default async function AdminDashboard() {
  const ok = await getAdminSession();
  if (!ok) redirect('/admin/login');

  const products = await listProducts();
  const active = products.filter((p) => p.status === 'active').length;
  const draft = products.filter((p) => p.status === 'draft').length;

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Dashboard
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mt-1">Niche: Cuisine & Home</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Products" value={products.length} color="accent" />
        <StatCard label="Active (Live)" value={active} color="success" />
        <StatCard label="Draft (Hidden)" value={draft} color="muted" />
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
          >
            <span className="text-xl">⊞</span>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                Manage Products
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">Publish, unpublish, set prices</p>
            </div>
          </a>
          <a
            href="/admin/suppliers"
            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
          >
            <span className="text-xl">⊡</span>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                Manage Suppliers
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">Spocket, Zendrop, CJ — per product</p>
            </div>
          </a>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    accent: 'text-[var(--accent)]',
    success: 'text-[var(--success)]',
    muted: 'text-[var(--foreground-muted)]',
  };
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
      <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
