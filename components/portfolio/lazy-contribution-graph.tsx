"use client"

import dynamic from "next/dynamic"

const ContributionGraph = dynamic(
  () => import("@/components/smoothui/contribution-graph"),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-label="Cargando gráfico de contribuciones"
        className="flex h-[122px] items-center justify-center sm:h-[134px]"
      >
        <div className="size-4 animate-pulse rounded-full bg-muted" />
      </div>
    ),
  },
)

function LazyContributionGraph(props: {
  className?: string
  data?: { count: number; date: string; level: number }[]
  showLegend?: boolean
  showTooltips?: boolean
  year?: number
}) {
  return <ContributionGraph {...props} />
}

export { LazyContributionGraph }
