/**
 * Deterministic, explainable keyword scoring for AI Tutor retrieval (RAG v2
 * MVP -- planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md Section D).
 * No vector embeddings, no external calls -- pure token-overlap arithmetic,
 * so a given query always scores the same way against the same chunk.
 *
 * Not tagged `server-only`: this module is pure (no fs/db access, just
 * arithmetic over strings passed in by the caller) and is imported directly
 * by scripts/rag-regression.ts (PR #133) for regression testing, which
 * cannot run inside Next's server-component bundling context. Only
 * lib/ai/retrieve-published-content.ts (itself server-only) imports this in
 * the app, so nothing client-facing is affected.
 *
 * Generalized beyond lessons (AI Tutor Insights/Deep Dives Grounding) to
 * score any ContentChunk (lib/ai/content-chunks.ts) -- masterCategoryId/
 * masterSubcategory/secondaryCategoryIds are always null/empty for Insight
 * and Deep Dive chunks, so those weight terms simply never fire for them;
 * no per-content-type branch needed.
 */

import type { ContentChunk } from './content-chunks'

export const MIN_TOKEN_LENGTH = 3

/**
 * Common English question/instruction words, excluded from scoring so a
 * natural-language question ("Where should I learn about X?") doesn't let
 * an incidental match on "where" or "should" outrank a lesson that
 * genuinely matches the actual topic word.
 */
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'do', 'does',
  'for', 'from', 'has', 'have', 'how', 'if', 'in', 'is', 'it', 'its', 'me',
  'my', 'of', 'on', 'or', 'please', 'tell', 'that', 'the', 'this', 'to',
  'was', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'will',
  'with', 'would', 'should', 'could', 'about', 'explain', 'learn', 'you',
  'your', 'i',
])

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (t) => t.length >= MIN_TOKEN_LENGTH && !STOPWORDS.has(t)
  )
}

const WEIGHTS = {
  exactPhrase: 8,
  title: 5,
  heading: 4,
  tag: 4,
  slugWord: 3,
  masterCategory: 3,
  masterSubcategory: 2,
  secondaryCategory: 1,
  body: 1,
  relatedLesson: 6,
  sameCategoryAsCurrent: 2,
}

/** A query is only checked for an exact-phrase match once it's long enough that a substring hit is meaningful. */
const MIN_PHRASE_LENGTH_FOR_EXACT_MATCH = 6

export interface ScoringBoosts {
  /** Practice-question relatedLessonSlugs, or any other externally-known "these lessons are relevant" hint. */
  relatedLessonSlugs?: string[]
  /** The current lesson's own masterCategoryId, for a same-category tie-breaking nudge on chunks from other lessons. */
  currentMasterCategoryId?: string | null
}

export interface ScoredChunk {
  chunk: ContentChunk
  score: number
  /** Short, deduplicated labels explaining what matched -- for prompt-adjacent debugging, not shown to end users in this PR. */
  reasons: string[]
}

/** Score a single chunk against a tokenized query. Deterministic: same inputs always produce the same score. */
export function scoreChunk(
  chunk: ContentChunk,
  queryTokens: string[],
  queryLower: string,
  boosts: ScoringBoosts = {}
): ScoredChunk {
  const reasons = new Set<string>()
  let score = 0

  if (
    queryLower.length >= MIN_PHRASE_LENGTH_FOR_EXACT_MATCH &&
    (chunk.chunkText.toLowerCase().includes(queryLower) || chunk.heading.toLowerCase().includes(queryLower))
  ) {
    score += WEIGHTS.exactPhrase
    reasons.add('exact phrase match')
  }

  const titleTokens = new Set(tokenize(chunk.title))
  const slugTokens = new Set(chunk.slug.split('-'))
  const headingTokens = new Set(tokenize(chunk.heading))
  const tagTokens = new Set(chunk.tags.flatMap(tokenize))
  const bodyTokens = new Set(tokenize(chunk.chunkText))
  const categoryTokens = new Set(chunk.masterCategoryId ? chunk.masterCategoryId.split('-') : [])
  const subcategoryTokens = new Set(chunk.masterSubcategory ? tokenize(chunk.masterSubcategory) : [])
  const secondaryCategoryTokens = new Set(chunk.secondaryCategoryIds.flatMap((id) => id.split('-')))

  for (const token of queryTokens) {
    if (titleTokens.has(token)) {
      score += WEIGHTS.title
      reasons.add('title match')
    }
    if (headingTokens.has(token)) {
      score += WEIGHTS.heading
      reasons.add('heading match')
    }
    if (tagTokens.has(token)) {
      score += WEIGHTS.tag
      reasons.add('tag match')
    }
    if (slugTokens.has(token)) {
      score += WEIGHTS.slugWord
      reasons.add('slug match')
    }
    if (categoryTokens.has(token)) {
      score += WEIGHTS.masterCategory
      reasons.add('category match')
    }
    if (subcategoryTokens.has(token)) {
      score += WEIGHTS.masterSubcategory
      reasons.add('subcategory match')
    }
    if (secondaryCategoryTokens.has(token)) {
      score += WEIGHTS.secondaryCategory
      reasons.add('secondary category match')
    }
    if (bodyTokens.has(token)) {
      score += WEIGHTS.body
      reasons.add('body match')
    }
  }

  // Practice questions only ever relate to lessons, so this boost is scoped
  // to lesson chunks -- an Insight or Deep Dive slug coinciding with a
  // relatedLessonSlugs entry (never expected in practice, but not
  // impossible across independently-maintained catalogs) must not get
  // credit for a relation that was never actually asserted.
  if (chunk.contentType === 'lesson' && boosts.relatedLessonSlugs?.includes(chunk.slug)) {
    score += WEIGHTS.relatedLesson
    reasons.add('related lesson')
  }

  if (
    boosts.currentMasterCategoryId &&
    chunk.masterCategoryId &&
    boosts.currentMasterCategoryId === chunk.masterCategoryId
  ) {
    score += WEIGHTS.sameCategoryAsCurrent
    reasons.add('same category as current lesson')
  }

  return { chunk, score, reasons: Array.from(reasons) }
}

export interface GuaranteedSelectionOptions {
  maxChunks: number
  maxChars: number
}

/**
 * Selects the "guaranteed current page" bucket from an already-scored chunk
 * list: up to maxChunks chunks, capped by a total character budget. Used by
 * lib/ai/retrieve-published-content.ts for whichever lesson/Insight/Deep
 * Dive the learner currently has open -- extracted as its own pure function
 * (rather than left inline) specifically so scripts/rag-regression.ts can
 * exercise the exact guarantee mechanism directly against real content,
 * without needing retrievePublishedContent()'s `server-only` Supabase/fs
 * dependencies or a live Next request context.
 *
 * If every chunk scored 0 (the query had no keyword overlap with this
 * content at all -- e.g. "explain this in simpler terms" asked from a page
 * whose sections don't happen to contain any of those words), the original
 * chunk order is kept rather than an arbitrary/unstable sort. This is what
 * makes the guarantee a guarantee: a zero-relevance query from a content
 * page still returns that page's own opening chunks, never an empty bucket.
 */
export function selectGuaranteedChunks(scored: ScoredChunk[], options: GuaranteedSelectionOptions): ScoredChunk[] {
  const { maxChunks, maxChars } = options
  const anyPositive = scored.some((s) => s.score > 0)
  const ordered = anyPositive ? [...scored].sort((a, b) => b.score - a.score) : scored

  const selected: ScoredChunk[] = []
  let usedChars = 0
  for (const s of ordered) {
    if (selected.length >= maxChunks) break
    if (usedChars + s.chunk.chunkText.length > maxChars && selected.length > 0) continue
    selected.push(s)
    usedChars += s.chunk.chunkText.length
  }
  return selected
}
