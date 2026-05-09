"use client"

import { useRecentlyPlayed } from "@/hooks/use-spotify"
import { deriveHeatmap } from "@/lib/spotify/transformers"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { AlertCircle } from "lucide-react"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** Map a cell count → Tailwind bg class using our heatmap scale */
function cellColor(count: number): string {
  if (count === 0) return "bg-muted/60"
  if (count === 1) return "bg-[#0a3320]"
  if (count === 2) return "bg-[#0d5c35]"
  if (count === 3) return "bg-[#12994e]"
  return "bg-primary"
}

function HeatmapInner() {
  const { data, isLoading, isError, error } = useRecentlyPlayed()

  if (isError) {
    return (
      <div className="flex items-center gap-2.5 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {(error as Error)?.message ?? "Failed to load recently played."}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="w-8 h-4 shrink-0" />
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-4" />
          ))}
        </div>
        {DAYS.map(d => (
          <div key={d} className="flex gap-2 items-center">
            <Skeleton className="w-8 h-4 shrink-0" />
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 aspect-square rounded-sm" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  const cells = data ? deriveHeatmap(data.items) : []
  const maxCount = Math.max(...cells.map(c => c.count), 1)

  return (
    <div className="space-y-5">
      {/* Hour column headers */}
      <div className="flex gap-1 ml-9 overflow-x-auto pb-1">
        {HOURS.map(h => (
          <div
            key={h}
            className="flex-1 min-w-[12px] text-center text-[9px] text-muted-foreground font-mono tabular-nums"
          >
            {h % 6 === 0 ? h : ""}
          </div>
        ))}
      </div>

      {/* Day rows */}
      <div className="space-y-1 overflow-x-auto">
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-1">
            <span className="w-8 text-right text-[10px] text-muted-foreground font-medium shrink-0 pr-1">
              {day}
            </span>
            {HOURS.map(hour => {
              const cell = cells.find(c => c.day === dayIdx && c.hour === hour)
              const count = cell?.count ?? 0
              return (
                <div
                  key={hour}
                  title={`${day} ${hour}:00 — ${count} plays`}
                  className={`flex-1 min-w-[12px] aspect-square rounded-sm transition-colors ${cellColor(count)}`}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 pt-2">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {["bg-muted/60", "bg-[#0a3320]", "bg-[#0d5c35]", "bg-[#12994e]", "bg-primary"].map(cls => (
          <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          Based on last 50 plays
        </span>
      </div>

      {/* Empty state */}
      {data?.items.length === 0 && (
        <p className="text-center text-xs text-muted-foreground py-8">
          No recent listening history to display.
        </p>
      )}

      {/* Max stat */}
      {maxCount > 1 && (
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Peak intensity</p>
            <p className="text-2xl font-bold font-mono text-primary">{maxCount}</p>
            <p className="text-xs text-muted-foreground">plays in one hour</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ListeningHeatmap() {
  return (
    <ErrorBoundary>
      <HeatmapInner />
    </ErrorBoundary>
  )
}
