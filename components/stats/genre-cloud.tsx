"use client"

import { useState } from "react"
import { useTopArtists } from "@/hooks/use-spotify"
import { transformArtist, deriveGenreCounts } from "@/lib/spotify/transformers"
import type { TimeRange } from "@/lib/spotify/types"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { AlertCircle } from "lucide-react"

const TABS: { label: string; value: TimeRange }[] = [
  { label: "4 Weeks",  value: "short_term"  },
  { label: "6 Months", value: "medium_term" },
  { label: "All Time", value: "long_term"   },
]

function GenreCloudInner() {
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term")
  const { data, isLoading, isError, error } = useTopArtists(timeRange)
  const genres = data ? deriveGenreCounts(data.items.map(transformArtist)).slice(0, 20) : []
  const maxCount = genres[0]?.count ?? 1

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
          {(error as Error)?.message ?? "Failed to load genres."}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-4 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-6" />
                </div>
                <Skeleton className="h-1.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && (
        <ol className="space-y-3">
          {genres.map((item, idx) => (
            <li key={item.genre} className="flex items-center gap-3">
              <span className="w-4 text-right text-xs text-muted-foreground shrink-0 tabular-nums font-mono">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium capitalize truncate">{item.genre}</span>
                  <span className="text-xs text-muted-foreground font-mono ml-3 shrink-0">{item.percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
          {genres.length === 0 && (
            <li className="py-10 text-center text-xs text-muted-foreground">No genre data for this time range.</li>
          )}
        </ol>
      )}
    </div>
  )
}

export function GenreCloud() {
  return (
    <ErrorBoundary>
      <GenreCloudInner />
    </ErrorBoundary>
  )
}
