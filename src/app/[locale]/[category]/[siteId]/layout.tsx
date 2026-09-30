import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/types';
import sitesData from '@/data/sites.json';
import { buildSiteTitle, buildSiteDescription, trimDescription } from '@/lib/seo';
import { CATEGORY_SLUGS } from '@/lib/site';

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

export function generateStaticParams() {
  const params: { locale: string; category: string; siteId: string }[] = [];
  for (const locale of locales) {
    for (const site of sites) {
      if (!(CATEGORY_SLUGS as readonly string[]).includes(site.category)) continue;
      params.push({
        locale,
        category: site.category,
        siteId: site.id,
      });
    }
  }
  return params;
}

/**
 * 只服务 generateStaticParams 里列出的 locale × category × siteId。
 *
 * 不加这一行时，/{locale}/{任意}/{任意} 都会按需渲染：generateMetadata 只是返回
 * `{ title: 'Resource Not Found' }` 而不调 notFound()，page 里也只渲染一段
 * "Resource not found" UI —— 于是 /zh/foo/bar、/en/icons/does-not-exist 这类
 * 无界 URL 全部返回 200，且 URL 形态与真实内容页完全一致，很容易被收录。
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; siteId: string }>;
}): Promise<Metadata> {
  const { locale, siteId } = await params;
  const site = sites.find((s) => s.id === siteId);
  // 兜底：不再返回 "Resource Not Found" 这种 200 状态的假页面
  if (!site) notFound();

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
