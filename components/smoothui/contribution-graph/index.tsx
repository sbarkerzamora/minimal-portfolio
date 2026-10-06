"use client"

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react"

import { DecryptReveal } from "@/components/canvasui/DecryptReveal"
import { cn } from "@/lib/utils"

export interface ContributionData {
  count: number
  date: string
  level: number
}

export interface ContributionGraphProps {
  className?: string
  data?: ContributionData[]
  locale?: "es" | "en"
  showLegend?: boolean
  showTooltips?: boolean
  compact?: boolean
  year?: number
}

const EMPTY_DATA: ContributionData[] = []
const DAY_MS = 86_400_000
const MOBILE_QUERY = "(max-width: 639px)"
const DAYS = {
  es: ["Dom", "Lun", "Mar", "Mi\u00e9", "Jue", "Vie", "S\u00e1b"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
}

// Chart tokens run from the brightest amber (1) to the quietest level (5).
const LEVEL_COLORS = [
  "bg-chart-5",
  "bg-chart-4",
  "bg-chart-3",
  "bg-chart-2",
  "bg-chart-1",
]

function subscribeToViewport(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_QUERY).matches
}

function serverViewport() {
  return false
}

export function ContributionGraph({
  data = EMPTY_DATA,
  locale = "es",
  year = new Date().getFullYear(),
  className,
  showLegend = true,
  showTooltips = true,
  compact = false,
}: ContributionGraphProps) {
  const id = useId()
  const isMobile = useSyncExternalStore(
    subscribeToViewport,
    isMobileViewport,
    serverViewport
  )
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const cellsRef = useRef<(HTMLButtonElement | null)[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [previewDate, setPreviewDate] = useState("")

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setIsDarkTheme(root.classList.contains("dark"))
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  const language = locale === "es" ? "es-NI" : "en-US"
  const dateFormatter = new Intl.DateTimeFormat(language, {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const monthFormatter = new Intl.DateTimeFormat(language, {
    timeZone: "UTC",
    month: "short",
  })
  const numberFormatter = new Intl.NumberFormat(language)

  const calendar = useMemo(() => {
    const start = Date.UTC(year, 0, 1)
    const offset = new Date(start).getUTCDay()
    const dayCount = (Date.UTC(year + 1, 0, 1) - start) / DAY_MS
    const byDate = new Map(data.map((day) => [day.date, day]))
    const days = Array.from({ length: dayCount }, (_, index) => {
      const date = new Date(start + index * DAY_MS).toISOString().slice(0, 10)
      const entry = byDate.get(date)
      return {
        date,
        count: entry ? Math.max(0, entry.count) : null,
        level: entry ? Math.max(0, Math.min(4, Math.round(entry.level))) : 0,
      }
    })
    // Some leap years need 54 columns. UTC avoids shifting dates by visitor timezone.
    const weekCount = Math.ceil((dayCount + offset) / 7)
    const months: { date: Date; startWeek: number; span: number }[] = []
    for (let week = 0; week < weekCount; week++) {
      const date = new Date(start + Math.max(0, week * 7 - offset) * DAY_MS)
      const previous = months.at(-1)
      if (previous?.date.getUTCMonth() === date.getUTCMonth()) {
        previous.span++
      } else {
        months.push({ date, startWeek: week, span: 1 })
      }
    }
    return { days, months, offset, weekCount }
  }, [data, year])

  const selectedIndex = Math.max(
    0,
    calendar.days.findIndex((day) => day.date === selectedDate)
  )
  const selectedDay = calendar.days[selectedIndex]
  const detailDay =
    (showTooltips && calendar.days.find((day) => day.date === previewDate)) ||
    selectedDay
  const title =
    locale === "es" ? `Contribuciones de ${year}` : `Contributions for ${year}`

  function countText(count: number | null) {
    if (count === null)
      return locale === "es"
        ? "Sin datos para esta fecha"
        : "No data for this date"
    if (count === 0)
      return locale === "es" ? "Sin contribuciones" : "No contributions"
    if (count === 1)
      return locale === "es" ? "1 contribuci\u00f3n" : "1 contribution"
    return `${numberFormatter.format(count)} ${locale === "es" ? "contribuciones" : "contributions"}`
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.altKey || event.metaKey) return
    let next = index
    const weekStart =
      Math.floor((index + calendar.offset) / 7) * 7 - calendar.offset
    switch (event.key) {
      case "ArrowLeft":
        next -= 7
        break
      case "ArrowRight":
        next += 7
        break
      case "ArrowUp":
        next -= 1
        break
      case "ArrowDown":
        next += 1
        break
      case "Home":
        next = event.ctrlKey ? 0 : weekStart
        break
      case "End":
        next = event.ctrlKey ? calendar.days.length - 1 : weekStart + 6
        break
      default:
        return
    }
    event.preventDefault()
    next = Math.max(0, Math.min(calendar.days.length - 1, next))
    cellsRef.current[next]?.focus({ preventScroll: true })
    cellsRef.current[next]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "instant",
    })
  }

  if (!calendar.days.some((day) => day.count !== null)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-6 text-sm text-muted-foreground",
          compact ? "min-h-24" : "min-h-[28rem] sm:min-h-96",
          className
        )}
      >
        <p role="status">
          {locale === "es"
            ? "No hay datos disponibles para este a\u00f1o."
            : "No data is available for this year."}
        </p>
      </div>
    )
  }

  return (
    <div
      lang={locale}
      className={cn(
        "flex min-w-0 flex-col gap-4 font-sans",
        compact ? "gap-2" : "min-h-[28rem] sm:min-h-96",
        className
      )}
    >
      {!compact && (
        <p
          id={`${id}-help`}
          className="text-sm leading-5 text-muted-foreground"
        >
          {locale === "es"
            ? "Desplaza para ver el a\u00f1o. Usa las flechas o consulta una fecha."
            : "Scroll to see the year. Use arrow keys or look up a date."}
        </p>
      )}
      <DecryptReveal
        enabled={!isMobile}
        className={cn("relative w-full", compact ? "h-32" : "min-h-40")}
        radius={compact ? 132 : 240}
        cell={9}
        color={isDarkTheme ? "#efb654" : "#9a6306"}
        background={isDarkTheme ? "#0c0e10" : "#ffffff"}
        scramble={0.08}
        scrambleSpeed={3}
        edgeWidth={0.16}
        edgeFlicker={0.7}
        edgeGlow={1.4}
        edgeTint={0.55}
        aberration={3}
        legibility={0.9}
        passthrough={0.24}
      >
        <div
          role="region"
          aria-label={
            locale === "es"
              ? "Calendario con desplazamiento horizontal"
              : "Horizontally scrollable calendar"
          }
          className="min-w-0 [scrollbar-width:thin] overflow-x-auto overscroll-x-contain pb-2 scheme-light dark:scheme-dark"
        >
          <table
            role="grid"
            aria-label={title}
            aria-describedby={!compact ? `${id}-help` : undefined}
            className={cn(
              "w-full table-fixed border-separate text-xs",
              compact
                ? "min-w-0 border-spacing-0.5"
                : "min-w-[69rem] border-spacing-1"
            )}
          >
            <thead>
              <tr>
                <td className={compact ? "w-6" : "w-10"} />
                {calendar.months.map((month) => (
                  <th
                    key={month.startWeek}
                    scope="colgroup"
                    colSpan={month.span}
                    className={cn(
                      "p-0 text-left font-mono font-normal text-muted-foreground",
                      compact ? "h-4 text-[9px]" : "h-6"
                    )}
                  >
                    {monthFormatter.format(month.date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS[locale].map((label, weekday) => (
                <tr key={weekday}>
                  <th
                    scope="row"
                    className={cn(
                      "p-0 text-left font-mono font-normal text-muted-foreground",
                      compact ? "w-6 text-[8px]" : "w-10"
                    )}
                  >
                    <span className={weekday % 2 === 0 ? undefined : "sr-only"}>
                      {label}
                    </span>
                  </th>
                  {Array.from({ length: calendar.weekCount }, (_, week) => {
                    const index = week * 7 + weekday - calendar.offset
                    const day = calendar.days[index]
                    if (!day)
                      return (
                        <td
                          key={week}
                          className={cn("p-0", compact ? "h-2" : "h-4")}
                        />
                      )
                    return (
                      <td
                        key={week}
                        className={cn("p-0", compact ? "h-2" : "h-4")}
                      >
                        <button
                          ref={(cell) => {
                            cellsRef.current[index] = cell
                          }}
                          type="button"
                          tabIndex={index === selectedIndex ? 0 : -1}
                          aria-label={`${dateFormatter.format(new Date(`${day.date}T00:00:00Z`))}: ${countText(day.count)}`}
                          aria-pressed={index === selectedIndex}
                          className={cn(
                            "block w-full rounded-[3px] outline-offset-2 hover:outline-2 hover:outline-ring focus-visible:outline-2 focus-visible:outline-ring",
                            compact
                              ? "h-2 min-w-0 rounded-[1px]"
                              : "h-4 min-w-4",
                            day.count === null
                              ? "border border-dashed border-input bg-background"
                              : LEVEL_COLORS[day.level],
                            index === selectedIndex &&
                              (compact
                                ? "ring-1 ring-foreground ring-offset-1 ring-offset-background"
                                : "ring-1 ring-foreground ring-offset-1 ring-offset-card")
                          )}
                          onFocus={() => {
                            setSelectedDate(day.date)
                            setPreviewDate("")
                          }}
                          onClick={() => setSelectedDate(day.date)}
                          onKeyDown={(event) => navigate(event, index)}
                          onMouseEnter={() => {
                            if (showTooltips) setPreviewDate(day.date)
                          }}
                          onMouseLeave={() => setPreviewDate("")}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DecryptReveal>
      {showLegend && (
        <div
          className="flex items-center justify-end gap-2 text-xs text-muted-foreground"
          aria-label={
            locale === "es"
              ? "Intensidad de contribuciones, de menor a mayor"
              : "Contribution intensity, from lower to higher"
          }
        >
          <span>{locale === "es" ? "Menos" : "Less"}</span>
          <span className="flex gap-1" aria-hidden="true">
            {LEVEL_COLORS.map((color) => (
              <span key={color} className={cn("size-4 rounded-[3px]", color)} />
            ))}
          </span>
          <span>{locale === "es" ? "M\u00e1s" : "More"}</span>
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
          compact ? "text-xs" : "mt-auto border-t border-border pt-4"
        )}
      >
        {compact ? (
          <div
            role="status"
            aria-atomic="true"
            className="text-xs text-muted-foreground"
          >
            <p className="font-medium text-foreground">
              {countText(detailDay.count)}
            </p>
            <p>
              {dateFormatter.format(new Date(`${detailDay.date}T00:00:00Z`))}
            </p>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 flex-col gap-2">
              <label
                htmlFor={`${id}-date`}
                className="text-sm text-muted-foreground"
              >
                {locale === "es" ? "Consultar fecha" : "Look up a date"}
              </label>
              {/* The full-size date control provides the same details without targeting tiny cells. */}
              <input
                id={`${id}-date`}
                type="date"
                min={calendar.days[0].date}
                max={calendar.days.at(-1)!.date}
                value={selectedDay.date}
                className="min-h-11 min-w-44 rounded-lg border border-input bg-background px-3 font-sans text-sm text-foreground scheme-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:scheme-dark"
                onChange={(event) => {
                  const date = event.currentTarget.value
                  if (!calendar.days.some((day) => day.date === date)) return
                  setSelectedDate(date)
                  setPreviewDate("")
                  const index = calendar.days.findIndex(
                    (day) => day.date === date
                  )
                  cellsRef.current[index]?.scrollIntoView({
                    block: "nearest",
                    inline: "nearest",
                    behavior: "instant",
                  })
                }}
              />
            </div>
            <div
              role="status"
              aria-atomic="true"
              className="flex min-h-12 flex-col gap-1 text-sm sm:text-right"
            >
              <p className="font-medium text-foreground">
                {countText(detailDay.count)}
              </p>
              <p className="text-muted-foreground">
                {dateFormatter.format(new Date(`${detailDay.date}T00:00:00Z`))}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ContributionGraph
