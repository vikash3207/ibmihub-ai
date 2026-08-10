import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { BookOpen, Sparkles, TrendingUp, ClipboardCheck, FlaskConical, CheckCircle2, Layers, ArrowRight, History, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { getCompletionRecordsForUser } from '@/lib/progress'
import {
  calculateOverallProgress,
  calculateTopicProgress,
  summarizeTopics,
  selectContinueLesson,
  getTopicLabelForLesson,
} from '@/lib/dashboard-metrics'
import { reconcileAchievementsForUser } from '@/lib/achievements-server'
import { ACHIEVEMENTS, ACHIEVEMENT_BY_CODE } from '@/lib/achievements'
import { AchievementMedallion } from '@/components/achievement-badge'
import { OpenAiTutorCard } from '@/components/ai-tutor/open-ai-tutor-card'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { formatCompletionDate, parseAcceptLanguage } from '@/lib/format-date'
import { buttonVariants } from '@/components/ui/button'
import { PublicBetaNotice } from '@/components/public-beta-notice'
import { cn } from '@/lib/utils'

// Auth-gated page -- never statically cache; always compute fresh per request
// so a production visitor's real session (not a build-time snapshot) decides
// what renders here. This is also what makes the Dashboard reflect a lesson
// completed moments ago without needing its own revalidation hook, and what
// keeps one learner's progress out of any globally shared cache.
export const dynamic = 'force-dynamic'

// Account-specific content and excluded from app/sitemap.ts -- explicitly
// opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your IBM i Fundamentals learning progress and next lesson.',
  robots: { index: false, follow: false },
}

/** How many recent completions to list before pointing at the full lesson list. */
const RECENT_ACTIVITY_LIMIT = 5

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

const TOPIC_STATUS_LABEL: Record<string, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
}

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

  // `user.id` comes from the trusted server session above, never from client
  // input. One completion query serves every metric below (ids, the Continue
  // Learning anchor, and recent activity) rather than one request per card.
  // reconcileAchievementsForUser doubles as the lazy per-user backfill for
  // learners who qualified before achievements shipped (PR #179). It is
  // idempotent, scoped to this one authenticated user, and never runs for an
  // anonymous request -- the redirect above happens first.
  const [lessons, completionRecords, requestHeaders] = await Promise.all([
    getPublishedLessons(),
    getCompletionRecordsForUser(user.id),
    headers(),
  ])

  // Runs after the two queries above so it can reuse their results instead of
  // re-fetching the same curriculum and completions (PR #180) -- three
  // distinct queries for this page instead of five.
  const { achievements } = await reconcileAchievementsForUser(user.id, {
    lessons,
    completions: completionRecords,
  })

  // Dates are formatted server-side in the visitor's own language preference
  // -- see lib/format-date.ts for why this isn't done in a client effect.
  const locale = parseAcceptLanguage(requestHeaders.get('accept-language'))

  // A Set both de-duplicates ids and is what every calculation intersects
  // against `lessons`, so a completion row for an unpublished or deleted
  // lesson can never inflate a count.
  const completedLessonIds = new Set(completionRecords.map((record) => record.lessonId))
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]))

  const overall = calculateOverallProgress(lessons, completedLessonIds)
  const topicProgress = calculateTopicProgress(lessons, completedLessonIds)
  const topicSummary = summarizeTopics(topicProgress)

  // Records are ordered completed_at DESC, so the first one still pointing at
  // a currently published lesson is the newest usable anchor.
  const mostRecentCompletedLessonId =
    completionRecords.find((record) => lessonById.has(record.lessonId))?.lessonId ?? null

  const continueLesson = selectContinueLesson(lessons, completedLessonIds, mostRecentCompletedLessonId)
  const continueTopicLabel = continueLesson ? getTopicLabelForLesson(continueLesson) : undefined
  const continueTopicProgress = topicProgress.find((topic) => topic.label === continueTopicLabel)

  // Only genuine completion events for lessons that are still published.
  const recentActivity = completionRecords
    .map((record) => ({ record, lesson: lessonById.get(record.lessonId) }))
    .filter((entry): entry is { record: (typeof completionRecords)[number]; lesson: NonNullable<typeof entry.lesson> } =>
      Boolean(entry.lesson)
    )
    .slice(0, RECENT_ACTIVITY_LIMIT)

  const isNewLearner = overall.completedCount === 0
  const startLearningCopy = profile?.onboarding_response
    ? (START_LEARNING_COPY[profile.onboarding_response] ?? DEFAULT_START_LEARNING_COPY)
    : DEFAULT_START_LEARNING_COPY

  const welcomeMessage = overall.isCurriculumComplete
    ? "Great work -- you've completed every currently published lesson."
    : isNewLearner
      ? "Welcome to iRPGenie. Let's start your IBM i learning journey."
      : "Welcome back. Here's where you left off."

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Learning Progress</h1>
        <p className="text-slate-600 leading-relaxed">{welcomeMessage}</p>
      </div>

      <PublicBetaNotice compact />

      {/* -- Learning overview ------------------------------------------- */}
      <section aria-labelledby="overview-heading" className="space-y-3">
        <h2 id="overview-heading" className="text-lg font-semibold text-slate-900">
          Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              Lessons completed
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
              {overall.completedCount}
              <span className="text-base font-medium text-slate-400"> / {overall.totalCount}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Currently published lessons</p>
          </Card>

          <Card>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              Curriculum progress
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{overall.percent}%</p>
            <ProgressBar
              percent={overall.percent}
              label={`${IBM_I_FUNDAMENTALS_PATH_NAME} progress: ${overall.percent}% complete`}
              className="mt-2"
              tone={overall.isCurriculumComplete ? 'emerald' : 'blue'}
            />
          </Card>

          <Card>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Layers className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              Topics started
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
              {topicSummary.startedCount}
              <span className="text-base font-medium text-slate-400"> / {topicSummary.totalCount}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {topicSummary.completedCount > 0
                ? `${topicSummary.completedCount} fully completed`
                : 'At least one lesson completed'}
            </p>
          </Card>
        </div>

        <p className="text-xs text-slate-400">
          Progress reflects lessons you marked complete. It measures how much of the curriculum you
          have worked through, not a skill assessment.
        </p>
      </section>

      {/* -- Continue learning ------------------------------------------- */}
      <section aria-labelledby="continue-heading" className="space-y-3">
        <h2 id="continue-heading" className="text-lg font-semibold text-slate-900">
          {overall.isCurriculumComplete ? 'Curriculum complete' : isNewLearner ? 'Start learning' : 'Continue learning'}
        </h2>

        {overall.isCurriculumComplete ? (
          <Card className="border-l-4 border-l-emerald-500">
            <p className="text-sm text-slate-700 leading-relaxed">
              You&apos;ve completed all {overall.totalCount} currently published{' '}
              {IBM_I_FUNDAMENTALS_PATH_NAME} lessons. New lessons are added over time, and they&apos;ll
              appear here when they are.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/deep-dives" className={buttonVariants({ variant: 'primary' })}>
                Explore Deep Dives
              </Link>
              <Link href="/practice-lab" className={buttonVariants({ variant: 'secondary' })}>
                Open Practice Lab
              </Link>
              <Link href="/learn/ibm-i-fundamentals" className={buttonVariants({ variant: 'secondary' })}>
                Review lessons
              </Link>
            </div>
          </Card>
        ) : continueLesson ? (
          <Card className="border-l-4 border-l-blue-600">
            {isNewLearner && <p className="mb-3 text-sm text-slate-600 leading-relaxed">{startLearningCopy}</p>}

            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold tabular-nums text-blue-700">
                {continueLesson.lesson_order}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900">{continueLesson.title}</h3>
                {continueTopicLabel && (
                  <p className="mt-0.5 text-xs font-medium text-blue-700">{continueTopicLabel}</p>
                )}
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {continueLesson.short_description}
                </p>

                {continueTopicProgress && continueTopicProgress.totalCount > 0 && (
                  <div className="mt-3 max-w-xs">
                    <p className="mb-1 text-xs text-slate-500">
                      {continueTopicProgress.label}: {continueTopicProgress.completedCount} of{' '}
                      {continueTopicProgress.totalCount} completed ({continueTopicProgress.percent}%)
                    </p>
                    <ProgressBar
                      percent={continueTopicProgress.percent}
                      label={`${continueTopicProgress.label} progress: ${continueTopicProgress.percent}% complete`}
                    />
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/learn/ibm-i-fundamentals/${continueLesson.slug}`}
              className={cn(buttonVariants({ variant: 'primary' }), 'mt-4')}
            >
              {isNewLearner ? 'Start Learning' : 'Continue Learning'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-slate-600">
              Lessons are still being published. Check back soon.
            </p>
          </Card>
        )}
      </section>

      {/* -- Progress by topic ------------------------------------------- */}
      {topicProgress.length > 0 && (
        <section aria-labelledby="topics-heading" className="space-y-3">
          <h2 id="topics-heading" className="text-lg font-semibold text-slate-900">
            Progress by topic
          </h2>

          <ul className="grid gap-3 sm:grid-cols-2">
            {topicProgress.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/learn/ibm-i-fundamentals?topic=${topic.id}`}
                  className="block h-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors motion-reduce:transition-none hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900">{topic.label}</span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                        topic.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : topic.status === 'in-progress'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {TOPIC_STATUS_LABEL[topic.status]}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 tabular-nums">
                    {topic.completedCount} of {topic.totalCount} lessons completed &middot; {topic.percent}%
                  </p>

                  <ProgressBar
                    percent={topic.percent}
                    label={`${topic.label} progress: ${topic.completedCount} of ${topic.totalCount} lessons completed`}
                    className="mt-2"
                    tone={topic.status === 'completed' ? 'emerald' : 'blue'}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* -- Achievements preview ---------------------------------------- */}
      <section aria-labelledby="achievements-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="achievements-heading" className="flex items-center gap-1.5 text-lg font-semibold text-slate-900">
            <Trophy className="h-4 w-4 text-slate-400" aria-hidden="true" />
            Achievements
          </h2>
          <span className="text-sm tabular-nums text-slate-500">
            {achievements.length} of {ACHIEVEMENTS.length} earned
          </span>
        </div>

        {achievements.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-600 leading-relaxed">
              You haven&apos;t earned a badge yet. Marking your first lesson complete earns{' '}
              <strong>{ACHIEVEMENTS[0].name}</strong>.
            </p>
            <Link
              href="/dashboard/achievements"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              View all achievements
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Card>
        ) : (
          <Card>
            <ul className="space-y-2.5">
              {achievements.slice(0, 3).map((achievement) => {
                const definition = ACHIEVEMENT_BY_CODE.get(achievement.badgeCode)
                if (!definition) return null
                return (
                  <li key={achievement.badgeCode} className="flex items-center gap-3">
                    <AchievementMedallion definition={definition} earned size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">{definition.name}</span>
                      <span className="block text-xs text-slate-500">{definition.condition}</span>
                    </span>
                    <time dateTime={achievement.earnedAt} className="shrink-0 text-xs text-slate-400">
                      {formatCompletionDate(achievement.earnedAt, locale)}
                    </time>
                  </li>
                )
              })}
            </ul>
            <Link
              href="/dashboard/achievements"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              View all achievements
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Card>
        )}
      </section>

      {/* -- Recent activity --------------------------------------------- */}
      {recentActivity.length > 0 && (
        <section aria-labelledby="recent-heading" className="space-y-3">
          <h2 id="recent-heading" className="flex items-center gap-1.5 text-lg font-semibold text-slate-900">
            <History className="h-4 w-4 text-slate-400" aria-hidden="true" />
            Recently completed
          </h2>

          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {recentActivity.map(({ record, lesson }) => {
              const topicLabel = getTopicLabelForLesson(lesson)
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/learn/ibm-i-fundamentals/${lesson.slug}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors motion-reduce:transition-none hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {lesson.title}
                        </span>
                        {topicLabel && <span className="block text-xs text-slate-500">{topicLabel}</span>}
                      </span>
                    </span>
                    <time dateTime={record.completedAt} className="shrink-0 text-xs text-slate-400">
                      {formatCompletionDate(record.completedAt, locale)}
                    </time>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* -- Quick links -------------------------------------------------- */}
      <section aria-labelledby="explore-heading" className="space-y-3">
        <h2 id="explore-heading" className="text-lg font-semibold text-slate-900">
          Keep exploring
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/learn/ibm-i-fundamentals" className="block active:scale-[0.99] transition-transform motion-reduce:transition-none">
            <Card className="h-full transition-shadow motion-reduce:transition-none hover:shadow-md">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="block font-semibold text-slate-900">Learning Center</span>
              <span className="block text-sm text-slate-600 mt-1">
                View all {IBM_I_FUNDAMENTALS_PATH_NAME} lessons.
              </span>
            </Card>
          </Link>

          <Link href="/practice" className="block active:scale-[0.99] transition-transform motion-reduce:transition-none">
            <Card className="h-full transition-shadow motion-reduce:transition-none hover:shadow-md">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="block font-semibold text-slate-900">Practice Questions</span>
              <span className="block text-sm text-slate-600 mt-1">
                Check your understanding of beginner IBM i topics with short practice questions.
              </span>
            </Card>
          </Link>

          {/* Opens the shared panel in place (PR #180) rather than
              navigating away from the Dashboard. */}
          <OpenAiTutorCard>
            <Card variant="ai" className="h-full text-left transition-shadow motion-reduce:transition-none hover:shadow-md">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="block font-semibold text-slate-900">AI Tutor</span>
              <span className="block text-sm text-slate-600 mt-1">
                Ask IBM i questions for educational guidance. It cannot connect to a real IBM i
                system, execute code, or analyze production code.
              </span>
            </Card>
          </OpenAiTutorCard>

          <Link href="/practice-lab" className="block active:scale-[0.99] transition-transform motion-reduce:transition-none">
            <Card className="h-full transition-shadow motion-reduce:transition-none hover:shadow-md">
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
      </section>
    </div>
  )
}
