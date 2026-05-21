import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SVGShip — Free SVG Tools & Templates for Cricut',
    template: '%s | SVGShip',
  },
  description:
    'Free browser-based SVG tools: optimize, convert PNG to SVG, SVG to PNG, remove backgrounds. Plus 50+ free SVG templates for Cricut cutting machines.',
  keywords: ['SVG', 'Cricut', 'free SVG files', 'SVG converter', 'PNG to SVG', 'SVG optimizer'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
