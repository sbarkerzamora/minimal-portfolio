"use client"

// Source: https://www.cult-ui.com/r/direction-aware-tabs.json
// Directional slide and shared bubble retained. Fixed viewport, keyboard and
// reduced-motion support replace the original animated content-height measure.
import { type ReactNode, useId, useState } from "react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react"
import { cn } from "@/lib/utils"

type Tab = { id: number; label: string; content: ReactNode }

export function DirectionAwareTabs({
  tabs,
  className,
  label,
}: {
  tabs: Tab[]
  className?: string
  label: string
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? 0)
  const [direction, setDirection] = useState(0)
  const id = useId()
  const reduceMotion = useReducedMotion()
  const content = tabs.find((tab) => tab.id === activeTab)?.content

  function select(next: number) {
    setDirection(next > activeTab ? 1 : -1)
    setActiveTab(next)
  }

  const variants = {
    initial: (direction: number) => ({
      x: reduceMotion ? 0 : 80 * direction,
      opacity: 0,
    }),
    active: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: reduceMotion ? 0 : -80 * direction,
      opacity: 0,
    }),
  }

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col gap-5", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="flex w-fit max-w-full shrink-0 gap-1 overflow-x-auto rounded-lg bg-muted p-1"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.id}`}
            aria-controls={`${id}-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => select(tab.id)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % tabs.length
                  : event.key === "ArrowLeft"
                    ? (index - 1 + tabs.length) % tabs.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? tabs.length - 1
                        : -1
              if (next < 0) return
              event.preventDefault()
              select(tabs[next].id)
              document
                .getElementById(`${id}-tab-${tabs[next].id}`)
                ?.focus({ preventScroll: true })
            }}
            className={cn(
              "relative flex min-h-11 shrink-0 items-center rounded-md px-4 text-sm font-medium",
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId={`${id}-bubble`}
                className="absolute inset-0 rounded-md border border-border bg-background"
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
      <MotionConfig
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              id={`${id}-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${activeTab}`}
              tabIndex={0}
              variants={variants}
              initial="initial"
              animate="active"
              exit="exit"
              custom={direction}
              className="h-full overflow-y-auto px-1 pb-1"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </MotionConfig>
    </div>
  )
}
