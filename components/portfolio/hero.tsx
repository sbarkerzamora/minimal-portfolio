import type { CSSProperties } from "react"

import {
  ArrowUpRight,
  DownloadSimple,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr"

import { AvatarShader } from "@/components/portfolio/avatar-shader"
import { GitHubActivity } from "@/components/portfolio/github-activity"
import { HeroBackground } from "@/components/portfolio/hero-background"
import { InfiniteStackCards } from "@/components/portfolio/infinite-stack-cards"
import { RecentProjects } from "@/components/portfolio/recent-projects"
import { Button } from "@/components/ui/button"
import { portfolioProfile } from "@/lib/profile"

function Hero() {
  const { professional, displayTitle, stackCategorias } = portfolioProfile

  return (
    <section
      id="inicio"
      className="relative z-10 mx-auto flex w-full max-w-5xl min-h-svh flex-col items-center justify-center overflow-y-auto bg-background/10 backdrop-blur-sm px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-center sm:px-8 sm:pt-14 sm:pb-28 lg:min-h-svh lg:pt-16 lg:pb-32"
    >
      <HeroBackground />

      <div className="flex w-full flex-col items-center justify-center gap-5 sm:gap-5">
        <div
          className="hero-item group relative"
          style={{ "--enter": 80 } as CSSProperties}
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500/12 blur-2xl transition duration-300 group-hover:bg-emerald-500/18 motion-reduce:transition-none" />
          <div className="relative rounded-full border border-border bg-background p-1.5 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-emerald-500/35 group-hover:shadow-xl group-hover:shadow-emerald-500/10 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
            <AvatarShader name={professional.nombre} />
          </div>
        </div>

        <div
          className="hero-item flex max-w-3xl flex-col items-center gap-4 sm:gap-5"
          style={{ "--enter": 200 } as CSSProperties}
        >
          <div className="flex flex-col items-center gap-2.5 sm:gap-3">
            <h1 className="max-w-4xl text-balance text-[clamp(2.15rem,11vw,3.25rem)] leading-[0.92] font-semibold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
              {professional.nombre}
            </h1>
            <p className="max-w-[30ch] text-balance font-mono text-[10px] leading-5 font-medium tracking-[0.14em] text-emerald-600 uppercase dark:text-emerald-400 sm:max-w-none sm:text-xs sm:tracking-[0.18em]">
              {displayTitle}
            </p>
          </div>

          <RecentProjects />
        </div>

        <div
          className="hero-item grid w-full max-w-sm grid-cols-2 gap-2 sm:flex sm:w-auto sm:max-w-none sm:items-center sm:gap-3"
          style={{ "--enter": 560 } as CSSProperties}
        >
          <Button asChild size="lg" className="h-11 rounded-full px-3 sm:px-5">
            <a href={professional.enlaces.cv} aria-label="Descargar CV de Stephan Barker">
              <DownloadSimple data-icon="inline-start" weight="bold" />
              Descargar CV
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-3 sm:px-5">
            <a
              href={professional.enlaces.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir GitHub de Stephan Barker"
            >
              <GithubLogo data-icon="inline-start" weight="bold" />
              GitHub
              <ArrowUpRight data-icon="inline-end" weight="bold" />
            </a>
          </Button>
        </div>

        <div
          className="hero-item w-full"
          style={{ "--enter": 740 } as CSSProperties}
        >
          <GitHubActivity />
        </div>

        <div
          className="hero-item"
          style={{ "--enter": 920 } as CSSProperties}
        >
          <InfiniteStackCards items={stackCategorias} />
        </div>
      </div>
    </section>
  )
}

export { Hero }
