import { SpotifyPortfolio } from "@/components/portfolio/spotify-portfolio"
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
      <SpotifyPortfolio />
    </>
  )
}
