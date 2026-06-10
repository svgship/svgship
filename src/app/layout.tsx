import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.svgship.com'),
  title: {
    default:
      'SVGShip — Professional SVG Resource Directory | Free Icons, Illustrations & Animations',
    template: '%s | SVGShip',
  },
  description:
    'Discover the best free SVG resources: icon libraries, illustrations, vector graphics, and SVG animations. Curated collection for designers and developers — searchable, filterable, always up-to-date.',

  icons: {
    icon: '/logo-favicon.svg',
    shortcut: '/logo-favicon.svg',
    apple: '/logo-favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          defer
          src="https://umami.scorp.fun/script.js"
          data-website-id="f5b6d0ba-8ebf-4705-ad75-62337f6b0d38"
          strategy="afterInteractive"
        />
      </head>
      <body className="flex min-h-full flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>
        {/* Cursor glow is rendered via client component in page */}
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
