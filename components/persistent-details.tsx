'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode, type SyntheticEvent } from 'react'

export function PersistentDetails({
  children,
  className,
  defaultOpen,
  storageKey,
  style,
}: {
  children: ReactNode
  className?: string
  defaultOpen: boolean
  storageKey?: string
  style?: CSSProperties
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const hasRestored = useRef(!storageKey)

  useEffect(() => {
    if (!storageKey) return

    try {
      const storedState = window.sessionStorage.getItem(storageKey)

      if (storedState !== null && detailsRef.current) {
        detailsRef.current.open = storedState === 'open'
      }
    } catch {
      // Keep the markdown-defined default when browser storage is unavailable.
    } finally {
      hasRestored.current = true
    }
  }, [storageKey])

  function handleToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    if (!storageKey || !hasRestored.current) return

    try {
      window.sessionStorage.setItem(
        storageKey,
        event.currentTarget.open ? 'open' : 'closed'
      )
    } catch {
      // The details element still works normally when browser storage is unavailable.
    }
  }

  return (
    <details
      ref={detailsRef}
      open={defaultOpen}
      className={className}
      style={style}
      onToggle={handleToggle}
    >
      {children}
    </details>
  )
}
