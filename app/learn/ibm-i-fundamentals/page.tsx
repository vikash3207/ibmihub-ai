import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedLessons } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { getCompletedLessonIdsForUser } from '@/lib/progress'
import { getTopicById } from '@/lib/topics'
import { CurriculumSidebar } from '@/components/curriculum-sidebar'
import { LessonBrowser } from '@/components/lesson-browser'

// Lesson content is public; this stays force-dynamic because it still reads
// the auth session per request for personalization that IS login-gated:
// the completed badge/progress bar below. Never statically cache that away.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: IBM_I_FUNDAMENTALS_PATH_NAME,
  description: 'The ordered lesson list for the IBM i Fundamentals learning path -- free to read, no account required.',
  alternates: { canonical: '/learn/ibm-i-fundamentals' },
}

interface Props {
  searchParams: Promise<{ topic?: string }>
}

export default async function IbmIFundamentalsPage({ searchParams }: Props) {
  const [{ topic: topicParam }, lessons, supabase] = await Promise.all([
    searchParams,
    getPublishedLessons(),
    createClient(),
  ])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Learning Center and 288-Lesson Catalog Simplification: the active topic
  // is now real, shareable navigation -- validated the same way
  // app/insights/page.tsx validates ?category=, via the existing
  // getTopicById() (lib/topics.ts), not a second ad-hoc check. An unknown or
  // missing value simply falls back to no filter, same as before.
  const activeTopic = getTopicById(topicParam)
  const visibleLessons = activeTopic ? lessons.filter(activeTopic.match) : lessons

  const completedLessonIds = user ? await getCompletedLessonIdsForUser(user.id) : new Set<string>()
  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length
  const progressPercent =
    user && lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <Link href="/learn" className="text-sm text-slate-500 hover:text-slate-900">
          &larr; Learning Center
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-2 mb-2">{IBM_I_FUNDAMENTALS_PATH_NAME}</h1>
        <p className="text-slate-600 leading-relaxed">
          An ordered path through the foundational IBM i concepts every beginner and working
          developer benefits from knowing.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Follow lessons in order for a guided path, or use the curriculum below to jump straight
          to a topic.
        </p>
        {user && lessons.length > 0 && (
          <div className="mt-4 max-w-sm">
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
              <span>Progress</span>
              <span>
                {completedCount} of {lessons.length} completed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-600 transition-[width] motion-reduce:transition-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-900">
          Lessons for this path are still being written and reviewed. Check back soon.
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-[270px_minmax(0,1fr)] lg:items-start lg:gap-8">
          <CurriculumSidebar
            lessons={lessons}
            activeTopicId={activeTopic?.id ?? null}
            completedSet={completedLessonIds}
          />
          <LessonBrowser
            lessons={visibleLessons}
            completedLessonIds={Array.from(completedLessonIds)}
            activeTopic={activeTopic ? { id: activeTopic.id, label: activeTopic.label } : null}
          />
        </div>
      )}
    </div>
  )
}
