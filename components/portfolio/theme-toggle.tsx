"use client"

import { useEffect, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

function getDocumentTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getServerTheme() {
  return "light"
}

export function ThemeToggle({ locale }: { locale: "es" | "en" }) {
  const { setTheme } = useTheme()
  const selectedTheme = useSyncExternalStore(
    subscribeToTheme,
    getDocumentTheme,
    getServerTheme
  )

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        selectedTheme === "dark" ? "#0c0e10" : "#ffffff"
      )
  }, [selectedTheme])

  const labels =
    locale === "es"
      ? { group: "Tema", light: "Tema claro", dark: "Tema oscuro" }
      : { group: "Theme", light: "Light theme", dark: "Dark theme" }

  function changeTheme(mode: "light" | "dark") {
    setTheme(mode)
    document.documentElement.classList.toggle("dark", mode === "dark")
    document.documentElement.style.setProperty("color-scheme", mode)
    try {
      localStorage.setItem("theme", mode)
    } catch {
      // The active theme still applies when browser storage is unavailable.
    }
  }

  return (
    <div
      role="group"
      aria-label={labels.group}
      className="flex shrink-0 items-center gap-0.5 rounded-lg border border-input bg-background p-1"
    >
      {(["light", "dark"] as const).map((mode) => {
        const label = mode === "light" ? labels.light : labels.dark
        const active = selectedTheme === mode

        return (
          <Button
            key={mode}
            type="button"
            variant={active ? "secondary" : "ghost"}
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => changeTheme(mode)}
            className={cn(
              "size-11 min-h-11 min-w-11 rounded-md p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            )}
          >
            {mode === "light" ? (
              <Sun aria-hidden="true" weight={active ? "fill" : "regular"} />
            ) : (
              <Moon aria-hidden="true" weight={active ? "fill" : "regular"} />
            )}
          </Button>
        )
      })}
    </div>
  )
}
