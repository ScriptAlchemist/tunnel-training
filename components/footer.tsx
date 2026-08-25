import Link from 'next/link'
import { getSiteContent } from '@/lib/course'
import { Logo } from './logo'

export function Footer() {
  const site = getSiteContent()

  return (
    <footer className="mt-24 border-t border-[var(--line)] py-10">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {site.footer.text}
        </p>
        <Link href="/levels/" className="text-sm font-extrabold text-primary">
          {site.footer.link}
        </Link>
      </div>
    </footer>
  )
}
