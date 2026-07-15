import Link from 'next/link'
import type { PracticeLabExercise } from '@/lib/practice-lab/types'

interface Props {
  exercises: PracticeLabExercise[]
  /** e.g. '/practice-lab/5250' -- available exercises link to `${basePath}/${exercise.slug}`; planned ones stay plain, non-interactive list items. */
  basePath: string
}

/**
 * Exercise list for a Practice Lab module page. `status: 'available'`
 * exercises (PR #136: command-line-basics, wrkobj, dspobjd) are clickable
 * links into their workspace; `status: 'planned'` exercises (everything
 * else, still PR #137+ scope) render as plain, non-interactive items with
 * a "Coming next" badge -- there is nowhere to send a click for those yet.
 */
export function PracticeLabExerciseList({ exercises, basePath }: Props) {
  return (
    <ol className="space-y-3">
      {exercises.map((exercise, index) => {
        const isAvailable = exercise.status === 'available'

        const content = (
          <>
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-900">{exercise.title}</span>
                <span
                  className={
                    isAvailable
                      ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                      : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500'
                  }
                >
                  {isAvailable ? 'Available' : 'Coming next'}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{exercise.summary}</p>
            </div>
          </>
        )

        return (
          <li key={exercise.id}>
            {isAvailable ? (
              <Link
                href={`${basePath}/${exercise.slug}`}
                prefetch={false}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-md"
              >
                {content}
              </Link>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 opacity-75">
                {content}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
