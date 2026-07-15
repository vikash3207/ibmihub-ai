/**
 * Shared AI Tutor context payload (Spec 001 v1.1 AI-TUTOR-FR-018/019/021).
 *
 * A discriminated union so the embedded panel, the standalone /ai-tutor
 * page, and the API route can all reason about "what is the AI Tutor
 * currently grounded in" the same way, regardless of which page opened it.
 *
 * IMPORTANT (AI-TUTOR-FR-021): callers building a 'practice' context MUST
 * only include correctAnswer/explanation when the learner has actually
 * revealed the answer in the Practice UI. This type deliberately makes both
 * fields optional so an un-revealed question's context object can omit them
 * entirely -- omission, not a prompt instruction, is what prevents the
 * answer from ever reaching the AI Tutor prematurely.
 */
export type AiTutorContext =
  | {
      sourceType: 'lesson'
      lessonSlug: string
      lessonTitle: string
      lessonPath: string
      topicId?: string
      masterCategoryId?: string
      suggestedQuestion?: string
    }
  | {
      sourceType: 'practice'
      questionId: string
      topicId: string
      questionTitle: string
      questionText: string
      options?: string[]
      selectedAnswer?: string
      revealed: boolean
      /** Only ever present when `revealed` is true -- see file-level note above. */
      correctAnswer?: string
      /** Only ever present when `revealed` is true -- see file-level note above. */
      explanation?: string
      relatedLessonSlugs: string[]
    }
  | {
      sourceType: 'general'
    }

export const GENERAL_CONTEXT: AiTutorContext = { sourceType: 'general' }

/** A short, human-readable label shown immediately when a context is set, before the server's own label (based on what grounding it actually found) arrives. */
export function getContextLabel(context: AiTutorContext): string | null {
  switch (context.sourceType) {
    case 'lesson':
      return `Using lesson context: ${context.lessonTitle}`
    case 'practice':
      return `Using practice context: ${context.questionTitle}`
    case 'general':
      return null
  }
}

/** A stable primitive key for a context, suitable for a React effect dependency array. */
export function getContextKey(context: AiTutorContext): string {
  switch (context.sourceType) {
    case 'lesson':
      return `lesson:${context.lessonSlug}`
    case 'practice':
      return `practice:${context.questionId}:${context.revealed}`
    case 'general':
      return 'general'
  }
}
