import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, DEFAULT_LOCALE, LOCALES } from '@/lib/site';
import { getLogoSrc } from '@/lib/logo';
import { categories } from '@/data/categories';
import sitesData from '@/data/sites.json';
import type { SvgSite } from '@/types';
import LanguagePicker from './language-picker';

const sites = sitesData as SvgSite[];

/** 精选资源数量：根页只做分流，不做全量陈列 */
const FEATURED_LIMIT = 8;

/**
 * 按分类轮转挑选精选资源。
 * 顺序取 featured 条目的数据顺序，逐轮跨分类抽取，避免首屏被单一分类占满。
 * 名额用尽或没有更多候选时提前结束。
 */
function pickFeatured(): SvgSite[] {
  const pools = categories.map((c) =>
    sites.filter((site) => site.featured && site.category === c.slug)
  );
  const picked: SvgSite[] = [];

  for (let round = 0; picked.length < FEATURED_LIMIT; round++) {
    const before = picked.length;
    for (const pool of pools) {
      if (picked.length >= FEATURED_LIMIT) break;
      if (pool[round]) picked.push(pool[round]);
    }
    if (picked.length === before) break;
  }

  return picked;
}

const featured = pickFeatured();

/** 分类双语名与条目数，模块级预计算，避免渲染时反复过滤 sites */
const categoryMeta = new Map(
  categories.map((c) => [
    c.slug,
    { name: c.name, count: sites.filter((site) => site.category === c.slug).length },
  ])
);
const featuredTotal = sites.filter((site) => site.featured).length;

/**
 * 根路径：语言中立（x-default）的双语资源总览。
 *
 * 刻意不复制 /en 首页的卡片描述文案 —— 那会让本页成为英文首页的重复内容。
 * 本页只提供品牌名、分类归属与双语入口，正文交给「关于」段落。
 */
export const metadata: Metadata = {
  // absolute：绕过根 layout 的 '%s | SVGShip' 模板，避免品牌名重复
  title: { absolute: 'SVGShip — Free SVG Icons, Illustrations, Tools & Tutorials' },
  description:
    'SVGShip is a curated directory of the best free SVG resources — icon libraries, illustrations, tools and tutorials. 精选优质免费 SVG 图标、插画、工具与教程导航。',
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'x-default': SITE_URL,
      ...(Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`])) as Record<
        string,
        string
      >),
    },
  },
};

/** 双语入口按钮组：语言中立页面的每个条目都同时暴露两种语言的落点 */
function LocaleLinks({ path }: { path: string }) {
  return (
    <div className="mt-auto flex gap-1.5 pt-4">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${path}`}
          hrefLang={locale}
          className="flex-1 rounded-lg border py-1.5 text-center text-[11.5px] font-semibold transition-colors hover:border-violet-400 hover:text-violet-600 dark:hover:border-violet-500 dark:hover:text-violet-400"
          style={{
            borderColor: 'var(--color-outline-variant)',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          {locale === 'en' ? 'English' : '中文'}
        </Link>
      ))}
    </div>
  );
}

export default function RootPage() {
  return (
    <main className="flex flex-1 flex-col px-6">
      {/* ── Hero ── */}
      <section className="pt-20 pb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          SVG<span className="text-violet-500">Ship</span>
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl text-lg"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          A curated directory of the best free SVG icons, illustrations, tools and tutorials.
        </p>
        <p
          className="mx-auto mt-1.5 max-w-xl text-sm"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          精选优质免费 SVG 图标、插画、工具与教程资源
        </p>
        <LanguagePicker />
      </section>

      {/* ── 分类入口 ── */}
      <section className="mx-auto w-full max-w-6xl pb-12">
        <div className="mb-5 flex items-baseline gap-3">
          <h2 className="text-lg font-semibold">按分类浏览</h2>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Browse by category
          </span>
          <span
            className="flex-1 border-t"
            style={{ borderColor: 'var(--color-outline-variant)' }}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="flex h-full flex-col rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-outline-variant)',
                background: 'var(--color-surface)',
              }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold">
                  {categoryMeta.get(category.slug)?.name.zh}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {categoryMeta.get(category.slug)?.count}
                </span>
              </div>
              <div
                className="mt-0.5 line-clamp-2 text-[11px]"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {categoryMeta.get(category.slug)?.name.en}
              </div>
              <LocaleLinks path={`/${category.slug}`} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 精选资源 ── */}
      <section className="mx-auto w-full max-w-6xl pb-12">
        <div className="mb-5 flex items-baseline gap-3">
          <h2 className="text-lg font-semibold">精选资源</h2>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Featured resources
          </span>
          <span
            className="flex-1 border-t"
            style={{ borderColor: 'var(--color-outline-variant)' }}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((site) => (
            <div
              key={site.id}
              className="flex h-full flex-col rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-outline-variant)',
                background: 'var(--color-surface)',
              }}
            >
              <div className="flex items-center gap-2.5">
                {site.logo ? (
                  <img
                    src={getLogoSrc(site.logo)}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-8 w-8 flex-none rounded-lg object-contain"
                  />
                ) : (
                  <span
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {site.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-semibold">{site.name}</div>
                  <div
                    className="truncate text-[11px]"
                    title={`${categoryMeta.get(site.category)?.name.zh} · ${categoryMeta.get(site.category)?.name.en}`}
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    {categoryMeta.get(site.category)?.name.zh} ·{' '}
                    {categoryMeta.get(site.category)?.name.en}
                  </div>
                </div>
              </div>
              <LocaleLinks path={`/${site.category}/${site.id}`} />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          共 {featuredTotal} 个精选资源 ·{' '}
          <Link
            href={`/${DEFAULT_LOCALE}`}
            className="text-violet-600 hover:underline dark:text-violet-400"
          >
            查看全部
          </Link>
        </p>
      </section>

      {/* ── 关于 ── */}
      <section className="mx-auto w-full max-w-3xl pb-24">
        <div
          className="rounded-xl border p-6 text-sm leading-relaxed"
          style={{
            borderColor: 'var(--color-outline-variant)',
            background: 'var(--color-surface-container)',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          <p>
            SVGShip 收录并整理优质 SVG
            资源站点，按图标、插画与背景、工具、教程与文章、灵感五个分类归档，
            每个条目都提供功能特性、授权方式与同类对比。所有资源均链接至原站，本站不托管素材。
          </p>
          <p className="mt-3">
            SVGShip curates the best free SVG resources across icons, illustrations, tools,
            tutorials and showcases. Every entry links to its original source — no assets are hosted
            here.
          </p>
          <p className="mt-4 flex gap-4">
            <Link
              href={`/${DEFAULT_LOCALE}/about`}
              className="text-violet-600 hover:underline dark:text-violet-400"
            >
              关于我们
            </Link>
            <Link
              href={`/${DEFAULT_LOCALE}/submit`}
              className="text-violet-600 hover:underline dark:text-violet-400"
            >
              提交资源
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
