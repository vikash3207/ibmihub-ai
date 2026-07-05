import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { getCompletedLessonIdsForUser } from '@/lib/progress'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your IBM i Fundamentals progress and next lesson.',
}

/** Approved onboarding-aware Start Learning copy (Spec 005 DASH-FR-010). */
const START_LEARNING_COPY: Record<string, string> = {
  'I am new to IBM i and want to start learning.':
    'Start with the IBM i Fundamentals path. It is designed to build your understanding step by step.',
  'I already work with IBM i and want to refresh or deepen my knowledge.':
    'Use the IBM i Fundamentals path as a refresher, or jump directly to the topic you want to revisit.',
  'I am exploring what IBMiHub AI offers.':
    'Explore the IBM i Fundamentals path and try the AI Tutor when you have questions.',
}

const DEFAULT_START_LEARNING_COPY =
  'Start with the IBM i Fundamentals path or open the AI Tutor to ask an IBM i question.'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_response')
    .eq('id', user.id)
    .maybeSingle()

  const lessons = await getPublishedLessons()
  const completedLessonIds = await getCompletedLessonIdsForUser(user.id)

  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length
  const pathComplete = lessons.length > 0 && completedCount === lessons.length

  // Lessons are already ordered by lesson_order (getPublishedLessons), so the
  // first array match is the lowest-order Published lesson not yet completed.
  const nextLesson = lessons.find((lesson) => !completedLessonIds.has(lesson.id)) ?? null

  const welcomeMessage = pathComplete
    ? "Great work -- you've completed the available IBM i Fundamentals lessons."
    : completedCount === 0
      ? "Welcome to IBMiHub AI. Let's start your IBM i learning journey."
      : 'Welcome back. Continue your IBM i learning journey.'

  const startLearningCopy = profile?.onboarding_response
    ? (START_LEARNING_COPY[profile.onboarding_response] ?? DEFAULT_START_LEARNING_COPY)
    : DEFAULT_START_LEARNING_COPY

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 leading-relaxed">{welcomeMessage}</p>
        {lessons.length > 0 && (
          <p className="text-sm text-slate-500 mt-2">
            {completedCount} of {lessons.length} lessons completed
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {pathComplete ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Path complete</h2>
            <p className="text-sm text-slate-600 mb-4">
              You&apos;ve completed all available {IBM_I_FUNDAMENTALS_PATH_NAME} lessons.
            </p>
            <Link
              href="/learn/ibm-i-fundamentals"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              View All Lessons
            </Link>
          </>
        ) : completedCount === 0 ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Start Learning</h2>
            <p className="text-sm text-slate-600 mb-4">{startLearningCopy}</p>
            {nextLesson && (
              <Link
                href={`/learn/ibm-i-fundamentals/${nextLesson.slug}`}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Start {nextLesson.title}
              </Link>
            )}
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Continue Learning</h2>
            {nextLesson && (
              <>
                <p className="text-sm text-slate-600 mb-4">Next up: {nextLesson.title}</p>
                <Link
                  href={`/learn/ibm-i-fundamentals/${nextLesson.slug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  Continue
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/learn/ibm-i-fundamentals"
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors"
        >
          <span className="block font-semibold text-slate-900">Learning Center</span>
          <span className="block text-sm text-slate-600 mt-1">
            View all {IBM_I_FUNDAMENTALS_PATH_NAME} lessons.
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <span className="block text-sm font-medium text-slate-500">
            AI Tutor -- coming later, not available yet
          </span>
          <span className="block text-sm text-slate-500 mt-1">
            Soon you will be able to ask IBM i questions directly.
          </span>
        </div>
      </div>
    </div>
  )
}
