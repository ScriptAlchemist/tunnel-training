'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle({ labels }: { labels: { toggle: string } }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="size-11 cursor-pointer rounded-full border-primary/20 bg-accent/70 shadow-sm backdrop-blur-xl dark:border-border dark:bg-card/70"
      aria-label={labels.toggle}
    >
      <span aria-hidden="true">
        <Sun className="hidden dark:block" />
        <Moon className="block dark:hidden" />
      </span>
    </Button>
  )
}
