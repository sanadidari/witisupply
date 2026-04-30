import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Return Policy',
  description: 'WITI Supply 30-day return policy — hassle-free returns and refunds.',
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">Return Policy</span>
        </nav>

        <h1
          className="text-3xl font-bold text-[var(--foreground)] mb-2"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Return Policy
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-10">Last updated: January 2025</p>

        <div className="flex flex-col gap-8 text-sm text-[var(--foreground-muted)] leading-relaxed">

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">↩</span>
              <h2 className="text-base font-semibold text-[var(--foreground)]">30-Day Returns</h2>
            </div>
            <p>We offer a <strong className="text-[var(--foreground)]">30-day return window</strong> from the date of delivery. If you are not completely satisfied with your purchase, we will make it right — no questions asked.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Eligibility</h2>
            <p className="mb-3">To be eligible for a return, your item must be:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                'In the same condition that you received it',
                'Unused and in its original packaging',
                'Returned within 30 days of the delivery date',
                'Accompanied by the original receipt or proof of purchase',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Non-Returnable Items</h2>
            <p className="mb-3">The following items cannot be returned:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                'Items that have been used, opened, or damaged by the customer',
                'Items returned more than 30 days after delivery',
                'Perishable goods or consumables',
                'Items marked as "Final Sale" at the time of purchase',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0 text-red-400 flex-shrink-0">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">How to Start a Return</h2>
            <ol className="flex flex-col gap-3 pl-4">
              {[
                { step: '1.', text: 'Email us at support@witisupply.com with your order number and reason for return.' },
                { step: '2.', text: 'We will send you a prepaid return shipping label within 1–2 business days.' },
                { step: '3.', text: 'Package the item securely in its original packaging and attach the label.' },
                { step: '4.', text: 'Drop it off at any authorized carrier location.' },
                { step: '5.', text: 'Once we receive and inspect the item, your refund will be processed within 3–5 business days.' },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="font-bold text-[var(--foreground)] flex-shrink-0" style={{ color: 'var(--accent)' }}>{item.step}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Refunds</h2>
            <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be automatically applied to your original payment method within <strong className="text-[var(--foreground)]">3–5 business days</strong>. Please note that your bank may take additional time to process the refund.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">Exchanges</h2>
            <p>If you received a defective or damaged item, we will send a replacement at no extra cost. Contact us at <a href="mailto:support@witisupply.com" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>support@witisupply.com</a> within 7 days of delivery with a photo of the damage.</p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
            <h2 className="text-base font-semibold text-[var(--foreground)] mb-2">Need help?</h2>
            <p>Contact us at <a href="mailto:support@witisupply.com" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>support@witisupply.com</a> or visit our <Link href="/contact" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Contact page</Link>.</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
