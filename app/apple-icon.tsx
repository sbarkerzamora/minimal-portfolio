import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "#0c0e10",
        display: "flex",
      }}
    >
      <svg width="180" height="180" viewBox="0 0 32 32" fill="none">
        <path
          d="M26 6H10L6 10V14L10 18H20V22H6V26H22L26 22V18L22 14H12V10H26Z"
          fill="#f5f2eb"
        />
        <path d="M20 6H26V10H20Z" fill="#eeb65b" />
        <path
          d="M25 2H25.5V2.5H25ZM27 2H27.5V2.5H27ZM29 2H29.5V2.5H29ZM27 4H27.5V4.5H27ZM29 4H29.5V4.5H29ZM29 6H29.5V6.5H29Z"
          fill="#eeb65b"
          opacity="0.22"
        />
      </svg>
    </div>,
    { ...size }
  )
}
