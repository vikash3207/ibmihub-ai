import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SITE_NAME } from '@/lib/config'

/**
 * Shared public header. Server component only -- checks the Supabase session
 * server-side to decide Log in vs. Log out. Intentionally does not read or
 * display any user profile fields (email, id, etc.); it only needs to know
 * whether a session exists. No account menu, per Batch 2 scope.
 */
export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMP AUTH DIAGNOSTIC (safe: no token/cookie values, remove after the P0
  // auth-session investigation is closed out).
  console.log(`[auth-diag] site-header: user=${user ? 'present' : 'null'}`)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-y-2">
        <Link href="/" className="font-semibold text-slate-900">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/learn"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Learning Center
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/ai-tutor"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                AI Tutor
              </Link>
              <Link
                href="/auth/logout"
                className="text-sm font-medium text-slate-900 hover:underline"
              >
                Log out
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-900 hover:underline"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
