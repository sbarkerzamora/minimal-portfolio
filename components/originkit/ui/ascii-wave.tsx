"use client"

import * as React from "react"
import { useEffect, useEffectEvent, useRef } from "react"
import * as THREE from "three"

const CURSOR_FOLLOW = 8.5

const GLYPH_ART = [
  ["....", "....", "....", "....", "....", "...."],
  ["....", "....", "....", "....", ".#..", "...."],
  ["....", "....", ".#..", "....", ".#..", "...."],
  ["....", "....", ".##.", "....", "....", "...."],
  ["....", "....", ".#..", "###.", ".#..", "...."],
  ["....", "....", ".##.", "#..#", ".##.", "...."],
  ["....", "#..#", ".##.", ".##.", "#..#", "...."],
  ["....", "#.#.", ".##.", ".##.", "#.#.", "...."],
  [".##.", "#..#", "#..#", "#..#", "#..#", ".##."],
  [".#.#", "####", ".#.#", "####", ".#.#", "...."],
  ["####", "####", "####", "####", "####", "####"],
]

const GLYPHS = GLYPH_ART.map((rows) =>
  rows.reduce(
    (bits, row, y) =>
      bits +
      Array.from(row).reduce(
        (acc, ch, x) => acc + (ch === "#" ? Math.pow(2, x + 4 * y) : 0),
        0
      ),
    0
  )
)

const DEFAULTS = {
  ink: "#00FFF8",
  lit: "#FFFFFF",
  cell: 25,
  rings: 20,
  speed: 8,
  swell: 4,
  warp: 20,
  radius: 163,
  weight: 1,
}

type Config = {
  ink: string
  lit: string
  cell: number
  rings: number
  speed: number
  swell: number
  warp: number
  radius: number
  weight: number
  paused: boolean
  interactive: boolean
}

// Resolve portfolio tokens before passing sRGB colors to the shader.
function resolveColor(value: string, container: HTMLElement) {
  const css = value.replace(/var\((--[\w-]+)\)/g, (_, token: string) =>
    getComputedStyle(container).getPropertyValue(token).trim()
  )
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const context = canvas.getContext("2d")
  if (!context) return new THREE.Color("#edb758")
  context.fillStyle = css
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255)
}

function clamp(v: number, lo: number, hi: number, fallback: number): number {
  const n = typeof v === "number" && isFinite(v) ? v : fallback
  return Math.max(lo, Math.min(hi, n))
}

function settingsFor(cfg: Config) {
  return {
    cell: clamp(cfg.cell, 8, 60, DEFAULTS.cell),

    freq: 0.004 + clamp(cfg.rings, 1, 20, DEFAULTS.rings) * 0.0022,
    speed: clamp(cfg.speed, 0, 20, DEFAULTS.speed) * 0.42,
    swell: clamp(cfg.swell, 0, 20, DEFAULTS.swell) * 0.055,

    warp: clamp(cfg.warp, 0, 20, DEFAULTS.warp) * 0.31,

    reach: clamp(cfg.radius, 40, 400, DEFAULTS.radius),

    gamma: 2.2 - clamp(cfg.weight, 1, 20, DEFAULTS.weight) * 0.08,
  }
}

const QUAD_VERTEX = `
    varying vec2 vUv;
    void main() {
        vUv = uv;

        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`

const WAVE_FRAGMENT = `
    precision highp float;

    #define GLYPH_COUNT ${GLYPHS.length}

    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uHold;
    uniform float uTime;
    uniform vec3 uInk;
    uniform vec3 uLit;
    uniform float uCell;
    uniform float uFreq;
    uniform float uSwell;
    uniform float uWarp;
    uniform float uReach;
    uniform float uGamma;
    uniform float uGlyphs[GLYPH_COUNT];

    varying vec2 vUv;

    float glyphAt(int idx, vec2 g) {
        float bits = 0.0;

        for (int i = 0; i < GLYPH_COUNT; i++) {
            if (i == idx) bits = uGlyphs[i];
        }
        float x = min(floor(g.x * 4.0), 3.0);
        float y = min(floor((1.0 - g.y) * 6.0), 5.0);
        return mod(floor(bits / exp2(x + 4.0 * y)), 2.0);
    }

    void main() {
        vec2 p = vUv * uResolution;
        vec2 cell = floor(p / uCell);
        vec2 mid = (cell + 0.5) * uCell;

        float radius = length(mid - uResolution * 0.5);
        float near = 1.0 - smoothstep(0.0, uReach, length(mid - uPointer));
        near = near * near * uHold;

        float wave = sin(radius * uFreq - uTime + near * uWarp) * 0.5 + 0.5;
        float level = pow(clamp(wave, 0.0, 1.0), uGamma) + near * uSwell * 3.0;
        level = clamp(level, 0.0, 1.0);

        int idx = int(min(floor(level * float(GLYPH_COUNT)), float(GLYPH_COUNT - 1)));
        float mask = glyphAt(idx, fract(p / uCell));
        if (mask < 0.5) discard;

        vec3 col = mix(uInk, uLit, clamp(smoothstep(0.72, 1.0, level) * 0.55 + near * 0.4, 0.0, 1.0));

        float a = 0.35 + 0.65 * level;

        gl_FragColor = vec4(col * a, a);
    }
`

class WaveScene {
  private container: HTMLElement
  private cfg: Config
  private settings: ReturnType<typeof settingsFor>

  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.Camera()
  private geometry = new THREE.PlaneGeometry(2, 2)
  private material: THREE.ShaderMaterial
  private mesh: THREE.Mesh

  private target = new THREE.Vector2(-1e4, -1e4)
  private eased = new THREE.Vector2(-1e4, -1e4)
  private hold = 0
  private wantHold = 0
  private time = 0

  private width = 1
  private height = 1
  private frameId = 0
  private lastT = 0
  private lastFrame = 0
  private disposed = false
  private onError: () => void

  constructor(container: HTMLElement, cfg: Config, onError: () => void) {
    this.container = container
    this.cfg = cfg
    const S = settingsFor(cfg)
    this.settings = S
    this.onError = onError

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)
    const el = this.renderer.domElement
    el.style.position = "absolute"
    el.style.inset = "0"
    el.style.width = "100%"
    el.style.height = "100%"
    el.style.touchAction = "pan-y"
    el.setAttribute("aria-hidden", "true")
    container.appendChild(el)

    this.material = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX,
      fragmentShader: WAVE_FRAGMENT,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPointer: { value: new THREE.Vector2(-1e4, -1e4) },
        uHold: { value: 0 },
        uTime: { value: 0 },
        uInk: { value: resolveColor(cfg.ink, container) },
        uLit: { value: resolveColor(cfg.lit, container) },
        uCell: { value: S.cell },
        uFreq: { value: S.freq },
        uSwell: { value: S.swell },
        uWarp: { value: S.warp },
        uReach: { value: S.reach },
        uGamma: { value: S.gamma },
        uGlyphs: { value: GLYPHS },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.frustumCulled = false
    this.scene.add(this.mesh)

    el.addEventListener("pointermove", this.onPointerMove)
    el.addEventListener("pointerdown", this.onPointerMove)
    el.addEventListener("pointerleave", this.onPointerLeave)
    el.addEventListener("pointercancel", this.onPointerLeave)
    el.addEventListener("webglcontextlost", this.onContextLost)
  }

  private onContextLost = (event: Event) => {
    event.preventDefault()
    this.stop()
    this.onError()
  }

  private onPointerMove = (e: PointerEvent) => {
    if (!this.cfg.interactive || this.cfg.paused || e.pointerType !== "mouse")
      return
    const rect = this.renderer.domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return

    const x = ((e.clientX - rect.left) / rect.width) * this.width
    const y = (1 - (e.clientY - rect.top) / rect.height) * this.height
    this.target.set(x, y)
    if (this.wantHold === 0) this.eased.copy(this.target)
    this.wantHold = 1
  }

  private onPointerLeave = () => {
    this.wantHold = 0
  }

  start() {
    if (this.frameId || this.disposed || this.cfg.paused) return
    this.lastT = performance.now()
    this.lastFrame = 0
    const loop = (now: number) => {
      this.frameId = requestAnimationFrame(loop)
      if (now - this.lastFrame < 1000 / 30) return
      this.lastFrame = now
      this.step()
    }
    this.frameId = requestAnimationFrame(loop)
  }

  stop() {
    cancelAnimationFrame(this.frameId)
    this.frameId = 0
  }

  setSize(width: number, height: number) {
    if (this.disposed || width <= 0 || height <= 0) return
    this.renderer.setSize(width, height, false)
    const dpr = this.renderer.getPixelRatio()
    this.width = width * dpr
    this.height = height * dpr
    this.material.uniforms.uResolution.value.set(this.width, this.height)
    this.step()
  }

  updateConfig(cfg: Config) {
    if (this.disposed) return
    this.cfg = cfg
    this.settings = settingsFor(cfg)
    const u = this.material.uniforms
    u.uInk.value.copy(resolveColor(cfg.ink, this.container))
    u.uLit.value.copy(resolveColor(cfg.lit, this.container))
    if (cfg.paused) this.stop()
    else this.start()
    this.step()
  }

  private step() {
    if (this.disposed) return
    const now = performance.now()
    let dt = (now - this.lastT) / 1000
    this.lastT = now
    if (!isFinite(dt) || dt < 0) dt = 0

    if (dt > 0.05) dt = 0.05

    const S = this.settings
    if (!this.cfg.paused) this.time += dt * S.speed
    this.eased.lerp(this.target, 1 - Math.exp(-dt * CURSOR_FOLLOW))
    this.hold += (this.wantHold - this.hold) * (1 - Math.exp(-dt * 5))

    const dpr = this.renderer.getPixelRatio()
    const u = this.material.uniforms
    u.uTime.value = this.time
    u.uPointer.value.copy(this.eased)
    u.uHold.value = this.hold
    u.uCell.value = S.cell * dpr

    u.uFreq.value = S.freq / dpr
    u.uSwell.value = S.swell
    u.uWarp.value = S.warp
    u.uReach.value = S.reach * dpr
    u.uGamma.value = S.gamma

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    this.stop()
    const el = this.renderer.domElement
    el.removeEventListener("pointermove", this.onPointerMove)
    el.removeEventListener("pointerdown", this.onPointerMove)
    el.removeEventListener("pointerleave", this.onPointerLeave)
    el.removeEventListener("pointercancel", this.onPointerLeave)
    el.removeEventListener("webglcontextlost", this.onContextLost)
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    if (el.parentNode === this.container) this.container.removeChild(el)
  }
}

export interface AsciiWaveProps {
  ink?: string

  lit?: string

  cell?: number

  rings?: number

  speed?: number

  swell?: number

  warp?: number

  radius?: number

  weight?: number
  paused?: boolean
  interactive?: boolean
  onReady?: () => void
  onError?: () => void
  style?: React.CSSProperties
}

export default function AsciiWave(props: AsciiWaveProps) {
  const {
    ink = DEFAULTS.ink,
    lit = DEFAULTS.lit,
    cell = DEFAULTS.cell,
    rings = DEFAULTS.rings,
    speed = DEFAULTS.speed,
    swell = DEFAULTS.swell,
    warp = DEFAULTS.warp,
    radius = DEFAULTS.radius,
    weight = DEFAULTS.weight,
    paused = false,
    interactive = true,
    onReady,
    onError,
    style,
  } = props

  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<WaveScene | null>(null)

  const cfgRef = useRef<Config>({
    ink,
    lit,
    cell,
    rings,
    speed,
    swell,
    warp,
    radius,
    weight,
    paused,
    interactive,
  })
  const reportReady = useEffectEvent(() => onReady?.())
  const reportError = useEffectEvent(() => onError?.())

  useEffect(() => {
    cfgRef.current = {
      ink,
      lit,
      cell,
      rings,
      speed,
      swell,
      warp,
      radius,
      weight,
      paused,
      interactive,
    }
    sceneRef.current?.updateConfig(cfgRef.current)
  }, [
    ink,
    lit,
    cell,
    rings,
    speed,
    swell,
    warp,
    radius,
    weight,
    paused,
    interactive,
  ])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let scene: WaveScene
    try {
      scene = new WaveScene(container, cfgRef.current, reportError)
    } catch {
      reportError()
      return
    }
    sceneRef.current = scene
    scene.setSize(container.clientWidth, container.clientHeight)
    scene.start()
    reportReady()

    const ro = new ResizeObserver(() => {
      scene.setSize(container.clientWidth, container.clientHeight)
    })
    ro.observe(container)
    return () => {
      ro.disconnect()
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="A ring wave crossing a sheet of typed characters"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 120,
        minHeight: 120,
        overflow: "hidden",
        ...style,
      }}
    />
  )
}

AsciiWave.displayName = "Ascii Wave"
