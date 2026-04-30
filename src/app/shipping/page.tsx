import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Learn about WITI Supply shipping times, rates, and delivery options.',
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">Shipping Policy</span>
        </nav>

        <h1
          className="text-3xl font-bold text-[var(--foreground)] mb-2"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Shipping Policy
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-10">Last updated: January 2025</p>

        <div className="flex flex-col gap-8 text-sm text-[var(--foreground-muted)] leading-relaxed">

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚚</span>
              <h2 className="text-base font-semibold text-[var(--foreground)]">Free Shipping</h2>
            </div>
            <p>All orders over <strong className="text-[var(--foreground)]">$50</strong> qualify for free standard shipping to any address in the contiguous United States. No promo code needed — the discount is applied automatically at checkout.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Processing Time</h2>
            <p>Orders are processed within <strong className="text-[var(--foreground)]">1–3 business days</strong> (Monday through Friday, excluding public holidays). You will receive a confirmation email once your order has been dispatched.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-4">Shipping Options & Estimated Delivery</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[var(--border)] rounded-xl overflow-hidden">
                <thead className="bg-[var(--background-secondary)]">
                  <tr>
                    <th className="text-left px-4 py-3 text-[var(--foreground)] font-semibold">Method</th>
                    <th className="text-left px-4 py-3 text-[var(--foreground)] font-semibold">Delivery Time</th>
                    <th className="text-left px-4 py-3 text-[var(--foreground)] font-semibold">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { method: 'Standard Shipping', time: '5–8 business days', cost: 'Free over $50 / $5.99 under' },
                    { method: 'Expedited Shipping', time: '2–4 business days', cost: '$12.99' },
                    { method: 'Express Shipping', time: '1–2 business days', cost: '$24.99' },
                  ].map((row, i) => (
                    <tr key={row.method} className={i % 2 === 0 ? '' : 'bg-[var(--background-secondary)]'}>
                      <td className="px-4 py-3 border-t border-[var(--border)] text-[var(--foreground)]">{row.method}</td>
                      <td className="px-4 py-3 border-t border-[var(--border)]">{row.time}</td>
                      <td className="px-4 py-3 border-t border-[var(--border)]">{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs">Delivery estimates begin after processing time and do not include weekends or holidays.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Shipping Destinations</h2>
            <p>We currently ship to all <strong className="text-[var(--foreground)]">50 US states</strong> including Alaska and Hawaii (additional fees may apply). We do not currently ship internationally.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Order Tracking</h2>
            <p>Once your order ships, you will receive a tracking number via email. You can use this number to track your package directly on the carrier&apos;s website. Please allow 24 hours for tracking information to become active.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Lost or Damaged Packages</h2>
            <p>If your package arrives damaged or is lost in transit, please contact us within <strong className="text-[var(--foreground)]">7 days</strong> of the expected delivery date. We will work with the carrier to resolve the issue and send a replacement or issue a full refund.</p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Questions?</h2>
            <p>Contact our support team at <a href="mailto:support@witisupply.com" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>support@witisupply.com</a> or visit our <Link href="/contact" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Contact page</Link>.</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
