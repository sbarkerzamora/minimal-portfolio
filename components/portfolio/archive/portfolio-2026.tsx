import {
  ArrowDown,
  ArrowUpRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { Suspense, type ReactNode } from "react"

import {
  BookingButton,
  BookingProvider,
} from "@/components/portfolio/booking-dialog"
import {
  FullscreenProvider,
  BackgroundToggle,
} from "@/components/portfolio/fullscreen-provider"
import {
  SectionBackground,
  type BackgroundName,
} from "@/components/portfolio/section-background"
import {
  RecentBrowser,
  StackBrowser,
  ExperienceBrowser,
  AboutBrowser,
  CatalogBrowser,
  ServicesBrowser,
} from "@/components/portfolio/section-browsers"
import { GitHubActivity } from "@/components/portfolio/github-activity"
import { LanguageSelector } from "@/components/portfolio/language-selector"
import { PortfolioNavigation } from "@/components/portfolio/navigation"
import { CtaSplit } from "@/components/smoothui/cta-2"
import { Button } from "@/components/ui/button"
import { portfolioCopy, type Locale } from "@/lib/portfolio-copy"
import { getPortfolioProfile } from "@/lib/profile"
import { getPortfolioMedia } from "@/lib/portfolio-media"

function Screen({
  id,
  title,
  description,
  background,
  children,
}: {
  id: string
  title: string
  description?: string
  background?: BackgroundName
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-screen
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className="screen-section"
    >
      {background && <SectionBackground name={background} />}
      <div className="screen-shell">
        <div className="screen-heading">
          <h2
            id={`${id}-title`}
            className="text-[clamp(1.5rem,3.2vw,2.75rem)] leading-tight font-bold tracking-[-0.035em]"
          >
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="screen-content">{children}</div>
      </div>
    </section>
  )
}

function NoScriptContent({ children }: { children: ReactNode }) {
  return (
    <noscript>
      <div className="no-script-content h-full overflow-y-auto text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </noscript>
  )
}

// Archived full portfolio from the previous home page. Not mounted by app/page.tsx.
export function Portfolio({ locale }: { locale: Locale }) {
  const text = portfolioCopy[locale]
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
  } = getPortfolioProfile(locale)
  const contactMedia = getPortfolioMedia(
    "contact",
    0,
    locale,
    contact.call_to_action
  )
  const navigation = [
    { href: "#inicio", label: text.home },
    { href: "#proyectos", label: text.projects },
    { href: "#stack", label: text.stack },
    { href: "#experiencia", label: text.experience },
    { href: "#acerca", label: text.about },
    { href: "#catalogo", label: locale === "es" ? "Catálogo" : "Catalog" },
    { href: "#servicios", label: locale === "es" ? "Servicios" : "Services" },
    { href: "#actividad", label: "GitHub" },
    { href: "#contacto", label: text.contact },
  ]
  return (
    <BookingProvider locale={locale}>
      <FullscreenProvider>
        <noscript>
          <style>{`.requires-js{display:none!important}.screen-content>noscript{display:contents}`}</style>
        </noscript>
        <a
          href="#inicio"
          className="fixed top-3 left-3 z-50 -translate-y-24 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground focus:translate-y-0"
        >
          {text.skip}
        </a>
        <header
          data-portfolio-header
          className="fixed inset-x-0 top-0 z-30 border-b border-border bg-background pt-[env(safe-area-inset-top)]"
        >
          <div className="relative mx-auto flex min-h-18 max-w-[1600px] items-center justify-between gap-2 px-5 sm:gap-4 sm:px-8">
            <a
              href="#inicio"
              aria-label={`SB. ${professional.nombre}, ${text.goHome}`}
              className="flex min-h-11 shrink-0 items-center gap-1 rounded-md text-lg font-bold tracking-tight"
            >
              <span className="sm:hidden">SB</span>
              <span className="hidden sm:inline">{professional.nombre}</span>
              <span className="text-primary" aria-hidden="true">
                .
              </span>
            </a>
            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
              <nav
                aria-label={text.navigation}
                className="hidden items-center 2xl:flex"
              >
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center rounded-md px-2.5 text-sm text-muted-foreground underline-offset-8 transition-colors hover:text-foreground hover:underline"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <BackgroundToggle locale={locale} />
              <LanguageSelector locale={locale} />
              <BookingButton className="hidden size-11 px-0 min-[360px]:inline-flex sm:w-auto sm:px-4">
                <EnvelopeSimple data-icon="inline-start" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{text.book}</span>
              </BookingButton>
              <PortfolioNavigation
                items={navigation}
                label={text.navigation}
                menuLabel={text.menu}
              />
            </div>
          </div>
        </header>
        <main>
          <section
            id="inicio"
            data-screen
            tabIndex={-1}
            aria-labelledby="profile-title"
            className="screen-section"
          >
            <SectionBackground name="inicio" />
            <div className="screen-shell gap-4">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="flex min-h-full max-w-3xl flex-col items-start justify-center py-1">
                  <div className="mb-5 flex items-center gap-4">
                    <Image
                      src="/avatar.webp"
                      alt={`${text.portrait} ${professional.nombre}`}
                      width={64}
                      height={64}
                      className="size-14 rounded-lg object-cover ring-1 ring-border sm:size-16"
                    />
                    <div className="flex flex-col gap-1.5 text-sm">
                      <p>{text.professional}</p>
                      <p className="flex items-center gap-2 text-primary">
                        <span
                          className="size-1.5 bg-primary"
                          aria-hidden="true"
                        />
                        {text.available}
                      </p>
                    </div>
                  </div>
                  <h1
                    id="profile-title"
                    className="text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.04] font-bold tracking-[-0.04em]"
                  >
                    {professional.nombre}
                  </h1>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed font-medium text-balance sm:text-xl">
                    {displayTitle}
                  </p>
                  <p className="mt-5 max-w-[65ch] text-sm leading-7 text-pretty text-foreground sm:text-base">
                    {professional.resumen_perfil}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild size="lg" className="min-h-11 px-5">
                      <a href={professional.enlaces.cv}>
                        <DownloadSimple
                          data-icon="inline-start"
                          aria-hidden="true"
                        />
                        {text.download}
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      size="lg"
                      className="min-h-11 px-5"
                    >
                      <a
                        href={professional.enlaces.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={text.github}
                      >
                        <GithubLogo
                          data-icon="inline-start"
                          aria-hidden="true"
                        />
                        GitHub
                        <ArrowUpRight
                          data-icon="inline-end"
                          aria-hidden="true"
                        />
                      </a>
                    </Button>
                  </div>
                  <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt>{text.experience}</dt>
                      <dd className="font-bold">
                        {stats.anos_experiencia} {text.years}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt>{text.projects}</dt>
                      <dd className="font-bold">{stats.proyectos_exitosos}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt>{text.clients}</dt>
                      <dd className="font-bold">
                        {stats.clientes_satisfechos}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <a
                href="#proyectos"
                className="flex min-h-11 w-fit shrink-0 items-center gap-3 rounded-md text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowDown className="size-4" aria-hidden="true" />
                {text.projects}
              </a>
            </div>
          </section>
          <Screen
            id="proyectos"
            title={text.recent}
            description={text.recentDescription}
            background="proyectos"
          >
            <RecentBrowser projects={recentProjects} locale={locale} />
            <NoScriptContent>
              {recentProjects.map((item) => (
                <article key={item.enlace} className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    <a href={item.enlace}>{item.nombre}</a>
                  </h3>
                  <p>{item.descripcion}</p>
                  <p>{item.stack.join(" / ")}</p>
                </article>
              ))}
            </NoScriptContent>
          </Screen>
          <Screen
            id="stack"
            title={text.technologies}
            description={text.technologiesDescription}
            background="stack"
          >
            <StackBrowser categories={stackCategorias} locale={locale} />
            <NoScriptContent>
              {stackCategorias.map((item) => (
                <article key={item.nombre} className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.nombre}
                  </h3>
                  <p>{item.descripcion}</p>
                  <p>{item.tecnologias.join(" / ")}</p>
                </article>
              ))}
            </NoScriptContent>
          </Screen>
          <Screen
            id="experiencia"
            title={text.experience}
            description={text.experienceDescription}
            background="experiencia"
          >
            <ExperienceBrowser experience={experience} locale={locale} />
            <NoScriptContent>
              {experience.map((item) => (
                <article key={item.empresa} className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.rol}
                  </h3>
                  <p>
                    {item.periodo} · {item.empresa}
                  </p>
                  <p>{item.descripcion}</p>
                  <ul className="list-disc pl-5">
                    {item.logros.map((logro) => (
                      <li key={logro}>{logro}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </NoScriptContent>
          </Screen>
          <Screen id="acerca" title={text.aboutHeading}>
            <AboutBrowser
              professional={professional}
              education={education}
              locale={locale}
            />
            <NoScriptContent>
              <p>{professional.filosofia_trabajo}</p>
              <p className="mt-4">{professional.enfoque}</p>
              <ul className="my-5 list-disc pl-5">
                {professional.valores.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
              <h3>{education.institucion}</h3>
              <p>{education.descripcion}</p>
              <a href={`https://${education.perfil}`}>{education.perfil}</a>
            </NoScriptContent>
          </Screen>
          <Screen
            id="catalogo"
            title={text.catalog}
            description={text.catalogDescription}
            background="catalogo"
          >
            <CatalogBrowser projects={featuredProjects} locale={locale} />
            <NoScriptContent>
              {featuredProjects.map((item) => (
                <article key={item.enlace} className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    <a href={item.enlace}>{item.nombre}</a>
                  </h3>
                  <p>{item.categoria}</p>
                  <p>{item.descripcion}</p>
                </article>
              ))}
            </NoScriptContent>
          </Screen>
          <Screen
            id="servicios"
            title={services.titulo}
            description={services.descripcion}
            background="servicios"
          >
            <ServicesBrowser services={services} locale={locale} />
            <NoScriptContent>
              {services.items.map((item) => (
                <article key={item.titulo} className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.titulo}
                  </h3>
                  <p>{item.descripcion}</p>
                  <p>{item.tags.join(" / ")}</p>
                </article>
              ))}
            </NoScriptContent>
          </Screen>
          <Screen id="actividad" title={text.activity} background="actividad">
            <div className="h-full min-h-0 overflow-y-auto">
              <Suspense
                fallback={
                  <p role="status" className="p-6 text-muted-foreground">
                    {locale === "es"
                      ? "Cargando actividad de GitHub..."
                      : "Loading GitHub activity..."}
                  </p>
                }
              >
                <GitHubActivity locale={locale} />
              </Suspense>
            </div>
          </Screen>
          <section
            id="contacto"
            data-screen
            tabIndex={-1}
            aria-labelledby="contact-title"
            className="screen-section"
          >
            <SectionBackground name="contacto" />
            <div className="screen-shell">
              <CtaSplit
                title={contact.call_to_action}
                description={contact.subtitulo}
                image={contactMedia.src}
                alt={contactMedia.alt}
                notice={contactMedia.notice}
                actions={
                  <>
                    <BookingButton className="min-h-11 px-5">
                      {text.book}
                      <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                    </BookingButton>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="min-h-11 px-5"
                    >
                      <a href={professional.enlaces.cv}>
                        <DownloadSimple
                          data-icon="inline-start"
                          aria-hidden="true"
                        />
                        {text.download}
                      </a>
                    </Button>
                    <noscript>
                      <a
                        href="https://cal.com/sbarker/30-min-meeting"
                        className="text-primary underline"
                      >
                        {text.book} (Cal.com)
                      </a>
                    </noscript>
                  </>
                }
              />
            </div>
          </section>
        </main>
      </FullscreenProvider>
    </BookingProvider>
  )
}
