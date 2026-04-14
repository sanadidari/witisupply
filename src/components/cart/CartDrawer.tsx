'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { cart, loading, updateItem, removeItem } = useCart();
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const total = cart?.cost.totalAmount;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--card)] border-l border-[var(--border)] z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Your Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ''}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--foreground-muted)] gap-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            lines.map((line) => {
              const image = line.merchandise.product.images.edges[0]?.node;
              const linePrice = parseFloat(line.merchandise.price.amount) * line.quantity;
              return (
                <div key={line.id} className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--background-secondary)]">
                    {image && (
                      <Image
                        src={image.url}
                        alt={image.altText || line.merchandise.product.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] leading-tight line-clamp-2">
                      {line.merchandise.product.title}
                    </p>
                    {line.merchandise.title !== 'Default Title' && (
                      <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{line.merchandise.title}</p>
                    )}
                    <p className="text-sm font-bold text-[var(--foreground)] mt-1">
                      ${linePrice.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => line.quantity > 1 ? updateItem(line.id, line.quantity - 1) : removeItem(line.id)}
                        disabled={loading}
                        className="w-7 h-7 rounded-md border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center hover:border-[var(--accent)] transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-[var(--foreground)] w-4 text-center">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        disabled={loading}
                        className="w-7 h-7 rounded-md border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center hover:border-[var(--accent)] transition-colors text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(line.id)}
                        disabled={loading}
                        className="ml-auto text-[var(--foreground-muted)] hover:text-[var(--danger)] transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">Subtotal</span>
              <span className="text-lg font-bold text-[var(--foreground)]">
                ${parseFloat(total?.amount ?? '0').toFixed(2)}
                <span className="text-xs font-normal text-[var(--foreground-muted)] ml-1">{total?.currencyCode}</span>
              </span>
            </div>
            <a
              href={cart?.checkoutUrl}
              className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-semibold text-center hover:opacity-90 transition-opacity"
            >
              Checkout →
            </a>
            <p className="text-xs text-[var(--foreground-muted)] text-center">
              Secure checkout powered by Shopify
            </p>
          </div>
        )}
      </div>
    </>
  );
}
