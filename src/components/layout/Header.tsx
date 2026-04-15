'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCart } from '@/context/CartContext';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalQuantity } = useCart();

  return (
    <>
      <header className="border-b border-[var(--border)] sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="WITI Supply home">
            <Logo size="sm" />
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--foreground-muted)]">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
              <Link href="/collections/cuisine-home" className="hover:text-[var(--foreground)] transition-colors">Kitchen & Home</Link>
            </nav>

            <ThemeToggle />

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors p-1"
              aria-label="Open cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
