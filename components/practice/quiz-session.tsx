'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import type { PracticeQuestion } from '@/content/practice/questions'
import { scoreQuiz, selectRetryQuestions, type QuizResult } from '@/lib/practice-session'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuizSessionProps {
  questions: PracticeQuestion[]
  /** Where a lesson referenced in relatedLessonSlugs actually resolves to a title -- unresolved/unpublished slugs are simply omitted, same convention as Guided Practice. */
  lessonTitleBySlug: Record<string, string>
}

/**
 * Quick Quiz's active session + completion summary (IBM i Practice Hub).
 * Genuinely different from Guided Practice's PracticeBrowser, not a shared
 * component with a different heading: sequential one-question-at-a-time
 * flow with an explicit two-step select-then-submit (never reveals the
 * correct answer before submission), a `submittingRef` guard against a
 * double-click firing the submit handler twice before React re-renders
 * (same pattern this codebase's contact form already established for its
 * own double-submission race), a real score via the pure scoreQuiz()
 * helper, and a completion screen -- none of which Guided Practice has.
 *
 * Accessibility (follow-up correction): answer options are real native
 * `<input type="radio">` elements inside a `<label>` (visually hidden via
 * `sr-only`, styled entirely from JS-computed classes since the component
 * already tracks selection in state) rather than hand-rolled
 * `role="radio"` buttons -- grouping same-`name` radios gets correct
 * Tab/Arrow-key/roving-focus behavior from the browser itself. Correct/
 * incorrect state is never color-only: a Check/X icon plus sr-only text
 * ("Correct answer" / "Your answer -- incorrect") accompanies every
 * result. A dedicated `aria-live="polite"` region announces submission
 * feedback and quiz completion. Focus moves programmatically to the new
 * question's heading on Next/Retry and to the summary's heading on
 * completion, so keyboard/screen-reader users land on the new content
 * instead of a control that just disappeared.
 *
 * "Retry incorrect questions" replays the missed subset entirely in local
 * component state (no navigation, no new URL) since the retry set is an
 * arbitrary list of specific question ids, not a topic/level/length filter
 * lib/practice-session.ts's URL-driven selection model can express.
 */
export function QuizSession({ questions: initialQuestions, lessonTitleBySlug }: QuizSessionProps) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'active' | 'complete'>('active')
  const submittingRef = useRef(false)
  const questionHeadingRef = useRef<HTMLHeadingElement>(null)

  const current = questions[index]
  const isLast = index === questions.length - 1

  // Moves focus to the current question's heading whenever a new question
  // becomes active (advancing, or restarting via "Retry incorrect
  // questions") -- otherwise a keyboard/screen-reader user is left focused
  // on a "Next question" button that just disappeared, with no indication
  // where the new content is.
  useEffect(() => {
    if (phase === 'active') questionHeadingRef.current?.focus()
  }, [index, phase])

  function handleSelect(option: string) {
    if (submitted) return
    setSelected(option)
  }

  function handleSubmit() {
    if (submittingRef.current || submitted || selected === null) return
    submittingRef.current = true
    setSubmitted(true)
    setAnswers((prev) => ({ ...prev, [current.id]: selected }))
  }

  function handleNext() {
    submittingRef.current = false
    if (isLast) {
      setPhase('complete')
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setSubmitted(false)
  }

  function handleRetryIncorrect(result: QuizResult) {
    const retryQuestions = selectRetryQuestions(questions, result)
    setQuestions(retryQuestions)
    setIndex(0)
    setSelected(null)
    setSubmitted(false)
    setAnswers({})
    submittingRef.current = false
    setPhase('active')
  }

  if (phase === 'complete') {
    const result = scoreQuiz(questions, answers)
    return (
      <QuizSummary
        questions={questions}
        result={result}
        lessonTitleBySlug={lessonTitleBySlug}
        onRetryIncorrect={() => handleRetryIncorrect(result)}
      />
    )
  }

  const isCorrectOption = (option: string) => option === current.correctAnswer
  const submissionAnnouncement = submitted
    ? selected !== null && isCorrectOption(selected)
      ? 'Correct.'
      : `Incorrect. The correct answer is: ${current.correctAnswer}.`
    : ''

  return (
    <div className="space-y-6">
      <p aria-live="polite" className="text-sm font-semibold text-slate-500">
        Question {index + 1} of {questions.length}
      </p>
      {/* Separate from the progress text above so a submission doesn't get
          lost in (or overwrite) the "Question X of N" announcement. */}
      <div aria-live="polite" className="sr-only">
        {submissionAnnouncement}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2
          ref={questionHeadingRef}
          tabIndex={-1}
          className="rounded text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
        >
          {current.question}
        </h2>

        <fieldset className="mt-4 space-y-2">
          <legend className="sr-only">Answer options for question {index + 1}</legend>
          {(current.options ?? []).map((option) => {
            const isSelected = selected === option
            const showResult = submitted
            const correct = isCorrectOption(option)

            return (
              <label
                key={option}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                  submitted ? 'cursor-default' : 'cursor-pointer',
                  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600 has-[:focus-visible]:ring-offset-1',
                  !showResult && isSelected && 'border-emerald-500 bg-emerald-50 text-emerald-900',
                  !showResult && !isSelected && 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                  showResult && correct && 'border-emerald-500 bg-emerald-50 text-emerald-900',
                  showResult && isSelected && !correct && 'border-red-400 bg-red-50 text-red-900',
                  showResult && !isSelected && !correct && 'border-slate-200 text-slate-500'
                )}
              >
                <input
                  type="radio"
                  name={`answer-${current.id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => handleSelect(option)}
                  disabled={submitted}
                  className="sr-only"
                />
                {showResult && correct && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                {showResult && isSelected && !correct && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
                <span>
                  {option}
                  {showResult && correct && <span className="sr-only"> (Correct answer)</span>}
                  {showResult && isSelected && !correct && <span className="sr-only"> (Your answer -- incorrect)</span>}
                </span>
              </label>
            )
          })}
        </fieldset>

        {submitted && (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{current.explanation}</p>
        )}

        <div className="mt-5 flex justify-end">
          {!submitted ? (
            <Button type="button" onClick={handleSubmit} disabled={selected === null}>
              Submit answer
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              {isLast ? 'Finish quiz' : 'Next question'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuizSummary({
  questions,
  result,
  lessonTitleBySlug,
  onRetryIncorrect,
}: {
  questions: PracticeQuestion[]
  result: QuizResult
  lessonTitleBySlug: Record<string, string>
  onRetryIncorrect: () => void
}) {
  const resultByQuestionId = new Map(result.results.map((r) => [r.questionId, r]))
  const hasIncorrect = result.correctCount < result.total
  const summaryHeadingRef = useRef<HTMLHeadingElement>(null)

  // Moves focus to the completion summary as soon as it mounts, so a
  // keyboard/screen-reader user lands directly on the result instead of
  // staying on the "Finish quiz" button that just disappeared.
  useEffect(() => {
    summaryHeadingRef.current?.focus()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Quiz complete</p>
        <h2
          ref={summaryHeadingRef}
          tabIndex={-1}
          className="mt-1 rounded text-3xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
        >
          {result.correctCount} of {result.total} correct
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {hasIncorrect && (
            <Button type="button" variant="secondary" onClick={onRetryIncorrect}>
              Retry incorrect questions
            </Button>
          )}
          <Link href="/practice/quiz/builder" className={buttonVariants({ variant: 'primary' })}>
            Start another quiz
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const r = resultByQuestionId.get(q.id)
          const relatedLessons = q.relatedLessonSlugs.filter((slug) => slug in lessonTitleBySlug)

          return (
            <div key={q.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-2.5">
                {r?.correct ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                ) : (
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Question {i + 1}: {q.question}
                    <span className="sr-only">{r?.correct ? ' (Correct answer)' : ' (Incorrect answer)'}</span>
                  </p>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Your answer: <span className="font-medium text-slate-800">{r?.userAnswer ?? '(no answer)'}</span>
                  </p>
                  {!r?.correct && (
                    <p className="mt-0.5 text-sm text-slate-600">
                      Correct answer: <span className="font-medium text-emerald-700">{q.correctAnswer}</span>
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{q.explanation}</p>
                  {relatedLessons.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {relatedLessons.map((slug) => (
                        <Link
                          key={slug}
                          href={`/learn/ibm-i-fundamentals/${slug}`}
                          className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                        >
                          Review: {lessonTitleBySlug[slug]}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
