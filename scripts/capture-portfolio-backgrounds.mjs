import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { mkdtemp, rm } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const require = createRequire(new URL("../package.json", import.meta.url))
const sharp = createRequire(require.resolve("next/package.json"))("sharp")
const directory = await mkdtemp(join("/tmp/opencode", "portfolio-backgrounds-"))
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const server = spawn("bun", ["run", "start", "--port", "3198"], {
  cwd: root,
  stdio: "ignore",
})
const chrome = spawn(
  process.env.CHROME_PATH || "google-chrome",
  [
    "--headless",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--enable-unsafe-swiftshader",
    "--no-first-run",
    "--remote-debugging-port=9368",
    `--user-data-dir=${directory}`,
    "about:blank",
  ],
  { stdio: "ignore" }
)
let socket
try {
  for (let i = 0; i < 100; i++) {
    if (
      await fetch("http://127.0.0.1:3198")
        .then((r) => r.ok)
        .catch(() => false)
    )
      break
    await sleep(100)
  }
  let pages
  for (let i = 0; i < 100; i++) {
    pages = await fetch("http://127.0.0.1:9368/json")
      .then((r) => r.json())
      .catch(() => null)
    if (pages) break
    await sleep(100)
  }
  socket = new WebSocket(
    pages.find((page) => page.type === "page").webSocketDebuggerUrl
  )
  await new Promise((resolve) =>
    socket.addEventListener("open", resolve, { once: true })
  )
  const requests = new Map()
  let id = 0
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data)
    if (!message.id) return
    const request = requests.get(message.id)
    requests.delete(message.id)
    if (message.error) request.reject(message.error)
    else request.resolve(message.result)
  })
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      requests.set(++id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })
  }
  async function evaluate(expression) {
    const response = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (response.exceptionDetails)
      throw new Error(JSON.stringify(response.exceptionDetails))
    return response.result.value
  }
  await send("Page.enable")
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  })
  await send("Page.navigate", { url: "http://127.0.0.1:3198" })
  for (let i = 0; i < 100; i++) {
    if (
      await evaluate("document.querySelectorAll('[data-screen]').length === 9")
    )
      break
    await sleep(100)
  }
  await evaluate("document.fonts.ready")
  await evaluate(
    `{ const style = document.createElement('style'); style.textContent = 'html{scroll-behavior:auto!important}.screen-shell,[data-portfolio-header],.background-scrim{visibility:hidden!important}.screen-background>img{visibility:hidden!important}'; document.head.append(style); }`
  )
  const names = [
    "inicio",
    "proyectos",
    "stack",
    "experiencia",
    "catalogo",
    "servicios",
    "actividad",
    "contacto",
  ]
  const selected = process.argv.slice(2)
  for (const name of selected.length ? selected : names) {
    assert.ok(names.includes(name), `Unknown background: ${name}`)
    await evaluate(
      `document.getElementById('${name}').scrollIntoView({behavior:'instant',block:'start'})`
    )
    let ready = false
    for (let i = 0; i < 150; i++) {
      ready = await evaluate(
        `!!document.querySelector('[data-live-renderer="${name}"] canvas')`
      )
      if (ready) break
      await sleep(100)
    }
    assert.ok(ready, `Renderer missing: ${name}`)
    await sleep(name === "actividad" ? 2400 : 1200)
    const image = await send("Page.captureScreenshot", {
      format: "png",
      clip: {
        x: 0,
        y: await evaluate("scrollY"),
        width: 1440,
        height: 900,
        scale: 1,
      },
      captureBeyondViewport: true,
    })
    await sharp(Buffer.from(image.data, "base64"))
      .webp({ quality: 82 })
      .toFile(join(root, "public/backgrounds", `${name}.webp`))
    console.log(`Captured ${name} from its library renderer.`)
  }
} finally {
  socket?.close()
  chrome.kill("SIGTERM")
  server.kill("SIGTERM")
  await sleep(200)
  await rm(directory, { recursive: true, force: true })
}
