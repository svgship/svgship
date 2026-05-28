'use client';

import { useI18n } from '@/lib/i18n/context';
import { Search } from 'lucide-react';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeroSearch({ searchQuery, onSearchChange }: HeroSearchProps) {
  const { t } = useI18n();

  return (
    <section
      className="relative flex flex-col items-center px-4 py-20 text-center"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="animate-slide-up relative z-10">
        <h1
          className="mx-auto max-w-3xl text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('hero.title')}
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {t('hero.subtitle')}
        </p>

        <div className="relative mx-auto mt-8 max-w-lg">
          <Search
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
            style={{ color: 'var(--color-on-surface-variant)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('hero.searchPlaceholder')}
            className="w-full rounded-xl py-3.5 pr-4 pl-12 text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-on-surface)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
