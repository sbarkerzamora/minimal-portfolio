import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { writeFile, mkdtemp, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const base = "http://127.0.0.1:3198"
const directory = await mkdtemp("/tmp/opencode/fullscreen-browser-")
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
const results = []
try {
  for (let i = 0; i < 100; i++) {
    if (
      await fetch(base)
        .then((r) => r.ok)
        .catch(() => false)
    )
      break
    await sleep(100)
  }
  const profile = await fetch(`${base}/profile.json`).then((r) => r.json())
  for (const [route, method] of [
    ["login", "GET"],
    ["callback", "GET"],
    ["token", "POST"],
    ["logout", "POST"],
  ])
    assert.equal(
      (await fetch(`${base}/api/spotify/${route}`, { method })).status,
      404
    )
  const cv = await fetch(`${base}/api/cv`)
  assert.equal(cv.status, 200)
  assert.match(cv.headers.get("content-type"), /application\/pdf/)
  const backgrounds = [
    "inicio",
    "proyectos",
    "stack",
    "experiencia",
    "catalogo",
    "servicios",
    "actividad",
    "contacto",
  ]
  for (const name of backgrounds)
    assert.equal((await fetch(`${base}/backgrounds/${name}.webp`)).status, 200)
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
  const pending = new Map()
  const requests = []
  const errors = []
  let id = 0
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data)
    if (message.method === "Runtime.exceptionThrown")
      errors.push(message.params.exceptionDetails)
    if (
      message.method === "Runtime.consoleAPICalled" &&
      message.params.type === "error"
    )
      errors.push(message.params.args)
    if (message.method === "Network.requestWillBeSent")
      requests.push(message.params.request.url)
    if (!message.id) return
    const request = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) request.reject(message.error)
    else request.resolve(message.result)
  })
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })
  }
  async function evaluate(expression) {
    const response = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true,
    })
    if (response.exceptionDetails)
      throw new Error(JSON.stringify(response.exceptionDetails))
    return response.result.value
  }
  async function wait(expression) {
    for (let i = 0; i < 200; i++) {
      if (await evaluate(expression)) return
      await sleep(60)
    }
    console.error(
      "Browser diagnostics",
      await evaluate(
        `({active:document.activeElement?.outerHTML,heads:Array.from(document.querySelectorAll('#proyectos h3')).map(e=>e.textContent),panels:Array.from(document.querySelectorAll('#proyectos [aria-label="Proyectos recientes"]>a')).map(e=>({name:e.getAttribute('aria-label'),active:e.getAttribute('aria-current')}))})`
      ),
      errors
    )
    throw new Error(`Timeout: ${expression}`)
  }
  async function screenshot(name) {
    const shot = await send("Page.captureScreenshot", { format: "png" })
    await writeFile(
      `/tmp/opencode/fullscreen-${name}.png`,
      Buffer.from(shot.data, "base64")
    )
  }
  async function press(key, code) {
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      code: key,
      windowsVirtualKeyCode: code,
    })
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      code: key,
      windowsVirtualKeyCode: code,
    })
  }
  async function go(name) {
    await evaluate(
      `document.getElementById('${name}').scrollIntoView({behavior:'instant',block:'start'})`
    )
    await sleep(200)
  }
  async function stopped(message) {
    await sleep(350)
    const value = await evaluate("window.__draws")
    await sleep(500)
    assert.equal(await evaluate("window.__draws"), value, message)
  }
  await send("Page.enable")
  await send("Page.bringToFront")
  await send("Emulation.setFocusEmulationEnabled", { enabled: true })
  await send("Runtime.enable")
  await send("Network.enable")
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__draws=0; Object.defineProperty(navigator.connection,'saveData',{configurable:true,get:()=>Boolean(window.__saveData)}); for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext]){if(!C)continue;for(const m of ['drawElements','drawArrays']){const original=C.prototype[m];C.prototype[m]=function(...args){window.__draws++;return original.apply(this,args)}}}`,
  })
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  })
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send("Page.navigate", { url: base })
  await wait(
    "document.querySelectorAll('[data-screen]').length === 9 && document.querySelector('header button[aria-pressed]') !== null"
  )
  await evaluate("document.fonts.ready")
  await sleep(600)
  assert.equal(
    await evaluate(
      "document.querySelectorAll('[data-live-renderer] canvas').length"
    ),
    0
  )
  const ids = await evaluate(
    "Array.from(document.querySelectorAll('[data-screen]')).map(e=>e.id)"
  )
  for (const locale of ["es", "en"]) {
    await evaluate(
      `document.querySelector('button[value="${locale}"]').click()`
    )
    await wait(
      `document.documentElement.lang === '${locale}' && !document.querySelector('button[value="${locale}"]').disabled`
    )
    for (const [width, height] of [
      [320, 740],
      [390, 844],
      [768, 1024],
      [1024, 768],
      [1440, 900],
      [1920, 1080],
      [844, 390],
    ]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      })
      await sleep(180)
      const measured = await evaluate(
        `({overflow:document.documentElement.scrollWidth>innerWidth,heights:Array.from(document.querySelectorAll('[data-screen]')).map(e=>({id:e.id,h:e.getBoundingClientRect().height})),headerOverflow:document.querySelector('[data-portfolio-header]').scrollWidth>innerWidth})`
      )
      assert.equal(measured.overflow, false, `${locale} ${width} page overflow`)
      assert.equal(
        measured.headerOverflow,
        false,
        `${locale} ${width} header overflow`
      )
      measured.heights.forEach((section) =>
        assert.ok(
          Math.abs(section.h - height) <= 1,
          `${locale} ${width} ${section.id}: ${section.h}`
        )
      )
      console.log(
        `Fullscreen ${locale} ${width}x${height}: nine screens, no page overflow`
      )
    }
  }
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await evaluate("document.querySelector('button[value=es]').click()")
  await wait("document.documentElement.lang==='es'")
  for (const name of ids) {
    await go(name)
    await sleep(150)
    await screenshot(`${name}-mobile`)
  }
  await go("proyectos")
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('#proyectos [aria-label=\"Proyectos recientes\"]')).flexDirection"
    ),
    "row"
  )
  for (let index = 0; index < 4; index++) {
    await evaluate(
      `document.querySelectorAll('#proyectos [aria-label="Proyectos recientes"]>a')[${index}].focus()`
    )
    await wait(
      `document.querySelector('#proyectos h3').textContent === ${JSON.stringify(profile.hero_proyectos_recientes[index].nombre)}`
    )
  }
  await go("stack")
  for (let index = 0; index < 4; index++) {
    await evaluate(
      `document.querySelectorAll('#stack [role=tab]')[${index}].click()`
    )
    await wait(
      `document.querySelector('#stack [role=tabpanel] h3').textContent === ${JSON.stringify(profile.stack_categorias[index].nombre)}`
    )
  }
  await go("experiencia")
  for (let index = 0; index < 4; index++) {
    await evaluate(
      `document.querySelector('#experiencia button[aria-label="Ver experiencia ${index + 1}"]').click()`
    )
    await wait(
      `document.querySelector('#experiencia [data-active-index]').dataset.activeIndex === '${index}'`
    )
    assert.equal(
      await evaluate(
        "document.querySelectorAll('#experiencia [aria-roledescription=slide]:not([inert])').length"
      ),
      1
    )
  }
  await go("catalogo")
  for (let index = 0; index < 9; index++) {
    await evaluate(
      `document.querySelector('#catalogo button[aria-label="Ver proyecto ${index + 1}"]').click()`
    )
    await wait(
      `document.querySelector('#catalogo h3').textContent === ${JSON.stringify(profile.proyectos_destacados[index].nombre)}`
    )
  }
  assert.equal(
    await evaluate(
      "document.querySelector('#catalogo [aria-roledescription=carousel]').dispatchEvent(new WheelEvent('wheel',{deltaY:100,bubbles:true,cancelable:true}))"
    ),
    true,
    "Vertical wheel intercepted by Depth Carousel"
  )
  await go("servicios")
  for (let index = 0; index < 3; index++) {
    await evaluate(
      `document.querySelector('#servicios button[aria-label=${JSON.stringify(profile.servicios.items[index].titulo)}]').click()`
    )
    await wait(
      `document.querySelector('#servicios h3').textContent === ${JSON.stringify(profile.servicios.items[index].titulo)}`
    )
  }
  await go("acerca")
  await evaluate("document.querySelectorAll('#acerca [role=tab]')[2].click()")
  await wait("!!document.querySelector('#acerca a[href*=platzi]')")
  await go("actividad")
  await wait("!!document.querySelector('#actividad table')")
  assert.equal(
    await evaluate(
      "document.querySelectorAll('#actividad table button[tabindex=\"0\"]').length"
    ),
    1
  )
  console.log(
    "All 4 recent projects, 4 categories, 4 experiences, 9 catalog items and 3 services reachable"
  )
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  for (const name of ids) {
    await go(name)
    await sleep(150)
    await screenshot(`${name}-desktop`)
  }
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  })
  for (const name of backgrounds) {
    await go(name)
    await wait(
      `!!document.querySelector('[data-live-renderer="${name}"] canvas')`
    )
    await sleep(300)
    assert.equal(
      await evaluate(
        "document.querySelectorAll('[data-live-renderer] canvas').length"
      ),
      1,
      `Active renderer: ${name}`
    )
    console.log(`Renderer ${name}: one active canvas`)
  }
  await evaluate(
    "document.querySelector('header button[aria-label=\"Pausar fondos\"]').click()"
  )
  await stopped("Pause did not stop GPU work")
  await go("proyectos")
  await stopped("Scrolling reset manual pause")
  await evaluate("document.querySelector('button[value=en]').click()")
  await wait("document.documentElement.lang==='en'")
  await stopped("Locale reset manual pause")
  await evaluate(
    "document.querySelector('header button[aria-label=\"Animate backgrounds\"]').click()"
  )
  await wait(
    "document.querySelectorAll('[data-live-renderer] canvas').length===1"
  )
  await evaluate(
    "window.__saveData=true;navigator.connection.dispatchEvent(new Event('change'))"
  )
  await stopped("Data saver did not stop GPU work")
  await evaluate(
    "window.__saveData=false;navigator.connection.dispatchEvent(new Event('change'))"
  )
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  })
  await stopped("Reduced motion did not stop GPU work")
  console.log(
    "Eight real renderers checked; at most one canvas; global pause, locale and preferences preserve GPU budget"
  )
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await evaluate(
    "document.querySelector('summary').click();document.querySelector('summary').focus()"
  )
  assert.equal(
    await evaluate("document.querySelectorAll('details nav a').length"),
    9
  )
  await press("Escape", 27)
  assert.equal(await evaluate("document.querySelector('details').open"), false)
  await evaluate(
    "document.querySelector('header button[aria-haspopup=dialog]').click()"
  )
  await wait("document.querySelector('dialog').open")
  await sleep(3500)
  await evaluate("document.querySelector('dialog button').focus()")
  await press("Escape", 27)
  await wait("!document.querySelector('dialog').open")
  assert.equal(
    await evaluate("document.activeElement.getAttribute('aria-haspopup')"),
    "dialog"
  )
  await send("Emulation.setScriptExecutionDisabled", { value: true })
  await send("Page.navigate", { url: base })
  await sleep(1300)
  assert.equal(
    await evaluate(
      "document.querySelectorAll('[data-live-renderer] canvas').length"
    ),
    0
  )
  assert.equal(
    await evaluate(
      "document.querySelectorAll('#proyectos .no-script-content article').length"
    ),
    4
  )
  assert.equal(
    await evaluate(
      "document.querySelectorAll('#catalogo .no-script-content article').length"
    ),
    9
  )
  await evaluate("document.querySelector('button[value=es]').click()")
  await wait("document.documentElement?.lang==='es'")
  assert.equal(
    requests.some((url) =>
      /spotify|scdn|hero-video\.|face-api|tiny_face_detector|face_landmark|weights_manifest/i.test(
        url
      )
    ),
    false
  )
  assert.deepEqual(errors, [])
  results.push({
    check: "fullscreen-interactions",
    passed: true,
    browser: "Headless Chromium / SwiftShader",
    screens: 9,
    backgrounds: 8,
    locales: ["es", "en"],
    artifacts: "/tmp/opencode/fullscreen-*.png",
    physicalDevicesTested: false,
  })
  await writeFile(
    "/tmp/opencode/fullscreen-verification.json",
    JSON.stringify(results, null, 2)
  )
  console.log(
    "PASS: fullscreen, horizontal controls, content, global pause, no-JS, CV and booking; no Spotify or face-model requests"
  )
} finally {
  socket?.close()
  chrome.kill("SIGTERM")
  server.kill("SIGTERM")
  await sleep(200)
  await rm(directory, { recursive: true, force: true })
}
