export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Loading</p>
      </div>
    </div>
  )
}
