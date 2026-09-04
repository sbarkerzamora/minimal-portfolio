import type { Metadata, Viewport } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stephanbarker.com"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Stephan Barker",
    default: "Stephan Barker — Desarrollador Full Stack & Asesor Digital",
  },
  description:
    "Desarrollador full stack con +8 años de experiencia. Especialista en Next.js, Supabase y React Native. Creo plataformas SaaS, APIs robustas y apps móviles.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stephan Barker — Desarrollador Full Stack & Asesor Digital",
    description:
      "Desarrollador full stack con +8 años de experiencia. Especialista en Next.js, Supabase y React Native.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="font-sans antialiased">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
