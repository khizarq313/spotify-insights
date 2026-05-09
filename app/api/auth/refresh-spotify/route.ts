import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * POST /api/auth/refresh-spotify
 *
 * Supabase does NOT auto-refresh the provider (Spotify) access token — it only
 * refreshes its own JWT. When the Spotify token expires (1 hour), the client
 * calls this endpoint with the provider_refresh_token. We exchange it for a
 * fresh access token using Spotify's token endpoint and return it to the client.
 *
 * The new token is NOT stored in Supabase — the client holds it in React state
 * (AuthContext) for the session lifetime.
 *
 * Security: the refresh token comes from the authenticated client and is only
 * usable together with our client_secret which lives server-side only.
 */
export async function POST(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Spotify credentials not configured on server" },
      { status: 500 }
    )
  }

  let refreshToken: string
  try {
    const body = await request.json()
    refreshToken = body?.refresh_token
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!refreshToken || typeof refreshToken !== "string") {
    return NextResponse.json({ error: "Missing refresh_token" }, { status: 400 })
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const spotifyRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!spotifyRes.ok) {
    const err = await spotifyRes.text()
    console.error("[refresh-spotify] Spotify token refresh failed:", err)
    return NextResponse.json(
      { error: "Spotify token refresh failed", detail: err },
      { status: spotifyRes.status }
    )
  }

  const data = await spotifyRes.json()

  // Return the new access token (and possibly a new refresh token)
  return NextResponse.json({
    access_token: data.access_token,
    expires_in: data.expires_in,      // seconds, usually 3600
    refresh_token: data.refresh_token ?? refreshToken, // Spotify may rotate it
  })
}
