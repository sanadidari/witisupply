'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass = "w-full px-4 py-3 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">Contact</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h1
                className="text-3xl font-bold text-[var(--foreground)] mb-2"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Contact Us
              </h1>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                Have a question about an order or product? We&apos;re here to help. Our team typically responds within 24 hours.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: 'Email',
                  value: 'support@witisupply.com',
                  href: 'mailto:support@witisupply.com',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  label: 'Response Time',
                  value: 'Within 24 hours',
                  href: null,
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  ),
                  label: 'Support Hours',
                  value: 'Mon–Fri, 9am–6pm ET',
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }}>{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm text-[var(--foreground-muted)]">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]">
              <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-2">Quick Links</p>
              <div className="flex flex-col gap-1.5">
                <Link href="/faq" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">→ FAQ</Link>
                <Link href="/shipping" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">→ Shipping Policy</Link>
                <Link href="/returns" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">→ Return Policy</Link>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  Message sent!
                </h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
                <h2 className="text-base font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  Send us a message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">Subject</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select a topic...</option>
                    <option value="order">Order status / tracking</option>
                    <option value="return">Return or refund</option>
                    <option value="product">Product question</option>
                    <option value="shipping">Shipping issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your issue or question..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-500">Something went wrong. Please try again or email us directly.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
