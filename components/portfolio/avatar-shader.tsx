"use client"

import { Heatmap } from "@paper-design/shaders-react"
import { useEffect, useRef, useState } from "react"

import Image from "next/image"

const MIN_DELAY_MS = 3_000
const MAX_DELAY_MS = 10_000
const SHADER_DURATION_MS = 3_000

const SHADER_PARAMS = {
  colors: ["#112069", "#1f3ca3", "#3265e7", "#6bd8ff", "#ffe77a", "#ff9a1f", "#ff4d00"],
  colorBack: "#000000",
  contour: 0.5,
  angle: 0,
  noise: 0,
  innerGlow: 0.5,
  outerGlow: 0.5,
  speed: 1,
  scale: 0.75,
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function AvatarShader({ name }: { name: string }) {
  const [mounted, setMounted] = useState(false)
  const [showShader, setShowShader] = useState(false)
  const [canvasSize, setCanvasSize] = useState(80)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const getInitialReducedMotion = () => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }
  const [reducedMotion, setReducedMotion] = useState(getInitialReducedMotion)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const update = () => setCanvasSize(el.offsetWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  const scheduleNextRef = useRef<() => void>(() => {})

  useEffect(() => {
    scheduleNextRef.current = () => {
      const delay = randomInt(MIN_DELAY_MS, MAX_DELAY_MS)
      timerRef.current = setTimeout(() => {
        setShowShader(true)
        timerRef.current = setTimeout(() => {
          setShowShader(false)
          scheduleNextRef.current()
        }, SHADER_DURATION_MS)
      }, delay)
    }

    if (reducedMotion) return
    scheduleNextRef.current()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [reducedMotion])

  return (
    <div ref={wrapperRef} className="relative size-20 overflow-hidden rounded-full sm:size-28">
      <Image
        src="/avatar.webp"
        alt={`Retrato de ${name}`}
        width={canvasSize}
        height={canvasSize}
        priority
        className="absolute inset-0 size-full rounded-full object-cover transition-opacity duration-200"
        style={{ opacity: showShader ? 0 : 1 }}
      />
      {mounted && (
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: showShader ? 1 : 0 }}
          aria-hidden={!showShader}
        >
          <Heatmap
            width={canvasSize}
            height={canvasSize}
            image="/avatar.webp"
            colors={SHADER_PARAMS.colors}
            colorBack={SHADER_PARAMS.colorBack}
            contour={SHADER_PARAMS.contour}
            angle={SHADER_PARAMS.angle}
            noise={SHADER_PARAMS.noise}
            innerGlow={SHADER_PARAMS.innerGlow}
            outerGlow={SHADER_PARAMS.outerGlow}
            speed={SHADER_PARAMS.speed}
            scale={SHADER_PARAMS.scale}
            suspendWhenProcessingImage
          />
        </div>
      )}
    </div>
  )
}

export { AvatarShader }
