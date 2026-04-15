import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeProvider';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WITI Supply — Kitchen & Home Essentials',
    template: '%s | WITI Supply',
  },
  description: 'Discover premium kitchen gadgets and home essentials at unbeatable prices. Air fryers, cookware, appliances and more. Free shipping available.',
  metadataBase: new URL('https://witisupply.com'),
  keywords: ['kitchen gadgets', 'air fryer', 'home essentials', 'cookware', 'kitchen appliances', 'dropshipping'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://witisupply.com',
    siteName: 'WITI Supply',
    title: 'WITI Supply — Kitchen & Home Essentials',
    description: 'Premium kitchen gadgets and home essentials at unbeatable prices.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@witisupply',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
