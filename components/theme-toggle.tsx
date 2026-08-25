'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="cursor-pointer rounded-full"
      aria-label={isDark ? 'Use light theme' : 'Use dark theme'}
    >
      <span aria-hidden="true" suppressHydrationWarning>
        {isDark ? <Sun /> : <Moon />}
      </span>
    </Button>
  )
}
