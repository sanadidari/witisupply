import { getAdminSession } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { SuppliersManager } from '@/components/admin/SuppliersManager';
import { listProducts } from '@/lib/admin/shopify';

export default async function AdminSuppliers() {
  const ok = await getAdminSession();
  if (!ok) redirect('/admin/login');

  const products = await listProducts();

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Suppliers
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mt-1">
          Assign and switch suppliers per product — Spocket, Zendrop, CJ
        </p>
      </div>

      <SuppliersManager products={products} />
    </AdminShell>
  );
}
