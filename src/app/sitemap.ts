import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-reply.ru';
  const lastDeploy = '2026-03-12';

  return [
    {
      url: baseUrl,
      lastModified: lastDeploy,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/challenge`,
      lastModified: lastDeploy,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: lastDeploy,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: '2026-02-01',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: '2026-02-01',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
