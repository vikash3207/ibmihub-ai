import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const after = searchParams.get('after') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // For onboarding flows, next = /onboarding and after = the original destination
      const destination = next.startsWith('/onboarding')
        ? `${next}?next=${encodeURIComponent(after)}`
        : next
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Authentication+failed`)
}
