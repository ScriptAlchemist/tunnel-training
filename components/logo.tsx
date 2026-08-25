import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Tunnel Training home">
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-[var(--foreground)] text-[var(--background)]">
        <span className="absolute size-6 rounded-full border-2 border-current opacity-40 transition-transform duration-500 group-hover:scale-125" />
        <span className="absolute size-3 rounded-full border-2 border-current" />
        <span className="h-5 w-0.5 rotate-45 bg-current" />
      </span>
      <span className="display-type text-lg font-extrabold tracking-tight">Tunnel Training</span>
    </Link>
  )
}
