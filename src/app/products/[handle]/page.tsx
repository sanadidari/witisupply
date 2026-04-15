import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { Header } from '@/components/layout/Header';

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);
  const firstAvailableVariant = variants.find((v) => v.availableForSale) ?? variants[0];
  const inStock = variants.some((v) => v.availableForSale);
  const price = parseFloat(firstAvailableVariant?.price?.amount ?? product.priceRange.minVariantPrice.amount);
  const compareAt = firstAvailableVariant?.compareAtPrice
    ? parseFloat(firstAvailableVariant.compareAtPrice.amount)
    : null;
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const discountPct = compareAt && compareAt > price
    ? Math.round((1 - price / compareAt) * 100)
    : null;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ProductGallery images={images} title={product.title} />

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1
                className="text-3xl font-bold text-[var(--foreground)] leading-tight mb-3"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {product.title}
              </h1>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-[var(--foreground)]">
                    ${price.toFixed(2)}
                    <span className="text-base font-normal text-[var(--foreground-muted)] ml-1">{currency}</span>
                  </span>
                  {compareAt && compareAt > price && (
                    <span className="text-xl text-[var(--foreground-muted)] line-through">
                      ${compareAt.toFixed(2)}
                    </span>
                  )}
                  {discountPct && (
                    <span className="px-2 py-1 text-sm font-bold bg-[var(--danger)] text-white rounded-md">
                      -{discountPct}%
                    </span>
                  )}
                </div>
                {discountPct && compareAt && (
                  <p className="text-sm text-[var(--success)] font-medium">
                    You save ${(compareAt - price).toFixed(2)} — Limited time offer
                  </p>
                )}
                <span className={`self-start text-sm px-3 py-1 rounded-full font-medium ${
                  inStock
                    ? 'bg-[var(--success)]/15 text-[var(--success)]'
                    : 'bg-[var(--danger)]/15 text-[var(--danger)]'
                }`}>
                  {inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Variants */}
            {variants.length > 1 && (
              <div>
                <p className="text-sm font-medium text-[var(--foreground-muted)] mb-2">Options</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      disabled={!variant.availableForSale}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                        variant.id === firstAvailableVariant?.id
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                          : variant.availableForSale
                          ? 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]'
                          : 'border-[var(--border)] text-[var(--foreground-muted)] opacity-40 cursor-not-allowed line-through'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton
              variantId={firstAvailableVariant?.id ?? ''}
              inStock={inStock}
            />

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-[var(--border)]">
                <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider">
                  Description
                </h2>
                <div
                  className="text-sm text-[var(--foreground-muted)] leading-relaxed prose-sm"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
