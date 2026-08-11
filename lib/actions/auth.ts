'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/config'
import { RESET_PASSWORD_PATH } from '@/lib/auth-redirect'
import { postAuthDestinationFor } from '@/lib/auth-destination'
import type { ResetPasswordState } from '@/lib/auth-reset-state'
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_RESET_FAILURE_MESSAGES,
  PASSWORD_UPDATED_MESSAGE,
  classifyPasswordResetError,
  safeAuthErrorCode,
  type PasswordResetFailure,
} from '@/lib/auth-messages'
import {
  RECOVERY_COOKIE_NAME,
  hasValidRecoveryMarker,
} from '@/lib/auth-recovery-state'
import {
  TURNSTILE_CONFIGURED,
  INVALID_EMAIL_MESSAGE,
  evaluateCaptcha,
  isTurnstileEnforcementEnabled,
  isValidEmailFormat,
  normalizeEmail,
  readTurnstileToken,
  type CaptchaDecision,
} from '@/lib/turnstile'

/**
 * Turnstile gate applied to every Auth call that Supabase can require a
 * captcha for (PR #183, reworked by the PR #183 hotfix).
 *
 * Verified against the installed @supabase/auth-js@2.110.0 type
 * definitions, not assumed: `signUp`, `signInWithPassword`, and
 * `resetPasswordForEmail` all accept `captchaToken`, so all three must send
 * one before CAPTCHA is switched on in the Supabase dashboard -- otherwise
 * enabling it would break login and password recovery in production.
 * `updateUser` (the set-a-new-password step) takes no captchaToken and is
 * therefore deliberately NOT gated.
 *
 * The flag is re-read here from the server environment on every call. It is
 * never taken from a prop, a hidden field, or anything else the browser can
 * influence, so a user cannot turn enforcement off from devtools -- the most
 * they can do is remove the token, which blocks them.
 */
function captchaGate(formData: FormData): CaptchaDecision {
  const decision = evaluateCaptcha({
    enforcementEnabled: isTurnstileEnforcementEnabled(),
    siteKeyConfigured: TURNSTILE_CONFIGURED,
    // Never logged, never put in a URL.
    token: readTurnstileToken(formData),
  })

  if (!decision.allow && decision.reason === 'unconfigured') {
    // Operator error, not user error: enforcement was switched on without a
    // site key. Log it without echoing any configuration value.
    console.error(
      'TURNSTILE_ENFORCEMENT_ENABLED is true but NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing; blocking auth action.'
    )
  }

  return decision
}

/**
 * `{ captchaToken }` when a token was accepted, otherwise `{}` so the key is
 * absent from the Supabase call entirely -- byte-for-byte the pre-PR #183
 * request shape while enforcement is off.
 */
function captchaOption(decision: CaptchaDecision): { captchaToken?: string } {
  return decision.allow && decision.captchaToken ? { captchaToken: decision.captchaToken } : {}
}

/** Map a raw Supabase sign-up error to a safe, generic message for display. */
function safeSignUpErrorMessage(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'An account with this email already exists. Try logging in instead.'
  }

  if (lower.includes('password')) {
    return 'Password does not meet the minimum requirements (at least 8 characters).'
  }

  if (lower.includes('email')) {
    return 'Please enter a valid email address.'
  }

  return 'Unable to create your account. Please check your details and try again.'
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = normalizeEmail(formData.get('email'))
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/'

  const signUpUrl = (message: string) =>
    `/auth/sign-up?next=${encodeURIComponent(next)}&error=${encodeURIComponent(message)}`

  // Format only. This never establishes that the mailbox exists or that the
  // person controls it -- no DNS/SMTP/deliverability check happens anywhere.
  if (!isValidEmailFormat(email)) {
    redirect(signUpUrl(INVALID_EMAIL_MESSAGE))
  }

  const captcha = captchaGate(formData)
  if (!captcha.allow) {
    redirect(signUpUrl(captcha.message))
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback?next=/onboarding&after=${encodeURIComponent(next)}`,
      // Supabase performs the real siteverify call against Cloudflare using
      // the secret key held in its dashboard. That is the enforcement point.
      // Omitted entirely while enforcement is off.
      ...captchaOption(captcha),
    },
  })

  if (error) {
    redirect(
      `/auth/sign-up?next=${encodeURIComponent(next)}&error=${encodeURIComponent(
        safeSignUpErrorMessage(error.message)
      )}`
    )
  }

  // Email verification is disabled for MVP - user is logged in immediately.
  // Redirect to onboarding.
  revalidatePath('/', 'layout')
  redirect(`/onboarding?next=${encodeURIComponent(next)}`)
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = normalizeEmail(formData.get('email'))
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/'

  const loginUrl = (message: string) =>
    `/auth/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(message)}`

  // Gated because signInWithPassword accepts captchaToken, so Supabase will
  // require one for logins too once CAPTCHA is enabled project-wide. While
  // enforcement is off this is a pass-through and login behaves as before.
  const captcha = captchaGate(formData)
  if (!captcha.allow) {
    redirect(loginUrl(captcha.message))
  }

  const captchaOptions = captchaOption(captcha)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    // `options` is omitted, not sent empty, when enforcement is off.
    ...(captchaOptions.captchaToken ? { options: captchaOptions } : {}),
  })

  if (error) {
    // Message stays deliberately non-specific -- it must not reveal whether
    // the address is registered.
    redirect(loginUrl('Incorrect email or password. Please try again.'))
  }

  revalidatePath('/', 'layout')

  // If onboarding not yet answered, send to onboarding first
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_response, onboarding_skipped')
    .eq('id', user?.id ?? '')
    .maybeSingle()

  const needsOnboarding =
    !profile?.onboarding_response && !profile?.onboarding_skipped

  if (needsOnboarding) {
    redirect(`/onboarding?next=${encodeURIComponent(next)}`)
  }

  redirect(next)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = normalizeEmail(formData.get('email'))

  if (!isValidEmailFormat(email)) {
    return { error: INVALID_EMAIL_MESSAGE }
  }

  // Gated: resetPasswordForEmail accepts captchaToken, so Supabase will
  // require one here too once CAPTCHA is enabled.
  const captcha = captchaGate(formData)
  if (!captcha.allow) {
    return { error: captcha.message }
  }

  // Points at the PKCE callback, NOT at the reset form (PR #187). Sending
  // recovery links straight to the form meant the one-time code was never
  // exchanged, so no session existed and updateUser() failed on a fresh
  // link. SITE_URL is used rather than a bare env read so a missing
  // NEXT_PUBLIC_SITE_URL cannot produce a relative, unusable redirect.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(RESET_PASSWORD_PATH)}`,
    ...captchaOption(captcha),
  })

  // Return a non-specific message to avoid revealing if an email is registered
  if (error) {
    // Log internally but don't expose specifics to the user
    console.error('Password reset email failed:', safeAuthErrorCode(error))
  }

  return {
    message:
      'If an account exists for that email, a password reset link has been sent.',
  }
}

function resetFailure(failure: PasswordResetFailure): ResetPasswordState {
  return { status: 'error', message: PASSWORD_RESET_FAILURE_MESSAGES[failure], failure }
}

export async function resetPassword(
  _previousState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const password = formData.get('password')

  /** Single-use by design: a used link must not reopen a working form. */
  const consumeRecoveryMarker = () => {
    cookieStore.delete(RECOVERY_COOKIE_NAME)
  }

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    // Reported accurately as a password problem, and the marker is KEPT so
    // the learner can simply correct it. Previously every failure claimed
    // the link had expired, sending people back to their inbox for a link
    // that was working perfectly well.
    return resetFailure('password-too-short')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Both halves are required, re-checked here rather than trusted from the
  // page. getUser() alone proves only that SOME session exists -- an
  // ordinary signed-in visitor has one, and so does someone whose recovery
  // callback failed. The marker is what says this is a recovery flow, and
  // only /auth/callback can write it.
  const isRecoveryFlow = hasValidRecoveryMarker(cookieStore.get(RECOVERY_COOKIE_NAME)?.value, user?.id)

  if (!user || !isRecoveryFlow) {
    consumeRecoveryMarker()
    return resetFailure('no-recovery-session')
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    const failure = classifyPasswordResetError(error)
    // Fixed label plus the stable code only. The password, the recovery
    // code, the session tokens and Supabase's raw message are never logged,
    // never placed in a URL, and never returned to the client.
    console.error('Password update failed:', safeAuthErrorCode(error), failure)

    // A dead session cannot be retried, so the marker goes. A recoverable
    // problem keeps it so the learner can try again on the same link.
    if (failure === 'no-recovery-session') {
      consumeRecoveryMarker()
    }
    return resetFailure(failure)
  }

  // Consumed on success: reopening the same link now finds no marker and is
  // shown the invalid-link page rather than another usable form.
  consumeRecoveryMarker()

  // Same onboarding rule this flow has always applied -- now attached to the
  // Continue button rather than to an immediate redirect, so the learner
  // actually sees that the password changed.
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_response, onboarding_skipped')
    .eq('id', user.id)
    .maybeSingle()

  return {
    status: 'success',
    message: PASSWORD_UPDATED_MESSAGE,
    destination: postAuthDestinationFor(profile),
  }
}

export async function saveOnboardingResponse(
  response: string | null,
  skipped: boolean,
  next: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  await supabase
    .from('user_profiles')
    .update({
      onboarding_response: response,
      onboarding_skipped: skipped,
    })
    .eq('id', user.id)

  revalidatePath('/', 'layout')
  redirect(next || '/')
}
