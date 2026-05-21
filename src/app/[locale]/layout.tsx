import { I18nProvider } from '@/lib/i18n/context';
import type { Locale } from '@/types';

const locales: Locale[] = ['en', 'zh'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider defaultLocale="en">{children}</I18nProvider>;
}
