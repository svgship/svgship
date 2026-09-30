import type { MetadataRoute } from 'next';
import sitesData from '@/data/sites.json';
import { SITE_URL, LOCALES, CATEGORY_SLUGS } from '@/lib/site';

interface SiteEntry {
  id: string;
  name: string;
  category: string;
  /** ISO 日期，例如 '2026-09-22'。改动该条资源内容时请一并更新。 */
  updatedAt?: string;
}

const sites = sitesData as SiteEntry[];

/**
 * 未标注 updatedAt 的条目使用的兜底时间。
 *
 * 取 HEAD（3023743）的内容提交日期，是个真实且**固定**的值。
 * 绝对不要用 `new Date()`：那会让 160+ 个 URL 在每次构建后都变成同一个新时间戳，
 * lastmod 的语义被破坏，Google 可能直接忽略该字段或反复重抓。
 *
 * 想让 lastmod 真正可用，需要给 sites.json 每条补 updatedAt（见 SiteEntry）。
 */
const CONTENT_FALLBACK_DATE = new Date('2026-09-22T00:00:00.000Z');

const STATIC_PAGES = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: 'about', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: 'submit', priority: 0.4, changeFrequency: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const altLanguages = (suffix: string): Record<string, string> =>
    Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${suffix}`]));

  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      const suffix = page.path ? `/${page.path}` : '';
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: CONTENT_FALLBACK_DATE,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: altLanguages(suffix) },
      });
    }
  }

  // 分类枢纽页：之前整段缺失，导致 5 个头部词的落地页不在 sitemap 里。
  for (const locale of LOCALES) {
    for (const category of CATEGORY_SLUGS) {
      const suffix = `/${category}`;
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: CONTENT_FALLBACK_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: { languages: altLanguages(suffix) },
      });
    }
  }

  for (const locale of LOCALES) {
    for (const site of sites) {
      if (!(CATEGORY_SLUGS as readonly string[]).includes(site.category)) continue;
      const suffix = `/${site.category}/${site.id}`;
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: site.updatedAt ? new Date(site.updatedAt) : CONTENT_FALLBACK_DATE,
        // 策展目录条目很少每周变化，weekly 会稀释 lastmod 信号
        changeFrequency: 'monthly' as const,
        priority: 0.5,
        alternates: { languages: altLanguages(suffix) },
      });
    }
  }

  return entries;
}
