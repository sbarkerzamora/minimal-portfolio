import { HomePage } from "@/components/portfolio/home-page"
import { getHomeMetadata } from "@/lib/home-seo"

export const metadata = getHomeMetadata("es")

export default function Page() {
  return <HomePage locale="es" />
}
