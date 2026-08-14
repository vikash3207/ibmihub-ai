/**
 * Builds the compact, UI-safe source list for the AI Tutor's "Sources used"
 * display (PR #132 -- Source / Related Lesson References Polish; generalized
 * beyond lessons once Insight/Deep Dive retrieval landed) from a RAG v2
 * retrieval result (lib/ai/retrieve-published-content.ts).
 *
 * Split into its own module, separate from app/api/ai-tutor/route.ts, so it
 * can be imported without that route's next/server + Supabase dependencies
 * -- this function itself does no I/O, it only transforms an already-
 * fetched result object. That makes it directly importable from
 * scripts/rag-regression.ts (PR #133) for regression testing.
 */
import type { RetrievalResult } from './retrieve-published-content'
import type { AiTutorSourceRef } from '@/components/ai-tutor/types'

/** Never show more than this many distinct content sources under a single reply -- keeps "Sources used" compact. */
export const MAX_SOURCE_REFS = 5

/**
 * Build a compact, UI-safe, deduplicated source list from a retrieval
 * result. One entry per distinct content item (deduped by content type +
 * slug, since a lesson and an Insight could theoretically share a slug
 * string across their independent catalogs), in the chunks' existing
 * relevance order (current-page bucket first, then general retrieval by
 * score) -- never one entry per chunk/heading, matching the "Sources used"
 * UX the request specified. `heading` is only kept when an item contributed
 * exactly one distinct section, so an item with multiple matched sections
 * shows as a single clean title-only line rather than an ambiguous/repeated
 * heading.
 *
 * Gated on hasStrongMatch: a weak/incidental retrieval result must not
 * produce a visible source list that implies confident site coverage (the
 * "PowerHA" case from PR #131 QA) -- callers should only attach this to the
 * response when the gate passes.
 */
export function buildSourceRefs(result: RetrievalResult): AiTutorSourceRef[] {
  if (!result.hasStrongMatch) {
    return []
  }

  const headingsByKey = new Map<string, Set<string>>()
  const order: string[] = []
  const byKey = new Map<string, AiTutorSourceRef>()

  for (const chunk of result.chunks) {
    const key = `${chunk.contentType}:${chunk.slug}`
    if (!byKey.has(key)) {
      byKey.set(key, {
        contentType: chunk.contentType,
        title: chunk.title,
        slug: chunk.slug,
        path: chunk.path,
      })
      order.push(key)
      headingsByKey.set(key, new Set())
    }
    headingsByKey.get(key)!.add(chunk.heading)
  }

  return order.slice(0, MAX_SOURCE_REFS).map((key) => {
    const ref = byKey.get(key)!
    const headings = headingsByKey.get(key)!
    return headings.size === 1 ? { ...ref, heading: [...headings][0] } : ref
  })
}
