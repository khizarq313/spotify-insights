"use client"

import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Music2, Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

const PERMISSIONS = [
  "Your top tracks and artists",
  "Recently played history",
  "Profile info (name, avatar)",
  "Subscription tier (free/premium)",
]

function LoginPageInner() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Show OAuth errors sent back via ?error= from the callback route
  useEffect(() => {
    const oauthError = searchParams.get("error")
    if (oauthError) {
      const raw = decodeURIComponent(oauthError)
      // Supabase throws this when Spotify credentials aren't configured in the
      // Supabase project (dashboard → Auth → Providers → Spotify), or when the
      // Spotify app's Redirect URI doesn't include the Supabase callback URL.
      if (raw.toLowerCase().includes("external provider") || raw.toLowerCase().includes("provider")) {
        setError(
          "Spotify authentication failed. Please try again — if the issue persists, the Spotify OAuth provider may not be configured correctly in Supabase."
        )
      } else {
        setError(raw)
      }
    }
  }, [searchParams])

  // Redirect already-authenticated users
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          scopes: [
            "user-top-read",
            "user-read-recently-played",
            "user-read-private",
            "user-read-email",
          ].join(" "),
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect. Please try again.")
      setIsConnecting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <main className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-card border border-border p-10 flex flex-col items-center text-center">

          {/* Branding */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 flex items-center justify-center bg-[#1b1f2a] border border-border mb-1">
              <Music2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Spotify Insights</h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
              Authenticate to access advanced telemetry and raw listening data.
            </p>
          </div>

          {/* Permissions block */}
          <div className="w-full text-left space-y-2 border border-border bg-background p-4 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 font-mono">
              Read-only access to:
            </p>
            {PERMISSIONS.map(p => (
              <div key={p} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                {p}
              </div>
            ))}
          </div>

          {/* Error state */}
          {error && (
            <div className="w-full flex items-center gap-2 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-left">{error}</span>
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect with Spotify
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-8 flex flex-col gap-2">
            <p className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground/50 uppercase">
              Secure OAuth 2.0 Connection
            </p>
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground">
              <a href="/terms"   className="hover:text-primary transition-colors underline underline-offset-4">Terms</a>
              <span className="text-muted-foreground/30">|</span>
              <a href="/privacy" className="hover:text-primary transition-colors underline underline-offset-4">Privacy</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// useSearchParams requires a Suspense boundary in Next.js App Router
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-border border-t-primary animate-spin" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  )
}

