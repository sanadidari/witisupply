import { getAdminSession } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { listProducts } from '@/lib/admin/shopify';

export default async function AdminProducts() {
  const ok = await getAdminSession();
  if (!ok) redirect('/admin/login');

  const products = await listProducts();

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Products
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-1">{products.length} products in Shopify</p>
        </div>
      </div>

      <ProductsTable products={products} />
    </AdminShell>
  );
}
