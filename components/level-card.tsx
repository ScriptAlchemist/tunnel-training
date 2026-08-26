import Link from 'next/link'
import { FlightFlower } from '@/components/flight-flower'
import { getSiteContent, type CourseLevel } from '@/lib/course'

export function LevelCard({ level }: { level: CourseLevel }) {
  const site = getSiteContent()
  const accent = level.accent
  const count = level.singlePage ? level.sectionCount : level.lessons.length
  const countLabel = level.singlePage
    ? count === 1
      ? site.labels.section
      : site.labels.sections
    : count === 1
      ? site.labels.lesson
      : site.labels.lessons

  return (
    <Link
      href={`/levels/${level.slug}/`}
      className="panel group relative flex min-h-80 flex-col overflow-hidden rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-9"
    >
      <FlightFlower
        variant={Number(level.number) % 2 === 0 ? 'outspin' : 'inspin'}
        className="absolute -top-12 -right-12 size-48 opacity-45 transition-transform duration-500 group-hover:scale-110"
        style={{ color: accent }}
      />
      <div className="relative flex items-start justify-between">
        <span className="display-type text-6xl font-black opacity-15">{level.number}</span>
        <span className="rounded-full border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-1.5 text-xs font-extrabold">
          {count} {countLabel.toLowerCase()}
        </span>
      </div>
      <div className="relative mt-auto pt-14">
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em]" style={{ color: accent }}>
          {site.labels.level} {Number(level.number)}
        </p>
        <h3 className="display-type balance text-3xl font-extrabold sm:text-4xl">{level.shortTitle}</h3>
        <p className="mt-4 max-w-lg leading-7 text-muted-foreground">{level.description}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold">
          {site.labels.viewCurriculum} <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
