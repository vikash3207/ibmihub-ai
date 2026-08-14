/**
 * Formats a RAG v2 retrieval result (lib/ai/retrieve-published-content.ts)
 * as a prompt section. Split into its own module so it can be imported
 * without pulling in retrieve-published-content.ts's `server-only` +
 * Supabase/fs dependencies -- this function itself does no I/O, it only
 * formats an already-fetched result object. That makes it directly
 * importable from scripts/rag-regression.ts (PR #133) for regression
 * testing.
 *
 * Re-exported from retrieve-published-content.ts so existing callers
 * (app/api/ai-tutor/route.ts) see no import-path change.
 *
 * Originally lib/ai/format-course-context.ts, lesson-only (formatted a
 * "lessonTitle"/"lessonSlug" chunk shape). Generalized to label each chunk
 * with its content type (Lesson/Insight/Deep Dive) so the model can tell
 * the learner which kind of iRPGenie content a quoted section came from.
 */
import type { RetrievalResult } from './retrieve-published-content'
import type { AiContentType } from '@/components/ai-tutor/types'

function labelForContentType(contentType: AiContentType): string {
  switch (contentType) {
    case 'lesson':
      return 'Lesson'
    case 'insight':
      return 'Insight'
    case 'deep-dive':
      return 'Deep Dive'
  }
}

/**
 * Honest about a weak/empty result: distinguishes "nothing found" from
 * "found some loosely-related chunks, but treat that as weak coverage"
 * (planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md Section D.4/G) rather than only
 * checking whether the array is empty.
 */
export function formatRetrievedContentForPrompt(result: RetrievalResult): string {
  if (result.chunks.length === 0) {
    return 'No closely related published content was found in the iRPGenie catalog (lessons, Insights, or Deep Dives) for this question. This may be a topic the site does not cover deeply yet.'
  }

  const header = 'These iRPGenie content sections may be relevant to the question:'
  const body = result.chunks
    .map((c, i) => `${i + 1}. [${labelForContentType(c.contentType)}] "${c.title}" (slug: ${c.slug}) -- ${c.heading}\n   ${c.chunkText}`)
    .join('\n\n')

  const weakNote = result.hasStrongMatch
    ? ''
    : '\n\n(Note: these are only loosely related matches, not a strong or confident hit -- treat this as weak or absent site coverage, not confirmation the site covers this topic in depth.)'

  return `${header}\n\n${body}${weakNote}`
}
