import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
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
      <header className="mb-2 flex min-h-8 items-center justify-between gap-2 border-b border-white/10 pb-2">
        {track.href ? (
          <Link
            href={track.href}
            className="group flex items-center gap-1.5 text-[0.68rem] leading-4 font-black tracking-[0.09em] text-white uppercase hover:underline"
          >
            {track.title}
            <ArrowUpRight
              className="size-3 text-white/55 transition group-hover:text-white"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <h3 className="text-[0.68rem] leading-4 font-black tracking-[0.09em] text-white uppercase">
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
            className="group flex min-h-9 items-center gap-2 rounded-md border border-white/10 bg-[#132029] px-2 py-1.5 text-[0.65rem] leading-[0.85rem] font-bold text-white/80 transition hover:-translate-y-px hover:border-white/35 hover:bg-[#192b36] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
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

function LevelColumn({
  level,
  isLast,
}: {
  level: CourseLevel
  isLast: boolean
}) {
  const tracks = tracksForLevel(level)
  const itemLabel =
    level.singlePage || level.sectionPages ? chart.conceptLabel : chart.skillLabel
  const levelStyle = {
    '--board-accent': level.accent,
  } as CSSProperties
  const markerStyle = {
    borderColor: `${level.accent}80`,
    background: `linear-gradient(180deg, ${level.accent}38, ${level.accent}12)`,
  }

  return (
    <article
      className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] items-stretch gap-2.5"
      style={levelStyle}
    >
      <div
        className="flex min-h-72 items-center justify-center rounded-xl border"
        style={markerStyle}
      >
        <span
          className="text-sm font-black tracking-[0.2em] whitespace-nowrap uppercase"
          style={{
            color: level.accent,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {chart.levelLabel} {displayLevelNumber(level.number)}
        </span>
      </div>

      <div className="min-w-0">
        <Link href={`/levels/${level.slug}/`} className="group block px-0.5 pb-3">
          <p className="text-[0.62rem] font-black tracking-[0.15em] text-white/45 uppercase">
            {chart.levelLabel} {displayLevelNumber(level.number)}
          </p>
          <h2 className="mt-1 text-lg leading-5 font-black text-white transition group-hover:text-[var(--board-accent)]">
            {level.shortTitle}
          </h2>
        </Link>

        <div className="grid gap-2.5">
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

      {!isLast && (
        <span
          className="absolute top-7 -right-[1.12rem] z-10 flex size-6 items-center justify-center rounded-full border border-white/15 bg-[#111d25] text-white/50"
          aria-hidden="true"
        >
          <ArrowRight className="size-3.5" />
        </span>
      )}
    </article>
  )
}

export function SkillsBoard({ levels }: { levels: CourseLevel[] }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c151b] text-white shadow-[0_26px_80px_rgba(7,16,21,0.24)]">
      <div className="flex flex-col gap-2 border-b border-white/10 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs font-black tracking-[0.16em] text-white/70 uppercase">
          {chart.boardLabel}
        </p>
        <p className="text-xs font-bold text-white/45">{chart.boardScrollHint}</p>
      </div>

      <div className="skills-board-scroll overflow-x-auto overscroll-x-contain">
        <div
          className="grid w-max grid-flow-col auto-cols-[19rem] items-start gap-5 p-4 sm:p-6"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          {levels.map((level, index) => (
            <LevelColumn
              key={level.slug}
              level={level}
              isLast={index === levels.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
