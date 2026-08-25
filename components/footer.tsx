import Link from 'next/link'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] py-10">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
          Lesson plans by Justin Bender. Train with a qualified tunnel instructor and fly within your demonstrated ability.
        </p>
        <Link href="/levels/" className="text-sm font-extrabold text-[var(--accent)]">
          Explore levels →
        </Link>
      </div>
    </footer>
  )
}
