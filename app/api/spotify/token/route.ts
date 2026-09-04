import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import {
  getSpotifyConfig,
  hasRequiredSpotifyScopes,
  refreshSpotifyToken,
  spotifyCookieNames,
  spotifyCookieOptions,
  SpotifyTokenError,
} from "@/lib/spotify-auth"

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" }

function authorizationRequired(message: string) {
  const response = NextResponse.json(
    { error: message },
    { status: 401, headers: NO_STORE_HEADERS }
  )
  Object.values(spotifyCookieNames).forEach((cookieName) =>
    response.cookies.set(cookieName, "", spotifyCookieOptions(0))
  )
  return response
}

export async function POST(request: NextRequest) {
  const { clientId } = getSpotifyConfig(request.url)
  if (!clientId) {
    return NextResponse.json(
      { error: "Spotify no está configurado" },
      { status: 503, headers: NO_STORE_HEADERS }
    )
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get(spotifyCookieNames.accessToken)?.value
  const grantedScopes = cookieStore.get(spotifyCookieNames.grantedScopes)?.value
  const expiresAt = Number(
    cookieStore.get(spotifyCookieNames.accessTokenExpiresAt)?.value ?? 0
  )

  if (!hasRequiredSpotifyScopes(grantedScopes)) {
    return authorizationRequired(
      "Spotify necesita autorización con los permisos actualizados"
    )
  }

  if (accessToken && expiresAt > Date.now() + 30_000) {
    return NextResponse.json({ accessToken }, { headers: NO_STORE_HEADERS })
  }

  const refreshToken = cookieStore.get(spotifyCookieNames.refreshToken)?.value
  if (!refreshToken) {
    return authorizationRequired("Spotify necesita autorización")
  }

  try {
    const token = await refreshSpotifyToken(clientId, refreshToken)
    const refreshedScopes = token.scope ?? grantedScopes
    if (!refreshedScopes || !hasRequiredSpotifyScopes(refreshedScopes)) {
      return authorizationRequired(
        "Spotify necesita autorización con los permisos actualizados"
      )
    }

    const response = NextResponse.json(
      { accessToken: token.access_token },
      { headers: NO_STORE_HEADERS }
    )
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
      refreshedScopes,
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
  } catch (error) {
    const authorizationFailed =
      error instanceof SpotifyTokenError &&
      (error.code === "invalid_grant" || error.code === "invalid_client")

    if (!authorizationFailed) {
      const status =
        error instanceof SpotifyTokenError && error.status === 429 ? 429 : 503
      const headers = {
        ...NO_STORE_HEADERS,
        ...(error instanceof SpotifyTokenError && error.retryAfter
          ? { "Retry-After": error.retryAfter }
          : {}),
      }
      return NextResponse.json(
        {
          error:
            status === 429
              ? "Spotify está limitando las solicitudes"
              : "Spotify no está disponible",
        },
        { status, headers }
      )
    }

    return authorizationRequired("La sesión de Spotify venció")
  }
}
