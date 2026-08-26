'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import type { PrerequisiteContent } from '@/lib/course'

export function PrerequisiteCard({
  content,
  labels,
}: {
  content: PrerequisiteContent
  labels: { show: string; hide: string }
}) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()

  return (
    <div className="relative z-10 border-t border-primary/20 bg-accent/65 backdrop-blur-sm">
      <button
        type="button"
        className="group flex w-full cursor-pointer flex-col gap-6 px-7 py-6 text-left transition-colors hover:bg-accent/45 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-7"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>
          <span className="block text-xs font-extrabold tracking-[0.16em] text-primary uppercase">
            {content.eyebrow}
          </span>
          <span className="display-type mt-2 block text-2xl font-black sm:text-3xl">
            {content.title}
          </span>
          {content.description && (
            <span className="mt-3 block max-w-3xl leading-7 text-muted-foreground">
              {content.description}
            </span>
          )}
        </span>
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-primary">
          {expanded ? labels.hide : labels.show}
          <ChevronDown
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {expanded && (
        <div id={panelId} className="border-t border-primary/20 px-7 py-7 sm:px-12 sm:py-8">
          {content.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-border bg-card/75 px-3 py-1 text-xs font-bold text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
          {content.html && (
            <div
              className={`lesson-copy ${content.topics.length > 0 ? 'mt-7' : ''}`}
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          )}
        </div>
      )}
    </div>
  )
}
