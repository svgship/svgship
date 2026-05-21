'use client';

import { useI18n } from '@/lib/i18n/context';
import type { Template } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { useState, useEffect } from 'react';

export default function TemplatePageClient({ template }: { template: Template }) {
  const { t } = useI18n();
  const [svgData, setSvgData] = useState<string>('');

  useEffect(() => {
    fetch(template.file)
      .then((res) => res.text())
      .then(setSvgData)
      .catch(() => {});
  }, [template.file]);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div
            className="flex aspect-square items-center justify-center rounded-xl p-8"
            style={{ background: 'var(--color-surface-container-low)' }}
          >
            <img
              src={template.file}
              alt={template.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {template.name}
          </h1>

          <span
            className="mt-2 inline-block rounded-full px-3 py-1 text-sm"
            style={{
              background: 'var(--color-primary-container)',
              color: 'var(--color-on-primary-container)',
            }}
          >
            {t(`templates.${template.category}`)}
          </span>

          <div className="mt-6 flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-1 text-xs"
                style={{
                  background: 'var(--color-surface-container)',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {svgData && (
            <div className="mt-6">
              <DownloadButton data={svgData} filename={`${template.slug}.svg`}>
                {t('templates.download')}
              </DownloadButton>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
