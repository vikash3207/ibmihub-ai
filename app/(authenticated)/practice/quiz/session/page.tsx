import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { PRACTICE_QUESTIONS } from '@/content/practice/questions'
import { normalizeSessionParams, buildGuidedOrQuizSession } from '@/lib/practice-session'
import { resolveTopicGroup } from '@/lib/practice-topic-groups'
import { QuizSession } from '@/components/practice/quiz-session'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quick Quiz',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ topicGroup?: string; level?: string; length?: string; seed?: string }>
}

/**
 * Quick Quiz's active session route (IBM i Practice Hub). Session
 * *composition* is a pure function of these query params -- normalizeSessionParams()
 * + buildGuidedOrQuizSession() (lib/practice-session.ts) derive a
 * deterministic seed when none is present, so a bare/shared URL, a refresh,
 * or Back/Forward all reproduce the identical question set rather than
 * silently reshuffling. An insufficient combination (fewer real questions
 * available than the requested length) never silently starts a shorter
 * quiz while claiming the full count -- it shows the actual available
 * count and a clear way to adjust instead.
 */
export default async function QuizSessionPage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/practice')
  }

  const raw = await searchParams
  const params = normalizeSessionParams({ mode: 'quiz', ...raw })

  // normalizeSessionParams() only returns null for a missing/invalid mode --
  // this route always passes mode: 'quiz' explicitly, so this is
  // unreachable in practice, but redirecting rather than asserting keeps
  // this page safe against a future refactor that accidentally lets an
  // unexpected mode value through.
  if (!params) {
    redirect('/practice/quiz/builder')
  }

  const result = buildGuidedOrQuizSession('quiz', params, PRACTICE_QUESTIONS)

  if (result.status === 'insufficient') {
    const topicLabel = resolveTopicGroup(params.topicGroupId)?.label ?? 'All Topics'
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 text-center">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-600" aria-hidden="true" />
          <h1 className="mt-3 text-lg font-semibold text-slate-900">Not enough questions for this combination</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Only {result.available} question{result.available === 1 ? '' : 's'} {result.available === 1 ? 'is' : 'are'} available for{' '}
            <span className="font-medium">{topicLabel}</span> at the <span className="font-medium">{params.level}</span> level -- this
            quiz needs {result.requested}. Try a broader topic, the Mixed level, or the other session length.
          </p>
          <Link href="/practice/quiz/builder" className={cn(buttonVariants({ variant: 'primary' }), 'mt-5')}>
            Adjust quiz settings
          </Link>
        </div>
      </div>
    )
  }

  const lessons = await getPublishedLessons()
  const lessonTitleBySlug = Object.fromEntries(lessons.map((l) => [l.slug, l.title]))

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900">Quick Quiz</h1>
        <Link
          href="/practice/quiz/builder"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 rounded"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Quiz Builder
        </Link>
      </div>
      <QuizSession questions={result.questions} lessonTitleBySlug={lessonTitleBySlug} />
    </div>
  )
}
