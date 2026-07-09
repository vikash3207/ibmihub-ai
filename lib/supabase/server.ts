/**
 * Supabase server client (anon key).
 * Uses the public anon key -- subject to Row-Level Security policies.
 * Safe for Server Actions, Route Handlers, and Server Components.
 *
 * For service-role access see lib/supabase/admin.ts
 */
import 'server-only'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            )
            // TEMP AUTH DIAGNOSTIC (safe: no token/cookie values, remove after
            // the P0 auth-session investigation is closed out).
            console.log(`[auth-diag] server.ts setAll: wrote ${cookiesToSet.length} cookie(s)`)
          } catch (err) {
            // Next.js only allows cookie mutation from a Server Action or
            // Route Handler; Server Components must not write cookies. That
            // specific, expected error is the ONLY thing this should
            // silently ignore -- anything else was previously swallowed
            // unconditionally, which could hide a genuine cookie-write
            // failure inside a Server Action (e.g. login()) behind what
            // looked like a successful, silent no-op. Re-throwing anything
            // unexpected surfaces it instead of hiding it.
            const message = err instanceof Error ? err.message : String(err)
            const isExpectedServerComponentError = message.includes('Cookies can only be modified')

            if (isExpectedServerComponentError) {
              console.log('[auth-diag] server.ts setAll: skipped (read-only Server Component context)')
            } else {
              console.error('[auth-diag] server.ts setAll: UNEXPECTED error while writing cookies:', message)
              throw err
            }
          }
        },
      },
    }
  )
}
