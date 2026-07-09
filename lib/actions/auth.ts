'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback?next=/onboarding&after=${encodeURIComponent(next)}`,
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

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/'

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  // TEMP AUTH DIAGNOSTIC (safe: no token/cookie/email/password values,
  // remove after the P0 auth-session investigation is closed out).
  console.log(`[auth-diag] login action: signInWithPassword error=${error ? 'yes' : 'no'}`)

  if (error) {
    redirect(
      `/auth/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(
        'Incorrect email or password. Please try again.'
      )}`
    )
  }

  revalidatePath('/', 'layout')

  // If onboarding not yet answered, send to onboarding first
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(`[auth-diag] login action: getUser after sign-in user=${user ? 'present' : 'null'}`)

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
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/reset-password`,
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
