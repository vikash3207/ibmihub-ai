import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { BookOpen, Sparkles, TrendingUp, ClipboardCheck, FlaskConical } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { getCompletedLessonIdsForUser } from '@/lib/progress'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'

// Auth-gated page -- never statically cache; always compute fresh per request
// so a production visitor's real session (not a build-time snapshot) decides
// what renders here.
export const dynamic = 'force-dynamic'

// Account-specific content and excluded from app/sitemap.ts -- explicitly
// opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your IBM i Fundamentals progress and next lesson.',
  robots: { index: false, follow: false },
}

/**
 * Approved onboarding-aware Start Learning copy (Spec 005 DASH-FR-010).
 * Keys must match app/(authenticated)/onboarding/page.tsx's OPTIONS text
 * exactly, since that's the literal string saved as onboarding_response.
 * Renaming the brand here means a user who answered before this PR has an
 * old-text response that no longer matches a key -- harmless by design,
 * since an unmatched response already falls back to
 * DEFAULT_START_LEARNING_COPY below rather than erroring.
 */
const START_LEARNING_COPY: Record<string, string> = {
  'I am new to IBM i and want to start learning.':
    'Start with the IBM i Fundamentals path. It is designed to build your understanding step by step.',
  'I already work with IBM i and want to refresh or deepen my knowledge.':
    'Use the IBM i Fundamentals path as a refresher, or jump directly to the topic you want to revisit.',
  'I am exploring what iRPGenie offers.':
    'Explore the IBM i Fundamentals path to understand the core concepts before moving into deeper topics.',
}

const DEFAULT_START_LEARNING_COPY =
  'Start with the IBM i Fundamentals path to build a clear foundation in IBM i.'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=%2Fdashboard')
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
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

  // Lessons are already ordered by lesson_order (getPublishedLessons), so the
  // first array match is the lowest-order Published lesson not yet completed.
  const nextLesson = lessons.find((lesson) => !completedLessonIds.has(lesson.id)) ?? null

  const welcomeMessage = pathComplete
    ? "Great work -- you've completed the available IBM i Fundamentals lessons."
    : completedCount === 0
      ? "Welcome to iRPGenie. Let's start your IBM i learning journey."
      : 'Welcome back. Continue your IBM i learning journey.'

  const startLearningCopy = profile?.onboarding_response
    ? (START_LEARNING_COPY[profile.onboarding_response] ?? DEFAULT_START_LEARNING_COPY)
    : DEFAULT_START_LEARNING_COPY

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 leading-relaxed">{welcomeMessage}</p>

        {lessons.length > 0 && (
          <div className="mt-4 max-w-sm">
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                IBM i Fundamentals progress
              </span>
              <span>
                {completedCount} of {lessons.length} completed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-600 transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <Card className="border-l-4 border-l-blue-600">
        {pathComplete ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Path complete</h2>
            <p className="text-sm text-slate-600 mb-4">
              You&apos;ve completed all available {IBM_I_FUNDAMENTALS_PATH_NAME} lessons.
            </p>
            <Link href="/learn/ibm-i-fundamentals" className={buttonVariants({ variant: 'primary' })}>
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
                className={buttonVariants({ variant: 'primary' })}
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
                  className={buttonVariants({ variant: 'primary' })}
                >
                  Continue
                </Link>
              </>
            )}
          </>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/learn/ibm-i-fundamentals" className="block active:scale-[0.99] transition-transform">
          <Card className="h-full transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">Learning Center</span>
            <span className="block text-sm text-slate-600 mt-1">
              View all {IBM_I_FUNDAMENTALS_PATH_NAME} lessons.
            </span>
          </Card>
        </Link>

        <Link href="/practice" className="block active:scale-[0.99] transition-transform">
          <Card className="h-full transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">Practice Questions</span>
            <span className="block text-sm text-slate-600 mt-1">
              Check your understanding of beginner IBM i topics with short practice questions.
            </span>
          </Card>
        </Link>

        <Link href="/ai-tutor" className="block active:scale-[0.99] transition-transform">
          <Card variant="ai" className="h-full transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">AI Tutor</span>
            <span className="block text-sm text-slate-600 mt-1">
              Ask IBM i questions for educational guidance. It cannot connect to a real IBM i
              system, execute code, or analyze production code.
            </span>
          </Card>
        </Link>

        <Link href="/practice-lab" className="block active:scale-[0.99] transition-transform">
          <Card className="h-full transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">Practice Lab</span>
            <span className="block text-sm text-slate-600 mt-1">
              Hands-on 5250-style command practice and an ACS-style SQL console. A guided
              simulator -- no real IBM i system connection.
            </span>
          </Card>
        </Link>
      </div>
    </div>
  )
}
