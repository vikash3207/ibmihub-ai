'use client'

import { useEffect } from 'react'
import { useAiTutorPanel } from './ai-tutor-panel-provider'
import { getContextKey, type AiTutorContext } from './types'

/**
 * Keeps the AI Tutor panel's active context in sync with the lesson
 * currently being viewed, but only while the panel is already open (Spec
 * 001 v1.1 AI-TUTOR-FR-024: navigating to the next/previous lesson with the
 * panel open must update the context indicator without the learner
 * re-clicking "Ask the AI Tutor").
 *
 * Deliberately lesson-page-only: the Practice page renders many question
 * cards (and therefore many AskAiTutorButton instances) at once, so an
 * automatic "sync on mount" behavior there would cause whichever question
 * happens to render/re-render to silently steal the active context. On
 * Practice, context only ever changes via an explicit button click.
 */
export function SyncActiveLessonContext({ context }: { context: Extract<AiTutorContext, { sourceType: 'lesson' }> }) {
  const { isOpen, updateContext } = useAiTutorPanel()
  const key = getContextKey(context)

  useEffect(() => {
    if (isOpen) {
      updateContext(context)
    }
    // Only re-sync when the lesson identity or open state actually changes --
    // `context` itself is a fresh object every render and would otherwise
    // cause this effect to fire on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isOpen])

  return null
}
