import type { Metadata } from 'next';
import { I18nProvider } from '@/lib/i18n/context';
import { JsonLd } from '@/components/JsonLd';
import type { Locale } from '@/types';

const locales: Locale[] = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * 只服务 en / zh。
 *
 * 不加这一行时，任意单段路径都会被当成 locale 按需渲染，而 metadataByLocale 的
 * `?? metadataByLocale.en` 会把非法 locale 静默降级成英文 —— 于是
 * /logo.png、/apple-touch-icon.png 这类被中间件 matcher（`.*\..*`）排除在外的
 * 带点号路径，会返回 200 + 一整份英文首页（canonical 指向 /en），
 * 形成无界的软 404 / 重复内容集群。关掉后这类路径正常返回 404。
 */
export const dynamicParams = false;

const metadataByLocale: Record<Locale, Metadata> = {
  en: {
    title: 'SVGShip — Professional SVG Resource Directory',
    description:
      'Discover the best free SVG resources: icon libraries, illustrations, vector graphics, and SVG animations. Curated collection for designers and developers.',
    openGraph: {
      title: 'SVGShip — Professional SVG Resource Directory',
      description:
        'Discover the best free SVG resources: icon libraries, illustrations, vector graphics, and SVG animations.',
      url: 'https://www.svgship.com/en',
      siteName: 'SVGShip',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image',
          width: 1200,
          height: 630,
          alt: 'SVGShip — Professional SVG Resource Directory',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SVGShip — Professional SVG Resource Directory',
      description:
        'Discover the best free SVG resources: icons, illustrations, vectors, and animations.',
      images: ['/og-image'],
    },
    alternates: {
      canonical: 'https://www.svgship.com/en',
      languages: {
        'x-default': 'https://www.svgship.com',
        en: 'https://www.svgship.com/en',
        zh: 'https://www.svgship.com/zh',
      },
    },
  },
  zh: {
    title: 'SVGShip — 专业 SVG 资源导航',
    description:
      '精选优质 SVG 资源合集 — 免费图标库、插画素材、矢量图形、SVG 动画。为设计师和开发者提供一站式 SVG 资源搜索与导航。',
    openGraph: {
      title: 'SVGShip — 专业 SVG 资源导航',
      description: '精选优质 SVG 资源合集 — 免费图标库、插画素材、矢量图形、SVG 动画。',
      url: 'https://www.svgship.com/zh',
      siteName: 'SVGShip',
      locale: 'zh_CN',
      type: 'website',
      images: [
        {
          url: '/og-image',
          width: 1200,
          height: 630,
          alt: 'SVGShip — 专业 SVG 资源导航',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SVGShip — 专业 SVG 资源导航',
      description: '精选优质 SVG 资源合集 — 免费图标库、插画素材、矢量图形、SVG 动画。',
      images: ['/og-image'],
    },
    alternates: {
      canonical: 'https://www.svgship.com/zh',
      languages: {
        'x-default': 'https://www.svgship.com',
        en: 'https://www.svgship.com/en',
        zh: 'https://www.svgship.com/zh',
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
  return (
    <I18nProvider defaultLocale={locale as Locale}>
      <JsonLd locale={locale as Locale} />
      {children}
    </I18nProvider>
  );
}
