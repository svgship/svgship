import type { Metadata } from 'next';
import type { Locale } from '@/types';
import sitesData from '@/data/sites.json';
import extendedDescriptions from '@/data/extended-descriptions.json';
import { resolveTag } from '@/lib/tags';

const locales: Locale[] = ['en', 'zh'];
const sites = sitesData as Array<{
  id: string;
  name: string;
  category: string;
  description: { en: string; zh: string };
  tags?: string[];
  url: string;
}>;
const descriptions = extendedDescriptions as Record<string, { en: string; zh: string }>;

const validCategories = ['icons', 'illustrations', 'tools', 'tutorials', 'inspiration'];

export function generateStaticParams() {
  const params: { locale: string; category: string; siteId: string }[] = [];
  for (const locale of locales) {
    for (const site of sites) {
      if (!validCategories.includes(site.category)) continue;
      params.push({
        locale,
        category: site.category,
        siteId: site.id,
      });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; siteId: string }>;
}): Promise<Metadata> {
  const { locale, siteId } = await params;
  const site = sites.find((s) => s.id === siteId);
  if (!site) {
    return { title: 'Resource Not Found' };
  }

  const extDesc = descriptions[siteId];
  const description = extDesc?.[locale as Locale] ?? site.description[locale as Locale];

  const title =
    locale === 'zh'
      ? `${site.name} — SVG 资源详情 | SVGShip`
      : `${site.name} — Free SVG Resource | SVGShip`;

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title: `${site.name} — Free SVG Resource by SVGShip`,
      description: description.slice(0, 160),
      url: `https://svgship.com/${locale}/${site.category}/${site.id}`,
      siteName: 'SVGShip',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image', width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.name} — Free SVG Resource`,
      description: description.slice(0, 160),
      images: ['/og-image'],
    },
    alternates: {
      canonical: `https://svgship.com/${locale}/${site.category}/${site.id}`,
      languages: {
        en: `https://svgship.com/en/${site.category}/${site.id}`,
        zh: `https://svgship.com/zh/${site.category}/${site.id}`,
      },
    },
  };
}

export default function SiteDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
