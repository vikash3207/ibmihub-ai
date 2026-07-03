import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'

/** Only allow same-origin, path-relative redirect targets -- never an external URL. */
function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/'
  }
  return value
}

/**
 * Supports opening /auth/logout directly in the browser (e.g. for manual
 * validation) as well as being used as a plain link/nav item.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const next = safeNextPath(searchParams.get('next'))

  const supabase = await createClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(`${origin}${next}`)
}

export async function POST() {
  await logout()
}
