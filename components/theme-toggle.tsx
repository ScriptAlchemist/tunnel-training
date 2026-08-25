'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="grid size-10 cursor-pointer place-items-center rounded-full border border-[var(--line)] bg-[var(--panel)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
      aria-label={isDark ? 'Use light theme' : 'Use dark theme'}
    >
      <span aria-hidden="true" className="text-base" suppressHydrationWarning>
        {isDark ? '☀' : '◐'}
      </span>
    </button>
  )
}
