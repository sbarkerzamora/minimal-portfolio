import { useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  type PanInfo,
  type MotionValue,
  type Transition,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react"
import React, { type JSX } from "react"

// replace icons with your own if needed
import {
  Circle as FiCircle,
  Code as FiCode,
  FileText as FiFileText,
  Stack as FiLayers,
  Layout as FiLayout,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
export interface CarouselItem {
  title: string
  description: React.ReactNode
  id: number
  icon: React.ReactNode
}

export interface CarouselProps {
  items?: CarouselItem[]
  baseWidth?: number
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  loop?: boolean
  round?: boolean
  height?: number
  locale?: "es" | "en"
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: "Text Animations",
    description: "Cool text animations for your projects.",
    id: 1,
    icon: <FiFileText className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Animations",
    description: "Smooth animations for your projects.",
    id: 2,
    icon: <FiCircle className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Components",
    description: "Reusable components for your projects.",
    id: 3,
    icon: <FiLayers className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Backgrounds",
    description: "Beautiful backgrounds and patterns for your projects.",
    id: 4,
    icon: <FiLayout className="h-[16px] w-[16px] text-white" />,
  },
  {
    title: "Common UI",
    description: "Common UI components are coming soon!",
    id: 5,
    icon: <FiCode className="h-[16px] w-[16px] text-white" />,
  },
]

const DRAG_BUFFER = 0
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 }

interface CarouselItemProps {
  item: CarouselItem
  index: number
  itemWidth: number
  round: boolean
  trackItemOffset: number
  x: MotionValue<number>
  transition: Transition
  active: boolean
  reduced: boolean
}

function CarouselItem({
  item,
  index,
  itemWidth,
  round,
  trackItemOffset,
  x,
  transition,
  active,
  reduced,
}: CarouselItemProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ]
  const outputRange = [90, 0, -90]
  const rotateY = useTransform(x, range, outputRange, { clamp: false })

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`relative flex shrink-0 flex-col ${
        round
          ? "items-center justify-center border-0 bg-[#120F17] text-center"
          : "items-start rounded-[12px] border border-border bg-card"
      } cursor-grab overflow-hidden active:cursor-grabbing`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY: reduced ? 0 : rotateY,
        ...(round && { borderRadius: "50%" }),
      }}
      transition={transition}
      role="group"
      aria-roledescription="slide"
      aria-hidden={!active}
      inert={!active}
    >
      <div className={`${round ? "m-0 p-0" : "shrink-0 px-5 pt-4"}`}>
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-primary">
          {item.icon}
        </span>
      </div>
      <div
        className="min-h-0 flex-1 overflow-y-auto p-5 pt-3"
        tabIndex={active ? 0 : -1}
      >
        <h3 className="mb-3 text-xl leading-tight font-bold text-foreground">
          {item.title}
        </h3>
        <div className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </div>
      </div>
    </motion.div>
  )
}

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
  height = 380,
  locale = "es",
}: CarouselProps): JSX.Element {
  const containerPadding = 16
  const reduced = Boolean(useReducedMotion())
  const itemWidth = baseWidth - containerPadding * 2
  const trackItemOffset = itemWidth + GAP
  const itemsForRender = useMemo(() => {
    if (!loop) return items
    if (items.length === 0) return []
    return [items[items.length - 1], ...items, items[0]]
  }, [items, loop])

  const [position, setPosition] = useState<number>(loop ? 1 : 0)
  const x = useMotionValue(0)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isJumping, setIsJumping] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current
      const handleMouseEnter = () => setIsHovered(true)
      const handleMouseLeave = () => setIsHovered(false)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [pauseOnHover])

  useEffect(() => {
    if (!autoplay || reduced || itemsForRender.length <= 1) return undefined
    if (pauseOnHover && isHovered) return undefined

    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1))
    }, autoplayDelay)

    return () => clearInterval(timer)
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    pauseOnHover,
    itemsForRender.length,
    reduced,
  ])

  const effectiveTransition =
    isJumping || reduced ? { duration: 0 } : SPRING_OPTIONS

  const handleAnimationStart = () => {
    setIsAnimating(true)
  }

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false)
      return
    }
    const lastCloneIndex = itemsForRender.length - 1

    if (position === lastCloneIndex) {
      setIsJumping(true)
      const target = 1
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    if (position === 0) {
      setIsJumping(true)
      const target = items.length
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    setIsAnimating(false)
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const { offset, velocity } = info
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0

    if (direction === 0) return

    setPosition((prev) => {
      const next = prev + direction
      const max = itemsForRender.length - 1
      return Math.max(0, Math.min(next, max))
    })
  }

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      }

  const activeIndex =
    items.length === 0
      ? 0
      : loop
        ? (position - 1 + items.length) % items.length
        : Math.min(position, items.length - 1)

  return (
    <div
      ref={containerRef}
      className={`relative flex max-w-full flex-col overflow-hidden p-4 ${
        round
          ? "rounded-full border border-border"
          : "rounded-xl border border-border"
      }`}
      style={{
        width: `${baseWidth}px`,
        height,
        ...(round && { height: `${baseWidth}px` }),
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={
        locale === "es" ? "Experiencia profesional" : "Professional experience"
      }
      data-active-index={activeIndex}
      onKeyDown={(event) => {
        const next =
          event.key === "ArrowRight"
            ? position + 1
            : event.key === "ArrowLeft"
              ? position - 1
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : -1
        if (next < 0 && event.key !== "ArrowLeft") return
        event.preventDefault()
        setPosition(Math.max(0, Math.min(next, itemsForRender.length - 1)))
      }}
    >
      <motion.div
        className="flex min-h-0 flex-1 touch-pan-y"
        drag={isAnimating ? false : "x"}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
            active={index === position}
            reduced={reduced}
          />
        ))}
      </motion.div>
      <div
        className={`mt-3 flex w-full shrink-0 items-center justify-center gap-2 ${round ? "absolute bottom-12 left-1/2 z-20 -translate-x-1/2" : ""}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          disabled={!loop && position === 0}
          aria-label={
            locale === "es" ? "Experiencia anterior" : "Previous experience"
          }
          onClick={() => setPosition(Math.max(0, position - 1))}
        >
          <CaretLeft />
        </Button>
        <div className="flex min-w-0 items-center overflow-x-auto">
          {items.map((_, index) => (
            <motion.button
              type="button"
              key={index}
              aria-label={`${locale === "es" ? "Ver experiencia" : "View experience"} ${index + 1}`}
              aria-current={activeIndex === index}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm"
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            >
              <span
                className={`size-2 rounded-full ${activeIndex === index ? "bg-primary" : "bg-input"}`}
              />
            </motion.button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          disabled={!loop && position === items.length - 1}
          aria-label={
            locale === "es" ? "Siguiente experiencia" : "Next experience"
          }
          onClick={() =>
            setPosition(Math.min(itemsForRender.length - 1, position + 1))
          }
        >
          <CaretRight />
        </Button>
        <span className="sr-only" role="status">
          {activeIndex + 1} / {items.length}
        </span>
      </div>
    </div>
  )
}
