import profileData from "@/public/profile.json"

export const SITE_URL = new URL(
  "/",
  process.env.NEXT_PUBLIC_SITE_URL ??
    profileData.perfil_profesional.enlaces.portfolio
).origin

export const HOME_URLS = {
  es: `${SITE_URL}/`,
  en: `${SITE_URL}/en`,
} as const
