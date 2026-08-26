import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { FlightFlower } from '@/components/flight-flower'
import { LessonCard } from '@/components/lesson-card'
import { PrerequisiteCard } from '@/components/prerequisite-card'
import { SectionCard } from '@/components/section-card'
import { VideoPlayer } from '@/components/video-player'
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
      <div className="flex flex-wrap items-center gap-3">
        <BackButton href="/levels/" label={site.labels.back} />
        <nav aria-label={site.labels.breadcrumb} className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <Link href="/" className="hover:text-primary">{site.labels.home}</Link>
          <span>/</span>
          <Link href="/levels/" className="hover:text-primary">{site.labels.levels}</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{level.shortTitle}</span>
        </nav>
      </div>

      <header className="relative mt-8 overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground shadow-sm">
        <FlightFlower
          variant="inspin"
          className="absolute -top-20 -right-12 size-64 text-secondary"
        />
        <FlightFlower
          variant="outspin"
          className="absolute -bottom-24 left-[42%] size-52 text-accent"
        />
        <div className="relative z-10 px-7 py-10 sm:px-12 sm:py-14">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-extrabold tracking-[0.2em] text-muted-foreground uppercase">{site.labels.level} {Number(level.number)}</p>
              <h1 className="display-type balance mt-4 max-w-4xl text-4xl font-black sm:text-6xl">{level.shortTitle}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{level.description}</p>
            </div>
            <div className="flex gap-8 md:text-right">
              {level.singlePage ? (
                <div>
                  <p className="display-type text-3xl font-black">{level.sectionCount}</p>
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {level.sectionCount === 1 ? site.labels.section : site.labels.sections}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="display-type text-3xl font-black">{level.lessons.length}</p>
                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{site.labels.lessons}</p>
                  </div>
                  <div>
                    <p className="display-type text-3xl font-black">{level.groups.length}</p>
                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{site.labels.sections}</p>
                  </div>
                </>
              )}
            </div>
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

      <div className="mt-14 sm:mt-18">
        {level.singlePage ? (
          <div className="grid gap-10 sm:gap-14">
            {level.html && (
              <article className="panel max-w-4xl rounded-[1.75rem] p-6 sm:p-9">
                <div className="lesson-copy" dangerouslySetInnerHTML={{ __html: level.html }} />
              </article>
            )}
            {level.contentSections.map((contentSection, index) => {
              const hasFigures = Boolean(contentSection.mediaHtml)
              const hasVideos = contentSection.videos.length > 0
              const hasMedia = hasFigures || hasVideos

              return (
                <section key={contentSection.slug} id={contentSection.slug} className="scroll-mt-28">
                  <div
                    className={`grid items-start gap-8 ${
                      hasMedia
                        ? 'lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.88fr)] lg:gap-14'
                        : 'max-w-4xl'
                    }`}
                  >
                    <article className="panel rounded-[1.75rem] p-6 sm:p-9">
                      <span className="eyebrow">
                        {site.labels.section} {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="display-type mt-3 text-3xl font-black sm:text-4xl">
                        {contentSection.title}
                      </h2>
                      <div
                        className="lesson-copy mt-7"
                        dangerouslySetInnerHTML={{ __html: contentSection.html }}
                      />
                    </article>

                    {hasMedia && (
                      <aside className="lg:sticky lg:top-26">
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
                  </div>
                </section>
              )
            })}
          </div>
        ) : level.groups.length > 1 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {level.groups.map((group, index) => (
              <SectionCard
                key={group.slug}
                level={level}
                section={group}
                number={index + 1}
              />
            ))}
          </div>
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
              <div>
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
