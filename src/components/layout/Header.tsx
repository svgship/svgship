'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { ThemeToggle } from './ThemeToggle';
import { Grid3X3, Paintbrush, Wrench, BookOpen, Lightbulb } from 'lucide-react';
import type { CategorySlug } from '@/types';

const navItems: { slug: CategorySlug; icon: typeof Grid3X3; labelKey: string }[] = [
  { slug: 'icons', icon: Grid3X3, labelKey: 'nav.icons' },
  { slug: 'illustrations', icon: Paintbrush, labelKey: 'nav.illustrations' },
  { slug: 'tools', icon: Wrench, labelKey: 'nav.tools' },
  { slug: 'tutorials', icon: BookOpen, labelKey: 'nav.tutorials' },
  { slug: 'inspiration', icon: Lightbulb, labelKey: 'nav.inspiration' },
];

export function Header() {
  const { locale, setLocale, t } = useI18n();

  const scrollToCategory = (slug: string) => {
    const el = document.getElementById(`category-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(99,102,241,0.04)',
      }}
    >
      <Link
        href={`/${locale}`}
        className="flex items-center gap-2.5 text-xl font-bold transition-all duration-200 hover:scale-[1.02]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <img src="/logo.svg" alt="SVGShip Logo" className="h-7 w-7" />
        <span className="gradient-text">SVGShip</span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.slug}
              onClick={() => scrollToCategory(item.slug)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
              style={{ color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.background = 'var(--color-primary-container)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href={`/${locale}/about`}
          className="rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
          style={{ color: 'var(--color-on-surface-variant)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-primary)';
            e.currentTarget.style.background = 'var(--color-primary-container)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-on-surface-variant)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {t('nav.about')}
        </Link>
        <Link
          href={`/${locale}/submit`}
          className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {t('nav.submit')}
        </Link>
        <ThemeToggle />
        <button
          aria-label={t('nav.language')}
          className="rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
          style={{
            color: 'var(--color-on-surface-variant)',
            background: 'var(--color-surface-container)',
            border: '1px solid var(--glass-border)',
          }}
          onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-container-high)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-container)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--color-on-surface-variant)';
          }}
        >
          {locale === 'en' ? '中文' : 'EN'}
        </button>
      </div>
    </header>
  );
}
