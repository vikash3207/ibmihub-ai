/**
 * Unified AI Tutor course-content retrieval (RAG v2 MVP --
 * planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md Section D/F). Server-only.
 *
 * This is the single retrieval entry point for all three AI Tutor origins
 * (lesson, practice, general) -- app/api/ai-tutor/route.ts calls this the
 * same way regardless of where the request came from, so the embedded
 * panel and the standalone /ai-tutor page always share one retrieval
 * implementation, never two (Spec 001 v1.1 AI-TUTOR-FR-023).
 *
 * Replaces the earlier lib/ai/lesson-context.ts (whole-lesson-body
 * grounding) and lib/ai/retrieve-lessons.ts (whole-lesson keyword
 * retrieval): both are superseded by chunk-level retrieval here.
 *
 * Published-only guarantee: the only source of lessons this module ever
 * reads is getPublishedLessons(), which already filters `status =
 * 'Published'` at the Supabase query level (lib/lessons.ts). Review Ready
 * and Draft lessons are never visible to this module, let alone retrievable.
 */
import 'server-only'

import { getPublishedLessons, loadLessonMarkdown } from '@/lib/lessons'
import { chunkLessonMarkdown, type LessonChunk } from './lesson-chunks'
import { tokenize, scoreChunk } from './retrieval-score'

/** Chunks guaranteed from the current lesson itself (if any), regardless of keyword score -- see retrieveCourseContext's module comment for why this is a separate, capped bucket rather than a scoring boost. */
const CURRENT_LESSON_MAX_CHUNKS = 3
const CURRENT_LESSON_MAX_CHARS = 3000

/** Overall result caps, across the current-lesson bucket plus general retrieval combined. */
const DEFAULT_MAX_CHUNKS = 6
const DEFAULT_MAX_TOTAL_CHARACTERS = 8000

/** Only this many metadata-prescored candidates (plus any guaranteed lessons) get their body read/chunked, to keep this cheap per request. */
const METADATA_SHORTLIST_SIZE = 24

/** A chunk needs at least this score to count as a "strong" match -- used to decide whether the model should be told coverage is weak, not just whether the array is empty. */
const STRONG_MATCH_SCORE = 5

export interface CourseContextOptions {
  /** The learner's latest message -- what to retrieve for. */
  query: string
  /** Set when opened from a specific lesson page (AiTutorContext sourceType: 'lesson'). */
  currentLessonSlug?: string
  /** Set when opened from a practice question with known related lessons (AiTutorContext sourceType: 'practice'). */
  relatedLessonSlugs?: string[]
  maxChunks?: number
  maxTotalCharacters?: number
}

export interface RetrievedChunk {
  lessonTitle: string
  lessonSlug: string
  lessonPath: string
  heading: string
  chunkText: string
  score: number
  reasons: string[]
}

export interface CourseContextResult {
  chunks: RetrievedChunk[]
  /** True if at least one chunk scored high enough to be a genuine, confident match -- not just present because it was guaranteed (current lesson) or barely scraped a nonzero score. */
  hasStrongMatch: boolean
  /** Set only when currentLessonSlug was provided and actually resolved to a Published lesson -- lets the caller build an accurate "Using lesson context: <title>" label without a second lookup. */
  resolvedCurrentLesson: { slug: string; title: string } | null
}

function toRetrievedChunk(scored: { chunk: LessonChunk; score: number; reasons: string[] }): RetrievedChunk {
  const { chunk, score, reasons } = scored
  return {
    lessonTitle: chunk.lessonTitle,
    lessonSlug: chunk.lessonSlug,
    lessonPath: chunk.lessonPath,
    heading: chunk.heading,
    chunkText: chunk.chunkText,
    score,
    reasons,
  }
}

/**
 * Retrieve the top course-content chunks relevant to a query, optionally
 * grounded in a specific lesson and/or a set of practice-question related
 * lessons.
 *
 * Two-part strategy, deliberately kept separate rather than folded into one
 * scoring pass:
 *   1. A small, capped "current lesson" bucket (if currentLessonSlug is
 *      given) that always draws from that lesson's own chunks, ranked among
 *      themselves by query relevance -- this guarantees a lesson-origin
 *      question like "explain this lesson in simpler terms" (which has no
 *      keyword overlap with anything) still gets grounded in the right
 *      lesson, without a scoring boost so large it would also crowd out a
 *      genuinely more relevant lesson elsewhere for an unrelated question
 *      asked from the same page.
 *   2. A general retrieval pass across the whole Published catalog (minus
 *      the current lesson, already covered by part 1), scored with a mild
 *      same-category nudge and a stronger relatedLessonSlugs boost, filling
 *      whatever chunk/character budget the current-lesson bucket left.
 */
export async function retrieveCourseContext(options: CourseContextOptions): Promise<CourseContextResult> {
  const { query, currentLessonSlug, relatedLessonSlugs, maxChunks = DEFAULT_MAX_CHUNKS, maxTotalCharacters = DEFAULT_MAX_TOTAL_CHARACTERS } = options

  const queryTokens = Array.from(new Set(tokenize(query)))
  const queryLower = query.trim().toLowerCase()

  const lessons = await getPublishedLessons()
  const currentLesson = currentLessonSlug ? lessons.find((l) => l.slug === currentLessonSlug) ?? null : null

  // --- Part 1: current lesson's own chunks (guaranteed, capped) ---
  const currentLessonChunks: RetrievedChunk[] = []
  if (currentLesson) {
    let markdown = ''
    try {
      markdown = await loadLessonMarkdown(currentLesson)
    } catch {
      // A lesson whose content can't be read just contributes no chunks here.
    }
    const chunks = chunkLessonMarkdown(
      {
        slug: currentLesson.slug,
        title: currentLesson.title,
        tags: currentLesson.tags ?? null,
        masterCategoryId: currentLesson.master_category_id ?? null,
        masterSubcategory: currentLesson.master_subcategory ?? null,
        secondaryCategoryIds: currentLesson.secondary_category_ids ?? null,
      },
      markdown
    )
    const scoredOwnChunks = chunks.map((chunk) => scoreChunk(chunk, queryTokens, queryLower))
    const anyPositive = scoredOwnChunks.some((s) => s.score > 0)
    const ordered = anyPositive ? [...scoredOwnChunks].sort((a, b) => b.score - a.score) : scoredOwnChunks

    let usedChars = 0
    for (const scored of ordered) {
      if (currentLessonChunks.length >= CURRENT_LESSON_MAX_CHUNKS) break
      if (usedChars + scored.chunk.chunkText.length > CURRENT_LESSON_MAX_CHARS && currentLessonChunks.length > 0) continue
      currentLessonChunks.push(toRetrievedChunk({ ...scored, reasons: [...scored.reasons, 'current lesson'] }))
      usedChars += scored.chunk.chunkText.length
    }
  }

  // --- Part 2: general retrieval across the rest of the catalog ---
  const currentLessonCategory = currentLesson?.master_category_id ?? null
  const candidates = currentLessonSlug ? lessons.filter((l) => l.slug !== currentLessonSlug) : lessons

  const metadataScored = candidates.map((lesson) => {
    const titleTokens = new Set(tokenize(lesson.title))
    const tagTokens = new Set((lesson.tags ?? []).flatMap(tokenize))
    const descTokens = new Set(tokenize(lesson.short_description))
    let score = 0
    for (const token of queryTokens) {
      if (titleTokens.has(token)) score += 5
      if (tagTokens.has(token)) score += 4
      if (descTokens.has(token)) score += 2
    }
    return { lesson, score }
  })

  const guaranteedSlugs = new Set(relatedLessonSlugs ?? [])
  const shortlist = [
    ...metadataScored.filter((e) => guaranteedSlugs.has(e.lesson.slug)),
    ...metadataScored
      .filter((e) => !guaranteedSlugs.has(e.lesson.slug) && e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, METADATA_SHORTLIST_SIZE),
  ]

  const generalScoredChunks: { chunk: LessonChunk; score: number; reasons: string[] }[] = []
  await Promise.all(
    shortlist.map(async ({ lesson }) => {
      let markdown: string
      try {
        markdown = await loadLessonMarkdown(lesson)
      } catch {
        return
      }
      const chunks = chunkLessonMarkdown(
        {
          slug: lesson.slug,
          title: lesson.title,
          tags: lesson.tags ?? null,
          masterCategoryId: lesson.master_category_id ?? null,
          masterSubcategory: lesson.master_subcategory ?? null,
          secondaryCategoryIds: lesson.secondary_category_ids ?? null,
        },
        markdown
      )
      for (const chunk of chunks) {
        generalScoredChunks.push(
          scoreChunk(chunk, queryTokens, queryLower, {
            relatedLessonSlugs,
            currentMasterCategoryId: currentLessonCategory,
          })
        )
      }
    })
  )

  generalScoredChunks.sort((a, b) => b.score - a.score)

  const remainingSlots = Math.max(0, maxChunks - currentLessonChunks.length)
  const currentLessonChars = currentLessonChunks.reduce((sum, c) => sum + c.chunkText.length, 0)
  let remainingChars = Math.max(0, maxTotalCharacters - currentLessonChars)

  const generalChunks: RetrievedChunk[] = []
  for (const scored of generalScoredChunks) {
    if (generalChunks.length >= remainingSlots) break
    if (scored.score <= 0) continue
    if (scored.chunk.chunkText.length > remainingChars && generalChunks.length > 0) continue
    generalChunks.push(toRetrievedChunk(scored))
    remainingChars -= scored.chunk.chunkText.length
  }

  const hasStrongMatch = generalChunks.some((c) => c.score >= STRONG_MATCH_SCORE) || currentLessonChunks.some((c) => c.score >= STRONG_MATCH_SCORE)

  return {
    chunks: [...currentLessonChunks, ...generalChunks],
    hasStrongMatch,
    resolvedCurrentLesson: currentLesson ? { slug: currentLesson.slug, title: currentLesson.title } : null,
  }
}

/**
 * Format a retrieval result as a prompt section. Honest about a weak/empty
 * result: distinguishes "nothing found" from "found some loosely-related
 * chunks, but treat that as weak coverage" (planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md
 * Section D.4/G) rather than only checking whether the array is empty.
 */
export function formatCourseContextForPrompt(result: CourseContextResult): string {
  if (result.chunks.length === 0) {
    return 'No closely related course content was found in the IBMiHub AI course catalog for this question. This may be a topic the course does not cover deeply yet.'
  }

  const header = 'These IBMiHub AI course sections may be relevant to the question:'
  const body = result.chunks
    .map((c, i) => `${i + 1}. "${c.lessonTitle}" (slug: ${c.lessonSlug}) -- ${c.heading}\n   ${c.chunkText}`)
    .join('\n\n')

  const weakNote = result.hasStrongMatch
    ? ''
    : '\n\n(Note: these are only loosely related matches, not a strong or confident hit -- treat this as weak or absent course coverage, not confirmation the course covers this topic in depth.)'

  return `${header}\n\n${body}${weakNote}`
}
