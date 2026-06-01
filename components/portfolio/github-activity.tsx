import { GithubLogo } from "@phosphor-icons/react/dist/ssr"

import { LazyContributionGraph } from "@/components/portfolio/lazy-contribution-graph"
import { getGitHubContributions, GITHUB_USERNAME } from "@/lib/github-contributions"

async function GitHubActivity() {
  const contributions = await getGitHubContributions(GITHUB_USERNAME)
  const formatter = new Intl.NumberFormat("es-NI")

  return (
    <section
      aria-label={`Actividad de GitHub de ${GITHUB_USERNAME}`}
      className="portfolio-contributions w-full rounded-2xl border border-border/70 bg-background/82 p-2 shadow-sm backdrop-blur sm:rounded-3xl sm:p-4"
    >
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2 text-left">
          <GithubLogo className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" weight="bold" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">GitHub activity</p>
            <p className="truncate text-[11px] text-muted-foreground">@{GITHUB_USERNAME}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-foreground">{formatter.format(contributions.total)}</p>
          <p className="text-[10px] text-muted-foreground">
            {contributions.source === "github" ? "contribuciones" : "fallback"}
          </p>
        </div>
      </div>
      <LazyContributionGraph
        className="w-full"
        data={contributions.data}
        showLegend={false}
        showTooltips
        year={contributions.year}
      />
    </section>
  )
}

export { GitHubActivity }
