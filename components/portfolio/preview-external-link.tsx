"use client"

import { useReducedMotion } from "motion/react"
import { useSyncExternalStore, type ReactNode } from "react"

import {
  PreviewLinkCard,
  PreviewLinkCardContent,
  PreviewLinkCardImage,
  PreviewLinkCardTrigger,
} from "@/components/animate-ui/components/radix/preview-link-card"

type PreviewExternalLinkProps = {
  href: string
  preview: string
  label: string
  locale: "es" | "en"
  className?: string
  children: ReactNode
}

const mobileQuery = "(max-width: 640px)"

function subscribeToWidth(onChange: () => void) {
  const query = window.matchMedia(mobileQuery)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function isMobileWidth() {
  return window.matchMedia(mobileQuery).matches
}

function serverWidth() {
  return false
}

export function PreviewExternalLink({
  href,
  preview,
  label,
  locale,
  className,
  children,
}: PreviewExternalLinkProps) {
  const reducedMotion = useReducedMotion()
  const mobile = useSyncExternalStore(
    subscribeToWidth,
    isMobileWidth,
    serverWidth
  )
  const domain = new URL(href).hostname.replace(/^www\./, "")

  return (
    <PreviewLinkCard href={href} src={preview} width={320} height={180}>
      <PreviewLinkCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      </PreviewLinkCardTrigger>
      <PreviewLinkCardContent
        side={mobile ? "bottom" : "right"}
        sideOffset={14}
        align="center"
        collisionPadding={16}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          locale === "es"
            ? `Abrir ${label} en una pestaña nueva`
            : `Open ${label} in a new tab`
        }
        transition={{ duration: reducedMotion ? 0 : 0.18 }}
        className="w-80 max-w-[calc(100vw-2rem)] border-border bg-popover p-1 text-popover-foreground shadow-lg"
      >
        <PreviewLinkCardImage
          alt={
            locale === "es"
              ? `Vista previa del sitio ${label}`
              : `Preview of the ${label} website`
          }
          loading="lazy"
          decoding="async"
          className="block aspect-video w-full rounded-sm object-cover"
        />
        <div className="flex items-center justify-between gap-3 px-2 py-1.5 text-left text-xs">
          <span className="truncate font-medium">{label}</span>
          <span className="shrink-0 text-muted-foreground">{domain}</span>
        </div>
      </PreviewLinkCardContent>
    </PreviewLinkCard>
  )
}
