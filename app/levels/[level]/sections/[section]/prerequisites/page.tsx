import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrerequisitePage } from '@/components/prerequisite-page'
import {
  getLevel,
  getPrerequisites,
  getSection,
  getSectionPrerequisite,
  getSiteContent,
  hasPrerequisiteContent,
} from '@/lib/course'

type SectionPrerequisitePageProps = {
  params: Promise<{ level: string; section: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getPrerequisites()
    .filter((item) => item.section && hasPrerequisiteContent(item))
    .map((item) => ({ level: item.level, section: item.section! }))
}

export async function generateMetadata({
  params,
}: SectionPrerequisitePageProps): Promise<Metadata> {
  const { level: levelSlug, section: sectionSlug } = await params
  const content = getSectionPrerequisite(levelSlug, sectionSlug)
  if (!hasPrerequisiteContent(content)) return {}
  return { title: content!.title, description: content!.description || undefined }
}

export default async function SectionPrerequisitePage({
  params,
}: SectionPrerequisitePageProps) {
  const { level: levelSlug, section: sectionSlug } = await params
  const level = getLevel(levelSlug)
  const section = getSection(levelSlug, sectionSlug)
  const content = getSectionPrerequisite(levelSlug, sectionSlug)
  if (!level || !section || !content || !hasPrerequisiteContent(content)) notFound()
  const site = getSiteContent()

  return (
    <PrerequisitePage
      content={content}
      breadcrumbs={[
        { label: site.labels.home, href: '/' },
        { label: site.labels.levels, href: '/levels/' },
        { label: level.shortTitle, href: `/levels/${level.slug}/` },
        {
          label: section.title,
          href: `/levels/${level.slug}/sections/${section.slug}/`,
        },
        { label: site.labels.prerequisites },
      ]}
    />
  )
}
