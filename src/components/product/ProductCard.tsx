import Image from 'next/image';
import Link from 'next/link';
import type { ShopifyProduct } from '@/lib/shopify/products';

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const inStock = product.variants.edges[0]?.node.availableForSale;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col rounded-xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden hover:border-[var(--accent)] transition-all duration-200 hover:shadow-lg"
    >
      <div className="relative aspect-square bg-[var(--background-secondary)] overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
        {!inStock && (
          <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-[var(--danger)] text-white rounded-md">
            Out of stock
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-medium text-[var(--foreground)] text-sm leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-[var(--foreground)]">
            ${price.toFixed(2)}
            <span className="text-xs font-normal text-[var(--foreground-muted)] ml-1">{currency}</span>
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${inStock ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-[var(--foreground-muted)]/15 text-[var(--foreground-muted)]'}`}>
            {inStock ? 'In stock' : 'Sold out'}
          </span>
        </div>
      </div>
    </Link>
  );
}
