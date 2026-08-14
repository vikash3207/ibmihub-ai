/**
 * The three published-content types the AI Tutor can be grounded in
 * (lessons, IBM i Insights articles, Deep Dive guides). Shared between the
 * client context payload below, lib/ai/content-chunks.ts's chunking, and
 * lib/ai/retrieve-published-content.ts's retrieval -- one union, not a
 * parallel string type per module.
 */
export type AiContentType = 'lesson' | 'insight' | 'deep-dive'

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
      /**
       * The learner is reading a published Deep Dive (PR #181). Only stable
       * identifiers travel over the wire -- the server re-resolves the slug
       * against content/deep-dives/catalog.ts and ignores anything it cannot
       * verify, so `title` here is for the client-side label only and is
       * never trusted as grounding.
       */
      sourceType: 'deep-dive'
      deepDiveSlug: string
      deepDiveTitle: string
      deepDivePath: string
      /** Heading anchor of the section currently in view, when known. Reserved for section-aware retrieval (see PR notes). */
      sectionId?: string
    }
  | {
      /**
       * The learner is reading a published IBM i Insight article. Only
       * stable identifiers travel over the wire -- the server re-resolves
       * the slug against content/insights/catalog.ts and ignores anything
       * it cannot verify, exactly mirroring the 'deep-dive' case above.
       * `title` here is for the client-side label only and is never
       * trusted as grounding.
       */
      sourceType: 'insight'
      insightSlug: string
      insightTitle: string
      insightPath: string
    }
  | {
      /** The learner is browsing the Learning Center curriculum (PR #181). */
      sourceType: 'learning-center'
      title: string
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
    case 'deep-dive':
      return `Using Deep Dive context: ${context.deepDiveTitle}`
    case 'insight':
      return `Using Insight context: ${context.insightTitle}`
    case 'learning-center':
      return `Using Learning Center context`
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
    case 'deep-dive':
      return `deep-dive:${context.deepDiveSlug}:${context.sectionId ?? ''}`
    case 'insight':
      return `insight:${context.insightSlug}`
    case 'learning-center':
      return 'learning-center'
    case 'general':
      return 'general'
  }
}

/**
 * A compact, UI-safe reference to a piece of published content (lesson,
 * Insight, or Deep Dive) an AI Tutor response was grounded in (PR #132 --
 * Source / Related Lesson References Polish; generalized beyond lessons
 * once Insight/Deep Dive retrieval landed). Deliberately excludes chunk
 * text, score, and match reasons: those are internal retrieval details
 * (lib/ai/retrieve-published-content.ts), not something to show a learner.
 * `heading` is only ever present when a single distinct section of that
 * content item was used, to keep the display to one line per source rather
 * than listing every matched section.
 */
export interface AiTutorSourceRef {
  contentType: AiContentType
  title: string
  slug: string
  path: string
  heading?: string
}
