# Spotify Insights — Project Context
> 8x Engineering Contest | Stats.fm Clone
> Last updated: Prompt 8 (Phase 7 — UI Polish complete)

---

## What We're Building

A web app that connects to Spotify via OAuth and provides deep listening statistics — a stats.fm clone. Users get top tracks/artists/genres by time period, a listening heatmap, mood analysis, and a shareable music personality card.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Supabase Auth with **Spotify OAuth provider** |
| Database | Supabase Postgres (caching, user prefs) |
| Spotify API | Spotify Web API via access token from Supabase session |
| Charts | recharts |
| Card Export | html2canvas / dom-to-image-more |
| Package Manager | pnpm |

---

## Template Starter Bundle

Base: `template-webapp-main` (8x hiring template)  
Source: https://github.com/bigowash/8x-hiring-template

**Pre-built in template (keep/adapt):**
- `lib/supabase/` — client, server, admin, middleware Supabase helpers
- `contexts/auth-context.tsx` — Supabase session state (will extend for Spotify token)
- `contexts/subscription-context.tsx` — free/pro tier (keep, used for premium stats gating)
- `components/navigation.tsx`, `components/footer.tsx` — layout shell
- `components/ui/` — full shadcn/ui component set
- `app/auth/` — login / signup / check-email pages (will replace login with Spotify OAuth button)
- `app/upgrade/`, `app/profile/` — keep and adapt
- `supabase/migrations/` — subscriptions table (keep)

---

## Key Architecture Decisions

1. **Supabase Spotify OAuth** — Instead of email/password, the only login is "Connect with Spotify". Supabase handles the OAuth dance and stores the provider token in the session. We read `session.provider_token` as the Spotify access token.
2. **Token refresh** — Supabase does NOT auto-refresh provider (Spotify) tokens. We need a utility that detects expiry and calls `/api/auth/refresh-spotify` which uses the provider_refresh_token to get a new access token.
3. **Supabase caching** — Raw Spotify API responses are cached in a `spotify_cache` table (keyed by user_id + endpoint + time_range) to avoid hammering rate limits and to enable offline-like reads.
4. **Client-side Spotify calls** — All Spotify Web API calls (top tracks, artists, etc.) happen from the browser using the `provider_token` from the Supabase session.
5. **Token refresh = server route** — `/api/auth/refresh-spotify` is server-only so `SPOTIFY_CLIENT_SECRET` is never exposed to the browser. This is the only server involvement in the Spotify flow.
6. **Stats derived on the client** — Heatmap, mood scores, genre diversity are computed in-memory from raw API data; nothing heavy enough to warrant a server function.
7. **Service layer** — Raw Spotify responses flow through `lib/spotify/transformers.ts` before reaching any UI component. Components only ever receive `NormalizedTrack` / `NormalizedArtist` etc., never raw Spotify shapes.

---

## Spotify API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /me` | User profile, display name, avatar |
| `GET /me/top/tracks?time_range={short\|medium\|long}_term&limit=50` | Top tracks (4w / 6m / all-time) |
| `GET /me/top/artists?time_range={short\|medium\|long}_term&limit=50` | Top artists (4w / 6m / all-time) |
| `GET /me/recently-played?limit=50` | Last 50 plays with timestamps → heatmap |
| `GET /audio-features?ids=...` | Audio features (valence, energy, danceability, etc.) for mood analysis |

---

## Features Checklist

- [ ] Spotify OAuth login ("Connect with Spotify" button)
- [ ] Top Tracks — 4-week / 6-month / all-time tabs
- [ ] Top Artists — 4-week / 6-month / all-time tabs
- [ ] Top Genres — derived from top artists, shown as ranked list + bubble cloud
- [ ] Listening Heatmap — hour-of-day × day-of-week grid from recently-played
- [ ] Mood Score — avg valence/energy/danceability from top tracks audio features
- [ ] Genre Diversity Score — entropy-based score from genre distribution
- [ ] Shareable Personality Card — music personality type + top 3 tracks/artists, exportable as PNG

---

## Database Schema (Supabase)

### Existing (from template)
```sql
subscriptions(id, user_id, tier, created_at, updated_at)
```

### To Add
```sql
-- Cache for Spotify API responses
spotify_cache(
  id uuid PK,
  user_id uuid FK → auth.users,
  cache_key text,          -- e.g. "top_tracks:short_term"
  data jsonb,
  fetched_at timestamptz,
  UNIQUE(user_id, cache_key)
)

-- User Spotify profile snapshot
spotify_profiles(
  user_id uuid PK FK → auth.users,
  spotify_id text,
  display_name text,
  avatar_url text,
  country text,
  updated_at timestamptz
)
```

---

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # server-side only
SPOTIFY_CLIENT_ID=                   # for token refresh edge function
SPOTIFY_CLIENT_SECRET=               # server-side only
```

---

## Project Structure (target)

```
spotify-insights/
├── ai-logs/
│   └── log.md
├── context.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx                   # Landing / connect Spotify CTA
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx               # Main stats dashboard
│   ├── top/
│   │   ├── tracks/page.tsx
│   │   └── artists/page.tsx
│   ├── heatmap/page.tsx
│   ├── mood/page.tsx
│   ├── card/page.tsx              # Shareable personality card
│   ├── auth/
│   │   └── callback/route.ts      # Supabase OAuth callback handler
│   ├── profile/page.tsx
│   └── api/
│       └── auth/
│           └── refresh-spotify/route.ts
├── components/
│   ├── navigation.tsx
│   ├── footer.tsx
│   ├── spotify-connect-button.tsx
│   ├── stats/
│   │   ├── top-tracks.tsx
│   │   ├── top-artists.tsx
│   │   ├── genre-cloud.tsx
│   │   ├── listening-heatmap.tsx
│   │   ├── mood-radar.tsx
│   │   └── personality-card.tsx
│   └── ui/                        # shadcn/ui (from template)
├── contexts/
│   ├── auth-context.tsx           # Extended for Spotify token
│   └── subscription-context.tsx   # From template
├── hooks/
│   ├── use-spotify.ts             # React Query hooks for Spotify data
│   └── use-mobile.ts
├── lib/
│   ├── spotify/
│   │   ├── client.ts              # Spotify API fetch wrapper (rate-limit + backoff + cache fallback)
│   │   ├── types.ts               # Spotify response types
│   │   └── transformers.ts        # Normalized service layer: SpotifyTrack → NormalizedTrack etc.
│   ├── supabase/                  # From template
│   └── utils.ts
└── supabase/
    ├── config.toml
    └── migrations/
        ├── 20251223234735_create_subscriptions_table.sql
        └── 20260508000000_spotify_cache.sql
```

---

## Build Phases

| Phase 7 | Status | Scope |
|-------|--------|-------|
| **Phase 1** — Setup | ✅ Complete | Scaffold project from template, rebrand, configure Spotify app, set up Supabase Spotify OAuth, env vars |
| **Phase 2** — Auth | ✅ Complete | React Query provider wired globally, Spotify API client + types, token refresh API route, full set of React Query hooks (useTopTracks etc.) |
| **Phase 3** — Architecture + Dashboard | ✅ Complete | 429 rate-limit handling (retry-after + exp backoff + cache fallback), transformer service layer, route-protection middleware, full dashboard (profile header, Top Tracks / Top Artists / Genres tabs) |
| **Phase 4** — Advanced Analytics | ✅ Complete | Listening heatmap (hour×day grid), mood radar chart, genre diversity score |
| **Phase 5** — Shareable Card | ✅ Complete | Personality type algorithm, card UI, PNG export via html2canvas |
| **Phase 6** — Polish | ✅ Complete | Loading skeletons, error states, full responsive pass |
| **Phase 7** — UI Polish | ✅ Complete | Design-stitch alignment, flat design system, bento layouts, tab redesign, full responsive pass |
| **Phase 7** — UI Polish | ✅ Complete | Design-stitch alignment, flat design, bento layouts, tab redesign, responsive pass |

---

## Notes / Decisions Log

- **2026-05-08 (Prompt 4 — Phase 3):** Architecture hardening + dashboard built. `lib/spotify/client.ts`: added `sleep()` helper, module-level `_responseCache` Map, `spotifyFetch()` now retries up to 3× on 429 (reads `Retry-After` header, falls back to exponential backoff with ±500 ms jitter, serves stale cache if all retries exhaust). `lib/spotify/transformers.ts`: new service layer with `NormalizedTrack`, `NormalizedArtist`, `NormalizedAudioFeatures` types + `transformTrack()`, `transformArtist()`, `transformAudioFeatures()`, `deriveGenreCounts()`, `deriveMoodProfile()`, `deriveHeatmap()` functions. `middleware.ts` (root): Next.js edge middleware validates Supabase JWT server-side, redirects unauthenticated users from `/dashboard`, `/heatmap`, `/mood`, `/profile` to `/auth/login?returnUrl=…`; redirects authenticated users away from `/auth/login`. `components/stats/top-tracks.tsx`, `top-artists.tsx`, `genre-cloud.tsx`: client components consuming normalized data via React Query hooks with 3 time-range tabs each (4w/6m/all-time), loading skeletons, error states, popularity bars. `app/dashboard/page.tsx`: replaced placeholder with full implementation — Spotify profile header, section tabs (Tracks / Artists / Genres), auth guard removed from component (middleware handles it).
- **2026-05-08 (Prompt 3 — Phase 2):** React Query moved to Phase 2 (was Phase 3). `ReactQueryProvider` wraps the entire app in `layout.tsx`; `QueryClient` uses 5-min staleTime / 10-min gcTime / no refetch-on-focus. Spotify types file covers all API response shapes plus derived types (`MoodProfile`, `GenreCount`, `HeatmapCell`). `spotifyFetch()` base wrapper with `SpotifyApiError` class. Endpoint helpers for all 5 API calls. Token refresh route at `/api/auth/refresh-spotify` exchanges `provider_refresh_token` server-side. Hooks (`useSpotifyProfile`, `useTopTracks`, `useTopArtists`, `useRecentlyPlayed`, `useAudioFeatures`) all include transparent 401-refresh-retry using `useRef` to avoid stale closures.** Scaffolded full project from template. Rebranded to Spotify green theme. Created `spotify_cache` + `spotify_profiles` DB tables. Replaced email/password login with Spotify OAuth (`signInWithOAuth`). Auth callback route at `/auth/callback` exchanges code for session. `AuthContext` now exposes `spotifyToken` and `spotifyRefreshToken` from `session.provider_token`. Landing page built with hero + feature grid. Placeholder dashboard with auth guard. Dependencies added: recharts, html2canvas, @tanstack/react-query.
- The template's `SubscriptionContext` will be repurposed: free tier = basic stats, pro tier = heatmap + mood + shareable card (premium gating for contest scoring).
- No SSR for Spotify data calls — everything is client-fetched to keep the architecture simple and avoid server-side token storage.



---

## Phase 4 � Design Overhaul + Advanced Analytics (? Complete)

**Date:** Prompt 5

### Design System
- All colors are flat hex � no gradients, no shadows, no blurs.
- Tokens: `--background: #0a0e17`, `--card: #171c25`, `--primary: #1ed760`, `--border: #262a34`, `--muted-foreground: #bbcbb8`
- Fonts: Geist (body) + JetBrains Mono (mono/stats)
- All pages are fully responsive

### Files Changed/Created
| File | Change |
|------|--------|
| `app/globals.css` | Complete rewrite � design tokens, heatmap scale, scrollbar |
| `app/layout.tsx` | JetBrains Mono, removed Footer |
| `components/navigation.tsx` | Minimal fixed top bar for public pages |
| `components/side-nav.tsx` | SideNav + DashboardLayout (lg sidebar + mobile drawer) |
| `app/page.tsx` | Flat landing page � hero, stats, feature grid, CTA |
| `app/auth/login/page.tsx` | Flat login card |
| `app/dashboard/page.tsx` | Profile header + quick links + tabs (Tracks/Artists/Genres) |
| `components/error-boundary.tsx` | React class ErrorBoundary with retry |
| `components/stats/top-tracks.tsx` | Redesigned + ErrorBoundary |
| `components/stats/top-artists.tsx` | Redesigned + ErrorBoundary |
| `components/stats/genre-cloud.tsx` | Redesigned + ErrorBoundary |
| `components/stats/listening-heatmap.tsx` | NEW � 7�24 heatmap grid |
| `app/heatmap/page.tsx` | NEW � heatmap page |
| `components/stats/mood-bars.tsx` | NEW � 5 audio feature bars |
| `app/mood/page.tsx` | NEW � mood analysis page |

### Architecture Notes
- All dashboard pages use `DashboardLayout` from `components/side-nav.tsx`
- Stats sections wrapped in `<ErrorBoundary>` for resilience
- `/heatmap` and `/mood` already in `middleware.ts` protected paths



---

## Phase 5 � Shareable Personality Card (Complete)

**Date:** Prompt 6

### Files Created
| File | Purpose |
|------|---------|
| `lib/spotify/personality.ts` | Personality algorithm � 9 archetypes, obscurity/energy/groove traits, auraScore |
| `components/stats/personality-card.tsx` | Shareable card UI (forwardRef, 420px, flat design, CORS-safe images) |
| `app/card/page.tsx` | Card page � data fetching, CardSkeleton, html2canvas export, Web Share API |
| `middleware.ts` | Added `/card` to PROTECTED_PATHS |

### Personality Archetypes
The Alchemist, The Groovemaster, The Euphoric, The Dreamer, The Nostalgist, The Philosopher, The Seeker, The Tastemaker, The Mainstreamer, The Balanced

### Export Implementation
- html2canvas dynamically imported (code-split � zero overhead at page load)
- scale: 2 for retina-quality output
- useCORS: true + crossOrigin="anonymous" on all images
- Web Share API with canShare() guard + download fallback



---

## Phase 6 - Final Polish (Complete)

**Date:** Prompt 7

### Files Changed
| File | Change |
|------|--------|
| `components/side-nav.tsx` | Replaced hamburger/drawer with mobile top bar + bottom nav bar |
| `next.config.ts` | Added Spotify CDN + Google image domains |
| `app/layout.tsx` | Full OG + Twitter metadata with metadataBase |
| `app/not-found.tsx` | Minimal flat 404 page |
| `app/loading.tsx` | Root loading spinner (new file) |
| `app/page.tsx` | Feature card accent bars, unicode fixes, active:scale CTA |
| `app/dashboard/page.tsx` | 3-column quick links (Heatmap + Mood + Personality) |

### Mobile Navigation Pattern
- Mobile (< lg): Fixed top bar (h-14) + fixed bottom nav (h-16) with 4 tabs
- Desktop (lg+): Fixed 224px left sidebar
- DashboardLayout padding: pt-14 pb-20 on mobile, no offset on desktop

### Production Checklist
- [x] Metadata: title template, OG, Twitter cards
- [x] Image CDN domains configured
- [x] 404 page
- [x] Root loading.tsx
- [x] No TS errors across all files
- [x] Route protection via middleware.ts
- [x] html2canvas dynamic import (code split)
- [x] Rate-limit handling with exponential backoff
- [x] Token refresh server route (no secret leakage)

---

## Phase 7 � UI Polish (Complete)

### Design System: Minimal Dark Utility
Fully aligned to design-stitch/minimal_dark_utility/DESIGN.md. Core principle: **absolute flatness** � no gradients, no box-shadows, no blurs. Square corners on interactive elements; flat border dividers only.

### Updated Design Tokens (pp/globals.css)
| Token | Old | New |
|-------|-----|-----|
| `--background` | #0a0e17 | #0f131d |
| `--card` | #171c25 | #171b26 |
| `--border` | #262a34 | #353944 |
| `--surface-container-highest` | � | #313540 (new) |
| `--surface-container-low` | � | #171b26 (new) |
| `--surface-container-high` | � | #242833 (new) |

### Files Changed

| File | Change |
|------|--------|
| `app/globals.css` | Updated background/card/border tokens; added surface-container tokens |
| `components/navigation.tsx` | Square logo; centre anchor links; flat primary CTA button (uppercase) |
| `components/side-nav.tsx` | Active item: bg-[#313540] + left border-primary; square logo; flat hover |
| `app/page.tsx` | Hero: secondary "See Features" CTA + dashboard mockup preview; bento feature grid; flat CTAs; anchor ids |
| `app/auth/login/page.tsx` | Full redesign: centered card, square logo, flat permissions block, flat CTA (uppercase), mono footer |
| `app/dashboard/page.tsx` | Bento quick-links with dividers and colored left accent bars; flat section tabs |
| `components/stats/top-tracks.tsx` | Flat underline tabs (border-b-2); row hover bg-[#1b1f2a]; border dividers |
| `components/stats/top-artists.tsx` | Same tab/row changes as top-tracks |
| `components/stats/genre-cloud.tsx` | Flat underline tabs |
| `components/stats/listening-heatmap.tsx` | Flat error state (no rounded-lg) |
| `components/stats/mood-bars.tsx` | Flat error state; flat summary cards; fixed keyof MoodProfile type |
| `app/heatmap/page.tsx` | Flat header (mono label + h1); flat card border |
| `app/mood/page.tsx` | Flat header; flat card border |
| `app/card/page.tsx` | Flat header; flat Download/Share buttons (uppercase); flat "How it works" |
| `components/error-boundary.tsx` | Flat border; mono font; uppercase retry button |
| `app/not-found.tsx` | Square icon container; flat primary CTA (uppercase) |

### Tab Pattern (Flat Underline)
All stats tabs now use flat underline style instead of pill/bg:
```tsx
<div className="flex border-b border-border mb-6">
  <button className="border-b-2 -mb-px pb-2 text-xs uppercase tracking-widest
    border-primary text-primary | border-transparent text-muted-foreground">
```

### Bento Quick Links Pattern
```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-0 mb-10 border border-border">
  <div className="border-b sm:border-b-0 sm:border-r border-border p-5">
    <div className="w-0.5 h-8 bg-cyan-400 mb-4" /> {/* accent bar */}
  </div>
</div>
```

---

## Bug Fix Session (Phase 7 � Post-Polish)

### Bugs Found and Fixed

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `app/auth/login/page.tsx` | **CRITICAL** � File truncated to 7 import lines by PowerShell `Set-Content`. No component/export � caused "Runtime Error: The default export is not a React Component in /auth/login/page" | Complete rewrite with correct `export default` wrapped in Suspense boundary |
| 2 | `app/auth/login/page.tsx` | `?error=` query param from OAuth callback was not displayed to the user | Added `useSearchParams()` hook reading and displaying `error` param in the error state |
| 3 | `app/profile/page.tsx` | Supabase `user.email` is `string \| undefined` but `ProfileClientProps.email` expects `string` � TypeScript error + potential crash if email absent | Changed `user` prop to `{ id: user.id, email: user.email ?? "" }` |
| 4 | `components/side-nav.tsx` | Mobile bottom nav active dot (`absolute bottom-1`) was positioned relative to `<nav>` (`fixed`), not the Link � dots from all items stacked at bottom of nav | Added `relative` class to each `<Link>` in `MobileBottomNav` |
| 5 | `app/layout.tsx` | Toaster used old design token colors (`background: #171c25`, `border: #262a34`) after Phase 7 token update | Updated to `#171b26` / `#353944` |
| 6 | `app/card/page.tsx` | `html2canvas` background color was old `#171c25` in both Download and Share handlers | Updated both to `#171b26` |
| 7 | `app/auth/check-email/page.tsx` | Inconsistent design � used `rounded-full` icon container and `Button` component, mismatched Phase 7 flat design system | Rewritten with square icon container, flat `Link` button, removed `Button` import |
