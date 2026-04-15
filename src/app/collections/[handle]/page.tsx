import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { ProductCard } from '@/components/product/ProductCard';
import { getProductsSorted, type SortKey } from '@/lib/shopify/products';
import Link from 'next/link';

interface Props {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
}

const COLLECTION_LABELS: Record<string, { title: string; description: string }> = {
  'cuisine-home': {
    title: 'Kitchen & Home Essentials',
    description: 'Discover our full range of premium kitchen gadgets and home essentials — air fryers, cookware, appliances, and more.',
  },
  'air-fryers': {
    title: 'Air Fryers',
    description: 'Shop the best air fryers at unbeatable prices. Crispy results, less oil, faster cooking.',
  },
  'cookware': {
    title: 'Cookware & Bakeware',
    description: 'Premium pots, pans, and baking tools for the modern kitchen.',
  },
};

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured', key: 'MANUAL' as SortKey, reverse: false },
  { label: 'Best Selling', value: 'best-selling', key: 'BEST_SELLING' as SortKey, reverse: false },
  { label: 'Newest', value: 'newest', key: 'CREATED_AT' as SortKey, reverse: true },
  { label: 'Price: Low to High', value: 'price-asc', key: 'PRICE' as SortKey, reverse: false },
  { label: 'Price: High to Low', value: 'price-desc', key: 'PRICE' as SortKey, reverse: true },
  { label: 'A–Z', value: 'title-asc', key: 'TITLE' as SortKey, reverse: false },
];

function getSortParams(sort?: string) {
  const option = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];
  return { key: option.key, reverse: option.reverse, label: option.label };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = COLLECTION_LABELS[handle] ?? {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Shop our ${handle.replace(/-/g, ' ')} collection at WITI Supply.`,
  };

  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | WITI Supply`,
      description: collection.description,
      type: 'website',
      url: `https://witisupply.com/collections/${handle}`,
    },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { sort } = await searchParams;

  const { key, reverse } = getSortParams(sort);
  const products = await getProductsSorted(key, reverse, 100);

  const collection = COLLECTION_LABELS[handle] ?? {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: '',
  };

  const currentSort = sort ?? 'featured';

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{collection.title}</span>
        </nav>

        {/* Collection header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[var(--foreground)] mb-2"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-[var(--foreground-muted)] text-sm max-w-2xl">
              {collection.description}
            </p>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">
            <span className="font-semibold text-[var(--foreground)]">{products.length}</span> products
          </p>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--foreground-muted)] hidden sm:block">Sort by</span>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={`/collections/${handle}?sort=${opt.value}`}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    currentSort === opt.value
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                      : 'border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)]'
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[var(--foreground-muted)] text-lg mb-4">No products found.</p>
            <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
              ← Back to all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
