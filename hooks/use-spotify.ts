"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import {
  fetchSpotifyProfile,
  fetchTopTracks,
  fetchTopArtists,
  fetchRecentlyPlayed,
  fetchAudioFeatures,
  SpotifyApiError,
} from "@/lib/spotify/client"
import type { TimeRange } from "@/lib/spotify/types"
import { useCallback, useRef } from "react"

// ─── Token-aware fetch helper ─────────────────────────────────────────────────

/**
 * Returns a stable `getToken` function that transparently refreshes the
 * Spotify access token when it receives a 401 from the API, then retries once.
 *
 * The refreshed token is written back into AuthContext via the Supabase session
 * update so all subsequent hook calls pick it up automatically.
 */
function useSpotifyToken() {
  const { spotifyToken, spotifyRefreshToken } = useAuth()
  // Use a ref so the fetch callbacks always read the latest value without
  // becoming stale closures
  const tokenRef = useRef(spotifyToken)
  tokenRef.current = spotifyToken

  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!spotifyRefreshToken) return null

    try {
      const res = await fetch("/api/auth/refresh-spotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: spotifyRefreshToken }),
      })

      if (!res.ok) {
        console.error("[useSpotifyToken] Refresh failed:", res.status)
        return null
      }

      const data = await res.json()
      return data.access_token as string
    } catch (err) {
      console.error("[useSpotifyToken] Refresh error:", err)
      return null
    }
  }, [spotifyRefreshToken])

  return { tokenRef, refreshToken }
}

// ─── Query key factory ────────────────────────────────────────────────────────

export const spotifyKeys = {
  all: ["spotify"] as const,
  profile: () => [...spotifyKeys.all, "profile"] as const,
  topTracks: (range: TimeRange) => [...spotifyKeys.all, "top-tracks", range] as const,
  topArtists: (range: TimeRange) => [...spotifyKeys.all, "top-artists", range] as const,
  recentlyPlayed: () => [...spotifyKeys.all, "recently-played"] as const,
  audioFeatures: (ids: string[]) => [...spotifyKeys.all, "audio-features", ids] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch the authenticated user's Spotify profile */
export function useSpotifyProfile() {
  const { spotifyToken } = useAuth()
  const { tokenRef, refreshToken } = useSpotifyToken()

  return useQuery({
    queryKey: spotifyKeys.profile(),
    enabled: !!spotifyToken,
    staleTime: 10 * 60 * 1000, // profile rarely changes; cache for 10 min
    queryFn: async () => {
      const token = tokenRef.current!
      try {
        return await fetchSpotifyProfile(token)
      } catch (err) {
        if (err instanceof SpotifyApiError && err.status === 401) {
          const fresh = await refreshToken()
          if (fresh) return fetchSpotifyProfile(fresh)
        }
        throw err
      }
    },
  })
}

/** Fetch top tracks for a given time range */
export function useTopTracks(timeRange: TimeRange) {
  const { spotifyToken } = useAuth()
  const { tokenRef, refreshToken } = useSpotifyToken()

  return useQuery({
    queryKey: spotifyKeys.topTracks(timeRange),
    enabled: !!spotifyToken,
    // Top tracks change slowly; cache for the full 5-min default
    queryFn: async () => {
      const token = tokenRef.current!
      try {
        return await fetchTopTracks(token, timeRange)
      } catch (err) {
        if (err instanceof SpotifyApiError && err.status === 401) {
          const fresh = await refreshToken()
          if (fresh) return fetchTopTracks(fresh, timeRange)
        }
        throw err
      }
    },
  })
}

/** Fetch top artists for a given time range */
export function useTopArtists(timeRange: TimeRange) {
  const { spotifyToken } = useAuth()
  const { tokenRef, refreshToken } = useSpotifyToken()

  return useQuery({
    queryKey: spotifyKeys.topArtists(timeRange),
    enabled: !!spotifyToken,
    queryFn: async () => {
      const token = tokenRef.current!
      try {
        return await fetchTopArtists(token, timeRange)
      } catch (err) {
        if (err instanceof SpotifyApiError && err.status === 401) {
          const fresh = await refreshToken()
          if (fresh) return fetchTopArtists(fresh, timeRange)
        }
        throw err
      }
    },
  })
}

/** Fetch recently played tracks (used to build the listening heatmap) */
export function useRecentlyPlayed() {
  const { spotifyToken } = useAuth()
  const { tokenRef, refreshToken } = useSpotifyToken()

  return useQuery({
    queryKey: spotifyKeys.recentlyPlayed(),
    enabled: !!spotifyToken,
    // Recently played changes more often; keep fresh for only 2 min
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const token = tokenRef.current!
      try {
        return await fetchRecentlyPlayed(token)
      } catch (err) {
        if (err instanceof SpotifyApiError && err.status === 401) {
          const fresh = await refreshToken()
          if (fresh) return fetchRecentlyPlayed(fresh)
        }
        throw err
      }
    },
  })
}

/** Fetch audio features for a list of track IDs (max 100) */
export function useAudioFeatures(trackIds: string[]) {
  const { spotifyToken } = useAuth()
  const { tokenRef, refreshToken } = useSpotifyToken()

  return useQuery({
    queryKey: spotifyKeys.audioFeatures(trackIds),
    enabled: !!spotifyToken && trackIds.length > 0,
    queryFn: async () => {
      const token = tokenRef.current!
      try {
        return await fetchAudioFeatures(token, trackIds)
      } catch (err) {
        if (err instanceof SpotifyApiError && err.status === 401) {
          const fresh = await refreshToken()
          if (fresh) return fetchAudioFeatures(fresh, trackIds)
        }
        throw err
      }
    },
  })
}
