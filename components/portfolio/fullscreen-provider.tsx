"use client"

import { Pause, Play } from "@phosphor-icons/react"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { Button } from "@/components/ui/button"

type MotionChoice = "auto" | "play" | "pause"
type Connection = EventTarget & { saveData?: boolean }
type State = {
  active: string
  visible: boolean
  restrictions: number
  choice: MotionChoice
  mounted: boolean
}
const BackgroundContext = createContext<{
  active: string
  playing: boolean
  mounted: boolean
  toggle: () => void
} | null>(null)

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    active: "inicio",
    visible: true,
    restrictions: 0,
    choice: "auto",
    mounted: false,
  })
  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>("[data-screen]"),
    ]
    const ratios = new Map<string, number>()
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: Connection })
      .connection
    function sync() {
      const restrictions =
        Number(motion.matches) + Number(Boolean(connection?.saveData)) * 2
      setState((previous) => ({
        ...previous,
        mounted: true,
        visible: document.visibilityState === "visible",
        restrictions,
        choice:
          previous.choice === "play" && previous.restrictions !== restrictions
            ? "auto"
            : previous.choice,
      }))
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          ratios.set(entry.target.id, entry.intersectionRatio)
        const active =
          [...ratios].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "inicio"
        setState((previous) =>
          previous.active === active ? previous : { ...previous, active }
        )
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1] }
    )
    sections.forEach((section) => observer.observe(section))
    const header = document.querySelector<HTMLElement>(
      "[data-portfolio-header]"
    )
    const resize = new ResizeObserver(() => {
      if (header)
        document.documentElement.style.setProperty(
          "--portfolio-header-height",
          `${header.getBoundingClientRect().height}px`
        )
    })
    if (header) resize.observe(header)
    motion.addEventListener("change", sync)
    connection?.addEventListener("change", sync)
    document.addEventListener("visibilitychange", sync)
    sync()
    return () => {
      observer.disconnect()
      resize.disconnect()
      motion.removeEventListener("change", sync)
      connection?.removeEventListener("change", sync)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [])
  const playing =
    state.mounted &&
    state.visible &&
    state.choice !== "pause" &&
    (state.restrictions === 0 || state.choice === "play")
  return (
    <BackgroundContext
      value={{
        active: state.active,
        playing,
        mounted: state.mounted,
        toggle: () =>
          setState((previous) => ({
            ...previous,
            choice: playing ? "pause" : "play",
          })),
      }}
    >
      {children}
    </BackgroundContext>
  )
}

export function useFullscreenBackground() {
  const value = useContext(BackgroundContext)
  if (!value) throw new Error("FullscreenProvider is required")
  return value
}

export function BackgroundToggle({ locale }: { locale: "es" | "en" }) {
  const { playing, toggle, mounted } = useFullscreenBackground()
  const label = playing
    ? locale === "es"
      ? "Pausar fondos"
      : "Pause backgrounds"
    : locale === "es"
      ? "Animar fondos"
      : "Animate backgrounds"
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      disabled={!mounted}
      aria-label={label}
      title={label}
      aria-pressed={!playing}
      className="requires-js size-11 shrink-0"
    >
      {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
    </Button>
  )
}
