'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { resetPassword } from '@/lib/actions/auth'
import { RESET_PASSWORD_INITIAL_STATE } from '@/lib/auth-reset-state'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth-messages'
import { SubmitButton } from '@/components/ui/submit-button'
import { ResetSuccessContent } from '@/components/auth/reset-success-content'

/**
 * Password-reset form and its outcome (PR #187, success path reworked in
 * PR #192).
 *
 * The success screen is driven by the value the Server Action RETURNED, not
 * by a query parameter. PR #186 redirected to `?status=success`, which meant
 * anyone could type that URL and be told their password had changed. There
 * is no client-held flag standing in for authorisation either: the action
 * re-checks the Supabase recovery session server-side on every submission,
 * and Supabase rejects the update if it is not there.
 *
 * This client-rendered branch is instant feedback, not the lasting state.
 * Next.js refreshes the page's own Server Component tree right after this
 * action resolves, and app/auth/reset-password/page.tsx independently
 * reaches the same conclusion from its own server-issued success marker
 * (lib/auth-success-state.ts) -- which is what stops that refresh from
 * clobbering this with the invalid-link branch, the bug PR #192 fixes.
 * Rendering the identical ResetSuccessContent here means whichever one wins
 * the race, the learner sees the same thing.
 *
 * useFormState rather than useActionState because this repo is on React
 * 18.3.1; it is the same server-authoritative pattern under the earlier name.
 */
export function ResetPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, RESET_PASSWORD_INITIAL_STATE)

  if (state.status === 'success') {
    return <ResetSuccessContent destination={state.destination} />
  }

  return (
    <>
      {state.status === 'error' && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      )}

      {/* A dead link cannot be fixed by retyping the password, so point at
          the way out rather than leaving the learner looping on the form. */}
      {state.status === 'error' && state.failure === 'no-recovery-session' && (
        <p className="mb-4 text-center text-sm text-slate-500">
          <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:underline">
            Request a new reset link
          </Link>
        </p>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            New password
          </label>
          {/* No defaultValue: the submitted password is never returned in
              form state, so it is never re-rendered into the HTML. */}
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* SubmitButton disables itself via useFormStatus() while the action
            is in flight, so a double-click cannot submit the update twice. */}
        <SubmitButton variant="primary" className="w-full" pendingLabel="Updating...">
          Update Password
        </SubmitButton>
      </form>
    </>
  )
}
