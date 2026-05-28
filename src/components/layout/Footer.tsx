'use client';

import { useI18n } from '@/lib/i18n/context';
import { Ship } from 'lucide-react';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t px-6 py-12"
      style={{ borderColor: 'var(--color-outline-variant)' }}
    >
      <div
        className="absolute top-0 left-0 h-px w-full"
        style={{ background: 'var(--gradient-primary)', opacity: 0.3 }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4">
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
          <p className="text-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('footer.description')}
          </p>
          <p className="text-center text-xs" style={{ color: 'var(--color-outline)' }}>
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
