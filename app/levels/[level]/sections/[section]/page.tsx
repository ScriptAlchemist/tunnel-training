import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { FlightFlower } from '@/components/flight-flower'
import { LessonCard } from '@/components/lesson-card'
import { PrerequisiteCard } from '@/components/prerequisite-card'
import { VideoPlayer } from '@/components/video-player'
import {
  getLevel,
  getLevels,
  getSection,
  getSectionPrerequisite,
  getSiteContent,
  hasPrerequisiteContent,
} from '@/lib/course'
import { createPageMetadata } from '@/lib/seo'

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
  const level = getLevel(levelSlug)
  const section = getSection(levelSlug, sectionSlug)
  if (!level || !section) return {}
  return createPageMetadata({
    title: `${section.title} · ${level.shortTitle}`,
    description: section.description,
    pathname: `/levels/${levelSlug}/sections/${sectionSlug}/`,
  })
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
      <div className="flex flex-wrap items-center gap-3">
        <BackButton href={`/levels/${level.slug}/`} label={site.labels.back} />
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
      </div>

      <header className="panel relative mt-8 overflow-hidden rounded-[2rem]">
        <FlightFlower
          variant={sectionNumber % 2 === 0 ? 'outspin' : 'inspin'}
          className="absolute -top-20 -right-12 size-60 text-secondary"
        />
        <div className="relative z-10 p-7 sm:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
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
            {!level.sectionPages && (
              <div className="md:text-right">
                <p className="display-type text-3xl font-black">{section.lessons.length}</p>
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  {site.labels.lessons}
                </p>
              </div>
            )}
          </div>
        </div>

        {showPrerequisite && prerequisite && (
          <PrerequisiteCard
            content={prerequisite}
            labels={{
              show: site.labels.showPrerequisites,
              hide: site.labels.hidePrerequisites,
            }}
          />
        )}
      </header>

      {level.sectionPages ? (
        <article className="panel mt-12 max-w-6xl rounded-[1.75rem] p-6 sm:mt-16 sm:p-9">
          {section.contentSections.map((contentSection, index) => {
            const hasVideos = contentSection.videos.length > 0
            const hasFigures = Boolean(contentSection.mediaHtml)
            const hasMedia = hasVideos || hasFigures

            return (
              <section
                key={contentSection.slug}
                id={contentSection.slug}
                className={`${index > 0 ? 'mt-12 border-t border-border pt-12' : ''} grid scroll-mt-28 items-start gap-8 ${
                  hasMedia
                    ? 'lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)] lg:gap-12'
                    : 'max-w-4xl'
                }`}
              >
                <div className="lesson-copy">
                  {contentSection.title && <h2>{contentSection.title}</h2>}
                  <div dangerouslySetInnerHTML={{ __html: contentSection.html }} />
                </div>

                {hasMedia && (
                  <aside>
                    {hasVideos && (
                      <>
                        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                          {site.labels.watchMovement}
                        </p>
                        <VideoPlayer videos={contentSection.videos} labels={site.labels} />
                      </>
                    )}
                    {hasFigures && (
                      <>
                        <p className={`${hasVideos ? 'mt-6 ' : ''}mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground`}>
                          {site.labels.conceptVisual}
                        </p>
                        <div
                          className="lesson-copy concept-media"
                          dangerouslySetInnerHTML={{ __html: contentSection.mediaHtml }}
                        />
                      </>
                    )}
                  </aside>
                )}
              </section>
            )
          })}
        </article>
      ) : (
        <section className="mt-12 sm:mt-16">
          {section.lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </section>
      )}
    </div>
  )
}
