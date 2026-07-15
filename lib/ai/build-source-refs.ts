/**
 * Builds the compact, UI-safe source list for the AI Tutor's "Sources used"
 * display (PR #132 -- Source / Related Lesson References Polish) from a RAG
 * v2 retrieval result (lib/ai/retrieve-course-context.ts).
 *
 * Split into its own module, separate from app/api/ai-tutor/route.ts, so it
 * can be imported without that route's next/server + Supabase dependencies
 * -- this function itself does no I/O, it only transforms an already-
 * fetched result object. That makes it directly importable from
 * scripts/rag-regression.ts (PR #133) for regression testing.
 */
import type { CourseContextResult } from './retrieve-course-context'
import type { AiTutorSourceRef } from '@/components/ai-tutor/types'

/** Never show more than this many distinct lesson sources under a single reply -- keeps "Sources used" compact. */
export const MAX_SOURCE_REFS = 5

/**
 * Build a compact, UI-safe, deduplicated source list from a retrieval
 * result. One entry per distinct lesson, in the chunks' existing relevance
 * order (current lesson bucket first, then general retrieval by score) --
 * never one entry per chunk/heading, matching the "Sources used" UX the
 * request specified. `heading` is only kept when a lesson contributed
 * exactly one distinct section, so a lesson with multiple matched sections
 * shows as a single clean title-only line rather than an ambiguous/repeated
 * heading.
 *
 * Gated on hasStrongMatch: a weak/incidental retrieval result must not
 * produce a visible source list that implies confident course coverage
 * (the "PowerHA" case from PR #131 QA) -- callers should only attach this
 * to the response when the gate passes.
 */
export function buildSourceRefs(result: CourseContextResult): AiTutorSourceRef[] {
  if (!result.hasStrongMatch) {
    return []
  }

  const headingsBySlug = new Map<string, Set<string>>()
  const order: string[] = []
  const bySlug = new Map<string, { lessonTitle: string; lessonSlug: string; lessonPath: string }>()

  for (const chunk of result.chunks) {
    if (!bySlug.has(chunk.lessonSlug)) {
      bySlug.set(chunk.lessonSlug, {
        lessonTitle: chunk.lessonTitle,
        lessonSlug: chunk.lessonSlug,
        lessonPath: chunk.lessonPath,
      })
      order.push(chunk.lessonSlug)
      headingsBySlug.set(chunk.lessonSlug, new Set())
    }
    headingsBySlug.get(chunk.lessonSlug)!.add(chunk.heading)
  }

  return order.slice(0, MAX_SOURCE_REFS).map((slug) => {
    const lesson = bySlug.get(slug)!
    const headings = headingsBySlug.get(slug)!
    return headings.size === 1 ? { ...lesson, heading: [...headings][0] } : lesson
  })
}
