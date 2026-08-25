import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonCard } from '@/components/lesson-card'
import { PrerequisiteCard } from '@/components/prerequisite-card'
import {
  getLevel,
  getLevels,
  getSection,
  getSectionPrerequisite,
  getSiteContent,
  hasPrerequisiteContent,
} from '@/lib/course'

type SectionPageProps = {
  params: Promise<{ level: string; section: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getLevels().flatMap((level) =>
    level.groups.length > 1
      ? level.groups.map((section) => ({ level: level.slug, section: section.slug }))
      : []
  )
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { level: levelSlug, section: sectionSlug } = await params
  const section = getSection(levelSlug, sectionSlug)
  if (!section) return {}
  return { title: section.title, description: section.description }
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { level: levelSlug, section: sectionSlug } = await params
  const level = getLevel(levelSlug)
  const section = getSection(levelSlug, sectionSlug)
  if (!level || !section || level.groups.length < 2) notFound()
  const site = getSiteContent()
  const sectionNumber = level.groups.findIndex((item) => item.slug === section.slug) + 1
  const prerequisite = getSectionPrerequisite(level.slug, section.slug)
  const showPrerequisite = hasPrerequisiteContent(prerequisite)

  return (
    <div className="shell py-10 sm:py-16">
      <nav
        aria-label={site.labels.breadcrumb}
        className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground"
      >
        <Link href="/" className="hover:text-primary">{site.labels.home}</Link>
        <span>/</span>
        <Link href="/levels/" className="hover:text-primary">{site.labels.levels}</Link>
        <span>/</span>
        <Link href={`/levels/${level.slug}/`} className="hover:text-primary">{level.shortTitle}</Link>
        <span>/</span>
        <span className="text-foreground">{section.title}</span>
      </nav>

      <header className="panel relative mt-8 overflow-hidden rounded-[2rem] p-7 sm:p-12">
        <div className="absolute -top-20 -right-14 size-64 rounded-full border-[3.5rem] border-secondary" />
        <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-primary uppercase">
              {site.labels.section} {String(sectionNumber).padStart(2, '0')}
            </p>
            <h1 className="display-type balance mt-4 text-4xl font-black sm:text-6xl">
              {section.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {section.description}
            </p>
          </div>
          <div className="md:text-right">
            <p className="display-type text-3xl font-black">{section.lessons.length}</p>
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {site.labels.lessons}
            </p>
          </div>
        </div>
      </header>

      {showPrerequisite && prerequisite && (
        <PrerequisiteCard
          content={prerequisite}
          href={`/levels/${level.slug}/sections/${section.slug}/prerequisites/`}
        />
      )}

      <section className="mt-12 sm:mt-16">
        {section.lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </section>
    </div>
  )
}
