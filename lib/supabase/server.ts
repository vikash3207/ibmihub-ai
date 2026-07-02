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
          } catch {
            // setAll called from a Server Component -- the session update
            // will be handled by the middleware on the next request.
          }
        },
      },
    }
  )
}
