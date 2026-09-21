import type { Metadata } from 'next';
import type { Locale } from '@/types';
import sitesData from '@/data/sites.json';
import { buildSiteTitle, buildSiteDescription, trimDescription } from '@/lib/seo';

const locales: Locale[] = ['en', 'zh'];
const sites = sitesData as Array<{
  id: string;
  name: string;
  category: string;
  description: { en: string; zh: string };
  tags?: string[];
  pricing?: 'free' | 'paid' | 'freemium';
  url: string;
}>;

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

  const title = buildSiteTitle(site, locale as Locale);
  const rawDescription = buildSiteDescription(site, locale as Locale);
  const description = trimDescription(rawDescription, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.svgship.com/${locale}/${site.category}/${site.id}`,
      siteName: 'SVGShip',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image', width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image'],
    },
    alternates: {
      canonical: `https://www.svgship.com/${locale}/${site.category}/${site.id}`,
      languages: {
        'x-default': `https://www.svgship.com/en/${site.category}/${site.id}`,
        en: `https://www.svgship.com/en/${site.category}/${site.id}`,
        zh: `https://www.svgship.com/zh/${site.category}/${site.id}`,
      },
    },
  };
}

export default function SiteDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
