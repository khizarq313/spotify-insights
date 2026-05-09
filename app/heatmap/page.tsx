"use client"

import { DashboardLayout } from "@/components/side-nav"
import { ListeningHeatmap } from "@/components/stats/listening-heatmap"

export default function HeatmapPage() {
  return (
    <DashboardLayout>
      <div className="px-6 py-8 max-w-4xl">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono mb-2">Analytics</p>
          <h1 className="text-xl font-bold text-foreground">Listening Heatmap</h1>
          <p className="text-xs text-muted-foreground mt-1">
            When you listen most — hour × day grid from your last 50 plays
          </p>
        </div>

        {/* Heatmap */}
        <div className="border border-border bg-card p-6">
          <ListeningHeatmap />
        </div>
      </div>
    </DashboardLayout>
  )
}
