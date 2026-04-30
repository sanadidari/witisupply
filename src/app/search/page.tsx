import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { searchProducts } from '@/lib/shopify/products';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : 'Search',
    description: `Search results for ${q} at WITI Supply.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const products = query ? await searchProducts(query) : [];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">Search</span>
        </nav>

        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[var(--foreground)] mb-2"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {query ? `Results for "${query}"` : 'Search Products'}
          </h1>
          {query && (
            <p className="text-sm text-[var(--foreground-muted)]">
              {products.length === 0
                ? 'No products found. Try a different search term.'
                : `${products.length} product${products.length === 1 ? '' : 's'} found`}
            </p>
          )}
        </div>

        {!query && (
          <div className="text-center py-24">
            <svg className="mx-auto mb-4 text-[var(--foreground-muted)] opacity-40" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-[var(--foreground-muted)] mb-4">Enter a search term to find products.</p>
            <Link href="/collections/cuisine-home" className="text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Browse all products →
            </Link>
          </div>
        )}

        {query && products.length === 0 && (
          <div className="text-center py-24">
            <svg className="mx-auto mb-4 text-[var(--foreground-muted)] opacity-40" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-[var(--foreground-muted)] mb-4">No results for &ldquo;{query}&rdquo;.</p>
            <Link href="/collections/cuisine-home" className="text-sm font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Browse all products →
            </Link>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
