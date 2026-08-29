import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react'
import {
  displayLevelNumber,
  getSiteContent,
  getSkillsChartContent,
  type CourseLevel,
  type LessonGroup,
} from '@/lib/course'

const chart = getSkillsChartContent()
const site = getSiteContent()

type SkillItem = {
  title: string
  href: string
}

function SkillLink({
  skill,
  index,
  accent,
  label,
}: {
  skill: SkillItem
  index: number
  accent: string
  label: string
}) {
  return (
    <Link
      href={skill.href}
      aria-label={`${label}: ${skill.title}`}
      className="group grid min-h-13 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className="flex size-6 items-center justify-center rounded-full text-[0.64rem] font-black text-white"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="text-sm leading-5 font-extrabold text-card-foreground">
        {skill.title}
      </span>
      <ArrowUpRight
        className="size-4 text-muted-foreground transition group-hover:text-primary"
        aria-hidden="true"
      />
    </Link>
  )
}

function TrackPanel({
  level,
  title,
  skills,
  trackHref,
  compact = false,
}: {
  level: CourseLevel
  title: string
  skills: SkillItem[]
  trackHref?: string
  compact?: boolean
}) {
  const itemLabel =
    level.singlePage || level.sectionPages ? chart.conceptLabel : chart.skillLabel
  const useSingleColumn = compact || skills.length <= 3

  return (
    <details open className="collapsible-stage rounded-2xl border border-border bg-muted/40 p-4 sm:p-5">
      <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div>
          <p className="text-[0.66rem] font-black tracking-[0.16em] text-muted-foreground uppercase">
            {chart.trackLabel}
          </p>
          <h3 className="mt-1 font-extrabold">{title}</h3>
        </div>
        <span className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-extrabold text-muted-foreground">
            {skills.length}
          </span>
          <ChevronDown
            className="collapse-chevron size-4 text-muted-foreground transition-transform"
            aria-hidden="true"
          />
        </span>
      </summary>

      {trackHref && (
        <Link
          href={trackHref}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:underline"
        >
          {site.labels.viewSection}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}

      <div className={`grid gap-2.5 ${useSingleColumn ? '' : 'sm:grid-cols-2'}`}>
        {skills.map((skill, index) => (
          <SkillLink
            key={skill.href}
            skill={skill}
            index={index}
            accent={level.accent}
            label={itemLabel}
          />
        ))}
      </div>
    </details>
  )
}

function skillsForGroup(level: CourseLevel, group: LessonGroup): SkillItem[] {
  return group.lessons.map((lesson) => ({
    title: lesson.title,
    href: `/levels/${level.slug}/${lesson.slug}/`,
  }))
}

function LevelStage({
  level,
  defaultOpen,
}: {
  level: CourseLevel
  defaultOpen: boolean
}) {
  const levelStyle = {
    '--level-accent': level.accent,
    boxShadow: `inset 0 4px 0 ${level.accent}`,
  } as CSSProperties

  const conceptSkills = level.contentSections.map((section) => ({
    title: section.title,
    href: `/levels/${level.slug}/#${section.slug}`,
  }))
  const sectionSkills = level.groups.map((section) => ({
    title: section.title,
    href: `/levels/${level.slug}/sections/${section.slug}/`,
  }))
  const itemCount = level.singlePage || level.sectionPages
    ? level.sectionCount
    : level.lessons.length
  const itemLabel = level.singlePage || level.sectionPages
    ? chart.conceptLabel
    : chart.skillLabel

  return (
    <details
      open={defaultOpen}
      className="collapsible-stage panel rounded-[1.75rem] p-4 sm:p-6"
      style={levelStyle}
    >
      <summary className="flex cursor-pointer flex-col gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-xs font-black tracking-[0.18em] uppercase"
            style={{ color: level.accent }}
          >
            {chart.levelLabel} {displayLevelNumber(level.number)}
          </p>
          <h2 className="display-type mt-2 text-2xl font-black sm:text-3xl">
            {level.shortTitle}
          </h2>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
            {level.description}
          </p>
          <span className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-extrabold text-muted-foreground">
              {itemCount} {itemLabel.toLowerCase()}{itemCount === 1 ? '' : 's'}
            </span>
            <ChevronDown
              className="collapse-chevron size-5 text-muted-foreground transition-transform"
              aria-hidden="true"
            />
          </span>
        </div>
      </summary>

      {level.singlePage || level.sectionPages ? (
        <TrackPanel
          level={level}
          title={level.shortTitle}
          skills={level.sectionPages ? sectionSkills : conceptSkills}
          trackHref={`/levels/${level.slug}/`}
        />
      ) : (
        <div
          className={`grid gap-4 ${
            level.groups.length >= 3
              ? 'lg:grid-cols-3'
              : level.groups.length > 1
                ? 'lg:grid-cols-2'
                : ''
          }`}
        >
          {level.groups.map((group) => (
            <TrackPanel
              key={group.slug}
              level={level}
              title={group.title}
              skills={skillsForGroup(level, group)}
              compact={level.groups.length >= 3}
              trackHref={
                level.groups.length > 1
                  ? `/levels/${level.slug}/sections/${group.slug}/`
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </details>
  )
}

function StraightConnector() {
  return (
    <div
      className="flex h-18 flex-col items-center justify-center text-muted-foreground"
      aria-hidden="true"
    >
      <span className="h-9 w-px bg-border" />
      <ArrowDown className="-mt-0.5 size-5" />
    </div>
  )
}

function BranchConnector({ branches }: { branches: number }) {
  const positions = branches === 3 ? ['16.6667%', '50%', '83.3333%'] : ['25%', '75%']

  return (
    <>
      <div className="lg:hidden">
        <StraightConnector />
      </div>
      <div className="relative hidden h-20 lg:block" aria-hidden="true">
        <span className="absolute top-0 left-1/2 h-6 w-px bg-border" />
        <span
          className="absolute top-6 h-px bg-border"
          style={{ left: positions[0], right: `calc(100% - ${positions.at(-1)})` }}
        />
        {positions.map((position) => (
          <span key={position}>
            <span
              className="absolute top-6 h-9 w-px bg-border"
              style={{ left: position }}
            />
            <ArrowDown
              className="absolute top-14 size-5 -translate-x-1/2 text-muted-foreground"
              style={{ left: position }}
            />
          </span>
        ))}
      </div>
    </>
  )
}

export function SkillsGraph({
  levels,
  showSourceNote = true,
  defaultOpen = false,
}: {
  levels: CourseLevel[]
  showSourceNote?: boolean
  defaultOpen?: boolean
}) {
  return (
    <div>
      {levels.map((level, index) => {
        const nextLevel = levels[index + 1]

        return (
          <div key={level.slug}>
            <LevelStage level={level} defaultOpen={defaultOpen} />
            {nextLevel &&
              (nextLevel.groups.length > 1 ? (
                <BranchConnector branches={nextLevel.groups.length} />
              ) : (
                <StraightConnector />
              ))}
          </div>
        )
      })}

      {showSourceNote && (
        <aside className="mt-8 rounded-2xl border border-border bg-card/70 p-5 text-sm leading-6 text-muted-foreground">
          {chart.sourceNote}
        </aside>
      )}
    </div>
  )
}
