import type {
  SpotifyUserProfile,
  SpotifyPagingObject,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyRecentlyPlayedResponse,
  SpotifyAudioFeaturesResponse,
  TimeRange,
} from "./types"

// ─── Base fetch ──────────────────────────────────────────────────────────────

const SPOTIFY_API = "https://api.spotify.com/v1"

export class SpotifyApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "SpotifyApiError"
  }
}

// ─── Rate-limit helpers ───────────────────────────────────────────────────────

/** Resolves after `ms` milliseconds. Used for retry back-off. */
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

/**
 * Simple in-memory cache keyed by endpoint path.
 * Stores the last successful response so we can serve a stale fallback when
 * Spotify 429s and all retries are exhausted.
 *
 * This is intentionally module-level (shared across hook calls in the same
 * browser tab session) — that is exactly what we want for a fallback.
 */
const _responseCache = new Map<string, unknown>()

/**
 * Core fetch wrapper with:
 *  - Spotify `Authorization: Bearer` header injection
 *  - 429 rate-limit handling: reads `Retry-After` header, falls back to
 *    exponential backoff (1 s → 2 s → 4 s … capped at 30 s with ±500 ms jitter)
 *  - Up to `maxRetries` retry attempts on 429
 *  - Stale-cache fallback when all retries are exhausted (avoids dashboard
 *    going blank mid-testing session)
 *  - Throws `SpotifyApiError` on unrecoverable non-2xx responses
 */
async function spotifyFetch<T>(
  token: string,
  path: string,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(`${SPOTIFY_API}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (res.ok) {
      const data = (await res.json()) as T
      _responseCache.set(path, data)
      return data
    }

    if (res.status === 429) {
      if (attempt < maxRetries) {
        // Prefer the server-provided Retry-After (in seconds); otherwise back off
        const retryAfterSec = res.headers.get("Retry-After")
        const jitter = Math.random() * 500
        const waitMs = retryAfterSec
          ? parseInt(retryAfterSec, 10) * 1000 + jitter
          : Math.min(1000 * Math.pow(2, attempt), 30_000) + jitter

        console.warn(
          `[Spotify] 429 on ${path} — retrying in ${Math.round(waitMs)}ms (attempt ${attempt + 1}/${maxRetries})`
        )
        await sleep(waitMs)
        continue
      }

      // All retries exhausted — serve cached fallback to keep the UI alive
      const cached = _responseCache.get(path)
      if (cached) {
        console.warn(`[Spotify] 429 retries exhausted for ${path} — serving cached fallback`)
        return cached as T
      }
    }

    // Non-429 non-OK: extract message and throw immediately (no retry)
    let message = res.statusText
    try {
      const body = await res.json()
      message = body?.error?.message ?? message
    } catch {
      // ignore JSON parse errors
    }
    throw new SpotifyApiError(res.status, message)
  }

  // Unreachable in practice — TypeScript needs a return path
  throw new SpotifyApiError(429, "Rate limit exceeded after all retries")
}

// ─── Endpoint helpers ─────────────────────────────────────────────────────────

/** Current user's Spotify profile */
export function fetchSpotifyProfile(token: string): Promise<SpotifyUserProfile> {
  return spotifyFetch<SpotifyUserProfile>(token, "/me")
}

/**
 * Top tracks for the given time range.
 * `limit` max is 50 per Spotify docs.
 */
export function fetchTopTracks(
  token: string,
  timeRange: TimeRange,
  limit = 50
): Promise<SpotifyPagingObject<SpotifyTrack>> {
  return spotifyFetch<SpotifyPagingObject<SpotifyTrack>>(
    token,
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
  )
}

/**
 * Top artists for the given time range.
 * `limit` max is 50 per Spotify docs.
 */
export function fetchTopArtists(
  token: string,
  timeRange: TimeRange,
  limit = 50
): Promise<SpotifyPagingObject<SpotifyArtist>> {
  return spotifyFetch<SpotifyPagingObject<SpotifyArtist>>(
    token,
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`
  )
}

/**
 * Last 50 recently played tracks — used to build the listening heatmap.
 * Spotify's max for this endpoint is 50.
 */
export function fetchRecentlyPlayed(token: string): Promise<SpotifyRecentlyPlayedResponse> {
  return spotifyFetch<SpotifyRecentlyPlayedResponse>(
    token,
    "/me/recently-played?limit=50"
  )
}

/**
 * Audio features for up to 100 track IDs at once.
 * We batch top tracks into chunks of 100 before calling this.
 */
export function fetchAudioFeatures(
  token: string,
  trackIds: string[]
): Promise<SpotifyAudioFeaturesResponse> {
  const ids = trackIds.slice(0, 100).join(",")
  return spotifyFetch<SpotifyAudioFeaturesResponse>(
    token,
    `/audio-features?ids=${ids}`
  )
}
