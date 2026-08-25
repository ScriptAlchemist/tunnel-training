import Link from 'next/link'
import { getSiteContent, type PrerequisiteContent } from '@/lib/course'

export function PrerequisiteCard({
  content,
  href,
}: {
  content: PrerequisiteContent
  href: string
}) {
  const site = getSiteContent()

  return (
    <Link
      href={href}
      className="group mt-8 block rounded-[1.5rem] border border-primary/25 bg-accent/55 p-6 transition hover:-translate-y-0.5 hover:border-primary hover:bg-accent sm:p-7"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-primary uppercase">
            {content.eyebrow}
          </p>
          <h2 className="display-type mt-2 text-2xl font-black sm:text-3xl">{content.title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{content.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {content.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-border bg-card/75 px-3 py-1 text-xs font-bold text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-primary">
          {site.labels.viewPrerequisites}{' '}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
