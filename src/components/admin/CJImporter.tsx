'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CJProduct } from '@/lib/cj/products';

interface ImportState {
  [pid: string]: 'idle' | 'loading' | 'done' | 'error';
}

export function CJImporter() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const [importState, setImportState] = useState<ImportState>({});
  const [publishNow, setPublishNow] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(p = 1) {
    if (!keyword.trim()) return;
    setSearching(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/cj/search?keyword=${encodeURIComponent(keyword)}&page=${p}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProducts(data.list ?? []);
      setTotal(data.total ?? 0);
      setPage(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setSearching(false);
    }
  }

  async function handleImport(product: CJProduct) {
    setImportState((s) => ({ ...s, [product.pid]: 'loading' }));
    try {
      const res = await fetch('/api/admin/cj/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid: product.pid, publishNow }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImportState((s) => ({ ...s, [product.pid]: 'done' }));
    } catch {
      setImportState((s) => ({ ...s, [product.pid]: 'error' }));
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search CJ catalog… e.g. air fryer, knife set, coffee maker"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
            className="flex-1 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={() => handleSearch(1)}
            disabled={searching}
            className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
              className="rounded"
            />
            Publish immediately on import
          </label>
          {total > 0 && (
            <span className="text-xs text-[var(--foreground-muted)] ml-auto">
              {total} results — page {page}/{totalPages}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {/* Results grid */}
      {products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const state = importState[product.pid] ?? 'idle';
              const sellPrice = (product.sellPrice * 2.5).toFixed(2);
              const compareAt = (product.sellPrice * 4).toFixed(2);
              return (
                <div key={product.pid} className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
                  <div className="relative aspect-square bg-[var(--background-secondary)]">
                    {product.productImage && (
                      <Image
                        src={product.productImage}
                        alt={product.productNameEn}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-xs font-medium text-[var(--foreground)] line-clamp-2 leading-tight">
                      {product.productNameEn}
                    </p>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      <p>Cost: <span className="font-medium">${product.sellPrice}</span></p>
                      <p>Sell: <span className="font-bold text-[var(--foreground)]">${sellPrice}</span>
                        {' '}<span className="line-through">${compareAt}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleImport(product)}
                      disabled={state !== 'idle'}
                      className={`mt-auto py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        state === 'done'
                          ? 'bg-[var(--success)]/15 text-[var(--success)]'
                          : state === 'error'
                          ? 'bg-[var(--danger)]/15 text-[var(--danger)]'
                          : state === 'loading'
                          ? 'bg-[var(--accent)]/50 text-white'
                          : 'bg-[var(--accent)] text-white hover:opacity-90'
                      }`}
                    >
                      {state === 'done' ? '✓ Imported' : state === 'error' ? '✗ Failed' : state === 'loading' ? 'Importing…' : 'Import to Shopify'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleSearch(page - 1)}
                disabled={page <= 1 || searching}
                className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] disabled:opacity-40 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-sm text-[var(--foreground-muted)]">{page} / {totalPages}</span>
              <button
                onClick={() => handleSearch(page + 1)}
                disabled={page >= totalPages || searching}
                className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] disabled:opacity-40 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {!searching && products.length === 0 && keyword && (
        <p className="text-center text-sm text-[var(--foreground-muted)] py-12">
          No results for "{keyword}". Try a different keyword.
        </p>
      )}
    </div>
  );
}
