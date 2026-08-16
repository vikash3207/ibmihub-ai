'use client'

import { useFormState } from 'react-dom'
import { updateProfile } from '@/lib/actions/profile'
import { MAX_CONTACT_LENGTH, MAX_NAME_LENGTH, UPDATE_PROFILE_INITIAL_STATE } from '@/lib/profile'
import { SubmitButton } from '@/components/ui/submit-button'

interface ProfileFormProps {
  email: string
  initialFirstName: string | null
  initialLastName: string | null
  initialContactNumber: string | null
}

/**
 * The My Profile form (Basic User Profile & Header Avatar enhancement).
 *
 * Email is rendered as plain read-only text, not an input -- there is no
 * `email` field in this form at all, so there is nothing for a client to
 * submit even if the request were tampered with. lib/actions/profile.ts
 * always sources the displayed and stored identity from
 * `supabase.auth.getUser()`, never from anything this form sends.
 *
 * useFormState rather than useActionState because this repo is on React
 * 18.3.1 (same reasoning as components/auth/reset-password-form.tsx).
 */
export function ProfileForm({ email, initialFirstName, initialLastName, initialContactNumber }: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfile, UPDATE_PROFILE_INITIAL_STATE)

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'success' && (
        <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.message}
        </div>
      )}

      {state.status === 'error' && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div>
        {/* A <p>, not a <label> -- there is no form control here for a label
            to associate with. Not an input either: nothing named "email" is
            ever submitted by this form, so the account's verified address
            cannot be edited here. */}
        <p className="block text-sm font-medium text-slate-700 mb-1">Email address</p>
        <p className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          {email}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            maxLength={MAX_NAME_LENGTH}
            defaultValue={initialFirstName ?? ''}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            maxLength={MAX_NAME_LENGTH}
            defaultValue={initialLastName ?? ''}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-700 mb-1">
          Contact number <span className="text-slate-500">(optional)</span>
        </label>
        <input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          autoComplete="tel"
          maxLength={MAX_CONTACT_LENGTH}
          defaultValue={initialContactNumber ?? ''}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      <SubmitButton variant="primary" className="w-full sm:w-auto" pendingLabel="Saving...">
        Save changes
      </SubmitButton>
    </form>
  )
}
