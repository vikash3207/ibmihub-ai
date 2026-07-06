// Next.js 16 uses "proxy.ts" as the new convention for edge middleware.
// The previous "middleware.ts" convention is deprecated in Next.js 16.
// Functionality is identical -- this is a file rename only.

import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/** Routes that require authentication */
const PROTECTED_ROUTES = ['/dashboard', '/ai-tutor', '/onboarding']

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseResponse, user } = await updateSession(request)

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Unauthenticated user trying to reach a protected route -> redirect to login
  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return redirectPreservingSession(loginUrl, supabaseResponse)
  }

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
