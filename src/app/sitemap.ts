import type { MetadataRoute } from 'next';
import sitesData from '@/data/sites.json';

const sites = sitesData as Array<{ id: string; name: string; category: string }>;
const locales = ['en', 'zh'] as const;
const validCategories = ['icons', 'illustrations', 'tools', 'tutorials', 'inspiration'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgship.com';
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages: home, about, submit
  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: 'about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: 'submit', priority: 0.4, changeFrequency: 'monthly' as const },
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      const url = page.path ? `${baseUrl}/${locale}/${page.path}` : `${baseUrl}/${locale}`;
      const altLanguages: Record<string, string> = {};
      for (const alt of locales) {
        altLanguages[alt] = page.path ? `${baseUrl}/${alt}/${page.path}` : `${baseUrl}/${alt}`;
      }
      entries.push({
        url,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: altLanguages },
      });
    }
  }

  // Resource detail pages
  for (const locale of locales) {
    for (const site of sites) {
      if (!validCategories.includes(site.category)) continue;
      const altLanguages: Record<string, string> = {};
      for (const alt of locales) {
        altLanguages[alt] = `${baseUrl}/${alt}/${site.category}/${site.id}`;
      }
      entries.push({
        url: `${baseUrl}/${locale}/${site.category}/${site.id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
        alternates: { languages: altLanguages },
      });
    }
  }

  return entries;
}
