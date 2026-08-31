import type { MetadataRoute } from 'next'
import { getPublishedApps } from '@/lib/apps'
import { SITE } from '@/lib/i18n'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const base = SITE.baseUrl
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/en/`, lastModified: now, priority: 0.9 },
    { url: `${base}/contact/`, lastModified: now, priority: 0.5 },
    { url: `${base}/en/contact/`, lastModified: now, priority: 0.4 },
  ]
  for (const a of getPublishedApps()) {
    urls.push({ url: `${base}/apps/${a.slug}/`, lastModified: now, priority: 0.8 })
    urls.push({ url: `${base}/en/apps/${a.slug}/`, lastModified: now, priority: 0.7 })
  }
  return urls
}
