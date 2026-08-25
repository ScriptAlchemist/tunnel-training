'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NavLinks({ labels }: { labels: { levels: string; about: string; mainNavigation: string } }) {
  const pathname = usePathname()
  const links = [
    { href: '/levels/', label: labels.levels, matches: (path: string) => path.startsWith('/levels') },
    { href: '/#about', label: labels.about, matches: (path: string) => path === '/' },
  ]

  return (
    <nav aria-label={labels.mainNavigation} className="flex items-center gap-1 text-sm font-bold">
      {links.map((link) => {
        const active = link.matches(pathname)

        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              buttonVariants({ variant: active ? 'default' : 'ghost', size: 'sm' }),
              'rounded-full px-3 font-bold sm:px-4'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
