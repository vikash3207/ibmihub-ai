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
          } catch (err) {
            // Next.js only allows cookie mutation from a Server Action or
            // Route Handler; Server Components must not write cookies. That
            // specific, expected error is the ONLY thing this should
            // silently ignore -- anything else is a genuine cookie-write
            // failure (e.g. inside login()) that must not be hidden behind
            // what would otherwise look like a successful, silent no-op.
            const message = err instanceof Error ? err.message : String(err)
            const isExpectedServerComponentError = message.includes('Cookies can only be modified')

            if (!isExpectedServerComponentError) {
              console.error('Unexpected error while writing Supabase session cookies:', message)
              throw err
            }
          }
        },
      },
    }
  )
}
