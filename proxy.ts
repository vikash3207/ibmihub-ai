// Next.js 16 uses "proxy.ts" as the new convention for edge middleware.
// The previous "middleware.ts" convention is deprecated in Next.js 16.
// Functionality is identical -- this is a file rename only.

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/** Routes that are always public (no redirect even if logged in) */
const PUBLIC_AUTH_ROUTES = [
  '/auth/login',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
]

/**
 * Any redirect issued by this middleware must carry over the cookies
 * updateSession() may have just refreshed onto supabaseResponse. Supabase
 * rotates the refresh token on every refresh; a redirect built from scratch
 * (NextResponse.redirect(...)) does not inherit supabaseResponse's Set-Cookie
 * headers, so the browser would be left holding an already-invalidated
 * refresh token. The user is then silently logged out server-side on the
 * next request that needs a refresh -- visible as protected pages and
 * Server Actions treating a logged-in user as logged out (P0 regression
 * found during Batch 21 validation).
 */
function redirectPreservingSession(url: URL, supabaseResponse: NextResponse): NextResponse {
  const redirectResponse = NextResponse.redirect(url)
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })
  return redirectResponse
}

/**
 * This middleware intentionally does NOT redirect unauthenticated users away
 * from protected routes (/dashboard, /ai-tutor, /onboarding). It previously
 * did, but that duplicated a check every one of those pages already performs
 * server-side (`if (!user) redirect('/auth/login')`), and the duplication
 * was the root of a P0 regression: middleware-level auth redirects built
 * from scratch (NextResponse.redirect) are easy to get subtly wrong around
 * cookie propagation, and a divergence between the middleware's auth check
 * and the page's own auth check made logged-in users bounce back to login.
 * Per the investigation, middleware now does exactly one auth job: refresh
 * the session cookie on every request (updateSession) so each page's own
 * getUser() call sees a fresh session. Each protected page remains the
 * single source of truth for whether access is allowed.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseResponse, user } = await updateSession(request)

  // Authenticated user hitting a sign-up/login page -> redirect home
  if (user && PUBLIC_AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return redirectPreservingSession(new URL('/', request.url), supabaseResponse)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - Public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
