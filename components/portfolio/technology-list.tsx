import { LogoIcon } from "@/components/portfolio/tech-icon"

export function TechnologyList({
  technologies,
  label,
}: {
  technologies: readonly string[]
  label: string
}) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-x-7 gap-y-5">
      {technologies.map((technology) => (
        <li
          key={technology}
          className="flex items-center gap-2.5 text-sm text-muted-foreground"
        >
          <span aria-hidden="true" className="inline-flex">
            <LogoIcon name={technology} className="size-4 shrink-0" />
          </span>
          {technology}
        </li>
      ))}
    </ul>
  )
}
