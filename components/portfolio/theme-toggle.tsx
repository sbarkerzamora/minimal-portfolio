"use client"

import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label="Cambiar tema"
      data-tooltip="Cambiar tema"
      className={cn(
        "icon-tooltip group flex size-11 items-center justify-center rounded-full text-muted-foreground transition-[transform,background-color,color] duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 motion-reduce:transition-none",
        className
      )}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="relative size-4 overflow-hidden">
        <Sun
          weight="bold"
          className="absolute inset-0 size-4 scale-100 rotate-0 opacity-100 transition duration-200 ease-out dark:scale-50 dark:-rotate-90 dark:opacity-0"
        />
        <Moon
          weight="bold"
          className="absolute inset-0 size-4 scale-50 rotate-90 opacity-0 transition duration-200 ease-out dark:scale-100 dark:rotate-0 dark:opacity-100"
        />
      </span>
    </button>
  )
}

export { ThemeToggle }
