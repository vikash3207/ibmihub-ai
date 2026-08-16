import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SectionHero } from '@/components/section-hero'
import { PRACTICE_HERO_THEME } from '@/lib/section-theme'
import { SessionBuilderForm } from '@/components/practice/session-builder-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quick Quiz',
  description: 'Choose a topic, level, and length for a short, scored IBM i quiz.',
  alternates: { canonical: '/practice/quiz/builder' },
  robots: { index: false, follow: false },
}

/**
 * Quick Quiz session builder (IBM i Practice Hub). A real GET <form>
 * (SessionBuilderForm) submitting straight to /practice/quiz/session --
 * works with zero client JS, matches app/search/page.tsx's own GET-form
 * convention. 'advanced' is never offered as a Level here: the existing
 * 169-question bank (content/practice/questions.ts) has zero
 * advanced-difficulty records today, so offering it would always hit the
 * zero-inventory case -- see lib/practice-session.ts's isValidLevel() for
 * the same rule enforced server-side, not just hidden client-side.
 */
export default async function QuizBuilderPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/practice')
  }

  return (
    <>
      <SectionHero
        icon={Sparkles}
        badgeLabel="Scored, 5 or 10 questions"
        title="Quick Quiz"
        accentWord="Quiz"
        description="Choose a topic, level, and length, then answer a short, scored quiz with instant results."
        theme={PRACTICE_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-2xl px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <SessionBuilderForm
            action="/practice/quiz/session"
            submitLabel="Start Quick Quiz"
            levels={[
              { value: 'mixed', label: 'Mixed' },
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
            ]}
            lengths={[
              { value: 5, label: '5 questions' },
              { value: 10, label: '10 questions' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
