"use client"

import {
  ArrowUpRight,
  CheckCircle,
  CircleNotch,
  WarningCircle,
  X,
} from "@phosphor-icons/react"
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { Button } from "@/components/ui/button"
import {
  BOOKING_URL,
  CAL_NAMESPACE,
  loadCal,
  type CalQueue,
} from "@/lib/cal-embed"
import { cn } from "@/lib/utils"

const copy = {
  en: {
    title: "Book a 30-minute meeting",
    close: "Close booking dialog",
    loading: "Loading available meeting times...",
    ready: "The booking calendar is ready.",
    failed:
      "The booking calendar could not load. You can book directly on Cal.com.",
    timeout:
      "The calendar is taking longer than expected. You can book directly on Cal.com.",
    fallback: "Book on Cal.com",
    newTab: "opens in a new tab",
  },
  es: {
    title: "Reserva una reuni\u00f3n de 30 minutos",
    close: "Cerrar ventana de reservas",
    loading: "Cargando horarios disponibles...",
    ready: "El calendario de reservas est\u00e1 listo.",
    failed:
      "No se pudo cargar el calendario. Puedes reservar directamente en Cal.com.",
    timeout:
      "El calendario est\u00e1 tardando m\u00e1s de lo esperado. Puedes reservar directamente en Cal.com.",
    fallback: "Reservar en Cal.com",
    newTab: "se abre en una pesta\u00f1a nueva",
  },
}

const BookingContext = createContext<{
  dialogId: string
  open: (trigger: HTMLButtonElement) => void
} | null>(null)

export function BookingProvider({
  children,
  locale,
}: {
  children: ReactNode
  locale: "es" | "en"
}) {
  const dialogId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<number | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [status, setStatus] = useState<
    "loading" | "ready" | "failed" | "timeout"
  >("loading")
  const text = copy[locale]

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"

    return () => {
      window.clearTimeout(closeTimerRef.current)
      root.style.overflow = previousOverflow
      if (dialog?.open) dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const stopClosingMotion = () => {
      if (media.matches && closeTimerRef.current !== undefined) {
        dialogRef.current?.close()
      }
    }
    media.addEventListener("change", stopClosingMotion)
    return () => media.removeEventListener("change", stopClosingMotion)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!hasOpened || !container) return

    let active = true
    let api: CalQueue | undefined
    const updateStatus = (next: "ready" | "failed" | "timeout") => {
      if (!active) return
      window.clearTimeout(timeout)
      setStatus(next)
    }
    const onReady = () => updateStatus("ready")
    const onFailed = () => updateStatus("failed")
    // A timeout is not readiness; late linkReady events can still recover.
    const timeout = window.setTimeout(() => updateStatus("timeout"), 20_000)

    void loadCal()
      .then((cal) => {
        if (!active || !container.isConnected) return

        cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" })
        // Explicitly requested: page query parameters are forwarded to Cal.
        cal.config = { ...cal.config, forwardQueryParams: true }
        api = cal.ns[CAL_NAMESPACE]
        api("on", { action: "linkReady", callback: onReady })
        api("on", { action: "linkFailed", callback: onFailed })
        api("inline", {
          elementOrSelector: container,
          config: {
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
            theme: "dark",
          },
          calLink: "sbarker/30-min-meeting",
        })
        api("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
        })
      })
      .catch(onFailed)

    // Closing only hides the native dialog. Teardown happens on provider unmount.
    return () => {
      active = false
      window.clearTimeout(timeout)
      api?.("off", { action: "linkReady", callback: onReady })
      api?.("off", { action: "linkFailed", callback: onFailed })
      container.replaceChildren()
    }
  }, [hasOpened])

  useEffect(() => {
    const iframe = containerRef.current?.querySelector("iframe")
    if (iframe) iframe.title = text.title
  }, [status, text.title])

  function open(trigger: HTMLButtonElement) {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    triggerRef.current = trigger
    dialog.showModal()
    setIsOpen(true)
    setHasOpened(true)
  }

  function close() {
    const dialog = dialogRef.current
    if (!dialog?.open || closeTimerRef.current !== undefined) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close()
      return
    }
    setIsClosing(true)
    // Keep the native modal/focus trap until the exit animation finishes.
    closeTimerRef.current = window.setTimeout(() => dialog.close(), 220)
  }

  return (
    <BookingContext value={{ dialogId, open }}>
      {children}
      <dialog
        ref={dialogRef}
        id={dialogId}
        lang={locale}
        aria-labelledby={`${dialogId}-title`}
        data-closing={isClosing || undefined}
        className="booking-dialog fixed inset-0 m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-6xl overflow-hidden rounded-xl border border-border bg-popover p-0 font-sans text-popover-foreground scheme-dark backdrop:bg-background/85 motion-reduce:animate-none"
        onCancel={(event) => {
          event.preventDefault()
          close()
        }}
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.animationName === "booking-dialog-out"
          ) {
            event.currentTarget.close()
          }
        }}
        onClose={() => {
          // Ignore an old close event if another trigger already reopened it.
          if (dialogRef.current?.open) return
          window.clearTimeout(closeTimerRef.current)
          closeTimerRef.current = undefined
          setIsClosing(false)
          setIsOpen(false)
          if (triggerRef.current?.isConnected) {
            triggerRef.current.focus({ preventScroll: true })
          }
        }}
      >
        <div className="flex max-h-[calc(100dvh-1rem)] flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-4 sm:px-6 sm:py-5">
            <h2
              id={`${dialogId}-title`}
              className="self-center text-xl leading-tight font-bold tracking-tight text-balance sm:text-2xl"
            >
              {text.title}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              autoFocus
              aria-label={text.close}
              className="size-11 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover motion-reduce:transition-none"
              onClick={close}
            >
              <X aria-hidden="true" />
            </Button>
          </header>
          <div className="min-h-0 overflow-y-auto overscroll-contain bg-background">
            <div className="relative overflow-hidden">
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={cn(
                  "flex min-h-20 items-center gap-3 border-b border-border px-4 py-4 text-sm leading-relaxed text-pretty text-muted-foreground sm:px-6",
                  status === "failed" && "text-destructive"
                )}
              >
                {status === "loading" ? (
                  <CircleNotch
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary motion-safe:animate-spin"
                  />
                ) : status === "ready" ? (
                  <CheckCircle
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary"
                  />
                ) : (
                  <WarningCircle
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  />
                )}
                <p>{text[status]}</p>
              </div>
              <div
                ref={containerRef}
                id="my-cal-inline-30-min-meeting"
                className={cn(
                  "min-h-[420px] w-full scheme-dark",
                  (status === "failed" || status === "timeout") &&
                    "invisible absolute inset-x-0 top-0"
                )}
              />
            </div>
          </div>
          <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-4 py-3 sm:px-6">
            <span className="text-sm text-muted-foreground">Cal.com</span>
            <Button
              asChild
              variant="outline"
              className="min-h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover motion-reduce:transition-none"
            >
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                {text.fallback}
                <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
                <span className="sr-only"> ({text.newTab})</span>
              </a>
            </Button>
          </footer>
        </div>
      </dialog>
    </BookingContext>
  )
}

export function BookingButton({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const booking = useContext(BookingContext)
  if (!booking) throw new Error("BookingButton must be inside BookingProvider")

  return (
    <Button
      type="button"
      aria-haspopup="dialog"
      aria-controls={booking.dialogId}
      className={cn(
        "min-h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none",
        className
      )}
      onClick={(event) => booking.open(event.currentTarget)}
    >
      {children}
    </Button>
  )
}
