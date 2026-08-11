'use server'

/**
 * Basic profile update (Basic User Profile & Header Avatar enhancement).
 *
 * Deliberately its own file, separate from lib/actions/auth.ts. That file
 * carries the signup/login/logout/password-recovery Server Actions that
 * have been through several recent hotfixes (PRs #183-192) and touches
 * CAPTCHA, session cookies, and the recovery/success markers -- none of
 * which this feature needs. Keeping profile updates in their own file means
 * this change cannot regress any of that by construction: nothing here
 * imports or calls anything auth-flow-specific beyond createClient() and
 * getUser(), both read-only with respect to session state.
 */

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  CONTACT_INVALID_MESSAGE,
  CONTACT_TOO_LONG_MESSAGE,
  MAX_CONTACT_LENGTH,
  NAME_TOO_LONG_MESSAGE,
  isValidContactNumber,
  isValidName,
  normalizeContactNumber,
  normalizeName,
} from '@/lib/profile'

export type UpdateProfileState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | {
      status: 'success'
      message: string
      firstName: string | null
      lastName: string | null
      contactNumber: string | null
    }

export const UPDATE_PROFILE_INITIAL_STATE: UpdateProfileState = { status: 'idle' }

/**
 * Updates the signed-in user's own basic profile fields.
 *
 * SECURITY: the row updated is always `.eq('id', user.id)`, where `user`
 * comes from `supabase.auth.getUser()` -- a verified round trip to Supabase,
 * not a value read from the form or any other client-supplied input. There
 * is no id field in the form at all, so there is nothing for a client to
 * supply here even if it tried. Email is never read from the form either
 * (the profile page renders it as plain text, not an input), so it cannot
 * be part of this update regardless of what a tampered request contains.
 */
export async function updateProfile(
  _previousState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'error', message: 'Your session has expired. Please log in again.' }
  }

  const firstName = normalizeName(formData.get('firstName'))
  const lastName = normalizeName(formData.get('lastName'))
  const contactNumber = normalizeContactNumber(formData.get('contactNumber'))

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return { status: 'error', message: NAME_TOO_LONG_MESSAGE }
  }

  if (!isValidContactNumber(contactNumber)) {
    // Length is checked first inside isValidContactNumber implicitly via
    // the message chosen here: an over-length value and an invalid-character
    // value get their own message so the learner knows which to fix.
    const message =
      contactNumber && contactNumber.length > MAX_CONTACT_LENGTH ? CONTACT_TOO_LONG_MESSAGE : CONTACT_INVALID_MESSAGE
    return { status: 'error', message }
  }

  // .select('id').maybeSingle() matters here: a plain .update() with no
  // .select() returns no error and no data when it matches zero rows (e.g.
  // the trigger-created row is somehow missing), which would otherwise let
  // "Profile updated" be shown even though nothing was actually written.
  // Requiring a returned row id is what catches that. This never widens who
  // can be updated -- .eq('id', user.id) is unchanged, still scoped to the
  // verified session user and still enforced independently by RLS -- it
  // only stops a no-op update from being reported as a success.
  const { data: updated, error } = await supabase
    .from('user_profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      contact_number: contactNumber,
    })
    .eq('id', user.id)
    .select('id')
    .maybeSingle()

  if (error || !updated) {
    // Only a stable, non-sensitive code, never the raw message -- consistent
    // with how lib/actions/auth.ts logs Supabase failures elsewhere in this
    // repo. 'no_row_updated' is our own label for the no-error/no-row case,
    // not anything Supabase returned.
    console.error('Profile update failed:', error?.code ?? 'no_row_updated')
    return { status: 'error', message: 'We could not save your profile. Please try again.' }
  }

  // Same mechanism login()/logout()/saveOnboardingResponse() already use to
  // make the header reflect a change immediately: this invalidates the root
  // layout's cache, and Next.js also refreshes this route's own Server
  // Component tree right after the action returns, so SiteHeader's next
  // render (which happens without the learner navigating anywhere) picks up
  // the new name with no logout/login round trip.
  revalidatePath('/', 'layout')

  return {
    status: 'success',
    message: 'Profile updated.',
    firstName,
    lastName,
    contactNumber,
  }
}
