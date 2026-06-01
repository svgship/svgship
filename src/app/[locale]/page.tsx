'use client';

import { useState, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSearch } from '@/components/HeroSearch';
import { LicenseFilterBar } from '@/components/LicenseFilterBar';
import { CategorySection } from '@/components/CategorySection';
import { SiteCard } from '@/components/SiteCard';
import { DrawSvgDivider } from '@/components/gsap/DrawSvgDivider';
import { CursorGlow } from '@/components/gsap/CursorGlow';
import { categories } from '@/data/categories';
import sitesData from '@/data/sites.json';
import type { SvgSite } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const sites = sitesData as SvgSite[];

export default function Home() {
  const { locale, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLicenseTags, setActiveLicenseTags] = useState<string[]>([]);

  const toggleLicenseTag = (tag: string) => {
    setActiveLicenseTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

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

  // Animate search results when they appear
  useGSAP(() => {
    if (filteredSites === null) return;

    // Small delay to let DOM update
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll('[data-card]');
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 30,
          scale: 0.95,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.04,
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [filteredSites]);

  return (
    <>
      <CursorGlow />
      <Header />
      <main className="flex flex-1 flex-col">
        <HeroSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <DrawSvgDivider />
        <LicenseFilterBar
          activeTags={activeLicenseTags}
          onToggle={toggleLicenseTag}
          locale={locale}
        />

        {filteredSites ? (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-6xl">
              {filteredSites.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredSites.map((site) => (
                    <SiteCard key={site.id} site={site} locale={locale} />
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
              <CategorySection
                key={category.slug}
                category={category}
                sites={categorySites}
                locale={locale}
                globalLicenseTags={activeLicenseTags}
              />
            );
          })
        )}
      </main>
      <Footer />
    </>
  );
}
