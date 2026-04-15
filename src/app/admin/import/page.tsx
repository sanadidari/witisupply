import { getAdminSession } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { URLImporter } from '@/components/admin/URLImporter';

export default async function AdminImport() {
  const ok = await getAdminSession();
  if (!ok) redirect('/admin/login');

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Import Products
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mt-1">
          Paste a CJ Dropshipping product URL → auto-extract → import to Shopify with pricing ×2.5 / ×4
        </p>
      </div>
      <URLImporter />
    </AdminShell>
  );
}
