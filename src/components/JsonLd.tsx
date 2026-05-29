'use client';

import type { Locale } from '@/types';

interface JsonLdProps {
  locale: Locale;
}

export function JsonLd({ locale }: JsonLdProps) {
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
