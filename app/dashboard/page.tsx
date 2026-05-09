"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/side-nav"
import { TopTracks } from "@/components/stats/top-tracks"
import { TopArtists } from "@/components/stats/top-artists"
import { GenreCloud } from "@/components/stats/genre-cloud"
import { useAuth } from "@/contexts/auth-context"
import { useSpotifyProfile } from "@/hooks/use-spotify"
import { Skeleton } from "@/components/ui/skeleton"
import { Music2, Mic2, BarChart3 } from "lucide-react"
import Link from "next/link"

type ActiveTab = "tracks" | "artists" | "genres"

const TABS: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "tracks",  label: "Top Tracks",  icon: Music2   },
  { id: "artists", label: "Top Artists", icon: Mic2     },
  { id: "genres",  label: "Genres",      icon: BarChart3 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useSpotifyProfile()
  const [activeTab, setActiveTab] = useState<ActiveTab>("tracks")

  return (
    <DashboardLayout>
      <div className="px-6 py-8 max-w-3xl">

        {/* -- Profile header --------------------------------------- */}
        <div className="flex items-center gap-4 mb-10">
          {profileLoading ? (
            <>
              <Skeleton className="w-14 h-14 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </>
          ) : profile ? (
            <>
              {profile.images[0]?.url ? (
                <img
                  src={profile.images[0].url}
                  alt={profile.display_name ?? "Profile"}
                  className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-border"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">
                    {(profile.display_name ?? user?.email ?? "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {profile.display_name ?? user?.email?.split("@")[0] ?? "Listener"}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  {profile.followers.total.toLocaleString()} followers
                  {profile.product === "premium" && (
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      Premium
                    </span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div>
              <h1 className="text-lg font-bold">Your Stats</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
        </div>

        {/* ── Quick links ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 mb-10 border border-border">
          <Link
            href="/heatmap"
            className="group relative bg-card p-5 hover:bg-[#1b1f2a] transition-colors overflow-hidden border-b sm:border-b-0 sm:border-r border-border"
          >
            <div className="absolute top-0 left-0 w-0.5 h-full bg-[#7ee5ff] opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 font-mono">Heatmap</p>
            <p className="text-sm text-foreground font-semibold">When do you listen?</p>
          </Link>
          <Link
            href="/mood"
            className="group relative bg-card p-5 hover:bg-[#1b1f2a] transition-colors overflow-hidden border-b sm:border-b-0 sm:border-r border-border"
          >
            <div className="absolute top-0 left-0 w-0.5 h-full bg-primary opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 font-mono">Mood</p>
            <p className="text-sm text-foreground font-semibold">What&apos;s your vibe?</p>
          </Link>
          <Link
            href="/card"
            className="group relative bg-card p-5 hover:bg-[#1b1f2a] transition-colors overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-0.5 h-full bg-[#d0bcff] opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 font-mono">Personality</p>
            <p className="text-sm text-foreground font-semibold">Your sonic archetype</p>
          </Link>
        </div>

        {/* -- Section tabs ----------------------------------------- */}
        <div className="flex gap-0 mb-6 border-b border-border">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* -- Tab panels ------------------------------------------- */}
        {activeTab === "tracks"  && <TopTracks  />}
        {activeTab === "artists" && <TopArtists />}
        {activeTab === "genres"  && <GenreCloud />}
      </div>
    </DashboardLayout>
  )
}
