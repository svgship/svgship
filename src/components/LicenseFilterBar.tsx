'use client';

const licenseTags = [
  { key: '免费可商用', en: 'Free Commercial', zh: '免费可商用' },
  { key: '需署名', en: 'Attribution', zh: '需署名' },
  { key: '仅个人免费', en: 'Personal Free', zh: '仅个人免费' },
] as const;

const pricingTags = [
  { key: '免费', en: 'Free', zh: '免费' },
  { key: '免费增值', en: 'Freemium', zh: '免费增值' },
  { key: '付费', en: 'Paid', zh: '付费' },
] as const;

interface LicenseFilterBarProps {
  activeTags: string[];
  onToggle: (tag: string) => void;
  locale: 'en' | 'zh';
}

export function LicenseFilterBar({ activeTags, onToggle, locale }: LicenseFilterBarProps) {
  const allTags = [...licenseTags, ...pricingTags];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-4">
      {allTags.map((tag) => {
        const isActive = activeTags.includes(tag.key);
        const label = locale === 'zh' ? tag.zh : tag.en;
        return (
          <button
            key={tag.key}
            onClick={() => onToggle(tag.key)}
            className="rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200"
            style={{
              background: isActive ? 'var(--color-primary)' : 'var(--color-surface-container)',
              color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--glass-border)'}`,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
