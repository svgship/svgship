import type { Category } from '@/types';

export const categories: Category[] = [
  {
    slug: 'icons',
    name: { zh: '图标库', en: 'Icon Libraries' },
    description: {
      zh: '高质量 SVG 图标资源，覆盖通用图标、品牌图标、emoji 等',
      en: 'High-quality SVG icon resources covering universal, brand, and emoji icons',
    },
    icon: 'Grid3X3',
  },
  {
    slug: 'illustrations',
    name: { zh: '插画', en: 'Illustrations' },
    description: {
      zh: '免费矢量插画，适用于网页设计、PPT、社交媒体等场景',
      en: 'Free vector illustrations for web design, presentations, and social media',
    },
    icon: 'Paintbrush',
  },
  {
    slug: 'vectors',
    name: { zh: '矢量素材', en: 'Vector Resources' },
    description: {
      zh: '通用矢量素材库，包含模板、图案、背景等设计资源',
      en: 'General vector resources including templates, patterns, and backgrounds',
    },
    icon: 'Layers',
  },
  {
    slug: 'animations',
    name: { zh: 'SVG 动画', en: 'SVG Animations' },
    description: {
      zh: 'SVG 动画库、动态图标、Lottie 资源和动画生成工具',
      en: 'SVG animation libraries, animated icons, Lottie resources, and animation tools',
    },
    icon: 'Sparkles',
  },
];
