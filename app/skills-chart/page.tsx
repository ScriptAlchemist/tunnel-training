import type { Metadata } from 'next'
import { CourseIndex } from '@/components/course-index'
import { getSkillsChartContent } from '@/lib/course'
import { createPageMetadata } from '@/lib/seo'

const chart = getSkillsChartContent()

export const metadata: Metadata = createPageMetadata({
  title: chart.title,
  description: chart.description,
  pathname: '/levels/',
  index: false,
})

export default function SkillsChartPage() {
  return <CourseIndex initialView="chart" />
}
