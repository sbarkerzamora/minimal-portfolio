import "server-only"

import { createHash, randomBytes } from "node:crypto"

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com"

export const spotifyCookieNames = {
  accessToken: "spotify_access_token",
  accessTokenExpiresAt: "spotify_access_expires_at",
  codeVerifier: "spotify_code_verifier",
  refreshToken: "spotify_refresh_token",
  state: "spotify_oauth_state",
} as const

export const spotifyScopes = [
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
].join(" ")

interface SpotifyTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope: string
  token_type: "Bearer"
}

interface SpotifyTokenErrorBody {
  error?: string
  error_description?: string
}

export class SpotifyTokenError extends Error {
  constructor(
    readonly status: number,
    readonly code?: string,
    readonly retryAfter?: string | null
  ) {
    super(`Spotify token request failed with status ${status}`)
  }
}

export function getSpotifyConfig(requestUrl: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ??
    new URL("/api/spotify/callback", new URL(requestUrl).origin).toString()

  return { clientId, redirectUri }
}

export function createSpotifyPkce() {
  const state = randomBytes(32).toString("base64url")
  const verifier = randomBytes(64).toString("base64url")
  const challenge = createHash("sha256").update(verifier).digest("base64url")
  return { state, verifier, challenge }
}

export function spotifyCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/api/spotify",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  }
}

export async function exchangeSpotifyCode({
  clientId,
  code,
  redirectUri,
  verifier,
}: {
  clientId: string
  code: string
  redirectUri: string
  verifier: string
}) {
  return requestSpotifyToken(
    new URLSearchParams({
      client_id: clientId,
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    })
  )
}

export async function refreshSpotifyToken(
  clientId: string,
  refreshToken: string
) {
  return requestSpotifyToken(
    new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    })
  )
}

async function requestSpotifyToken(body: URLSearchParams) {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  })

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as SpotifyTokenErrorBody | null
    throw new SpotifyTokenError(
      response.status,
      errorBody?.error,
      response.headers.get("Retry-After")
    )
  }

  return (await response.json()) as SpotifyTokenResponse
}
