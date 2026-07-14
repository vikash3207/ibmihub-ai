import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedLessons } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { IBM_I_FUNDAMENTALS_LESSONS } from '@/content/lessons/metadata'
import { getCompletedLessonIdsForUser } from '@/lib/progress'
import { LessonBrowser } from '@/components/lesson-browser'

// Reads the auth session to decide lock icons/completed badges per lesson --
// never statically cache; always compute fresh per request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: IBM_I_FUNDAMENTALS_PATH_NAME,
  description:
    'The ordered lesson list for the IBM i Fundamentals learning path. The first lesson is free to preview without an account.',
}

export default async function IbmIFundamentalsPage() {
  const [lessons, supabase] = await Promise.all([getPublishedLessons(), createClient()])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const totalLessons = IBM_I_FUNDAMENTALS_LESSONS.length
  const completedLessonIds = user ? await getCompletedLessonIdsForUser(user.id) : new Set<string>()
  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length
  const progressPercent =
    user && lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <Link href="/learn" className="text-sm text-slate-500 hover:text-slate-900">
          &larr; Learning Center
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-2 mb-2">{IBM_I_FUNDAMENTALS_PATH_NAME}</h1>
        <p className="text-slate-600 leading-relaxed">
          An ordered path through the foundational IBM i concepts every beginner and working
          developer benefits from knowing.
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
                className="h-2 rounded-full bg-blue-600 transition-[width]"
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
        <LessonBrowser
          lessons={lessons}
          totalLessons={totalLessons}
          completedLessonIds={Array.from(completedLessonIds)}
          isLoggedIn={Boolean(user)}
        />
      )}

      {lessons.length > 0 && lessons.length < totalLessons && (
        <p className="text-sm text-slate-500">More lessons are being added.</p>
      )}
    </div>
  )
}
