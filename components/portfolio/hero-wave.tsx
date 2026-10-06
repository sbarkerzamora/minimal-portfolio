"use client"

import { Pause, Play } from "@phosphor-icons/react/dist/ssr"
import { useEffect, useRef, useState, type ComponentType } from "react"

import type { AsciiWaveProps } from "@/components/originkit/ui/ascii-wave"
import { AsciiArtwork } from "@/components/portfolio/ascii-artwork"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Connection = EventTarget & { saveData?: boolean }

export function HeroWave({ locale }: { locale: "es" | "en" }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [Wave, setWave] = useState<ComponentType<AsciiWaveProps> | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [environment, setEnvironment] = useState({
    mounted: false,
    visible: false,
    restrictions: 0,
    manual: "auto",
  })
  const permitted =
    environment.restrictions === 0 || environment.manual === "play"
  const playing =
    environment.visible &&
    permitted &&
    environment.manual !== "pause" &&
    !failed
  const load = environment.mounted && environment.visible && permitted

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: Connection })
      .connection
    let intersecting = false
    function sync() {
      const restrictions =
        Number(motion.matches) + Number(Boolean(connection?.saveData)) * 2
      setEnvironment((previous) => ({
        mounted: true,
        visible: intersecting && document.visibilityState === "visible",
        restrictions,
        manual:
          previous.manual === "play" && previous.restrictions !== restrictions
            ? "auto"
            : previous.manual,
      }))
    }
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      sync()
    })
    observer.observe(container)
    motion.addEventListener("change", sync)
    connection?.addEventListener("change", sync)
    document.addEventListener("visibilitychange", sync)
    sync()
    return () => {
      observer.disconnect()
      motion.removeEventListener("change", sync)
      connection?.removeEventListener("change", sync)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [])

  useEffect(() => {
    if (!load || Wave || failed) return
    let active = true
    void import("@/components/originkit/ui/ascii-wave")
      .then((module) => {
        if (active) setWave(() => module.default)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [load, Wave, failed])

  const label = failed
    ? locale === "es"
      ? "Fondo estático"
      : "Static background"
    : playing
      ? locale === "es"
        ? "Pausar fondo"
        : "Pause background"
      : locale === "es"
        ? "Animar fondo"
        : "Animate background"

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
        data-wave-state={playing && ready ? "playing" : "static"}
      >
        <div className="absolute inset-y-0 -right-[25%] left-[10%] md:left-[25%]">
          <AsciiArtwork
            className={cn(
              "absolute inset-0 size-full scale-150 opacity-70 transition-opacity duration-300 motion-reduce:transition-none",
              ready && !failed && "opacity-0"
            )}
          />
          {Wave && !failed && (
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none",
                ready && !failed ? "opacity-80" : "opacity-0"
              )}
            >
              <Wave
                ink="var(--primary)"
                lit="var(--foreground)"
                cell={12}
                rings={8}
                speed={1.8}
                swell={2}
                warp={5}
                radius={200}
                weight={3}
                paused={!playing}
                onReady={() => setReady(true)}
                onError={() => setFailed(true)}
              />
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklch,var(--background)_94%,transparent)_35%,color-mix(in_oklch,var(--background)_75%,transparent)_56%,transparent_80%)] max-md:bg-[linear-gradient(90deg,color-mix(in_oklch,var(--background)_96%,transparent),color-mix(in_oklch,var(--background)_88%,transparent)_70%,color-mix(in_oklch,var(--background)_70%,transparent))]" />
      </div>
      {environment.mounted && (
        <Button
          type="button"
          variant="secondary"
          disabled={failed}
          onClick={() =>
            setEnvironment((previous) => ({
              ...previous,
              manual: playing ? "pause" : "play",
            }))
          }
          className="absolute right-5 bottom-5 z-20 min-h-11 rounded-md px-4 sm:right-8 lg:right-12"
        >
          {playing ? (
            <Pause data-icon="inline-start" aria-hidden="true" />
          ) : (
            <Play data-icon="inline-start" aria-hidden="true" />
          )}
          {label}
        </Button>
      )}
    </>
  )
}
