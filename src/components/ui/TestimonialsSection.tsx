const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Austin, TX',
    rating: 5,
    text: 'The air fryer I ordered arrived in 3 days and works perfectly. Saved over $60 compared to what I saw at retail. Packaging was great too.',
    initials: 'SM',
  },
  {
    name: 'James R.',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Amazing quality at unbeatable prices. My new cookware set is fantastic. The free shipping over $50 made the deal even sweeter.',
    initials: 'JR',
  },
  {
    name: 'Maria L.',
    location: 'Miami, FL',
    rating: 4,
    text: 'Fast shipping and the product was exactly as described. Will definitely order again — already recommended WITI Supply to my sister.',
    initials: 'ML',
  },
  {
    name: 'David K.',
    location: 'Seattle, WA',
    rating: 5,
    text: 'Best prices I\'ve found online for kitchen gadgets. Everything came well packaged and the quality exceeded my expectations for the price.',
    initials: 'DK',
  },
  {
    name: 'Emma T.',
    location: 'New York, NY',
    rating: 5,
    text: 'Love my new kitchen gadgets! The blender I bought works like a charm and looks great on my counter. Super happy with this purchase.',
    initials: 'ET',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: '#f59e0b' }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
            style={{
              color: 'var(--accent)',
              borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
              background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            }}
          >
            Customer reviews
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            5,000+ happy customers
          </h2>
          <p className="text-sm text-[var(--foreground-muted)] mt-2">
            Real reviews from real customers across the US
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, 3).map((t) => (
            <div
              key={t.name}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] flex flex-col gap-3"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground)]">{t.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{t.location}</p>
                </div>
                <svg
                  className="ml-auto text-[var(--foreground-muted)] opacity-30"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-w-2xl mx-auto">
          {testimonials.slice(3).map((t) => (
            <div
              key={t.name}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] flex flex-col gap-3"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground)]">{t.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-10 py-6 border-t border-[var(--border)]">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}>4.8/5</p>
            <p className="text-xs text-[var(--foreground-muted)]">Average rating</p>
          </div>
          <div className="w-px h-10 bg-[var(--border)]" />
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}>5,000+</p>
            <p className="text-xs text-[var(--foreground-muted)]">Happy customers</p>
          </div>
          <div className="w-px h-10 bg-[var(--border)]" />
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-space-grotesk)' }}>98%</p>
            <p className="text-xs text-[var(--foreground-muted)]">Would recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
}
