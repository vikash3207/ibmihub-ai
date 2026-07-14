/**
 * Lightweight, deterministic keyword-based retrieval over Published lessons
 * for AI Tutor grounding (MVP -- no vector embeddings). Server-only.
 *
 * Scoring is a simple weighted token-overlap count: title and tag matches
 * score highest, description matches score medium, and lesson body matches
 * score lowest. Body text is only read for a metadata-prefiltered shortlist
 * (not all 208 lessons) to keep this cheap per request.
 */
import 'server-only'

import { getPublishedLessons, loadLessonMarkdown, type Lesson } from '@/lib/lessons'

const TITLE_WEIGHT = 5
const TAG_WEIGHT = 4
const DESCRIPTION_WEIGHT = 2
const BODY_WEIGHT = 1

/** Only this many top metadata-scored candidates get their body read and scored. */
const BODY_SCORING_SHORTLIST_SIZE = 20
/** Skip very short tokens that would match too broadly to be useful. */
const MIN_TOKEN_LENGTH = 3
/** Characters of context kept around the first matching token, for the excerpt shown to the model. */
const EXCERPT_RADIUS_CHARS = 150

/**
 * Common English question/instruction words, excluded from scoring so a
 * natural-language question ("Where should I learn about X?") doesn't let
 * an incidental title match on "where" or "should" outrank a lesson that
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

export interface RetrievedLesson {
  slug: string
  title: string
  shortDescription: string
  excerpt: string | null
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (t) => t.length >= MIN_TOKEN_LENGTH && !STOPWORDS.has(t)
  )
}

function scoreMetadata(lesson: Lesson, queryTokens: string[]): number {
  const titleTokens = new Set(tokenize(lesson.title))
  const descTokens = new Set(tokenize(lesson.short_description))
  const tagTokens = new Set((lesson.tags ?? []).flatMap(tokenize))

  let score = 0
  for (const token of queryTokens) {
    if (titleTokens.has(token)) score += TITLE_WEIGHT
    if (tagTokens.has(token)) score += TAG_WEIGHT
    if (descTokens.has(token)) score += DESCRIPTION_WEIGHT
  }
  return score
}

function findExcerpt(body: string, queryTokens: string[]): string | null {
  const lower = body.toLowerCase()
  for (const token of queryTokens) {
    const idx = lower.indexOf(token)
    if (idx !== -1) {
      const start = Math.max(0, idx - EXCERPT_RADIUS_CHARS)
      const end = Math.min(body.length, idx + EXCERPT_RADIUS_CHARS)
      const prefix = start > 0 ? '...' : ''
      const suffix = end < body.length ? '...' : ''
      return (prefix + body.slice(start, end).trim() + suffix).replace(/\s+/g, ' ')
    }
  }
  return null
}

/**
 * Return up to maxResults Published lessons most relevant to the query text,
 * ranked by weighted keyword overlap. Returns an empty array if the query
 * has no usable tokens or nothing scores above zero -- callers should treat
 * that as "the course may not cover this yet," not an error.
 */
export async function retrieveRelevantLessons(
  query: string,
  options: { maxResults?: number; excludeSlug?: string } = {}
): Promise<RetrievedLesson[]> {
  const maxResults = options.maxResults ?? 5
  const queryTokens = Array.from(new Set(tokenize(query)))
  if (queryTokens.length === 0) {
    return []
  }

  const lessons = await getPublishedLessons()
  const candidates = options.excludeSlug ? lessons.filter((l) => l.slug !== options.excludeSlug) : lessons

  const metadataScored = candidates
    .map((lesson) => ({ lesson, score: scoreMetadata(lesson, queryTokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const shortlist = metadataScored.slice(0, BODY_SCORING_SHORTLIST_SIZE)

  const withBodyScores = await Promise.all(
    shortlist.map(async ({ lesson, score }) => {
      let bodyScore = 0
      let excerpt: string | null = null
      try {
        const body = await loadLessonMarkdown(lesson)
        const bodyTokens = new Set(tokenize(body))
        for (const token of queryTokens) {
          if (bodyTokens.has(token)) bodyScore += BODY_WEIGHT
        }
        excerpt = findExcerpt(body, queryTokens)
      } catch {
        // A lesson whose body can't be read just contributes no body score.
      }
      return { lesson, score: score + bodyScore, excerpt }
    })
  )

  return withBodyScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ lesson, excerpt }) => ({
      slug: lesson.slug,
      title: lesson.title,
      shortDescription: lesson.short_description,
      excerpt,
    }))
}

/** Format retrieved lessons as a prompt section. Honest about an empty result. */
export function formatRetrievedLessonsForPrompt(results: RetrievedLesson[]): string {
  if (results.length === 0) {
    return 'No closely related lessons were found in the IBMiHub AI course catalog for this question. This may be a topic the course does not cover deeply yet.'
  }

  return (
    'These IBMiHub AI course lessons may be relevant to the question:\n\n' +
    results
      .map((r, i) => {
        const excerptLine = r.excerpt ? `\n   Excerpt: ${r.excerpt}` : ''
        return `${i + 1}. "${r.title}" (slug: ${r.slug})\n   ${r.shortDescription}${excerptLine}`
      })
      .join('\n\n')
  )
}
