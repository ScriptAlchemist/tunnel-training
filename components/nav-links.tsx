'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { href: '/levels/', label: 'Levels', matches: (pathname: string) => pathname.startsWith('/levels') },
  { href: '/#about', label: 'About', matches: (pathname: string) => pathname === '/' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm font-bold">
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
