import type { Metadata } from 'next'
import { LevelCard } from '@/components/level-card'
import { getLevels, getSiteContent } from '@/lib/course'

const site = getSiteContent()

export const metadata: Metadata = {
  title: site.labels.levelIndexMetadataTitle,
  description: site.labels.levelIndexMetadataDescription,
}

export default function LevelsPage() {
  const levels = getLevels()

  return (
    <div className="shell py-14 sm:py-22">
      <header className="max-w-3xl">
        <span className="eyebrow">{site.labels.courseIndex}</span>
        <h1 className="display-type balance mt-5 text-5xl font-black sm:text-7xl">{site.labels.levelIndexTitle}</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {site.labels.levelIndexDescription}
        </p>
      </header>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {levels.map((level) => (
          <LevelCard key={level.slug} level={level} />
        ))}
      </div>
      <aside className="mt-8 rounded-2xl border border-border bg-card/70 p-6 text-sm leading-7 text-muted-foreground">
        <strong className="text-[var(--foreground)]">{site.labels.readinessTitle}</strong>{' '}
        {site.labels.readinessText}
      </aside>
    </div>
  )
}
