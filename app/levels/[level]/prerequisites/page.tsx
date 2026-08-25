import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrerequisitePage } from '@/components/prerequisite-page'
import { getLevel, getLevelPrerequisite, getPrerequisites, getSiteContent } from '@/lib/course'

type LevelPrerequisitePageProps = {
  params: Promise<{ level: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getPrerequisites()
    .filter((item) => !item.section)
    .map((item) => ({ level: item.level }))
}

export async function generateMetadata({ params }: LevelPrerequisitePageProps): Promise<Metadata> {
  const { level: levelSlug } = await params
  const content = getLevelPrerequisite(levelSlug)
  if (!content) return {}
  return { title: content.title, description: content.description || undefined }
}

export default async function LevelPrerequisitePage({ params }: LevelPrerequisitePageProps) {
  const { level: levelSlug } = await params
  const level = getLevel(levelSlug)
  const content = getLevelPrerequisite(levelSlug)
  if (!level || !content) notFound()
  const site = getSiteContent()

  return (
    <PrerequisitePage
      content={content}
      breadcrumbs={[
        { label: site.labels.home, href: '/' },
        { label: site.labels.levels, href: '/levels/' },
        { label: level.shortTitle, href: `/levels/${level.slug}/` },
        { label: site.labels.prerequisites },
      ]}
    />
  )
}
