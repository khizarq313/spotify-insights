"use client"

import { forwardRef } from "react"
import type { PersonalityResult } from "@/lib/spotify/personality"
import type { NormalizedTrack } from "@/lib/spotify/transformers"
import type { GenreCount } from "@/lib/spotify/types"
import { Music2 } from "lucide-react"

interface PersonalityCardProps {
  result: PersonalityResult
  tracks: NormalizedTrack[]
  genres: GenreCount[]
  userName: string
  avatarUrl?: string | null
}

/**
 * The shareable personality card.
 * Uses a forwardRef so the parent can pass the ref to html2canvas.
 *
 * Design rules: solid colors only, no shadows/blurs/gradients.
 * Fixed 420×auto, bg-card border-border.
 */
export const PersonalityCard = forwardRef<HTMLDivElement, PersonalityCardProps>(
  function PersonalityCard({ result, tracks, genres, userName, avatarUrl }, ref) {
    const top3Genres  = genres.slice(0, 3)
    const top3Tracks  = tracks.slice(0, 3)
    const { archetype, description, traits, auraScore } = result

    return (
      <div
        ref={ref}
        /* Fixed width so html2canvas captures consistent dimensions */
        className="w-[420px] bg-card border border-border flex flex-col overflow-hidden"
        style={{ fontFamily: "var(--font-geist, sans-serif)" }}
      >
        {/* ── Green accent bar ────────────────────────────────── */}
        <div className="h-1 w-full bg-primary" />

        {/* ── Header: avatar + label ───────────────────────────── */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-border">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              /* Square avatar per minimal design */
              className="w-12 h-12 object-cover border border-border"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-12 h-12 bg-muted border border-border flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary">
                {userName[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Sonic Profile 2025
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{userName}</p>
          </div>
          {/* Aura score chip */}
          <div className="ml-auto text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Aura</p>
            <p className="text-xl font-bold font-mono text-primary leading-none mt-0.5">
              {auraScore}
            </p>
          </div>
        </div>

        {/* ── Archetype title + description ────────────────────── */}
        <div className="px-6 py-5 border-b border-border bg-background">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground leading-none mb-2">
            {archetype}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* ── Trait bars ────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-border flex flex-col gap-4">
          {([
            { key: "obscurity", label: "Obscurity"  },
            { key: "energy",    label: "Energy"     },
            { key: "groove",    label: "Groove"     },
          ] as const).map(({ key, label }) => {
            const pct   = traits[key]
            const isPrimary = key === "obscurity"
            return (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[11px] font-mono font-medium text-foreground uppercase tracking-wider">
                    {label}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      isPrimary ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="h-1 w-full bg-border">
                  <div
                    className={`h-1 ${isPrimary ? "bg-primary" : "bg-muted-foreground/50"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Top genres pills ─────────────────────────────────── */}
        <div className="px-6 pt-5 pb-4 border-b border-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">
            Base Elements
          </p>
          <div className="flex flex-wrap gap-2">
            {top3Genres.map((g, i) => (
              <span
                key={g.genre}
                className={`px-3 py-1 text-xs font-medium border ${
                  i === 0
                    ? "border-primary/40 text-primary bg-primary/5"
                    : "border-border text-muted-foreground"
                }`}
              >
                {g.genre}
              </span>
            ))}
            {top3Genres.length === 0 && (
              <span className="text-xs text-muted-foreground italic">No genres available</span>
            )}
          </div>
        </div>

        {/* ── Top 3 catalyst tracks ─────────────────────────────── */}
        <div className="px-6 pt-5 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">
            Catalyst Tracks
          </p>
          <ul className="flex flex-col border-t border-border">
            {top3Tracks.map((track, idx) => (
              <li
                key={track.id}
                className="flex items-center gap-3 py-3 border-b border-border last:border-0"
              >
                <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0">
                  {idx + 1}
                </span>
                {track.albumImageUrl ? (
                  <img
                    src={track.albumImageUrl}
                    alt={track.albumName}
                    className="w-9 h-9 object-cover shrink-0"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-9 h-9 bg-muted border border-border flex items-center justify-center shrink-0">
                    <Music2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-tight text-foreground">
                    {track.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate leading-tight">
                    {track.artistDisplay}
                  </p>
                </div>
              </li>
            ))}
            {top3Tracks.length === 0 && (
              <li className="py-4 text-center text-xs text-muted-foreground">
                No tracks available
              </li>
            )}
          </ul>
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <div className="px-6 py-3 border-t border-border bg-background flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            spotify-insights.app
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    )
  }
)
