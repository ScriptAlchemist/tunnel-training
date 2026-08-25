import Link from 'next/link'
import { getSiteContent, type PrerequisiteContent } from '@/lib/course'

type Breadcrumb = {
  label: string
  href?: string
}

export function PrerequisitePage({
  content,
  breadcrumbs,
}: {
  content: PrerequisiteContent
  breadcrumbs: Breadcrumb[]
}) {
  const site = getSiteContent()

  return (
    <div className="shell py-10 sm:py-16">
      <nav
        aria-label={site.labels.breadcrumb}
        className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground"
      >
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`} className="contents">
            {index > 0 && <span>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary">{item.label}</Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </span>
        ))}
      </nav>

      <header className="mt-10 max-w-4xl">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1 className="display-type balance mt-5 text-4xl font-black sm:text-6xl">
          {content.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          {content.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {content.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground"
            >
              {topic}
            </span>
          ))}
        </div>
      </header>

      <article className="panel lesson-copy mt-10 rounded-[1.75rem] p-6 sm:p-10">
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </article>
    </div>
  )
}
