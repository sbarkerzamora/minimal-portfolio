import { NextRequest, NextResponse } from "next/server"

import {
  exchangeSpotifyCode,
  getSpotifyConfig,
  hasRequiredSpotifyScopes,
  spotifyCookieNames,
  spotifyCookieOptions,
} from "@/lib/spotify-auth"

function redirectWithStatus(request: NextRequest, status: string) {
  const response = NextResponse.redirect(
    new URL(`/?spotify=${status}#spotify-player`, request.url)
  )
  response.headers.set("Cache-Control", "no-store, max-age=0")
  response.cookies.set(spotifyCookieNames.state, "", spotifyCookieOptions(0))
  response.cookies.set(
    spotifyCookieNames.codeVerifier,
    "",
    spotifyCookieOptions(0)
  )
  return response
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")
  const expectedState = request.cookies.get(spotifyCookieNames.state)?.value
  if (!state || !expectedState || state !== expectedState) {
    return redirectWithStatus(request, "invalid-state")
  }

  const error = request.nextUrl.searchParams.get("error")
  if (error)
    return redirectWithStatus(
      request,
      error === "access_denied" ? "denied" : "auth-error"
    )

  const code = request.nextUrl.searchParams.get("code")
  const verifier = request.cookies.get(spotifyCookieNames.codeVerifier)?.value
  const { clientId, redirectUri } = getSpotifyConfig(request.url)

  if (!clientId || !code || !verifier) {
    return redirectWithStatus(request, "invalid-state")
  }

  try {
    const token = await exchangeSpotifyCode({
      clientId,
      code,
      redirectUri,
      verifier,
    })
    const grantedScopes = token.scope
    if (!grantedScopes || !hasRequiredSpotifyScopes(grantedScopes)) {
      const response = redirectWithStatus(request, "scope-error")
      Object.values(spotifyCookieNames).forEach((cookieName) =>
        response.cookies.set(cookieName, "", spotifyCookieOptions(0))
      )
      return response
    }

    const response = redirectWithStatus(request, "connected")
    response.cookies.set(
      spotifyCookieNames.accessToken,
      token.access_token,
      spotifyCookieOptions(token.expires_in)
    )
    response.cookies.set(
      spotifyCookieNames.accessTokenExpiresAt,
      String(Date.now() + token.expires_in * 1000),
      spotifyCookieOptions(token.expires_in)
    )
    response.cookies.set(
      spotifyCookieNames.grantedScopes,
      grantedScopes,
      spotifyCookieOptions(60 * 60 * 24 * 30)
    )
    if (token.refresh_token) {
      response.cookies.set(
        spotifyCookieNames.refreshToken,
        token.refresh_token,
        spotifyCookieOptions(60 * 60 * 24 * 30)
      )
    }
    return response
  } catch {
    return redirectWithStatus(request, "token-error")
  }
}
