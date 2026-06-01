import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "#059669",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          fontWeight: 700,
          fontSize: 90,
          color: "white",
        }}
      >
        S
      </div>
    ),
    { ...size },
  )
}
