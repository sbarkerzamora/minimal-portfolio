import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#09090b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.04em",
            marginBottom: 16,
          }}
        >
          Stephan Barker
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#059669",
            letterSpacing: "0.14em",
          }}
        >
          DESARROLLADOR FULL STACK & ASESOR DIGITAL
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            color: "#a1a1aa",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Next.js · Supabase · React Native · SaaS · APIs
        </div>
      </div>
    ),
    { ...size },
  )
}
