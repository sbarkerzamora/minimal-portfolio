# Minimal Portfolio

Stephan Barker's portfolio, built with Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, and Phosphor icons. The current home is a centered, text-led introduction with a white default theme, a persistent dark option, project previews, and GitHub activity.

The [home redesign plan](docs/plans/white-hero-redesign.md) and [SEO strategy](docs/plans/seo-strategy.md) describe the live experience. [DESIGN.md](DESIGN.md) also records the archived full-portfolio direction.

## Development

Install dependencies with pnpm and run project scripts through Bun:

```bash
pnpm install
bun run dev
```

Quality commands:

```bash
bun run typecheck
bun run lint
bun run build
git diff --check
```

Use `bun run start` to serve a completed production build. Use pnpm for dependency changes and lockfile generation, not a second package manager.

These commands are not a test report. TypeScript and lint do not verify browser behavior, network requests, contrast, or Web Vitals. Record actual results and untested cases in the approved plan; do not infer coverage from a successful build.

## Content and Routes

- `public/profile.json` is the primary professional-content source. English translations live under `en`; `lib/profile.ts` adapts them for rendering and `lib/portfolio-copy.ts` holds functional ES/EN labels.
- Preserve the four recent projects, four stack categories and their 20 technologies, four experiences, nine catalog projects, three services, five values, Platzi education, and three existing metrics. Do not merge the recent and catalog collections or drop fields used only by the CV.
- Some translations follow array indices and others project names. Keep both languages equivalent when editing; do not reorder or rename only one side.
- `/` serves Spanish and `/en` serves English independently of cookies. The language selector uses real links, while a lightweight proxy sets the document language from the URL.
- `components/portfolio/archive/portfolio-2026.tsx` preserves the former multipanel portfolio and its supporting components; it is not mounted on the live homepage.
- `/api/cv` continues to generate the complete bilingual PDF with PDFKit.
- The two home routes have localized metadata, canonical and hreflang links, JSON-LD, and matching entries in `/sitemap.xml`. `/robots.txt` allows assets required for rendering.

## Local Resources

Files in `public/` are served from `/`, without the `public` prefix:

| Resource                           | Repository path                              | Public URL or loading contract                                                     |
| ---------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| Professional data and translations | `public/profile.json`                        | `/profile.json`, also imported by the server                                       |
| Portrait                           | `public/avatar.webp`                         | `/avatar.webp`                                                                     |
| Link previews                      | `public/preview-*.webp`                      | Loaded when an external-link preview opens                                         |
| About photograph                   | `public/acerca-de.webp`                      | `/acerca-de.webp`                                                                  |
| Archived ASCII video               | `public/hero-video.mp4`                      | `/hero-video.mp4`                                                                  |
| Smaller VP9 rendition              | `public/hero-video.webm`                     | `/hero-video.webm`, selected when the browser supports VP9                         |
| Hero still                         | `public/hero-poster.webp`                    | `/hero-poster.webp`, generated from the supplied MP4                               |
| Schibsted Grotesk                  | `app/fonts/schibsted-grotesk-variable.woff2` | `next/font/local` in `app/layout.tsx`, exposed as `--font-body` and served by Next |
| Font license and provenance        | `app/fonts/OFL.txt`, `app/fonts/README.md`   | Repository documentation, not a `public/` URL                                      |

The font's `src` is `./fonts/schibsted-grotesk-variable.woff2`, relative to `app/layout.tsx`. Its local [provenance record](app/fonts/README.md) identifies the pinned upstream source and accompanying [OFL license](app/fonts/OFL.txt). Keep it self-hosted with ES/EN glyph support; neither visits nor builds depend on fetching a Google font.

The supplied MP4 and its smaller VP9 rendition belong to the archived [ASCII Cinematic direction](docs/plans/ascii-cinematic-redesign.md). The live homepage does not request video.

To regenerate the rendition with FFmpeg:

```bash
ffmpeg -i public/hero-video.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 public/hero-video.webm
```

Keep resource paths editable from the profile where practical. Several project/service image paths in the JSON do not have matching files in `public/`; retain their data but do not render broken images or fabricate screenshots.

## Language and Theme

The site defaults to light. The sun/moon selector saves a manual light/dark choice independently of system appearance. ES/EN links to `/` and `/en`, respectively; the language, visible content, and metadata follow the URL with or without JavaScript. Previously saved `portfolio_locale` cookies no longer determine the homepage language. The downloaded CV remains bilingual.

The contact button at the bottom of the homepage opens a SmoothUI drawer (right on desktop, bottom on mobile) containing the existing Cal.com 30-minute booking flow. The embed loads on demand, reports loading/ready/error states, and always includes a direct Cal.com link. Without JavaScript, the contact control becomes a direct link. The archived full portfolio retains its separate booking dialog for use if restored.

## GitHub Activity

`lib/github-contributions.ts` derives the username from the profile's GitHub URL, fetches the public contributions HTML, and uses a shared 12-hour revalidation interval. This data path does not require a GitHub token. The graph is loaded near the viewport rather than blocking earlier content.

Failed or empty responses use generated **synthetic fallback data**, not a cached copy of verified activity. The UI must identify that source clearly in ES/EN and must not call its total verified contributions. Keep the real GitHub link, a five-level amber legend, and keyboard-accessible date/count information.

## Environment

`.env.example` contains the remaining public site URL setting used for absolute metadata URLs:

```env
NEXT_PUBLIC_SITE_URL=https://stephanbarker.com
```

Use the site's deployment origin for that setting. Never commit environment files or copy secret values into documentation, logs, or plans.

## Spotify Retirement

Spotify is retired, not an optional feature to configure. The player, SDK types, OAuth helpers and messages, four API routes, image-host permission, environment-template settings, imports, copy, styles, and layout offsets have been removed. The hero's background control is not a music player.

- Repository cleanup does not change external credentials, deployment environment variables, or the provider's OAuth application. The deployment owner must responsibly review and remove the obsolete Spotify settings from the environments they manage without disclosing their values.
- Prior authorizations are **not automatically revoked**. Revoking access or disabling an external application requires its responsible owner's authorization and confirmation that it is exclusive to this portfolio; do not disable a shared application.
- Existing HttpOnly cookies scoped to `/api/spotify` become unused and expire normally. If immediate expiry of previously installed sessions is required, coordinate that operational step before deployment.
- After deployment, verify that GET login/callback and POST token/logout under `/api/spotify/` return 404. They have been verified against the local production build. An old `?spotify=connected#spotify-player` URL must not reactivate anything.
- Local browser checks observed zero Spotify SDK, iframe, artwork, or API requests during load, navigation, language changes, and booking. Repeat these checks on the deployment; local verification does not test old browser tabs or external credentials.

The [previous Spotify plan](docs/plans/spotify-home-redesign.md) is retained only as a prominently marked historical record. It is not an active integration guide.
