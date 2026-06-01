import type { ComponentType, SVGProps } from "react"

import {
  Cloudflare,
  CursorDark,
  CursorLight,
  Docker,
  Expo,
  GitHubDark,
  GitHubLight,
  JavaScript,
  Laravel,
  Linux,
  Nextjs,
  Nginx,
  Nodejs,
  OpenAIDark,
  OpenAILight,
  OpenCodeDark,
  OpenCodeLight,
  PayPal,
  ReactDark,
  ReactLight,
  Redis,
  Stripe,
  Supabase,
  TypeScript,
  VercelDark,
  VercelLight,
  VisualStudioCode,
  Vite,
  WordPress,
} from "@ridemountainpig/svgl-react"

type LogoDef =
  | { type: "single"; component: ComponentType<SVGProps<SVGSVGElement>> }
  | { type: "theme"; light: ComponentType<SVGProps<SVGSVGElement>>; dark: ComponentType<SVGProps<SVGSVGElement>> }

const logoMap: Record<string, LogoDef> = {
  "Next.js": { type: "single", component: Nextjs },
  React: { type: "theme", light: ReactLight, dark: ReactDark },
  TypeScript: { type: "single", component: TypeScript },
  JavaScript: { type: "single", component: JavaScript },
  "React Native": { type: "single", component: Expo },
  Supabase: { type: "single", component: Supabase },
  "Node.js": { type: "single", component: Nodejs },
  Docker: { type: "single", component: Docker },
  Linux: { type: "single", component: Linux },
  GitHub: { type: "theme", light: GitHubLight, dark: GitHubDark },
  Stripe: { type: "single", component: Stripe },
  PayPal: { type: "single", component: PayPal },
  WordPress: { type: "single", component: WordPress },
  Vercel: { type: "theme", light: VercelLight, dark: VercelDark },
  Redis: { type: "single", component: Redis },
  Nginx: { type: "single", component: Nginx },
  Vite: { type: "single", component: Vite },
  Cursor: { type: "theme", light: CursorLight, dark: CursorDark },
  Opencode: { type: "theme", light: OpenCodeLight, dark: OpenCodeDark },
  "VS Code": { type: "single", component: VisualStudioCode },
  Expo: { type: "single", component: Expo },
  Laravel: { type: "single", component: Laravel },
  Cloudflare: { type: "single", component: Cloudflare },
  OpenAI: { type: "theme", light: OpenAILight, dark: OpenAIDark },
}

function LogoIcon({ name, className }: { name: string; className?: string }) {
  const def = logoMap[name]
  if (!def) return null
  if (def.type === "theme") {
    return (
      <>
        <def.light className={`block dark:hidden ${className ?? ""}`} />
        <def.dark className={`hidden dark:block ${className ?? ""}`} />
      </>
    )
  }
  return <def.component className={className} />
}

export { logoMap, LogoIcon }
export type { LogoDef }
