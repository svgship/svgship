'use client';

import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, Image, Download as DownloadIcon, Eraser, ArrowRight, Sparkles } from 'lucide-react';
import type { Template } from '@/types';

const toolCards = [
  { key: 'optimize', icon: Zap, href: '/tools/optimize', color: '#6366F1' },
  { key: 'pngToSvg', icon: Image, href: '/tools/png-to-svg', color: '#8B5CF6' },
  { key: 'svgToPng', icon: DownloadIcon, href: '/tools/svg-to-png', color: '#EC4899' },
  { key: 'backgroundRemove', icon: Eraser, href: '/tools/background-remove', color: '#F59E0B' },
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
          className="relative flex flex-col items-center overflow-hidden px-4 py-24 text-center"
          style={{ background: 'var(--gradient-hero)' }}
        >
          {/* Decorative SVG shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="animate-float absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)',
                animation: 'float 4s ease-in-out infinite reverse',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5"
              style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
            />
          </div>

          <div className="animate-slide-up relative z-10">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles className="h-4 w-4" />
              Free &middot; Browser-based &middot; No signup
            </div>

            <h1
              className="mx-auto max-w-3xl text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('hero.title')}
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              {t('hero.subtitle')}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/templates`}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-heading)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {t('hero.browseTemplates')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/tools/optimize`}
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold transition-all duration-200"
                style={{
                  background: 'white',
                  color: '#312E81',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)';
                }}
              >
                {t('hero.tryTools')}
                <Zap className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              viewBox="0 0 1440 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <path
                d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z"
                fill="var(--color-background)"
              />
            </svg>
          </div>
        </section>

        {/* Tools */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2
                className="text-3xl font-bold tracking-tight"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {t('nav.tools')}
              </h2>
              <p className="mt-3 text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
                All tools run in your browser. Your files never leave your device.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {toolCards.map((tool, i) => (
                <Link
                  key={tool.key}
                  href={`/${locale}${tool.href}`}
                  className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-outline-variant)',
                    boxShadow: 'var(--shadow-sm)',
                    animationDelay: `${i * 80}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    e.currentTarget.style.borderColor = tool.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${tool.color}15` }}
                  >
                    <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                  </div>
                  <h3
                    className="mt-4 text-base font-semibold"
                    style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
                  >
                    {t(`tools.${tool.key}.title`)}
                  </h3>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    {t(`tools.${tool.key}.description`)}
                  </p>
                  <div
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: tool.color }}
                  >
                    Try it now{' '}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Templates */}
        <section
          className="px-4 py-20"
          style={{ background: 'var(--color-surface-container-low)' }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <h2
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
                >
                  {t('templates.title')}
                </h2>
                <p className="mt-3 text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Free SVG templates ready for your Cricut machine.
                </p>
              </div>
              <Link
                href={`/${locale}/templates`}
                className="hidden items-center gap-1 text-sm font-medium transition-colors sm:inline-flex"
                style={{ color: 'var(--color-primary)' }}
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {templates.map((template, i) => (
                <Link
                  key={template.id}
                  href={`/${locale}/templates/${template.slug}`}
                  className="group overflow-hidden rounded-2xl transition-all duration-300"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-outline-variant)',
                    boxShadow: 'var(--shadow-sm)',
                    animationDelay: `${i * 60}ms`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div
                    className="flex aspect-square items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105"
                    style={{ background: 'var(--gradient-card)' }}
                  >
                    <img
                      src={template.file}
                      alt={template.name}
                      className="h-3/4 w-3/4 object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-sm font-semibold"
                      style={{
                        color: 'var(--color-on-surface)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {template.name}
                    </h3>
                    <span
                      className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: 'var(--color-primary-container)',
                        color: 'var(--color-on-primary-container)',
                      }}
                    >
                      {t(`templates.${template.category}`)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link
                href={`/${locale}/templates`}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {t('hero.browseTemplates')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
