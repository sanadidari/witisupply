'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface Props {
  variantId: string;
  inStock: boolean;
}

export function AddToCartButton({ variantId, inStock }: Props) {
  const { addItem, loading } = useCart();
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (!inStock || !variantId || loading) return;
    await addItem(variantId);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!inStock || loading}
      className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
        !inStock
          ? 'bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)] cursor-not-allowed'
          : added
          ? 'bg-[var(--success)] text-white'
          : loading
          ? 'bg-[var(--accent)]/70 text-white cursor-wait'
          : 'bg-[var(--accent)] text-white hover:opacity-90 active:scale-[0.98]'
      }`}
    >
      {!inStock ? 'Out of Stock' : loading ? 'Adding…' : added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
