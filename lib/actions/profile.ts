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
const GENERIC_FAILURE: UpdateProfileState = {
  status: 'error',
  message: 'We could not save your profile. Please try again.',
}

/**
 * Never logs `error.message`, a caught exception's `.message`, or the
 * caught object itself -- only this fixed, non-sensitive label. Supabase/
 * PostgREST/network error text can carry connection strings, query
 * fragments, or other details that don't belong in application logs; a
 * stable label is all any of the call sites below need to be debuggable
 * (paired with which call site logged it), matching how lib/actions/auth.ts
 * logs Supabase failures elsewhere in this repo.
 */
function logUnexpectedFailure() {
  console.error('Profile update failed:', 'unexpected_exception')
}

export async function updateProfile(
  _previousState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  // createClient() and auth.getUser() are wrapped the same as the upsert
  // below: a thrown exception from either (a cookie/session failure, a
  // network error reaching Supabase Auth) must degrade to the same generic
  // form error, not escape this Server Action and crash the page. This is
  // deliberately a *different* outcome from `user` being null, which is not
  // an exception -- getUser() completing normally and reporting no session
  // is the expected, specific "please log in again" case below, unchanged.
  let supabase: Awaited<ReturnType<typeof createClient>>
  let user: { id: string } | null

  try {
    supabase = await createClient()
    user = (await supabase.auth.getUser()).data.user
  } catch {
    logUnexpectedFailure()
    return GENERIC_FAILURE
  }

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

  // upsert(), not update(): a plain .update() silently matches zero rows --
  // no error -- when this user has no user_profiles row yet. That edge case
  // (a missing row) is a confirmed, real failure mode of the old .update();
  // whether it was specifically what threw the exception that crashed the
  // page in production is NOT confirmed -- Vercel logs were not available
  // to inspect the actual exception. upsert() fixes the missing-row edge
  // case directly (insert when absent, update when present, one round
  // trip); the try/catch below is a separate, independent fix that stops
  // *any* unexpected Supabase exception -- whatever its cause -- from ever
  // reaching the caller unhandled. RLS still fully governs both upsert
  // branches: 001's insert policy (`with check auth.uid() = id`) and update
  // policy (`using auth.uid() = id with check auth.uid() = id`) both must
  // pass, and `id` is always `user.id` from the verified getUser() call
  // above -- never read from the form, so there is nothing here a client
  // could use to write to another user's row. On the update branch, only
  // the three columns listed below are touched -- onboarding_response/
  // onboarding_skipped on an existing row are left exactly as they were.
  let updated: { id: string } | null = null
  let hasFailed = false

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(buildProfileUpsertPayload(user.id, firstName, lastName, contactNumber), { onConflict: 'id' })
      .select('id')
      .maybeSingle()

    // Either signal alone means failure -- `data` being non-null must never
    // be read as success while `error` is also set (an upsert can, in
    // principle, return both in the same response).
    hasFailed = Boolean(error)
    updated = data
    if (error) logUnexpectedFailure()
  } catch {
    hasFailed = true
    logUnexpectedFailure()
  }

  if (hasFailed || !updated) {
    return GENERIC_FAILURE
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
