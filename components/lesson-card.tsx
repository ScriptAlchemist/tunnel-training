import Link from 'next/link'
import type { Lesson } from '@/lib/course'

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      href={`/levels/${lesson.levelSlug}/${lesson.slug}/`}
      className="group grid gap-5 border-t border-[var(--line)] py-6 transition sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-6"
    >
      <span className="display-type text-xl font-extrabold text-[var(--accent)]">
        {String(lesson.number).padStart(2, '0')}
      </span>
      <span>
        <span className="display-type text-xl font-extrabold transition-colors group-hover:text-[var(--accent)] sm:text-2xl">
          {lesson.title}
        </span>
        <span className="mt-2 block max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
          {lesson.summary}
        </span>
        <span className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[var(--muted)]">
          {lesson.prerequisite && (
            <span className="rounded-full bg-[var(--panel)] px-3 py-1">Prerequisite included</span>
          )}
          <span className="rounded-full bg-[var(--panel)] px-3 py-1">
            {lesson.videos.length ? `${lesson.videos.length} video${lesson.videos.length > 1 ? 's' : ''}` : 'Reference pending'}
          </span>
        </span>
      </span>
      <span className="hidden size-11 place-items-center rounded-full border border-[var(--line)] transition group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white sm:grid">
        ↗
      </span>
    </Link>
  )
}
