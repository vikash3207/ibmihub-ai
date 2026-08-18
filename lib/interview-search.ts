/**
 * Interview Prep's own page-local search (IBM i Practice Hub -- Interview
 * Prep phase 1). Deliberately NOT merged into lib/search.ts's global,
 * cross-content `SearchResultType` union / `/search` page / `app/
 * sitemap.ts` -- Interview Prep content stays out of site-wide search for
 * now (matches this codebase's existing regression assertion that those
 * files have zero interview references), and surfacing not-yet-reviewed
 * question content site-wide would be premature anyway. The genuinely
 * content-agnostic utilities (`normalizeQuery`, `highlightMatch`) are
 * reused directly from lib/search.ts rather than re-implemented, since
 * they don't depend on that module's `SearchableItem`/`SearchResultType`
 * shape at all -- only the scoring/matching logic below is a deliberate,
 * intentional duplicate, scoped to `InterviewQuestion` alone, mirroring
 * lib/search.ts's own deterministic-tier convention.
 */

import type { InterviewQuestion } from '@/content/practice/interview-questions'
import { normalizeQuery, highlightMatch, type HighlightSegment } from './search'

export { normalizeQuery, highlightMatch, type HighlightSegment }

/** Same tier convention as lib/search.ts: lower is better, deterministic, explainable. */
export type InterviewSearchRankTier = 1 | 2 | 3

/**
 * Plain `.includes()`/`.startsWith()` string matching only -- never a regex
 * built from the query itself, so special characters in a query are always
 * literal text, never regex syntax.
 */
export function scoreInterviewQuestion(question: InterviewQuestion, normalizedQuery: string): InterviewSearchRankTier | null {
  if (!normalizedQuery) return null

  const prompt = question.prompt.toLowerCase()
  if (prompt.startsWith(normalizedQuery)) return 1
  if (prompt.includes(normalizedQuery)) return 2

  const tagMatch = question.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  if (tagMatch) return 3

  return null
}

/**
 * Empty or whitespace-only queries return no results (the caller renders
 * the empty-query guidance state instead). Ties within a tier break by
 * `originalNumber` -- deterministic, never dependent on input array order.
 */
export function searchInterviewQuestions(questions: InterviewQuestion[], rawQuery: string): InterviewQuestion[] {
  const normalized = normalizeQuery(rawQuery)
  if (!normalized) return questions

  return questions
    .map((question) => ({ question, tier: scoreInterviewQuestion(question, normalized) }))
    .filter((entry): entry is { question: InterviewQuestion; tier: InterviewSearchRankTier } => entry.tier !== null)
    .sort((a, b) => a.tier - b.tier || a.question.originalNumber - b.question.originalNumber)
    .map((entry) => entry.question)
}
