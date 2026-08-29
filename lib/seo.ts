import type { Metadata } from 'next'
import { getSiteContent } from '@/lib/course'

type PageMetadataOptions = {
  title: string
  description: string
  socialDescription?: string
  pathname: string
  index?: boolean
}

export function absoluteSiteUrl(pathname = '/') {
  const site = getSiteContent()
  return new URL(pathname.replace(/^\//, ''), site.siteUrl).toString()
}

export function createPageMetadata({
  title,
  description,
  socialDescription,
  pathname,
  index = true,
}: PageMetadataOptions): Metadata {
  const site = getSiteContent()
  const canonicalUrl = absoluteSiteUrl(pathname)
  const socialImageUrl = absoluteSiteUrl(site.socialImage)
  const shareDescription = socialDescription ?? description
  const allowIndex = index && !process.env.NEXT_PUBLIC_BASE_PATH

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: allowIndex,
      follow: true,
    },
    openGraph: {
      title,
      description: shareDescription,
      url: canonicalUrl,
      siteName: site.title,
      type: 'website',
      images: [
        {
          url: socialImageUrl,
          width: 720,
          height: 1280,
          alt: site.socialImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: shareDescription,
      images: [socialImageUrl],
    },
  }
}
