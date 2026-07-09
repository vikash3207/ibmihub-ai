import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
          // TEMP AUTH DIAGNOSTIC (safe: no token/cookie values, remove after
          // the P0 auth-session investigation is closed out).
          console.log(`[auth-diag] middleware setAll: refreshed ${cookiesToSet.length} cookie(s) for path=${request.nextUrl.pathname}`)
        },
      },
    }
  )

  // Refresh the session so it does not expire
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMP AUTH DIAGNOSTIC (safe: no token/cookie values, remove after the P0
  // auth-session investigation is closed out).
  console.log(
    `[auth-diag] updateSession: path=${request.nextUrl.pathname} user=${user ? 'present' : 'null'} incomingCookies=${request.cookies.getAll().length}`
  )

  return { supabaseResponse, user }
}
