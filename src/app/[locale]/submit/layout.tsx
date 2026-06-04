import type { Metadata } from 'next';
import type { Locale } from '@/types';

const locales: Locale[] = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const metadataByLocale: Record<Locale, Metadata> = {
  en: {
    title: 'Submit a Resource',
    description:
      'Recommend a great SVG resource site to SVGShip. Help the community discover the best icon libraries, illustration tools, and SVG learning resources.',
    openGraph: {
      title: 'Submit a Resource — SVGShip',
      description:
        'Recommend a great SVG resource site to SVGShip and help the community discover it.',
      url: 'https://svgship.com/en/submit',
      siteName: 'SVGShip',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image',
          width: 1200,
          height: 630,
          alt: 'Submit a Resource to SVGShip',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Submit a Resource — SVGShip',
      description: 'Recommend a great SVG resource site to the community.',
      images: ['/og-image'],
    },
    alternates: {
      canonical: 'https://svgship.com/en/submit',
      languages: {
        en: 'https://svgship.com/en/submit',
        zh: 'https://svgship.com/zh/submit',
      },
    },
  },
  zh: {
    title: '提交资源',
    description:
      '向 SVGShip 推荐优质的 SVG 资源网站，帮助社区发现更多优秀图标库、插画工具和 SVG 学习资源。',
    openGraph: {
      title: '提交资源 — SVGShip',
      description: '向 SVGShip 推荐优质的 SVG 资源网站，帮助更多人发现优秀工具。',
      url: 'https://svgship.com/zh/submit',
      siteName: 'SVGShip',
      locale: 'zh_CN',
      type: 'website',
      images: [
        {
          url: '/og-image',
          width: 1200,
          height: 630,
          alt: '向 SVGShip 提交资源',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '提交资源 — SVGShip',
      description: '推荐优质 SVG 资源，帮助社区发现优秀站点。',
      images: ['/og-image'],
    },
    alternates: {
      canonical: 'https://svgship.com/zh/submit',
      languages: {
        en: 'https://svgship.com/en/submit',
        zh: 'https://svgship.com/zh/submit',
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

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
