'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import type { Template, TemplateCategory } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

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
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {t('templates.title')}
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('templates.subtitle')}
          </p>

          {/* Search */}
          <div className="mt-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('templates.search')}
              className="w-full rounded-lg border px-4 py-3"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          {/* Category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={{
                background:
                  activeCategory === 'all'
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-container)',
                color:
                  activeCategory === 'all' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
              }}
            >
              {t('templates.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background:
                    activeCategory === cat
                      ? 'var(--color-primary)'
                      : 'var(--color-surface-container)',
                  color:
                    activeCategory === cat ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                }}
              >
                {t(`templates.${cat}`)}
              </button>
            ))}
          </div>

          {/* Template grid */}
          {loading ? (
            <div className="mt-12 text-center" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t('common.loading')}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-lg" style={{ color: 'var(--color-on-surface)' }}>
                {t('templates.noResults')}
              </p>
              <p className="mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                {t('templates.noResultsHint')}
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((template) => (
                <Link
                  key={template.id}
                  href={`/${locale}/templates/${template.slug}`}
                  className="group rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: 'var(--color-surface-container-low)' }}
                >
                  <div
                    className="flex aspect-square items-center justify-center rounded-lg"
                    style={{ background: 'var(--color-surface-container)' }}
                  >
                    <img
                      src={template.file}
                      alt={template.name}
                      className="h-3/4 w-3/4 object-contain"
                    />
                  </div>
                  <h3
                    className="mt-3 text-base font-semibold"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    {template.name}
                  </h3>
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs"
                    style={{
                      background: 'var(--color-primary-container)',
                      color: 'var(--color-on-primary-container)',
                    }}
                  >
                    {t(`templates.${template.category}`)}
                  </span>
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
