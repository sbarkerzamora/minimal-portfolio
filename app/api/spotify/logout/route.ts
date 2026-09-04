import { NextResponse } from "next/server"

import { spotifyCookieNames, spotifyCookieOptions } from "@/lib/spotify-auth"

export function POST() {
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  )

  Object.values(spotifyCookieNames).forEach((cookieName) =>
    response.cookies.set(cookieName, "", spotifyCookieOptions(0))
  )
  return response
}
