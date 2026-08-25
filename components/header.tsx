import Link from 'next/link'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header)] backdrop-blur-xl">
      <div className="shell flex h-18 items-center justify-between gap-5">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm font-bold">
            <Link href="/levels/" className="rounded-full px-3 py-2 transition hover:bg-[var(--panel)] sm:px-4">
              Levels
            </Link>
            <Link href="/#about" className="rounded-full px-3 py-2 transition hover:bg-[var(--panel)] sm:px-4">
              About
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
