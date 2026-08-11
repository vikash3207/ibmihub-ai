/**
 * Shape of a password-update attempt's result (PR #187).
 *
 * Lives here rather than in lib/actions/auth.ts because that file is
 * `'use server'` and may only export async functions -- a value export there
 * fails the build outright.
 *
 * This shape is the fix for PR #186's forgeable success screen: success is
 * something the SERVER returns after updateUser() actually succeeded, not
 * something a query parameter can assert.
 *
 * Note what is absent: the submitted password. It is never echoed back into
 * form state, so it can never reach the RSC payload or the rendered HTML.
 */

import type { PostAuthDestination } from '@/lib/auth-destination'
import type { PasswordResetFailure } from '@/lib/auth-messages'

export type ResetPasswordState =
  | { status: 'idle' }
  | { status: 'error'; message: string; failure: PasswordResetFailure }
  | { status: 'success'; message: string; destination: PostAuthDestination }

export const RESET_PASSWORD_INITIAL_STATE: ResetPasswordState = { status: 'idle' }
