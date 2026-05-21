'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { locale, t } = useI18n();

  return (
    <header
      className="flex h-16 items-center justify-between border-b px-6"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      <Link
        href={`/${locale}`}
        className="text-xl font-bold"
        style={{ color: 'var(--color-primary)' }}
      >
        SVGShip
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        <Link
          href={`/${locale}/tools/optimize`}
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {t('nav.tools')}
        </Link>
        <Link
          href={`/${locale}/templates`}
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {t('nav.templates')}
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          aria-label={t('nav.language')}
          className="rounded-md px-2 py-1 text-sm"
          style={{
            color: 'var(--color-on-surface-variant)',
            background: 'var(--color-surface-container)',
          }}
        >
          {locale === 'en' ? '中文' : 'EN'}
        </button>
      </div>
    </header>
  );
}
