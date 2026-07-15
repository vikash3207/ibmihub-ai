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
 * PR #135 defined the base exercise metadata shape (used by both the 5250
 * and SQL placeholder lists). PR #136 added the 5250 simulator fields below
 * -- command validation/dispatch logic itself lives in
 * lib/practice-lab/5250-simulator.ts, not here. PR #138 adds
 * `blockedActionCommands` for the troubleshooting exercises' safety
 * messaging. The SQL console's own validation engine/fields are still a
 * later PR's scope.
 */

export type PracticeLabType = '5250' | 'sql'

/** 'planned' exercises are listed but not yet interactive; 'available' exercises are ready to run. */
export type PracticeLabExerciseStatus = 'planned' | 'available'

export type PracticeLabDifficulty = 'beginner' | 'intermediate'

/** A single simulated terminal/output screen: a short title plus plain-text lines rendered in a monospace terminal area. Never real system output -- always fabricated training data (Spec 010 Safety Rules). */
export interface PracticeLabTerminalScreen {
  title: string
  lines: string[]
}

/**
 * Declarative description of the one command (and its accepted variants)
 * an exercise expects, used by lib/practice-lab/5250-simulator.ts's
 * evaluateCommand() to deterministically classify a learner's typed input
 * as success, empty input, an unsupported command, a missing/wrong
 * parameter, or a near miss -- no execution, just normalized string
 * matching. Kept as plain data (not a validation function) so exercise
 * content stays declarative, consistent with content/practice/questions.ts.
 */
export interface PracticeLabCommandCheck {
  /** e.g. 'WRKOBJ' -- the command name learners are expected to type. */
  commandName: string
  /** Normalized, exact accepted full-command forms (case/whitespace are normalized before comparison -- see normalizeCommand()). */
  acceptedCommands: string[]
  /** Parameter name whose absence should get its own friendly message, e.g. 'OBJ'. Omit for a bare command with no required parameter. */
  requiredParamName?: string
  /** Object/library-style values accepted inside `requiredParamName(...)`, used only for a friendly "no such object in this lab" message -- not a security boundary. */
  acceptedParamValues?: string[]
  /** Real-world job-control/action command names (e.g. 'ENDJOB', 'RLSJOB') that should get a distinct, safety-focused "this simulator only supports investigation commands" message instead of the generic unsupported-command fallback -- used by the troubleshooting exercises (PR #138) where a learner might plausibly try to "fix" what they just investigated. */
  blockedActionCommands?: string[]
}

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

  // --- 5250 simulator fields (PR #136) -- optional so sql-exercises.ts's
  // still-`planned` entries (PR #137 scope) don't need placeholder values
  // for fields they don't use yet. Always present together once an
  // exercise's status is 'available'.
  /** Longer task instructions shown in the exercise workspace (the list page's `summary` stays short). */
  instructions?: string
  initialScreen?: PracticeLabTerminalScreen
  commandCheck?: PracticeLabCommandCheck
  /** Progressively revealed, one at a time, via the workspace's Hint button. */
  hints?: string[]
  /** Shown once the learner enters an accepted command. */
  successMessage?: string
  successScreen?: PracticeLabTerminalScreen
}
