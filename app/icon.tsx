import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

/**
 * App favicon — generated at build time via Next.js ImageResponse.
 * Renders a 32×32 Spotify-green square with a white music bar icon.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1ed760",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        }}
      >
        {/* Simple "S" lettermark */}
        <div
          style={{
            color: "#000000",
            fontSize: "20px",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          S
        </div>
      </div>
    ),
    { ...size }
  )
}
