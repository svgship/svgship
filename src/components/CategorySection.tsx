'use client';

import { useState, useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/lib/i18n/context';
import { Grid3X3, Paintbrush, Wrench, BookOpen, Lightbulb } from 'lucide-react';
import { SiteCard } from './SiteCard';
import type { Category, SvgSite, Locale } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap: Record<string, typeof Grid3X3> = {
  Grid3X3,
  Paintbrush,
  Wrench,
  BookOpen,
  Lightbulb,
};

interface CategorySectionProps {
  category: Category;
  sites: SvgSite[];
  locale: Locale;
  globalLicenseTags?: string[];
}

export function CategorySection({
  category,
  sites,
  locale,
  globalLicenseTags = [],
}: CategorySectionProps) {
  const { t } = useI18n();
  const Icon = iconMap[category.icon] ?? Grid3X3;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const [activeContentTags, setActiveContentTags] = useState<string[]>([]);

  const toggleContentTag = (tag: string) => {
    setActiveContentTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredSites = useMemo(() => {
    let result = [...sites];

    if (globalLicenseTags.length > 0) {
      result = result.filter((site) => globalLicenseTags.some((tag) => site.tags.includes(tag)));
    }

    if (activeContentTags.length > 0) {
      result = result.filter((site) => activeContentTags.some((tag) => site.tags.includes(tag)));
    }

    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return result;
  }, [sites, globalLicenseTags, activeContentTags]);

  // GSAP animations for header and card entrance
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Animate category header slide in from left
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          x: -30,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Animate icon rotation + scale
      if (iconRef.current) {
        gsap.from(iconRef.current, {
          rotation: -180,
          scale: 0,
          duration: 0.7,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: iconRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // ScrollTrigger.batch for cards in this section
      const cards = sectionRef.current.querySelectorAll('[data-card]');
      if (cards.length > 0) {
        // Set initial state
        gsap.set(cards, { opacity: 0, y: 50, scale: 0.92 });

        ScrollTrigger.batch(cards as unknown as Element[], {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: 'back.out(1.3)',
              stagger: 0.06,
              overwrite: true,
            });
          },
          onLeaveBack: (batch) => {
            gsap.set(batch, { opacity: 0, y: 50, scale: 0.92, overwrite: true });
          },
          start: 'top 90%',
          once: false,
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id={`category-${category.slug}`}
      className="px-4 py-16"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-8 flex items-center gap-3">
          <div
            ref={iconRef}
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <Icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
            >
              {category.name[locale]}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              {category.description[locale]}
            </p>
          </div>
        </div>

        {/* Content tags */}
        {category.contentTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {category.contentTags.map((tagObj) => {
              const label = tagObj[locale];
              const isActive = activeContentTags.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleContentTag(label)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-200"
                  style={{
                    background: isActive
                      ? 'var(--color-primary)'
                      : 'var(--color-surface-container)',
                    color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                    border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--glass-border)'}`,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {filteredSites.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t('common.noResults')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
