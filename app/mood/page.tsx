"use client"

import { DashboardLayout } from "@/components/side-nav"
import { MoodBars } from "@/components/stats/mood-bars"

export default function MoodPage() {
  return (
    <DashboardLayout>
      <div className="px-6 py-8 max-w-2xl">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono mb-2">Analytics</p>
          <h1 className="text-xl font-bold text-foreground">Mood Analysis</h1>
          <p className="text-xs text-muted-foreground mt-1">
            5-dimension audio feature profile from your top 50 tracks
          </p>
        </div>

        {/* Mood bars card */}
        <div className="border border-border bg-card p-6">
          <MoodBars />
        </div>
      </div>
    </DashboardLayout>
  )
}
