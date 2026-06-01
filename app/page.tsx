import { Hero } from "@/components/portfolio/hero"
import { NavDock } from "@/components/portfolio/nav-dock"
import { portfolioProfile } from "@/lib/profile"

export default function Page() {
  const p = portfolioProfile.professional
  const socialUrl = p.enlaces.github

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.nombre,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stephanbarker.com",
    jobTitle: p.titulo_principal,
    description: p.resumen_perfil,
    sameAs: [socialUrl],
    email: portfolioProfile.email,
  }

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: p.nombre,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stephanbarker.com",
    description: p.descripcion_hero,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="relative min-h-svh overflow-hidden bg-background text-foreground">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_34rem)] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.13),transparent_32rem)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          aria-hidden="true"
        />
        <Hero />
        <NavDock />
      </main>
    </>
  )
}
