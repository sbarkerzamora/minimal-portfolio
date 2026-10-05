import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 4,
        background: "#0c0e10",
        display: "flex",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M26 6H10L6 10V14L10 18H20V22H6V26H22L26 22V18L22 14H12V10H26Z"
          fill="#f5f2eb"
        />
        <path d="M20 6H26V10H20Z" fill="#eeb65b" />
      </svg>
    </div>,
    { ...size }
  )
}
