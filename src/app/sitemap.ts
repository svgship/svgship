import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgship.com';
  const now = new Date();

  return [
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          zh: `${baseUrl}/zh`,
        },
      },
    },
    {
      url: `${baseUrl}/zh`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          zh: `${baseUrl}/zh`,
        },
      },
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/en/about`,
          zh: `${baseUrl}/zh/about`,
        },
      },
    },
    {
      url: `${baseUrl}/zh/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/en/about`,
          zh: `${baseUrl}/zh/about`,
        },
      },
    },
    {
      url: `${baseUrl}/en/submit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: {
          en: `${baseUrl}/en/submit`,
          zh: `${baseUrl}/zh/submit`,
        },
      },
    },
    {
      url: `${baseUrl}/zh/submit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: {
          en: `${baseUrl}/en/submit`,
          zh: `${baseUrl}/zh/submit`,
        },
      },
    },
  ];
}
