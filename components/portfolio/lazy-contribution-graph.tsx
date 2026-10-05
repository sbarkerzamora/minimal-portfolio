"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"

import type { ContributionGraphProps } from "@/components/smoothui/contribution-graph"
import { cn } from "@/lib/utils"

function LazyContributionGraph({
  locale = "es",
  className,
  ...props
}: ContributionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [Graph, setGraph] =
    useState<ComponentType<ContributionGraphProps> | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !("IntersectionObserver" in window)) return
    let active = true
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        void import("@/components/smoothui/contribution-graph")
          .then((module) => {
            if (active) setGraph(() => module.ContributionGraph)
          })
          .catch(() => {
            if (active) setFailed(true)
          })
      },
      { rootMargin: "240px" }
    )
    observer.observe(container)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        props.compact ? "min-h-0 w-full min-w-0" : "min-h-[28rem] w-full min-w-0 sm:min-h-96",
        className
      )}
    >
      {Graph ? (
        <Graph {...props} locale={locale} />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-lg bg-background p-6",
            props.compact ? "min-h-24" : "min-h-[28rem] sm:min-h-96"
          )}
        >
          <p
            role="status"
            className="max-w-sm text-center text-sm leading-relaxed text-pretty text-muted-foreground"
          >
            {failed
              ? locale === "es"
                ? "No se pudo cargar el gr\u00e1fico. Puedes consultar la actividad en el enlace de GitHub."
                : "The graph could not load. You can view activity using the GitHub link."
              : locale === "es"
                ? "El gr\u00e1fico de contribuciones se cargar\u00e1 al acercarte a esta secci\u00f3n."
                : "The contribution graph will load as you approach this section."}
          </p>
        </div>
      )}
    </div>
  )
}

export { LazyContributionGraph }
