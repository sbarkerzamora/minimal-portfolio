import {
  ArrowUpRight,
  Briefcase,
  CheckCircle,
  Code,
  DownloadSimple,
  EnvelopeSimple,
  FolderOpen,
  GithubLogo,
  GraduationCap,
  House,
  Play,
  Stack,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"

import CRTWarp from "@/components/CRTWarp"
import FadeContent from "@/components/FadeContent"
import { GitHubActivity } from "@/components/portfolio/github-activity"
import { SpotifyPlayer } from "@/components/portfolio/spotify-player"
import { LogoIcon } from "@/components/portfolio/tech-icon"
import { TechnologyLoop } from "@/components/portfolio/technology-loop"
import { ThemeToggle } from "@/components/portfolio/theme-toggle"
import { Button } from "@/components/ui/button"
import { portfolioProfile } from "@/lib/profile"

const navigation = [
  { href: "#inicio", label: "Inicio", icon: House },
  { href: "#proyectos", label: "Proyectos", icon: FolderOpen },
  { href: "#stack", label: "Stack", icon: Stack },
  { href: "#experiencia", label: "Experiencia", icon: Briefcase },
  { href: "#acerca", label: "Acerca de", icon: UserCircle },
  { href: "#contacto", label: "Contacto", icon: EnvelopeSimple },
]

function IconNavigation() {
  const { professional } = portfolioProfile

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[4.75rem] flex-col items-center border-r border-border bg-sidebar py-4 lg:flex">
      <a
        href="#inicio"
        aria-label="Ir al inicio"
        data-tooltip="Inicio"
        className="icon-tooltip mb-5 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 motion-reduce:transition-none"
      >
        <Code className="size-5" weight="bold" />
      </a>

      <nav
        aria-label="Navegación principal"
        className="flex flex-1 flex-col items-center gap-1.5"
      >
        {navigation.map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            aria-label={label}
            data-tooltip={label}
            className="icon-tooltip flex size-11 items-center justify-center rounded-full text-sidebar-foreground/75 transition-[transform,background-color,color] duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 motion-reduce:transition-none"
          >
            <Icon className="size-5" weight="regular" />
          </a>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1.5">
        <a
          href={professional.enlaces.github}
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir GitHub"
          data-tooltip="GitHub"
          className="icon-tooltip flex size-11 items-center justify-center rounded-full text-sidebar-foreground/75 transition-[transform,background-color,color] duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 motion-reduce:transition-none"
        >
          <GithubLogo className="size-5" weight="regular" />
        </a>
        <ThemeToggle />
      </div>
    </aside>
  )
}

function MobileNavigation() {
  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(4rem+env(safe-area-inset-bottom))] grid-cols-5 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      {navigation.slice(0, 5).map(({ href, icon: Icon, label }) => (
        <a
          key={href}
          href={href}
          aria-label={label}
          className="flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Icon className="size-5" weight="regular" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

function SpotifyPortfolio() {
  const {
    professional,
    displayTitle,
    recentProjects,
    featuredProjects,
    stackCategorias,
    stats,
    experience,
    education,
    services,
    contact,
  } = portfolioProfile
  const spotifyConfigured = Boolean(process.env.SPOTIFY_CLIENT_ID)
  const spotifyContextUri = process.env.SPOTIFY_CONTEXT_URI

  return (
    <>
      <a
        href="#inicio"
        className="fixed top-3 left-3 z-70 -translate-y-20 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition-transform focus:translate-y-0 motion-reduce:transition-none"
      >
        Saltar al contenido
      </a>
      <main className="min-h-svh bg-background text-foreground lg:pl-[4.75rem]">
        <IconNavigation />

        <div className="mx-auto w-full max-w-[92rem] pb-36 lg:pb-28">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/80 bg-background/88 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <a
              href="#inicio"
              aria-label="Ir al inicio"
              className="flex min-w-0 items-center gap-2.5 font-semibold lg:hidden"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Code className="size-4" weight="bold" />
              </span>
              <span className="hidden truncate min-[420px]:block">
                {professional.nombre}
              </span>
            </a>
            <p className="hidden text-sm font-semibold lg:block">Portfolio</p>

            <div className="flex items-center gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="icon-lg"
                className="rounded-full lg:hidden"
              >
                <a
                  href={professional.enlaces.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <GithubLogo weight="regular" />
                </a>
              </Button>
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-foreground px-4 text-background hover:bg-foreground/85"
              >
                <a href={`mailto:${professional.enlaces.email}`}>
                  <EnvelopeSimple data-icon="inline-start" weight="bold" />
                  Contactar
                </a>
              </Button>
            </div>
          </header>

          <section
            id="inicio"
            tabIndex={-1}
            className="relative isolate scroll-mt-14 overflow-hidden border-b border-border bg-[#05010a] px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-12 lg:py-16"
          >
            <div className="absolute inset-0 -z-10" aria-hidden="true">
              <CRTWarp
                className="absolute inset-0"
                color="#c755f7"
                backgroundColor="#05010a"
                speed={0.5}
                curvature={0.25}
                scanlineStrength={0.25}
                scanlineFrequency={200}
                waveAmplitude={0.3}
                waveFrequency={2.5}
                bloom={1.5}
                bloomRadius={1}
                noise={0.1}
                vignette={0}
                brightness={1.25}
                pixelation={1}
                rgbShift={0.015}
                mouseReact
                mouseStrength={0.5}
                dpr={1}
                fps={30}
                paused={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,1,10,0.94),rgba(5,1,10,0.68)_52%,rgba(5,1,10,0.32))]" />
            </div>
            <FadeContent className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-end">
              <div className="relative shrink-0">
                <Image
                  src="/avatar.webp"
                  alt={`Retrato de ${professional.nombre}`}
                  width={224}
                  height={224}
                  preload
                  className="size-36 rounded-full object-cover shadow-2xl ring-1 shadow-foreground/15 ring-foreground/10 sm:size-44 lg:size-52"
                />
                <span
                  className="absolute right-2 bottom-2 size-5 rounded-full border-4 border-background bg-primary"
                  aria-hidden="true"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <CheckCircle
                    className="size-5 text-[#c755f7]"
                    weight="fill"
                  />
                  Perfil profesional <span aria-hidden="true">·</span>
                  <span className="text-[#e193ff]">Disponible</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="max-w-5xl text-[clamp(2.75rem,9vw,6rem)] leading-[0.9] font-black tracking-[-0.04em] text-balance">
                    {professional.nombre}
                  </h1>
                  <p className="text-base font-semibold text-balance text-white sm:text-xl">
                    {displayTitle}
                  </p>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-pretty text-white/75 sm:text-base">
                  {professional.resumen_perfil}
                </p>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="#spotify-player"
                    aria-label="Ir al reproductor de Spotify"
                    className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/15 transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 motion-reduce:transition-none"
                  >
                    <Play className="size-5 translate-x-px" weight="fill" />
                  </a>
                  <Button
                    asChild
                    size="lg"
                    className="h-11 rounded-full bg-foreground px-5 text-background hover:bg-foreground/85"
                  >
                    <a href={professional.enlaces.cv}>
                      <DownloadSimple data-icon="inline-start" weight="bold" />
                      Descargar CV
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-lg"
                    className="size-11 rounded-full"
                  >
                    <a
                      href={professional.enlaces.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Abrir GitHub"
                    >
                      <GithubLogo weight="bold" />
                    </a>
                  </Button>
                </div>

                <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-baseline gap-1.5">
                    <dt className="text-white/65">Experiencia</dt>
                    <dd className="font-bold">{stats.anos_experiencia} años</dd>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <dt className="text-white/65">Proyectos</dt>
                    <dd className="font-bold">{stats.proyectos_exitosos}</dd>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <dt className="text-white/65">Clientes</dt>
                    <dd className="font-bold">{stats.clientes_satisfechos}</dd>
                  </div>
                </dl>
              </div>
            </FadeContent>
          </section>

          <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
            <FadeContent duration={650}>
              <section
                id="proyectos"
                className="scroll-mt-20"
                aria-labelledby="popular-title"
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2
                      id="popular-title"
                      className="text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                      Proyectos recientes
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Productos que he llevado de idea a producción.
                    </p>
                  </div>
                  <FolderOpen
                    className="size-6 shrink-0 text-muted-foreground"
                    weight="regular"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-col">
                  {recentProjects.map((project, index) => (
                    <a
                      key={`${project.nombre}-${project.descripcion}`}
                      href={project.enlace}
                      target="_blank"
                      rel="noreferrer"
                      className="project-row group grid min-h-16 grid-cols-[1.5rem_3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 text-left transition-colors duration-150 hover:bg-muted/70 focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:grid-cols-[2rem_3rem_minmax(0,1fr)_minmax(10rem,0.55fr)_2rem]"
                    >
                      <span className="text-center text-sm text-muted-foreground tabular-nums group-hover:hidden sm:block">
                        {index + 1}
                      </span>
                      <ArrowUpRight
                        className="hidden size-4 justify-self-center text-foreground group-hover:block sm:group-hover:block"
                        weight="bold"
                      />
                      <Image
                        src={project.icono}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 rounded object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {project.nombre}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {project.descripcion}
                        </span>
                      </span>
                      <span className="hidden min-w-0 items-center gap-2 sm:flex">
                        {project.stack.slice(0, 5).map((technology) => (
                          <span
                            key={technology}
                            className="size-4 opacity-70 grayscale transition-[filter,opacity] duration-150 group-hover:opacity-100 group-hover:grayscale-0"
                            title={technology}
                          >
                            <LogoIcon name={technology} className="size-full" />
                          </span>
                        ))}
                      </span>
                      <ArrowUpRight
                        className="size-4 text-muted-foreground sm:hidden"
                        weight="bold"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </section>
            </FadeContent>

            <FadeContent duration={650} delay={60}>
              <section
                id="stack"
                className="scroll-mt-20"
                aria-labelledby="stack-title"
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2
                      id="stack-title"
                      className="text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                      Stack tecnológico
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Herramientas elegidas según el problema.
                    </p>
                  </div>
                  <Stack
                    className="size-6 shrink-0 text-muted-foreground"
                    weight="regular"
                    aria-hidden="true"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {stackCategorias.map((category) => (
                    <article
                      key={category.nombre}
                      className="group rounded-lg bg-muted/45 p-4 transition-[transform,background-color] duration-150 hover:-translate-y-0.5 hover:bg-muted motion-reduce:transition-none"
                    >
                      <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-background shadow-sm">
                        <LogoIcon
                          name={category.tecnologias[0]}
                          className="size-6"
                        />
                      </div>
                      <h3 className="font-bold">{category.nombre}</h3>
                      <p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">
                        {category.descripcion}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {category.tecnologias.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-8 border-y border-border py-5">
                  <p className="mb-4 text-xs font-semibold text-muted-foreground">
                    Tecnologías en el día a día
                  </p>
                  <TechnologyLoop
                    technologies={Array.from(
                      new Set(
                        stackCategorias.flatMap(
                          (category) => category.tecnologias
                        )
                      )
                    )}
                  />
                </div>
              </section>
            </FadeContent>

            <FadeContent duration={650} delay={60}>
              <section
                id="experiencia"
                className="scroll-mt-20"
                aria-labelledby="experience-title"
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2
                      id="experience-title"
                      className="text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                      Experiencia
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Productos, equipos y operaciones digitales.
                    </p>
                  </div>
                  <Briefcase
                    className="size-6 shrink-0 text-muted-foreground"
                    weight="regular"
                    aria-hidden="true"
                  />
                </div>

                <ol className="divide-y divide-border">
                  {experience.map((item) => (
                    <li
                      key={`${item.empresa}-${item.periodo}`}
                      className="grid gap-3 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
                    >
                      <p className="text-sm font-semibold text-brand tabular-nums">
                        {item.periodo}
                      </p>
                      <div>
                        <h3 className="font-bold">{item.rol}</h3>
                        <p className="text-sm font-medium text-muted-foreground">
                          {item.empresa}
                        </p>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-pretty text-muted-foreground">
                          {item.descripcion}
                        </p>
                        {item.logros.map((achievement) => (
                          <p
                            key={achievement}
                            className="mt-2 flex max-w-3xl items-start gap-2 text-sm leading-6 text-muted-foreground"
                          >
                            <CheckCircle
                              className="mt-1 size-4 shrink-0 text-brand"
                              weight="fill"
                              aria-hidden="true"
                            />
                            {achievement}
                          </p>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </FadeContent>

            <FadeContent duration={700}>
              <section
                id="acerca"
                className="scroll-mt-20"
                aria-labelledby="about-title"
              >
                <div className="grid overflow-hidden rounded-xl bg-muted/45 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative min-h-72 lg:min-h-full">
                    <Image
                      src="/acerca-de.webp"
                      alt={`${professional.nombre} trabajando frente a su computadora`}
                      fill
                      sizes="(min-width: 1280px) 470px, (min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-6 p-6 sm:p-8 lg:p-10">
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand">
                        <UserCircle className="size-5" weight="fill" />
                        Acerca de
                      </div>
                      <h2
                        id="about-title"
                        className="text-2xl font-bold tracking-tight text-balance sm:text-3xl"
                      >
                        Construyo productos completos, no piezas aisladas.
                      </h2>
                      <p className="mt-4 text-sm leading-6 text-pretty text-muted-foreground sm:text-base">
                        {professional.filosofia_trabajo}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-pretty text-muted-foreground sm:text-base">
                        {professional.enfoque}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {professional.valores.map((value) => (
                        <p
                          key={value}
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <CheckCircle
                            className="size-4 shrink-0 text-brand"
                            weight="fill"
                            aria-hidden="true"
                          />
                          {value}
                        </p>
                      ))}
                    </div>

                    <a
                      href={`https://${education.perfil}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg bg-background p-3 transition-colors hover:bg-background/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand">
                        <GraduationCap className="size-5" weight="fill" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">
                          {education.institucion}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {education.descripcion}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-muted-foreground"
                        weight="bold"
                      />
                    </a>
                  </div>
                </div>
              </section>
            </FadeContent>

            <FadeContent duration={650}>
              <section aria-labelledby="catalog-title">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2
                      id="catalog-title"
                      className="text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                      Catálogo de proyectos
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Una selección de plataformas, productos y sitios.
                    </p>
                  </div>
                  <FolderOpen
                    className="size-6 shrink-0 text-muted-foreground"
                    weight="regular"
                    aria-hidden="true"
                  />
                </div>
                <div className="grid min-w-0 gap-x-8 sm:grid-cols-2">
                  {featuredProjects.map((project, index) => (
                    <a
                      key={project.nombre}
                      href={project.enlace}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-20 min-w-0 items-center gap-4 border-b border-border py-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground tabular-nums transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold group-hover:underline">
                          {project.nombre}
                        </span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {project.categoria}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-muted-foreground transition-[transform,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground motion-reduce:transition-none"
                        weight="bold"
                      />
                    </a>
                  ))}
                </div>
              </section>
            </FadeContent>

            <FadeContent duration={650} delay={60}>
              <section aria-labelledby="services-title">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2
                      id="services-title"
                      className="text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                      {services.titulo}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {services.descripcion}
                    </p>
                  </div>
                  <Code
                    className="size-6 shrink-0 text-muted-foreground"
                    weight="regular"
                    aria-hidden="true"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {services.items.map((service) => (
                    <article
                      key={service.titulo}
                      className="rounded-lg bg-muted/45 p-5"
                    >
                      <Code
                        className="mb-5 size-6 text-brand"
                        weight="bold"
                        aria-hidden="true"
                      />
                      <h3 className="font-bold">{service.titulo}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {service.descripcion}
                      </p>
                      <p className="mt-4 text-xs font-semibold text-muted-foreground">
                        {service.tags.join(" · ")}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </FadeContent>

            <section aria-labelledby="activity-title">
              <h2 id="activity-title" className="sr-only">
                Actividad de GitHub
              </h2>
              <FadeContent duration={650}>
                <GitHubActivity />
              </FadeContent>
            </section>

            <FadeContent duration={700}>
              <section
                id="contacto"
                className="scroll-mt-20 border-t border-border pt-10 text-center"
                aria-labelledby="contact-title"
              >
                <EnvelopeSimple
                  className="mx-auto size-7 text-brand"
                  weight="fill"
                  aria-hidden="true"
                />
                <h2
                  id="contact-title"
                  className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight text-balance sm:text-5xl"
                >
                  {contact.call_to_action}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-pretty text-muted-foreground sm:text-base">
                  {contact.subtitulo}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  <Button asChild size="lg" className="h-11 rounded-full px-5">
                    <a href={`mailto:${professional.enlaces.email}`}>
                      <EnvelopeSimple data-icon="inline-start" weight="bold" />
                      {contact.texto_boton}
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-11 rounded-full px-5"
                  >
                    <a href={professional.enlaces.cv}>
                      <DownloadSimple data-icon="inline-start" weight="bold" />
                      Descargar CV
                    </a>
                  </Button>
                </div>
              </section>
            </FadeContent>
          </div>
        </div>

        <SpotifyPlayer
          configured={spotifyConfigured}
          contextUri={spotifyContextUri}
        />
        <MobileNavigation />
      </main>
    </>
  )
}

export { SpotifyPortfolio }
