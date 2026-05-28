'use client';

import { useI18n } from '@/lib/i18n/context';
import { Grid3X3, Paintbrush, Layers, Sparkles } from 'lucide-react';
import { SiteCard } from './SiteCard';
import type { Category, SvgSite } from '@/types';

const iconMap: Record<string, typeof Grid3X3> = {
  Grid3X3,
  Paintbrush,
  Layers,
  Sparkles,
};

interface CategorySectionProps {
  category: Category;
  sites: SvgSite[];
}

export function CategorySection({ category, sites }: CategorySectionProps) {
  const { locale } = useI18n();
  const Icon = iconMap[category.icon] ?? Grid3X3;

  const sortedSites = [...sites].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sortedSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </section>
  );
}
