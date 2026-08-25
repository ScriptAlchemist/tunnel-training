import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSiteContent } from '@/lib/course'

export default function NotFound() {
  const site = getSiteContent()

  return (
    <div className="shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">{site.notFound.eyebrow}</p>
        <h1 className="display-type mt-5 text-6xl font-black">{site.notFound.title}</h1>
        <p className="mt-5 text-muted-foreground">{site.notFound.description}</p>
        <Button asChild size="lg" className="mt-8 rounded-full font-extrabold">
          <Link href="/levels/">{site.notFound.button}</Link>
        </Button>
      </div>
    </div>
  )
}
