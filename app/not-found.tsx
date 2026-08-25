import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">Off course</p>
        <h1 className="display-type mt-5 text-6xl font-black">That lesson isn’t here.</h1>
        <p className="mt-5 text-muted-foreground">Return to the curriculum and choose another flight path.</p>
        <Button asChild size="lg" className="mt-8 rounded-full font-extrabold">
          <Link href="/levels/">View all levels</Link>
        </Button>
      </div>
    </div>
  )
}
