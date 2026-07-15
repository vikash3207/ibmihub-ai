import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  instructions: string
  learningObjectives: string[]
  /** Progressively revealed hint text -- already-sliced to how many the caller wants shown. */
  revealedHints: string[]
  hasMoreHints: boolean
  onShowHint: () => void
  /** Published-lesson slug -> title, pre-filtered/resolved by the caller (server component) -- only ever real, Published lessons. */
  relatedLessons: { slug: string; title: string }[]
}

/**
 * Exercise task panel: instructions, learning objectives, a progressive
 * hint control, and related-lesson links. AI Tutor assistance is not
 * wired in yet (Spec 010 Section 9, deferred to PR #138) -- this panel
 * only notes that it's planned.
 */
export function ExerciseInstructions({
  instructions,
  learningObjectives,
  revealedHints,
  hasMoreHints,
  onShowHint,
  relatedLessons,
}: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4">
      <p className="text-sm text-slate-700 leading-relaxed">{instructions}</p>

      {learningObjectives.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">You&apos;ll practice</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-600">
            {learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      )}

      {revealedHints.length > 0 && (
        <div className="space-y-1 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
          {revealedHints.map((hint, i) => (
            <p key={i}>{hint}</p>
          ))}
        </div>
      )}

      {hasMoreHints && (
        <button type="button" onClick={onShowHint} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
          Show hint
        </button>
      )}

      {relatedLessons.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Related lessons</p>
          <ul className="mt-1 space-y-0.5">
            {relatedLessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/learn/ibm-i-fundamentals/${lesson.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400">AI Tutor assistance for this exercise is planned for a future update.</p>
    </div>
  )
}
