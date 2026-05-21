import { I18nProvider } from '@/lib/i18n/context';
import type { Locale } from '@/types';
import { notFound } from 'next/navigation';

const locales: Locale[] = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // We need to handle params asynchronously in Next.js 16
  // For now, wrap with I18nProvider - the locale will be resolved client-side
  return <I18nProvider defaultLocale="en">{children}</I18nProvider>;
}
