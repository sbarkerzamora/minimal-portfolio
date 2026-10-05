import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr"

import { LazyContributionGraph } from "@/components/portfolio/lazy-contribution-graph"
import { PreviewExternalLink } from "@/components/portfolio/preview-external-link"
import {
  getGitHubContributions,
  GITHUB_USERNAME,
} from "@/lib/github-contributions"
import { portfolioProfile } from "@/lib/profile"

async function GitHubActivity({
  locale = "es",
  compact = false,
}: {
  locale?: "es" | "en"
  compact?: boolean
}) {
  const contributions = await getGitHubContributions(GITHUB_USERNAME)
  const formatter = new Intl.NumberFormat(locale === "es" ? "es-NI" : "en-US")
  const isDemo = contributions.source !== "github"

  return (
    <section
      aria-label={
        locale === "es"
          ? `Actividad de GitHub de ${GITHUB_USERNAME}`
          : `GitHub activity for ${GITHUB_USERNAME}`
      }
      className={
        compact
          ? "w-full min-w-0 font-sans text-muted-foreground"
          : "ascii-frame relative w-full min-w-0 border-y border-border bg-card p-4 font-sans text-card-foreground sm:p-6 lg:p-8"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {compact ? (
          <PreviewExternalLink
            href={`https://github.com/${GITHUB_USERNAME}`}
            preview={portfolioProfile.professional.enlaces.github_preview}
            label={`GitHub @${GITHUB_USERNAME}`}
            locale={locale}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            @{GITHUB_USERNAME}
            <span className="sr-only">
              {locale === "es"
                ? " (GitHub, se abre en una pesta\u00f1a nueva)"
                : " (GitHub, opens in a new tab)"}
            </span>
          </PreviewExternalLink>
        ) : (
          <PreviewExternalLink
            href={`https://github.com/${GITHUB_USERNAME}`}
            preview={portfolioProfile.professional.enlaces.github_preview}
            label={`GitHub @${GITHUB_USERNAME}`}
            locale={locale}
            className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-lg text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
          >
            <GithubLogo aria-hidden="true" weight="fill" className="size-4" />
            <span className="min-w-0 break-all whitespace-normal">
              @{GITHUB_USERNAME}
            </span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only">
              {locale === "es"
                ? " (GitHub, se abre en una pesta\u00f1a nueva)"
                : " (GitHub, opens in a new tab)"}
            </span>
          </PreviewExternalLink>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground tabular-nums">
            {formatter.format(contributions.total)}
          </span>{" "}
          {isDemo
            ? locale === "es"
              ? "contribuciones simuladas"
              : "simulated contributions"
            : locale === "es"
              ? "contribuciones"
              : "contributions"}
          <span className="ml-2 font-mono text-xs">/ {contributions.year}</span>
        </p>
      </div>
      <p
        className={
          compact
            ? "mb-2 text-xs leading-relaxed text-pretty text-muted-foreground"
            : "mt-2 mb-6 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground"
        }
      >
        {isDemo
          ? locale === "es"
            ? "Demostraci\u00f3n con datos sint\u00e9ticos. No representa actividad verificada de GitHub."
            : "Demonstration with synthetic data. This is not verified GitHub activity."
          : locale === "es"
            ? "Fuente: contribuciones publicadas por GitHub."
            : "Source: contributions published by GitHub."}
      </p>
      <LazyContributionGraph
        className="w-full"
        data={contributions.data}
        locale={locale}
        showLegend
        showTooltips
        compact={compact}
        year={contributions.year}
      />
    </section>
  )
}

export { GitHubActivity }
