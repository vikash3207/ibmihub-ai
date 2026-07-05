import Link from 'next/link'
import type { Metadata } from 'next'
import { Lock, Check } from 'lucide-react'
import { getPublishedLessons } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { IBM_I_FUNDAMENTALS_LESSONS } from '@/content/lessons/metadata'
import { getCompletedLessonIdsForUser } from '@/lib/progress'

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
          <p className="text-sm text-slate-500 mt-2">
            {completedCount} of {lessons.length} completed
          </p>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-900">
          Lessons for this path are still being written and reviewed. Check back soon.
        </div>
      ) : (
        <ol className="space-y-3">
          {lessons.map((lesson) => {
            const isPreview = lesson.lesson_order === 1
            const isLocked = !isPreview && !user
            const isCompleted = user && completedLessonIds.has(lesson.id)

            return (
              <li key={lesson.id}>
                <Link
                  href={`/learn/ibm-i-fundamentals/${lesson.slug}`}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    {lesson.lesson_order}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{lesson.title}</span>
                      {isPreview && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Free preview
                        </span>
                      )}
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          Log in to access
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          Completed
                        </span>
                      )}
                    </span>
                    <span className="block text-sm text-slate-600 mt-1">
                      {lesson.short_description}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      )}

      {lessons.length > 0 && lessons.length < totalLessons && (
        <p className="text-sm text-slate-500">More lessons are being added.</p>
      )}
    </div>
  )
}
