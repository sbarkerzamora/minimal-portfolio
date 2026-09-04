import { NextRequest, NextResponse } from "next/server"

import {
  createSpotifyPkce,
  getSpotifyConfig,
  spotifyCookieNames,
  spotifyCookieOptions,
  spotifyScopes,
} from "@/lib/spotify-auth"

export function GET(request: NextRequest) {
  const { clientId, redirectUri } = getSpotifyConfig(request.url)
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/?spotify=not-configured#spotify-player", request.url)
    )
  }

  const { state, verifier, challenge } = createSpotifyPkce()
  const authorizationUrl = new URL("https://accounts.spotify.com/authorize")
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    code_challenge: challenge,
    code_challenge_method: "S256",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: spotifyScopes,
    state,
  }).toString()

  const response = NextResponse.redirect(authorizationUrl)
  response.cookies.set(
    spotifyCookieNames.state,
    state,
    spotifyCookieOptions(600)
  )
  response.cookies.set(
    spotifyCookieNames.codeVerifier,
    verifier,
    spotifyCookieOptions(600)
  )
  return response
}
