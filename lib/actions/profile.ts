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
  buildProfileUpsertPayload,
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
 * Updates the signed-in user's own basic profile fields, creating the row
 * first if it doesn't exist yet (see the upsert() below).
 *
 * SECURITY: the row written is always keyed on `user.id`, where `user`
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

  // upsert(), not update(): a plain .update() matches zero rows -- silently,
  // no error -- when this user has no user_profiles row yet. That's supposed
  // to be impossible (001's handle_new_user() trigger inserts one for every
  // new signup), but production has at least one account where it's false
  // (root cause of the Save changes crash this fixed -- see below), so the
  // action needs to handle "row doesn't exist yet" as a normal case, not an
  // assumption. upsert() with an explicit onConflict on the primary key
  // performs an insert when the row is missing and an update when it
  // exists, in one round trip. RLS still fully governs both branches: 001's
  // insert policy (`with check auth.uid() = id`) and update policy (`using
  // auth.uid() = id with check auth.uid() = id`) both must pass, and `id` is
  // always `user.id` from the verified getUser() call above -- never read
  // from the form, so there is nothing here a client could use to write to
  // another user's row. On the update branch, only the three columns listed
  // below are touched -- onboarding_response/onboarding_skipped on an
  // existing row are left exactly as they were.
  //
  // The whole call is also wrapped in try/catch: a thrown exception here
  // (a malformed/non-JSON error response from PostgREST, a network hiccup)
  // must never propagate out of a Server Action and crash the whole page
  // with Next's generic error boundary -- it has to degrade to the same
  // ordinary form-error state as a normal Supabase `error` result.
  let updated: { id: string } | null = null
  let errorCode = 'no_row_returned'

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(buildProfileUpsertPayload(user.id, firstName, lastName, contactNumber), { onConflict: 'id' })
      .select('id')
      .maybeSingle()

    updated = data
    if (error) errorCode = error.code
  } catch (caughtError) {
    // Only a stable, non-sensitive label is logged, never the raw error --
    // consistent with how lib/actions/auth.ts logs Supabase failures
    // elsewhere in this repo.
    console.error('Profile update threw:', caughtError instanceof Error ? caughtError.message : 'unknown')
    errorCode = 'unexpected_exception'
  }

  if (!updated) {
    console.error('Profile update failed:', errorCode)
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
