'use client'

import { useState, type ReactNode } from 'react'
import { GitBranch, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type CourseView = 'cards' | 'chart'

export function CourseViewSwitcher({
  initialView,
  cardsLabel,
  chartLabel,
  viewLabel,
  cardsView,
  chartView,
}: {
  initialView: CourseView
  cardsLabel: string
  chartLabel: string
  viewLabel: string
  cardsView: ReactNode
  chartView: ReactNode
}) {
  const [view, setView] = useState<CourseView>(initialView)

  return (
    <div className="mt-10">
      <div
        role="group"
        aria-label={viewLabel}
        className="inline-flex gap-1 rounded-full border border-border/80 bg-card/70 p-1 shadow-sm backdrop-blur-xl"
      >
        <Button
          type="button"
          size="lg"
          variant={view === 'cards' ? 'default' : 'ghost'}
          aria-pressed={view === 'cards'}
          onClick={() => setView('cards')}
          className={`h-11 min-w-28 rounded-full px-5 text-sm font-extrabold sm:min-w-32 sm:px-7 ${
            view === 'cards'
              ? 'shadow-md'
              : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
          }`}
        >
          <LayoutGrid className="size-4.5" aria-hidden="true" />
          {cardsLabel}
        </Button>
        <Button
          type="button"
          size="lg"
          variant={view === 'chart' ? 'default' : 'ghost'}
          aria-pressed={view === 'chart'}
          onClick={() => setView('chart')}
          className={`h-11 min-w-28 rounded-full px-5 text-sm font-extrabold sm:min-w-32 sm:px-7 ${
            view === 'chart'
              ? 'shadow-md'
              : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
          }`}
        >
          <GitBranch className="size-4.5" aria-hidden="true" />
          {chartLabel}
        </Button>
      </div>

      <div className="mt-10">
        {view === 'cards' ? cardsView : chartView}
      </div>
    </div>
  )
}
