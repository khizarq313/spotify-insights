/**
 * Next.js edge middleware — auth guard for protected routes.
 *
 * Routing rules
 * ─────────────
 * • Unauthenticated users hitting a PROTECTED_PATH  → /auth/login?returnUrl=<original>
 * • Authenticated users hitting /auth/login | /auth/signup → /dashboard
 * • All other routes pass through unchanged.
 *
 * Supabase session cookies are refreshed on every request (required by the
 * @supabase/ssr package to keep the session alive).
 */

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/** Routes that require an authenticated Spotify session. */
const PROTECTED_PATHS = ["/dashboard", "/heatmap", "/mood", "/card", "/profile"]

export async function middleware(request: NextRequest) {
  // We need to thread cookie mutations through the response, so track it here.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write cookies to both the forwarded request and the response so
          // the session stays refreshed across navigations.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add any logic between createServerClient and getUser().
  // getUser() validates the JWT with Supabase's server — it cannot be spoofed.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup"))
  ) {
    const returnUrl =
      request.nextUrl.searchParams.get("returnUrl") ?? "/dashboard"
    return NextResponse.redirect(new URL(returnUrl, request.url))
  }

  // Redirect unauthenticated users away from protected pages
  if (!user && PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("returnUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon files and images
     */
    "/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
