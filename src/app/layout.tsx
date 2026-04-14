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
    default: 'WITI Supply — Premium Tech & Gadgets',
    template: '%s | WITI Supply',
  },
  description: 'Premium tech gadgets, drones, cameras, audio equipment and more. Free shipping on orders over $50.',
  metadataBase: new URL('https://witisupply.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://witisupply.com',
    siteName: 'WITI Supply',
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
