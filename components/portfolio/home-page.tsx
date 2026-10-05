import Image from "next/image"
import type { CSSProperties } from "react"
import { GitHubActivity } from "@/components/portfolio/github-activity"
import { LanguageSelector } from "@/components/portfolio/language-selector"
import { PreviewExternalLink } from "@/components/portfolio/preview-external-link"
import { ThemeToggle } from "@/components/portfolio/theme-toggle"
import type { Locale } from "@/lib/portfolio-copy"
import { getPortfolioProfile } from "@/lib/profile"
import { HOME_URLS, SITE_URL } from "@/lib/site"

export function HomePage({ locale }: { locale: Locale }) {
  const portfolioProfile = getPortfolioProfile(locale)
  const p = portfolioProfile.professional
  const { homeHero } = portfolioProfile
  const personId = `${HOME_URLS.es}#person`
  const websiteId = `${HOME_URLS.es}#website`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: p.nombre,
        url: HOME_URLS.es,
        image: `${SITE_URL}/avatar.webp`,
        jobTitle: p.titulo_principal,
        description: homeHero.seo.descripcion,
        sameAs: [p.enlaces.github],
        email: portfolioProfile.email,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: HOME_URLS.es,
        name: p.nombre,
        inLanguage: ["es", "en"],
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${HOME_URLS[locale]}#webpage`,
        url: HOME_URLS[locale],
        name: homeHero.seo.titulo,
        description: homeHero.seo.descripcion,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main
        id="inicio"
        className="flex min-h-[100dvh] min-h-[100svh] w-full items-center justify-center bg-background px-6 py-16 text-center text-foreground sm:px-8"
      >
        <div className="fixed top-4 right-4 z-20 flex items-center gap-2 sm:top-6 sm:right-6">
          <ThemeToggle locale={locale} />
          <LanguageSelector locale={locale} />
        </div>
        <div className="flex w-full max-w-3xl flex-col items-center">
          <Image
            src="/avatar.webp"
            alt={
              locale === "es"
                ? `Avatar de ${p.nombre}`
                : `Avatar of ${p.nombre}`
            }
            width={112}
            height={112}
            preload
            className="hero-reveal size-24 rounded-full object-cover sm:size-28"
            style={{ "--hero-delay": "0ms" } as CSSProperties}
          />
          <h1
            className="hero-reveal mt-8 text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.04] font-bold tracking-[-0.04em] text-balance"
            style={{ "--hero-delay": "90ms" } as CSSProperties}
          >
            {p.nombre}
          </h1>
          <p
            className="hero-reveal mt-3 text-xl leading-snug font-medium tracking-[-0.02em] sm:text-2xl"
            style={{ "--hero-delay": "180ms" } as CSSProperties}
          >
            {p.titulo_principal}
          </p>
          <div className="mt-9 max-w-[58ch] space-y-4 text-base leading-[1.7] text-pretty text-muted-foreground sm:mt-10 sm:text-lg">
            <p
              className="hero-reveal"
              style={{ "--hero-delay": "270ms" } as CSSProperties}
            >
              {homeHero.experiencia}{" "}
              <PreviewExternalLink
                href={homeHero.empresa.enlace}
                preview={homeHero.empresa.vista_previa}
                label={homeHero.empresa.nombre}
                locale={locale}
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                {homeHero.empresa.nombre}
              </PreviewExternalLink>
              . {homeHero.actualidad}
            </p>
            <p
              className="hero-reveal"
              style={{ "--hero-delay": "360ms" } as CSSProperties}
            >
              {homeHero.proyectos_intro}{" "}
              {homeHero.proyectos.map((project, index) => (
                <span key={project.enlace}>
                  {index > 0 ? (locale === "es" ? " y " : " and ") : null}
                  <PreviewExternalLink
                    href={project.enlace}
                    preview={project.vista_previa}
                    label={project.nombre}
                    locale={locale}
                    className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {project.nombre}
                  </PreviewExternalLink>
                </span>
              ))}
              .
            </p>
          </div>
          <div
            className="hero-reveal mt-10 w-full max-w-2xl"
            style={{ "--hero-delay": "450ms" } as CSSProperties}
          >
            <GitHubActivity locale={locale} compact />
          </div>
        </div>
      </main>
    </>
  )
}
