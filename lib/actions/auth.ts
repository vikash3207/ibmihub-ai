'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/dashboard'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback?next=/onboarding&after=${encodeURIComponent(next)}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Email verification is disabled for MVP — user is logged in immediately.
  // Redirect to onboarding.
  revalidatePath('/', 'layout')
  redirect(`/onboarding?next=${encodeURIComponent(next)}`)
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/dashboard'

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Incorrect email or password. Please try again.' }
  }

  revalidatePath('/', 'layout')

  // If onboarding not yet answered, send to onboarding first
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_response, onboarding_skipped')
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
  redirect('/dashboard')
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
  redirect(next || '/dashboard')
}
