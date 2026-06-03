'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/types';
import en from './locales/en.json';
import zh from './locales/zh.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const locales: Record<Locale, any> = { en, zh };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string): unknown {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = current[key];
    if (current === undefined) return undefined;
  }
  return current;
}

export function I18nProvider({
  children,
  defaultLocale = 'en',
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      // Replace the locale segment in the URL
      const segments = pathname.split('/');
      segments[1] = newLocale;
      router.push(segments.join('/'));
    },
    [pathname, router]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: any =
        getNestedValue(locales[locale], key) ?? getNestedValue(locales.en, key) ?? key;
      const value: string = Array.isArray(raw) ? raw.join('\n') : String(raw);
      if (!params) return value;
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
        value
      );
    },
    [locale]
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
