'use client';

import { useI18n } from '@/lib/i18n/context';
import { ExternalLink } from 'lucide-react';
import type { SvgSite } from '@/types';

interface SiteCardProps {
  site: SvgSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const { locale } = useI18n();

  const initial = site.name.charAt(0).toUpperCase();

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card group flex flex-col p-5 transition-all duration-300"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
      }}
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
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
