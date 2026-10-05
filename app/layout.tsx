import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getLocale } from "@/lib/server-locale"
import { SITE_URL } from "@/lib/site"

const schibstedGrotesk = localFont({
  src: "./fonts/schibsted-grotesk-variable.woff2",
  variable: "--font-body",
  weight: "400 900",
  style: "normal",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Stephan Barker",
    default: "Stephan Barker | AI Engineer",
  },
  description:
    "AI Engineer y asesor digital. Experiencia en White Shark Media, trabajo freelance con empresas corporativas y proyectos como Asistente Justo y pateperro.online.",
  openGraph: {
    title: "Stephan Barker | AI Engineer",
    description:
      "AI Engineer y asesor digital. Experiencia en White Shark Media, trabajo freelance con empresas corporativas y proyectos como Asistente Justo y pateperro.online.",
    url: SITE_URL,
    siteName: "Stephan Barker",
    locale: "es_NI",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className="font-sans antialiased"
    >
      <body className={`${schibstedGrotesk.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
