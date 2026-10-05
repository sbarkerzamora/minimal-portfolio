"use client"

// Source: https://www.cult-ui.com/r/loading-carousel.json
// Embla carousel, caption and progress-indicator composition retained.
// Adaptations: opt-in autoplay, current locale data, correct selection direction,
// fixed media height, active-slide metadata and accessible manual controls.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { motion, useReducedMotion } from "motion/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

export interface Tip {
  text: string
  image: string
  alt: string
  url?: string
  content?: ReactNode
}

export function LoadingCarousel({
  tips,
  className,
  mediaHeight = 240,
  autoplay = false,
  autoplayInterval = 4500,
  onTipChange,
  locale = "es",
}: {
  tips: Tip[]
  className?: string
  mediaHeight?: number
  autoplay?: boolean
  autoplayInterval?: number
  onTipChange?: (index: number) => void
  locale?: "es" | "en"
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const previous = useRef(0)
  const [direction, setDirection] = useState(0)
  const reduced = useReducedMotion()
  const plugins = useMemo(
    () =>
      autoplay && !reduced
        ? [
            Autoplay({
              delay: autoplayInterval,
              stopOnInteraction: true,
              stopOnFocusIn: true,
            }),
          ]
        : [],
    [autoplay, autoplayInterval, reduced]
  )

  useEffect(() => {
    if (!api) return
    function select() {
      const next = api!.selectedScrollSnap()
      setDirection(next > previous.current ? 1 : -1)
      previous.current = next
      setCurrent(next)
      onTipChange?.(next)
    }
    api.on("select", select)
    api.on("reInit", select)
    return () => {
      api.off("select", select)
      api.off("reInit", select)
    }
  }, [api, onTipChange])

  const tip = tips[current] ?? tips[0]
  if (!tip) return null
  return (
    <div
      className={cn(
        "mx-auto flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <Carousel
        setApi={setApi}
        plugins={plugins}
        opts={{ loop: false }}
        aria-label={locale === "es" ? "Servicios" : "Services"}
        className="shrink-0"
      >
        <CarouselContent>
          {tips.map((item, index) => (
            <CarouselItem
              key={item.image + index}
              aria-label={`${index + 1} / ${tips.length}`}
              aria-hidden={index !== current}
              inert={index !== current}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ height: mediaHeight }}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  loading={index === current ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          aria-label={
            locale === "es" ? "Servicio anterior" : "Previous service"
          }
          className="left-3 size-11 bg-background"
        />
        <CarouselNext
          aria-label={locale === "es" ? "Siguiente servicio" : "Next service"}
          className="right-3 size-11 bg-background"
        />
      </Carousel>
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 sm:px-7">
        <div
          className="flex shrink-0 gap-2"
          aria-label={
            locale === "es" ? "Seleccionar servicio" : "Select a service"
          }
        >
          {tips.map((item, index) => (
            <button
              type="button"
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={item.text}
              aria-current={current === index ? "true" : undefined}
              className="flex min-h-11 min-w-11 flex-1 items-center rounded-sm"
            >
              <span className="relative h-1 w-full overflow-hidden rounded-full bg-foreground/15">
                <span
                  className={cn(
                    "absolute inset-0 origin-left bg-primary transition-transform motion-reduce:transition-none",
                    current === index ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </span>
            </button>
          ))}
        </div>
        <div className="mb-3 flex shrink-0 items-baseline justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {tip.text}
          </h3>
          <span
            role="status"
            className="shrink-0 font-mono text-xs text-muted-foreground"
          >
            {current + 1} / {tips.length}
          </span>
        </div>
        <motion.div
          key={current}
          initial={reduced ? false : { opacity: 0, x: direction * 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          className="min-h-0 flex-1 overflow-y-auto text-sm leading-relaxed text-muted-foreground"
        >
          {tip.content}
        </motion.div>
      </div>
    </div>
  )
}
export default LoadingCarousel
