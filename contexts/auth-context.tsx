"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  /** Spotify access token from OAuth provider - use for all Spotify API calls */
  spotifyToken: string | null
  /** Spotify refresh token - passed to server refresh endpoint when access token expires */
  spotifyRefreshToken: string | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  spotifyToken: null,
  spotifyRefreshToken: null,
  isLoading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null)
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const applySession = useCallback((s: Session | null) => {
    setSession(s)
    setUser(s?.user ?? null)
    setSpotifyToken(s?.provider_token ?? null)
    setSpotifyRefreshToken(s?.provider_refresh_token ?? null)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn("[AuthContext] Loading timeout - forcing isLoading to false")
      setIsLoading(false)
    }, 10000)

    const init = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error("[AuthContext] Error getting session:", sessionError)
          applySession(null)
          setIsLoading(false)
          return
        }
        applySession(session)
        setIsLoading(false)
      } catch (error) {
        console.error("[AuthContext] Init error:", error)
        applySession(null)
        setIsLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[AuthContext] Auth state changed:", session?.user?.id ?? "logged out")
      applySession(session)
      setIsLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [applySession])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Sign out error:", error)
    applySession(null)
  }, [applySession])

  return (
    <AuthContext.Provider value={{ user, session, spotifyToken, spotifyRefreshToken, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
