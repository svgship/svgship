/**
 * 站点级常量。
 *
 * 所有绝对 URL 必须从这里取，禁止在组件里硬编码域名 ——
 * 历史 bug：JsonLd.tsx 与 about/submit 的 layout 硬编码了不带 www 的裸域
 * （`https://svgship.com`），而裸域没有任何 DNS 记录，导致结构化数据里出现死链。
 *
 * 本模块刻意不 import 任何数据文件（sites.json / categories.ts），
 * 以便将来在 middleware（Edge runtime）里复用而不把数据打进 Edge bundle。
 */

export const SITE_URL = 'https://www.svgship.com';

export const GITHUB_REPO = 'https://github.com/svgship/svgship';

/** 默认语言。x-default 与无 locale 前缀的重定向都指向它。 */
export const DEFAULT_LOCALE = 'en';

export const LOCALES = ['en', 'zh'] as const;

/**
 * 分类 slug 列表。
 *
 * 注意：这是 `src/data/categories.ts` 的**副本**，用于 sitemap 校验与
 * generateStaticParams。之所以复制而不是 import，是为了保持本模块无数据依赖。
 * 两者的同步由 `src/lib/site.test.ts` 的奇偶校验测试保证 ——
 * 新增分类时该测试会失败，从而避免新分类的详情页静默地从 sitemap 里消失。
 */
export const CATEGORY_SLUGS = [
  'icons',
  'illustrations',
  'tools',
  'tutorials',
  'inspiration',
] as const;

/** 拼绝对 URL：absoluteUrl('/zh/icons') → https://www.svgship.com/zh/icons */
export function absoluteUrl(path = ''): string {
  if (/^https?:\/\//.test(path)) return path;
  // 空路径返回站点根，不带尾斜杠，避免出现两种"首页 URL"写法
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
