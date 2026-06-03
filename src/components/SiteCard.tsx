'use client';

import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useI18n } from '@/lib/i18n/context';
import { ExternalLink } from 'lucide-react';
import { resolveTag } from '@/lib/tags';
import type { SvgSite, Locale } from '@/types';

interface SiteCardProps {
  site: SvgSite;
  locale: Locale;
}

export function SiteCard({ site, locale }: SiteCardProps) {
  const { t } = useI18n();
  const initial = site.name.charAt(0).toUpperCase();
  const cardRef = useRef<HTMLAnchorElement>(null);

  // 3D magnetic hover effect
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 800,
      scale: 1.02,
      boxShadow: 'var(--shadow-xl), var(--shadow-glow)',
      duration: 0.3,
      ease: 'power1.out',
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      boxShadow: 'var(--glass-shadow)',
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  return (
    <a
      ref={cardRef}
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card group flex flex-col p-5"
      data-card
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      <div className="flex items-start gap-3">
        {site.logo ? (
          <img
            src={`/logos/${site.logo}`}
            alt={site.name}
            className="h-10 w-10 flex-shrink-0 rounded-lg object-contain"
          />
        ) : (
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg font-bold"
            style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="truncate text-sm font-semibold"
              style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
            >
              {site.name}
            </h3>
            {site.pricing && (
              <span
                className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background:
                    site.pricing === 'free'
                      ? 'var(--color-primary-container)'
                      : site.pricing === 'freemium'
                        ? 'var(--color-surface-container-high)'
                        : 'var(--color-surface-container)',
                  color:
                    site.pricing === 'free'
                      ? 'var(--color-on-primary-container)'
                      : 'var(--color-on-surface-variant)',
                }}
              >
                {t(`pricing.${site.pricing}`)}
              </span>
            )}
            <ExternalLink
              className="h-3.5 w-3.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: 'var(--color-primary)' }}
            />
          </div>
          <p
            className="mt-1 line-clamp-2 text-xs leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {site.description[locale]}
          </p>
        </div>
      </div>

      {site.tags && site.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {site.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                background: 'var(--color-primary-container)',
                color: 'var(--color-on-primary-container)',
              }}
            >
              {resolveTag(tag, locale)}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
