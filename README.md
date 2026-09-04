# Minimal Portfolio

Stephan Barker's portfolio, built with Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, and an optional Spotify Web Playback SDK integration.

## Development

Install dependencies with pnpm and run project scripts through Bun:

```bash
pnpm install
bun run dev
```

Quality checks:

```bash
bun run typecheck
bun run lint
bun run build
```

Professional content is managed in `public/profile.json`.

## Spotify

Create an application in the Spotify Developer Dashboard, enable Web Playback SDK, and register the exact callback URL used by the site.

```env
NEXT_PUBLIC_SITE_URL=https://stephanbarker.com
SPOTIFY_CLIENT_ID=
SPOTIFY_REDIRECT_URI=https://stephanbarker.com/api/spotify/callback
SPOTIFY_CONTEXT_URI=spotify:playlist:...
```

For local development, Spotify requires a loopback IP rather than `localhost`. Register and use a callback such as:

```env
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/spotify/callback
```

`SPOTIFY_CONTEXT_URI` accepts a Spotify track, album, artist, or playlist URI. If it is omitted, the player attempts to continue the visitor's active Spotify playback.

Spotify Web Playback SDK requires Spotify Premium. New Development Mode applications are limited to five authorized users. Public access requires the appropriate Spotify quota mode, and Spotify restricts commercial streaming integrations without prior approval.

The authorization requests `streaming`, `user-read-email`, `user-read-private`, and `user-modify-playback-state`. When these permissions change, existing users are asked to connect again so Spotify can issue a token with the current scopes.

The portfolio still renders and works normally when Spotify is not configured.
