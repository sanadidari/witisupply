'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Cart } from '@/lib/shopify/cart';
import { createCart, addToCart, updateCartLine, removeCartLine, getCart } from '@/lib/shopify/cart';

const CART_ID_KEY = 'witi_cart_id';

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
    getCart(cartId).then((c) => {
      if (c) setCart(c);
      else localStorage.removeItem(CART_ID_KEY);
    });
  }, []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      const cartId = localStorage.getItem(CART_ID_KEY);
      let updated: Cart;
      if (cartId) {
        updated = await addToCart(cartId, variantId, quantity);
      } else {
        updated = await createCart(variantId, quantity);
        localStorage.setItem(CART_ID_KEY, updated.id);
      }
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await updateCartLine(cart.id, lineId, quantity);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;
    setLoading(true);
    try {
      const updated = await removeCartLine(cart.id, lineId);
      setCart(updated);
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
