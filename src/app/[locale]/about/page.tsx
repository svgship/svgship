'use client';

import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Ship, Heart, Globe, Mail } from 'lucide-react';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section
          className="relative flex flex-col items-center px-4 py-20 text-center"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <div className="animate-slide-up relative z-10">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
            >
              <Ship className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-4xl font-bold tracking-tight text-white md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('about.title')}
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              {t('about.subtitle')}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="glass-card p-8" style={{ background: 'var(--color-surface)' }}>
              <h2
                className="text-2xl font-bold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {t('about.missionTitle')}
              </h2>
              <p
                className="mt-4 leading-relaxed"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {t('about.missionText')}
              </p>

              <h2
                className="mt-10 text-2xl font-bold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {t('about.whatWeOfferTitle')}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: '🎨', title: t('about.offerIcons'), desc: t('about.offerIconsDesc') },
                  {
                    icon: '🖌️',
                    title: t('about.offerIllustrations'),
                    desc: t('about.offerIllustrationsDesc'),
                  },
                  { icon: '🔧', title: t('about.offerTools'), desc: t('about.offerToolsDesc') },
                  {
                    icon: '📚',
                    title: t('about.offerTutorials'),
                    desc: t('about.offerTutorialsDesc'),
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl p-4"
                    style={{ background: 'var(--color-surface-container)' }}
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <h3
                      className="mt-2 text-sm font-semibold"
                      style={{
                        color: 'var(--color-on-surface)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <h2
                className="mt-10 text-2xl font-bold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {t('about.contactTitle')}
              </h2>
              <p
                className="mt-4 leading-relaxed"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {t('about.contactText')}
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://github.com/svgship/svgship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                  style={{
                    background: 'var(--color-surface-container)',
                    color: 'var(--color-on-surface-variant)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <Globe className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="mailto:zdi13920@gmail.com"
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                  style={{
                    background: 'var(--color-surface-container)',
                    color: 'var(--color-on-surface-variant)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>

              <div
                className="mt-10 flex items-center justify-center gap-2 text-sm"
                style={{ color: 'var(--color-outline)' }}
              >
                <span>Made with</span>
                <Heart className="h-4 w-4" style={{ color: 'var(--color-error, #ef4444)' }} />
                <span>for the SVG community</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
