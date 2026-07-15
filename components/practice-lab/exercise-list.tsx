import type { PracticeLabExercise } from '@/lib/practice-lab/types'

interface Props {
  exercises: PracticeLabExercise[]
}

/**
 * Read-only, non-interactive exercise list for the Practice Lab module
 * pages (PR #135 skeleton). Every exercise is currently `status: 'planned'`
 * (no simulator engine exists yet -- PR #136/#137), so entries are shown
 * as plain list items with a "Planned" badge, not links -- there is
 * nowhere to send a click to yet.
 */
export function PracticeLabExerciseList({ exercises }: Props) {
  return (
    <ol className="space-y-3">
      {exercises.map((exercise, index) => (
        <li
          key={exercise.id}
          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-slate-900">{exercise.title}</span>
              <span
                className={
                  exercise.status === 'available'
                    ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
                    : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500'
                }
              >
                {exercise.status === 'available' ? 'Available' : 'Coming next'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{exercise.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
