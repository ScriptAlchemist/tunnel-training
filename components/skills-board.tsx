import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
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
        : undefined,
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
    <section className="rounded-xl border p-2.5" style={surfaceStyle}>
      <header className="mb-2 flex min-h-8 items-center justify-between gap-2 border-b border-border/70 pb-2">
        {track.href ? (
          <Link
            href={track.href}
            className="group flex items-center gap-1.5 text-[0.68rem] leading-4 font-black tracking-[0.09em] text-foreground uppercase hover:underline"
          >
            {track.title}
            <ArrowUpRight
              className="size-3 text-muted-foreground transition group-hover:text-foreground"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <h3 className="text-[0.68rem] leading-4 font-black tracking-[0.09em] text-foreground uppercase">
            {track.title}
          </h3>
        )}
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded-full text-[0.58rem] font-black text-[#071015]"
          style={{ backgroundColor: accent }}
          aria-label={`${track.skills.length} ${itemLabel.toLowerCase()}${track.skills.length === 1 ? '' : 's'}`}
        >
          {track.skills.length}
        </span>
      </header>

      <div className={track.skills.length > 3 ? 'grid grid-cols-2 gap-1.5' : 'grid gap-1.5'}>
        {track.skills.map((skill) => (
          <Link
            key={skill.href}
            href={skill.href}
            aria-label={`${chart.openSkillLabel}: ${skill.title}`}
            className="group flex min-h-9 items-center gap-2 rounded-md border border-border bg-card/80 px-2 py-1.5 text-[0.65rem] leading-[0.85rem] font-bold text-card-foreground transition hover:-translate-y-px hover:border-primary/40 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className="size-1.5 shrink-0 rounded-full"
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
}: {
  level: CourseLevel
  isFirst: boolean
  isLast: boolean
}) {
  const tracks = tracksForLevel(level)
  const itemLabel =
    level.singlePage || level.sectionPages ? chart.conceptLabel : chart.skillLabel
  const levelStyle = {
    '--board-accent': level.accent,
  } as CSSProperties

  return (
    <article
      className={`grid w-full grid-cols-[3rem_minmax(0,1fr)] items-stretch gap-3 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-5 ${isLast ? '' : 'border-b border-border'}`}
      style={levelStyle}
    >
      <div className="relative flex justify-center">
        <span
          className={`absolute inset-y-0 w-1.5 ${isFirst ? 'rounded-t-full' : ''} ${isLast ? 'rounded-b-full' : ''}`}
          style={{ backgroundColor: level.accent }}
          aria-hidden="true"
        />
        <Link
          href={`/levels/${level.slug}/`}
          aria-label={`${chart.levelLabel} ${displayLevelNumber(level.number)}: ${level.shortTitle}`}
          className="relative z-10 mt-8 flex h-10 min-w-10 items-center justify-center rounded-full border-4 border-background px-2 text-xs font-black text-white shadow-[0_0_0_1px_var(--border)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ backgroundColor: level.accent }}
        >
          {displayLevelNumber(level.number)}
        </Link>
      </div>

      <div className="min-w-0 py-8 pr-4 sm:pr-8 lg:pr-12">
        <Link href={`/levels/${level.slug}/`} className="group block pb-5">
          <p className="text-[0.62rem] font-black tracking-[0.15em] text-muted-foreground uppercase">
            {chart.levelLabel} {displayLevelNumber(level.number)}
          </p>
          <h2 className="mt-1 text-2xl leading-tight font-black text-foreground transition group-hover:text-[var(--board-accent)] sm:text-3xl">
            {level.shortTitle}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {level.description}
          </p>
        </Link>

        <div
          className={`grid items-start gap-3 ${
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
    </article>
  )
}

export function SkillsBoard({
  levels,
  fullWidth = false,
}: {
  levels: CourseLevel[]
  fullWidth?: boolean
}) {
  return (
    <div className="w-full">
      <div
        className={`${fullWidth ? 'shell' : ''} flex flex-col gap-2 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <p className="text-xs font-black tracking-[0.16em] text-foreground uppercase">
          {chart.boardLabel}
        </p>
        <p className="text-xs font-bold text-muted-foreground">{chart.boardScrollHint}</p>
      </div>

      <div>
        {levels.map((level, index) => (
          <LevelRow
            key={level.slug}
            level={level}
            isFirst={index === 0}
            isLast={index === levels.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
