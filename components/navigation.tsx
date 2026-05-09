"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Music2 } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <Music2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight text-sm">Spotify Insights</span>
        </Link>

        {/* Centre links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">Features</a>
          <a href="#stats"    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">Stats</a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 transition-opacity"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
