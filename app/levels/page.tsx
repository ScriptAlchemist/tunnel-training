import type { Metadata } from 'next'
import { LevelCard } from '@/components/level-card'
import { getLevels } from '@/lib/course'

export const metadata: Metadata = {
  title: 'Training Levels',
  description: 'Explore the full tunnel flying curriculum by level.',
}

export default function LevelsPage() {
  const levels = getLevels()

  return (
    <div className="shell py-14 sm:py-22">
      <header className="max-w-3xl">
        <span className="eyebrow">Course index</span>
        <h1 className="display-type balance mt-5 text-5xl font-black sm:text-7xl">Your path through the air.</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Each level is a progression, not a checklist. Work with your instructor, repeat the fundamentals, and move forward when control feels dependable.
        </p>
      </header>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {levels.map((level) => (
          <LevelCard key={level.slug} level={level} />
        ))}
      </div>
      <aside className="mt-8 rounded-2xl border border-border bg-card/70 p-6 text-sm leading-7 text-muted-foreground">
        <strong className="text-[var(--foreground)]">A note on readiness:</strong> Prerequisites and desired outcomes are included on every lesson page. Your on-duty tunnel instructor has final authority over wind speed, spotting, and progression.
      </aside>
    </div>
  )
}
