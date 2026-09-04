"use client"

import { LogoLoop, type LogoItem } from "@/components/LogoLoop"
import { LogoIcon } from "@/components/portfolio/tech-icon"

function TechnologyLoop({ technologies }: { technologies: readonly string[] }) {
  const logos: LogoItem[] = technologies.map((technology) => ({
    node: (
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <span
          className="flex size-5 items-center justify-center"
          aria-hidden="true"
        >
          <LogoIcon name={technology} className="size-full" />
        </span>
        <span>{technology}</span>
      </span>
    ),
    title: technology,
    ariaLabel: technology,
  }))

  return (
    <LogoLoop
      logos={logos}
      speed={22}
      logoHeight={20}
      gap={28}
      pauseOnHover
      fadeOut
      fadeOutColor="var(--background)"
      ariaLabel="Tecnologías utilizadas"
      className="-mx-1"
    />
  )
}

export { TechnologyLoop }
