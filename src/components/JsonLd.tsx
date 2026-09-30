'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/types';
import sitesData from '@/data/sites.json';
import { categories } from '@/data/categories';
import { absoluteUrl, SITE_URL, GITHUB_REPO } from '@/lib/site';

const sites = sitesData as Array<{ id: string; name: string; category: string }>;

/**
 * 分类枢纽页（/[locale]/[category]）已上线（src/app/[locale]/[category]/page.tsx），
 * 因此面包屑现在可以包含分类层级。
 *
 * 之所以用开关而不是直接写死：该层级一旦回退成 404，写进 BreadcrumbList 会让
 * Google 判定整条面包屑无效（item URL 无效 → 整条被丢弃）。
 */
const CATEGORY_PAGES_ENABLED = true;

const HOME_META: Record<Locale, { name: string; description: string }> = {
  zh: {
    name: 'SVGShip — 专业 SVG 资源导航',
    description: '精选优质 SVG 资源合集 — 免费图标库、插画素材、矢量图形、SVG 动画。',
  },
  en: {
    name: 'SVGShip — Professional SVG Resource Directory',
    description:
      'Discover the best free SVG resources: icon libraries, illustrations, vector graphics, and SVG animations.',
  },
};

/** 面包屑首项的显示名。'Home' 对中文页面不友好，SERP 里会露出英文。 */
const HOME_LABEL: Record<Locale, string> = { zh: '首页', en: 'Home' };

interface JsonLdProps {
  locale: Locale;
}

export function JsonLd({ locale }: JsonLdProps) {
  const pathname = usePathname();

  const breadcrumbItems: { name: string; url: string }[] = [
    { name: HOME_LABEL[locale], url: absoluteUrl(`/${locale}`) },
  ];

  const segments = pathname.split('/').filter(Boolean);
  // segments[0] is locale, rest are path
  const pathSegments = segments.slice(1);

  for (let i = 0; i < pathSegments.length; i++) {
    const seg = pathSegments[i];
    const isLast = i === pathSegments.length - 1;
    const url = absoluteUrl(`/${locale}/${pathSegments.slice(0, i + 1).join('/')}`);

    // Try to resolve as category
    const cat = categories.find((c) => c.slug === seg);
    if (cat) {
      // 只有分类枢纽页真实存在时才写入该层级，避免面包屑指向 404
      if (CATEGORY_PAGES_ENABLED) {
        breadcrumbItems.push({ name: cat.name[locale], url });
      }
      continue;
    }

    // Try to resolve as site ID (always the last segment)
    if (isLast) {
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
    url: SITE_URL,
    description: HOME_META[locale].description,
    inLanguage: [locale],
    // 注意：在实现真正的服务端搜索路由（/[locale]/search?q=）之前不要声明 SearchAction。
    // 当前 ?q= 只是首页的客户端 useState 过滤，该 URL 返回的 HTML 与首页字节完全相同，
    // 声明它会让 sitelinks searchbox 失效并浪费抓取信号。
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SVGShip',
    url: SITE_URL,
    // Google 的 logo 富结果只接受 PNG/JPG/GIF/WebP（≥112×112），明确不支持 SVG。
    // public/logo.png 为 256×256。
    // ⚠️ 该文件曾被 .gitignore 的 `logo.png` 规则误伤而未提交，需确保它已入库/部署，
    // 否则这里会指向一个不存在的资源（注意：缺失的静态资源会落到 [locale] 通配，
    // 返回 200 + HTML，用状态码无法判断真伪，必须校验 content-type 为 image/png）。
    logo: absoluteUrl('/logo.png'),
    sameAs: [GITHUB_REPO],
  };

  // WebPage 只在首页输出：详情页/关于页的 WebPage 需由各自的服务端 layout
  // 生成，那里才能拿到该页真实的 title / description。
  // 修复前这里硬编码为 /${locale}，导致 154 个详情页全部声明自己是首页。
  const isHome = pathSegments.length === 0;

  const webPageSchema = isHome
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: HOME_META[locale].name,
        description: HOME_META[locale].description,
        url: absoluteUrl(`/${locale}`),
        isPartOf: { '@type': 'WebSite', url: SITE_URL },
        inLanguage: locale,
      }
    : null;

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
      {webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}
    </>
  );
}
