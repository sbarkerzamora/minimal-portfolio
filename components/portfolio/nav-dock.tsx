import {
  DownloadSimple,
  EnvelopeSimple,
  House,
} from "@phosphor-icons/react/dist/ssr"

import { ThemeToggle } from "@/components/portfolio/theme-toggle"
import { portfolioProfile } from "@/lib/profile"

function NavDock() {
  const email = portfolioProfile.email

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3 sm:bottom-6"
    >
      <div className="flex items-center gap-1 rounded-[1.75rem] border border-border/80 bg-background/82 p-1.5 shadow-2xl shadow-foreground/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/68 sm:gap-1.5">
        <a
          href="#inicio"
          aria-label="Inicio"
          className="group flex size-10 shrink-0 items-center justify-center rounded-2xl text-foreground transition-[transform,background-color,color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:size-11"
        >
          <House
            weight="bold"
            className="size-4 text-emerald-600 transition duration-200 group-hover:text-emerald-600 motion-reduce:transition-none dark:text-emerald-400"
          />
          <span className="sr-only">Inicio</span>
        </a>

        <a
          href="/api/cv"
          aria-label="Descargar CV"
          className="group flex size-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-[transform,background-color,color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:size-11"
        >
          <DownloadSimple
            weight="regular"
            className="size-4 transition duration-200 group-hover:text-emerald-600 motion-reduce:transition-none dark:group-hover:text-emerald-400"
          />
          <span className="sr-only">Descargar CV</span>
        </a>

        <a
          href={`mailto:${email}`}
          aria-label="Enviar correo electrónico"
          className="group flex size-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-[transform,background-color,color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:size-11"
        >
          <EnvelopeSimple
            weight="regular"
            className="size-4 transition duration-200 group-hover:text-emerald-600 motion-reduce:transition-none dark:group-hover:text-emerald-400"
          />
          <span className="sr-only">Correo electrónico</span>
        </a>

        <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />

        <ThemeToggle className="shrink-0 border-transparent bg-transparent shadow-none hover:bg-muted" />
      </div>
    </nav>
  )
}

export { NavDock }
