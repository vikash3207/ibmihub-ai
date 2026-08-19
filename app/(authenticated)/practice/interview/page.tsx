import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, MessageCircleQuestion, PenTool } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRACTICE_TOPICS, type PracticeDifficulty } from '@/content/practice/questions'
import { INTERVIEW_QUESTIONS, isInterviewPrepAvailable, type InterviewQuestionType } from '@/content/practice/interview-questions'
import { filterInterviewQuestions, countByTopic, countByDifficulty, countByType } from '@/lib/interview-questions-filter'
import { searchInterviewQuestions, normalizeQuery } from '@/lib/interview-search'
import { extractQueryParam } from '@/lib/search'
import { SectionHero } from '@/components/section-hero'
import { PRACTICE_HERO_THEME } from '@/lib/section-theme'
import { InterviewQuestionList } from '@/components/practice/interview-question-list'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Interview Prep',
  description: 'Browse IBM i interview questions by topic, difficulty, and question type.',
  alternates: { canonical: '/practice/interview' },
  robots: { index: false, follow: false },
}

const DIFFICULTY_LABELS: Record<PracticeDifficulty, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const TYPE_LABELS: Record<InterviewQuestionType, string> = { conceptual: 'Conceptual', 'scenario-based': 'Scenario-Based', 'code-based': 'Code-Based' }

interface Props {
  searchParams: Promise<{ topic?: string; difficulty?: string; type?: string; q?: string | string[] }>
}

/**
 * Interview Prep browsing page (IBM i Practice Hub -- phase 1, first
 * published batch as of this PR). Strictly published-only:
 * content/practice/interview-questions.ts's 764 imported questions started
 * this PR all `status: 'draft'`; 25 IBM i Fundamentals questions with
 * reviewed answers are now `status: 'published'`, so `publishedQuestions`
 * is real and this page renders the actual browse UI below instead of the
 * "in review" empty state -- the empty state remains in place for however
 * many topics/questions are still unpublished. Topic navigation, search,
 * and the difficulty/question-type filters are all built for real against
 * `publishedQuestions` (not the full draft set), so they keep activating
 * automatically and correctly as future PRs publish more answered records
 * -- zero further UI changes needed.
 *
 * Filtering/search are real GET navigation (topic/difficulty/type pills are
 * plain <Link>s, the search box is a real <form method="get">), matching
 * app/search/page.tsx's and components/curriculum-sidebar.tsx's own
 * zero-JS-required conventions -- works with JavaScript disabled, every
 * result is a shareable URL.
 *
 * A signed-out visitor is redirected through /auth/login with a `next`
 * param built from the real destination (including any active
 * topic/difficulty/type/q filters), reusing the safeInternalPath-validated
 * `next` contract every other gate-and-redirect page in this app already
 * relies on (dashboard, profile, practice-lab) -- so a shared filtered link
 * or a direct bookmark to this page survives login/sign-up instead of
 * bouncing to the generic Practice Hub and losing that state.
 */
export default async function InterviewPrepPage({ searchParams }: Props) {
  const raw = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const params = new URLSearchParams()
    if (raw.topic) params.set('topic', raw.topic)
    if (raw.difficulty) params.set('difficulty', raw.difficulty)
    if (raw.type) params.set('type', raw.type)
    const q = extractQueryParam(raw.q)
    if (q) params.set('q', q)
    const qs = params.toString()
    const next = qs ? `/practice/interview?${qs}` : '/practice/interview'
    redirect(`/auth/login?next=${encodeURIComponent(next)}`)
  }

  const publishedQuestions = INTERVIEW_QUESTIONS.filter((q) => q.status === 'published')
  // isInterviewPrepAvailable() is the single source of truth for "is there
  // anything to show" -- computed from the same real catalog, so this can
  // never drift from `publishedQuestions.length === 0` above.
  const isAvailable = isInterviewPrepAvailable(INTERVIEW_QUESTIONS)

  return (
    <>
      <SectionHero
        icon={MessageCircleQuestion}
        badgeLabel="Browse by topic, difficulty, and question type"
        title="Interview Prep"
        accentWord="Interview"
        description="Real IBM i interview questions, organized for focused review as reviewed answers are added."
        theme={PRACTICE_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 rounded"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Practice Hub
          </Link>
        </div>

        {!isAvailable ? (
          <EmptyState
            totalInPreparation={INTERVIEW_QUESTIONS.length}
            topicCount={new Set(INTERVIEW_QUESTIONS.map((q) => q.topicId)).size}
          />
        ) : (
          <BrowseInterviewQuestions raw={raw} publishedQuestions={publishedQuestions} />
        )}
      </div>
    </>
  )
}

/**
 * Deliberately no draft prompt/count-per-topic-of-draft-content is shown
 * here -- only the real total in preparation, matching this codebase's
 * established Insights-empty-state tone (researched/reviewed before
 * publication) rather than exposing anything about unreviewed content.
 */
function EmptyState({ totalInPreparation, topicCount }: { totalInPreparation: number; topicCount: number }) {
  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 via-white to-white p-8 text-center shadow-sm sm:p-10">
      <div
        className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-[90px]"
        aria-hidden="true"
      />
      <span className="relative mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
        <PenTool className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="relative text-xl font-bold text-slate-900 mb-2">Interview Prep questions are being reviewed</h2>
      <p className="relative text-sm text-slate-600 leading-relaxed">
        {totalInPreparation} real IBM&nbsp;i interview questions across {topicCount} topics are being organized here. Each
        answer is written and technically reviewed before publication, so every question that appears here is accurate and
        genuinely useful for interview prep -- none are published yet.
      </p>
      <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/practice/guided" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'group/link')}>
          Try Guided Practice
        </Link>
        <Link href="/practice/quiz/builder" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'group/link')}>
          Build a Quiz
        </Link>
      </div>
    </div>
  )
}

function BrowseInterviewQuestions({
  raw,
  publishedQuestions,
}: {
  raw: { topic?: string; difficulty?: string; type?: string; q?: string | string[] }
  publishedQuestions: ReturnType<typeof INTERVIEW_QUESTIONS.filter>
}) {
  const activeTopic = raw.topic && PRACTICE_TOPICS.some((t) => t.id === raw.topic) ? raw.topic : null
  const activeDifficulty = raw.difficulty && raw.difficulty in DIFFICULTY_LABELS ? (raw.difficulty as PracticeDifficulty) : null
  const activeType = raw.type && raw.type in TYPE_LABELS ? (raw.type as InterviewQuestionType) : null
  const rawQuery = extractQueryParam(raw.q)
  const query = normalizeQuery(rawQuery)

  const filtered = filterInterviewQuestions(publishedQuestions, {
    topicIds: activeTopic ? [activeTopic] : undefined,
    difficulties: activeDifficulty ? [activeDifficulty] : undefined,
    questionTypes: activeType ? [activeType] : undefined,
  })
  const results = query ? searchInterviewQuestions(filtered, rawQuery) : filtered

  const topicFacets = countByTopic(publishedQuestions)
  const difficultyFacets = countByDifficulty(publishedQuestions)
  const typeFacets = countByType(publishedQuestions)

  function buildHref(overrides: { topic?: string | null; difficulty?: string | null; type?: string | null }) {
    const params = new URLSearchParams()
    const topic = overrides.topic !== undefined ? overrides.topic : activeTopic
    const difficulty = overrides.difficulty !== undefined ? overrides.difficulty : activeDifficulty
    const type = overrides.type !== undefined ? overrides.type : activeType
    if (topic) params.set('topic', topic)
    if (difficulty) params.set('difficulty', difficulty)
    if (type) params.set('type', type)
    if (rawQuery) params.set('q', rawQuery)
    const qs = params.toString()
    return qs ? `/practice/interview?${qs}` : '/practice/interview'
  }

  return (
    <div className="space-y-6">
      <form action="/practice/interview" method="get" role="search" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        {activeTopic && <input type="hidden" name="topic" value={activeTopic} />}
        {activeDifficulty && <input type="hidden" name="difficulty" value={activeDifficulty} />}
        {activeType && <input type="hidden" name="type" value={activeType} />}
        <label htmlFor="interview-search-q" className="mb-1.5 block text-sm font-semibold text-slate-900">
          Search questions
        </label>
        <input
          id="interview-search-q"
          type="search"
          name="q"
          defaultValue={rawQuery}
          maxLength={200}
          placeholder="e.g. subfile, SQL, RPGLE"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        />
      </form>

      <fieldset className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <legend className="mb-2 px-1 text-sm font-semibold text-slate-900">Topic</legend>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ topic: null })}
            aria-current={!activeTopic ? 'true' : undefined}
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
              !activeTopic ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            All Topics ({publishedQuestions.length})
          </Link>
          {topicFacets.map(({ topicId, count }) => (
            <Link
              key={topicId}
              href={buildHref({ topic: topicId })}
              aria-current={activeTopic === topicId ? 'true' : undefined}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
                activeTopic === topicId ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              {PRACTICE_TOPICS.find((t) => t.id === topicId)?.label ?? topicId} ({count})
            </Link>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <legend className="mb-2 px-1 text-sm font-semibold text-slate-900">Difficulty</legend>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ difficulty: null })}
              aria-current={!activeDifficulty ? 'true' : undefined}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
                !activeDifficulty ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              All
            </Link>
            {difficultyFacets.map(({ difficulty, count }) => (
              <Link
                key={difficulty}
                href={buildHref({ difficulty })}
                aria-current={activeDifficulty === difficulty ? 'true' : undefined}
                className={cn(
                  'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
                  activeDifficulty === difficulty ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                )}
              >
                {DIFFICULTY_LABELS[difficulty]} ({count})
              </Link>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <legend className="mb-2 px-1 text-sm font-semibold text-slate-900">Question type</legend>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ type: null })}
              aria-current={!activeType ? 'true' : undefined}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
                !activeType ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              All
            </Link>
            {typeFacets.map(({ questionType, count }) => (
              <Link
                key={questionType}
                href={buildHref({ type: questionType })}
                aria-current={activeType === questionType ? 'true' : undefined}
                className={cn(
                  'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
                  activeType === questionType ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                )}
              >
                {TYPE_LABELS[questionType]} ({count})
              </Link>
            ))}
          </div>
        </fieldset>
      </div>

      <InterviewQuestionList questions={results} query={query} />
    </div>
  )
}
