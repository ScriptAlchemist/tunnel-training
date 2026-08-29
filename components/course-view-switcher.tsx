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
        className="inline-flex rounded-full border border-border bg-muted/60 p-1"
      >
        <Button
          type="button"
          size="sm"
          variant={view === 'cards' ? 'default' : 'ghost'}
          aria-pressed={view === 'cards'}
          onClick={() => setView('cards')}
          className="rounded-full px-4 font-extrabold"
        >
          <LayoutGrid aria-hidden="true" />
          {cardsLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={view === 'chart' ? 'default' : 'ghost'}
          aria-pressed={view === 'chart'}
          onClick={() => setView('chart')}
          className="rounded-full px-4 font-extrabold"
        >
          <GitBranch aria-hidden="true" />
          {chartLabel}
        </Button>
      </div>

      <div className="mt-10">
        {view === 'cards' ? cardsView : chartView}
      </div>
    </div>
  )
}
