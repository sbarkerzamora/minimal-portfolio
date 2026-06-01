"use client"

import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false },
)

function HeroBackground() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full">
      <Dithering
        width="100%"
        height="100%"
        fit="cover"
        colorBack="rgba(0,0,0,0)"
        colorFront={isDark ? "#34d399" : "#059669"}
        shape="sphere"
        type="4x4"
        size={2}
        speed={1}
        scale={0.6}
      />
    </div>
  )
}

export { HeroBackground }
