"use client"

import { useState } from "react"
import { useTopArtists } from "@/hooks/use-spotify"
import { transformArtist } from "@/lib/spotify/transformers"
import type { TimeRange } from "@/lib/spotify/types"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { UserRound, ExternalLink, AlertCircle } from "lucide-react"

const TABS: { label: string; value: TimeRange }[] = [
  { label: "4 Weeks",  value: "short_term"  },
  { label: "6 Months", value: "medium_term" },
  { label: "All Time", value: "long_term"   },
]

function ArtistSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5">
      <Skeleton className="w-5 h-3 shrink-0" />
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  )
}

function TopArtistsInner() {
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term")
  const { data, isLoading, isError, error } = useTopArtists(timeRange)
  const artists = data?.items.map(transformArtist) ?? []

  return (
    <div>
      <div className="flex gap-0 mb-5 border-b border-border">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setTimeRange(tab.value)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              timeRange === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="flex items-center gap-2.5 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {(error as Error)?.message ?? "Failed to load artists."}
        </div>
      )}

      {isLoading && (
        <div>{Array.from({ length: 10 }).map((_, i) => <ArtistSkeleton key={i} />)}</div>
      )}

      {!isLoading && !isError && (
        <ol className="space-y-0.5">
          {artists.map((artist, idx) => (
            <li
              key={artist.id}
              className="group flex items-center gap-3 px-2 py-2.5 hover:bg-[#1b1f2a] transition-colors border-b border-border/40 last:border-b-0"
            >
              <span className="w-5 text-right text-xs text-muted-foreground shrink-0 tabular-nums font-mono">
                {idx + 1}
              </span>
              {artist.imageUrl ? (
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <UserRound className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate leading-tight">{artist.name}</p>
                <p className="text-xs text-muted-foreground truncate leading-tight">{artist.genreDisplay}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 w-16">
                <span className="text-[11px] text-muted-foreground font-mono tabular-nums">{artist.popularity}</span>
                <div className="w-full h-0.5 rounded-full bg-border">
                  <div className="h-0.5 rounded-full bg-primary" style={{ width: `${artist.popularity}%` }} />
                </div>
              </div>
              <a
                href={artist.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary p-1"
                aria-label={`Open ${artist.name} in Spotify`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          ))}
          {artists.length === 0 && (
            <li className="py-12 text-center">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">No artists found</p>
              <p className="text-[10px] text-muted-foreground mt-1">Try a different time range.</p>
            </li>
          )}
        </ol>
      )}
    </div>
  )
}

export function TopArtists() {
  return (
    <ErrorBoundary>
      <TopArtistsInner />
    </ErrorBoundary>
  )
}
