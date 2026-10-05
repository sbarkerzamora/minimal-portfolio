# Design System

## Current Home Direction

The current home redesign in [white-hero-redesign.md](docs/plans/white-hero-redesign.md) supersedes the earlier full-page ASCII Cinematic composition for `/`. The home page defaults to white, offers a persistent light/dark preference, and uses a minimal centered profile with its avatar, links, and compact GitHub contribution calendar. Dark mode uses the existing charcoal and warm-white palette; amber remains limited to contribution intensity. The ES/EN and Claro/Oscuro controls are compact, text-led, and keyboard accessible. The sections below document the archived full-portfolio direction and apply if that experience is restored.

## Direction

**ASCII Cinematic** is the approved direction for Stephan Barker's portfolio: phosphoric, granular, precise. The supplied ASCII video and amber phosphor light are the visual references. Charcoal space and crisp warm-white typography frame that material; amber marks actions and focus rather than recoloring a music application shell.

This document records the implemented system and its ongoing design constraints. The [redesign plan](docs/plans/ascii-cinematic-redesign.md) contains the verification record and remaining testing limitations; design rules alone do not certify accessibility or performance.

The visitor is evaluating professional work from a laptop or phone. The dark treatment is an explicit brand decision, not an inference about their preferences. Keep the website dark regardless of saved preferences or system appearance, with no theme selector. Booking remains the primary conversion; projects, GitHub, and CV provide evidence.

Do not imitate a terminal with fictional commands, blinking cursors, or code filler. No music branding, side rail, bottom bar, decorative shaders, glassmorphism, gradient text, nested cards, oversized metric cards, or repetitive icon/title/card grids. The ASCII texture belongs to the media, not the body typography or a full-page overlay.

## Color

Use shadcn semantic token names throughout project components. The approved redesign authorizes new theme values in `app/globals.css`, not edits to upstream source components in `components/ui/*`. Use Tailwind 4 composition classes, existing variants, and semantic tokens for project-specific treatment.

Keep roughly 90-95% of the functional surface charcoal and warm white, with 5-10% amber. The video may carry more color; its muted blues and violets are not a second control palette. Preserve recognizable colors in real technology logos and photographs.

Implemented OKLCH values:

| Semantic token             | Value                   | Role                                   |
| -------------------------- | ----------------------- | -------------------------------------- |
| `background`               | `oklch(0.16 0.006 260)` | Charcoal canvas                        |
| `foreground`               | `oklch(0.96 0.008 85)`  | Warm-white primary text                |
| `card`                     | `oklch(0.19 0.006 260)` | Occasional raised surface              |
| `popover`                  | `oklch(0.22 0.006 260)` | Opaque menu and dialog                 |
| `secondary`                | `oklch(0.26 0.006 260)` | Secondary controls                     |
| `muted`                    | `oklch(0.24 0.006 260)` | Supporting surfaces                    |
| `muted-foreground`         | `oklch(0.74 0.008 85)`  | Readable metadata                      |
| `primary`, `brand`, `ring` | `oklch(0.80 0.13 75)`   | Main actions, highlighted links, focus |
| `primary-foreground`       | `oklch(0.16 0.008 75)`  | Dark text on amber                     |
| `accent`                   | `oklch(0.27 0.025 75)`  | Subtle hover or selection              |
| `border`                   | `oklch(0.31 0.008 260)` | Decorative separators                  |
| `input`                    | `oklch(0.55 0.012 75)`  | Identifiable control boundaries        |
| `destructive`              | `oklch(0.72 0.17 30)`   | Errors only                            |

The remaining `*-foreground` surfaces use the primary warm-white ink. The graph uses five amber levels from `chart-5` (quietest) to `chart-1` (brightest), a visible legend, keyboard navigation, and a date lookup. A subtle decorative border is not an accessible control boundary. Do not mechanically replace every green value with amber or keep isolated legacy control colors.

## Typography

- Use **Schibsted Grotesk**, a self-hosted variable WOFF2 loaded with `next/font/local` from `app/layout.tsx`, with its OFL license included and ES/EN glyph coverage. No third-party font request during a visit or Google dependency during a build.
- Use weights 400, 500, and 700. Keep `ui-monospace` for dates, short metadata, or graph legends only; do not load a second family by default or turn body copy into a terminal.
- H1 is fluid from 40 to 88px, H2 from 28 to 44px, H3 from 20 to 26px, body 16-18px, labels 13-14px.
- Heading line-height is 1.04-1.12 and tracking no tighter than `-0.04em`. Body line-height is 1.6-1.7 and measure is 60-70ch.
- Use `text-wrap: balance` for headings and `pretty` for paragraphs. Test actual project names and English copy without truncating essential information to fit.

## Layout

- Center content up to 1200px and the visual hero up to 1440px. Use lateral margins of 20px on mobile, 32px on tablet, and 48px on desktop.
- Use the spacing scale 4, 8, 12, 16, 24, 32, 48, 64, 96, and 128px. Section gaps range from 64 to 112px according to content; related items stay more compact.
- Controls use approximately 4-8px radii and media/dialogs 8-12px. Use 1px borders and matte surfaces, not large pills, glowing edges, or nested cards.
- Replace the desktop rail with a sticky, opaque horizontal header: typographic name, section links, ES/EN, and booking. Switch to compact navigation before labels become crowded.
- The mobile menu is a native `details`/`summary` disclosure below the header, not another modal or bottom navigation bar. Include all six destinations, including Contact; preserve its native expanded state, hide closed links from keyboard focus, and close on navigation, focus leaving, outside click, desktop resize, or Escape. Only Escape returns focus to the summary. DOM and visual focus orders agree on both layouts.
- Remove all rail offsets, bottom-player spacers, and bottom-navigation reservations. Keep safe-area handling where needed and anchor/focus clearance for the sticky header.
- Preserve a skip link, one `main`, logical headings, and `#inicio`, `#proyectos`, `#stack`, `#experiencia`, `#acerca`, `#contacto`.

Keep the sequence hero, recent projects, stack, experience, about, catalog, services, activity, contact. Variety comes from composition, not extra content or an invented footer.

| Surface                  | Presentation and preservation contract                                                                                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero                     | Panoramic background, dominant name, left-aligned text in a dark area, light visible to the right, and flexible height rather than rigid `100vh`. Secondary 64-80px portrait with a discreet frame; availability is existing text plus a small amber signal, not a live verification claim. |
| Hero actions and metrics | CV is the main local action, GitHub a secondary link. Booking remains in header and contact. Keep +8, +20, +15 and their meanings in a compact line, without animated counters or giant cards.                                                                                              |
| Recent projects          | Four real projects with brand, readable description, technologies, and external link. Two generous columns on desktop, one on mobile; no track numbers or music rows.                                                                                                                       |
| Stack                    | Four open category sections with titles, descriptions, and all 20 technologies. Flat low-emphasis tags rather than four cloned cards. Deduplicated logos and names form a static wrapping technology list, never an automatic marquee.                                                      |
| Experience               | Preserve all four periods, roles, companies, descriptions, and achievements. Spacious rows with dates beside the role on desktop and above it on mobile, without accordions hiding content or luminous side rules.                                                                          |
| About and education      | Keep the personal photo, philosophy, focus, five values, and Platzi education/link. Broad photo and text in two columns, one on mobile; values as a list and education as typography rather than nested cards.                                                                              |
| Catalog                  | Nine existing works with names, categories, links, and all underlying profile data preserved. Whole-row hover/focus and an external arrow, no decorative track numbering. Do not merge it with recent projects.                                                                             |
| Services                 | Three offers with existing descriptions and tags, separated by space and fine rules. No invented prices or actions and no repeated decorative Code icons.                                                                                                                                   |
| GitHub                   | Supporting technical proof with username, total, source label, five-level amber scale, visible legend, real link, and accessible details. Synthetic fallback must be unmistakable.                                                                                                          |
| Contact                  | Broad closing space with existing CTA and subtitle, amber booking action and secondary CV. No new form, CRM, or generic oversized card.                                                                                                                                                     |
| Site imagery and CV      | Personal charcoal/amber icons and Open Graph, preserving metadata and URLs. Keep `/api/cv` fully bilingual and printable; align hierarchy/accent where appropriate without blackening every PDF page.                                                                                       |

Retain certificates, extended descriptions, unused images, email, additional CV stack, and all other professional fields. Some translations depend on indices and others names; do not independently rename, reorder, or deduplicate collections. Missing project/service image files are not a reason to invent screenshots or render broken paths.

## Icons

- Use `@phosphor-icons/react` and direct SSR imports in Server Components.
- Icons communicate navigation, actions, or meaningful status, not decoration above every section. Preserve actual technology logos; unmapped technologies retain their names without empty icon slots.
- Give icon-only controls accessible names and at least 44 x 44px touch targets. Amber focus must be visible and separated from its surface; selected states need a shape, underline, or other non-color cue.

## Components

Component boundaries:

- `components/portfolio/portfolio.tsx` exports **`Portfolio`**, the Server Component for shell and localized content composition. `app/page.tsx` renders it for the selected locale; titles, summaries, links, and static structure stay server-rendered.
- `components/portfolio/hero-video.tsx` is the isolated Client Component for the decorative medium, preference/visibility handling, and its accessible control. It does not own the hero's professional content.
- The new horizontal header keeps static navigation server-rendered where practical and isolates the mobile disclosure interaction. No side rail, bottom navigation, or persistent player survives.
- `technology-list.tsx` renders a static wrapping list, preserving deduplicated names and available logos without a continuous animation loop. Desktop navigation is server-rendered; `navigation.tsx` isolates the native mobile disclosure.
- `github-activity.tsx` composes server-fetched data. Preserve `lib/github-contributions.ts`, its username derivation, query, and shared cache. The existing fallback is generated synthetic data, not a stored copy of real contributions: label it explicitly in ES/EN and never present its total as verified activity.
- `lazy-contribution-graph.tsx` reserves stable dimensions and a localized placeholder, importing the interactive graph near the viewport. `components/smoothui/contribution-graph/index.tsx` owns the amber cells, legend, tooltip, identified local horizontal scroll, and keyboard-equivalent date/count details without hundreds of tab stops.
- `language-selector.tsx` preserves the validated `portfolio_locale` cookie and Server Action, selected/pending/disabled/error/retry states, server-rendered document language and metadata, and stable width. Changing ES/EN must not reset the video or booking state unnecessarily.
- `booking-dialog.tsx` remains one shared native Cal.com dialog for booking actions. Preserve Escape, restored focus, scroll lock, lazy calendar loading, retention between openings, loading/ready/failed/timeout states, and an always-available direct booking link. Style the wrapper and use Cal.com's official dark-theme options; do not attempt to style its cross-origin DOM.
- Preserve all `components/ui/*` sources, including unused primitives. Buttons use existing variants: amber primary, outline secondary, ghost/link tertiary. Bring hover, focus-visible, active, and disabled states into the same vocabulary.
- The old shader, marquee, and reveal components have been removed along with Three.js and GSAP. A brief CSS hero entrance leaves content visible before hydration; there is no new video or animation dependency.

## Hero Video

1. Preserve `public/hero-video.mp4`, served at `/hero-video.mp4`. Generate `public/hero-poster.webp` from the real clip, verify the crop, and show the still in initial HTML with reserved geometry. Prioritize it if it is the LCP candidate rather than retaining the old large avatar's priority.
2. Use one native HTML video with `muted`, `loop`, and `playsInline`, no audio, iframe, third-party video service, or music controls. Its ASCII material needs no second ASCII filter or real-time WebGL conversion.
3. The initial render has an eager, high-priority poster and **no active video source**. After hydration, check reduced-motion and data-saving preferences where supported before selecting the smaller `/hero-video.webm` for VP9-capable browsers or the unchanged `/hero-video.mp4` otherwise. `preload` alone does not prevent downloads from an active autoplay source.
4. Keep the poster without autoplay for `prefers-reduced-motion: reduce`, data saving, or no JavaScript. Explicit playback can override those preferences; independently track both restrictions and invalidate that override when either changes.
5. Expose a visible keyboard-accessible control, "Pausar fondo" / "Reproducir fondo" and English equivalents. The decorative medium is `aria-hidden` and unfocusable; the control is outside that hidden container. No captions are needed for a silent decoration that conveys no information absent from the HTML.
6. Pause outside the viewport and while the tab is hidden. Resume only if permitted and the visitor has not manually paused; locale changes must not restart playback.
7. Keep the poster and all content during loading, rejected autoplay, or network errors. Fade to video only once a frame exists. If manual playback fails, report it next to the control without a giant spinner or blocked CTA.
8. Use `object-fit: cover` with `object-position` checked on desktop, tablet, and mobile. Let content determine height; neither rigid `100vh` nor a fixed 16:9 box may crop text. Reserve geometry throughout loading and failure.
9. Put a localized dark scrim beneath the text while preserving the luminous area. Verify contrast across the full clip, not only the poster, and never blur or pixelate content. Inspect loop continuity and potentially hazardous flashes in the actual video.

Preserve the supplied MP4. The measured VP9 rendition reduces video resource size by 52.4% while preserving dimensions, frame rate, duration, and the ASCII material. Select one source, never simultaneous downloads. Transfer savings do not imply an equivalent LCP improvement; measured laboratory results are recorded in the plan.

## Motion

- Prefer CSS transitions for microinteractions of 140-200ms, with dialog opening up to 220ms, ease-out, and no bouncing. Use transform, opacity, or color for meaningful feedback rather than layout animation.
- A short hero entrance may establish hierarchy, but content is visible before hydration. Do not apply a uniform reveal/stagger to every section or make reading depend on an animation firing.
- No scroll-jacking, parallax, custom cursor, animated counters, continuous CSS texture animation, or technology marquee. The decorative video is the only continuous atmospheric motion and has a pause control.
- `prefers-reduced-motion` removes entrances and smooth scrolling, stops video work, and leaves every state usable. Stop the underlying work rather than only freezing its appearance.

## States and Accessibility

Design and verify action resting/hover/focus/active/disabled states; menu closed/open/navigation/Escape; video poster/loading/playing/manual pause/automatic pause/preference changes/rejection/failure; locale selected/pending/error/recovery; booking closed/open/closing/loading/ready/failed/timeout; GitHub loading/real/synthetic/empty/failure/detail; and image failure with titles, links, and reserved dimensions intact.

- Target WCAG 2.2 AA: normal text at least 4.5:1, large text and control/focus graphics at least 3:1 where applicable. Verify actual token pairings and several moments of the hero video; these are requirements, not certified results.
- Preserve semantic landmarks, logical headings, skip link, accessible names, full keyboard operation, Escape behavior, and focus restoration. Sticky content and dialogs must not obscure focused elements.
- Provide useful alt text for portfolio photography and empty alt text for genuinely decorative images. Do not rely on hover or color alone for GitHub information or selected states.
- Check ES and EN at 360, 390, 768, 1024, and 1440px, short landscape viewports, and hero enlargement up to 1920px. Check 200% zoom and 320px reflow without page-level horizontal scroll; the identified graph container may scroll locally.
- Test reduced motion, no JavaScript, available data-saving settings, blocked autoplay, failed MP4, and failed Cal.com loading. The poster, professional content, CV links, and direct booking alternative must remain usable as appropriate.
- Include Safari/iOS and Chromium/Android when available and explicitly record missing coverage. Measure layout stability, font/media loading, contrast, and interaction behavior rather than assuming component choice guarantees accessibility.

The plan's performance targets are LCP <= 2.5s, CLS <= 0.05, and INP <= 200ms, not measured outcomes. Record device, browser, network, and actual results; laboratory tests do not establish field INP. No global build or acceptance claim should race concurrent edits.

## Retired Integration

Spotify playback, OAuth routes, SDK, iframe, types, messages, image-host permission, environment settings, branding, and layout offsets are outside the new product. No compatibility player or token endpoint replaces them. See [README.md](README.md#spotify-retirement) for responsible deployment cleanup and previous-session handling; repository removal does not revoke external authorizations. The [old design plan](docs/plans/spotify-home-redesign.md) is historical only.
