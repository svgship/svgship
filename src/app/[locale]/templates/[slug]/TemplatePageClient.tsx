'use client';

import { useI18n } from '@/lib/i18n/context';
import type { Template } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TemplatePageClient({ template }: { template: Template }) {
  const { t, locale } = useI18n();
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
        <div className="animate-slide-up w-full max-w-3xl">
          {/* Back link */}
          <Link
            href={`/${locale}/templates`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--color-on-surface-variant)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-on-surface-variant)';
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('templates.title')}
          </Link>

          {/* Preview */}
          <div
            className="flex aspect-square items-center justify-center rounded-3xl p-10"
            style={{
              background: 'var(--gradient-card)',
              border: '1px solid var(--color-outline-variant)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <img
              src={template.file}
              alt={template.name}
              className="max-h-full max-w-full object-contain drop-shadow-md"
            />
          </div>

          {/* Info */}
          <div className="mt-8">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
            >
              {template.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                }}
              >
                {t(`templates.${template.category}`)}
              </span>

              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: 'var(--color-surface-container)',
                    color: 'var(--color-on-surface-variant)',
                    border: '1px solid var(--color-outline-variant)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {svgData && (
              <div className="mt-8">
                <DownloadButton data={svgData} filename={`${template.slug}.svg`}>
                  {t('templates.download')}
                </DownloadButton>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
