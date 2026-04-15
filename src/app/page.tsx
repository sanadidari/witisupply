import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts } from '@/lib/shopify/products';

export default async function Home() {
  const products = await getProducts(50);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
          Kitchen & Home Essentials
        </p>
        <h2
          className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-4"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Upgrade Your<br />
          <span style={{ color: 'var(--accent)' }}>Kitchen Game</span>
        </h2>
        <p className="text-[var(--foreground-muted)] text-lg max-w-xl mx-auto mb-8">
          Premium kitchen gadgets and home essentials — curated for modern American homes. Up to 60% off retail price.
        </p>
        <a
          href="#products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Shop Now
        </a>
      </section>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h3
          className="text-2xl font-bold text-[var(--foreground)] mb-8"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          All Products
        </h3>
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
    </main>
  );
}
