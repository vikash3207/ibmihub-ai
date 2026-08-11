import Link from 'next/link'
import type { Metadata } from 'next'
import { resetPassword } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { postAuthDestinationFor } from '@/lib/auth-destination'
import { PASSWORD_UPDATED_MESSAGE } from '@/lib/auth-messages'
import { AuthCard } from '@/components/auth-card'
import { buttonVariants } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'

// Not useful search-result content, and excluded from app/sitemap.ts --
// explicitly opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ error?: string; status?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error, status } = await searchParams

  // Reached only via the redirect resetPassword performs after
  // supabase.auth.updateUser() actually succeeded -- there is no path that
  // renders this wording on a failure.
  if (status === 'success') {
    // Resolved server-side rather than carried in the URL, so the
    // continuation target cannot be influenced by the link the learner
    // clicked. postAuthDestinationFor returns a literal union of internal
    // paths, and applies exactly the onboarding rule this flow used before.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_response, onboarding_skipped')
      .eq('id', user?.id ?? '')
      .maybeSingle()
    const destination = postAuthDestinationFor(profile)

    return (
      <AuthCard title="Password updated" subtitle="You are signed in and ready to carry on.">
        {/* A full page, not a toast: it stays until the learner chooses to
            move on. role="status" announces it without stealing focus. */}
        <div
          role="status"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {PASSWORD_UPDATED_MESSAGE}
        </div>

        <Link href={destination} className={buttonVariants({ variant: 'primary', className: 'w-full' })}>
          Continue to iRPGenie
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a new password for your account.">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* An expired or already-used link fails here, so offer the way out
          rather than leaving the learner on a form that cannot succeed. */}
      {error && (
        <p className="mb-4 text-center text-sm text-slate-500">
          <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:underline">
            Request a new reset link
          </Link>
        </p>
      )}

      <form className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* SubmitButton disables itself via useFormStatus() while the action
            is in flight, so a double-click cannot submit the update twice. */}
        <SubmitButton formAction={resetPassword} variant="primary" className="w-full" pendingLabel="Updating...">
          Update Password
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
