'use client'

import { useEffect, useState, type ReactNode } from 'react'
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

  useEffect(() => {
    const urlView = new URLSearchParams(window.location.search).get('view')

    if (urlView === 'cards' || urlView === 'chart') {
      setView(urlView)
    }
  }, [])

  function selectView(nextView: CourseView) {
    setView(nextView)

    const params = new URLSearchParams(window.location.search)
    params.set('view', nextView)

    const query = params.toString()
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    window.history.replaceState(window.history.state, '', nextUrl)
  }

  return (
    <div className="mt-10">
      <div
        role="group"
        aria-label={viewLabel}
        className="inline-flex gap-1 rounded-full border border-border/80 bg-card/70 p-1 shadow-sm backdrop-blur-xl dark:border-primary/25 dark:bg-background/60"
      >
        <Button
          type="button"
          size="lg"
          variant={view === 'cards' ? 'default' : 'ghost'}
          aria-pressed={view === 'cards'}
          onClick={() => selectView('cards')}
          className={`h-11 min-w-28 rounded-full px-5 text-sm font-extrabold sm:min-w-32 sm:px-7 ${
            view === 'cards'
              ? 'shadow-md dark:bg-[oklch(0.52_0.2_264)] dark:text-white dark:hover:bg-[oklch(0.49_0.2_264)]'
              : 'text-muted-foreground hover:bg-background/80 hover:text-foreground dark:text-foreground/80 dark:hover:bg-accent dark:hover:text-accent-foreground'
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
          onClick={() => selectView('chart')}
          className={`h-11 min-w-28 rounded-full px-5 text-sm font-extrabold sm:min-w-32 sm:px-7 ${
            view === 'chart'
              ? 'shadow-md dark:bg-[oklch(0.52_0.2_264)] dark:text-white dark:hover:bg-[oklch(0.49_0.2_264)]'
              : 'text-muted-foreground hover:bg-background/80 hover:text-foreground dark:text-foreground/80 dark:hover:bg-accent dark:hover:text-accent-foreground'
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
