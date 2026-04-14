'use client';

import { useState } from 'react';

interface Props {
  variantId: string;
  inStock: boolean;
}

export function AddToCartButton({ variantId, inStock }: Props) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (!inStock || !variantId || adding) return;
    setAdding(true);
    // Cart logic coming next
    await new Promise((r) => setTimeout(r, 600));
    setAdded(true);
    setAdding(false);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!inStock || adding}
      className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
        !inStock
          ? 'bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)] cursor-not-allowed'
          : added
          ? 'bg-[var(--success)] text-white'
          : 'bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98]'
      }`}
    >
      {!inStock ? 'Out of Stock' : adding ? 'Adding…' : added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
