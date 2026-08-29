'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpenText, House, Menu, PersonStanding, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MobileNavigationLabels = {
  home: string
  levels: string
  humanoid: string
  mainNavigation: string
  openMenu: string
  closeMenu: string
  appearance: string
}

export function MobileNavigation({
  labels,
  showHumanoid,
  themeLabels,
}: {
  labels: MobileNavigationLabels
  showHumanoid: boolean
  themeLabels: { toggle: string }
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
      matches: (path: string) =>
        path.startsWith('/levels') || path.startsWith('/skills-chart'),
    },
    ...(showHumanoid
      ? [
          {
            href: '/humanoid/',
            label: labels.humanoid,
            icon: PersonStanding,
            matches: (path: string) => path.startsWith('/humanoid'),
          },
        ]
      : []),
  ]

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-11 cursor-pointer rounded-full border-primary/20 bg-accent/70 shadow-sm backdrop-blur-xl dark:border-border dark:bg-card/70"
          aria-label={labels.openMenu}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-80 bg-foreground/25 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-90 flex w-[min(22rem,calc(100%-2.5rem))] flex-col border-l border-border bg-background p-5 shadow-2xl duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        >
          <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
            <Dialog.Title className="display-type text-xl font-black">
              {labels.mainNavigation}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className="size-11 rounded-full"
                aria-label={labels.closeMenu}
              >
                <X className="size-5" aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>

          <nav aria-label={labels.mainNavigation} className="mt-6 grid gap-2">
            {links.map((link) => {
              const active = link.matches(pathname)
              const Icon = link.icon

              return (
                <Dialog.Close asChild key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      buttonVariants({
                        variant: active ? 'default' : 'ghost',
                        size: 'lg',
                      }),
                      'h-14 w-full justify-start rounded-2xl px-5 text-base font-extrabold',
                      !active &&
                        'text-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    {link.label}
                  </Link>
                </Dialog.Close>
              )
            })}
          </nav>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-5">
            <span className="text-sm font-extrabold text-muted-foreground">
              {labels.appearance}
            </span>
            <ThemeToggle labels={themeLabels} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
