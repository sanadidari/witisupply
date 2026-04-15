interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 48 };
  const px = sizes[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Icon mark */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background pill */}
        <rect width="36" height="36" rx="10" fill="var(--accent)" />

        {/* Flame / spark */}
        <path
          d="M18 8C18 8 13 13 13 18.5C13 21.538 15.239 24 18 24C20.761 24 23 21.538 23 18.5C23 15 20 13 20 13C20 13 20 16 18 17C18 17 16 15 18 8Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Small inner flame */}
        <path
          d="M18 16C18 16 16.5 17.5 16.5 19.2C16.5 20.4 17.1 21.3 18 21.3C18.9 21.3 19.5 20.4 19.5 19.2C19.5 17.5 18 16 18 16Z"
          fill="var(--accent)"
          fillOpacity="0.7"
        />
        {/* Bottom bar */}
        <rect x="13" y="26" width="10" height="2" rx="1" fill="white" fillOpacity="0.8" />
      </svg>

      {/* Wordmark */}
      <span
        className="font-bold tracking-tight text-[var(--foreground)]"
        style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.2rem' : '1.5rem',
          letterSpacing: '-0.02em',
        }}
      >
        WITI{' '}
        <span style={{ color: 'var(--accent)' }}>Supply</span>
      </span>
    </span>
  );
}
