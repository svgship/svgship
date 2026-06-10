'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Grid3X3,
  Paintbrush,
  Wrench,
  BookOpen,
  Lightbulb,
  Tag,
  DollarSign,
  Star,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { resolveTag } from '@/lib/tags';
import sitesData from '@/data/sites.json';
import extendedDescriptions from '@/data/extended-descriptions.json';
import type { SvgSite, Locale } from '@/types';

const sites = sitesData as SvgSite[];
const descriptions = extendedDescriptions as Record<string, { en: string; zh: string }>;

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  icons: Grid3X3,
  illustrations: Paintbrush,
  tools: Wrench,
  tutorials: BookOpen,
  inspiration: Lightbulb,
};

const categoryLabels: Record<string, { en: string; zh: string }> = {
  icons: { en: 'Icons', zh: '图标' },
  illustrations: { en: 'Illustrations', zh: '插画' },
  tools: { en: 'Tools', zh: '工具' },
  tutorials: { en: 'Learn', zh: '教程' },
  inspiration: { en: 'Inspiration', zh: '灵感' },
};

const pricingLabel: Record<string, { en: string; zh: string }> = {
  free: { en: 'Free', zh: '免费' },
  freemium: { en: 'Freemium', zh: '免费增值' },
  paid: { en: 'Paid', zh: '付费' },
};

const pricingBg: Record<string, string> = {
  free: 'rgba(34,197,94,0.1)',
  freemium: 'rgba(245,158,11,0.1)',
  paid: 'rgba(239,68,68,0.1)',
};

const pricingText: Record<string, string> = {
  free: '#22c55e',
  freemium: '#f59e0b',
  paid: '#ef4444',
};

export default function SiteDetailPage() {
  const { t, locale } = useI18n();
  const params = useParams();
  const siteId = params.siteId as string;
  const categorySlug = params.category as string;

  const site = sites.find((s) => s.id === siteId && s.category === categorySlug);

  const similarSites = useMemo(() => {
    if (!site) return [];
    return sites.filter((s) => s.category === site.category && s.id !== site.id).slice(0, 4);
  }, [site]);

  if (!site) {
    return (
      <>
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
          <p className="text-lg font-medium" style={{ color: 'var(--color-on-surface)' }}>
            Resource not found
          </p>
          <Link
            href={`/${locale}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const extDesc = descriptions[siteId];
  const description = extDesc?.[locale as Locale] ?? site.description[locale as Locale];
  const CategoryIcon = categoryIcons[site.category];
  const catLabel = categoryLabels[site.category]?.[locale as 'en' | 'zh'] ?? site.category;

  const licenseTags =
    site.tags?.filter((tag) =>
      ['免费可商用', '需署名', '仅个人免费', '付费', '免费', '免费增值'].includes(tag)
    ) ?? [];
  const contentTags =
    site.tags?.filter(
      (tag) => !['免费可商用', '需署名', '仅个人免费', '付费', '免费', '免费增值'].includes(tag)
    ) ?? [];

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {/* ── Hero: compact product header ── */}
        <section
          className="relative flex flex-col items-center px-4 pt-14 pb-20 text-center"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <div className="relative z-10">
            {/* Logo */}
            <div
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
              }}
            >
              {site.logo ? (
                <img
                  src={`/logos/${site.logo}`}
                  alt={site.name}
                  className="h-11 w-11 rounded-lg object-contain"
                />
              ) : (
                <span
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {site.name.charAt(0)}
                </span>
              )}
            </div>

            <h1
              className="text-3xl font-bold tracking-tight text-white md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {site.name}
            </h1>
            <p
              className="mx-auto mt-3 max-w-2xl text-base leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              {site.description[locale as Locale]}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                style={{ color: 'var(--color-primary)' }}
              >
                <ExternalLink className="h-4 w-4" />
                {locale === 'zh' ? '访问官网' : 'Visit Website'}
              </a>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/10"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                {locale === 'zh' ? '返回' : 'Back'}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Floating info card (overlaps hero + content) ── */}
        <div className="relative z-20 mx-auto -mt-10 max-w-4xl px-4">
          <div
            className="rounded-2xl p-6 shadow-xl"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-wrap items-stretch gap-6 md:flex-nowrap">
              {/* Category */}
              <div
                className="flex flex-1 items-center gap-3 rounded-xl p-3"
                style={{ background: 'var(--color-surface-container)' }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: 'var(--color-primary-container)' }}
                >
                  {CategoryIcon && (
                    <div style={{ color: 'var(--color-primary)', lineHeight: 0 }}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium" style={{ color: 'var(--color-outline)' }}>
                    {locale === 'zh' ? '分类' : 'Category'}
                  </div>
                  <div
                    className="truncate text-sm font-semibold"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    {catLabel}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              {site.pricing && (
                <div
                  className="flex flex-1 items-center gap-3 rounded-xl p-3"
                  style={{ background: 'var(--color-surface-container)' }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: pricingBg[site.pricing] }}
                  >
                    <DollarSign className="h-5 w-5" style={{ color: pricingText[site.pricing] }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium" style={{ color: 'var(--color-outline)' }}>
                      {locale === 'zh' ? '价格' : 'Pricing'}
                    </div>
                    <div
                      className="truncate text-sm font-semibold"
                      style={{ color: pricingText[site.pricing] }}
                    >
                      {pricingLabel[site.pricing]?.[locale as 'en' | 'zh'] ?? site.pricing}
                    </div>
                  </div>
                </div>
              )}

              {/* Featured */}
              {site.featured && (
                <div
                  className="flex flex-1 items-center gap-3 rounded-xl p-3"
                  style={{ background: 'rgba(245,158,11,0.08)' }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(245,158,11,0.15)' }}
                  >
                    <Star className="h-5 w-5" style={{ color: '#f59e0b' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium" style={{ color: 'var(--color-outline)' }}>
                      {locale === 'zh' ? '推荐' : 'Featured'}
                    </div>
                    <div className="truncate text-sm font-semibold" style={{ color: '#b45309' }}>
                      {locale === 'zh' ? '精选资源' : 'Hand-picked'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags row */}
            {(contentTags.length > 0 || licenseTags.length > 0) && (
              <div
                className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4"
                style={{ borderColor: 'var(--color-outline-variant)' }}
              >
                <Tag className="h-4 w-4 shrink-0" style={{ color: 'var(--color-outline)' }} />
                {contentTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      background: 'var(--color-primary-container)',
                      color: 'var(--color-on-primary-container)',
                    }}
                  >
                    {resolveTag(tag, locale as Locale)}
                  </span>
                ))}
                {contentTags.length > 4 && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs"
                    style={{ color: 'var(--color-outline)' }}
                  >
                    +{contentTags.length - 4}
                  </span>
                )}
                {licenseTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      background:
                        site.pricing === 'free'
                          ? 'rgba(34,197,94,0.1)'
                          : 'var(--color-secondary-container)',
                      color: site.pricing === 'free' ? '#16a34a' : 'var(--color-secondary)',
                    }}
                  >
                    {resolveTag(tag, locale as Locale)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Two-column content area ── */}
        <section className="px-4 py-14">
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_280px]">
            {/* Left: Extended description */}
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {locale === 'zh' ? '关于' : 'About'} {site.name}
              </h2>
              <div
                className="mt-2 h-1 w-12 rounded-full"
                style={{ background: 'var(--gradient-primary)' }}
              />
              <p
                className="mt-6 text-base leading-[1.8]"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {description}
              </p>
            </div>

            {/* Right: Metadata sidebar */}
            <div>
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'var(--color-surface-container)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <h3
                  className="text-sm font-semibold"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
                >
                  {locale === 'zh' ? '资源信息' : 'Resource Info'}
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-outline)' }}>
                      {locale === 'zh' ? '分类' : 'Category'}
                    </span>
                    <span className="font-medium" style={{ color: 'var(--color-on-surface)' }}>
                      {catLabel}
                    </span>
                  </div>
                  {site.pricing && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-outline)' }}>
                        {locale === 'zh' ? '价格' : 'Pricing'}
                      </span>
                      <span className="font-medium" style={{ color: pricingText[site.pricing] }}>
                        {pricingLabel[site.pricing]?.[locale as 'en' | 'zh'] ?? site.pricing}
                      </span>
                    </div>
                  )}
                  {licenseTags.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-outline)' }}>
                        {locale === 'zh' ? '许可' : 'License'}
                      </span>
                      <div className="flex flex-wrap justify-end gap-1">
                        {licenseTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              background: 'var(--color-primary-container)',
                              color: 'var(--color-on-primary-container)',
                            }}
                          >
                            {resolveTag(tag, locale as Locale)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Similar Resources ── */}
        {similarSites.length > 0 && (
          <section
            className="border-t px-4 py-14"
            style={{
              borderColor: 'var(--color-outline-variant)',
              background: 'var(--color-surface-container)',
            }}
          >
            <div className="mx-auto max-w-6xl">
              <h2
                className="text-xl font-bold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {locale === 'zh' ? '相似资源' : 'Similar Resources'}
              </h2>
              <div
                className="mt-2 h-1 w-12 rounded-full"
                style={{ background: 'var(--gradient-primary)' }}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similarSites.map((s) => (
                  <Link
                    key={s.id}
                    href={`/${locale}/${s.category}/${s.id}`}
                    className="group rounded-xl p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--glass-border)',
                      boxShadow: 'var(--glass-shadow)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {s.logo ? (
                        <img
                          src={`/logos/${s.logo}`}
                          alt={s.name}
                          className="h-10 w-10 flex-shrink-0 rounded-lg object-contain"
                        />
                      ) : (
                        <div
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
                          style={{ background: 'var(--gradient-primary)' }}
                        >
                          {s.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3
                          className="truncate text-sm font-semibold"
                          style={{
                            color: 'var(--color-on-surface)',
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          {s.name}
                        </h3>
                        <p
                          className="mt-1 line-clamp-2 text-xs leading-relaxed"
                          style={{ color: 'var(--color-on-surface-variant)' }}
                        >
                          {s.description[locale as 'en' | 'zh']}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
