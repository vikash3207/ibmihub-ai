/**
 * Pure validation and display logic for the basic user profile enhancement.
 *
 * Kept separate from lib/actions/profile.ts (which is 'use server' and may
 * only export async Server Actions) so this can be imported by both the
 * action and the regression suite, and so avatar-initial derivation can be
 * shared between the server-rendered header and anywhere else that needs it
 * without duplicating the fallback chain.
 */

export const MAX_NAME_LENGTH = 60
export const MAX_CONTACT_LENGTH = 25

export const NAME_TOO_LONG_MESSAGE = `Names must be ${MAX_NAME_LENGTH} characters or fewer.`
export const CONTACT_TOO_LONG_MESSAGE = `Contact number must be ${MAX_CONTACT_LENGTH} characters or fewer.`
export const CONTACT_INVALID_MESSAGE =
  'Contact number can only contain digits, spaces, and the characters + - ( ).'

/**
 * Trims a name field to `null` when empty, never to `''`.
 *
 * `null` matches the column's own "not supplied" state (see the migration),
 * and is what lets the avatar's fallback chain distinguish "no first name"
 * from "first name is an empty string" without an extra check everywhere
 * that reads it.
 */
export function normalizeName(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  return trimmed.length === 0 ? null : trimmed
}

/**
 * Format only, deliberately permissive on content: names have far too much
 * legitimate variety (apostrophes, hyphens, accents, multiple words) to
 * validate beyond a length ceiling and a ban on control characters, which
 * matches this repo's existing stance on email format validation in
 * lib/turnstile.ts -- reject what is clearly wrong, nothing more.
 */
export function isValidName(name: string | null): boolean {
  if (name === null) return true
  if (name.length > MAX_NAME_LENGTH) return false
  return !/[\u0000-\u001f\u007f]/.test(name)
}

/** Same "empty means null" normalisation as names, kept as a separate named function since the two are validated differently. */
export function normalizeContactNumber(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  return trimmed.length === 0 ? null : trimmed
}

/**
 * Deliberately not phone-number validation (no libphonenumber dependency,
 * no country-code awareness) -- this field is a plain optional contact
 * string, not used for SMS, MFA, or Supabase Auth's own phone field. Only
 * rejects letters and stray punctuation, and caps length.
 */
export function isValidContactNumber(value: string | null): boolean {
  if (value === null) return true
  if (value.length > MAX_CONTACT_LENGTH) return false
  return /^[0-9 +()-]+$/.test(value)
}

export interface ProfileIdentity {
  firstName: string | null
  lastName: string | null
}

/**
 * The name shown in the profile dropdown, or null when neither is set (the
 * dropdown falls back to showing only the email in that case).
 */
export function displayName({ firstName, lastName }: ProfileIdentity): string | null {
  const parts = [firstName, lastName].filter((part): part is string => Boolean(part && part.trim()))
  return parts.length > 0 ? parts.join(' ') : null
}

/**
 * The single letter shown in the avatar badge.
 *
 * Priority is first name, then full name (first + last -- the branch that
 * actually fires is "no first name but a last name is set", since first
 * name alone is already covered by the first branch), then email, matching
 * the enhancement's specified fallback chain exactly. Always uppercase, and
 * never empty for a real authenticated user, since email is guaranteed by
 * Supabase Auth.
 */
export function avatarInitial({ firstName, lastName, email }: ProfileIdentity & { email: string | null }): string {
  const first = firstName?.trim()
  if (first) return first.charAt(0).toUpperCase()

  const full = displayName({ firstName, lastName })
  if (full) return full.charAt(0).toUpperCase()

  const trimmedEmail = email?.trim()
  if (trimmedEmail) return trimmedEmail.charAt(0).toUpperCase()

  // Unreachable for a genuine authenticated Supabase user (email is always
  // present), kept only so the function has no unsafe empty-string return.
  return '?'
}

export interface ProfileUpsertPayload {
  id: string
  first_name: string | null
  last_name: string | null
  contact_number: string | null
}

/**
 * Builds the exact row lib/actions/profile.ts upserts into user_profiles.
 * Pulled out as its own pure function (Hotfix: Profile Save Server Error)
 * so the one invariant that matters most for that action's security --
 * `id` is always the verified session's own user id, never anything a form
 * could supply -- is directly unit-testable, rather than only checkable by
 * reading the Server Action's source text.
 */
export function buildProfileUpsertPayload(
  userId: string,
  firstName: string | null,
  lastName: string | null,
  contactNumber: string | null
): ProfileUpsertPayload {
  return { id: userId, first_name: firstName, last_name: lastName, contact_number: contactNumber }
}
