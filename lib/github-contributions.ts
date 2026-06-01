import type { ContributionData } from "@/components/smoothui/contribution-graph"
import { portfolioProfile } from "@/lib/profile"

function getGitHubUsername(url: string) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean)[0] ?? "sbarkerzamora"
  } catch {
    return "sbarkerzamora"
  }
}

const GITHUB_USERNAME = getGitHubUsername(portfolioProfile.professional.enlaces.github)

type GitHubContributions = {
  data: ContributionData[]
  source: "github" | "fallback"
  total: number
  year: number
}

function extractAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`${attribute}="([^"]*)"`))
  return match?.[1]
}

function fallbackContributionCount(dayOfYear: number, seed: number) {
  const wave = Math.sin((dayOfYear + seed) * 0.41) + Math.cos((dayOfYear + seed) * 0.17)
  const active = (dayOfYear * 37 + seed * 11) % 10

  if (active < 6) {
    return 0
  }

  return Math.max(1, Math.round(Math.abs(wave) * 8 + (active - 5) * 2))
}

function generateFallbackData(year: number): ContributionData[] {
  const data: ContributionData[] = []
  const startDate = new Date(Date.UTC(year, 0, 1))
  const endDate = new Date(Date.UTC(year, 11, 31))
  const seed = GITHUB_USERNAME.split("").reduce((total, char) => total + char.charCodeAt(0), 0)
  let dayOfYear = 0

  for (let date = new Date(startDate); date <= endDate; date.setUTCDate(date.getUTCDate() + 1)) {
    dayOfYear += 1
    const count = fallbackContributionCount(dayOfYear, seed)
    const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / 4))

    data.push({
      date: date.toISOString().split("T")[0],
      count,
      level,
    })
  }

  return data
}

function parseGitHubContributions(html: string): ContributionData[] {
  const cells = html.match(/<(?:rect|td)[^>]*data-date="[^"]+"[^>]*>/g) ?? []

  return cells
    .map((cell) => {
      const date = extractAttribute(cell, "data-date")
      const id = extractAttribute(cell, "id")
      const inlineCount = extractAttribute(cell, "data-count")
      const tooltipMatch = id
        ? html.match(new RegExp(`<tool-tip[^>]*for="${id}"[^>]*>([^<]*)</tool-tip>`))
        : null
      const tooltipCount = tooltipMatch?.[1]?.match(/^(\d+)/)?.[1]
      const count = Number(inlineCount ?? tooltipCount ?? 0)
      const level = Number(extractAttribute(cell, "data-level") ?? 0)

      if (!date) {
        return null
      }

      return {
        date,
        count: Number.isFinite(count) ? count : 0,
        level: Number.isFinite(level) ? Math.max(0, Math.min(4, level)) : 0,
      } satisfies ContributionData
    })
    .filter((entry): entry is ContributionData => entry !== null)
}

function getTotal(data: ContributionData[]) {
  return data.reduce((total, day) => total + day.count, 0)
}

export async function getGitHubContributions(
  username = GITHUB_USERNAME,
  year = new Date().getFullYear()
): Promise<GitHubContributions> {
  const fallbackData = generateFallbackData(year)
  const url = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "text/html",
        "User-Agent": "minimal-portfolio",
      },
      next: {
        revalidate: 60 * 60 * 12,
      },
    })

    if (!response.ok) {
      return { data: fallbackData, source: "fallback", total: getTotal(fallbackData), year }
    }

    const data = parseGitHubContributions(await response.text()).filter((entry) =>
      entry.date.startsWith(`${year}-`)
    )

    if (data.length === 0) {
      return { data: fallbackData, source: "fallback", total: getTotal(fallbackData), year }
    }

    return { data, source: "github", total: getTotal(data), year }
  } catch {
    return { data: fallbackData, source: "fallback", total: getTotal(fallbackData), year }
  }
}

export { GITHUB_USERNAME }
