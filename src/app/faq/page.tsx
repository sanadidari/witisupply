'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const faqs = [
  {
    category: 'Shipping',
    items: [
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! All orders over $50 qualify for free standard shipping anywhere in the contiguous United States. The discount is applied automatically at checkout.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Orders are processed within 1–3 business days. Standard shipping takes 5–8 business days after processing. Expedited (2–4 days) and Express (1–2 days) options are also available at checkout.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently we ship to all 50 US states only. International shipping is something we plan to add in the future — subscribe to our newsletter to be notified.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order ships, you will receive a confirmation email with a tracking number. Allow up to 24 hours for tracking information to become active on the carrier\'s website.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return window from the date of delivery. Items must be unused, in their original packaging, and accompanied by your order receipt.',
      },
      {
        q: 'How do I start a return?',
        a: 'Email support@witisupply.com with your order number and reason for return. We\'ll send a prepaid return label within 1–2 business days.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Once we receive and inspect your return, refunds are processed within 3–5 business days to your original payment method. Your bank may take additional time to reflect the credit.',
      },
      {
        q: 'My item arrived damaged — what do I do?',
        a: 'Please email us at support@witisupply.com within 7 days of delivery with a photo of the damage. We\'ll send a replacement or issue a full refund immediately.',
      },
    ],
  },
  {
    category: 'Orders & Payments',
    items: [
      {
        q: 'Can I cancel or change my order?',
        a: 'Orders can be cancelled or modified within 24 hours of placement. After that, the order may already be processing. Contact us as soon as possible at support@witisupply.com.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay via our secure Shopify checkout.',
      },
      {
        q: 'Is your checkout secure?',
        a: 'Yes. All transactions are processed through Shopify\'s SSL-encrypted checkout. We never store your payment information on our servers.',
      },
      {
        q: 'Do you have discount codes or promotions?',
        a: 'Yes! Subscribe to our newsletter to receive exclusive member discounts and be the first to know about flash sales. We also run seasonal promotions.',
      },
    ],
  },
  {
    category: 'Products',
    items: [
      {
        q: 'Are your products genuine?',
        a: 'All products sold on WITI Supply are carefully sourced and quality-checked before being listed. We only work with reputable suppliers and manufacturers.',
      },
      {
        q: 'Do the products come with a warranty?',
        a: 'Most products include a manufacturer\'s warranty. Warranty terms vary by product — check the product description for specific details, or contact us for more information.',
      },
      {
        q: 'Why are your prices so low?',
        a: 'We source directly from manufacturers and suppliers, cutting out the middlemen. This allows us to offer premium products at prices up to 60% below typical retail.',
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
      >
        <span>{q}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <p className="pb-4 text-sm text-[var(--foreground-muted)] leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">FAQ</span>
        </nav>

        <h1
          className="text-3xl font-bold text-[var(--foreground)] mb-2"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-10">
          Can&apos;t find your answer? <Link href="/contact" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Contact us</Link>.
        </p>

        <div className="flex flex-col gap-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2
                className="text-base font-bold text-[var(--foreground)] mb-1 pb-3 border-b border-[var(--border)]"
                style={{ color: 'var(--accent)' }}
              >
                {section.category}
              </h2>
              <div>
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] text-center">
          <p className="text-sm font-semibold text-[var(--foreground)] mb-1">Still have questions?</p>
          <p className="text-xs text-[var(--foreground-muted)] mb-4">Our support team typically replies within 24 hours.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Contact Support
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
