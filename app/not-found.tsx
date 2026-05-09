import Link from "next/link"
import { Music2 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <div className="w-12 h-12 bg-[#1b1f2a] border border-border flex items-center justify-center mb-6">
        <Music2 className="w-6 h-6 text-primary" />
      </div>
      <p className="text-6xl font-extrabold font-mono text-primary leading-none mb-3">404</p>
      <h1 className="text-xl font-bold text-foreground mb-2">Page not found</h1>
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90 transition-opacity"
      >
        &larr; Back to home
      </Link>
    </div>
  )
}
