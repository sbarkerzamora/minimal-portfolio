# Spotify-Inspired Home Redesign

## Goal

Redesign the home page as a fast, minimalist portfolio experience inspired by Spotify. Preserve the existing profile information, use functional iconography throughout, and add a real Spotify Web Playback SDK integration that remains optional and does not block the portfolio.

## Design Direction

- Use a compact Spotify-like application shell with a dark default, a supported light theme, neutral surfaces, and restrained Spotify green.
- Keep Stephan Barker as the primary brand. Use Spotify branding only to attribute Spotify content and playback.
- Use Phosphor icons for navigation and actions. Every icon must have a functional or semantic purpose, a visible focus state, and an accessible label or tooltip when needed.
- Remove decorative WebGL shaders, glass effects, oversized panels, and unnecessary card nesting.
- Prefer one clear action per surface, progressive disclosure, concise copy, and generous spacing.

## Information Architecture

- Desktop: compact icon rail, scrollable main profile, optional context panel on wide screens, and a persistent bottom player.
- Mobile: compact header, vertical content, bottom navigation, mini player, and an expandable playback view.
- Profile header: avatar, name, professional title, summary, statistics, CV, GitHub, and Spotify connection action.
- Popular: current recent projects displayed as compact track-like rows.
- Collections: technology categories and services displayed as lightweight shelves.
- About: professional summary, philosophy, focus, values, achievements, and education.
- Experience: current employment history in a compact chronological list.
- Contact: email and external links with clear actions.
- GitHub activity: retained as supporting proof without dominating the first viewport.

## Spotify Integration

- Use Authorization Code with PKCE and the minimum scopes: `streaming`, `user-read-playback-state`, `user-modify-playback-state`, and `user-read-currently-playing`.
- Add login, callback, token refresh, and logout Route Handlers.
- Store PKCE state, verifier, and refresh token in secure HttpOnly cookies. Never persist tokens in local storage.
- Load `https://sdk.scdn.co/spotify-player.js` only after explicit user intent.
- Create and transfer playback to a browser Spotify Connect device.
- Support play, pause, previous, next, seek, volume, current metadata, connection state, and error recovery.
- Keep the portfolio fully usable when Spotify credentials are missing, the visitor declines access, playback is unavailable, or the visitor does not have Premium.
- Configure the default Spotify context with a server environment variable until a playlist, album, or track URI is supplied.

## Performance

- Keep portfolio content in React Server Components and isolate playback in one client island.
- Use CSS transitions for microinteractions and avoid adding an animation library.
- Remove shader dependencies and client-only visual effects from the critical path.
- Use local/system typography and optimized images.
- Make zero Spotify requests during the initial render.
- Target Lighthouse Performance 95+, LCP below 2 seconds, CLS below 0.05, and INP below 200 ms.

## Dependency Upgrade

1. Record a passing baseline with the current lockfile.
2. Upgrade Next.js, React, React DOM, their types, and `eslint-config-next` together.
3. Upgrade Tailwind, PostCSS integration, Radix, shadcn CLI, Prettier, its Tailwind plugin, and PDFKit.
4. Evaluate major upgrades for ESLint, TypeScript, and Node types individually, keeping the newest versions compatible with Next.js and the repository configuration.
5. Remove `@paper-design/shaders-react` after removing its usages.
6. Run typecheck, lint, and production build after each meaningful batch and regenerate `pnpm-lock.yaml` with pnpm.

## Interaction And Accessibility

- Add selected icon weights, row hover/focus states, compact tooltips, tactile button presses, an active equalizer, player progress, and mini-player expansion.
- Keep interaction timing between 120 and 220 ms and animate only transform, opacity, color, and bounded shadows.
- Respect `prefers-reduced-motion` and retain visible content when motion is disabled.
- Meet WCAG 2.2 AA contrast, 44 px touch targets, semantic landmarks, keyboard navigation, screen-reader labels, and live playback status announcements.
- Preserve Spotify artwork and metadata without cropping, overlays, distortion, or unsupported transformations.

## Verification

- Run `bun run typecheck`, `bun run lint`, and `bun run build`.
- Verify `/api/cv`, the static fallback, OAuth success and denial, token refresh, logout, and playback errors.
- Test desktop and mobile layouts, keyboard navigation, reduced motion, light and dark themes, and supported browser behavior.
- Run dependency and security audits, then document any registry timeout or upstream compatibility limitation.

## Required Configuration

```env
NEXT_PUBLIC_SITE_URL=https://stephanbarker.com
SPOTIFY_CLIENT_ID=
SPOTIFY_REDIRECT_URI=https://stephanbarker.com/api/spotify/callback
SPOTIFY_CONTEXT_URI=
```

Spotify Web Playback SDK requires Spotify Premium. New Development Mode applications are limited to five authorized users, and public access requires an appropriate Spotify quota mode. Spotify also restricts commercial streaming integrations without prior approval.
