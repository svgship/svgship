import type { Locale } from '@/types';
import { resolveTag } from './tags';

type CategorySlug = 'icons' | 'illustrations' | 'tools' | 'tutorials' | 'inspiration';

interface SiteLike {
  id: string;
  name: string;
  category: string;
  description: { zh: string; en: string };
  tags?: string[];
  pricing?: 'free' | 'paid' | 'freemium';
}

const LICENSE_TAG_KEYS = ['免费可商用', '需署名', '仅个人免费', '付费'];

/**
 * Deterministic hash from site id, used to pick a template variant
 * so sibling pages don't share identical phrasing.
 */
function hashOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Pick top-N localized content tags (excluding license tags) for SEO phrases. */
function pickContentTags(site: SiteLike, locale: Locale, max = 2): string[] {
  if (!site.tags) return [];
  return site.tags
    .filter((t) => !LICENSE_TAG_KEYS.includes(t))
    .slice(0, max)
    .map((t) => resolveTag(t, locale));
}

function pickLicenseTag(site: SiteLike, locale: Locale): string | null {
  const tag = site.tags?.find((t) => LICENSE_TAG_KEYS.includes(t));
  return tag ? resolveTag(tag, locale) : null;
}

function pricingWord(site: SiteLike, locale: Locale): string | null {
  if (!site.pricing) return null;
  const map = {
    free: { zh: '免费', en: 'free' },
    freemium: { zh: '免费增值', en: 'freemium' },
    paid: { zh: '付费', en: 'paid' },
  } as const;
  return map[site.pricing][locale];
}

/* ── Title templates ─────────────────────────────────────────── */

type TitleTemplate = (site: SiteLike, ctx: { tags: string[]; locale: Locale }) => string;

const titleTemplates: Record<CategorySlug, Record<Locale, TitleTemplate[]>> = {
  icons: {
    en: [
      (s, { tags }) =>
        `${s.name} — Free SVG Icon Library${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) =>
        `${s.name} — ${tags[0] ? `${tags[0]} ` : ''}SVG Icons for UI Design | SVGShip`,
    ],
    zh: [
      (s, { tags }) => `${s.name} — 免费 SVG 图标库${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) => `${s.name} — ${tags[0] ? `${tags[0]}` : ''} SVG 图标资源 | SVGShip`,
    ],
  },
  illustrations: {
    en: [
      (s, { tags }) =>
        `${s.name} — Free Vector Illustrations${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) =>
        `${s.name} — ${tags[0] ? `${tags[0]} ` : ''}Vector Art & Illustrations | SVGShip`,
    ],
    zh: [
      (s, { tags }) => `${s.name} — 免费矢量插画库${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) => `${s.name} — ${tags[0] ? `${tags[0]}` : ''} 矢量插画素材 | SVGShip`,
    ],
  },
  tools: {
    en: [
      (s, { tags }) => `${s.name} — SVG ${tags[0] ?? 'Tool'} for Designers | SVGShip`,
      (s, { tags }) => `${s.name} — ${tags[0] ? `${tags[0]} · ` : ''}SVG Tool Review | SVGShip`,
    ],
    zh: [
      (s, { tags }) => `${s.name} — SVG ${tags[0] ?? '工具'}（设计师/开发者）| SVGShip`,
      (s, { tags }) => `${s.name} — ${tags[0] ? `${tags[0]} · ` : ''}SVG 工具评测 | SVGShip`,
    ],
  },
  tutorials: {
    en: [
      (s, { tags }) => `${s.name} — SVG Tutorial${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) => `Learn SVG with ${s.name}${tags[0] ? ` — ${tags[0]}` : ''} | SVGShip`,
    ],
    zh: [
      (s, { tags }) => `${s.name} — SVG 教程${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) => `${s.name} — ${tags[0] ? `${tags[0]} · ` : ''}SVG 学习资源 | SVGShip`,
    ],
  },
  inspiration: {
    en: [
      (s, { tags }) => `${s.name} — SVG Inspiration${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) => `${s.name} — ${tags[0] ? `${tags[0]} ` : ''}SVG Showcase | SVGShip`,
    ],
    zh: [
      (s, { tags }) => `${s.name} — SVG 灵感${tags[0] ? ` · ${tags[0]}` : ''} | SVGShip`,
      (s, { tags }) => `${s.name} — ${tags[0] ? `${tags[0]} ` : ''}SVG 创意案例 | SVGShip`,
    ],
  },
};

/* ── Description templates ───────────────────────────────────── */

type DescriptionTemplate = (
  site: SiteLike,
  ctx: { tags: string[]; license: string | null; pricing: string | null; locale: Locale }
) => string;

const descriptionTemplates: Record<CategorySlug, Record<Locale, DescriptionTemplate[]>> = {
  icons: {
    en: [
      (s, { tags, license }) => {
        const tagPhrase = tags.length ? ` in ${tags.join(' and ')} styles` : '';
        const licensePhrase = license ? ` ${license} license.` : '';
        return `${s.name} is a curated SVG icon library${tagPhrase}. ${s.description.en}${licensePhrase} Browse features, pricing and similar icon libraries on SVGShip.`;
      },
      (s, { tags, license }) => {
        const licensePhrase = license ? ` (${license})` : '';
        return `Explore ${s.name}${licensePhrase} — ${s.description.en} See how it compares to other SVG icon sets${tags.length ? ` in ${tags[0]}` : ''} on SVGShip.`;
      },
    ],
    zh: [
      (s, { tags, license }) => {
        const tagPhrase = tags.length ? `，覆盖${tags.join('、')}等风格` : '';
        const licensePhrase = license ? `（${license}）` : '';
        return `${s.name} 是精选的 SVG 图标库${tagPhrase}${licensePhrase}。${s.description.zh} 在 SVGShip 查看功能详情、定价和相似图标库。`;
      },
      (s, { tags, license }) => {
        const licensePhrase = license ? `（${license}）` : '';
        return `${s.name} 图标资源${licensePhrase}：${s.description.zh} SVGShip 为你整理${tags.length ? ` ${tags[0]} 风格下` : ''}其他同类 SVG 图标集对比。`;
      },
    ],
  },
  illustrations: {
    en: [
      (s, { tags, license }) => {
        const tagPhrase = tags.length ? ` focused on ${tags.join(' and ')}` : '';
        const licensePhrase = license ? ` Licensed as ${license}.` : '';
        return `${s.name} offers vector illustrations${tagPhrase}. ${s.description.en}${licensePhrase} Compare styles and pricing on SVGShip.`;
      },
      (s, { license }) => {
        const licensePhrase = license ? ` (${license})` : '';
        return `${s.name} illustration library${licensePhrase} — ${s.description.en} See feature details, alternatives and usage tips on SVGShip.`;
      },
    ],
    zh: [
      (s, { tags, license }) => {
        const tagPhrase = tags.length ? `，主打${tags.join('与')}` : '';
        const licensePhrase = license ? `，授权：${license}` : '';
        return `${s.name} 提供矢量插画素材${tagPhrase}${licensePhrase}。${s.description.zh} 在 SVGShip 查看风格对比、定价与替代方案。`;
      },
      (s, { license }) => {
        const licensePhrase = license ? `（${license}）` : '';
        return `${s.name} 插画资源${licensePhrase}：${s.description.zh} SVGShip 整理了功能详情、相似插画库与使用建议。`;
      },
    ],
  },
  tools: {
    en: [
      (s, { tags, pricing }) => {
        const pricingPhrase = pricing ? ` Pricing: ${pricing}.` : '';
        return `${s.name} is an SVG ${tags[0] ?? 'tool'} for design & dev workflows. ${s.description.en}${pricingPhrase} See features, alternatives and user reviews on SVGShip.`;
      },
      (s, { tags, pricing }) => {
        const pricingPhrase = pricing ? ` (${pricing})` : '';
        return `${s.name}${pricingPhrase} — ${s.description.en} Compare with other SVG ${tags[0] ?? 'tools'} on SVGShip.`;
      },
    ],
    zh: [
      (s, { tags, pricing }) => {
        const pricingPhrase = pricing ? `，定价：${pricing}` : '';
        return `${s.name} 是面向设计与开发工作流的 SVG ${tags[0] ?? '工具'}${pricingPhrase}。${s.description.zh} 在 SVGShip 查看功能、定价与同类工具对比。`;
      },
      (s, { tags, pricing }) => {
        const pricingPhrase = pricing ? `（${pricing}）` : '';
        return `${s.name} 工具${pricingPhrase}：${s.description.zh} SVGShip 为你整理${tags[0] ? `其他 ${tags[0]} 类` : '同类'} SVG 工具横向对比。`;
      },
    ],
  },
  tutorials: {
    en: [
      (s, { tags }) => {
        const tagPhrase = tags.length ? ` covering ${tags.join(' and ')}` : '';
        return `Learn SVG with ${s.name}${tagPhrase}. ${s.description.en} Find more SVG tutorials, courses and learning paths on SVGShip.`;
      },
      (s, { tags }) =>
        `${s.name} — ${s.description.en} Browse more ${tags[0] ?? 'SVG'} learning resources curated on SVGShip.`,
    ],
    zh: [
      (s, { tags }) => {
        const tagPhrase = tags.length ? `，涵盖${tags.join('与')}` : '';
        return `通过 ${s.name} 学习 SVG${tagPhrase}。${s.description.zh} SVGShip 还整理了更多 SVG 教程、课程与学习路径。`;
      },
      (s, { tags }) =>
        `${s.name}：${s.description.zh} 在 SVGShip 浏览更多${tags[0] ?? 'SVG'}学习资源。`,
    ],
  },
  inspiration: {
    en: [
      (s, { tags }) => {
        const tagPhrase = tags.length ? ` featuring ${tags.join(' and ')}` : '';
        return `${s.name} showcases inspiring SVG work${tagPhrase}. ${s.description.en} Discover more SVG galleries and showcases on SVGShip.`;
      },
      (s, { tags }) =>
        `${s.name} — ${s.description.en} Explore more ${tags[0] ?? 'SVG'} inspiration curated on SVGShip.`,
    ],
    zh: [
      (s, { tags }) => {
        const tagPhrase = tags.length ? `，呈现${tags.join('与')}作品` : '';
        return `${s.name} 展示 SVG 创意灵感${tagPhrase}。${s.description.zh} 在 SVGShip 发现更多 SVG 画廊与作品集。`;
      },
      (s, { tags }) =>
        `${s.name}：${s.description.zh} SVGShip 精选了更多${tags[0] ?? 'SVG'}灵感案例。`,
    ],
  },
};

/* ── Public API ──────────────────────────────────────────────── */

const FALLBACK_CATEGORY: CategorySlug = 'tools';

export function buildSiteTitle(site: SiteLike, locale: Locale): string {
  const cat =
    (site.category as CategorySlug) in titleTemplates
      ? (site.category as CategorySlug)
      : FALLBACK_CATEGORY;
  const tags = pickContentTags(site, locale);
  const templates = titleTemplates[cat][locale];
  const idx = hashOf(site.id) % templates.length;
  return templates[idx](site, { tags, locale });
}

export function buildSiteDescription(site: SiteLike, locale: Locale): string {
  const cat =
    (site.category as CategorySlug) in descriptionTemplates
      ? (site.category as CategorySlug)
      : FALLBACK_CATEGORY;
  const tags = pickContentTags(site, locale);
  const license = pickLicenseTag(site, locale);
  const pricing = pricingWord(site, locale);
  const templates = descriptionTemplates[cat][locale];
  const idx = hashOf(site.id) % templates.length;
  return templates[idx](site, { tags, license, pricing, locale });
}

/** Trim to a sane length for meta description, keeping word boundaries. */
export function trimDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  // try to cut at last sentence end / space
  const lastPunct = Math.max(
    cut.lastIndexOf('. '),
    cut.lastIndexOf('。'),
    cut.lastIndexOf('，'),
    cut.lastIndexOf(', ')
  );
  if (lastPunct > max * 0.6) return cut.slice(0, lastPunct + 1).trimEnd();
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
