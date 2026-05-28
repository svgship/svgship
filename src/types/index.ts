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
