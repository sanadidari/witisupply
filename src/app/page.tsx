import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1
          className="text-5xl font-bold tracking-tight text-[var(--foreground)]"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          WITI Supply
        </h1>
        <p className="text-[var(--foreground-muted)] text-lg max-w-md">
          Premium tech gadgets for the modern world.
        </p>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-[var(--foreground-muted)]">
        {['Next.js 14 App Router', 'Dark / Light mode', 'Shopify Storefront API', 'Custom Admin Panel'].map((item) => (
          <div key={item} className="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] text-center">
            {item}
          </div>
        ))}
      </div>
    </main>
  );
}
