import { describe, it, expect } from 'vitest';
import { buildSiteTitle, buildSiteDescription, trimDescription } from './seo';

const baseSite = {
  id: 'svgrepo',
  name: 'SVGRepo',
  category: 'icons',
  description: {
    zh: '超过 50 万个免费 SVG 图标和插画',
    en: '500K+ free SVG icons and illustrations',
  },
  tags: ['线性', '面性', '彩色', '免费可商用'],
};

const toolSite = {
  id: 'lottiefiles',
  name: 'LottieFiles',
  category: 'tools',
  description: { zh: 'Lottie 动画社区', en: 'Lottie animation community' },
  tags: ['编辑器', '动画'],
  pricing: 'freemium' as const,
};

const tutorialSite = {
  id: 'mdn-svg-tutorial',
  name: 'MDN SVG Tutorial',
  category: 'tutorials',
  description: { zh: '官方教程', en: 'Official tutorial' },
  tags: ['基础入门'],
};

describe('buildSiteTitle', () => {
  it('produces category-aware titles in en', () => {
    expect(buildSiteTitle(baseSite, 'en')).toContain('SVGRepo');
    expect(buildSiteTitle(baseSite, 'en')).toMatch(/Icon/i);
    expect(buildSiteTitle(baseSite, 'en')).toContain('SVGShip');
  });

  it('produces category-aware titles in zh', () => {
    expect(buildSiteTitle(baseSite, 'zh')).toContain('SVGRepo');
    expect(buildSiteTitle(baseSite, 'zh')).toContain('图标');
  });

  it('differentiates across categories', () => {
    const iconsTitle = buildSiteTitle(baseSite, 'en');
    const toolsTitle = buildSiteTitle(toolSite, 'en');
    const tutorialTitle = buildSiteTitle(tutorialSite, 'en');
    expect(iconsTitle).not.toBe(toolsTitle);
    expect(toolsTitle).not.toBe(tutorialTitle);
    expect(toolsTitle).toMatch(/SVG (Editor|Tool)/i);
    expect(tutorialTitle).toMatch(/Tutorial|Learn/i);
  });

  it('is deterministic for the same id', () => {
    expect(buildSiteTitle(baseSite, 'en')).toBe(buildSiteTitle(baseSite, 'en'));
  });
});

describe('buildSiteDescription', () => {
  it('includes site name and base description', () => {
    const d = buildSiteDescription(baseSite, 'en');
    expect(d).toContain('SVGRepo');
    expect(d).toContain('500K+ free SVG icons');
  });

  it('injects localized tags for icons', () => {
    const en = buildSiteDescription(baseSite, 'en');
    const zh = buildSiteDescription(baseSite, 'zh');
    // en version should contain Linear/Filled/Colorful (localized from Chinese keys)
    expect(en).toMatch(/Linear|Filled|Colorful/);
    expect(zh).toMatch(/线性|面性|彩色/);
  });

  it('injects pricing for tools', () => {
    const en = buildSiteDescription(toolSite, 'en');
    const zh = buildSiteDescription(toolSite, 'zh');
    expect(en).toContain('freemium');
    expect(zh).toContain('免费增值');
  });

  it('falls back to tools category for unknown category', () => {
    const s = { ...baseSite, category: 'unknown' };
    expect(() => buildSiteTitle(s, 'en')).not.toThrow();
    expect(() => buildSiteDescription(s, 'en')).not.toThrow();
  });

  it('differentiates across categories', () => {
    const a = buildSiteDescription(baseSite, 'en');
    const b = buildSiteDescription(toolSite, 'en');
    expect(a).not.toBe(b);
  });
});

describe('trimDescription', () => {
  it('returns short text unchanged', () => {
    expect(trimDescription('short text')).toBe('short text');
  });

  it('trims at sentence boundary when possible', () => {
    const long = 'A'.repeat(100) + '. ' + 'B'.repeat(100);
    const out = trimDescription(long, 160);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('.')).toBe(true);
  });

  it('trims at space with ellipsis when no good punctuation', () => {
    const long = 'word '.repeat(60).trim();
    const out = trimDescription(long, 160);
    expect(out.length).toBeLessThanOrEqual(161); // 160 + ellipsis
    expect(out.endsWith('…')).toBe(true);
  });
});
