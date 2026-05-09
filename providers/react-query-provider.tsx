"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // Create a stable QueryClient instance per component mount (avoids shared state between requests)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Spotify data is highly cacheable; keep it fresh for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Keep inactive cache entries for 10 minutes before GC
            gcTime: 10 * 60 * 1000,
            // Retry once on failure (Spotify API can 429 transiently)
            retry: 1,
            retryDelay: 1000,
            // Don't refetch on window focus for stats — data doesn't change that fast
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
