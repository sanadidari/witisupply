import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts } from '@/lib/shopify/products';

export default async function Home() {
  const products = await getProducts(50);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient bg */}
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
            <span style={{ color: 'var(--accent)' }}>You'll Actually Use</span>
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

      {/* Feature strips */}
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

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <p className="font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                WITI Supply
              </p>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Premium kitchen & home essentials, curated for modern American homes.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">Shop</p>
              <ul className="flex flex-col gap-2 text-sm text-[var(--foreground-muted)]">
                <li><Link href="/collections/cuisine-home" className="hover:text-[var(--foreground)] transition-colors">Kitchen & Home</Link></li>
                <li><Link href="/collections/cuisine-home?sort=newest" className="hover:text-[var(--foreground)] transition-colors">New Arrivals</Link></li>
                <li><Link href="/collections/cuisine-home?sort=best-selling" className="hover:text-[var(--foreground)] transition-colors">Best Sellers</Link></li>
                <li><Link href="/collections/cuisine-home?sort=price-asc" className="hover:text-[var(--foreground)] transition-colors">Price: Low to High</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">Help</p>
              <ul className="flex flex-col gap-2 text-sm text-[var(--foreground-muted)]">
                <li><span className="cursor-default">Shipping Policy</span></li>
                <li><span className="cursor-default">Return Policy</span></li>
                <li><span className="cursor-default">Contact Us</span></li>
                <li><span className="cursor-default">FAQ</span></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">Follow</p>
              <ul className="flex flex-col gap-2 text-sm text-[var(--foreground-muted)]">
                <li><span className="cursor-default">Pinterest</span></li>
                <li><span className="cursor-default">Instagram</span></li>
                <li><span className="cursor-default">TikTok</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--foreground-muted)]">
            <p>© {new Date().getFullYear()} WITI Supply. All rights reserved.</p>
            <p>Powered by Shopify</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
