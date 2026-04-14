import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts } from '@/lib/shopify/products';

export default async function Home() {
  const products = await getProducts(50);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1
            className="text-xl font-bold tracking-tight text-[var(--foreground)]"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            WITI Supply
          </h1>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--foreground-muted)]">
              <a href="#" className="hover:text-[var(--foreground)] transition-colors">Products</a>
              <a href="#" className="hover:text-[var(--foreground)] transition-colors">Collections</a>
              <a href="#" className="hover:text-[var(--foreground)] transition-colors">About</a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2
          className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-4"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Premium Tech &<br />
          <span style={{ color: 'var(--accent)' }}>Modern Gadgets</span>
        </h2>
        <p className="text-[var(--foreground-muted)] text-lg max-w-xl mx-auto mb-8">
          Curated tech products for creators, professionals, and enthusiasts. Free shipping on orders over $50.
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
