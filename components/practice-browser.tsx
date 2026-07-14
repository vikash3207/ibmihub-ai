'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, X, Sparkles } from 'lucide-react'
import type { PracticeQuestion, PracticeTopic } from '@/content/practice/questions'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PracticeBrowserProps {
  topics: PracticeTopic[]
  questions: PracticeQuestion[]
  /** Published-lesson slug -> title, for rendering "Related lessons" as real links. */
  lessonTitleBySlug: Record<string, string>
  /** Pre-select a topic (e.g. arriving via /practice?topic=rpgle-file-io from a lesson page). */
  initialTopicId?: string | null
}

function QuestionCard({
  question,
  lessonTitleBySlug,
}: {
  question: PracticeQuestion
  lessonTitleBySlug: Record<string, string>
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const isMultipleChoice = question.type === 'multiple-choice' && question.options

  function selectOption(option: string) {
    if (revealed) return
    setSelectedOption(option)
    setRevealed(true)
  }

  const linkableRelatedLessons = question.relatedLessonSlugs.filter((slug) => lessonTitleBySlug[slug])

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">{question.title}</p>
      <p className="whitespace-pre-wrap text-sm font-medium text-slate-900 mb-3">{question.question}</p>

      {isMultipleChoice ? (
        <div className="space-y-2">
          {question.options!.map((option) => {
            const isSelected = selectedOption === option
            const isCorrect = option === question.correctAnswer
            const showState = revealed && (isSelected || isCorrect)

            return (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(option)}
                disabled={revealed}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors',
                  !revealed && 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50',
                  revealed && !showState && 'border-slate-100 text-slate-500',
                  showState && isCorrect && 'border-emerald-300 bg-emerald-50 text-emerald-900',
                  showState && isSelected && !isCorrect && 'border-red-300 bg-red-50 text-red-900'
                )}
              >
                <span>{option}</span>
                {showState && isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />}
                {showState && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      ) : (
        !revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
          >
            Reveal answer
          </button>
        )
      )}

      {revealed && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
          {!isMultipleChoice && (
            <p className="text-sm text-slate-800">
              <span className="font-semibold">Answer: </span>
              {question.correctAnswer}
            </p>
          )}
          <p className="text-sm text-slate-600 leading-relaxed">{question.explanation}</p>

          {linkableRelatedLessons.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-slate-700">Related lessons: </span>
              {linkableRelatedLessons.map((slug, i) => (
                <span key={slug}>
                  <Link
                    href={`/learn/ibm-i-fundamentals/${slug}`}
                    prefetch={false}
                    className="text-blue-600 hover:underline"
                  >
                    {lessonTitleBySlug[slug]}
                  </Link>
                  {i < linkableRelatedLessons.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}

          <Link
            href={linkableRelatedLessons[0] ? `/ai-tutor?lesson=${encodeURIComponent(linkableRelatedLessons[0])}` : '/ai-tutor'}
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:text-cyan-800"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Ask the AI Tutor to explain this question
          </Link>
        </div>
      )}
    </div>
  )
}

export function PracticeBrowser({ topics, questions, lessonTitleBySlug, initialTopicId }: PracticeBrowserProps) {
  const validInitialTopicId = initialTopicId && topics.some((t) => t.id === initialTopicId) ? initialTopicId : null
  // Default to the first topic rather than "All Topics" on first load -- with
  // 16 topics and 96 questions, rendering every question at once by default
  // makes for a very long, slow-to-scan first page load. "All Topics" is
  // still one click away for anyone who wants to browse everything.
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(validInitialTopicId ?? topics[0]?.id ?? null)

  const questionsByTopic = useMemo(() => {
    const map = new Map<string, PracticeQuestion[]>()
    for (const topic of topics) {
      map.set(
        topic.id,
        questions.filter((q) => q.topicId === topic.id)
      )
    }
    return map
  }, [topics, questions])

  const visibleTopics = selectedTopicId ? topics.filter((t) => t.id === selectedTopicId) : topics

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedTopicId(null)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            selectedTopicId === null ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          )}
        >
          All Topics
        </button>
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => setSelectedTopicId(topic.id === selectedTopicId ? null : topic.id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              selectedTopicId === topic.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {visibleTopics.map((topic) => {
        const topicQuestions = questionsByTopic.get(topic.id) ?? []
        return (
          <section key={topic.id} className="space-y-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                {topic.label}
                <Badge variant="neutral">{topicQuestions.length} questions</Badge>
              </h2>
              <p className="text-sm text-slate-600">{topic.description}</p>
            </div>
            <div className="space-y-3">
              {topicQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} lessonTitleBySlug={lessonTitleBySlug} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
