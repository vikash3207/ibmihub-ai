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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseResponse, user } = await updateSession(request)

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Unauthenticated user trying to reach a protected route → redirect to login
  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user hitting a sign-up/login page → redirect to dashboard
  if (user && PUBLIC_AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
