'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/reset-password`,
    ...captchaOption(captcha),
  })

  // Return a non-specific message to avoid revealing if an email is registered
  if (error) {
    // Log internally but don't expose specifics to the user
    console.error('Password reset error:', error.message)
  }

  return {
    message:
      'If an account exists for that email, a password reset link has been sent.',
  }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
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

  redirect(needsOnboarding ? '/onboarding' : '/')
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
