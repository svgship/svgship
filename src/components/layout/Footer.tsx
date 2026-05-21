'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';

export function Footer() {
  const { locale, t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t px-6 py-12"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
            SVGShip
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('footer.description')}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
            {t('footer.tools')}
          </p>
          <nav className="mt-3 flex flex-col gap-2">
            <Link
              href={`/${locale}/tools/optimize`}
              className="text-sm"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {t('nav.optimize')}
            </Link>
            <Link
              href={`/${locale}/tools/png-to-svg`}
              className="text-sm"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {t('nav.pngToSvg')}
            </Link>
            <Link
              href={`/${locale}/tools/svg-to-png`}
              className="text-sm"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {t('nav.svgToPng')}
            </Link>
            <Link
              href={`/${locale}/tools/background-remove`}
              className="text-sm"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {t('nav.backgroundRemove')}
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
            {t('footer.resources')}
          </p>
          <nav className="mt-3 flex flex-col gap-2">
            <Link
              href={`/${locale}/templates`}
              className="text-sm"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {t('footer.templates')}
            </Link>
          </nav>
        </div>
      </div>

      <p className="mt-8 text-center text-xs" style={{ color: 'var(--color-outline)' }}>
        {t('footer.copyright', { year })}
      </p>
    </footer>
  );
}
