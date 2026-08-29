'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BackButton({ href, label }: { href: string; label: string }) {
  const router = useRouter()

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(href)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full font-bold"
      onClick={handleBack}
    >
      <ArrowLeft aria-hidden="true" />
      {label}
    </Button>
  )
}
