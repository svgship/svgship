'use client';

import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Template } from '@/types';

const toolCards = [
  { key: 'optimize', icon: 'compress', href: '/tools/optimize' },
  { key: 'pngToSvg', icon: 'image', href: '/tools/png-to-svg' },
  { key: 'svgToPng', icon: 'download', href: '/tools/svg-to-png' },
  { key: 'backgroundRemove', icon: 'auto_fix_high', href: '/tools/background-remove' },
];

export default function Home() {
  const { t, locale } = useI18n();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetch('/templates.json')
      .then((res) => res.json())
      .then((data: Template[]) => setTemplates(data.slice(0, 8)))
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section
          className="flex flex-col items-center px-4 py-20 text-center"
          style={{ background: 'var(--color-surface-container-low)' }}
        >
          <h1
            className="text-4xl leading-tight font-bold md:text-5xl"
            style={{ color: 'var(--color-on-surface)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-4 max-w-xl text-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href={`/${locale}/templates`}
              className="rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                minHeight: '44px',
              }}
            >
              {t('hero.browseTemplates')}
            </Link>
            <Link
              href={`/${locale}/tools/optimize`}
              className="rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
              style={{
                borderColor: 'var(--color-outline)',
                color: 'var(--color-primary)',
                minHeight: '44px',
              }}
            >
              {t('hero.tryTools')}
            </Link>
          </div>
        </section>

        {/* Popular Templates */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
              {t('templates.title')}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {templates.map((template) => (
                <Link
                  key={template.id}
                  href={`/${locale}/templates/${template.slug}`}
                  className="group rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: 'var(--color-surface-container-low)' }}
                >
                  <div
                    className="flex aspect-square items-center justify-center rounded-lg"
                    style={{ background: 'var(--color-surface-container)' }}
                  >
                    <img
                      src={template.file}
                      alt={template.name}
                      className="h-3/4 w-3/4 object-contain"
                    />
                  </div>
                  <h3
                    className="mt-3 text-sm font-semibold"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    {template.name}
                  </h3>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/${locale}/templates`}
                className="inline-block rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
                style={{
                  borderColor: 'var(--color-outline)',
                  color: 'var(--color-primary)',
                }}
              >
                {t('hero.browseTemplates')} →
              </Link>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section
          className="px-4 py-16"
          style={{ background: 'var(--color-surface-container-low)' }}
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
              {t('nav.tools')}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {toolCards.map((tool) => (
                <Link
                  key={tool.key}
                  href={`/${locale}${tool.href}`}
                  className="rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: 'var(--color-surface)' }}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {tool.icon}
                  </span>
                  <h3
                    className="mt-3 text-base font-semibold"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    {t(`tools.${tool.key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {t(`tools.${tool.key}.description`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
