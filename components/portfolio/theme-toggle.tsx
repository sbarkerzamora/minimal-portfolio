"use client"

import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      className={cn(
        "group flex size-10 items-center justify-center rounded-2xl border border-border/80 bg-background/85 text-muted-foreground shadow-sm backdrop-blur transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-muted hover:text-foreground hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/45 active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:size-11",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative size-4 overflow-hidden">
        <Sun
          weight="bold"
          className={cn(
            "absolute inset-0 size-4 transition duration-200 ease-out",
            isDark ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        />
        <Moon
          weight="bold"
          className={cn(
            "absolute inset-0 size-4 transition duration-200 ease-out",
            isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
          )}
        />
      </span>
    </button>
  )
}

export { ThemeToggle }
