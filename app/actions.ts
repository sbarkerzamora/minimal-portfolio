"use server"

import { cookies } from "next/headers"

export async function setLocale(
  _failed: boolean,
  formData: FormData
): Promise<boolean> {
  const locale = formData.get("locale")
  if (locale !== "es" && locale !== "en") return true
  try {
    const store = await cookies()
    store.set("portfolio_locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    return false
  } catch {
    return true
  }
}
