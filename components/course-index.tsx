import { CourseViewSwitcher, type CourseView } from '@/components/course-view-switcher'
import { LevelCard } from '@/components/level-card'
import { SkillsGraph } from '@/components/skills-graph'
import { getLevels, getSiteContent, getSkillsChartContent } from '@/lib/course'

export function CourseIndex({ initialView = 'cards' }: { initialView?: CourseView }) {
  const levels = getLevels()
  const site = getSiteContent()
  const chart = getSkillsChartContent()

  const cardsView = (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        {levels.map((level) => (
          <LevelCard key={level.slug} level={level} />
        ))}
      </div>
      <aside className="mt-8 rounded-2xl border border-border bg-card/70 p-6 text-sm leading-7 text-muted-foreground">
        <strong className="text-foreground">{site.labels.readinessTitle}</strong>{' '}
        {site.labels.readinessText}
      </aside>
    </>
  )

  const chartView = (
    <>
      <header className="mb-10 max-w-4xl">
        <span className="eyebrow">{chart.eyebrow}</span>
        <h2 className="display-type balance mt-4 text-3xl font-black sm:text-5xl">
          {chart.title}
        </h2>
        <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">
          {chart.description}
        </p>
      </header>
      <SkillsGraph levels={levels} />
    </>
  )

  return (
    <div className="shell py-14 sm:py-22">
      <header className="max-w-3xl">
        <span className="eyebrow">{site.labels.courseIndex}</span>
        <h1 className="display-type balance mt-5 text-5xl font-black sm:text-7xl">
          {site.labels.levelIndexTitle}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {site.labels.levelIndexDescription}
        </p>
      </header>

      <CourseViewSwitcher
        initialView={initialView}
        cardsLabel={chart.cardsViewLabel}
        chartLabel={chart.chartViewLabel}
        viewLabel={chart.viewSwitcherLabel}
        cardsView={cardsView}
        chartView={chartView}
      />
    </div>
  )
}
