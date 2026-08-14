/**
 * Unified published-content retrieval for the AI Tutor (RAG v2 MVP --
 * planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md Section D/F; generalized beyond
 * lessons by the AI Tutor Insights/Deep Dives Grounding work). Server-only.
 *
 * Originally lib/ai/retrieve-course-context.ts, lesson-only. This is the
 * single retrieval entry point for every AI Tutor origin (lesson, insight,
 * deep-dive, practice, learning-center, general) -- app/api/ai-tutor/route.ts
 * calls this the same way regardless of where the request came from, so the
 * embedded panel and the standalone /ai-tutor page always share one
 * retrieval implementation, never one per content type (Spec 001 v1.1
 * AI-TUTOR-FR-023, extended to the newer content types on the same
 * principle).
 *
 * Published-only guarantee: the only sources of content this module ever
 * reads are getPublishedLessons() (filters `status = 'Published'` at the
 * Supabase query level -- lib/lessons.ts), getPublishedInsights() (filters
 * `status === 'published'` -- lib/insights.ts), and
 * DEEP_DIVES.filter(isDeepDiveAvailable) (filters `status === 'published'`
 * -- lib/deep-dives.ts). Draft/Review-Ready lessons, draft Insights, and
 * planned/review-ready Deep Dives are never visible to this module, let
 * alone retrievable.
 */
import 'server-only'

import type { AiContentType } from '@/components/ai-tutor/types'
import { getPublishedLessons, loadLessonMarkdown } from '@/lib/lessons'
import { INSIGHTS } from '@/content/insights/catalog'
import { getPublishedInsights } from '@/lib/insights'
import { loadInsightMarkdown } from '@/lib/insight-content'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { isDeepDiveAvailable } from '@/lib/deep-dives'
import { loadDeepDiveMarkdown } from '@/lib/deep-dive-content'
import { chunkMarkdownContent, type ChunkableContent, type ContentChunk } from './content-chunks'
import { tokenize, scoreChunk, selectGuaranteedChunks } from './retrieval-score'

/** Chunks guaranteed from the current page's own content (if any), regardless of keyword score -- see retrievePublishedContent's module comment for why this is a separate, capped bucket rather than a scoring boost. */
const CURRENT_CONTENT_MAX_CHUNKS = 3
const CURRENT_CONTENT_MAX_CHARS = 3000

/** Overall result caps, across the current-content bucket plus general retrieval combined. */
const DEFAULT_MAX_CHUNKS = 6
const DEFAULT_MAX_TOTAL_CHARACTERS = 8000

/** Only this many metadata-prescored candidates (plus any guaranteed lessons) get their body read/chunked, to keep this cheap per request. */
const METADATA_SHORTLIST_SIZE = 24

/** A chunk needs at least this score to count as a "strong" match -- used to decide whether the model should be told coverage is weak, not just whether the array is empty. */
const STRONG_MATCH_SCORE = 5

export interface RetrievalOptions {
  /** The learner's latest message -- what to retrieve for. */
  query: string
  /** Set when opened from a specific lesson page (AiTutorContext sourceType: 'lesson'). */
  currentLessonSlug?: string
  /** Set when opened from a specific Insight page (AiTutorContext sourceType: 'insight'). */
  currentInsightSlug?: string
  /** Set when opened from a specific Deep Dive page (AiTutorContext sourceType: 'deep-dive'). */
  currentDeepDiveSlug?: string
  /** Set when opened from a practice question with known related lessons (AiTutorContext sourceType: 'practice'). */
  relatedLessonSlugs?: string[]
  maxChunks?: number
  maxTotalCharacters?: number
}

export interface RetrievedChunk {
  contentType: AiContentType
  title: string
  slug: string
  path: string
  heading: string
  chunkText: string
  score: number
  reasons: string[]
}

export interface RetrievalResult {
  chunks: RetrievedChunk[]
  /** True if at least one chunk scored high enough via keyword overlap to be a genuine, confident general-retrieval match -- not just present because it was guaranteed (current page) or barely scraped a nonzero score. */
  hasStrongMatch: boolean
  /**
   * True if at least one chunk in `chunks` is from the server-verified
   * current lesson/Insight/Deep Dive (the guaranteed current-page bucket --
   * see this function's own doc comment, part 1), regardless of its
   * keyword score. This is a real, confirmed grounding signal distinct
   * from keyword-match confidence: the server already knows which page the
   * learner is on, so "explain this in simpler terms" (zero keyword
   * overlap) is still genuinely grounded, not a weak/loose match. Callers
   * (buildSourceRefs, formatRetrievedContentForPrompt) must treat this the
   * same as hasStrongMatch for "is this confidently grounded," while still
   * being able to tell the two apart when they need to (e.g. to avoid
   * showing an unrelated low-score general chunk as a confident source
   * just because the current page also happened to ground the reply).
   */
  hasGuaranteedCurrentContent: boolean
  /** Set only when a current*Slug option was provided and actually resolved to a published content item -- lets the caller build an accurate "Using ... context: <title>" label without a second lookup. */
  resolvedCurrentContent: { contentType: AiContentType; slug: string; title: string } | null
}

/** A gatherable published content item, content-type-agnostic. Built fresh per request (no caching) -- see the module comment for the published-only guarantee each source function already provides. */
interface ContentSource {
  contentType: AiContentType
  slug: string
  title: string
  path: string
  /** Short prose used only for the cheap metadata pre-score pass, before any body is read. */
  description: string
  tags: string[]
  masterCategoryId: string | null
  masterSubcategory: string | null
  secondaryCategoryIds: string[]
  loadMarkdown: () => Promise<string>
}

function toChunkable(source: ContentSource): ChunkableContent {
  return {
    contentType: source.contentType,
    slug: source.slug,
    title: source.title,
    path: source.path,
    tags: source.tags,
    masterCategoryId: source.masterCategoryId,
    masterSubcategory: source.masterSubcategory,
    secondaryCategoryIds: source.secondaryCategoryIds,
  }
}

async function gatherContentSources(): Promise<ContentSource[]> {
  const lessons = await getPublishedLessons()
  const lessonSources: ContentSource[] = lessons.map((lesson) => ({
    contentType: 'lesson',
    slug: lesson.slug,
    title: lesson.title,
    path: `/learn/ibm-i-fundamentals/${lesson.slug}`,
    description: lesson.short_description,
    tags: lesson.tags ?? [],
    masterCategoryId: lesson.master_category_id ?? null,
    masterSubcategory: lesson.master_subcategory ?? null,
    secondaryCategoryIds: lesson.secondary_category_ids ?? [],
    loadMarkdown: () => loadLessonMarkdown(lesson),
  }))

  const insightSources: ContentSource[] = getPublishedInsights(INSIGHTS).map((insight) => ({
    contentType: 'insight',
    slug: insight.slug,
    title: insight.title,
    path: `/insights/${insight.slug}`,
    description: insight.description,
    tags: insight.tags,
    masterCategoryId: null,
    masterSubcategory: null,
    secondaryCategoryIds: [],
    loadMarkdown: () => loadInsightMarkdown(insight),
  }))

  const deepDiveSources: ContentSource[] = DEEP_DIVES.filter(isDeepDiveAvailable).map((deepDive) => ({
    contentType: 'deep-dive',
    slug: deepDive.slug,
    title: deepDive.title,
    path: `/deep-dives/${deepDive.slug}`,
    description: deepDive.description,
    tags: deepDive.tags,
    masterCategoryId: null,
    masterSubcategory: null,
    secondaryCategoryIds: [],
    loadMarkdown: () => loadDeepDiveMarkdown(deepDive),
  }))

  return [...lessonSources, ...insightSources, ...deepDiveSources]
}

function toRetrievedChunk(scored: { chunk: ContentChunk; score: number; reasons: string[] }): RetrievedChunk {
  const { chunk, score, reasons } = scored
  return {
    contentType: chunk.contentType,
    title: chunk.title,
    slug: chunk.slug,
    path: chunk.path,
    heading: chunk.heading,
    chunkText: chunk.chunkText,
    score,
    reasons,
  }
}

/**
 * Retrieve the top published-content chunks relevant to a query, optionally
 * grounded in a specific lesson, Insight, or Deep Dive (at most one of
 * currentLessonSlug/currentInsightSlug/currentDeepDiveSlug is ever set --
 * AiTutorContext is a discriminated union, so a caller only ever knows one
 * "current page" at a time), and/or a set of practice-question related
 * lessons.
 *
 * Two-part strategy, deliberately kept separate rather than folded into one
 * scoring pass:
 *   1. A small, capped "current content" bucket (if a current*Slug is
 *      given) that always draws from that item's own chunks, ranked among
 *      themselves by query relevance -- this guarantees a page-origin
 *      question like "explain this in simpler terms" (which has no keyword
 *      overlap with anything) still gets grounded in the right lesson,
 *      Insight, or Deep Dive, without a scoring boost so large it would
 *      also crowd out genuinely more relevant content elsewhere for an
 *      unrelated question asked from the same page.
 *   2. A general retrieval pass across the whole published catalog (every
 *      published lesson, Insight, and Deep Dive, minus whatever is already
 *      covered by part 1), scored with a mild same-category nudge (lessons
 *      only -- Insights/Deep Dives have no master-category taxonomy) and a
 *      stronger relatedLessonSlugs boost, filling whatever chunk/character
 *      budget the current-content bucket left.
 */
export async function retrievePublishedContent(options: RetrievalOptions): Promise<RetrievalResult> {
  const {
    query,
    currentLessonSlug,
    currentInsightSlug,
    currentDeepDiveSlug,
    relatedLessonSlugs,
    maxChunks = DEFAULT_MAX_CHUNKS,
    maxTotalCharacters = DEFAULT_MAX_TOTAL_CHARACTERS,
  } = options

  const queryTokens = Array.from(new Set(tokenize(query)))
  const queryLower = query.trim().toLowerCase()

  const sources = await gatherContentSources()

  const currentKey: { contentType: AiContentType; slug: string } | null = currentLessonSlug
    ? { contentType: 'lesson', slug: currentLessonSlug }
    : currentInsightSlug
      ? { contentType: 'insight', slug: currentInsightSlug }
      : currentDeepDiveSlug
        ? { contentType: 'deep-dive', slug: currentDeepDiveSlug }
        : null

  const currentSource = currentKey
    ? (sources.find((s) => s.contentType === currentKey.contentType && s.slug === currentKey.slug) ?? null)
    : null

  // --- Part 1: current content's own chunks (guaranteed, capped) ---
  const currentContentChunks: RetrievedChunk[] = []
  if (currentSource) {
    let markdown = ''
    try {
      markdown = await currentSource.loadMarkdown()
    } catch {
      // Content that can't be read just contributes no chunks here.
    }
    const chunks = chunkMarkdownContent(toChunkable(currentSource), markdown)
    const scoredOwnChunks = chunks.map((chunk) => scoreChunk(chunk, queryTokens, queryLower))
    const selected = selectGuaranteedChunks(scoredOwnChunks, {
      maxChunks: CURRENT_CONTENT_MAX_CHUNKS,
      maxChars: CURRENT_CONTENT_MAX_CHARS,
    })
    for (const scored of selected) {
      currentContentChunks.push(toRetrievedChunk({ ...scored, reasons: [...scored.reasons, 'current page'] }))
    }
  }

  // --- Part 2: general retrieval across the rest of the catalog ---
  const currentMasterCategoryId = currentSource?.masterCategoryId ?? null
  const candidates = currentSource
    ? sources.filter((s) => !(s.contentType === currentSource.contentType && s.slug === currentSource.slug))
    : sources

  const metadataScored = candidates.map((source) => {
    const titleTokens = new Set(tokenize(source.title))
    const tagTokens = new Set(source.tags.flatMap(tokenize))
    const descTokens = new Set(tokenize(source.description))
    let score = 0
    for (const token of queryTokens) {
      if (titleTokens.has(token)) score += 5
      if (tagTokens.has(token)) score += 4
      if (descTokens.has(token)) score += 2
    }
    return { source, score }
  })

  const guaranteedSlugs = new Set(relatedLessonSlugs ?? [])
  const isGuaranteed = (source: ContentSource) => source.contentType === 'lesson' && guaranteedSlugs.has(source.slug)
  const shortlist = [
    ...metadataScored.filter((e) => isGuaranteed(e.source)),
    ...metadataScored
      .filter((e) => !isGuaranteed(e.source) && e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, METADATA_SHORTLIST_SIZE),
  ]

  const generalScoredChunks: { chunk: ContentChunk; score: number; reasons: string[] }[] = []
  await Promise.all(
    shortlist.map(async ({ source }) => {
      let markdown: string
      try {
        markdown = await source.loadMarkdown()
      } catch {
        return
      }
      const chunks = chunkMarkdownContent(toChunkable(source), markdown)
      for (const chunk of chunks) {
        generalScoredChunks.push(
          scoreChunk(chunk, queryTokens, queryLower, {
            relatedLessonSlugs,
            currentMasterCategoryId,
          })
        )
      }
    })
  )

  generalScoredChunks.sort((a, b) => b.score - a.score)

  const remainingSlots = Math.max(0, maxChunks - currentContentChunks.length)
  const currentContentChars = currentContentChunks.reduce((sum, c) => sum + c.chunkText.length, 0)
  let remainingChars = Math.max(0, maxTotalCharacters - currentContentChars)

  const generalChunks: RetrievedChunk[] = []
  for (const scored of generalScoredChunks) {
    if (generalChunks.length >= remainingSlots) break
    if (scored.score <= 0) continue
    if (scored.chunk.chunkText.length > remainingChars && generalChunks.length > 0) continue
    generalChunks.push(toRetrievedChunk(scored))
    remainingChars -= scored.chunk.chunkText.length
  }

  const hasStrongMatch = generalChunks.some((c) => c.score >= STRONG_MATCH_SCORE) || currentContentChunks.some((c) => c.score >= STRONG_MATCH_SCORE)

  return {
    chunks: [...currentContentChunks, ...generalChunks],
    hasStrongMatch,
    hasGuaranteedCurrentContent: currentContentChunks.length > 0,
    resolvedCurrentContent: currentSource
      ? { contentType: currentSource.contentType, slug: currentSource.slug, title: currentSource.title }
      : null,
  }
}

/**
 * Re-exported from lib/ai/format-retrieved-content.ts, which holds the
 * actual implementation -- kept as a separate, non-server-only module so it
 * (and the regression checks that exercise it) don't need this file's
 * Supabase/fs dependencies. See that file's header comment for why.
 */
export { formatRetrievedContentForPrompt } from './format-retrieved-content'
