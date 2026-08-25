import { Logo } from './logo'
import { NavLinks } from './nav-links'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header)] backdrop-blur-xl">
      <div className="shell flex h-18 items-center justify-between gap-5">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLinks />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
