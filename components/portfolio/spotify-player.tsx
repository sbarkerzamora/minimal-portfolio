"use client"

import {
  ArrowSquareOut,
  CaretDown,
  CircleNotch,
  CornersOut,
  LockSimple,
  Pause,
  Play,
  SignOut,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpotifyLogo,
  WarningCircle,
} from "@phosphor-icons/react"
import Image from "next/image"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlayerPhase =
  "idle" | "authorizing" | "loading" | "ready" | "playing" | "paused" | "error"

interface TokenResponse {
  accessToken?: string
  error?: string
}

class SpotifySessionError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

let pendingTokenRequest: Promise<string> | null = null

function requestSpotifyToken() {
  if (pendingTokenRequest) return pendingTokenRequest

  pendingTokenRequest = fetch("/api/spotify/token", {
    method: "POST",
    cache: "no-store",
  })
    .then(async (response) => {
      const data = (await response.json()) as TokenResponse
      if (!response.ok || !data.accessToken) {
        throw new SpotifySessionError(
          data.error ?? "Spotify necesita una nueva autorización",
          response.status
        )
      }
      return data.accessToken
    })
    .finally(() => {
      pendingTokenRequest = null
    })

  return pendingTokenRequest
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${minutes}:${seconds}`
}

function getSpotifyUrl(uri?: string) {
  if (!uri?.startsWith("spotify:")) return "https://open.spotify.com"
  const [, type, id] = uri.split(":")
  return type && id
    ? `https://open.spotify.com/${type}/${id}`
    : "https://open.spotify.com"
}

function getSpotifySdkErrorMessage(errorMessage: string) {
  const normalizedMessage = errorMessage.toLowerCase()
  if (normalizedMessage.includes("scope")) {
    return "La autorización de Spotify cambió. Conecta tu cuenta de nuevo"
  }
  if (
    normalizedMessage.includes("account") ||
    normalizedMessage.includes("premium")
  ) {
    return "Se necesita una cuenta Spotify Premium para reproducir aquí"
  }
  if (
    normalizedMessage.includes("token") ||
    normalizedMessage.includes("auth")
  ) {
    return "La sesión de Spotify venció. Conecta tu cuenta de nuevo"
  }
  return "Spotify no pudo iniciar la reproducción"
}

function SpotifyPlayer({
  configured,
  contextUri,
}: {
  configured: boolean
  contextUri?: string
}) {
  const [phase, setPhase] = useState<PlayerPhase>("idle")
  const [message, setMessage] = useState(
    "Conecta una cuenta Premium para reproducir aquí"
  )
  const [loadSdk, setLoadSdk] = useState(false)
  const [needsFreshAuthorization, setNeedsFreshAuthorization] = useState(false)
  const [deviceId, setDeviceId] = useState<string>()
  const [playbackState, setPlaybackState] =
    useState<Spotify.WebPlaybackState | null>(null)
  const [position, setPosition] = useState(0)
  const [volume, setVolumeState] = useState(0.65)
  const playerRef = useRef<Spotify.Player | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const currentTrack = playbackState?.track_window.current_track
  const duration = playbackState?.duration ?? currentTrack?.duration_ms ?? 0
  const isPlaying = phase === "playing"
  const isConnected = Boolean(deviceId)
  const restrictions = playbackState?.disallows
  const previousDisabled = !isConnected || Boolean(restrictions?.skipping_prev)
  const nextDisabled = !isConnected || Boolean(restrictions?.skipping_next)
  const playDisabled =
    phase === "authorizing" ||
    phase === "loading" ||
    Boolean(isPlaying ? restrictions?.pausing : restrictions?.resuming)
  const seekDisabled = !duration || Boolean(restrictions?.seeking)

  useEffect(() => {
    const url = new URL(window.location.href)
    const spotifyStatus = url.searchParams.get("spotify")

    if (spotifyStatus === "connected") {
      // The redirect follows an explicit authorization action, so loading the SDK is intentional.
      window.onSpotifyWebPlaybackSDKReady = () => initializePlayer()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("loading")
      setMessage("Preparando reproductor")
      setLoadSdk(true)
    } else if (spotifyStatus) {
      setPhase("error")
      setNeedsFreshAuthorization(spotifyStatus === "scope-error")
      setMessage(
        spotifyStatus === "denied"
          ? "No se autorizó el acceso a Spotify"
          : spotifyStatus === "scope-error"
            ? "Spotify no concedió los permisos necesarios. Conecta de nuevo"
            : "No fue posible conectar Spotify"
      )
    }

    if (spotifyStatus) {
      url.searchParams.delete("spotify")
      window.history.replaceState(
        {},
        "",
        `${url.pathname}${url.search}${url.hash}`
      )
    }
    // OAuth query state is intentionally consumed only once after the redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isPlaying || !duration) return

    const interval = window.setInterval(() => {
      setPosition((current) => Math.min(current + 1000, duration))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [duration, isPlaying])

  useEffect(() => {
    return () => {
      const player = playerRef.current
      playerRef.current = null
      player?.disconnect()
      window.onSpotifyWebPlaybackSDKReady = () => undefined
    }
  }, [])

  async function connectSpotify() {
    if (!configured) {
      setPhase("error")
      setMessage("Configura SPOTIFY_CLIENT_ID para activar el reproductor")
      return
    }

    if (needsFreshAuthorization) {
      await authorizeSpotify("Conectando otra cuenta de Spotify")
      return
    }

    setPhase("loading")
    setMessage("Comprobando sesión de Spotify")

    try {
      await requestSpotifyToken()
      window.onSpotifyWebPlaybackSDKReady = () => initializePlayer()
      setLoadSdk(true)
      setMessage("Preparando reproductor")
      if (window.Spotify) initializePlayer()
    } catch (error) {
      if (error instanceof SpotifySessionError && error.status === 401) {
        await authorizeSpotify("Abriendo autorización de Spotify")
        return
      }

      setPhase("error")
      setMessage(
        error instanceof Error ? error.message : "Spotify no está disponible"
      )
    }
  }

  async function authorizeSpotify(statusMessage: string) {
    setPhase("authorizing")
    setMessage(statusMessage)

    if (needsFreshAuthorization) {
      await fetch("/api/spotify/logout", { method: "POST" }).catch(
        () => undefined
      )
    }

    // A hard navigation is required because this Route Handler redirects off-origin.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/api/spotify/login")
  }

  function resetPlayer(errorMessage: string) {
    const player = playerRef.current
    playerRef.current = null
    player?.disconnect()
    setDeviceId(undefined)
    setPlaybackState(null)
    setPosition(0)
    setLoadSdk(false)
    setPhase("error")
    setMessage(errorMessage)
  }

  function initializePlayer() {
    if (!window.Spotify || playerRef.current) return

    const player = new window.Spotify.Player({
      name: "Stephan Barker Portfolio",
      volume,
      getOAuthToken: (callback) => {
        void requestSpotifyToken()
          .then(callback)
          .catch((error: unknown) => {
            setPhase("error")
            setMessage(
              error instanceof Error
                ? error.message
                : "La sesión de Spotify venció"
            )
            callback("")
          })
      },
    })

    player.addListener("ready", ({ device_id }) => {
      setDeviceId(device_id)
      setNeedsFreshAuthorization(false)
      setPhase("ready")
      setMessage(
        contextUri ? "Listo para reproducir" : "Listo para continuar tu música"
      )
    })
    player.addListener("not_ready", () => {
      resetPlayer("El reproductor dejó de estar disponible")
    })
    player.addListener("player_state_changed", (state) => {
      if (!state) return
      setPlaybackState(state)
      setPosition(state.position)
      setPhase(state.paused ? "paused" : "playing")
      setMessage(state.paused ? "Pausado" : "Reproduciendo")
    })
    player.addListener("initialization_error", ({ message: errorMessage }) => {
      if (errorMessage.toLowerCase().includes("scope")) {
        setNeedsFreshAuthorization(true)
      }
      resetPlayer(getSpotifySdkErrorMessage(errorMessage))
    })
    player.addListener("authentication_error", ({ message: errorMessage }) => {
      setNeedsFreshAuthorization(true)
      resetPlayer(
        errorMessage.toLowerCase().includes("scope")
          ? "La autorización de Spotify cambió. Conecta tu cuenta de nuevo"
          : "La sesión de Spotify venció. Conecta tu cuenta de nuevo"
      )
    })
    player.addListener("account_error", () => {
      setNeedsFreshAuthorization(true)
      resetPlayer("Se necesita una cuenta Spotify Premium para reproducir aquí")
    })
    player.addListener("playback_error", ({ message: errorMessage }) => {
      setPhase("error")
      setMessage(getSpotifySdkErrorMessage(errorMessage))
    })
    player.addListener("autoplay_failed", () => {
      setPhase("paused")
      setMessage("Pulsa reproducir para activar el audio")
    })

    playerRef.current = player
    void player
      .connect()
      .then((connected) => {
        if (!connected) {
          resetPlayer("Spotify no pudo crear el dispositivo de reproducción")
        }
      })
      .catch(() =>
        resetPlayer("Spotify no pudo crear el dispositivo de reproducción")
      )
  }

  async function startContext() {
    if (!deviceId || !playerRef.current) return

    try {
      await playerRef.current.activateElement()
      const token = await requestSpotifyToken()

      if (contextUri) {
        const isTrack = contextUri.startsWith("spotify:track:")
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              isTrack ? { uris: [contextUri] } : { context_uri: contextUri }
            ),
          }
        )

        if (!response.ok) throwSpotifyPlaybackError(response.status)
      } else {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_ids: [deviceId], play: true }),
        })

        if (!response.ok) throwSpotifyPlaybackError(response.status)
      }
    } catch (error) {
      if (
        error instanceof SpotifySessionError &&
        (error.status === 401 || error.status === 403)
      ) {
        setNeedsFreshAuthorization(true)
        resetPlayer(error.message)
        return
      }
      setPhase("error")
      setMessage(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar la reproducción"
      )
    }
  }

  function throwSpotifyPlaybackError(status: number): never {
    const errorMessages: Record<number, string> = {
      401: "La sesión de Spotify venció. Conecta tu cuenta de nuevo",
      403: "Se necesita una cuenta Spotify Premium para reproducir aquí",
      404: "El reproductor todavía no está disponible. Intenta de nuevo",
      429: "Spotify está limitando las solicitudes. Intenta más tarde",
    }
    throw new SpotifySessionError(
      errorMessages[status] ?? "Spotify no pudo iniciar la reproducción",
      status
    )
  }

  async function togglePlayback() {
    if (!isConnected) {
      await connectSpotify()
      return
    }

    if (!playbackState) {
      await startContext()
      return
    }

    try {
      await playerRef.current?.activateElement()
      await playerRef.current?.togglePlay()
    } catch {
      setPhase("error")
      setMessage("No fue posible cambiar la reproducción")
    }
  }

  async function seek(nextPosition: number) {
    setPosition(nextPosition)
    try {
      await playerRef.current?.seek(nextPosition)
    } catch {
      setMessage("No fue posible cambiar la posición")
    }
  }

  async function setVolume(nextVolume: number) {
    setVolumeState(nextVolume)
    try {
      await playerRef.current?.setVolume(nextVolume)
    } catch {
      setMessage("No fue posible cambiar el volumen")
    }
  }

  async function skipTrack(direction: "previous" | "next") {
    try {
      if (direction === "previous") await playerRef.current?.previousTrack()
      else await playerRef.current?.nextTrack()
    } catch {
      setMessage("No fue posible cambiar de pista")
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/spotify/logout", { method: "POST" })
      if (!response.ok) throw new Error()
      const player = playerRef.current
      playerRef.current = null
      player?.disconnect()
      setPlaybackState(null)
      setPosition(0)
      setDeviceId(undefined)
      setLoadSdk(false)
      setNeedsFreshAuthorization(false)
      setPhase("idle")
      setMessage("Conecta una cuenta Premium para reproducir aquí")
      dialogRef.current?.close()
    } catch {
      setPhase("error")
      setMessage("No fue posible cerrar la sesión de Spotify")
    }
  }

  const playButtonLabel = isPlaying
    ? "Pausar"
    : isConnected
      ? "Reproducir"
      : "Conectar Spotify"
  const trackUrl = getSpotifyUrl(currentTrack?.uri)
  const artwork = currentTrack?.album.images[0]?.url
  const isBusy = phase === "loading" || phase === "authorizing"
  const connectLabel = needsFreshAuthorization ? "Cambiar cuenta" : "Conectar"
  const visibleMessage = configured ? message : "Spotify no está disponible"

  return (
    <>
      {loadSdk ? (
        <Script
          id="spotify-web-playback-sdk"
          src="https://sdk.scdn.co/spotify-player.js"
          strategy="afterInteractive"
          onLoad={initializePlayer}
          onReady={initializePlayer}
          onError={() =>
            resetPlayer("No se pudo cargar Spotify Web Playback SDK")
          }
        />
      ) : null}

      <section
        id="spotify-player"
        aria-label="Reproductor de Spotify"
        className="fixed right-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 z-40 h-14 border-t border-border bg-background/96 px-3 backdrop-blur-xl lg:bottom-0 lg:left-[4.75rem] lg:h-[4.5rem] lg:px-4"
      >
        <p className="sr-only" aria-live="polite">
          {visibleMessage}
        </p>
        <div className="mx-auto grid h-full max-w-[92rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)] lg:gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {artwork ? (
              <Image
                src={artwork}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded object-cover"
              />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-brand">
                <SpotifyLogo className="size-5" weight="fill" />
              </span>
            )}
            <div className="min-w-0">
              {currentTrack ? (
                <a
                  href={trackUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block min-w-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="block truncate text-xs font-semibold group-hover:underline lg:text-sm">
                    {currentTrack.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {currentTrack.artists
                      .map((artist) => artist.name)
                      .join(", ")}
                    <span aria-hidden="true"> · </span>
                    {message}
                  </span>
                </a>
              ) : (
                <>
                  <p className="truncate text-xs font-semibold lg:text-sm">
                    Spotify
                    <span className="text-[10px] font-medium text-muted-foreground lg:text-[11px]">
                      {isConnected ? " · Conectado" : " · Premium requerido"}
                    </span>
                  </p>
                  <p
                    className={cn(
                      "truncate text-[11px] text-muted-foreground",
                      phase === "error" && "text-destructive"
                    )}
                  >
                    {visibleMessage}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 lg:flex-col lg:gap-1">
            <div className="flex items-center gap-1.5">
              {isConnected ? (
                <>
                  <button
                    type="button"
                    aria-label="Pista anterior"
                    disabled={previousDisabled}
                    className="hidden size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-35 lg:flex"
                    onClick={() => void skipTrack("previous")}
                  >
                    <SkipBack className="size-4" weight="fill" />
                  </button>
                  <button
                    type="button"
                    aria-label={playButtonLabel}
                    className="flex size-11 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 disabled:opacity-50 motion-reduce:transition-none lg:size-9"
                    disabled={playDisabled}
                    onClick={() => void togglePlayback()}
                  >
                    {isBusy ? (
                      <CircleNotch
                        className="size-4 animate-spin"
                        weight="bold"
                      />
                    ) : isPlaying ? (
                      <Pause className="size-4" weight="fill" />
                    ) : (
                      <Play className="size-4 translate-x-px" weight="fill" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Pista siguiente"
                    disabled={nextDisabled}
                    className="hidden size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-35 lg:flex"
                    onClick={() => void skipTrack("next")}
                  >
                    <SkipForward className="size-4" weight="fill" />
                  </button>
                  <button
                    type="button"
                    aria-label="Abrir controles de Spotify"
                    className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
                    onClick={() => dialogRef.current?.showModal()}
                  >
                    <CornersOut className="size-4" weight="bold" />
                  </button>
                </>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="h-11 rounded-full px-4 lg:h-8"
                  disabled={!configured || isBusy}
                  onClick={() => void connectSpotify()}
                >
                  {isBusy ? (
                    <CircleNotch
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                  ) : (
                    <SpotifyLogo data-icon="inline-start" weight="fill" />
                  )}
                  {isBusy ? "Conectando" : connectLabel}
                </Button>
              )}
            </div>

            {isConnected ? (
              <div className="hidden w-[clamp(16rem,34vw,32rem)] items-center gap-2 text-[10px] text-muted-foreground tabular-nums lg:flex">
                <span className="w-8 text-right">{formatTime(position)}</span>
                <input
                  type="range"
                  min={0}
                  max={Math.max(duration, 1)}
                  step={1000}
                  value={Math.min(position, Math.max(duration, 1))}
                  disabled={seekDisabled}
                  aria-label="Posición de reproducción"
                  aria-valuetext={`${formatTime(position)} de ${formatTime(duration)}`}
                  className="player-range flex-1"
                  style={
                    {
                      "--range-progress": `${duration ? (position / duration) * 100 : 0}%`,
                    } as React.CSSProperties
                  }
                  onChange={(event) => void seek(Number(event.target.value))}
                />
                <span className="w-8">{formatTime(duration)}</span>
              </div>
            ) : null}
          </div>

          <div className="hidden min-w-36 items-center justify-end gap-2 lg:flex">
            {phase === "error" ? (
              <WarningCircle
                className="size-4 text-destructive"
                weight="fill"
                aria-hidden="true"
              />
            ) : !isConnected ? (
              <LockSimple
                className="size-4 text-muted-foreground"
                weight="bold"
                aria-hidden="true"
              />
            ) : null}
            {isConnected ? (
              <>
                <SpeakerHigh
                  className="size-4 text-muted-foreground"
                  weight="fill"
                  aria-hidden="true"
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  aria-label="Volumen"
                  className="player-range w-20"
                  style={
                    {
                      "--range-progress": `${volume * 100}%`,
                    } as React.CSSProperties
                  }
                  onChange={(event) =>
                    void setVolume(Number(event.target.value))
                  }
                />
              </>
            ) : (
              <span
                className={cn(
                  "max-w-48 text-right text-xs leading-4 text-muted-foreground",
                  phase === "error" && "text-destructive"
                )}
              >
                {phase === "error" ? visibleMessage : "Cuenta Premium"}
              </span>
            )}
            {isConnected ? (
              <button
                type="button"
                aria-label="Cerrar sesión de Spotify"
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                onClick={() => void logout()}
              >
                <SignOut className="size-4" weight="bold" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="spotify-dialog-title"
        className="spotify-player-dialog m-auto max-h-[calc(100svh-2rem)] w-[calc(100%-1.5rem)] max-w-sm overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Cerrar reproductor"
              className="flex size-11 items-center justify-center rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => dialogRef.current?.close()}
            >
              <CaretDown className="size-5" weight="bold" />
            </button>
            <p id="spotify-dialog-title" className="text-sm font-semibold">
              Spotify
            </p>
            <div className="flex items-center">
              {isConnected ? (
                <button
                  type="button"
                  aria-label="Cerrar sesión de Spotify"
                  className="flex size-11 items-center justify-center rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  onClick={() => void logout()}
                >
                  <SignOut className="size-5" weight="bold" />
                </button>
              ) : null}
              <a
                href={trackUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir en Spotify"
                className="flex size-11 items-center justify-center rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <ArrowSquareOut className="size-5" weight="bold" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {artwork ? (
              <Image
                src={artwork}
                alt=""
                width={96}
                height={96}
                className="mx-auto size-24 rounded-lg object-cover"
              />
            ) : (
              <div className="mx-auto flex size-24 items-center justify-center rounded-lg bg-muted">
                <SpotifyLogo className="size-10 text-brand" weight="fill" />
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-base font-bold">
                  {currentTrack?.name ??
                    (isConnected
                      ? "Spotify conectado"
                      : "Spotify Premium requerido")}
                </p>
                <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                  {currentTrack?.artists
                    .map((artist) => artist.name)
                    .join(", ") ?? visibleMessage}
                </p>
              </div>
              <SpotifyLogo
                className="size-5 shrink-0 text-brand"
                weight="fill"
                aria-label="Contenido de Spotify"
              />
            </div>
            <div
              className={cn(
                "flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs leading-5 text-muted-foreground",
                phase === "error" && "text-destructive"
              )}
              aria-live="polite"
            >
              {phase === "error" ? (
                <WarningCircle
                  className="mt-0.5 size-4 shrink-0"
                  weight="fill"
                />
              ) : isConnected ? (
                <SpotifyLogo
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  weight="fill"
                />
              ) : (
                <LockSimple className="mt-0.5 size-4 shrink-0" weight="bold" />
              )}
              <span>{visibleMessage}</span>
            </div>
            <div>
              <input
                type="range"
                min={0}
                max={Math.max(duration, 1)}
                step={1000}
                value={Math.min(position, Math.max(duration, 1))}
                disabled={seekDisabled}
                aria-label="Posición de reproducción"
                aria-valuetext={`${formatTime(position)} de ${formatTime(duration)}`}
                className="player-range w-full"
                style={
                  {
                    "--range-progress": `${duration ? (position / duration) * 100 : 0}%`,
                  } as React.CSSProperties
                }
                onChange={(event) => void seek(Number(event.target.value))}
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            {isConnected ? (
              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  aria-label="Pista anterior"
                  disabled={previousDisabled}
                  className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-35"
                  onClick={() => void skipTrack("previous")}
                >
                  <SkipBack className="size-5" weight="fill" />
                </button>
                <button
                  type="button"
                  aria-label={playButtonLabel}
                  className="flex size-12 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-95 disabled:opacity-50 motion-reduce:transition-none"
                  disabled={playDisabled}
                  onClick={() => void togglePlayback()}
                >
                  {isBusy ? (
                    <CircleNotch
                      className="size-5 animate-spin"
                      weight="bold"
                    />
                  ) : isPlaying ? (
                    <Pause className="size-5" weight="fill" />
                  ) : (
                    <Play className="size-5 translate-x-px" weight="fill" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Pista siguiente"
                  disabled={nextDisabled}
                  className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-35"
                  onClick={() => void skipTrack("next")}
                >
                  <SkipForward className="size-5" weight="fill" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                size="lg"
                className="h-11 w-full rounded-full"
                disabled={!configured || isBusy}
                onClick={() => void connectSpotify()}
              >
                {isBusy ? (
                  <CircleNotch
                    data-icon="inline-start"
                    className="animate-spin"
                  />
                ) : (
                  <SpotifyLogo data-icon="inline-start" weight="fill" />
                )}
                {isBusy ? "Conectando" : `${connectLabel} Spotify`}
              </Button>
            )}
            {isConnected ? (
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <SpeakerHigh
                  className="size-4 shrink-0 text-muted-foreground"
                  weight="fill"
                  aria-hidden="true"
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  aria-label="Volumen"
                  className="player-range flex-1"
                  style={
                    {
                      "--range-progress": `${volume * 100}%`,
                    } as React.CSSProperties
                  }
                  onChange={(event) =>
                    void setVolume(Number(event.target.value))
                  }
                />
                <span className="w-8 text-right text-[10px] text-muted-foreground tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            ) : (
              <p className="text-center text-[11px] leading-4 text-muted-foreground">
                La reproducción en el navegador está disponible únicamente para
                cuentas Spotify Premium.
              </p>
            )}
          </div>
        </div>
      </dialog>
    </>
  )
}

export { SpotifyPlayer }
