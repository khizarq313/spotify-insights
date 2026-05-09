"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useSpotifyProfile } from "@/hooks/use-spotify"
import {
  LayoutDashboard,
  Music2,
  Mic2,
  BarChart3,
  Grid3X3,
  Smile,
  IdCard,
  LogOut,
} from "lucide-react"

// Desktop sidebar + mobile bottom nav items
const SIDEBAR_ITEMS = [
  { href: "/dashboard",         label: "Dashboard",    icon: LayoutDashboard },
  { href: "/dashboard#tracks",  label: "Top Tracks",   icon: Music2          },
  { href: "/dashboard#artists", label: "Top Artists",  icon: Mic2            },
  { href: "/dashboard#genres",  label: "Genres",       icon: BarChart3       },
  { href: "/heatmap",           label: "Heatmap",      icon: Grid3X3         },
  { href: "/mood",              label: "Mood",         icon: Smile           },
  { href: "/card",              label: "Personality",  icon: IdCard          },
]

// Mobile bottom nav � page-level only (no hash sub-routes)
const BOTTOM_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { href: "/heatmap",   label: "Heatmap",     icon: Grid3X3         },
  { href: "/mood",      label: "Mood",        icon: Smile           },
  { href: "/card",      label: "Personality", icon: IdCard          },
]

function useIsActive(href: string) {
  const pathname = usePathname()
  // Hash sub-routes: active when on /dashboard
  if (href.includes("#")) return pathname === "/dashboard"
  // /dashboard exact match only
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname.startsWith(href)
}

function SidebarLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const active = useIsActive(href)
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[#313540] text-primary border-l-2 border-[#1ed760]"
          : "text-muted-foreground hover:bg-[#1b1f2a] hover:text-foreground border-l-2 border-transparent"
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : ""}`} />
      {label}
    </Link>
  )
}

function SidebarContent() {
  const { user, signOut } = useAuth()
  const { data: profile } = useSpotifyProfile()

  return (
    <div className="flex flex-col h-full py-6 px-3">
      {/* Logo */}
      <div className="px-4 mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary flex items-center justify-center shrink-0">
            <Music2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">Insights</span>
        </Link>
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mt-1 px-0.5 font-mono">
          Analytics Dashboard
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0 flex-1">
        {SIDEBAR_ITEMS.map(item => (
          <SidebarLink key={item.href} {...item} />
        ))}
      </nav>

      {/* User profile + sign out */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          {profile?.images[0]?.url ? (
            <img
              src={profile.images[0].url}
              alt={profile.display_name ?? "Profile"}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-primary">
              {(profile?.display_name ?? user?.email ?? "U")[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {profile?.display_name ?? user?.email?.split("@")[0] ?? "Listener"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {profile?.product === "premium" ? "Premium" : "Free"}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-muted-foreground hover:bg-[#1b1f2a] hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

function MobileTopBar() {
  const { user } = useAuth()
  const { data: profile } = useSpotifyProfile()
  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "Listener"
  const avatarUrl   = profile?.images[0]?.url ?? null

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f131d] border-b border-[#353944] z-40 flex items-center justify-between px-4 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary flex items-center justify-center">
          <Music2 className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm text-foreground tracking-tight">Insights</span>
      </Link>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-primary">
            {displayName[0]?.toUpperCase() ?? "?"}
          </span>
        )}
      </div>
    </header>
  )
}

function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-40 flex items-center justify-around lg:hidden safe-bottom">
      {BOTTOM_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className={`text-[10px] font-bold uppercase tracking-wider leading-none ${active ? "text-primary" : ""}`}>
              {label}
            </span>
            {/* Active indicator dot */}
            {active && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
          </Link>
        )
      })}
    </nav>
  )
}

export function SideNav() {
  return (
    <>
      {/* -- Desktop sidebar --------------------------------- */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 border-r border-border bg-background z-40">
        <SidebarContent />
      </aside>

      {/* -- Mobile top bar ---------------------------------- */}
      <MobileTopBar />

      {/* -- Mobile bottom nav ------------------------------- */}
      <MobileBottomNav />
    </>
  )
}

/** Wraps all dashboard/analytics pages. Provides sidebar offset on desktop,
 *  top-bar offset + bottom-nav clearance on mobile. */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SideNav />
      <main className="lg:ml-56 min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
