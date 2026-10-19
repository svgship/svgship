import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import LanguagePicker from './language-picker';

/**
 * 根路径语言选择页（x-default 落地页）。
 *
 * Google 官方推荐形态：多语言站点不做基于 Accept-Language 的服务端自动重定向，
 * 根 URL 返回 200 的选择页并由 hreflang x-default 标注。
 * 详见 developers.google.cn/search/docs/specialty/international/localized-versions
 */
export const metadata: Metadata = {
  // absolute：绕过根 layout 的 '%s | SVGShip' 模板，避免品牌名重复
  title: { absolute: 'SVGShip — Choose Your Language' },
  description:
    'SVGShip — Professional SVG Resource Directory. Choose your language: English or 中文.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'x-default': SITE_URL,
      en: `${SITE_URL}/en`,
      zh: `${SITE_URL}/zh`,
    },
  },
  // 刻意不设 OG/Twitter 卡片：社交分享的落地页应是具体语言版（/en、/zh）
};

export default function RootPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        SVG<span className="text-violet-500">Ship</span>
      </h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        Choose your language · 选择语言
      </p>
      <LanguagePicker />
    </main>
  );
}
