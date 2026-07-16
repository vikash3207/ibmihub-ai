import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { saveOnboardingResponse } from '@/lib/actions/auth'
import { Card } from '@/components/ui/card'

// Account-specific, not useful search-result content, and excluded from
// app/sitemap.ts -- explicitly opt out of indexing.
export const metadata: Metadata = {
  title: 'Onboarding',
  robots: { index: false, follow: false },
}

const OPTIONS = [
  'I am new to IBM i and want to start learning.',
  'I already work with IBM i and want to refresh or deepen my knowledge.',
  'I am exploring what iRPGenie offers.',
] as const

// Auth-gated page -- never statically cache; always compute fresh per request.
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ next?: string }>
}

export default async function OnboardingPage({ searchParams }: Props) {
  const { next = '/' } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // No next param needed here: login()'s own post-login logic
    // independently re-checks onboarding status and routes accordingly.
    redirect('/auth/login')
  }

  // Check if already answered
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_response, onboarding_skipped')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.onboarding_response || profile?.onboarding_skipped) {
    redirect(next)
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card className="p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Which best describes you?</h1>
        <p className="text-sm text-slate-500 mb-6">
          This helps us recommend the best starting point. You can always explore everything.
        </p>

        <div className="space-y-3">
          {OPTIONS.map((option) => (
            <form key={option}>
              <input type="hidden" name="next" value={next} />
              <button
                formAction={async (formData) => {
                  'use server'
                  const nextPath = formData.get('next') as string
                  await saveOnboardingResponse(option, false, nextPath)
                }}
                className="w-full text-left rounded-xl border border-slate-200 px-5 py-4 text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              >
                {option}
              </button>
            </form>
          ))}
        </div>

        <form className="mt-6 text-center">
          <input type="hidden" name="next" value={next} />
          <button
            formAction={async (formData) => {
              'use server'
              const nextPath = formData.get('next') as string
              await saveOnboardingResponse(null, true, nextPath)
            }}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            Skip for now
          </button>
        </form>
      </Card>
    </div>
  )
}
