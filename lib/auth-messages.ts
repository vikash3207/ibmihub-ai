/**
 * User-facing auth copy shared between Server Actions and the pages that
 * render their outcome (PR #186).
 *
 * Kept out of lib/actions/auth.ts because that file is `'use server'` and may
 * only export async Server Actions. Single-sourcing the strings is what lets
 * the regression suite assert that a failed password update can never render
 * the success wording.
 */

/** Shown after supabase.auth.updateUser({ password }) actually succeeded. */
export const PASSWORD_UPDATED_MESSAGE = 'Your password has been updated successfully.'

/**
 * Shown when the update failed. Covers expired, already-used and tampered
 * reset links with one safe sentence -- it deliberately does not repeat
 * Supabase's raw error, which can describe session internals.
 */
export const PASSWORD_UPDATE_FAILED_MESSAGE =
  'We could not update your password. Your reset link may have expired or already been used. Please request a new one.'
