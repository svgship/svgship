import type { Metadata } from 'next';
import { I18nProvider } from '@/lib/i18n/context';
import type { Locale } from '@/types';

const locales: Locale[] = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const metadataByLocale: Record<Locale, Metadata> = {
  en: {
    title: 'SVGShip — Professional SVG Resource Directory',
    description:
      'Curated collection of the best SVG resources — free icon libraries, illustrations, vector materials, and SVG animations for designers and developers.',
    openGraph: {
      title: 'SVGShip — Professional SVG Resource Directory',
      description:
        'Curated collection of the best SVG resources — free icon libraries, illustrations, vector materials, and SVG animations.',
      url: 'https://svgship.com/en',
      siteName: 'SVGShip',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SVGShip — Professional SVG Resource Directory',
      description:
        'Curated collection of the best SVG resources — icons, illustrations, vectors, and animations.',
    },
    alternates: {
      canonical: 'https://svgship.com/en',
      languages: {
        en: 'https://svgship.com/en',
        zh: 'https://svgship.com/zh',
      },
    },
  },
  zh: {
    title: 'SVGShip — 专业 SVG 资源导航',
    description:
      '精选优质 SVG 资源合集 — 图标库、插画、矢量素材、SVG 动画，为设计师和开发者提供一站式 SVG 资源导航。',
    openGraph: {
      title: 'SVGShip — 专业 SVG 资源导航',
      description: '精选优质 SVG 资源合集 — 图标库、插画、矢量素材、SVG 动画。',
      url: 'https://svgship.com/zh',
      siteName: 'SVGShip',
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SVGShip — 专业 SVG 资源导航',
      description: '精选优质 SVG 资源合集 — 图标库、插画、矢量素材、SVG 动画。',
    },
    alternates: {
      canonical: 'https://svgship.com/zh',
      languages: {
        en: 'https://svgship.com/en',
        zh: 'https://svgship.com/zh',
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <I18nProvider defaultLocale={locale as Locale}>{children}</I18nProvider>;
}
