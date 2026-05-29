import type { Metadata } from 'next';
import type { Locale } from '@/types';

const locales: Locale[] = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const metadataByLocale: Record<Locale, Metadata> = {
  en: {
    title: 'About',
    description:
      'Learn about SVGShip — your go-to directory for discovering the best free SVG resources including icons, illustrations, vector graphics, and animations.',
    openGraph: {
      title: 'About SVGShip',
      description:
        'Learn about SVGShip — your go-to directory for discovering the best free SVG resources.',
      url: 'https://svgship.com/en/about',
      siteName: 'SVGShip',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image',
          width: 1200,
          height: 630,
          alt: 'About SVGShip',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About SVGShip',
      description:
        'Learn about SVGShip — your go-to directory for discovering the best free SVG resources.',
      images: ['/og-image'],
    },
    alternates: {
      canonical: 'https://svgship.com/en/about',
      languages: {
        en: 'https://svgship.com/en/about',
        zh: 'https://svgship.com/zh/about',
      },
    },
  },
  zh: {
    title: '关于我们',
    description:
      '了解 SVGShip — 您发现最佳免费 SVG 资源的首选目录，包括图标、插画、矢量图形和动画。',
    openGraph: {
      title: '关于 SVGShip',
      description: '了解 SVGShip — 您发现最佳免费 SVG 资源的首选目录。',
      url: 'https://svgship.com/zh/about',
      siteName: 'SVGShip',
      locale: 'zh_CN',
      type: 'website',
      images: [
        {
          url: '/og-image',
          width: 1200,
          height: 630,
          alt: '关于 SVGShip',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '关于 SVGShip',
      description: '了解 SVGShip — 您发现最佳免费 SVG 资源的首选目录。',
      images: ['/og-image'],
    },
    alternates: {
      canonical: 'https://svgship.com/zh/about',
      languages: {
        en: 'https://svgship.com/en/about',
        zh: 'https://svgship.com/zh/about',
      },
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataByLocale[locale as Locale] ?? metadataByLocale.en;
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
