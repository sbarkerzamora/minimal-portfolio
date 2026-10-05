"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import {
  Component,
  memo,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useFullscreenBackground } from "@/components/portfolio/fullscreen-provider"

const AsciiWave = dynamic(
  () => import("@/components/originkit/ui/ascii-wave"),
  { ssr: false }
)
const Topography = dynamic(() => import("@/components/react-bits/Topography"), {
  ssr: false,
})
const SlicedWaves = dynamic(
  () => import("@/components/react-bits/SlicedWaves"),
  { ssr: false }
)
const Scanner = dynamic(() => import("@/components/react-bits/Scanner"), {
  ssr: false,
})
const SoftAurora = dynamic(() => import("@/components/react-bits/SoftAurora"), {
  ssr: false,
})
const Grainient = dynamic(() => import("@/components/react-bits/Grainient"), {
  ssr: false,
})
const GridScan = dynamic(
  () =>
    import("@/components/react-bits/GridScan").then(
      (module) => module.GridScan
    ),
  { ssr: false }
)
const FaultyTerminal = dynamic(
  () => import("@/components/react-bits/FaultyTerminal"),
  { ssr: false }
)

export type BackgroundName =
  | "inicio"
  | "proyectos"
  | "stack"
  | "experiencia"
  | "catalogo"
  | "servicios"
  | "actividad"
  | "contacto"

// sRGB equivalents of the fixed portfolio palette, shared by all source presets.
const charcoal = "#0c0e10"
const amber = "#efb654"
const white = "#f4f1ec"

const BackgroundRenderer = memo(function BackgroundRenderer({
  name,
}: {
  name: BackgroundName
}) {
  switch (name) {
    case "inicio":
      return (
        <AsciiWave
          ink="var(--primary)"
          lit="var(--foreground)"
          cell={12}
          rings={8}
          speed={1.5}
          weight={3}
          interactive={false}
        />
      )
    case "proyectos":
      return (
        <Topography
          lowColor={charcoal}
          midColor={amber}
          highColor={white}
          speed={0.18}
          grainIntensity={0.03}
          glow={0.3}
          opacity={0.75}
          mouseInteraction={false}
        />
      )
    case "stack":
      return (
        <SlicedWaves
          color1={amber}
          color2={charcoal}
          color3={white}
          speed={0.2}
          glow={0.25}
          opacity={0.7}
          mouseInteraction={false}
        />
      )
    case "experiencia":
      return (
        <Scanner
          color1={charcoal}
          color2={amber}
          color3={white}
          speed={0.2}
          sweepSpeed={0.15}
          opacity={0.65}
          grainIntensity={0.02}
          mouseInteraction={false}
        />
      )
    case "catalogo":
      return (
        <SoftAurora
          color1={amber}
          color2={white}
          speed={0.2}
          brightness={0.55}
          colorSpeed={0.2}
          enableMouseInteraction={false}
          preservePalette
        />
      )
    case "servicios":
      return (
        <Grainient
          color1={charcoal}
          color2={amber}
          color3={charcoal}
          timeSpeed={0.12}
          grainAmount={0.12}
          grainAnimated={false}
          saturation={0.6}
        />
      )
    case "actividad":
      return (
        <GridScan
          linesColor="#45413b"
          scanColor={amber}
          scanOpacity={0.35}
          scanDuration={4}
          scanDelay={4}
          enableWebcam={false}
          enableGyro={false}
          showPreview={false}
          enablePost={false}
          scanOnClick={false}
          chromaticAberration={0}
        />
      )
    case "contacto":
      return (
        <FaultyTerminal
          tint={amber}
          timeScale={0.15}
          flickerAmount={0}
          glitchAmount={0.12}
          chromaticAberration={0}
          noiseAmp={1}
          mouseReact={false}
          pageLoadAnimation={false}
          brightness={0.5}
          dpr={1}
        />
      )
  }
})

class BackgroundBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function LiveBackground({ name }: { name: BackgroundName }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const container = ref.current
    if (!container) return
    let frame = 0
    let canvas: HTMLCanvasElement | null = null
    const onLost = () => setFailed(true)
    function inspect() {
      if (canvas) return
      canvas = container!.querySelector("canvas")
      if (!canvas) return
      canvas.addEventListener("webglcontextlost", onLost)
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setReady(true))
      })
    }
    const observer = new MutationObserver(inspect)
    observer.observe(container, { childList: true, subtree: true })
    inspect()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      canvas?.removeEventListener("webglcontextlost", onLost)
    }
  }, [])
  return (
    <div
      ref={ref}
      data-live-renderer={name}
      className="absolute inset-0 bg-background transition-opacity duration-200 motion-reduce:transition-none"
      style={{ opacity: ready && !failed ? 1 : 0 }}
    >
      {!failed && (
        <BackgroundBoundary onError={() => setFailed(true)}>
          <BackgroundRenderer name={name} />
        </BackgroundBoundary>
      )}
    </div>
  )
}

export function SectionBackground({ name }: { name: BackgroundName }) {
  const { active, playing } = useFullscreenBackground()
  const live = active === name && playing
  return (
    <div
      className="screen-background pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-background"
      aria-hidden="true"
      data-background={name}
      data-live={live}
    >
      <Image
        src={`/backgrounds/${name}.webp`}
        alt=""
        fill
        unoptimized
        loading={name === "inicio" ? "eager" : "lazy"}
        className="object-cover"
      />
      {live && <LiveBackground name={name} />}
      <div className="background-scrim absolute inset-0 bg-background/70" />
    </div>
  )
}
