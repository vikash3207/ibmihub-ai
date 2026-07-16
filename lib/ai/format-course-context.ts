/**
 * Formats a RAG v2 retrieval result (lib/ai/retrieve-course-context.ts) as a
 * prompt section. Split into its own module so it can be imported without
 * pulling in retrieve-course-context.ts's `server-only` + Supabase/fs
 * dependencies -- this function itself does no I/O, it only formats an
 * already-fetched result object. That makes it directly importable from
 * scripts/rag-regression.ts (PR #133) for regression testing.
 *
 * Re-exported from retrieve-course-context.ts so existing callers
 * (app/api/ai-tutor/route.ts) see no import-path change.
 */
import type { CourseContextResult } from './retrieve-course-context'

/**
 * Honest about a weak/empty result: distinguishes "nothing found" from
 * "found some loosely-related chunks, but treat that as weak coverage"
 * (planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md Section D.4/G) rather than only
 * checking whether the array is empty.
 */
export function formatCourseContextForPrompt(result: CourseContextResult): string {
  if (result.chunks.length === 0) {
    return 'No closely related course content was found in the iRPGenie course catalog for this question. This may be a topic the course does not cover deeply yet.'
  }

  const header = 'These iRPGenie course sections may be relevant to the question:'
  const body = result.chunks
    .map((c, i) => `${i + 1}. "${c.lessonTitle}" (slug: ${c.lessonSlug}) -- ${c.heading}\n   ${c.chunkText}`)
    .join('\n\n')

  const weakNote = result.hasStrongMatch
    ? ''
    : '\n\n(Note: these are only loosely related matches, not a strong or confident hit -- treat this as weak or absent course coverage, not confirmation the course covers this topic in depth.)'

  return `${header}\n\n${body}${weakNote}`
}
