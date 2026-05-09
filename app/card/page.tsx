"use client"

import { useRef, useCallback, useState } from "react"
import { DashboardLayout } from "@/components/side-nav"
import { PersonalityCard } from "@/components/stats/personality-card"
import { ErrorBoundary } from "@/components/error-boundary"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { useSpotifyProfile, useTopTracks, useTopArtists, useAudioFeatures } from "@/hooks/use-spotify"
import { transformTrack, transformArtist, transformAudioFeatures, deriveMoodProfile, deriveGenreCounts } from "@/lib/spotify/transformers"
import { derivePersonality } from "@/lib/spotify/personality"
import { Download, Share2, AlertCircle, RefreshCw } from "lucide-react"

function CardSkeleton() {
  return (
    <div className="w-full max-w-[420px] border border-border bg-card">
      <div className="h-1 bg-primary" />
      <div className="p-6 border-b border-border flex items-center gap-4">
        <Skeleton className="w-12 h-12 shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="ml-auto text-right space-y-1">
          <Skeleton className="h-3 w-8 ml-auto" />
          <Skeleton className="h-6 w-10 ml-auto" />
        </div>
      </div>
      <div className="p-6 border-b border-border space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="p-6 border-b border-border space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1 w-full" />
          </div>
        ))}
      </div>
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    </div>
  )
}

function PersonalityPageInner() {
  const { user } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  // ── Data fetching ─────────────────────────────────────────────────────────
  const { data: profile }                        = useSpotifyProfile()
  const { data: tracksData,   isLoading: tLoad, isError: tErr }   = useTopTracks("short_term")
  const { data: artistsData,  isLoading: aLoad, isError: aErr }   = useTopArtists("short_term")

  const rawTrackIds = tracksData?.items.map(t => t.id).slice(0, 50) ?? []
  const { data: featuresData, isLoading: fLoad, isError: fErr }   = useAudioFeatures(rawTrackIds)

  const isLoading = tLoad || aLoad || (rawTrackIds.length > 0 && fLoad)
  const isError   = tErr || aErr || fErr

  // ── Derived data ──────────────────────────────────────────────────────────
  const tracks  = tracksData?.items.map(transformTrack)  ?? []
  const artists = artistsData?.items.map(transformArtist) ?? []
  const genres  = deriveGenreCounts(artists)

  const moodProfile = featuresData
    ? deriveMoodProfile(
        featuresData.audio_features
          .filter((f): f is NonNullable<typeof f> => f !== null)
          .map(transformAudioFeatures)
      )
    : null

  const personalityResult =
    moodProfile ? derivePersonality(moodProfile, tracks) : null

  // ── Avatar ────────────────────────────────────────────────────────────────
  const avatarUrl     = profile?.images?.[0]?.url ?? null
  const userName      = profile?.display_name ?? user?.email?.split("@")[0] ?? "Listener"

  // ── PNG Export ────────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    setIsExporting(true)
    setExportError(null)

    try {
      // Dynamic import — html2canvas is only needed on demand
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#171b26", // --card hex
        useCORS: true,
        scale: 2,               // 2× for retina-quality export
        logging: false,
        allowTaint: false,
      })

      const link  = document.createElement("a")
      link.href   = canvas.toDataURL("image/png")
      link.download = `spotify-insights-${userName.replace(/\s+/g, "-").toLowerCase()}.png`
      link.click()
    } catch (err) {
      console.error("[html2canvas]", err)
      setExportError("Export failed. Try again or use a screenshot.")
    } finally {
      setIsExporting(false)
    }
  }, [userName])

  // ── Share (Web Share API) ─────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!cardRef.current) return
    setIsExporting(true)
    setExportError(null)

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#171b26",
        useCORS: true,
        scale: 2,
        logging: false,
        allowTaint: false,
      })

      canvas.toBlob(async (blob) => {
        if (!blob) { setIsExporting(false); return }

        if (navigator.canShare?.({ files: [new File([blob], "card.png", { type: "image/png" })] })) {
          await navigator.share({
            files: [new File([blob], "spotify-insights-card.png", { type: "image/png" })],
            title: `${personalityResult?.archetype ?? "My Sonic Profile"} — Spotify Insights`,
          })
        } else {
          // Fallback: just download
          const link  = document.createElement("a")
          link.href   = URL.createObjectURL(blob)
          link.download = `spotify-insights-${userName.replace(/\s+/g, "-").toLowerCase()}.png`
          link.click()
        }
        setIsExporting(false)
      }, "image/png")
    } catch (err) {
      console.error("[share]", err)
      setExportError("Share failed.")
      setIsExporting(false)
    }
  }, [personalityResult?.archetype, userName])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="px-6 py-8 max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono mb-2">Analytics</p>
        <h1 className="text-xl font-bold text-foreground">Personality Card</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your music identity — shareable as a PNG
        </p>
      </div>

      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-2.5 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load all listening data. Partial card may show.
        </div>
      )}

      {/* Export error */}
      {exportError && (
        <div className="flex items-center gap-2.5 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {exportError}
        </div>
      )}

      {/* Card preview (or skeleton) */}
      <div className="flex justify-center mb-8">
        {isLoading || !personalityResult ? (
          <CardSkeleton />
        ) : (
          <PersonalityCard
            ref={cardRef}
            result={personalityResult}
            tracks={tracks}
            genres={genres}
            userName={userName}
            avatarUrl={avatarUrl}
          />
        )}
      </div>

      {/* Action buttons */}
      {!isLoading && personalityResult && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PNG
          </button>
          <button
            onClick={handleShare}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 border border-border bg-card text-foreground px-6 py-3 text-sm font-semibold hover:bg-[#1b1f2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            Share
          </button>
        </div>
      )}

      {/* How it works */}
      {!isLoading && personalityResult && (
        <div className="mt-8 border border-border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 font-mono">
            How it&apos;s calculated
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Archetype",  value: personalityResult.archetype.replace("The ", "") },
              { label: "Energy",     value: `${personalityResult.traits.energy}%`  },
              { label: "Groove",     value: `${personalityResult.traits.groove}%`  },
              { label: "Obscurity",  value: `${personalityResult.traits.obscurity}%` },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-base font-bold font-mono text-primary">{item.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CardPage() {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <PersonalityPageInner />
      </ErrorBoundary>
    </DashboardLayout>
  )
}
