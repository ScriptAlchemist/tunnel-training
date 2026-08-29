'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NavLinks({
  labels,
  showHumanoid,
}: {
  labels: {
    home: string
    levels: string
    skillsChart: string
    humanoid: string
    mainNavigation: string
  }
  showHumanoid: boolean
}) {
  const pathname = usePathname()
  const links = [
    { href: '/', label: labels.home, matches: (path: string) => path === '/' },
    { href: '/levels/', label: labels.levels, matches: (path: string) => path.startsWith('/levels') },
    {
      href: '/skills-chart/',
      label: labels.skillsChart,
      matches: (path: string) => path.startsWith('/skills-chart'),
    },
    ...(showHumanoid
      ? [{ href: '/humanoid/', label: labels.humanoid, matches: (path: string) => path.startsWith('/humanoid') }]
      : []),
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
