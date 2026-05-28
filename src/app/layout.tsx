import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
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
  title: {
    default: 'SVGShip — Professional SVG Resource Directory',
    template: '%s | SVGShip',
  },
  description:
    'Curated collection of the best SVG resources — free icon libraries, illustrations, vector materials, and SVG animations for designers and developers.',
  keywords: [
    'SVG',
    'SVG icons',
    'SVG illustrations',
    'vector graphics',
    'SVG animations',
    'free icons',
    'design resources',
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
