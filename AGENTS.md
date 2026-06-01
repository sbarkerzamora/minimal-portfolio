<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio Direction

This project is Stephan Barker's personal portfolio. Treat the main website as a brand surface: design is part of the product, not decoration.

## Tooling

- Use `pnpm` as the package manager.
- Run Next scripts through Bun using the existing package scripts.
- Keep content easy to edit from `public/profile.json` whenever practical.

## Skill Routing

- Use `impeccable` for design planning, layout, typography, color strategy, motion, polish, accessibility review, responsive refinement, and portfolio-specific visual decisions.
- Use `shadcn` when adding, checking, composing, or debugging shadcn/ui components. Always prefer project-installed components and docs before inventing UI.
- Use regular engineering workflow for data wiring, TypeScript, Next.js routing, build fixes, and small implementation tasks.

## Design Constraints

- Preserve shadcn/ui source components in `components/ui/*`. Do not modify them unless explicitly requested.
- Preserve shadcn theme tokens and global component styling unless explicitly requested.
- Use Tailwind 4 composition classes for project-specific layout and visual treatment.
- Use `@phosphor-icons/react` for icons.
- Support light and dark themes.
- Keep the visual system mostly black and white with restrained emerald accents, around 5-10% of the surface.
- Prefer centered content, strong hierarchy, precise spacing, and subtle microinteractions.
- Respect `prefers-reduced-motion` for all custom motion.
