/**
 * Spotify data transformer / service layer.
 *
 * Architecture note
 * ─────────────────
 * Raw Spotify API responses are NEVER passed directly to UI components.
 * Every raw type flows through a transformer here first:
 *
 *   Spotify API response  →  transform*()  →  Normalized*  →  UI component
 *
 * This keeps components decoupled from the Spotify schema, makes testing easy,
 * and lets us change the API integration without touching every component.
 *
 * Architecture clarification (Spotify call routing)
 * ──────────────────────────────────────────────────
 * - Spotify API calls (top tracks, artists, etc.) = client-side, using the
 *   `provider_token` from the Supabase session. No server involvement.
 * - Token refresh = server route (`/api/auth/refresh-spotify`) so that
 *   `SPOTIFY_CLIENT_SECRET` is never exposed to the browser.
 */

import type {
  SpotifyTrack,
  SpotifyArtist,
  SpotifyAudioFeatures,
  SpotifyPlayHistory,
  GenreCount,
  HeatmapCell,
  MoodProfile,
} from "./types"

// ─── Normalized models ────────────────────────────────────────────────────────

/** Clean, UI-ready track model. No raw Spotify fields. */
export interface NormalizedTrack {
  id: string
  name: string
  /** Comma-separated artist display string, e.g. "Artist A, Artist B" */
  artistDisplay: string
  /** Individual artist names (for linking etc.) */
  artists: { id: string; name: string; spotifyUrl: string }[]
  albumName: string
  /** Highest-resolution album art URL, or null if none */
  albumImageUrl: string | null
  durationMs: number
  /** Formatted as "m:ss" */
  durationFormatted: string
  /** 0–100 */
  popularity: number
  previewUrl: string | null
  spotifyUrl: string
  isExplicit: boolean
}

/** Clean, UI-ready artist model. */
export interface NormalizedArtist {
  id: string
  name: string
  /** Highest-resolution image URL, or null */
  imageUrl: string | null
  genres: string[]
  /** Top-3 genres formatted for display */
  genreDisplay: string
  /** 0–100 */
  popularity: number
  spotifyUrl: string
  followersTotal: number
}

/** Clean audio feature model with only the fields we visualise. */
export interface NormalizedAudioFeatures {
  trackId: string
  valence: number        // happiness  0–1
  energy: number         // 0–1
  danceability: number   // 0–1
  acousticness: number   // 0–1
  instrumentalness: number // 0–1
  speechiness: number    // 0–1
  tempo: number          // BPM
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Format milliseconds as "m:ss" */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/** Pick the image closest to `targetWidth` pixels from a list of Spotify images */
function pickImage(
  images: { url: string; width: number | null; height: number | null }[],
  targetWidth = 300
): string | null {
  if (!images.length) return null
  return images.reduce((best, img) => {
    const bDiff = Math.abs((best.width ?? 0) - targetWidth)
    const iDiff = Math.abs((img.width ?? 0) - targetWidth)
    return iDiff < bDiff ? img : best
  }).url
}

// ─── Transformers ─────────────────────────────────────────────────────────────

/** SpotifyTrack → NormalizedTrack */
export function transformTrack(track: SpotifyTrack): NormalizedTrack {
  return {
    id: track.id,
    name: track.name,
    artistDisplay: track.artists.map(a => a.name).join(", "),
    artists: track.artists.map(a => ({
      id: a.id,
      name: a.name,
      spotifyUrl: a.external_urls.spotify,
    })),
    albumName: track.album.name,
    albumImageUrl: pickImage(track.album.images, 300),
    durationMs: track.duration_ms,
    durationFormatted: formatDuration(track.duration_ms),
    popularity: track.popularity,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    isExplicit: track.explicit,
  }
}

/** SpotifyArtist → NormalizedArtist */
export function transformArtist(artist: SpotifyArtist): NormalizedArtist {
  return {
    id: artist.id,
    name: artist.name,
    imageUrl: pickImage(artist.images, 300),
    genres: artist.genres,
    genreDisplay: artist.genres.slice(0, 3).join(", ") || "—",
    popularity: artist.popularity,
    spotifyUrl: artist.external_urls.spotify,
    followersTotal: artist.followers?.total ?? 0,
  }
}

/** SpotifyAudioFeatures → NormalizedAudioFeatures */
export function transformAudioFeatures(
  af: SpotifyAudioFeatures
): NormalizedAudioFeatures {
  return {
    trackId: af.id,
    valence: af.valence,
    energy: af.energy,
    danceability: af.danceability,
    acousticness: af.acousticness,
    instrumentalness: af.instrumentalness,
    speechiness: af.speechiness,
    tempo: af.tempo,
  }
}

// ─── Derived aggregations ─────────────────────────────────────────────────────

/**
 * Derive genre counts from a list of normalized artists.
 * Each artist can have multiple genres; we count each occurrence.
 * Returns genres sorted by count desc with percentages.
 */
export function deriveGenreCounts(artists: NormalizedArtist[]): GenreCount[] {
  const counts = new Map<string, number>()
  for (const artist of artists) {
    for (const genre of artist.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }
  const total = Array.from(counts.values()).reduce((sum, c) => sum + c, 0)
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
}

/**
 * Compute a MoodProfile (average of audio features) from a list of
 * NormalizedAudioFeatures. Returns null if the input array is empty.
 */
export function deriveMoodProfile(
  features: NormalizedAudioFeatures[]
): MoodProfile | null {
  if (!features.length) return null
  const sum = features.reduce(
    (acc, f) => ({
      valence: acc.valence + f.valence,
      energy: acc.energy + f.energy,
      danceability: acc.danceability + f.danceability,
      acousticness: acc.acousticness + f.acousticness,
      instrumentalness: acc.instrumentalness + f.instrumentalness,
    }),
    { valence: 0, energy: 0, danceability: 0, acousticness: 0, instrumentalness: 0 }
  )
  const n = features.length
  return {
    valence: sum.valence / n,
    energy: sum.energy / n,
    danceability: sum.danceability / n,
    acousticness: sum.acousticness / n,
    instrumentalness: sum.instrumentalness / n,
  }
}

/**
 * Build a listening heatmap (hour × day) from recently-played history.
 * `day` is 0=Monday … 6=Sunday (ISO weekday − 1).
 */
export function deriveHeatmap(history: SpotifyPlayHistory[]): HeatmapCell[] {
  const counts = new Map<string, number>()

  for (const entry of history) {
    const date = new Date(entry.played_at)
    const hour = date.getHours()               // 0–23
    const day = (date.getDay() + 6) % 7        // Sun=0 → shift so Mon=0
    const key = `${day}:${hour}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const cells: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      cells.push({ day, hour, count: counts.get(`${day}:${hour}`) ?? 0 })
    }
  }
  return cells
}
