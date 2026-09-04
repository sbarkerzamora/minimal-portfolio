declare namespace Spotify {
  interface WebPlaybackImage {
    height: number | null
    url: string
    width: number | null
  }

  interface WebPlaybackArtist {
    name: string
    uri: string
  }

  interface WebPlaybackTrack {
    album: {
      images: WebPlaybackImage[]
      name: string
      uri: string
    }
    artists: WebPlaybackArtist[]
    duration_ms: number
    id: string | null
    name: string
    type: string
    uri: string
  }

  interface WebPlaybackState {
    disallows: Partial<
      Record<
        | "pausing"
        | "resuming"
        | "seeking"
        | "skipping_next"
        | "skipping_prev"
        | "transferring_playback",
        boolean
      >
    >
    duration: number
    paused: boolean
    position: number
    repeat_mode: number
    shuffle: boolean
    track_window: {
      current_track: WebPlaybackTrack
      next_tracks: WebPlaybackTrack[]
      previous_tracks: WebPlaybackTrack[]
    }
  }

  interface PlayerOptions {
    getOAuthToken: (callback: (token: string) => void) => void
    name: string
    volume?: number
  }

  interface Player {
    activateElement(): Promise<void>
    addListener(
      event: "ready" | "not_ready",
      callback: (event: { device_id: string }) => void
    ): boolean
    addListener(
      event: "player_state_changed",
      callback: (state: WebPlaybackState | null) => void
    ): boolean
    addListener(event: "autoplay_failed", callback: () => void): boolean
    addListener(
      event:
        | "initialization_error"
        | "authentication_error"
        | "account_error"
        | "playback_error",
      callback: (event: { message: string }) => void
    ): boolean
    connect(): Promise<boolean>
    disconnect(): void
    nextTrack(): Promise<void>
    previousTrack(): Promise<void>
    seek(positionMs: number): Promise<void>
    setVolume(volume: number): Promise<void>
    togglePlay(): Promise<void>
  }

  interface PlayerConstructor {
    new (options: PlayerOptions): Player
  }
}

interface Window {
  onSpotifyWebPlaybackSDKReady?: () => void
  Spotify?: {
    Player: Spotify.PlayerConstructor
  }
}
