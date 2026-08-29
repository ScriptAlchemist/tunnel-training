import { Logo } from './logo'
import { MobileNavigation } from './mobile-navigation'
import { NavLinks } from './nav-links'
import { ThemeToggle } from './theme-toggle'
import { getHumanoidContent, getSiteContent } from '@/lib/course'

export function Header() {
  const site = getSiteContent()
  const humanoid = getHumanoidContent()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header)] backdrop-blur-xl">
      <div className="shell flex min-h-18 items-center justify-between gap-5 py-3 md:py-0">
        <Logo />
        <div className="hidden items-center justify-end gap-4 md:flex">
          <NavLinks
            labels={{ ...site.navigation, mainNavigation: site.labels.mainNavigation }}
            showHumanoid={humanoid.visible}
          />
          <ThemeToggle labels={site.theme} />
        </div>
        <div className="md:hidden">
          <MobileNavigation
            labels={{
              ...site.navigation,
              mainNavigation: site.labels.mainNavigation,
              openMenu: site.labels.openMenu,
              closeMenu: site.labels.closeMenu,
              appearance: site.labels.appearance,
            }}
            showHumanoid={humanoid.visible}
            themeLabels={site.theme}
          />
        </div>
      </div>
    </header>
  )
}
