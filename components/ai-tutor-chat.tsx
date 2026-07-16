'use client'

import { useEffect, useRef } from 'react'
import { BookOpen } from 'lucide-react'
import { useAiTutorPanel } from '@/components/ai-tutor/ai-tutor-panel-provider'
import { ChatThread } from '@/components/ai-tutor/chat-thread'

export interface InitialLessonContext {
  slug: string
  title: string
}

interface Props {
  starterPrompts: string[]
  /** Set when AI Tutor was opened from a specific lesson page (e.g. ?lesson=slug). */
  initialLessonContext?: InitialLessonContext | null
}

/**
 * Standalone /ai-tutor page chat UI (Spec 001 AI-TUTOR-FR-022). Renders in
 * normal document flow, unlike the embedded panel -- but shares the exact
 * same conversation state and network logic via AiTutorPanelProvider
 * (Spec 001 v1.1 AI-TUTOR-FR-023: one implementation, not two). This means
 * a conversation started in the embedded panel elsewhere continues here if
 * the learner navigates directly to /ai-tutor, and vice versa.
 */
export function AiTutorChat({ starterPrompts, initialLessonContext }: Props) {
  const {
    context,
    contextLabel,
    messages,
    input,
    setInput,
    isStreaming,
    error,
    errorContactHref,
    requiresLogin,
    feedback,
    sources,
    limitReached,
    updateContext,
    submitMessage,
    handleFeedback,
  } = useAiTutorPanel()

  // Seed the lesson context once per distinct ?lesson= value. Deliberately
  // does not clear the conversation -- landing on /ai-tutor?lesson=X with an
  // existing conversation from elsewhere just updates what the context
  // indicator says, per Spec 001 v1.1 AI-TUTOR-FR-024.
  const seededSlugRef = useRef<string | null>(null)
  useEffect(() => {
    if (initialLessonContext && seededSlugRef.current !== initialLessonContext.slug) {
      seededSlugRef.current = initialLessonContext.slug
      updateContext({
        sourceType: 'lesson',
        lessonSlug: initialLessonContext.slug,
        lessonTitle: initialLessonContext.title,
        lessonPath: `/learn/ibm-i-fundamentals/${initialLessonContext.slug}`,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLessonContext?.slug])

  const loginHref = '/auth/login?next=%2Fai-tutor'

  return (
    <div className="space-y-4">
      {contextLabel && context.sourceType !== 'general' && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <BookOpen className="h-3 w-3" aria-hidden="true" />
          {contextLabel}
        </div>
      )}

      <ChatThread
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSubmit={(e) => {
          e.preventDefault()
          void submitMessage(input)
        }}
        isStreaming={isStreaming}
        error={error}
        errorContactHref={errorContactHref}
        limitReached={limitReached}
        feedback={feedback}
        onFeedback={handleFeedback}
        sources={sources}
        starterPrompts={starterPrompts}
        onStarterPromptClick={setInput}
        requiresLogin={requiresLogin}
        loginHref={loginHref}
      />
    </div>
  )
}
