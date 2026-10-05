import media from "@/public/portfolio-media.json"
import type { Locale } from "@/lib/portfolio-copy"

export function getPortfolioMedia(
  group: keyof typeof media,
  index: number,
  locale: Locale,
  title: string
) {
  const image = media[group][index] ?? media[group][0]
  return {
    ...image,
    alt: image.isPlaceholder
      ? locale === "es"
        ? "Fotografía temporal de referencia, no una captura del producto"
        : "Temporary reference photograph, not a product screenshot"
      : title,
    notice: image.isPlaceholder
      ? locale === "es"
        ? "Imagen temporal"
        : "Placeholder image"
      : "",
  }
}
