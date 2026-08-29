import type { MetadataRoute } from 'next'
import { absoluteSiteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const isRepositoryPreview = Boolean(process.env.NEXT_PUBLIC_BASE_PATH)

  return {
    rules: {
      userAgent: '*',
      ...(isRepositoryPreview ? { disallow: '/' } : { allow: '/' }),
    },
    sitemap: absoluteSiteUrl('/sitemap.xml'),
    host: absoluteSiteUrl('/'),
  }
}
