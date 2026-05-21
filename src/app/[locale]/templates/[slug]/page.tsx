import type { Metadata } from 'next';
import type { Template } from '@/types';
import TemplatePageClient from './TemplatePageClient';

async function getTemplates(): Promise<Template[]> {
  const fs = await import('fs');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'public', 'templates.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function generateStaticParams() {
  const templates = await getTemplates();
  return templates.flatMap((t) => [
    { locale: 'en', slug: t.slug },
    { locale: 'zh', slug: t.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const templates = await getTemplates();
  const template = templates.find((t) => t.slug === slug);

  if (!template) return {};

  return {
    title: template.seo.title,
    description: template.seo.description,
    keywords: template.seo.keywords,
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const templates = await getTemplates();
  const template = templates.find((t) => t.slug === slug);

  if (!template) {
    return <div>Template not found</div>;
  }

  return <TemplatePageClient template={template} />;
}
