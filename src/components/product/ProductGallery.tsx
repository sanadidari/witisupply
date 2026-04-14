'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageNode {
  url: string;
  altText: string | null;
}

export function ProductGallery({ images, title }: { images: ImageNode[]; title: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-[var(--background-secondary)] flex items-center justify-center text-[var(--foreground-muted)]">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-xl bg-[var(--background-secondary)] overflow-hidden">
        <Image
          src={images[selected].url}
          alt={images[selected].altText || title}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setSelected(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === selected
                  ? 'border-[var(--accent)]'
                  : 'border-[var(--border)] hover:border-[var(--accent)]/50'
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} ${i + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
