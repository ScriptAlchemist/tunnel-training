import type { PrerequisiteContent } from '@/lib/course'

export function PrerequisiteSection({ content }: { content: PrerequisiteContent }) {
  const headingId = `${content.level}-${content.section ?? 'level'}-prerequisites`

  return (
    <section
      className="border-y border-border py-8 sm:py-10"
      aria-labelledby={headingId}
    >
      <header className="max-w-4xl">
        <p className="text-xs font-extrabold tracking-[0.16em] text-primary uppercase">
          {content.eyebrow}
        </p>
        <h2
          id={headingId}
          className="display-type mt-2 text-2xl font-black sm:text-3xl"
        >
          {content.title}
        </h2>
        {content.description && (
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            {content.description}
          </p>
        )}
        {content.topics.length > 0 && (
          <p className="mt-4 text-sm font-bold text-muted-foreground">
            {content.topics.join(' · ')}
          </p>
        )}
      </header>

      {content.html && (
        <div
          className="lesson-copy mt-8 max-w-5xl"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
    </section>
  )
}
