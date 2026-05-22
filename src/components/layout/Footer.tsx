'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { Ship } from 'lucide-react';

export function Footer() {
  const { locale, t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t px-6 py-16"
      style={{ borderColor: 'var(--color-outline-variant)' }}
    >
      {/* Subtle gradient line at top */}
      <div
        className="absolute top-0 left-0 h-px w-full"
        style={{ background: 'var(--gradient-primary)', opacity: 0.3 }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Ship className="h-4 w-4 text-white" />
            </span>
            <span
              className="gradient-text text-lg font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              SVGShip
            </span>
          </div>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {t('footer.description')}
          </p>
        </div>

        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
          >
            {t('footer.tools')}
          </p>
          <nav className="mt-4 flex flex-col gap-3">
            {[
              { href: '/tools/optimize', label: t('nav.optimize') },
              // { href: '/tools/png-to-svg', label: t('nav.pngToSvg') },
              { href: '/tools/svg-to-png', label: t('nav.svgToPng') },
              { href: '/tools/background-remove', label: t('nav.backgroundRemove') },
            ].map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-sm transition-colors"
                style={{ color: 'var(--color-on-surface-variant)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
          >
            {t('footer.resources')}
          </p>
          <nav className="mt-4 flex flex-col gap-3">
            <Link
              href={`/${locale}/templates`}
              className="text-sm transition-colors"
              style={{ color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-on-surface-variant)';
              }}
            >
              {t('footer.templates')}
            </Link>
          </nav>
        </div>
      </div>

      <p className="mt-12 text-center text-xs" style={{ color: 'var(--color-outline)' }}>
        {t('footer.copyright', { year })}
      </p>
    </footer>
  );
}
