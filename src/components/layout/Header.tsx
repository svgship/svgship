'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { ThemeToggle } from './ThemeToggle';
import { Zap, Image, ArrowRightLeft, Eraser, LayoutGrid } from 'lucide-react';

const tools = [
  { href: '/tools/optimize', icon: Zap, labelKey: 'nav.optimize' },
  // { href: '/tools/png-to-svg', icon: Image, labelKey: 'nav.pngToSvg' },
  { href: '/tools/svg-to-png', icon: ArrowRightLeft, labelKey: 'nav.svgToPng' },
  { href: '/tools/background-remove', icon: Eraser, labelKey: 'nav.backgroundRemove' },
];

export function Header() {
  const { locale, setLocale, t } = useI18n();

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

      <nav className="hidden items-center gap-1 md:flex">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={`/${locale}${tool.href}`}
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
              {t(tool.labelKey)}
            </Link>
          );
        })}

        <Link
          href={`/${locale}/templates`}
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
          <LayoutGrid className="h-4 w-4" />
          {t('nav.templates')}
        </Link>
      </nav>

      <div className="flex items-center gap-2">
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
