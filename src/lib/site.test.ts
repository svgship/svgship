import { describe, it, expect } from 'vitest';
import { SITE_URL, absoluteUrl, CATEGORY_SLUGS, LOCALES, DEFAULT_LOCALE } from './site';
import { categories } from '@/data/categories';
import sitesData from '@/data/sites.json';

describe('absoluteUrl', () => {
  it('拼接相对路径', () => {
    expect(absoluteUrl('/zh/icons')).toBe('https://www.svgship.com/zh/icons');
    expect(absoluteUrl('logo.png')).toBe('https://www.svgship.com/logo.png');
    expect(absoluteUrl()).toBe('https://www.svgship.com');
  });

  it('已经是绝对 URL 时原样返回', () => {
    expect(absoluteUrl('https://example.com/a.png')).toBe('https://example.com/a.png');
    expect(absoluteUrl('http://example.com')).toBe('http://example.com');
  });

  it('永远不产生裸域 —— 裸域 svgship.com 没有 DNS 记录', () => {
    for (const path of ['/', '', '/logo.png', '/zh/icons/lucide']) {
      expect(absoluteUrl(path)).not.toMatch(/^https?:\/\/svgship\.com/);
    }
  });
});

describe('CATEGORY_SLUGS 与 categories 数据保持一致', () => {
  // site.ts 刻意不 import categories（保持 Edge-runtime 友好），因此两者是副本关系。
  // 这条测试是防漂移的闸门：新增分类却忘了更新 CATEGORY_SLUGS 时会在这里失败，
  // 否则新分类的详情页会被 sitemap.ts 的 VALID_CATEGORIES 校验静默丢弃。
  it('slug 集合与顺序完全一致', () => {
    expect(CATEGORY_SLUGS).toEqual(categories.map((c) => c.slug));
  });

  it('sites.json 里不存在未知分类的资源', () => {
    const known = new Set<string>(CATEGORY_SLUGS);
    const unknown = (sitesData as Array<{ id: string; category: string }>).filter(
      (s) => !known.has(s.category)
    );
    expect(unknown.map((s) => `${s.id}:${s.category}`)).toEqual([]);
  });
});

describe('LOCALES', () => {
  it('包含默认语言', () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });

  it('SITE_URL 使用 www 且无尾斜杠', () => {
    expect(SITE_URL).toBe('https://www.svgship.com');
    expect(SITE_URL.endsWith('/')).toBe(false);
  });
});
