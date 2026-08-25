'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
            className={`nav-link rounded-full px-3 py-2 sm:px-4 ${active ? 'nav-link-active' : ''}`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
