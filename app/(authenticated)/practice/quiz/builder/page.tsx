import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRACTICE_QUESTIONS } from '@/content/practice/questions'
import { buildQuizAvailabilityMatrix } from '@/lib/practice-session'
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
 * works with zero client JS for the actual submission, matches
 * app/search/page.tsx's own GET-form convention. 'advanced' is never
 * offered as a Level here: the existing 169-question bank
 * (content/practice/questions.ts) has zero advanced-difficulty records
 * today, so offering it would always hit the zero-inventory case -- see
 * lib/practice-session.ts's isValidLevel() for the same rule enforced
 * server-side, not just hidden client-side.
 *
 * buildQuizAvailabilityMatrix() computes real availability straight from
 * the live PRACTICE_QUESTIONS catalog on every request -- never a
 * hardcoded count that could drift -- and hands it to the client-side form
 * so unsupported topic/level/length combinations are disabled up front
 * instead of only rejected after submission.
 */
export default async function QuizBuilderPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/practice')
  }

  const matrix = buildQuizAvailabilityMatrix(PRACTICE_QUESTIONS)

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
        {/* The back-link lives inside the same solid white card as the form
            (not directly on the hero's fade-to-white zone, whose exact
            background at this scroll position is ambiguous) so its
            contrast against its background is always guaranteed. */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <Link
            href="/practice"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 rounded"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Practice Hub
          </Link>
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
            matrix={matrix}
          />
        </div>
      </div>
    </>
  )
}
