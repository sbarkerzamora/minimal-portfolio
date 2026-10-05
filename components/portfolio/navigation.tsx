"use client"

import { ArrowUpRight, List, X } from "@phosphor-icons/react/dist/ssr"
import { useEffect, useId, useRef, useState } from "react"

type NavigationItem = { href: string; label: string }

export function PortfolioNavigation({
  items,
  label,
  menuLabel,
}: {
  items: NavigationItem[]
  label: string
  menuLabel: string
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function dismiss(event: PointerEvent) {
      const details = detailsRef.current
      if (details && !details.contains(event.target as Node))
        details.open = false
    }
    function onResize() {
      if (window.innerWidth >= 1536 && detailsRef.current) {
        detailsRef.current.open = false
      }
    }
    document.addEventListener("pointerdown", dismiss)
    window.addEventListener("resize", onResize)
    return () => {
      document.removeEventListener("pointerdown", dismiss)
      window.removeEventListener("resize", onResize)
    }
  }, [open])

  return (
    <details
      ref={detailsRef}
      className="group 2xl:hidden"
      onToggle={(event) => setOpen(event.currentTarget.open)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && event.currentTarget.open) {
          event.preventDefault()
          event.currentTarget.open = false
          event.currentTarget.querySelector("summary")?.focus()
        }
      }}
    >
      <summary
        aria-controls={menuId}
        className="flex size-11 list-none items-center justify-center rounded-md transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden"
      >
        <span className="sr-only">{menuLabel}</span>
        <List className="size-6 group-open:hidden" aria-hidden="true" />
        <X className="hidden size-6 group-open:block" aria-hidden="true" />
      </summary>
      <nav
        id={menuId}
        aria-label={label}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-y border-border bg-popover p-5 text-popover-foreground shadow-xl sm:px-8"
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => {
              if (detailsRef.current) detailsRef.current.open = false
              document
                .querySelector<HTMLElement>(item.href)
                ?.focus({ preventScroll: true })
            }}
            className="flex min-h-14 items-center justify-between gap-4 border-b border-border py-3 text-lg font-medium transition-colors last:border-0 hover:text-primary"
          >
            {item.label}
            <ArrowUpRight
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </a>
        ))}
      </nav>
    </details>
  )
}
