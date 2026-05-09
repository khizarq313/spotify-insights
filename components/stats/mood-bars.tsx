"use client"

import { useTopTracks, useAudioFeatures } from "@/hooks/use-spotify"
import { transformAudioFeatures, deriveMoodProfile } from "@/lib/spotify/transformers"
import type { MoodProfile } from "@/lib/spotify/types"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { AlertCircle } from "lucide-react"

const MOOD_DIMS: {
  key: keyof MoodProfile
  label: string
  description: string
  low: string
  high: string
}[] = [
  { key: "valence",         label: "Happiness",      description: "How positive and upbeat your music sounds",   low: "Melancholic", high: "Euphoric"    },
  { key: "energy",          label: "Energy",         description: "Intensity and activity level of your tracks",  low: "Calm",       high: "Intense"     },
  { key: "danceability",    label: "Danceability",   description: "How suitable your tracks are for dancing",     low: "Chill",      high: "Groovy"      },
  { key: "acousticness",    label: "Acousticness",   description: "How acoustic vs electronic your taste is",     low: "Electronic", high: "Acoustic"    },
  { key: "instrumentalness",label: "Instrumental",   description: "Ratio of instrumental to vocal content",       low: "Vocal",      high: "Instrumental"},
]

function MoodBarsInner() {
  const { data: tracksData, isLoading: tracksLoading, isError: tracksError, error: tracksErr } =
    useTopTracks("short_term")

  const trackIds = tracksData?.items.map(t => t.id).slice(0, 50) ?? []

  const { data: featuresData, isLoading: featuresLoading, isError: featuresError, error: featuresErr } =
    useAudioFeatures(trackIds)

  const isLoading = tracksLoading || (trackIds.length > 0 && featuresLoading)
  const isError   = tracksError   || featuresError
  const error     = tracksErr     ?? featuresErr

  const moodProfile = featuresData
    ? deriveMoodProfile(
        featuresData.audio_features
          .filter((f): f is NonNullable<typeof f> => f !== null)
          .map(transformAudioFeatures)
      )
    : null

  if (isError) {
    return (
      <div className="flex items-center gap-2.5 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {(error as Error)?.message ?? "Failed to load mood data."}
      </div>
    )
  }

  if (isLoading || !moodProfile) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {MOOD_DIMS.map(dim => {
        const value = moodProfile[dim.key] ?? 0
        const pct   = Math.round(value * 100)

        return (
          <div key={dim.key}>
            {/* Label row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{dim.label}</span>
              <span className="text-sm font-bold font-mono text-primary">{pct}%</span>
            </div>
            {/* Bar */}
            <div className="h-2 rounded-full bg-border">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* Low/high labels + description */}
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">{dim.low}</span>
              <span className="text-[10px] text-muted-foreground text-right">{dim.high}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{dim.description}</p>
          </div>
        )
      })}

      {/* Summary */}
      <div className="pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4">
        {MOOD_DIMS.slice(0, 3).map(dim => {
        const value = moodProfile[dim.key] ?? 0
          const pct   = Math.round(value * 100)
          return (
            <div key={dim.key} className="border border-border bg-background p-3 text-center">
              <p className="text-2xl font-bold font-mono text-primary">{pct}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                {dim.label}
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Computed from your top 50 tracks (last 4 weeks) using Spotify audio features.
      </p>
    </div>
  )
}

export function MoodBars() {
  return (
    <ErrorBoundary>
      <MoodBarsInner />
    </ErrorBoundary>
  )
}
