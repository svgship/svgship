# SVG 资源导航站实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 SVGShip 从 SVG 处理工具站转型为专业 SVG 资源导航站，单页展示四个分类的外部 SVG 资源网站。

**Architecture:** 单页导航站，首页即全部内容。静态 JSON 数据驱动，前端搜索过滤。保留现有 Next.js 16 + Tailwind CSS 4 + i18n 技术栈，移除所有 SVG 处理工具代码和依赖。

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, Lucide React

---

## 文件变更总览

### 删除

- `src/app/[locale]/tools/` 整个目录（4 个工具页）
- `src/app/[locale]/templates/` 整个目录（模板列表 + 详情页）
- `src/lib/svg/` 整个目录（SVG 处理工具库 + 测试）
- `src/lib/templates/` 整个目录
- `src/components/ui/FileDropzone.tsx`
- `src/components/ui/DownloadButton.tsx`
- `src/components/ui/ToolPageLayout.tsx`
- `src/components/ui/index.ts`
- `src/types/index.ts`（重写）
- `public/templates/` 目录
- `public/templates.json`

### 创建

- `src/data/sites.json` — 网站数据
- `src/data/categories.ts` — 分类定义
- `src/components/SiteCard.tsx` — 网站卡片组件
- `src/components/CategorySection.tsx` — 分类区块组件
- `src/components/HeroSearch.tsx` — Hero + 搜索组件

### 修改

- `src/app/layout.tsx` — 更新 metadata
- `src/app/[locale]/page.tsx` — 完全重写为导航首页
- `src/components/layout/Header.tsx` — 改为分类锚点导航
- `src/components/layout/Footer.tsx` — 简化
- `src/components/layout/index.ts` — 移除 UI 组件导出
- `src/lib/i18n/locales/en.json` — 替换翻译
- `src/lib/i18n/locales/zh.json` — 替换翻译
- `src/middleware.ts` — 保持不变
- `package.json` — 移除依赖

---

## Task 1: 清理旧代码和依赖

**Files:**

- Delete: `src/app/[locale]/tools/` (整个目录)
- Delete: `src/app/[locale]/templates/` (整个目录)
- Delete: `src/lib/svg/` (整个目录)
- Delete: `src/lib/templates/` (整个目录)
- Delete: `src/components/ui/FileDropzone.tsx`
- Delete: `src/components/ui/DownloadButton.tsx`
- Delete: `src/components/ui/ToolPageLayout.tsx`
- Delete: `src/components/ui/index.ts`
- Delete: `public/templates/` (整个目录)
- Delete: `public/templates.json`
- Modify: `package.json`

- [ ] **Step 1: 删除工具页面**

```bash
rm -rf src/app/\[locale\]/tools
rm -rf src/app/\[locale\]/templates
```

- [ ] **Step 2: 删除工具库和模板库**

```bash
rm -rf src/lib/svg
rm -rf src/lib/templates
```

- [ ] **Step 3: 删除 UI 工具组件**

```bash
rm src/components/ui/FileDropzone.tsx
rm src/components/ui/DownloadButton.tsx
rm src/components/ui/ToolPageLayout.tsx
rm src/components/ui/index.ts
rmdir src/components/ui 2>/dev/null || true
```

- [ ] **Step 4: 删除模板公共资源**

```bash
rm -rf public/templates
rm public/templates.json
```

- [ ] **Step 5: 移除 npm 依赖**

```bash
pnpm remove potrace svgo dompurify
pnpm remove -D @types/svgo
```

- [ ] **Step 6: 验证清理完成**

```bash
pnpm type-check
```

Expected: 类型检查应报错（因为 page.tsx 引用了已删除的模块），这是正常的，后续任务会修复。

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "chore: remove SVG tools, templates, and related dependencies"
```

---

## Task 2: 定义类型和数据结构

**Files:**

- Create: `src/types/index.ts` (重写)
- Create: `src/data/categories.ts`
- Create: `src/data/sites.json`

- [ ] **Step 1: 重写类型定义**

```ts
// src/types/index.ts
export type CategorySlug = 'icons' | 'illustrations' | 'vectors' | 'animations';

export interface SvgSite {
  id: string;
  name: string;
  url: string;
  description: {
    zh: string;
    en: string;
  };
  logo?: string;
  category: CategorySlug;
  tags?: string[];
  featured?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  icon: string;
}

export type Locale = 'en' | 'zh';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
```

- [ ] **Step 2: 创建分类定义**

```ts
// src/data/categories.ts
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
```

- [ ] **Step 3: 创建初始网站数据**

创建 `src/data/sites.json`，包含 15-20 个真实 SVG 资源网站，覆盖四个分类。每个分类至少 3 个网站。数据格式：

```json
[
  {
    "id": "svgrepo",
    "name": "SVGRepo",
    "url": "https://www.svgrepo.com",
    "description": {
      "zh": "超过 50 万个免费 SVG 图标和插画，支持在线编辑和批量下载",
      "en": "500K+ free SVG icons and illustrations with online editing and bulk download"
    },
    "category": "icons",
    "tags": ["免费", "开源"],
    "featured": true
  }
]
```

收录以下网站（每个至少填 name, url, description 中英文, category）：

**icons:**

1. SVGRepo — https://www.svgrepo.com
2. Lucide — https://lucide.dev
3. Iconify — https://iconify.design
4. Heroicons — https://heroicons.com

**illustrations:** 5. unDraw — https://undraw.co 6. Storyset — https://storyset.com 7. Humaaans — https://www.humaaans.com 8. Open Peeps — https://openpeeps.com

**vectors:** 9. Freepik — https://www.freepik.com 10. Vecteezy — https://www.vecteezy.com 11. Mixkit — https://mixkit.co 12. DrawKit — https://www.drawkit.com

**animations:** 13. LottieFiles — https://lottiefiles.com 14. Lordicon — https://lordicon.com 15. SVGator — https://www.svgator.com 16. Keyshape — https://www.keyshapeapp.com

- [ ] **Step 4: 验证类型正确**

```bash
pnpm type-check
```

Expected: 应该报错（page.tsx 等文件还引用旧类型），但新文件本身类型正确。

- [ ] **Step 5: 提交**

```bash
git add src/types/index.ts src/data/
git commit -m "feat: add site data types and initial site entries"
```

---

## Task 3: 更新 i18n 翻译

**Files:**

- Modify: `src/lib/i18n/locales/en.json`
- Modify: `src/lib/i18n/locales/zh.json`

- [ ] **Step 1: 替换英文翻译**

```json
{
  "common": {
    "appName": "SVGShip",
    "tagline": "Professional SVG Resource Directory",
    "search": "Search",
    "visit": "Visit",
    "noResults": "No results found",
    "noResultsHint": "Try a different search term",
    "allRightsReserved": "All rights reserved"
  },
  "nav": {
    "icons": "Icons",
    "illustrations": "Illustrations",
    "vectors": "Vectors",
    "animations": "Animations",
    "language": "Language"
  },
  "hero": {
    "title": "SVG Resource Directory",
    "subtitle": "Curated collection of the best SVG resources — icons, illustrations, vectors, and animations",
    "searchPlaceholder": "Search SVG resources..."
  },
  "footer": {
    "description": "Curated SVG resource directory for designers, developers, and creators.",
    "categories": "Categories",
    "about": "About",
    "contact": "Contact",
    "copyright": "© {year} SVGShip. All rights reserved."
  }
}
```

- [ ] **Step 2: 替换中文翻译**

```json
{
  "common": {
    "appName": "SVGShip",
    "tagline": "专业 SVG 资源导航",
    "search": "搜索",
    "visit": "访问",
    "noResults": "没有找到结果",
    "noResultsHint": "试试其他搜索关键词",
    "allRightsReserved": "保留所有权利"
  },
  "nav": {
    "icons": "图标库",
    "illustrations": "插画",
    "vectors": "矢量素材",
    "animations": "SVG 动画",
    "language": "语言"
  },
  "hero": {
    "title": "SVG 资源导航",
    "subtitle": "精选优质 SVG 资源合集 — 图标、插画、矢量素材、动画",
    "searchPlaceholder": "搜索 SVG 资源..."
  },
  "footer": {
    "description": "为设计师、开发者和创作者精选的 SVG 资源导航站。",
    "categories": "分类",
    "about": "关于",
    "contact": "联系我们",
    "copyright": "© {year} SVGShip. 保留所有权利。"
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add src/lib/i18n/locales/
git commit -m "feat: update i18n translations for navigation site"
```

---

## Task 4: 重写 Header 组件

**Files:**

- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/index.ts`

- [ ] **Step 1: 重写 Header**

将 Header 从工具导航改为分类锚点导航。保留 Logo、i18n 切换、暗色模式切换。

```tsx
// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { ThemeToggle } from './ThemeToggle';
import { Grid3X3, Paintbrush, Layers, Sparkles } from 'lucide-react';
import type { CategorySlug } from '@/types';

const navItems: { slug: CategorySlug; icon: typeof Grid3X3; labelKey: string }[] = [
  { slug: 'icons', icon: Grid3X3, labelKey: 'nav.icons' },
  { slug: 'illustrations', icon: Paintbrush, labelKey: 'nav.illustrations' },
  { slug: 'vectors', icon: Layers, labelKey: 'nav.vectors' },
  { slug: 'animations', icon: Sparkles, labelKey: 'nav.animations' },
];

export function Header() {
  const { locale, setLocale, t } = useI18n();

  const scrollToCategory = (slug: string) => {
    const el = document.getElementById(`category-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(99,102,241,0.04)',
      }}
    >
      <Link
        href={`/${locale}`}
        className="flex items-center gap-2.5 text-xl font-bold transition-all duration-200 hover:scale-[1.02]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <img src="/logo.svg" alt="SVGShip Logo" className="h-7 w-7" />
        <span className="gradient-text">SVGShip</span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.slug}
              onClick={() => scrollToCategory(item.slug)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
              style={{ color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.background = 'var(--color-primary-container)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          aria-label={t('nav.language')}
          className="rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
          style={{
            color: 'var(--color-on-surface-variant)',
            background: 'var(--color-surface-container)',
            border: '1px solid var(--glass-border)',
          }}
          onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-container-high)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-container)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--color-on-surface-variant)';
          }}
        >
          {locale === 'en' ? '中文' : 'EN'}
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 更新 index.ts 导出**

```ts
// src/components/layout/index.ts
export { Header } from './Header';
export { Footer } from './Footer';
export { ThemeToggle } from './ThemeToggle';
```

- [ ] **Step 3: 提交**

```bash
git add src/components/layout/
git commit -m "feat: rewrite Header with category anchor navigation"
```

---

## Task 5: 创建网站卡片组件

**Files:**

- Create: `src/components/SiteCard.tsx`

- [ ] **Step 1: 创建 SiteCard 组件**

```tsx
// src/components/SiteCard.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import { ExternalLink } from 'lucide-react';
import type { SvgSite } from '@/types';

interface SiteCardProps {
  site: SvgSite;
}

export function SiteCard({ site }: SiteCardProps) {
  const { locale, t } = useI18n();

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
```

- [ ] **Step 2: 提交**

```bash
git add src/components/SiteCard.tsx
git commit -m "feat: add SiteCard component"
```

---

## Task 6: 创建分类区块组件

**Files:**

- Create: `src/components/CategorySection.tsx`

- [ ] **Step 1: 创建 CategorySection 组件**

```tsx
// src/components/CategorySection.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import { Grid3X3, Paintbrush, Layers, Sparkles } from 'lucide-react';
import { SiteCard } from './SiteCard';
import type { Category, SvgSite } from '@/types';

const iconMap: Record<string, typeof Grid3X3> = {
  Grid3X3,
  Paintbrush,
  Layers,
  Sparkles,
};

interface CategorySectionProps {
  category: Category;
  sites: SvgSite[];
}

export function CategorySection({ category, sites }: CategorySectionProps) {
  const { locale } = useI18n();
  const Icon = iconMap[category.icon] ?? Grid3X3;

  const sortedSites = [...sites].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section
      id={`category-${category.slug}`}
      className="px-4 py-16"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sortedSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/CategorySection.tsx
git commit -m "feat: add CategorySection component"
```

---

## Task 7: 创建 Hero + 搜索组件

**Files:**

- Create: `src/components/HeroSearch.tsx`

- [ ] **Step 1: 创建 HeroSearch 组件**

```tsx
// src/components/HeroSearch.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import { Search } from 'lucide-react';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeroSearch({ searchQuery, onSearchChange }: HeroSearchProps) {
  const { t } = useI18n();

  return (
    <section
      className="relative flex flex-col items-center px-4 py-20 text-center"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="animate-slide-up relative z-10">
        <h1
          className="mx-auto max-w-3xl text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('hero.title')}
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {t('hero.subtitle')}
        </p>

        <div className="relative mx-auto mt-8 max-w-lg">
          <Search
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
            style={{ color: 'var(--color-on-surface-variant)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('hero.searchPlaceholder')}
            className="w-full rounded-xl py-3.5 pr-4 pl-12 text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-on-surface)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/HeroSearch.tsx
git commit -m "feat: add HeroSearch component"
```

---

## Task 8: 重写首页

**Files:**

- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: 重写首页为导航站**

```tsx
// src/app/[locale]/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSearch } from '@/components/HeroSearch';
import { CategorySection } from '@/components/CategorySection';
import { SiteCard } from '@/components/SiteCard';
import { categories } from '@/data/categories';
import sitesData from '@/data/sites.json';
import type { SvgSite } from '@/types';

const sites: SvgSite[] = sitesData;

export default function Home() {
  const { locale, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return sites.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.description[locale].toLowerCase().includes(query) ||
        site.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, locale]);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <HeroSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {filteredSites ? (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-6xl">
              {filteredSites.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredSites.map((site) => (
                    <SiteCard key={site.id} site={site} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-lg font-medium" style={{ color: 'var(--color-on-surface)' }}>
                    {t('common.noResults')}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {t('common.noResultsHint')}
                  </p>
                </div>
              )}
            </div>
          </section>
        ) : (
          categories.map((category) => {
            const categorySites = sites.filter((site) => site.category === category.slug);
            return (
              <CategorySection key={category.slug} category={category} sites={categorySites} />
            );
          })
        )}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
pnpm type-check
```

Expected: 通过。

- [ ] **Step 3: 提交**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: rewrite homepage as SVG resource navigation"
```

---

## Task 9: 简化 Footer

**Files:**

- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: 重写 Footer**

```tsx
// src/components/layout/Footer.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import { Ship } from 'lucide-react';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t px-6 py-12"
      style={{ borderColor: 'var(--color-outline-variant)' }}
    >
      <div
        className="absolute top-0 left-0 h-px w-full"
        style={{ background: 'var(--gradient-primary)', opacity: 0.3 }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Ship className="h-4 w-4 text-white" />
            </span>
            <span
              className="gradient-text text-lg font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              SVGShip
            </span>
          </div>
          <p className="text-center text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('footer.description')}
          </p>
          <p className="text-center text-xs" style={{ color: 'var(--color-outline)' }}>
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: simplify Footer for navigation site"
```

---

## Task 10: 更新 metadata 和根布局

**Files:**

- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 更新 metadata**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SVGShip — Professional SVG Resource Directory',
    template: '%s | SVGShip',
  },
  description:
    'Curated collection of the best SVG resources — free icon libraries, illustrations, vector materials, and SVG animations for designers and developers.',
  keywords: [
    'SVG',
    'SVG icons',
    'SVG illustrations',
    'vector graphics',
    'SVG animations',
    'free icons',
    'design resources',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/layout.tsx
git commit -m "feat: update metadata for SVG resource directory"
```

---

## Task 11: 验证和最终清理

**Files:**

- 检查所有文件

- [ ] **Step 1: 类型检查**

```bash
pnpm type-check
```

Expected: 无错误。

- [ ] **Step 2: 运行构建**

```bash
pnpm build
```

Expected: 构建成功。

- [ ] **Step 3: 启动开发服务器验证**

```bash
pnpm dev
```

在浏览器中验证：

- 首页加载正常
- 四个分类区块显示
- 网站卡片正确渲染
- 搜索过滤工作
- 中英文切换工作
- 暗色模式切换工作
- Header 锚点滚动工作
- 响应式布局正常

- [ ] **Step 4: 修复发现的问题**

如果有任何问题，在此步骤修复。

- [ ] **Step 5: 最终提交**

```bash
git add -A
git commit -m "feat: complete SVG resource navigation site MVP"
```

---

## 实施顺序

| 顺序 | 任务                 | 依赖    |
| ---- | -------------------- | ------- |
| 1    | 清理旧代码和依赖     | 无      |
| 2    | 定义类型和数据结构   | 1       |
| 3    | 更新 i18n 翻译       | 1       |
| 4    | 重写 Header          | 2, 3    |
| 5    | 创建 SiteCard        | 2       |
| 6    | 创建 CategorySection | 2, 5    |
| 7    | 创建 HeroSearch      | 3       |
| 8    | 重写首页             | 4, 6, 7 |
| 9    | 简化 Footer          | 3       |
| 10   | 更新 metadata        | 无      |
| 11   | 验证和最终清理       | 1-10    |
