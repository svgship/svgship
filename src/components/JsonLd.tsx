'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/types';
import sitesData from '@/data/sites.json';
import { categories } from '@/data/categories';

const sites = sitesData as Array<{ id: string; name: string; category: string }>;

interface JsonLdProps {
  locale: Locale;
  breadcrumb?: { name: string; url: string }[];
}

export function JsonLd({ locale }: JsonLdProps) {
  const pathname = usePathname();

  const breadcrumbItems: { name: string; url: string }[] = [
    { name: 'Home', url: `https://svgship.com/${locale}` },
  ];

  const segments = pathname.split('/').filter(Boolean);
  // segments[0] is locale, rest are path
  const pathSegments = segments.slice(1);

  for (let i = 0; i < pathSegments.length; i++) {
    const seg = pathSegments[i];
    const url = `https://svgship.com/${locale}/${pathSegments.slice(0, i + 1).join('/')}`;

    // Try to resolve as category
    const cat = categories.find((c) => c.slug === seg);
    if (cat) {
      breadcrumbItems.push({ name: cat.name[locale === 'zh' ? 'zh' : 'en'], url });
      continue;
    }

    // Try to resolve as site ID (always the last segment)
    if (i === pathSegments.length - 1) {
      const site = sites.find((s) => s.id === seg);
      if (site) {
        breadcrumbItems.push({ name: site.name, url });
        continue;
      }
    }

    // Fallback: capitalize segment as display name
    const name = seg.charAt(0).toUpperCase() + seg.slice(1);
    breadcrumbItems.push({ name, url });
  }

  const breadcrumbSchema =
    breadcrumbItems.length > 1
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        }
      : null;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SVGShip',
    url: 'https://svgship.com',
    description:
      locale === 'zh'
        ? '精选优质 SVG 资源合集 — 免费图标库、插画素材、矢量图形、SVG 动画。'
        : 'Discover the best free SVG resources: icon libraries, illustrations, vector graphics, and SVG animations.',
    inLanguage: [locale],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://svgship.com/{locale}?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SVGShip',
    url: 'https://svgship.com',
    logo: 'https://svgship.com/logo-favicon.svg',
    sameAs: ['https://github.com/svgship/svgship'],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name:
      locale === 'zh'
        ? 'SVGShip — 专业 SVG 资源导航'
        : 'SVGShip — Professional SVG Resource Directory',
    description:
      locale === 'zh'
        ? '精选优质 SVG 资源合集 — 免费图标库、插画素材、矢量图形、SVG 动画。'
        : 'Discover the best free SVG resources: icon libraries, illustrations, vector graphics, and SVG animations.',
    url: `https://svgship.com/${locale}`,
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://svgship.com',
    },
    inLanguage: locale,
  };

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </>
  );
}
