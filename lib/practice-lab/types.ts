/**
 * Practice Lab shared types (Spec 010, PR #135).
 *
 * The Practice Lab is a guided learning simulator ("5250-style" command
 * practice and an "ACS-style" SQL console) -- not a real IBM i emulator,
 * not a TN5250 client, not an ACS clone, and it never connects to a real
 * IBM i system. See specs/010-practice-lab/spec.md for the full spec and
 * planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md (PR #134) for
 * the design rationale.
 *
 * This file only defines the exercise metadata shape used by this PR's
 * placeholder/skeleton pages -- it intentionally has no simulator engine,
 * command handlers, or SQL validation logic. Those are later PRs (#136/#137).
 */

export type PracticeLabType = '5250' | 'sql'

/** 'planned' exercises are listed but not yet interactive; 'available' exercises are ready to run. Every exercise in this PR is 'planned'. */
export type PracticeLabExerciseStatus = 'planned' | 'available'

export type PracticeLabDifficulty = 'beginner' | 'intermediate'

export interface PracticeLabExercise {
  id: string
  slug: string
  title: string
  labType: PracticeLabType
  difficulty: PracticeLabDifficulty
  summary: string
  learningObjectives: string[]
  /** Real content/lessons/metadata.ts slugs only -- resolved to titles/links the same way content/practice/questions.ts's relatedLessonSlugs already are. */
  relatedLessonSlugs: string[]
  status: PracticeLabExerciseStatus
}
