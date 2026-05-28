import type { Category } from '@/types';

export const categories: Category[] = [
  {
    slug: 'icons',
    name: { zh: '图标', en: 'Icons' },
    description: {
      zh: '高质量 SVG 图标资源，覆盖线性、面性、彩色、3D 等多种风格',
      en: 'High-quality SVG icon resources in linear, filled, colorful, 3D and more styles',
    },
    icon: 'Grid3X3',
    contentTags: [
      { zh: '线性', en: 'Linear' },
      { zh: '面性', en: 'Filled' },
      { zh: '彩色', en: 'Colorful' },
      { zh: '扁平', en: 'Flat' },
      { zh: '3D', en: '3D' },
      { zh: '动态', en: 'Animated' },
      { zh: '品牌Logo', en: 'Brand Logo' },
    ],
    licenseTags: [
      { zh: '免费可商用', en: 'Free Commercial' },
      { zh: '需署名', en: 'Attribution' },
      { zh: '仅个人免费', en: 'Personal Free' },
      { zh: '付费', en: 'Paid' },
    ],
  },
  {
    slug: 'illustrations',
    name: { zh: '插画与背景', en: 'Illustrations & Backgrounds' },
    description: {
      zh: '矢量插画、背景生成器和纹理素材，适用于网页设计和产品界面',
      en: 'Vector illustrations, background generators, and textures for web and product design',
    },
    icon: 'Paintbrush',
    contentTags: [
      { zh: '人物插画', en: 'Character' },
      { zh: '场景插画', en: 'Scene' },
      { zh: '抽象图案', en: 'Abstract' },
      { zh: '背景生成器', en: 'BG Generator' },
      { zh: '矢量纹理', en: 'Texture' },
    ],
    licenseTags: [
      { zh: '免费可商用', en: 'Free Commercial' },
      { zh: '需署名', en: 'Attribution' },
      { zh: '仅个人免费', en: 'Personal Free' },
      { zh: '付费', en: 'Paid' },
    ],
  },
  {
    slug: 'tools',
    name: { zh: '工具', en: 'Tools' },
    description: {
      zh: 'SVG 编辑器、优化压缩、格式转换、AI 生成等实用工具',
      en: 'SVG editors, optimizers, converters, AI generators and other practical tools',
    },
    icon: 'Wrench',
    contentTags: [
      { zh: '编辑器', en: 'Editor' },
      { zh: '优化压缩', en: 'Optimizer' },
      { zh: '格式转换', en: 'Converter' },
      { zh: '代码生成', en: 'Code Gen' },
      { zh: 'AI 生成', en: 'AI Generator' },
      { zh: '图标字体管理', en: 'Icon Font' },
    ],
    hasPricing: true,
  },
  {
    slug: 'tutorials',
    name: { zh: '教程与文章', en: 'Learn' },
    description: {
      zh: 'SVG 基础入门、动画进阶、路径滤镜、实战案例等学习资源',
      en: 'SVG basics, animation, paths, filters, and hands-on tutorials',
    },
    icon: 'BookOpen',
    contentTags: [
      { zh: '基础入门', en: 'Basics' },
      { zh: '动画进阶', en: 'Animation' },
      { zh: '路径与滤镜', en: 'Paths & Filters' },
      { zh: '实战案例', en: 'Case Studies' },
      { zh: '工具教程', en: 'Tool Tutorials' },
    ],
  },
  {
    slug: 'inspiration',
    name: { zh: '灵感', en: 'Inspiration' },
    description: {
      zh: 'SVG 交互作品、动画案例、生成艺术和 CodePen 创意合集',
      en: 'SVG interactions, animations, generative art, and CodePen creative collections',
    },
    icon: 'Lightbulb',
    contentTags: [
      { zh: '网页交互', en: 'Web Interaction' },
      { zh: '动画作品', en: 'Animation Works' },
      { zh: '生成艺术', en: 'Generative Art' },
      { zh: 'SVG 实验', en: 'SVG Experiments' },
      { zh: 'CodePen 集合', en: 'CodePen Collections' },
    ],
  },
];
