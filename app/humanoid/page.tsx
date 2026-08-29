import type { Metadata } from 'next'
import { HumanoidEditor } from '@/components/humanoid-editor'
import { getHumanoidContent } from '@/lib/course'
import { createPageMetadata } from '@/lib/seo'

const content = getHumanoidContent()

export const metadata: Metadata = createPageMetadata({
  title: content.title,
  description: content.description,
  pathname: '/humanoid/',
  index: content.visible,
})

export default function HumanoidPage() {
  return (
    <div className="shell py-10 sm:py-14">
      <header className="mb-8 max-w-3xl sm:mb-10">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1 className="display-type balance mt-4 text-5xl font-black sm:text-7xl">
          {content.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          {content.description}
        </p>
      </header>
      <HumanoidEditor content={content} />
    </div>
  )
}
