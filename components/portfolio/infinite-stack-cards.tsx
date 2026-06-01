"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { LogoIcon } from "@/components/portfolio/tech-icon"

interface StackCard {
  nombre: string
  descripcion: string
  tecnologias: string[]
}

function InfiniteStackCards({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items: StackCard[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const [start, setStart] = useState(false)
  const directionRef = useRef(direction)
  const speedRef = useRef(speed)

  useEffect(() => {
    const container = containerRef.current
    const scroller = scrollerRef.current
    if (!container || !scroller) return

    const scrollerContent = Array.from(scroller.children)
    scrollerContent.forEach((child) => {
      scroller.appendChild(child.cloneNode(true))
    })

    container.style.setProperty(
      "--animation-direction",
      directionRef.current === "left" ? "forwards" : "reverse",
    )
    const duration = speedRef.current === "fast" ? "20s" : speedRef.current === "normal" ? "40s" : "80s"
    container.style.setProperty("--animation-duration", duration)
    setStart(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-full overflow-hidden",
        "max-w-[min(56rem,calc(100vw-2.5rem))]",
        "[mask-image:linear-gradient(to_right,transparent,white_8%,white_92%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-3 py-2",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <li
            key={item.nombre}
            className="group/stack-card relative w-[250px] shrink-0 rounded-2xl border border-border/80 bg-background/82 px-3.5 py-3 shadow-sm backdrop-blur md:w-[330px]"
          >
            <div className="flex h-full flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-foreground sm:text-sm">
                  {item.nombre}
                </p>
                <p className="text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
                  {item.descripcion}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-1.5">
                {item.tecnologias.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm"
                  >
                    <span className="size-3.5 shrink-0 grayscale transition-[filter] duration-300 group-hover/stack-card:grayscale-0">
                      <LogoIcon name={tech} />
                    </span>
                    <span className="truncate">{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { InfiniteStackCards }
