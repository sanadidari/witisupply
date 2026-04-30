'use client';

import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section
      className="py-16 px-4 sm:px-6"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 100%, color-mix(in srgb, var(--accent) 10%, transparent), transparent)',
      }}
    >
      <div className="max-w-xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
          style={{
            color: 'var(--accent)',
            borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
            background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
          }}
        >
          Stay in the loop
        </span>

        <h2
          className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-3"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Get exclusive deals first
        </h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-8">
          Subscribe and be the first to know about flash sales, new arrivals, and members-only discounts.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl border"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
              background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: 'var(--accent)' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              You&apos;re subscribed! Check your inbox for a welcome offer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-xs text-red-500">{errorMsg}</p>
        )}

        <p className="mt-4 text-xs text-[var(--foreground-muted)]">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
