import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { ProfileForm } from '@/components/profile-form'

// Account-specific content and excluded from app/sitemap.ts -- explicitly
// opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'My Profile',
  robots: { index: false, follow: false },
}

// Auth-gated page -- never statically cache; always compute fresh per
// request so a stale build-time snapshot never serves one learner's
// profile fields to another visitor.
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=%2Fprofile')
  }

  // user.id comes from getUser() -- a verified round trip to Supabase --
  // never from a route param or anything else a browser could supply, so
  // this can only ever read the signed-in visitor's own row (also enforced
  // independently by RLS).
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('first_name, last_name, contact_number')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="mx-auto max-w-lg">
      <Card className="p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Profile</h1>
        <p className="text-sm text-slate-500 mb-6">Update your basic account details.</p>

        <ProfileForm
          email={user.email ?? ''}
          initialFirstName={profile?.first_name ?? null}
          initialLastName={profile?.last_name ?? null}
          initialContactNumber={profile?.contact_number ?? null}
        />
      </Card>
    </div>
  )
}
