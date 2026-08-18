import { PRACTICE_TOPICS } from '@/content/practice/questions'
import type { InterviewQuestion } from '@/content/practice/interview-questions'
import { highlightMatch } from '@/lib/interview-search'

const DIFFICULTY_LABELS: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const TYPE_LABELS: Record<string, string> = { conceptual: 'Conceptual', 'scenario-based': 'Scenario-Based', 'code-based': 'Code-Based' }

/**
 * Renders published Interview Prep questions only -- callers must already
 * have filtered to `status === 'published'` (see app/(authenticated)/
 * practice/interview/page.tsx). Every published entry has a real
 * modelAnswer (enforced by InterviewQuestion's discriminated union), so
 * this can safely show it directly, no reveal-then-answer interaction
 * needed the way Guided Practice's no-score questions use one.
 */
export function InterviewQuestionList({ questions, query }: { questions: InterviewQuestion[]; query: string }) {
  if (questions.length === 0) {
    return (
      <p role="status" className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
        No questions match this combination -- try a different topic, difficulty, or search term.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p aria-live="polite" className="text-sm font-medium text-slate-500">
        {questions.length} question{questions.length === 1 ? '' : 's'}
      </p>
      <ul className="space-y-3">
        {questions.map((q) => (
          <li key={q.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                {PRACTICE_TOPICS.find((t) => t.id === q.topicId)?.label ?? q.topicId}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{DIFFICULTY_LABELS[q.difficulty]}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{TYPE_LABELS[q.questionType]}</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              {highlightMatch(q.prompt, query).map((segment, i) =>
                segment.match ? (
                  <mark key={i} className="bg-emerald-100 text-emerald-900">
                    {segment.text}
                  </mark>
                ) : (
                  <span key={i}>{segment.text}</span>
                )
              )}
            </h3>
            {q.status === 'published' && (
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{q.modelAnswer}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
