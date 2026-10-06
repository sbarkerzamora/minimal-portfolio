"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { CalendarBlank } from "@phosphor-icons/react"

import Drawer, { DrawerClose } from "@/components/smoothui/drawer"
import { Button } from "@/components/ui/button"
import {
  BOOKING_URL,
  CAL_NAMESPACE,
  loadCal,
  type CalQueue,
} from "@/lib/cal-embed"
import type { PortfolioProfile } from "@/lib/profile"
import { cn } from "@/lib/utils"

type ContactCopy = PortfolioProfile["homeHero"]["contacto"]
type BookingStatus = "cargando" | "listo" | "fallo" | "espera"

const mobileQuery = "(max-width: 639px)"

function subscribeToWidth(onChange: () => void) {
  const query = window.matchMedia(mobileQuery)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function isMobileWidth() {
  return window.matchMedia(mobileQuery).matches
}

function serverWidth() {
  return false
}

function CalBookingBody({ copy }: { copy: ContactCopy }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<BookingStatus>("cargando")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let active = true
    let api: CalQueue | undefined
    const timeout = window.setTimeout(() => {
      if (active) setStatus("espera")
    }, 20_000)

    const updateStatus = (next: BookingStatus) => {
      if (!active) return
      window.clearTimeout(timeout)
      setStatus(next)
      const iframe = container.querySelector("iframe")
      if (iframe) {
        iframe.title = copy.titulo
        iframe.setAttribute("scrolling", "auto")
      }
    }
    const onReady = () => updateStatus("listo")
    const onFailed = () => updateStatus("fallo")

    void loadCal()
      .then((cal) => {
        if (!active || !container.isConnected) return

        cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" })
        cal.config = { ...cal.config, forwardQueryParams: true }
        api = cal.ns[CAL_NAMESPACE]
        api("on", { action: "linkReady", callback: onReady })
        api("on", { action: "linkFailed", callback: onFailed })

        const theme = document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
        api("inline", {
          elementOrSelector: container,
          config: {
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
            theme,
          },
          calLink: "sbarker/30-min-meeting",
        })
        api("ui", {
          theme,
          hideEventTypeDetails: false,
          layout: "month_view",
        })
      })
      .catch(onFailed)

    return () => {
      active = false
      window.clearTimeout(timeout)
      api?.("off", { action: "linkReady", callback: onReady })
      api?.("off", { action: "linkFailed", callback: onFailed })
      container.replaceChildren()
    }
  }, [copy.titulo])

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          "text-sm leading-relaxed text-muted-foreground",
          status === "fallo" && "text-destructive"
        )}
      >
        {copy[status]}
      </p>
      <div
        ref={containerRef}
        className={cn(
          "contact-cal-container h-[min(58dvh,38rem)] min-h-[320px] w-full overflow-hidden rounded-md bg-background",
          (status === "fallo" || status === "espera") && "hidden"
        )}
      />
    </div>
  )
}

export function ContactDrawer({
  copy,
  locale,
}: {
  copy: ContactCopy
  locale: "es" | "en"
}) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const mobile = useSyncExternalStore(
    subscribeToWidth,
    isMobileWidth,
    serverWidth
  )

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => closeRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      side={mobile ? "bottom" : "right"}
      title={copy.titulo}
      description={copy.descripcion}
      className="text-popover-foreground data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-xl"
      trigger={
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-h-11 rounded-md px-8 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <CalendarBlank aria-hidden="true" data-icon="inline-start" />
          {copy.boton}
        </Button>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DrawerClose asChild>
            <Button
              ref={closeRef}
              type="button"
              variant="ghost"
              className="min-h-11"
            >
              {copy.cerrar}
            </Button>
          </DrawerClose>
          <Button asChild variant="outline" className="min-h-11">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              {copy.directo}
              <span className="sr-only">
                {locale === "es"
                  ? " (se abre en una pestaña nueva)"
                  : " (opens in a new tab)"}
              </span>
            </a>
          </Button>
        </div>
      }
    >
      <CalBookingBody copy={copy} />
    </Drawer>
  )
}
