export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  tags: string[];
  slug: string;
  file: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export type TemplateCategory = 'holidays' | 'animals' | 'letters';

export interface SvgProcessResult {
  success: boolean;
  data?: string;
  error?: string;
  originalSize?: number;
  optimizedSize?: number;
}

export type Locale = 'en' | 'zh';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
