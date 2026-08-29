import type { Metadata } from 'next'
import { CourseIndex } from '@/components/course-index'
import { getSkillsChartContent } from '@/lib/course'

const chart = getSkillsChartContent()

export const metadata: Metadata = {
  title: chart.title,
  description: chart.description,
}

export default function SkillsChartPage() {
  return <CourseIndex initialView="chart" />
}
