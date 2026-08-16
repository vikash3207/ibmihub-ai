/**
 * Interview Prep question model (IBM i Practice Hub -- UI foundation only).
 *
 * Deliberately empty: the 60-question bank originally scoped for this mode
 * was withdrawn mid-implementation so the content can be authored and
 * technically reviewed separately, outside this PR. This file exists only
 * to give the Practice Hub landing page a real, typed thing to check
 * availability against -- see isInterviewPrepAvailable() below -- rather
 * than a hardcoded `true`/`false` flag. The moment a future PR adds real,
 * `status: 'published'` entries to INTERVIEW_QUESTIONS, the landing page's
 * Interview Prep card becomes available automatically, with no other code
 * change required.
 *
 * Mirrors the existing content/practice/questions.ts pattern (a plain,
 * committed TypeScript array, no database table) and reuses its
 * PracticeDifficulty type so both question models share one difficulty
 * vocabulary. topicId reuses the same PRACTICE_TOPICS ids that module
 * defines -- no separate taxonomy.
 */

import type { PracticeDifficulty } from './questions'

export interface InterviewQuestion {
  id: string
  topicId: string
  difficulty: PracticeDifficulty
  /** Draft entries are never shown or counted as available -- only 'published' entries can ever make Interview Prep available. */
  status: 'draft' | 'published'
  prompt: string
  modelAnswer: string
  essentialPoints: string[]
  commonMistakes: string[]
  followUpQuestions?: string[]
  relatedLessonSlugs: string[]
  tags: string[]
}

/**
 * Intentionally empty -- see file header. Do not add entries here without
 * a separately reviewed, technically-validated content pass; this is a
 * production catalog, not a place for placeholder/test data (test fixtures
 * belong in scripts/practice-hub-regression.ts only).
 */
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = []

/** Only `published` entries count -- Interview Prep is available if and only if at least one real, reviewed question exists. */
export function isInterviewPrepAvailable(questions: InterviewQuestion[]): boolean {
  return questions.some((q) => q.status === 'published')
}
