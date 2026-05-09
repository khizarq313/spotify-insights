/**
 * Music Personality Algorithm
 * ────────────────────────────
 * Derives a shareable personality archetype from a user's listening data:
 *   - MoodProfile (audio features averages)
 *   - Average track popularity (inverted → "obscurity" score)
 *   - Top genres (from deriveGenreCounts)
 */

import type { MoodProfile } from "./types"
import type { NormalizedTrack } from "./transformers"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PersonalityResult {
  /** Short archetype title, e.g. "The Alchemist" */
  archetype: string
  /** 1-2 sentence description of the personality */
  description: string
  /**
   * 3 trait scores used in the card bar display.
   * Each value is 0–100 (integers).
   */
  traits: {
    obscurity: number
    energy: number
    groove: number
  }
  /**
   * Composite "Aura" score 0–100.
   * Weighted blend of all factors.
   */
  auraScore: number
}

// ─── Archetypes ───────────────────────────────────────────────────────────────

const ARCHETYPES: Array<{
  archetype: string
  description: string
  match: (o: number, e: number, d: number, v: number, a: number) => boolean
}> = [
  {
    archetype: "The Alchemist",
    description: "You blend obscure underground cuts with electronic textures to forge something entirely new.",
    match: (o, e, _d, _v, _a) => o >= 65 && e >= 55,
  },
  {
    archetype: "The Groovemaster",
    description: "You live in the rhythm. Every playlist you touch turns into a dancefloor.",
    match: (_o, e, d, _v, _a) => d >= 70 && e >= 60,
  },
  {
    archetype: "The Euphoric",
    description: "Pure energy and joy radiate from your listening. You choose sounds that lift the room.",
    match: (_o, e, _d, v, _a) => v >= 70 && e >= 65,
  },
  {
    archetype: "The Dreamer",
    description: "You drift through soft soundscapes and introspective melodies, always searching for feel.",
    match: (_o, e, _d, _v, a) => a >= 60 && e < 50,
  },
  {
    archetype: "The Nostalgist",
    description: "Warmth, wood, and candlelight. You live for timeless, acoustic sounds and emotional depth.",
    match: (_o, _e, _d, v, a) => a >= 55 && v >= 55,
  },
  {
    archetype: "The Philosopher",
    description: "Words are noise — you think in frequencies. Your playlists are long instrumental journeys.",
    match: (_o, e, _d, _v, a) => a < 40 && e < 50,
  },
  {
    archetype: "The Seeker",
    description: "You explore deep cuts and uncharted sonic territories others have never heard of.",
    match: (o, e, _d, _v, _a) => o >= 65 && e < 55,
  },
  {
    archetype: "The Tastemaker",
    description: "You knew them before they blew up. Your charts are tomorrow's mainstream.",
    match: (o, _e, _d, _v, _a) => o >= 50 && o < 65,
  },
  {
    archetype: "The Mainstreamer",
    description: "You know what's good — and so does the rest of the world. You're tuned in.",
    match: (o, _e, _d, _v, _a) => o < 35,
  },
]

const FALLBACK: Omit<typeof ARCHETYPES[number], "match"> = {
  archetype: "The Balanced",
  description: "Your taste defies categories — a perfectly calibrated sonic identity built across every genre.",
}

// ─── Algorithm ────────────────────────────────────────────────────────────────

/**
 * Derives a PersonalityResult from the user's listening data.
 *
 * @param mood       MoodProfile from deriveMoodProfile()
 * @param tracks     Top tracks (short_term) from transformTrack()
 */
export function derivePersonality(
  mood: MoodProfile,
  tracks: NormalizedTrack[]
): PersonalityResult {
  // Trait values (0–100 integers)
  const energy     = Math.round(mood.energy * 100)
  const groove     = Math.round(mood.danceability * 100)
  const valence    = Math.round(mood.valence * 100)
  const acoustic   = Math.round(mood.acousticness * 100)

  // Obscurity = inverse of average popularity
  const avgPopularity =
    tracks.length > 0
      ? tracks.reduce((sum, t) => sum + t.popularity, 0) / tracks.length
      : 50
  const obscurity = Math.round(100 - avgPopularity)

  // Match the first archetype whose predicate fires
  const matched = ARCHETYPES.find(a =>
    a.match(obscurity, energy, groove, valence, acoustic)
  ) ?? FALLBACK

  // Aura score — weighted blend
  const auraScore = Math.min(
    100,
    Math.round(
      0.25 * energy +
      0.25 * groove +
      0.20 * valence +
      0.20 * obscurity +
      0.10 * acoustic
    )
  )

  return {
    archetype: matched.archetype,
    description: matched.description,
    traits: { obscurity, energy, groove },
    auraScore,
  }
}
