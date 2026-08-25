import Link from 'next/link'
import { getSiteContent, type CourseLevel, type LessonGroup } from '@/lib/course'

export function SectionCard({
  level,
  section,
  number,
}: {
  level: CourseLevel
  section: LessonGroup
  number: number
}) {
  const site = getSiteContent()

  return (
    <Link
      href={`/levels/${level.slug}/sections/${section.slug}/`}
      className="panel group flex min-h-72 flex-col rounded-[1.75rem] p-7 transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl sm:p-8"
    >
      <div className="flex items-start justify-between gap-5">
        <span className="display-type text-4xl font-black text-primary/35">
          {String(number).padStart(2, '0')}
        </span>
        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-extrabold text-muted-foreground">
          {section.lessons.length}{' '}
          {section.lessons.length === 1
            ? site.labels.lesson.toLowerCase()
            : site.labels.lessons.toLowerCase()}
        </span>
      </div>
      <div className="mt-auto pt-10">
        <p className="text-xs font-extrabold tracking-[0.16em] text-primary uppercase">
          {site.labels.section} {String(number).padStart(2, '0')}
        </p>
        <h2 className="display-type mt-3 text-3xl font-black sm:text-4xl">{section.title}</h2>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{section.description}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold">
          {site.labels.viewSection}{' '}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
