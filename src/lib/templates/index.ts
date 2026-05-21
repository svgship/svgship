import type { Template, TemplateCategory } from '@/types';

let templatesCache: Template[] | null = null;

export async function getTemplates(): Promise<Template[]> {
  if (templatesCache) return templatesCache;

  const res = await fetch('/templates.json');
  if (!res.ok) throw new Error('Failed to load templates');
  templatesCache = await res.json();
  return templatesCache!;
}

export async function getTemplateBySlug(slug: string): Promise<Template | undefined> {
  const templates = await getTemplates();
  return templates.find((t) => t.slug === slug);
}

export async function getTemplatesByCategory(category: TemplateCategory): Promise<Template[]> {
  const templates = await getTemplates();
  return templates.filter((t) => t.category === category);
}

export async function searchTemplates(query: string): Promise<Template[]> {
  const templates = await getTemplates();
  const q = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.category.includes(q)
  );
}
