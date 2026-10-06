export const CAL_NAMESPACE = "30-min-meeting"
export const BOOKING_URL = "https://cal.com/sbarker/30-min-meeting"

const CAL_SCRIPT_URL = "https://app.cal.com/embed/embed.js"

export type CalQueue = ((...args: unknown[]) => void) & { q: unknown[][] }
type CalGlobal = CalQueue & {
  ns: Record<string, CalQueue>
  config?: { forwardQueryParams?: boolean }
  loaded?: boolean
}

let calScriptPromise: Promise<CalGlobal> | undefined

export function loadCal() {
  if (calScriptPromise) return calScriptPromise

  calScriptPromise = new Promise<CalGlobal>((resolve, reject) => {
    const calWindow = window as Window & { Cal?: CalGlobal }

    // Cal.com's queue bootstrap must exist before its embed script executes.
    if (!calWindow.Cal) {
      const cal: CalGlobal = Object.assign(
        (...args: unknown[]) => {
          if (args[0] === "init" && typeof args[1] === "string") {
            const namespace = args[1]
            const api: CalQueue = Object.assign(
              (...instruction: unknown[]) => {
                api.q.push(instruction)
              },
              { q: [] as unknown[][] }
            )
            cal.ns[namespace] ??= api
            cal.ns[namespace].q.push(args)
            cal.q.push(["initNamespace", namespace])
            return
          }
          cal.q.push(args)
        },
        { q: [] as unknown[][], ns: {}, loaded: true }
      )
      calWindow.Cal = cal
    }

    const cal = calWindow.Cal
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${CAL_SCRIPT_URL}"]`
    )
    if (existingScript && customElements.get("cal-inline")) {
      resolve(cal)
      return
    }

    const script = existingScript ?? document.createElement("script")
    const cleanup = () => {
      script.removeEventListener("load", onLoad)
      script.removeEventListener("error", onError)
    }
    const onLoad = () => {
      cleanup()
      resolve(cal)
    }
    const onError = () => {
      cleanup()
      script.remove()
      calScriptPromise = undefined
      reject(new Error("Cal embed script failed to load"))
    }
    script.addEventListener("load", onLoad)
    script.addEventListener("error", onError)
    if (!existingScript) {
      script.src = CAL_SCRIPT_URL
      script.async = true
      document.head.appendChild(script)
    }
  })

  return calScriptPromise
}
