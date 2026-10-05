import "server-only"
import { headers } from "next/headers"
import type { Locale } from "@/lib/portfolio-copy"

export async function getLocale(): Promise<Locale> {
  return (await headers()).get("x-portfolio-locale") === "en" ? "en" : "es"
}
