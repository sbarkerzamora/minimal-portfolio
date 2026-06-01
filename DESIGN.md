# Design System

## Overview

Stephan Barker's portfolio is a restrained personal brand surface: centered composition, black and white structure, precise spacing, useful iconography, and emerald accents held to roughly 5-10% of the visible interface. It should feel designed, but not loud.

## Color

- Primary surfaces use existing shadcn semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`.
- Emerald is the single accent. Use it for CTAs, focus rings, selected navigation state, small status marks, and low-opacity atmosphere.
- Current emerald usage appears in the hero halo, availability dot, title label, capability icons, dock hover states, and focus rings.
- Avoid gradient text, rainbow palettes, beige/cream defaults, and decorative color fields.
- Dark mode should preserve restraint: high contrast, subtle emerald light, no neon transformation.

## Typography

- Use the current project fonts from `app/layout.tsx`: Inter for the main sans face and Geist Mono for compact technical labels.
- Hero display uses a strong scale with tight but safe tracking: `tracking-[-0.04em]`, capped below the 6rem display ceiling.
- Use `text-balance` for display headings and `text-pretty` for longer prose.
- Avoid all-caps body copy. Short technical labels may use uppercase when brief and intentional.

## Layout

- The hero owns exactly one viewport with `h-svh`.
- Primary content is centered vertically and horizontally.
- Bottom padding reserves space for the fixed dock without increasing page height.
- Background treatment uses a masked grid and subtle radial emerald wash. These are atmosphere, not the main design.
- Dock navigation is fixed bottom center on all viewport sizes.

## Components

- Do not modify `components/ui/*` unless explicitly requested.
- Current installed shadcn usage: `Button` composed with `asChild` for links.
- Project-specific components live under `components/portfolio/*`:
  - `hero.tsx`: avatar, identity, CTAs, capability chips, compact stats.
  - `nav-dock.tsx`: bottom-center icon dock.
  - `theme-toggle.tsx`: light/dark toggle inside the dock.
  - `github-activity.tsx`: compact GitHub contribution graph using real public contribution data.
- SmoothUI registry components live under `components/smoothui/*`. Review and adapt generated files so they respect project tokens and accessibility.
- Content is normalized through `lib/profile.ts`, which reads from `public/profile.json`.

## Icons

- Use Phosphor icons from `@phosphor-icons/react` or `@phosphor-icons/react/dist/ssr`.
- Stack technology logos use `@ridemountainpig/svgl-react` for official SVGs (Nextjs, React, TypeScript, etc.).
- SVG logo components with Light/Dark variants use CSS theme toggle (`.block .dark:hidden` / `.hidden .dark:block`).
- Hero action icons: download, GitHub, external arrow.
- Dock icons: home, user, briefcase, stack, folder, envelope, sun/moon.
- Icons should support wayfinding or meaning. Avoid decorative icon clouds.

## Motion

- Entrance motion is limited to the hero container and capability chips.
- Hover motion is subtle: small vertical lift, border shift, color shift, soft shadow.
- Timing target: 150-300ms for microinteractions, 500-700ms for the initial hero entrance.
- Use transform, opacity, border color, shadow, and bounded blur. Avoid layout-driving animation.
- Respect `prefers-reduced-motion`; current portfolio animations disable under reduced motion.

## Current Hero Direction

- Avatar at top using `/avatar.png`.
- Centered name, normalized title, description, CTAs, stack logos, and compact proof stats.
- Primary CTA: Descargar CV.
- Secondary CTA: GitHub with icon.
- GitHub contribution graph appears as a compact activity signature in the hero. It uses real public data for the GitHub profile URL in `public/profile.json`, revalidates every 12 hours, and falls back to deterministic placeholder activity if GitHub is unavailable.
- Bottom-center dock with icon-only navigation and theme toggle.

## Next Visual Priorities

- Add real sections for Sobre mí, Experiencia, Stack, Proyectos, and Contacto only when content is shaped, not as placeholders.
- Consider a polished proof section next, using project data from `public/profile.json` without falling into repeated identical card grids.
