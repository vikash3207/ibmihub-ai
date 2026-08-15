import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, CheckCircle2, GraduationCap, Layers } from 'lucide-react'
import { getPublishedLessons } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import { getCompletionRecordsForUser } from '@/lib/progress'
import { calculateOverallProgress, selectContinueLesson, getTopicLabelForLesson } from '@/lib/dashboard-metrics'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { buttonVariants } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { PublicBetaNotice } from '@/components/public-beta-notice'
import { RegisterAiTutorPageContext } from '@/components/ai-tutor/register-page-context'
import { SectionHero } from '@/components/section-hero'
import { LEARN_HERO_THEME } from '@/lib/section-theme'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Learning Center',
  description:
    'Start the IBM i Fundamentals learning path — structured, original lessons for beginners and working IBM i developers.',
  alternates: { canonical: '/learn' },
}

// Reads the auth session (for the Start/Continue Learning card below) --
// never statically cache this page or it could serve a stale/incorrect
// progress state.
export const dynamic = 'force-dynamic'

/**
 * Learning Center landing page (Learning Center and 288-Lesson Catalog
 * Simplification). app/learn/layout.tsx renders a full-bleed <SectionHero>
 * as a direct child of <main> -- identical structure to app/deep-dives/page.tsx.
 *
 * The previous version's Fundamentals pillar card was a static "Start
 * Learning" CTA that never reflected sign-in state or progress -- a
 * returning learner with real progress saw the identical button as a
 * brand-new visitor. It's replaced here with one prominent, state-aware
 * Start/Continue Learning card, computed from the exact same
 * lib/dashboard-metrics.ts helpers app/(authenticated)/dashboard/page.tsx
 * already uses (calculateOverallProgress, selectContinueLesson) -- no new
 * progress calculation exists here that could disagree with the Dashboard.
 * Deep Dives moves to a smaller, clearly secondary link below it, so the
 * page has one prominent action, not two competing ones.
 */
export default async function LearnPage() {
  const supabase = await createClient()
  const [lessons, { data: { user } }] = await Promise.all([getPublishedLessons(), supabase.auth.getUser()])

  const completionRecords = user ? await getCompletionRecordsForUser(user.id) : []
  const completedLessonIds = new Set(completionRecords.map((record) => record.lessonId))
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]))

  const overall = calculateOverallProgress(lessons, completedLessonIds)
  // Same anchor rule the Dashboard uses: the most recent completion that
  // still points at a currently published lesson.
  const mostRecentCompletedLessonId =
    completionRecords.find((record) => lessonById.has(record.lessonId))?.lessonId ?? null
  const continueLesson = selectContinueLesson(lessons, completedLessonIds, mostRecentCompletedLessonId)
  const continueTopicLabel = continueLesson ? getTopicLabelForLesson(continueLesson) : undefined

  const isReturningLearner = Boolean(user) && overall.completedCount > 0

  return (
    <>
      {/* Lets the header's AI Tutor button know the learner is browsing the
          iRPGenie curriculum, so a question like "what is a Deep Dive?"
          is answered about this platform's Deep Dives rather than the
          generic English phrase (PR #181). */}
      <RegisterAiTutorPageContext
        context={{ sourceType: 'learning-center', title: 'iRPGenie Learning Center' }}
      />

      <SectionHero
        icon={GraduationCap}
        badgeLabel="Guided, beginner-friendly learning"
        title="Learning Center"
        accentWord="Center"
        description="A guided starting point for learning IBM&nbsp;i, one structured lesson at a time."
        theme={LEARN_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-3xl px-4 sm:px-6 space-y-4">
        {lessons.length === 0 ? (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-900 shadow-sm">
            Lesson content is being finalized — check back soon.
          </div>
        ) : overall.isCurriculumComplete ? (
          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-white p-6 shadow-sm sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" aria-hidden="true" />
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Curriculum complete
            </p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              You&apos;ve completed all {overall.totalCount} published lessons
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              New lessons are added over time, and they&apos;ll appear here when they are. In the
              meantime, review any lesson or explore Deep Dives for professional-grade topics.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/learn/ibm-i-fundamentals" className={buttonVariants({ variant: 'primary' })}>
                Review lessons
              </Link>
              <Link href="/deep-dives" className={buttonVariants({ variant: 'secondary' })}>
                Explore Deep Dives
              </Link>
            </div>
          </div>
        ) : continueLesson ? (
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white p-6 shadow-sm sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" aria-hidden="true" />
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
              {isReturningLearner ? 'Continue learning' : 'Where to start'}
            </p>

            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold tabular-nums text-white shadow-sm">
                {continueLesson.lesson_order}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-slate-900">{continueLesson.title}</h2>
                {continueTopicLabel && <p className="mt-0.5 text-xs font-medium text-blue-700">{continueTopicLabel}</p>}
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {isReturningLearner
                    ? "Here's where you left off in the IBM i Fundamentals path."
                    : `A structured, beginner-friendly path through ${lessons.length} lessons -- no prior IBM i knowledge required.`}
                </p>
              </div>
            </div>

            {isReturningLearner && (
              <div className="mt-4 max-w-xs">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Overall progress</span>
                  <span>{overall.percent}%</span>
                </div>
                <ProgressBar percent={overall.percent} label={`${IBM_I_FUNDAMENTALS_PATH_NAME} progress: ${overall.percent}% complete`} />
              </div>
            )}

            <Link
              href={`/learn/ibm-i-fundamentals/${continueLesson.slug}`}
              className={cn(buttonVariants({ variant: 'primary' }), 'group/link mt-5 w-full sm:w-auto')}
            >
              {isReturningLearner ? 'Continue Learning' : 'Start Learning'}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}

        {/* Answers "can I follow lessons in order / jump to a topic" right
            where the primary action is, without a second explanatory
            section. */}
        {lessons.length > 0 && (
          <p className="px-1 text-xs text-slate-500">
            Lessons are ordered start to finish for a guided path -- or open the{' '}
            <Link href="/learn/ibm-i-fundamentals" className="font-medium text-blue-600 hover:underline">
              full curriculum
            </Link>{' '}
            to jump straight to a topic.
          </p>
        )}

        {/* Deep Dives: a clearly secondary link, not a second equally
            prominent CTA competing with the card above. */}
        <Link
          href="/deep-dives"
          className="group flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Layers className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-900">Already know the basics?</span>
            <span className="block text-xs text-slate-500">
              Browse {DEEP_DIVES.length} standalone Deep Dive{DEEP_DIVES.length === 1 ? '' : 's'} -- no fixed order required.
            </span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-indigo-400 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PublicBetaNotice compact>
          We are continuously upgrading the curriculum. Beginner-friendly lessons are available now,
          and deeper professional-grade expansions are being added over time.
        </PublicBetaNotice>
      </div>
    </>
  )
}
