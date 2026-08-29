'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode, type SyntheticEvent } from 'react'

function getOpenItems(parameter: string) {
  const params = new URLSearchParams(window.location.search)
  return new Set(
    (params.get(parameter) ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )
}

export function UrlStateDetails({
  children,
  className,
  defaultOpen,
  stateId,
  style,
  urlParameter,
}: {
  children: ReactNode
  className?: string
  defaultOpen: boolean
  stateId?: string
  style?: CSSProperties
  urlParameter?: string
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const hasRestored = useRef(!urlParameter || !stateId)

  useEffect(() => {
    if (!urlParameter || !stateId || !detailsRef.current) return

    detailsRef.current.open = getOpenItems(urlParameter).has(stateId)
    hasRestored.current = true
  }, [stateId, urlParameter])

  function handleToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    if (!urlParameter || !stateId || !hasRestored.current) return

    const params = new URLSearchParams(window.location.search)
    const openItems = getOpenItems(urlParameter)

    if (event.currentTarget.open) {
      openItems.add(stateId)
    } else {
      openItems.delete(stateId)
    }

    if (openItems.size > 0) {
      params.set(urlParameter, [...openItems].sort().join(','))
    } else {
      params.delete(urlParameter)
    }

    const query = params.toString()
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    window.history.replaceState(window.history.state, '', nextUrl)
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
