'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSearch } from '@/components/HeroSearch';
import { CategorySection } from '@/components/CategorySection';
import { SiteCard } from '@/components/SiteCard';
import { categories } from '@/data/categories';
import sitesData from '@/data/sites.json';
import type { SvgSite } from '@/types';

const sites = sitesData as SvgSite[];

export default function Home() {
  const { locale, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return sites.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.description[locale].toLowerCase().includes(query) ||
        site.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, locale]);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <HeroSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {filteredSites ? (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-6xl">
              {filteredSites.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredSites.map((site) => (
                    <SiteCard key={site.id} site={site} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-lg font-medium" style={{ color: 'var(--color-on-surface)' }}>
                    {t('common.noResults')}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {t('common.noResultsHint')}
                  </p>
                </div>
              )}
            </div>
          </section>
        ) : (
          categories.map((category) => {
            const categorySites = sites.filter((site) => site.category === category.slug);
            return (
              <CategorySection key={category.slug} category={category} sites={categorySites} />
            );
          })
        )}
      </main>
      <Footer />
    </>
  );
}
