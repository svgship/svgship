import type { Locale } from '@/types';

/**
 * Single source of truth for all tag translations.
 * Keys are Chinese tag strings as stored in sites.json.
 * Values are {zh, en} pairs consistent with the Category data model.
 */
const tagTranslations: Record<string, { zh: string; en: string }> = {
  // ── Icons ──
  线性: { zh: '线性', en: 'Linear' },
  面性: { zh: '面性', en: 'Filled' },
  彩色: { zh: '彩色', en: 'Colorful' },
  扁平: { zh: '扁平', en: 'Flat' },
  '3D': { zh: '3D', en: '3D' },
  动态: { zh: '动态', en: 'Animated' },
  品牌Logo: { zh: '品牌Logo', en: 'Brand Logo' },

  // ── Illustrations ──
  人物插画: { zh: '人物插画', en: 'Character' },
  场景插画: { zh: '场景插画', en: 'Scene' },
  抽象图案: { zh: '抽象图案', en: 'Abstract' },
  背景生成器: { zh: '背景生成器', en: 'BG Generator' },
  矢量纹理: { zh: '矢量纹理', en: 'Texture' },

  // ── Tools ──
  编辑器: { zh: '编辑器', en: 'Editor' },
  优化压缩: { zh: '优化压缩', en: 'Optimizer' },
  格式转换: { zh: '格式转换', en: 'Converter' },
  代码生成: { zh: '代码生成', en: 'Code Gen' },
  'AI 生成': { zh: 'AI 生成', en: 'AI Generator' },
  图标字体管理: { zh: '图标字体管理', en: 'Icon Font' },

  // Ad-hoc tags used in sites (not in predefined contentTags)
  动画: { zh: '动画', en: 'Animation' },
  转换: { zh: '转换', en: 'Convert' },

  // ── Learn ──
  基础入门: { zh: '基础入门', en: 'Basics' },
  动画进阶: { zh: '动画进阶', en: 'Animation' },
  路径与滤镜: { zh: '路径与滤镜', en: 'Paths & Filters' },
  实战案例: { zh: '实战案例', en: 'Case Studies' },
  工具教程: { zh: '工具教程', en: 'Tool Tutorials' },

  // ── Inspiration ──
  网页交互: { zh: '网页交互', en: 'Web Interaction' },
  动画作品: { zh: '动画作品', en: 'Animation Works' },
  生成艺术: { zh: '生成艺术', en: 'Generative Art' },
  'SVG 实验': { zh: 'SVG 实验', en: 'SVG Experiments' },
  'CodePen 集合': { zh: 'CodePen 集合', en: 'CodePen Collections' },

  // ── License ──
  免费可商用: { zh: '免费可商用', en: 'Free Commercial' },
  需署名: { zh: '需署名', en: 'Attribution' },
  仅个人免费: { zh: '仅个人免费', en: 'Personal Free' },
  付费: { zh: '付费', en: 'Paid' },
  免费: { zh: '免费', en: 'Free' },
  免费增值: { zh: '免费增值', en: 'Freemium' },
};

/**
 * Resolve a tag key (Chinese) to its localized display string.
 * Falls back to the raw key if no translation is found.
 */
export function resolveTag(tagKey: string, locale: Locale): string {
  return tagTranslations[tagKey]?.[locale] ?? tagKey;
}

/**
 * Get the tag translation object for a given Chinese key.
 * Returns undefined if no translation exists.
 */
export function getTagTranslation(tagKey: string): { zh: string; en: string } | undefined {
  return tagTranslations[tagKey];
}

/**
 * Get the full translation map (useful for building lookup at build time).
 */
export { tagTranslations };
