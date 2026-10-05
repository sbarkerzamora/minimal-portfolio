import type { Metadata } from "next"

import type { Locale } from "@/lib/portfolio-copy"
import { getPortfolioProfile } from "@/lib/profile"
import { HOME_URLS, SITE_URL } from "@/lib/site"

export function getHomeMetadata(locale: Locale): Metadata {
  const { homeHero } = getPortfolioProfile(locale)
  const { titulo, descripcion } = homeHero.seo

  return {
    title: { absolute: titulo },
    description: descripcion,
    alternates: {
      canonical: HOME_URLS[locale],
      languages: {
        es: HOME_URLS.es,
        en: HOME_URLS.en,
        "x-default": HOME_URLS.es,
      },
    },
    openGraph: {
      title: titulo,
      description: descripcion,
      locale: locale === "es" ? "es_NI" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_NI"],
      url: HOME_URLS[locale],
      siteName: "Stephan Barker",
      type: "profile",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: { index: true, follow: true },
  }
}
