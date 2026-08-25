import Link from 'next/link'
import type { CourseLevel } from '@/lib/course'

export function LevelCard({ level }: { level: CourseLevel }) {
  const accent = level.color === 'coral' ? 'var(--accent)' : '#399ec2'

  return (
    <Link
      href={`/levels/${level.slug}/`}
      className="panel group relative flex min-h-80 flex-col overflow-hidden rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-9"
    >
      <span
        className="absolute -top-14 -right-14 size-52 rounded-full opacity-15 transition-transform duration-500 group-hover:scale-110"
        style={{ background: accent }}
      />
      <div className="relative flex items-start justify-between">
        <span className="display-type text-6xl font-black opacity-15">{level.number}</span>
        <span className="rounded-full border border-[var(--line)] bg-[var(--panel-solid)] px-3 py-1.5 text-xs font-extrabold">
          {level.lessons.length} lessons
        </span>
      </div>
      <div className="relative mt-auto pt-14">
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em]" style={{ color: accent }}>
          Level {Number(level.number)}
        </p>
        <h3 className="display-type balance text-3xl font-extrabold sm:text-4xl">{level.shortTitle}</h3>
        <p className="mt-4 max-w-lg leading-7 text-[var(--muted)]">{level.description}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold">
          View curriculum <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
