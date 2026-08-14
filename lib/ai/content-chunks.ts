/**
 * Splits a published content item's markdown body into heading-delimited
 * chunks for AI Tutor retrieval (RAG v2 MVP --
 * planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md Section D). Server-only-safe
 * (no I/O itself). Pure function: takes the item's own metadata plus its
 * already-loaded markdown text and returns chunks -- it does not fetch
 * anything itself.
 *
 * Originally lib/ai/lesson-chunks.ts, lesson-only. Generalized to cover
 * IBM i Insights and Deep Dive guides too (AI Tutor Insights/Deep Dives
 * Grounding): every published content type in this app is authored as
 * Markdown with `##`-level section headings (lessons follow a fixed
 * 7-section template; Insights and Deep Dives use `##` for their major
 * sections, sometimes with `###` subsections nested underneath -- those
 * stay merged into their parent `##` chunk, which is fine: a slightly
 * larger section-level chunk is still a coherent, groundable unit). One
 * splitting function serves all three rather than a near-duplicate per
 * content type.
 *
 * IMPORTANT: this module has no opinion about which content is safe to
 * chunk. The caller (lib/ai/retrieve-published-content.ts) is the single
 * enforcement point for "only Published/published content," exactly
 * mirroring how lib/lessons.ts's getPublishedLessons(), content/insights/
 * catalog.ts's getPublishedInsights(), and content/deep-dives/catalog.ts's
 * DEEP_DIVES.filter(isDeepDiveAvailable) are the only sources of content
 * metadata passed in here. Never call this with draft/review-ready/planned
 * content.
 *
 * Not tagged `server-only`: this module is pure (no fs/db access, just
 * string/regex processing of markdown text passed in by the caller) and is
 * imported directly by scripts/rag-regression.ts (PR #133) for regression
 * testing, which cannot run inside Next's server-component bundling context.
 * Only lib/ai/retrieve-published-content.ts (itself server-only) imports
 * this in the app, so nothing client-facing is affected.
 */
import type { AiContentType } from '@/components/ai-tutor/types'

export interface ChunkableContent {
  contentType: AiContentType
  slug: string
  title: string
  /** Canonical site-relative route, e.g. /learn/ibm-i-fundamentals/x, /insights/x, /deep-dives/x. */
  path: string
  tags: string[]
  /** Lesson-only taxonomy fields; always null for Insights and Deep Dives, which don't use the master-category system. */
  masterCategoryId: string | null
  masterSubcategory: string | null
  secondaryCategoryIds: string[]
}

export interface ContentChunk {
  contentType: AiContentType
  slug: string
  title: string
  path: string
  heading: string
  chunkText: string
  tags: string[]
  masterCategoryId: string | null
  masterSubcategory: string | null
  secondaryCategoryIds: string[]
}

const HEADING_RE = /^##\s+(.+)$/gm

/** Split a content item's markdown body into one chunk per `##` heading, or a single fallback chunk if it has none. */
export function chunkMarkdownContent(content: ChunkableContent, markdown: string): ContentChunk[] {
  const base = {
    contentType: content.contentType,
    slug: content.slug,
    title: content.title,
    path: content.path,
    tags: content.tags,
    masterCategoryId: content.masterCategoryId,
    masterSubcategory: content.masterSubcategory,
    secondaryCategoryIds: content.secondaryCategoryIds,
  }

  // Strip a leading "# Title" line -- it's redundant with title, which
  // every chunk already carries. Insights never have one (catalog carries
  // the title instead), so this is a no-op for them.
  const withoutTitle = markdown.replace(/^#\s+.+\r?\n+/, '')

  const matches = [...withoutTitle.matchAll(HEADING_RE)]

  if (matches.length === 0) {
    const text = withoutTitle.trim()
    return text ? [{ ...base, heading: content.title, chunkText: text }] : []
  }

  const chunks: ContentChunk[] = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const heading = match[1].trim()
    const start = match.index! + match[0].length
    const end = i + 1 < matches.length ? matches[i + 1].index! : withoutTitle.length
    const chunkText = withoutTitle.slice(start, end).trim()
    if (chunkText) {
      chunks.push({ ...base, heading, chunkText })
    }
  }
  return chunks
}
