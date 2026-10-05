import { Button } from "@/components/ui/button"
import type { Locale } from "@/lib/portfolio-copy"
import { cn } from "@/lib/utils"

export function LanguageSelector({ locale }: { locale: Locale }) {
  return (
    <nav
      className="flex shrink-0 items-center gap-1 rounded-lg border border-input bg-background p-1 font-sans"
      aria-label={locale === "es" ? "Idioma" : "Language"}
    >
      {(["es", "en"] as const).map((language) => (
        <Button
          key={language}
          asChild
          variant={locale === language ? "secondary" : "ghost"}
          size="icon"
          className={cn(
            "size-11 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none",
            locale === language &&
              "underline decoration-primary decoration-2 underline-offset-4"
          )}
        >
          <a
            href={language === "es" ? "/" : "/en"}
            hrefLang={language}
            lang={language}
            aria-label={language === "es" ? "Español" : "English"}
            aria-current={locale === language ? "page" : undefined}
          >
            {language.toUpperCase()}
          </a>
        </Button>
      ))}
    </nav>
  )
}
