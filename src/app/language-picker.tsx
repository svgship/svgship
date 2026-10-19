'use client';

import { useEffect, useSyncExternalStore } from 'react';

const OPTIONS = [
  { locale: 'en', href: '/en', label: 'English', desc: 'Professional SVG Resource Directory' },
  { locale: 'zh', href: '/zh', label: '中文', desc: '专业 SVG 资源导航' },
] as const;

const STORAGE_KEY = 'svgship:locale';

/**
 * 语言选择卡片。
 *
 * - 建议：纯客户端读 navigator.language 高亮，不做服务端协商
 * - 记忆：用户点过一次语言后写 localStorage，再次落到根页时客户端自动前跳
 * - SEO：所有逻辑都在客户端 JS 里，Googlebot 不执行 —— 根页对爬虫永远是 200 选择页
 */
export default function LanguagePicker() {
  // 浏览器语言是 React 外部的只读状态，用 useSyncExternalStore 订阅：
  // SSR 返回 null（无水合差异），客户端返回建议语言
  const subscribe = () => () => {};
  const suggested = useSyncExternalStore(
    subscribe,
    () => (navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'),
    () => null
  );

  // 老用户直通：有历史选择则自动前跳（location.replace 不留历史记录，
  // 浏览器返回键能跳过选择页）
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') {
      window.location.replace(`/${saved}`);
    }
  }, []);

  // 点击时记住选择，跟随原生 <a> 导航
  const rememberAndFollow = (locale: string) => {
    window.localStorage.setItem(STORAGE_KEY, locale);
  };

  return (
    <div className="mt-10 grid w-full max-w-md gap-4 sm:grid-cols-2">
      {OPTIONS.map(({ locale, href, label, desc }) => (
        <a
          key={locale}
          href={href}
          hrefLang={locale}
          onClick={() => rememberAndFollow(locale)}
          className="group relative rounded-2xl border border-neutral-200 p-6 transition-all hover:border-violet-400 hover:shadow-lg dark:border-neutral-800 dark:hover:border-violet-500"
        >
          {suggested === locale && (
            <span className="absolute -top-2.5 right-4 rounded-full bg-violet-500 px-2 py-0.5 text-xs font-medium text-white">
              Suggested
            </span>
          )}
          <span className="block text-lg font-semibold">{label}</span>
          <span className="mt-1 block text-sm text-neutral-500 dark:text-neutral-400">{desc}</span>
        </a>
      ))}
    </div>
  );
}
