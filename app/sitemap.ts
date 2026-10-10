import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/blog/blog-api'
import { DC as CV } from './cv/generated'

const SITE = 'https://oleksiakconsulting.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/tool`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
  // /cv dopiero, gdy ma tresc (generated.ts przestal byc zaslepka).
  if (CV) base.push({ url: `${SITE}/cv`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })

  // Wpisy bloga siedzą za zewnętrznym API. Jeśli nie odpowie, sitemapa
  // nadal się zbuduje — lepiej mniej adresów niż wywrócony build.
  try {
    const { items } = await getPosts(1, 200)
    for (const post of items ?? []) {
      base.push({
        url: `${SITE}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch (e) {
    console.error('[sitemap] blog API unavailable, shipping base URLs only', e)
  }

  return base
}
