import { cn } from "@/lib/utils"

export type AsciiShape =
  "wave" | "orbit" | "portal" | "lattice" | "beam" | "arrow"

const COLUMNS = 80
const ROWS = 36
const GLYPHS = ".:+ox%8@"

function field(shape: AsciiShape, x: number, y: number) {
  const radius = Math.hypot(x, y)
  switch (shape) {
    case "orbit": {
      const sphere = Math.max(0, 1 - radius * radius)
      const ring = Math.exp(-Math.pow((Math.hypot(x, y * 2.6) - 0.87) * 17, 2))
      return Math.max(sphere * (0.55 + x * 0.3 - y * 0.3), ring)
    }
    case "portal":
      return (
        Math.exp(-Math.pow((Math.hypot(x * 1.5, y) - 0.66) * 11, 2)) *
        (0.7 - y * 0.35)
      )
    case "lattice": {
      const grid = Math.pow(
        Math.abs(Math.sin((x + y) * 11) * Math.cos((x - y) * 11)),
        4
      )
      return (
        grid * Math.max(0, 1.2 - radius) + Math.max(0, 0.25 - radius * 0.15)
      )
    }
    case "beam":
      return (
        Math.exp(-Math.pow((y + Math.sin(x * 2.5) * 0.38) * 7, 2)) *
        (0.7 + Math.sin(x * 8) * 0.3)
      )
    case "arrow": {
      const stem = Math.abs(x + y) < 0.14 && x > -0.65 && x < 0.58
      const head =
        (Math.abs(y + 0.58) < 0.12 && x > -0.06 && x < 0.7) ||
        (Math.abs(x - 0.58) < 0.12 && y > -0.7 && y < 0.04)
      return stem || head ? 0.95 - radius * 0.2 : 0
    }
    default:
      return (
        Math.pow(Math.sin(radius * 15 - 1.6) * 0.5 + 0.5, 3) *
        Math.max(0, 1.3 - radius * 0.5)
      )
  }
}

const artwork = Object.fromEntries(
  (["wave", "orbit", "portal", "lattice", "beam", "arrow"] as const).map(
    (shape) => [
      shape,
      Array.from({ length: ROWS }, (_, row) => {
        let ink = ""
        let light = ""
        for (let column = 0; column < COLUMNS; column++) {
          const level = Math.max(
            0,
            Math.min(
              0.99,
              field(
                shape,
                (column / (COLUMNS - 1) - 0.5) * 2.5,
                (row / (ROWS - 1) - 0.5) * 2
              )
            )
          )
          const glyph =
            level < 0.08 ? " " : GLYPHS[Math.floor(level * GLYPHS.length)]
          ink += level < 0.78 ? glyph : " "
          light += level >= 0.78 ? glyph : " "
        }
        return { ink, light }
      }),
    ]
  )
) as Record<AsciiShape, { ink: string; light: string }[]>

/** Static, deterministic character art: no canvas, animation, or readable content. */
export function AsciiArtwork({
  shape = "wave",
  className,
}: {
  shape?: AsciiShape
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none text-primary select-none", className)}
    >
      <g
        fontFamily="monospace"
        fontSize="10"
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
      >
        {artwork[shape].map(({ ink, light }, row) => (
          <g key={row}>
            <text
              x="0"
              y={row * 10 + 9}
              textLength="480"
              lengthAdjust="spacing"
            >
              {ink.replaceAll(" ", "\u00a0")}
            </text>
            <text
              x="0"
              y={row * 10 + 9}
              textLength="480"
              lengthAdjust="spacing"
              className="fill-foreground"
            >
              {light.replaceAll(" ", "\u00a0")}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
