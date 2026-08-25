import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonCard } from '@/components/lesson-card'
import { PrerequisiteSection } from '@/components/prerequisite-section'
import { SectionCard } from '@/components/section-card'
import {
  getLevel,
  getLevelPrerequisite,
  getLevels,
  getSiteContent,
  hasPrerequisiteContent,
} from '@/lib/course'

type LevelPageProps = {
  params: Promise<{ level: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getLevels().map((level) => ({ level: level.slug }))
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const { level: levelSlug } = await params
  const level = getLevel(levelSlug)
  if (!level) return {}
  return { title: level.title, description: level.description }
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level: levelSlug } = await params
  const level = getLevel(levelSlug)
  if (!level) notFound()
  const site = getSiteContent()
  const prerequisite = getLevelPrerequisite(level.slug)
  const showPrerequisite = hasPrerequisiteContent(prerequisite)

  return (
    <div className="shell py-10 sm:py-16">
      <nav aria-label={site.labels.breadcrumb} className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <Link href="/" className="hover:text-primary">{site.labels.home}</Link>
        <span>/</span>
        <Link href="/levels/" className="hover:text-primary">{site.labels.levels}</Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{level.shortTitle}</span>
      </nav>

      <header className="relative mt-8 overflow-hidden rounded-[2rem] border border-border bg-card px-7 py-10 text-card-foreground shadow-sm sm:px-12 sm:py-14">
        <div className="absolute -top-20 -right-14 size-72 rounded-full border-[4rem] border-secondary" />
        <div className="absolute -bottom-24 left-[42%] size-60 rounded-full border-[3rem] border-accent" />
        <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-extrabold tracking-[0.2em] text-muted-foreground uppercase">{site.labels.level} {Number(level.number)}</p>
            <h1 className="display-type balance mt-4 max-w-4xl text-4xl font-black sm:text-6xl">{level.shortTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{level.description}</p>
          </div>
          <div className="flex gap-8 md:text-right">
            <div>
              <p className="display-type text-3xl font-black">{level.lessons.length}</p>
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{site.labels.lessons}</p>
            </div>
            <div>
              <p className="display-type text-3xl font-black">{level.groups.length}</p>
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{site.labels.sections}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-14 sm:mt-18">
        {level.groups.length > 1 ? (
          <>
            {showPrerequisite && prerequisite && (
              <PrerequisiteSection content={prerequisite} />
            )}
            <div
              className={`grid gap-5 lg:grid-cols-2 ${showPrerequisite ? 'mt-12' : ''}`}
            >
              {level.groups.map((group, index) => (
                <SectionCard
                  key={group.slug}
                  level={level}
                  section={group}
                  number={index + 1}
                />
              ))}
            </div>
          </>
        ) : (
          level.groups.map((group, index) => (
            <section key={group.title}>
              <div className="mb-4 flex items-end justify-between gap-5">
                <div>
                  <span className="eyebrow">{site.labels.section} {String(index + 1).padStart(2, '0')}</span>
                  <h2 className="display-type mt-3 text-3xl font-black sm:text-4xl">{group.title}</h2>
                </div>
                <span className="hidden text-sm font-bold text-muted-foreground sm:block">
                  {group.lessons.length}{' '}
                  {group.lessons.length === 1
                    ? site.labels.lesson.toLowerCase()
                    : site.labels.lessons.toLowerCase()}
                </span>
              </div>
              {showPrerequisite && prerequisite && (
                <PrerequisiteSection content={prerequisite} />
              )}
              <div className={showPrerequisite ? 'mt-10' : ''}>
                {group.lessons.map((lesson) => (
                  <LessonCard key={lesson.slug} lesson={lesson} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
