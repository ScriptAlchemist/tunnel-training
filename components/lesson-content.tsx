import { Fragment } from 'react'
import { TunnelAxisVisual } from '@/components/tunnel-axis-visual'
import type { SiteContent } from '@/lib/course'

const visualPattern = /<p>\s*\{\{visual:([a-z0-9-]+)\}\}\s*<\/p>/g

export function LessonContent({
  html,
  visuals,
}: {
  html: string
  visuals: SiteContent['visuals']
}) {
  const parts = html.split(visualPattern)

  return (
    <div className="lesson-copy">
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return part ? (
            <div key={`copy-${index}`} dangerouslySetInnerHTML={{ __html: part }} />
          ) : null
        }

        if (part === 'tunnel-axis') {
          return <TunnelAxisVisual key={`visual-${index}`} labels={visuals.tunnelAxis} />
        }

        return <Fragment key={`unknown-${index}`} />
      })}
    </div>
  )
}
