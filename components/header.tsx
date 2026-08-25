import { Logo } from './logo'
import { NavLinks } from './nav-links'
import { ThemeToggle } from './theme-toggle'
import { getSiteContent } from '@/lib/course'

export function Header() {
  const site = getSiteContent()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header)] backdrop-blur-xl">
      <div className="shell flex min-h-18 flex-wrap items-center justify-between gap-x-5 gap-y-2 py-3 sm:flex-nowrap sm:py-0">
        <Logo />
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-4">
          <NavLinks labels={{ ...site.navigation, mainNavigation: site.labels.mainNavigation }} />
          <ThemeToggle labels={site.theme} />
        </div>
      </div>
    </header>
  )
}
