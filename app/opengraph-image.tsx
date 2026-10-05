import { ImageResponse } from "next/og"

import profileData from "@/public/profile.json"

const { nombre, titulo_principal, enlaces } = profileData.perfil_profesional

export const alt = `${nombre}, ${titulo_principal}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        color: "#161616",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 86,
          fontWeight: 700,
          letterSpacing: "-0.035em",
        }}
      >
        {nombre}
      </div>
      <div style={{ display: "flex", marginTop: 12, fontSize: 34 }}>
        {titulo_principal}
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 52,
          fontSize: 22,
          color: "#555555",
        }}
      >
        {new URL(enlaces.portfolio).hostname}
      </div>
    </div>,
    size
  )
}
