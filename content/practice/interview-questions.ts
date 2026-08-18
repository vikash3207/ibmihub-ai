/**
 * Interview Prep question model (IBM i Practice Hub -- minimal UI
 * foundation only, not a working feature).
 *
 * Deliberately empty: the 60-question bank originally scoped for this mode
 * was withdrawn mid-implementation so the content can be authored and
 * technically reviewed separately, outside this PR.
 *
 * IMPORTANT -- this catalog is NOT wired into the Practice Hub landing page
 * today. app/(authenticated)/practice/page.tsx's Interview Prep card is
 * unconditionally rendered as ComingSoonCard -- it does not read
 * INTERVIEW_QUESTIONS, and does not call isInterviewPrepAvailable() below.
 * Adding a published record to this file will NOT make Interview Prep
 * appear or work; there is no session route to link to yet either. Wiring
 * availability up to the landing page, and building the actual session/
 * scoring UI, are deliberately deferred to a separate follow-up PR once the
 * question content and the full session UX have been reviewed and
 * approved -- do not assume this file "just activates" on its own.
 *
 * isInterviewPrepAvailable() exists only as a minimal, self-contained
 * building block for that future follow-up (so a future PR doesn't need to
 * reinvent "what counts as available") -- it is intentionally the only
 * helper kept here; selection/scoring/summary logic for Interview Prep
 * sessions was written and then removed from lib/practice-session.ts in
 * this same PR once it became clear nothing in the current UI calls it.
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

/**
 * Only `published` entries count. Not called anywhere in this PR -- see
 * the file header. Kept as a minimal, ready-to-use building block for the
 * separate follow-up PR that will actually wire Interview Prep up.
 */
export function isInterviewPrepAvailable(questions: InterviewQuestion[]): boolean {
  return questions.some((q) => q.status === 'published')
}
