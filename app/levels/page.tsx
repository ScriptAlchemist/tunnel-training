import type { Metadata } from 'next'
import { CourseIndex } from '@/components/course-index'
import { getSiteContent } from '@/lib/course'
import { createPageMetadata } from '@/lib/seo'

const site = getSiteContent()

export const metadata: Metadata = createPageMetadata({
  title: site.labels.levelIndexMetadataTitle,
  description: site.labels.levelIndexMetadataDescription,
  pathname: '/levels/',
})

export default function LearnPage() {
  return <CourseIndex />
}
