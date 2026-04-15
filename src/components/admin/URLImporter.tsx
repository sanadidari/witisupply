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
  const [editTitle, setEditTitle] = useState('');
  const [editImage, setEditImage] = useState('');
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
      setEditTitle(data.title);
      setEditImage(data.image);
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
          title: editTitle || preview.title,
          image: editImage || preview.image,
          costPrice: parseFloat(costPrice),
          publishNow,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const displayTitle = (editTitle || preview.title).slice(0, 45);
      setSuccess(`✓ Imported "${displayTitle}…" → Sell $${data.sellPrice} | Compare at $${data.compareAtPrice} | ${data.status}`);
      setPreview(null);
      setUrl('');
      setCostPrice('');
      setEditTitle('');
      setEditImage('');
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
      {/* URL Input */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)] mb-1">How to import a CJ product</p>
          <ol className="text-xs text-[var(--foreground-muted)] flex flex-col gap-1 list-decimal list-inside">
            <li>Open a product on <span className="font-mono bg-[var(--background-secondary)] px-1 rounded">cjdropshipping.com</span></li>
            <li>Copy the URL → paste below → click <strong>Preview</strong></li>
            <li>Right-click the main product photo → <strong>Copy image address</strong> → paste in Image URL</li>
            <li>Enter the cost price (shown on CJ) → <strong>Import to Shopify</strong></li>
          </ol>
        </div>

        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://cjdropshipping.com/product/air-fryer-7.5qt..."
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
          {success}
        </div>
      )}

      {/* Preview + edit card */}
      {preview && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
            Product Preview — edit if needed
          </p>

          <div className="flex gap-4">
            {/* Image preview */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)]">
                {editImage ? (
                  <Image src={editImage} alt="preview" fill unoptimized className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[var(--foreground-muted)]">No image</div>
                )}
              </div>
            </div>

            {/* Editable fields */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Product title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">
                  Image URL
                  <span className="ml-1 opacity-60">— on CJ: right-click main photo → <strong>Copy image address</strong></span>
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://cf.cjdropshipping.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>

          {/* Cost price + pricing */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-[var(--foreground-muted)] shrink-0">Cost price (from CJ)</label>
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
            {sellPrice && (
              <div className="text-xs text-[var(--foreground-muted)] bg-[var(--background-secondary)] rounded-lg px-3 py-1.5 flex gap-3">
                <span>Sell: <span className="font-bold text-[var(--foreground)]">${sellPrice}</span></span>
                <span>Compare: <span className="line-through">${compareAt}</span></span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-1">
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
              disabled={importing || !costPrice || !editTitle || parseFloat(costPrice) <= 0}
              className="px-6 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {importing ? 'Importing…' : 'Import to Shopify'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
