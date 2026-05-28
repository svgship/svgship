import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://svgship.com/en',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: 'https://svgship.com/en',
          zh: 'https://svgship.com/zh',
        },
      },
    },
    {
      url: 'https://svgship.com/zh',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: 'https://svgship.com/en',
          zh: 'https://svgship.com/zh',
        },
      },
    },
  ];
}
