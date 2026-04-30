'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-[72px] h-8 rounded-full border border-[var(--border)] bg-[var(--background-secondary)]" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center w-[72px] h-8 rounded-full border border-[var(--border)] bg-[var(--background-secondary)] p-0.5 transition-colors hover:border-[var(--accent)]"
    >
      {/* Sliding pill */}
      <span
        className="absolute w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
        style={{
          left: isDark ? 'calc(100% - 1.875rem)' : '0.125rem',
          background: 'var(--accent)',
          color: 'white',
        }}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>

      {/* Background icons */}
      <span
        className="flex items-center justify-center w-7 h-7 transition-opacity duration-300"
        style={{ opacity: isDark ? 0.3 : 0, color: 'var(--foreground-muted)' }}
      >
        <SunIcon />
      </span>
      <span
        className="flex items-center justify-center w-7 h-7 ml-auto transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 0.3, color: 'var(--foreground-muted)' }}
      >
        <MoonIcon />
      </span>
    </button>
  );
}
