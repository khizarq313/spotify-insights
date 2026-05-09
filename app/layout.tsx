import type React from "react"
import type { Metadata } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ReactQueryProvider } from "@/providers/react-query-provider"
import { Toaster } from "sonner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "Spotify Insights",
    template: "%s | Spotify Insights",
  },
  description: "Deep Spotify listening statistics — top tracks, artists, genres, mood analysis, and shareable music personality cards.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://spotify-insights.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Spotify Insights",
    title: "Spotify Insights — Understand Your Music Personality",
    description: "Deep-dive Spotify analytics. Discover patterns in your listening history, visualise your sonic identity, and share the results.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify Insights",
    description: "Deep-dive Spotify analytics. Discover patterns in your listening history, visualise your sonic identity, and share the results.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <ReactQueryProvider>
          <AuthProvider>
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          </AuthProvider>
        </ReactQueryProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#171b26",
              border: "1px solid #353944",
              color: "#dfe2f0",
            },
          }}
        />
      </body>
    </html>
  )
}
