export type CategorySlug = 'icons' | 'illustrations' | 'tools' | 'tutorials' | 'inspiration';

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
  tags: string[];
  pricing?: 'free' | 'paid' | 'freemium';
  featured?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  icon: string;
  contentTags: { zh: string; en: string }[];
  licenseTags?: { zh: string; en: string }[];
  hasPricing?: boolean;
}

export type Locale = 'en' | 'zh';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
