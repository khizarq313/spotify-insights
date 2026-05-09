// ─── Spotify Web API response types ────────────────────────────────────────

export type TimeRange = "short_term" | "medium_term" | "long_term"

// ─── Artist ─────────────────────────────────────────────────────────────────

export interface SpotifyImage {
  url: string
  width: number | null
  height: number | null
}

export interface SpotifyArtist {
  id: string
  name: string
  type: "artist"
  uri: string
  href: string
  external_urls: { spotify: string }
  images: SpotifyImage[]
  genres: string[]
  popularity: number
  followers?: { total: number }
}

// ─── Track ───────────────────────────────────────────────────────────────────

export interface SpotifyAlbum {
  id: string
  name: string
  uri: string
  images: SpotifyImage[]
  release_date: string
  album_type: string
}

export interface SpotifyTrack {
  id: string
  name: string
  type: "track"
  uri: string
  href: string
  external_urls: { spotify: string }
  duration_ms: number
  explicit: boolean
  popularity: number
  preview_url: string | null
  artists: Pick<SpotifyArtist, "id" | "name" | "uri" | "external_urls">[]
  album: SpotifyAlbum
}

// ─── Paged responses ─────────────────────────────────────────────────────────

export interface SpotifyPagingObject<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  href: string
  next: string | null
  previous: string | null
}

// ─── Recently Played ─────────────────────────────────────────────────────────

export interface SpotifyPlayHistory {
  track: SpotifyTrack
  played_at: string // ISO 8601
  context: {
    type: string
    uri: string
    href: string
    external_urls: { spotify: string }
  } | null
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyPlayHistory[]
  next: string | null
  cursors: { before: string; after: string } | null
  limit: number
  href: string
}

// ─── Audio Features ───────────────────────────────────────────────────────────

export interface SpotifyAudioFeatures {
  id: string
  danceability: number     // 0–1
  energy: number           // 0–1
  key: number              // Pitch class (0=C … 11=B), -1=unknown
  loudness: number         // dB
  mode: number             // 0=minor, 1=major
  speechiness: number      // 0–1
  acousticness: number     // 0–1
  instrumentalness: number // 0–1
  liveness: number         // 0–1
  valence: number          // 0–1  (happy → sad)
  tempo: number            // BPM
  duration_ms: number
  time_signature: number
}

export interface SpotifyAudioFeaturesResponse {
  audio_features: (SpotifyAudioFeatures | null)[]
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface SpotifyUserProfile {
  id: string
  display_name: string | null
  email: string
  country: string
  product: "free" | "premium" | "open" | string
  images: SpotifyImage[]
  followers: { total: number }
  external_urls: { spotify: string }
  href: string
  uri: string
}

// ─── Derived / computed types used across the app ────────────────────────────

export interface MoodProfile {
  valence: number        // happiness  0–1
  energy: number         // energy     0–1
  danceability: number   // groove     0–1
  acousticness: number   // acoustic   0–1
  instrumentalness: number
}

export interface GenreCount {
  genre: string
  count: number
  percentage: number
}

export interface HeatmapCell {
  hour: number   // 0–23
  day: number    // 0=Mon … 6=Sun
  count: number
}
