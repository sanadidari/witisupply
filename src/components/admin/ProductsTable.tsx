'use client';

import { useState } from 'react';
import type { AdminProduct } from '@/lib/admin/shopify';
import Image from 'next/image';

export function ProductsTable({ products: initial }: { products: AdminProduct[] }) {
  const [products, setProducts] = useState(initial);
  const [loading, setLoading] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleStatus(product: AdminProduct) {
    const newActive = product.status !== 'active';
    setLoading(product.id);
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        active: newActive,
        handle: product.handle,
        title: product.title,
      }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, status: newActive ? 'active' : 'draft' } : p
        )
      );
    }
    setLoading(null);
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="px-4 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Compare-at</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const variant = product.variants[0];
              const img = product.images[0]?.src;
              const isActive = product.status === 'active';
              return (
                <tr key={product.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--background-secondary)] flex-shrink-0">
                        {img && (
                          <Image src={img} alt={product.title} width={40} height={40} unoptimized className="object-cover w-full h-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] line-clamp-1">{product.title}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{product.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                    ${parseFloat(variant?.price ?? '0').toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)] line-through">
                    {variant?.compare_at_price
                      ? `$${parseFloat(variant.compare_at_price).toFixed(2)}`
                      : <span className="no-underline text-[var(--foreground-muted)]/50">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-[var(--success)]/15 text-[var(--success)]'
                        : 'bg-[var(--foreground-muted)]/15 text-[var(--foreground-muted)]'
                    }`}>
                      {isActive ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(product)}
                      disabled={loading === product.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                        isActive
                          ? 'bg-[var(--foreground-muted)]/15 text-[var(--foreground-muted)] hover:bg-[var(--danger)]/15 hover:text-[var(--danger)]'
                          : 'bg-[var(--success)]/15 text-[var(--success)] hover:bg-[var(--success)]/25'
                      }`}
                    >
                      {loading === product.id ? '…' : isActive ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
