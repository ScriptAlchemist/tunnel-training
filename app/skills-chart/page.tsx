import type { Metadata } from 'next'
import Link from 'next/link'
import { BackButton } from '@/components/back-button'
import { SkillsGraph } from '@/components/skills-graph'
import {
  getLevels,
  getSiteContent,
  getSkillsChartContent,
} from '@/lib/course'

const chart = getSkillsChartContent()

export const metadata: Metadata = {
  title: chart.title,
  description: chart.description,
}

export default function SkillsChartPage() {
  const levels = getLevels()
  const site = getSiteContent()

  return (
    <div className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-center gap-3">
        <BackButton href="/levels/" label={site.labels.back} />
        <nav
          aria-label={site.labels.breadcrumb}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary">{site.labels.home}</Link>
          <span>/</span>
          <Link href="/levels/" className="hover:text-primary">{site.labels.levels}</Link>
          <span>/</span>
          <span className="text-foreground">{chart.title}</span>
        </nav>
      </div>

      <header className="mt-10 max-w-4xl">
        <span className="eyebrow">{chart.eyebrow}</span>
        <h1 className="display-type balance mt-5 text-5xl font-black sm:text-7xl">
          {chart.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          {chart.description}
        </p>
      </header>

      <div className="mt-12 sm:mt-16">
        <SkillsGraph levels={levels} />
      </div>
    </div>
  )
}
