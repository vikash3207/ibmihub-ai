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
 * lib/ai/retrieve-course-context.ts (itself server-only) imports this in
 * the app, so nothing client-facing is affected.
 */

import type { LessonChunk } from './lesson-chunks'

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
  chunk: LessonChunk
  score: number
  /** Short, deduplicated labels explaining what matched -- for prompt-adjacent debugging, not shown to end users in this PR. */
  reasons: string[]
}

/** Score a single chunk against a tokenized query. Deterministic: same inputs always produce the same score. */
export function scoreChunk(
  chunk: LessonChunk,
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

  const titleTokens = new Set(tokenize(chunk.lessonTitle))
  const slugTokens = new Set(chunk.lessonSlug.split('-'))
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

  if (boosts.relatedLessonSlugs?.includes(chunk.lessonSlug)) {
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
