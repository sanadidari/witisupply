'use client';

import { useState, useEffect } from 'react';
import type { AdminProduct } from '@/lib/admin/shopify';

const SUPPLIERS = ['spocket', 'zendrop', 'cj', 'manual'] as const;
type Supplier = typeof SUPPLIERS[number];

interface SupplierRow {
  id: number;
  shopify_product_id: string;
  supplier: Supplier;
  supplier_product_id: string;
  supplier_sku: string;
  cost_price: number;
  sell_price: number;
  compare_at_price: number;
  lead_time_days: number;
  is_active: boolean;
  notes: string;
}

const supplierColors: Record<Supplier, string> = {
  spocket: 'bg-purple-500/15 text-purple-400',
  zendrop: 'bg-blue-500/15 text-blue-400',
  cj: 'bg-orange-500/15 text-orange-400',
  manual: 'bg-zinc-500/15 text-zinc-400',
};

export function SuppliersManager({ products }: { products: AdminProduct[] }) {
  const [selectedId, setSelectedId] = useState<string>(String(products[0]?.id ?? ''));
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    supplier: 'spocket' as Supplier,
    supplier_product_id: '',
    supplier_sku: '',
    cost_price: '',
    sell_price: '',
    compare_at_price: '',
    lead_time_days: '',
    notes: '',
  });

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    fetch(`/api/admin/suppliers?productId=${selectedId}`)
      .then((r) => r.json())
      .then(setSuppliers)
      .finally(() => setLoading(false));
  }, [selectedId]);

  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, shopify_product_id: selectedId }),
    });
    if (res.ok) {
      const row = await res.json();
      setSuppliers((prev) => [row, ...prev]);
      setShowForm(false);
      setForm({ supplier: 'spocket', supplier_product_id: '', supplier_sku: '', cost_price: '', sell_price: '', compare_at_price: '', lead_time_days: '', notes: '' });
    }
  }

  async function handleSetActive(id: number, is_active: boolean) {
    const res = await fetch('/api/admin/suppliers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active }),
    });
    if (res.ok) {
      setSuppliers((prev) =>
        prev.map((s) => ({ ...s, is_active: s.id === id ? is_active : (is_active ? false : s.is_active) }))
      );
    }
  }

  async function handleDelete(id: number, isActive: boolean) {
    if (isActive) {
      if (!confirm('This is the active supplier. Delete anyway?')) return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/suppliers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  const selectedProduct = products.find((p) => String(p.id) === selectedId);

  return (
    <div className="flex flex-col gap-6">
      {/* Product selector */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
        <label className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block mb-2">
          Select Product
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent)]"
        >
          {products.map((p) => (
            <option key={p.id} value={String(p.id)}>{p.title}</option>
          ))}
        </select>
        {selectedProduct && (
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Status: <span className={selectedProduct.status === 'active' ? 'text-[var(--success)]' : 'text-[var(--foreground-muted)]'}>{selectedProduct.status}</span>
            {' · '}Price: ${parseFloat(selectedProduct.variants[0]?.price ?? '0').toFixed(2)}
          </p>
        )}
      </div>

      {/* Suppliers list */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Suppliers for this product
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            {showForm ? 'Cancel' : '+ Add Supplier'}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleAddSupplier} className="p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Supplier</label>
                <select
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value as Supplier })}
                  className="px-2 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                >
                  {SUPPLIERS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Supplier Product ID</label>
                <input value={form.supplier_product_id} onChange={(e) => setForm({ ...form, supplier_product_id: e.target.value })}
                  className="px-2 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Cost Price ($)</label>
                <input type="number" step="0.01" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                  className="px-2 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Sell Price ($) ×2.5</label>
                <input type="number" step="0.01" value={form.sell_price} onChange={(e) => setForm({ ...form, sell_price: e.target.value })}
                  className="px-2 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Compare-at ($) ×4</label>
                <input type="number" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })}
                  className="px-2 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Lead Time (days)</label>
                <input type="number" value={form.lead_time_days} onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })}
                  className="px-2 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs text-[var(--foreground-muted)]">Notes</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="px-2 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
            </div>
            <button type="submit" className="mt-3 px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity">
              Save Supplier
            </button>
          </form>
        )}

        {/* List */}
        {loading ? (
          <p className="p-6 text-sm text-[var(--foreground-muted)] text-center">Loading…</p>
        ) : suppliers.length === 0 ? (
          <p className="p-6 text-sm text-[var(--foreground-muted)] text-center">No suppliers assigned yet.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {suppliers.map((s) => (
              <div key={s.id} className={`p-4 flex items-start justify-between gap-4 ${s.is_active ? 'bg-[var(--success)]/5' : ''}`}>
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md flex-shrink-0 ${supplierColors[s.supplier] ?? 'bg-zinc-500/15 text-zinc-400'}`}>
                    {s.supplier.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Cost: ${Number(s.cost_price || 0).toFixed(2)}
                      {' · '}Sell: ${Number(s.sell_price || 0).toFixed(2)}
                      {s.compare_at_price ? ` · Compare: $${Number(s.compare_at_price).toFixed(2)}` : ''}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5 truncate">
                      {s.lead_time_days ? `${s.lead_time_days}d lead` : ''}
                      {s.supplier_product_id ? ` · ${s.supplier_product_id}` : ''}
                      {s.notes ? ` · ${s.notes}` : ''}
                    </p>
                    {s.is_active && (
                      <span className="text-xs text-[var(--success)] font-medium mt-1 block">✓ Active supplier</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!s.is_active && (
                    <button
                      onClick={() => handleSetActive(s.id, true)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)]/25 transition-colors"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(s.id, s.is_active)}
                    disabled={deletingId === s.id}
                    className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors disabled:opacity-40"
                    title="Delete supplier"
                  >
                    {deletingId === s.id ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
