'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Cart } from '@/lib/shopify/cart';

const CART_ID_KEY = 'witi_cart_id';

async function cartApi(body: Record<string, unknown>): Promise<Cart> {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Cart API error ${res.status}`);
  }
  return res.json();
}

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  totalQuantity: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  // Load existing cart on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    cartApi({ action: 'get', cartId })
      .then(setCart)
      .catch(() => localStorage.removeItem(CART_ID_KEY));
  }, []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      const cartId = localStorage.getItem(CART_ID_KEY);
      let updated: Cart;
      if (cartId) {
        updated = await cartApi({ action: 'add', cartId, variantId, quantity });
      } else {
        updated = await cartApi({ action: 'create', variantId, quantity });
        localStorage.setItem(CART_ID_KEY, updated.id);
      }
      setCart(updated);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await cartApi({ action: 'update', cartId: cart.id, lineId, quantity });
      setCart(updated);
    } catch (err) {
      console.error('Update cart failed:', err);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await cartApi({ action: 'remove', cartId: cart.id, lineId });
      setCart(updated);
    } catch (err) {
      console.error('Remove from cart failed:', err);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addItem,
      updateItem,
      removeItem,
      totalQuantity: cart?.totalQuantity ?? 0,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
