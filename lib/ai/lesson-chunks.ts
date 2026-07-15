/**
 * Splits a lesson's markdown body into heading-delimited chunks for AI
 * Tutor retrieval (RAG v2 MVP -- planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md
 * Section D). Server-only. Pure function: takes a lesson's own metadata
 * plus its already-loaded markdown text and returns chunks -- it does not
 * fetch anything itself.
 *
 * IMPORTANT: this module has no opinion about which lessons are safe to
 * chunk. The caller (lib/ai/retrieve-course-context.ts) is the single
 * enforcement point for "only Published lessons," exactly mirroring how
 * lib/lessons.ts's getPublishedLessons()/getPublishedLessonBySlugOrNull()
 * are the only source of Lesson objects passed in here. Never call this
 * with a Review Ready or Draft lesson's markdown.
 *
 * Every lesson in this course follows the standard 7-section template
 * (## Learning Objective, ## Simple Explanation, ## Why It Matters,
 * ## Practical Example, ## Common Confusions, ## Quick Recap,
 * ## Try Asking the AI Tutor), so splitting on level-2 (`##`) headings
 * reliably produces one chunk per section for every lesson in the catalog.
 *
 * Not tagged `server-only`: this module is pure (no fs/db access, just
 * string/regex processing of markdown text passed in by the caller) and is
 * imported directly by scripts/rag-regression.ts (PR #133) for regression
 * testing, which cannot run inside Next's server-component bundling context.
 * Only lib/ai/retrieve-course-context.ts (itself server-only) imports this
 * in the app, so nothing client-facing is affected.
 */

export interface ChunkableLesson {
  slug: string
  title: string
  tags: string[] | null
  masterCategoryId: string | null
  masterSubcategory: string | null
  secondaryCategoryIds: string[] | null
}

export interface LessonChunk {
  lessonSlug: string
  lessonTitle: string
  lessonPath: string
  heading: string
  chunkText: string
  tags: string[]
  masterCategoryId: string | null
  masterSubcategory: string | null
  secondaryCategoryIds: string[]
}

const HEADING_RE = /^##\s+(.+)$/gm

/** Split a lesson's markdown body into one chunk per `##` heading, or a single fallback chunk if it has none. */
export function chunkLessonMarkdown(lesson: ChunkableLesson, markdown: string): LessonChunk[] {
  const base = {
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    lessonPath: `/learn/ibm-i-fundamentals/${lesson.slug}`,
    tags: lesson.tags ?? [],
    masterCategoryId: lesson.masterCategoryId,
    masterSubcategory: lesson.masterSubcategory,
    secondaryCategoryIds: lesson.secondaryCategoryIds ?? [],
  }

  // Strip a leading "# Title" line -- it's redundant with lessonTitle, which
  // every chunk already carries.
  const withoutTitle = markdown.replace(/^#\s+.+\r?\n+/, '')

  const matches = [...withoutTitle.matchAll(HEADING_RE)]

  if (matches.length === 0) {
    const text = withoutTitle.trim()
    return text ? [{ ...base, heading: lesson.title, chunkText: text }] : []
  }

  const chunks: LessonChunk[] = []
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
