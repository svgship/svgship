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
import { resolveTag } from '@/lib/tags';
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
        site.tags?.some((tag) => {
          if (tag.toLowerCase().includes(query)) return true;
          const enTag = resolveTag(tag, 'en');
          return enTag !== tag && enTag.toLowerCase().includes(query);
        })
    );
  }, [searchQuery, locale]);

  // Handle hash-based navigation (e.g., from header click on another page)
  useGSAP(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#category-')) {
      // Small delay to let DOM render
      const timer = setTimeout(() => {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: hash, offsetY: 80 },
          ease: 'power2.inOut',
        });
        // Clean up the hash so refresh doesn't re-trigger
        history.replaceState(null, '', window.location.pathname);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <CursorGlow />
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex flex-1 flex-col">
        <HeroSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <DrawSvgDivider />
        <LicenseFilterBar
          activeTags={activeLicenseTags}
          onToggle={toggleLicenseTag}
          locale={locale}
        />

        {filteredSites ? (
          <section
            className="px-4 py-16"
            style={{ background: 'var(--color-background)' }}
          >
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
