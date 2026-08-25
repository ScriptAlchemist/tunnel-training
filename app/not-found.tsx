import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">Off course</p>
        <h1 className="display-type mt-5 text-6xl font-black">That lesson isn’t here.</h1>
        <p className="mt-5 text-[var(--muted)]">Return to the curriculum and choose another flight path.</p>
        <Link href="/levels/" className="action-primary mt-8 inline-flex rounded-full px-6 py-3 text-sm font-extrabold">
          View all levels
        </Link>
      </div>
    </div>
  )
}
