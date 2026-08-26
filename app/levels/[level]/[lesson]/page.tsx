import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { VideoPlayer } from '@/components/video-player'
import { getAdjacentLessons, getLesson, getLevel, getLevels, getSiteContent } from '@/lib/course'

type LessonPageProps = {
  params: Promise<{ level: string; lesson: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getLevels().flatMap((level) =>
    level.lessons.map((lesson) => ({ level: level.slug, lesson: lesson.slug }))
  )
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { level, lesson } = await params
  const item = getLesson(level, lesson)
  if (!item) return {}
  return { title: item.title, description: item.summary }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { level: levelSlug, lesson: lessonSlug } = await params
  const level = getLevel(levelSlug)
  const lesson = getLesson(levelSlug, lessonSlug)
  if (!level || !lesson) notFound()
  const adjacent = getAdjacentLessons(level, lesson)
  const site = getSiteContent()
  const hasVideos = lesson.videos.length > 0
  const hasPrerequisite = Boolean(lesson.prerequisite)
  const hasSidebar = hasVideos || hasPrerequisite
  const section = level.groups.find((item) => item.title === lesson.groupTitle)
  const parentHref =
    level.groups.length > 1 && section
      ? `/levels/${level.slug}/sections/${section.slug}/`
      : `/levels/${level.slug}/`

  return (
    <div className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-center gap-3">
        <BackButton href={parentHref} label={site.labels.back} />
        <nav aria-label={site.labels.breadcrumb} className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
          <Link href="/" className="hover:text-primary">{site.labels.home}</Link>
          <span>/</span>
          <Link href="/levels/" className="hover:text-primary">{site.labels.levels}</Link>
          <span>/</span>
          <Link href={`/levels/${level.slug}/`} className="hover:text-primary">{level.shortTitle}</Link>
          <span>/</span>
          {level.groups.length > 1 && section && (
            <>
              <Link
                href={`/levels/${level.slug}/sections/${section.slug}/`}
                className="hover:text-primary"
              >
                {section.title}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[var(--foreground)]">{site.labels.lesson} {lesson.number}</span>
        </nav>
      </div>

      <header className="mt-9 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-extrabold text-accent-foreground">
            {level.number}.{String(lesson.number).padStart(2, '0')}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{lesson.groupTitle}</span>
        </div>
        <h1 className="display-type balance mt-5 text-4xl leading-[1.02] font-black sm:text-6xl lg:text-7xl">{lesson.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">{lesson.summary}</p>
      </header>

      <div
        className={`mt-12 grid items-start gap-10 ${
          hasSidebar
            ? 'lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.88fr)] lg:gap-14'
            : 'max-w-4xl'
        }`}
      >
        <article className="panel rounded-[1.75rem] p-6 sm:p-9">
          <div className="lesson-copy" dangerouslySetInnerHTML={{ __html: lesson.html }} />
        </article>

        {hasSidebar && (
          <aside className="lg:sticky lg:top-26">
            {hasVideos && (
              <>
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                  {site.labels.watchMovement}
                </p>
                <VideoPlayer videos={lesson.videos} labels={site.labels} />
              </>
            )}
            {hasPrerequisite && (
              <div className={`${hasVideos ? 'mt-6' : ''} grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 text-sm`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-bold text-muted-foreground">{site.labels.level}</span>
                  <span className="text-right font-extrabold">{level.shortTitle}</span>
                </div>
                <div className="h-px bg-[var(--line)]" />
                <div className="flex items-start justify-between gap-4">
                  <span className="font-bold text-muted-foreground">{site.labels.prerequisite}</span>
                  <span className="max-w-[16rem] text-right font-extrabold">{lesson.prerequisite}</span>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      <nav aria-label={site.labels.lessonNavigation} className="mt-14 grid gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
        {adjacent.previous ? (
          <Link href={`/levels/${level.slug}/${adjacent.previous.slug}/`} className="group rounded-2xl border border-border bg-card/70 p-5 transition hover:border-primary">
            <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">← {site.labels.previous}</span>
            <span className="display-type mt-2 block text-lg font-extrabold group-hover:text-primary">{adjacent.previous.title}</span>
          </Link>
        ) : <span />}
        {adjacent.next && (
          <Link href={`/levels/${level.slug}/${adjacent.next.slug}/`} className="group rounded-2xl border border-border bg-card/70 p-5 text-right transition hover:border-primary">
            <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{site.labels.next} →</span>
            <span className="display-type mt-2 block text-lg font-extrabold group-hover:text-primary">{adjacent.next.title}</span>
          </Link>
        )}
      </nav>
    </div>
  )
}
