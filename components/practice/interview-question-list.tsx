import { ChevronDown } from 'lucide-react'
import { PRACTICE_TOPICS } from '@/content/practice/questions'
import type { InterviewQuestion } from '@/content/practice/interview-questions'
import { highlightMatch } from '@/lib/interview-search'

const DIFFICULTY_LABELS: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const TYPE_LABELS: Record<string, string> = { conceptual: 'Conceptual', 'scenario-based': 'Scenario-Based', 'code-based': 'Code-Based' }

/**
 * Renders published Interview Prep questions only -- callers must already
 * have filtered to `status === 'published'` (see app/(authenticated)/
 * practice/interview/page.tsx). Only the prompt is shown up front; the
 * answer (modelAnswer/essentialPoints/commonMistakes/followUpQuestions --
 * every published entry has the first three, enforced by
 * InterviewQuestion's discriminated union) sits behind a collapsed, opt-in
 * <details>/<summary> "Reveal Answer" disclosure -- the same native,
 * zero-JS, keyboard/screen-reader-accessible pattern already used
 * elsewhere in this codebase (components/deep-dive-browser.tsx's "Planned
 * topics" panel, components/curriculum-sidebar.tsx's mobile panel), rather
 * than a hand-rolled show/hide widget. Collapsed by default so a visitor
 * self-tests against the prompt before checking the answer, matching how
 * an interview-prep resource is actually used.
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
            {q.status === 'published' && <RevealAnswer question={q} />}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Extracted so its prop can be narrowed to the `status: 'published'`
 * branch of the InterviewQuestion union -- TypeScript then guarantees
 * modelAnswer/essentialPoints/commonMistakes are genuinely present, no
 * `!`/optional-chaining guesswork needed to read them.
 */
function RevealAnswer({ question }: { question: Extract<InterviewQuestion, { status: 'published' }> }) {
  return (
    <details className="group mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 focus-visible:rounded-xl">
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none group-open:rotate-180"
          aria-hidden="true"
        />
        Reveal Answer
      </summary>
      <div className="space-y-3 border-t border-slate-200 px-4 py-3">
        <p className="text-sm leading-relaxed text-slate-700">{question.modelAnswer}</p>

        {question.essentialPoints.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Essential points</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {question.essentialPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {question.commonMistakes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Common mistakes</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {question.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        {question.followUpQuestions && question.followUpQuestions.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Follow-up questions</h4>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {question.followUpQuestions.map((followUp, i) => (
                <li key={i}>{followUp}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  )
}
