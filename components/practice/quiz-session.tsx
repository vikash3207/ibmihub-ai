'use client'

import { useRef, useState } from 'react'
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

  const current = questions[index]
  const isLast = index === questions.length - 1

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

  return (
    <div className="space-y-6">
      <p aria-live="polite" className="text-sm font-semibold text-slate-500">
        Question {index + 1} of {questions.length}
      </p>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{current.question}</h2>

        <div className="mt-4 space-y-2" role="radiogroup" aria-label={`Answer options for question ${index + 1}`}>
          {(current.options ?? []).map((option) => {
            const isSelected = selected === option
            const showResult = submitted
            const correct = isCorrectOption(option)

            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={submitted}
                onClick={() => handleSelect(option)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1',
                  !showResult && isSelected && 'border-emerald-500 bg-emerald-50 text-emerald-900',
                  !showResult && !isSelected && 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                  showResult && correct && 'border-emerald-500 bg-emerald-50 text-emerald-900',
                  showResult && isSelected && !correct && 'border-red-400 bg-red-50 text-red-900',
                  showResult && !isSelected && !correct && 'border-slate-200 text-slate-500'
                )}
              >
                {showResult && correct && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                {showResult && isSelected && !correct && <X className="h-4 w-4 shrink-0" aria-hidden="true" />}
                <span>{option}</span>
              </button>
            )
          })}
        </div>

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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Quiz complete</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">
          {result.correctCount} of {result.total} correct
        </p>
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
