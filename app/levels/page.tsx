import type { Metadata } from 'next'
import { CourseIndex } from '@/components/course-index'
import { getSiteContent } from '@/lib/course'

const site = getSiteContent()

export const metadata: Metadata = {
  title: site.labels.levelIndexMetadataTitle,
  description: site.labels.levelIndexMetadataDescription,
}

export default function LevelsPage() {
  return <CourseIndex />
}
