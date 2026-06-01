import type { CSSProperties } from "react"

import { ArrowUpRight, GooglePlayLogo } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"

import { portfolioProfile } from "@/lib/profile"
import { LogoIcon } from "@/components/portfolio/tech-icon"

function RecentProjects() {
  return (
    <div className="w-full" aria-label="Últimos proyectos">
      <div className="grid gap-3 sm:grid-cols-4">
        {portfolioProfile.recentProjects.map((project, index) => {
          const isPlayStore = project.tipo === "playstore"

          return (
            <a
              key={`${project.nombre}-${project.descripcion}`}
              href={project.enlace}
              target="_blank"
              rel="noreferrer"
              className="hero-item group flex items-center gap-3 rounded-2xl border border-border/75 bg-background/78 p-3 text-left shadow-sm backdrop-blur transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-emerald-500/35 hover:bg-background hover:shadow-md hover:shadow-emerald-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-col sm:p-4"
              style={{ "--enter": 300 + index * 100 } as CSSProperties}
            >
              <Image
                src={project.icono}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-border/70 sm:size-11"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:w-full">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                    {project.nombre}
                  </p>
                  {isPlayStore && (
                    <GooglePlayLogo
                      aria-label="Disponible en Google Play"
                      className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      weight="bold"
                    />
                  )}
                </div>
                <p className="truncate text-xs leading-4 text-muted-foreground sm:text-sm">
                  {project.descripcion}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="flex size-4 items-center justify-center opacity-50 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0 motion-reduce:transition-none sm:size-5"
                      title={tech}
                    >
                      <LogoIcon name={tech} className="size-full" />
                    </span>
                  ))}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-auto size-3.5 shrink-0 text-muted-foreground/50 transition duration-200 group-hover:text-emerald-600 motion-reduce:transition-none dark:group-hover:text-emerald-400"
                    weight="bold"
                  />
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export { RecentProjects }
