'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpenText, House, PersonStanding } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NavLinks({
  labels,
  showHumanoid,
}: {
  labels: {
    home: string
    levels: string
    humanoid: string
    mainNavigation: string
  }
  showHumanoid: boolean
}) {
  const pathname = usePathname()
  const links = [
    {
      href: '/',
      label: labels.home,
      icon: House,
      matches: (path: string) => path === '/',
    },
    {
      href: '/levels/',
      label: labels.levels,
      icon: BookOpenText,
      matches: (path: string) => path.startsWith('/levels') || path.startsWith('/skills-chart'),
    },
    ...(showHumanoid
      ? [{
          href: '/humanoid/',
          label: labels.humanoid,
          icon: PersonStanding,
          matches: (path: string) => path.startsWith('/humanoid'),
        }]
      : []),
  ]

  return (
    <nav
      aria-label={labels.mainNavigation}
      className="flex items-center gap-1 rounded-full border border-border/80 bg-card/70 p-1 shadow-sm backdrop-blur-xl"
    >
      {links.map((link) => {
        const active = link.matches(pathname)
        const Icon = link.icon

        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              buttonVariants({ variant: active ? 'default' : 'ghost', size: 'lg' }),
              'h-11 min-w-28 rounded-full px-5 text-sm font-extrabold sm:min-w-32 sm:px-7',
              active
                ? 'shadow-md'
                : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
