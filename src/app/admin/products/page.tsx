import { getAdminSession } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { listProducts } from '@/lib/admin/shopify';

export default async function AdminProducts() {
  const ok = await getAdminSession();
  if (!ok) redirect('/admin/login');

  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let fetchError = '';
  try {
    products = await listProducts();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : 'Failed to load products';
  }

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

      {fetchError && (
        <div className="mb-4 p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-sm text-[var(--danger)]">
          <strong>Shopify Admin API error:</strong> {fetchError}
          <br /><span className="text-xs mt-1 block opacity-80">Check SHOPIFY_ADMIN_ACCESS_TOKEN in Vercel env vars.</span>
        </div>
      )}
      <ProductsTable products={products} />
    </AdminShell>
  );
}
