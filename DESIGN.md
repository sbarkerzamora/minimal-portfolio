# Design System

## Direction

The portfolio uses a minimalist application shell inspired by Spotify's information architecture and interaction model. Stephan Barker remains the primary brand. Spotify branding is limited to authenticated playback, metadata attribution, and links back to Spotify.

The interface should feel precise, compact, and fast. Functional icons, typography, spacing, and state changes carry the hierarchy. Avoid decorative shaders, glass panels, large gradients, nested cards, and motion without feedback value.

## Color

- Use shadcn semantic tokens throughout project components.
- Dark mode is the default: near-black background, slightly raised neutral surfaces, high-contrast white text.
- Light mode uses neutral white and gray surfaces with the same hierarchy.
- `primary` is a restrained Spotify green used for playback, availability, focus, and selected states.
- Never use gradient text or introduce additional accent colors.
- Spotify artwork must remain unmodified and must not receive overlays, filters, or animation.

## Typography

- Use the local platform sans stack defined by `--font-body`; do not download web fonts.
- Use one family, three primary weights, and a compact type scale.
- Display headings may use tight tracking down to `-0.04em` and must remain below 6rem.
- Balance headings and use pretty wrapping for longer prose.
- Keep paragraphs below 75 characters per line where practical.

## Layout

- Desktop uses a fixed 76px icon rail, a centered content area, and a 72px bottom player.
- Mobile uses a compact header, a 56px mini player, and a 64px bottom navigation area plus safe-area padding.
- Main content is a simple vertical sequence: profile, recent projects, stack, experience, about, catalog, services, activity, contact.
- Use flat rows for lists and one-level surfaces for collections. Never nest cards.
- Sticky and fixed controls must not obscure focused content.

## Icons

- Use `@phosphor-icons/react` and direct SSR imports in Server Components.
- Every icon must communicate navigation, an action, a technology, attribution, or status.
- Icon-only actions require an accessible name and a tooltip when used in the desktop rail.
- Use regular weight for idle controls, bold for emphasis, and fill for selected or active states.
- Keep primary navigation and playback targets at least 44px.

## Components

- `spotify-portfolio.tsx` owns the static server-rendered portfolio shell and content composition.
- `spotify-player.tsx` is the isolated client island for OAuth state, SDK loading, and playback controls.
- `github-activity.tsx` remains supporting proof and loads its interactive graph below the fold.
- `theme-toggle.tsx` provides light/dark switching and the `D` keyboard shortcut remains available.
- Preserve source components under `components/ui/*`; compose them without changing their upstream implementation.

## Motion

- Interaction timing should stay between 120ms and 220ms.
- Animate transform, opacity, color, and bounded shadows only.
- Use scale feedback for playback and primary controls, surface changes for rows, and icon weight/color changes for active state.
- Do not animate Spotify artwork.
- Disable or reduce custom motion through `prefers-reduced-motion`.

## Spotify Playback

- The SDK is loaded only after explicit authorization.
- The player must expose its connection, loading, playback, and error states in visible text and an ARIA live region.
- Metadata and artwork link back to Spotify.
- Keep playback optional: the portfolio remains complete when Spotify is unavailable or not configured.
- Spotify Premium, Development Mode user limits, attribution rules, and commercial restrictions must be communicated in project documentation.

## Accessibility

- Target WCAG 2.2 AA.
- Keep semantic landmarks and one logical heading hierarchy.
- Provide a skip link, visible focus rings, keyboard operation, native range controls, and a native dialog for expanded mobile playback.
- Maintain at least 4.5:1 contrast for body text and 3:1 for UI graphics.
- Use useful alt text for portfolio photography and empty alt text for artwork already described by adjacent metadata.
