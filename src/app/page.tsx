import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { TestimonialsSection } from '@/components/ui/TestimonialsSection';
import { NewsletterSection } from '@/components/ui/NewsletterSection';
import { getProducts } from '@/lib/shopify/products';

export default async function Home() {
  const products = await getProducts(50);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--accent) 12%, transparent), transparent)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center relative">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              color: 'var(--accent)',
              borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
              background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            }}
          >
            🔥 Up to 60% off retail price
          </span>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] mb-5 leading-[1.05]"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Kitchen Gadgets<br />
            <span style={{ color: 'var(--accent)' }}>You&apos;ll Actually Use</span>
          </h1>

          <p className="text-[var(--foreground-muted)] text-lg max-w-xl mx-auto mb-10">
            Premium kitchen & home essentials — curated for modern American homes. Free shipping on orders over $50.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/collections/cuisine-home"
              className="px-7 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Shop Collection
            </Link>
            <a
              href="#products"
              className="px-7 py-3.5 rounded-xl font-semibold border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
            >
              Browse All
            </a>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto border-t border-[var(--border)] pt-8">
            {[
              { value: '5,000+', label: 'Happy customers' },
              { value: '60%', label: 'Off retail price' },
              { value: 'Free', label: 'Shipping $50+' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}>
                  {stat.value}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-[var(--foreground-muted)]">
            {[
              { icon: '🚚', text: 'Free shipping on $50+' },
              { icon: '↩', text: '30-day easy returns' },
              { icon: '🔒', text: 'Secure checkout' },
              { icon: '⚡', text: 'Fast processing' },
            ].map((f) => (
              <span key={f.text} className="flex items-center gap-2">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="text-2xl font-bold text-[var(--foreground)]"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              All Products
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">{products.length} items</p>
          </div>
          <Link
            href="/collections/cuisine-home?sort=newest"
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-[var(--foreground-muted)] text-center py-16">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />

      <Footer />
    </main>
  );
}
