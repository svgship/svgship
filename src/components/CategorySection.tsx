'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Grid3X3, Paintbrush, Wrench, BookOpen, Lightbulb } from 'lucide-react';
import { SiteCard } from './SiteCard';
import type { Category, SvgSite, Locale } from '@/types';

const iconMap: Record<string, typeof Grid3X3> = {
  Grid3X3,
  Paintbrush,
  Wrench,
  BookOpen,
  Lightbulb,
};

interface CategorySectionProps {
  category: Category;
  sites: SvgSite[];
  locale: Locale;
  globalLicenseTags?: string[];
}

export function CategorySection({
  category,
  sites,
  locale,
  globalLicenseTags = [],
}: CategorySectionProps) {
  const { t } = useI18n();
  const Icon = iconMap[category.icon] ?? Grid3X3;

  const [activeContentTags, setActiveContentTags] = useState<string[]>([]);

  const toggleContentTag = (tag: string) => {
    setActiveContentTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredSites = useMemo(() => {
    let result = [...sites];

    if (globalLicenseTags.length > 0) {
      result = result.filter((site) => globalLicenseTags.some((tag) => site.tags.includes(tag)));
    }

    if (activeContentTags.length > 0) {
      result = result.filter((site) => activeContentTags.some((tag) => site.tags.includes(tag)));
    }

    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return result;
  }, [sites, globalLicenseTags, activeContentTags]);

  return (
    <section
      id={`category-${category.slug}`}
      className="px-4 py-16"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <Icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
            >
              {category.name[locale]}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              {category.description[locale]}
            </p>
          </div>
        </div>

        {/* Content tags */}
        {category.contentTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {category.contentTags.map((tagObj) => {
              const label = tagObj[locale];
              const isActive = activeContentTags.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleContentTag(label)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-200"
                  style={{
                    background: isActive
                      ? 'var(--color-primary)'
                      : 'var(--color-surface-container)',
                    color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                    border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--glass-border)'}`,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {filteredSites.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t('common.noResults')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
