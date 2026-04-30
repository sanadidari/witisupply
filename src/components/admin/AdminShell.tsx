'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/orders', label: 'Orders', icon: '◫' },
  { href: '/admin/products', label: 'Products', icon: '⊞' },
  { href: '/admin/import', label: 'Import (CJ)', icon: '⊕' },
  { href: '/admin/suppliers', label: 'Suppliers', icon: '⊡' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-[var(--card)] border-r border-[var(--border)] flex flex-col fixed top-0 left-0 h-full z-30">
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">WITI Supply</p>
          <p className="text-sm font-bold text-[var(--foreground)] mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
          >
            <span>⎋</span>
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  );
}
