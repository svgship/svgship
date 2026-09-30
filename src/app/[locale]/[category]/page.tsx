import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SiteCard } from '@/components/SiteCard';
import { categories } from '@/data/categories';
import sitesData from '@/data/sites.json';
import { absoluteUrl, LOCALES, CATEGORY_SLUGS } from '@/lib/site';
import type { CategorySlug, Locale, SvgSite } from '@/types';

const sites = sitesData as SvgSite[];

/**
 * 分类页的 SEO 头部词。
 *
 * 刻意与 `categories.ts` 的展示名分开维护：那边 tutorials/en 的展示名是 'Learn'，
 * 不含头部词 "tutorial"，直接拿来做 <title> 会丢掉这个词最重要的关键词。
 * 展示名（H1 / 面包屑）仍取 categories.ts，保证和导航、首页区块一致。
 */
const CATEGORY_KEYWORDS: Record<CategorySlug, { en: string; zh: string }> = {
  icons: { en: 'SVG Icons', zh: 'SVG 图标' },
  illustrations: { en: 'SVG Illustrations', zh: 'SVG 插画' },
  tools: { en: 'SVG Tools', zh: 'SVG 工具' },
  tutorials: { en: 'SVG Tutorials', zh: 'SVG 教程' },
  inspiration: { en: 'SVG Inspiration', zh: 'SVG 灵感' },
};

interface PageParams {
  locale: string;
  category: string;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => CATEGORY_SLUGS.map((category) => ({ locale, category })));
}

// 兜底：只服务 generateStaticParams 里列出的 locale × category，
// 任何其它组合直接 404，避免 /{locale}/{任意词} 渲染成 200 的软 404。
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return {};

  const l = locale as Locale;
  const count = sites.filter((s) => s.category === category).length;
  const kw = CATEGORY_KEYWORDS[cat.slug][l];
  const description = cat.description[l];

  // 用 absolute 而非裸字符串：root layout 的 title.template 在 depth ≤ 1 才生效，
  // 深层页面不会被追加 "| SVGShip"，这里自己保证品牌后缀，避免出现双重后缀或没有后缀。
  const title =
    l === 'zh'
      ? `${kw}精选 — ${count} 个优质资源推荐 | SVGShip`
      : `Best ${kw} — ${count} Curated Resources | SVGShip`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: absoluteUrl(`/${locale}/${category}`),
      languages: {
        // x-default 指向默认语言（en）的本页，且不能是裸域
        'x-default': absoluteUrl(`/en/${category}`),
        ...Object.fromEntries(LOCALES.map((alt) => [alt, absoluteUrl(`/${alt}/${category}`)])),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/${locale}/${category}`),
      siteName: 'SVGShip',
      locale: l === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image', width: 1200, height: 630, alt: cat.name[l] }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image'],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<PageParams> }) {
  const { locale, category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const l = locale as Locale;
  const items = sites.filter((s) => s.category === cat.slug);
  const t = (zh: string, en: string) => (l === 'zh' ? zh : en);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cat.name[l],
    numberOfItems: items.length,
    itemListElement: items.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/${locale}/${s.category}/${s.id}`),
      name: s.name,
    })),
  };

  // 这里刻意**不**输出 BreadcrumbList：JsonLd 组件挂在 [locale]/layout.tsx 上，
  // 在 CATEGORY_PAGES_ENABLED 打开后已经为本页生成了完全相同的
  // 首页 → 分类 面包屑。两处都发会产生重复的 BreadcrumbList 结构化数据。
  // 页面顶部的可见面包屑（<nav>）是 HTML，不受影响。

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />
      <main className="flex flex-1 flex-col">
        <section
          className="relative flex flex-col items-center px-4 pt-14 pb-16 text-center"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <nav
            className="mb-6 flex items-center gap-2 text-xs"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            aria-label={t('面包屑', 'Breadcrumb')}
          >
            <Link href={`/${locale}`} className="hover:underline">
              {t('首页', 'Home')}
            </Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{cat.name[l]}</span>
          </nav>

          <h1
            className="text-3xl font-bold tracking-tight text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {cat.name[l]}
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            {cat.description[l]}
          </p>
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {t(`共 ${items.length} 个精选资源`, `${items.length} curated resources`)}
          </p>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((site) => (
                <SiteCard key={site.id} site={site} locale={l} />
              ))}
            </div>

            {/* 分类间互链：给这 5 个枢纽页建立横向内部链接，别只靠 Header */}
            <nav
              className="mt-14 border-t pt-8"
              style={{ borderColor: 'var(--glass-border)' }}
              aria-label={t('其它分类', 'Other categories')}
            >
              <p
                className="mb-3 text-xs font-medium tracking-wide uppercase"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {t('浏览其它分类', 'Browse other categories')}
              </p>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c.slug !== cat.slug)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${locale}/${c.slug}`}
                      className="rounded-xl px-3 py-1.5 text-sm transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                    >
                      {c.name[l]}
                    </Link>
                  ))}
              </div>
            </nav>

            <div className="mt-10 flex justify-center">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: 'var(--color-primary-container)',
                  color: 'var(--color-on-primary-container)',
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                {t('返回全部资源', 'Back to all resources')}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
