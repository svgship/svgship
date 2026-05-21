'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { ThemeToggle } from './ThemeToggle';
import { Ship } from 'lucide-react';

export function Header() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--color-outline-variant)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Link
        href={`/${locale}`}
        className="flex items-center gap-2 text-xl font-bold transition-opacity hover:opacity-80"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Ship className="h-5 w-5 text-white" />
        </span>
        <span className="gradient-text">SVGShip</span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {[
          { href: '/tools/optimize', label: t('nav.tools') },
          { href: '/templates', label: t('nav.templates') },
        ].map((item) => (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="relative rounded-lg px-4 py-2 text-sm font-medium transition-colors"
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
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          aria-label={t('nav.language')}
          className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            color: 'var(--color-on-surface-variant)',
            background: 'var(--color-surface-container)',
          }}
          onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-container-high)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-container)';
          }}
        >
          {locale === 'en' ? '中文' : 'EN'}
        </button>
      </div>
    </header>
  );
}
