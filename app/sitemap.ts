import type { MetadataRoute } from "next"
import { HOME_URLS } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = {
    languages: {
      es: HOME_URLS.es,
      en: HOME_URLS.en,
      "x-default": HOME_URLS.es,
    },
  }

  return [
    { url: HOME_URLS.es, alternates },
    { url: HOME_URLS.en, alternates },
  ]
}
