import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import {
  displayLevelNumber,
  getSkillsChartContent,
  type CourseLevel,
} from '@/lib/course'

const chart = getSkillsChartContent()

type BoardSkill = {
  title: string
  href: string
}

type BoardTrack = {
  title: string
  href?: string
  skills: BoardSkill[]
}

function tracksForLevel(level: CourseLevel): BoardTrack[] {
  if (level.sectionPages) {
    return [
      {
        title: level.shortTitle,
        href: `/levels/${level.slug}/`,
        skills: level.groups.map((section) => ({
          title: section.title,
          href: `/levels/${level.slug}/sections/${section.slug}/`,
        })),
      },
    ]
  }

  if (level.singlePage) {
    return [
      {
        title: level.shortTitle,
        href: `/levels/${level.slug}/`,
        skills: level.contentSections.map((section) => ({
          title: section.title,
          href: `/levels/${level.slug}/#${section.slug}`,
        })),
      },
    ]
  }

  return level.groups.map((group) => ({
    title: group.title,
    href:
      level.groups.length > 1
        ? `/levels/${level.slug}/sections/${group.slug}/`
        : `/levels/${level.slug}/`,
    skills: group.lessons.map((lesson) => ({
      title: lesson.title,
      href: `/levels/${level.slug}/${lesson.slug}/`,
    })),
  }))
}

function TrackCard({
  track,
  accent,
  itemLabel,
}: {
  track: BoardTrack
  accent: string
  itemLabel: string
}) {
  const surfaceStyle = {
    borderColor: `${accent}70`,
    backgroundColor: `${accent}12`,
  }

  return (
    <section className="rounded-xl border p-3" style={surfaceStyle}>
      <header className="mb-2.5 flex min-h-9 items-center justify-between gap-2 border-b border-border/70 pb-2.5">
        {track.href ? (
          <Link
            href={track.href}
            className="group flex items-center gap-1.5 text-xs leading-4 font-black tracking-[0.08em] text-foreground uppercase hover:underline"
          >
            {track.title}
            <ArrowUpRight
              className="size-3.5 text-muted-foreground transition group-hover:text-foreground"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <h3 className="text-xs leading-4 font-black tracking-[0.08em] text-foreground uppercase">
            {track.title}
          </h3>
        )}
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-black text-[#071015]"
          style={{ backgroundColor: accent }}
          aria-label={`${track.skills.length} ${itemLabel.toLowerCase()}${track.skills.length === 1 ? '' : 's'}`}
        >
          {track.skills.length}
        </span>
      </header>

      <div className={track.skills.length > 3 ? 'grid grid-cols-2 gap-2' : 'grid gap-2'}>
        {track.skills.map((skill) => (
          <Link
            key={skill.href}
            href={skill.href}
            aria-label={`${chart.openSkillLabel}: ${skill.title}`}
            className="group flex min-h-11 items-center gap-2.5 rounded-md border border-border bg-card/80 px-2.5 py-2 text-xs leading-4 font-bold text-card-foreground transition hover:-translate-y-px hover:border-primary/40 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            <span>{skill.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function LevelRow({
  level,
  isFirst,
  isLast,
  defaultOpen,
}: {
  level: CourseLevel
  isFirst: boolean
  isLast: boolean
  defaultOpen: boolean
}) {
  const tracks = tracksForLevel(level)
  const itemLabel =
    level.singlePage || level.sectionPages ? chart.conceptLabel : chart.skillLabel
  const levelStyle = {
    '--board-accent': level.accent,
  } as CSSProperties

  return (
    <details
      open={defaultOpen}
      className={`group relative w-full ${isLast ? '' : 'border-b border-border'}`}
      style={levelStyle}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 flex w-12 justify-center sm:w-16"
        aria-hidden="true"
      >
        <span
          className={`w-1.5 ${isFirst ? 'rounded-t-full' : ''} ${isLast ? 'rounded-b-full' : ''}`}
          style={{ backgroundColor: level.accent }}
        />
      </div>

      <summary className="relative z-10 grid cursor-pointer list-none grid-cols-[3rem_minmax(0,1fr)] gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-5 [&::-webkit-details-marker]:hidden">
        <div className="flex justify-center">
          <span
            className="mt-8 flex h-10 min-w-10 items-center justify-center rounded-full border-4 border-background px-2 text-xs font-black text-white shadow-[0_0_0_1px_var(--border)]"
            style={{ backgroundColor: level.accent }}
          >
            {displayLevelNumber(level.number)}
          </span>
        </div>

        <div className="min-w-0 py-8 pr-4 sm:pr-8 lg:pr-12">
          <p className="text-xs font-black tracking-[0.14em] text-muted-foreground uppercase">
            {chart.levelLabel} {displayLevelNumber(level.number)}
          </p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h2 className="text-2xl leading-tight font-black text-foreground transition group-hover:text-[var(--board-accent)] sm:text-3xl">
              {level.shortTitle}
            </h2>
            <ChevronDown
              className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 sm:size-6"
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {level.description}
          </p>
        </div>
      </summary>

      <div className="relative z-10 grid grid-cols-[3rem_minmax(0,1fr)] gap-3 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-5">
        <div aria-hidden="true" />
        <div
          className={`grid min-w-0 items-start gap-3 pb-8 pr-4 sm:pr-8 lg:pr-12 ${
            tracks.length >= 3
              ? 'xl:grid-cols-3'
              : tracks.length === 2
                ? 'lg:grid-cols-2'
                : ''
          }`}
        >
          {tracks.map((track) => (
            <TrackCard
              key={track.title}
              track={track}
              accent={level.accent}
              itemLabel={itemLabel}
            />
          ))}
        </div>
      </div>
    </details>
  )
}

export function SkillsBoard({
  levels,
  defaultOpen = true,
}: {
  levels: CourseLevel[]
  defaultOpen?: boolean
}) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-black tracking-[0.14em] text-foreground uppercase">
          {chart.boardLabel}
        </p>
        <p className="text-sm font-bold text-muted-foreground">{chart.boardScrollHint}</p>
      </div>

      <div>
        {levels.map((level, index) => (
          <LevelRow
            key={level.slug}
            level={level}
            isFirst={index === 0}
            isLast={index === levels.length - 1}
            defaultOpen={defaultOpen}
          />
        ))}
      </div>
    </div>
  )
}
