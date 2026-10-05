import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
}

export default nextConfig
