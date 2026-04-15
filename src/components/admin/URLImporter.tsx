'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PreviewProduct {
  title: string;
  image: string;
  description: string;
  pid: string;
  sourceUrl: string;
}

export function URLImporter() {
  const [url, setUrl] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [preview, setPreview] = useState<PreviewProduct | null>(null);
  const [fetching, setFetching] = useState(false);
  const [importing, setImporting] = useState(false);
  const [publishNow, setPublishNow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handlePreview() {
    if (!url.trim()) return;
    setFetching(true);
    setError('');
    setPreview(null);
    setSuccess('');
    try {
      const res = await fetch('/api/admin/import-url/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPreview(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch product');
    } finally {
      setFetching(false);
    }
  }

  async function handleImport() {
    if (!preview || !costPrice) return;
    setImporting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: preview.sourceUrl,
          title: preview.title,
          image: preview.image,
          costPrice: parseFloat(costPrice),
          publishNow,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess(
        `Imported "${preview.title.slice(0, 40)}…" → Sell $${data.sellPrice} | Compare at $${data.compareAtPrice} | Status: ${data.status}`
      );
      setPreview(null);
      setUrl('');
      setCostPrice('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  }

  const cost = parseFloat(costPrice) || 0;
  const sellPrice = cost ? (cost * 2.5).toFixed(2) : null;
  const compareAt = cost ? (cost * 4).toFixed(2) : null;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Instructions */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)] mb-1">How to import a CJ product</p>
          <ol className="text-xs text-[var(--foreground-muted)] flex flex-col gap-1 list-decimal list-inside">
            <li>Go to <span className="font-mono bg-[var(--background-secondary)] px-1 rounded">cjdropshipping.com</span> and find a product</li>
            <li>Copy the product page URL from your browser</li>
            <li>Paste it below and click <strong>Preview</strong></li>
            <li>Enter the cost price, then click <strong>Import to Shopify</strong></li>
          </ol>
        </div>

        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://cjdropshipping.com/product-detail.html?id=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePreview()}
            className="flex-1 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={handlePreview}
            disabled={fetching || !url.trim()}
            className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
          >
            {fetching ? 'Loading…' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-4 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 text-sm text-[var(--success)]">
          ✓ {success}
        </div>
      )}

      {/* Preview card */}
      {preview && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex gap-5">
          {preview.image && (
            <div className="relative w-36 h-36 rounded-lg overflow-hidden bg-[var(--background-secondary)] flex-shrink-0 border border-[var(--border)]">
              <Image
                src={preview.image}
                alt={preview.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">
              {preview.title}
            </p>

            {/* Cost price */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-[var(--foreground-muted)] shrink-0">Cost price (USD)</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-[var(--foreground-muted)]">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 12.50"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-28 px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* Pricing preview */}
            {sellPrice && (
              <div className="text-xs text-[var(--foreground-muted)] bg-[var(--background-secondary)] rounded-lg px-3 py-2 flex gap-4">
                <span>Sell: <span className="font-bold text-[var(--foreground)]">${sellPrice}</span></span>
                <span>Compare at: <span className="line-through">${compareAt}</span></span>
                <span className="text-[var(--success)]">Margin: ${(cost * 1.5).toFixed(2)}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-auto">
              <label className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishNow}
                  onChange={(e) => setPublishNow(e.target.checked)}
                  className="rounded"
                />
                Publish immediately
              </label>
              <button
                onClick={handleImport}
                disabled={importing || !costPrice || parseFloat(costPrice) <= 0}
                className="px-5 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {importing ? 'Importing…' : 'Import to Shopify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
