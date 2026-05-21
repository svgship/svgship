'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import type { Template, TemplateCategory } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Search } from 'lucide-react';

const categories: TemplateCategory[] = ['animals', 'holidays', 'letters'];

export default function TemplatesPage() {
  const { t, locale } = useI18n();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/templates.json')
      .then((res) => res.json())
      .then((data: Template[]) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = templates;
    if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q))
      );
    }
    return result;
  }, [templates, activeCategory, search]);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col px-4 py-12">
        <div className="animate-slide-up mx-auto w-full max-w-6xl">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
          >
            {t('templates.title')}
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('templates.subtitle')}
          </p>

          {/* Search */}
          <div className="relative mt-8">
            <Search
              className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
              style={{ color: 'var(--color-outline)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('templates.search')}
              className="w-full rounded-xl border py-3.5 pr-4 pl-12 text-sm transition-all focus:outline-none"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            />
          </div>

          {/* Category filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
              style={{
                background:
                  activeCategory === 'all'
                    ? 'var(--gradient-primary)'
                    : 'var(--color-surface-container)',
                color: activeCategory === 'all' ? 'white' : 'var(--color-on-surface)',
                boxShadow: activeCategory === 'all' ? 'var(--shadow-md)' : 'none',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {t('templates.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background:
                    activeCategory === cat
                      ? 'var(--gradient-primary)'
                      : 'var(--color-surface-container)',
                  color: activeCategory === cat ? 'white' : 'var(--color-on-surface)',
                  boxShadow: activeCategory === cat ? 'var(--shadow-md)' : 'none',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {t(`templates.${cat}`)}
              </button>
            ))}
          </div>

          {/* Template grid */}
          {loading ? (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-shimmer rounded-2xl"
                  style={{
                    background: 'var(--color-surface-container)',
                    height: '280px',
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <p
                className="text-lg font-semibold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {t('templates.noResults')}
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                {t('templates.noResultsHint')}
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((template) => (
                <Link
                  key={template.id}
                  href={`/${locale}/templates/${template.slug}`}
                  className="group overflow-hidden rounded-2xl transition-all duration-300"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-outline-variant)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div
                    className="flex aspect-square items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105"
                    style={{ background: 'var(--gradient-card)' }}
                  >
                    <img
                      src={template.file}
                      alt={template.name}
                      className="h-3/4 w-3/4 object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-base font-semibold"
                      style={{
                        color: 'var(--color-on-surface)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {template.name}
                    </h3>
                    <span
                      className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: 'var(--color-primary-container)',
                        color: 'var(--color-on-primary-container)',
                      }}
                    >
                      {t(`templates.${template.category}`)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
