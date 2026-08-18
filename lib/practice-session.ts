/**
 * Practice Hub session logic (Guided Practice and Quick Quizzes -- Interview
 * Prep's selection/scoring logic is deliberately NOT included here yet; it
 * remains a "Coming soon" landing-page card with no route or session in
 * this PR, and adding selection/scoring helpers for content that doesn't
 * exist would be premature). Pure, framework-free module, no fetching, no
 * `server-only` import, same "pure logic outside any server-only/client
 * boundary" convention lib/search.ts and lib/deep-dive-render.ts already
 * establish for this codebase, so it's directly exercised by
 * scripts/practice-hub-regression.ts against both the real production
 * catalog and synthetic fixtures.
 *
 * There is no persistence layer for Practice today (confirmed by audit: no
 * Supabase table, PracticeBrowser's state was always local `useState`), so
 * a session's *composition* (which questions, in what order) is entirely a
 * pure function of its URL query params -- deterministic via a seeded
 * shuffle, never randomized in a way that would make a refresh or Back/
 * Forward replace the question set. Two ways a caller arrives at a seed:
 *  - The normal flow: components/practice/session-builder-form.tsx attaches
 *    a fresh, explicit `seed` (Date.now(), set client-side right before the
 *    native form submission proceeds) every time the builder is submitted --
 *    so landing on the builder fresh (from the hub, "Adjust quiz settings",
 *    or "Start another quiz") and submitting again always produces a new
 *    seed, and therefore normally a different selection/order. Once that
 *    seed is baked into the resulting session URL, reloading, sharing, or
 *    navigating Back/Forward to that exact URL reproduces the identical
 *    question set -- the seed, not any client state, is what's stable.
 *  - The fallback: a URL that arrives with no `seed` at all (an old
 *    pre-this-behavior bookmark, a manually-edited/malformed URL, or a
 *    no-JS form submission, where the hidden seed field never gets filled
 *    in) -- deriveDefaultSeed() turns the rest of the params into one
 *    deterministically, so the page still renders a valid, stable session
 *    rather than erroring, just without the "always fresh on submit"
 *    property the normal flow provides.
 */

import type { PracticeQuestion, PracticeDifficulty } from '@/content/practice/questions'
import { PRACTICE_TOPIC_GROUPS, resolveTopicGroup, topicIdsForGroup } from './practice-topic-groups'

export type PracticeMode = 'guided' | 'quiz' | 'interview'
export type SessionLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed'
export type SessionLength = 1 | 5 | 10

// ---------------------------------------------------------------------------
// Deterministic seeding
// ---------------------------------------------------------------------------

/** mulberry32 -- a small, fast, deterministic PRNG. Not cryptographic; this is session variety, not a security boundary. */
function mulberry32(seed: number): () => number {
  let a = seed | 0
  return function next() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates using a seeded PRNG -- same seed always produces the same order for the same input array. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const rng = mulberry32(seed)
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

/** Turns a bare combination of builder choices into one deterministic 32-bit seed (a simple string hash), so a URL with no explicit `seed` param is still fully stable. */
export function deriveDefaultSeed(parts: string[]): number {
  const str = parts.join('|')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

// ---------------------------------------------------------------------------
// Validation / normalization of raw (query-string) params
// ---------------------------------------------------------------------------

export function isValidMode(value: string | null | undefined): value is PracticeMode {
  return value === 'guided' || value === 'quiz' || value === 'interview'
}

/**
 * 'advanced' is only ever valid for 'interview' -- content/practice/
 * questions.ts's 169 records top out at 'intermediate' today (confirmed by
 * audit), so offering Advanced for Guided Practice/Quick Quiz would always
 * hit the zero-inventory case. Interview Prep itself has no published
 * content yet either (content/practice/interview-questions.ts's catalog is
 * intentionally empty -- see that file's header) -- 'advanced' is reserved
 * for interview mode so a future, separately reviewed content pass doesn't
 * need a validation change to use it, not because a full-range bank already
 * exists today.
 */
export function isValidLevel(value: string | null | undefined, mode: PracticeMode): value is SessionLevel {
  if (value === 'mixed' || value === 'beginner' || value === 'intermediate') return true
  if (value === 'advanced') return mode === 'interview'
  return false
}

const ALLOWED_LENGTHS: Record<PracticeMode, SessionLength[]> = {
  guided: [1, 5, 10],
  quiz: [5, 10],
  interview: [5, 10],
}

export function isValidLength(value: number, mode: PracticeMode): value is SessionLength {
  return ALLOWED_LENGTHS[mode].includes(value as SessionLength)
}

export interface RawSessionParams {
  mode?: string | null
  topicGroup?: string | null
  level?: string | null
  length?: string | null
  seed?: string | null
}

export interface NormalizedSessionParams {
  mode: PracticeMode
  topicGroupId: string | null
  level: SessionLevel
  length: SessionLength
  seed: number
}

const DEFAULT_LEVEL: SessionLevel = 'mixed'
const DEFAULT_LENGTH: Record<PracticeMode, SessionLength> = { guided: 5, quiz: 5, interview: 5 }

/**
 * Turns raw (possibly missing/invalid/malformed) query-string values into a
 * fully valid session configuration -- every field either passes validation
 * or falls back to a safe default; this function only ever returns `null`
 * when `mode` itself is missing/unrecognized, since there's no sane default
 * mode to fall back to (the caller should redirect to /practice in that
 * case, never render a broken builder/session page).
 */
export function normalizeSessionParams(raw: RawSessionParams): NormalizedSessionParams | null {
  if (!isValidMode(raw.mode)) return null
  const mode = raw.mode

  const topicGroupId = raw.topicGroup && resolveTopicGroup(raw.topicGroup) ? raw.topicGroup : null

  const level: SessionLevel = isValidLevel(raw.level, mode) ? raw.level : DEFAULT_LEVEL

  const requestedLength = Number(raw.length)
  const length: SessionLength = isValidLength(requestedLength, mode) ? requestedLength : DEFAULT_LENGTH[mode]

  // Canonicalize to a safe (non-negative, integer, bounded) seed so a
  // malformed/fractional/huge query-string value can never produce a
  // surprising or unstable seed -- Number.MAX_SAFE_INTEGER keeps it well
  // within what mulberry32's internal `| 0` bitwise coercion treats
  // consistently across runs.
  const parsedSeed = raw.seed ? Number(raw.seed) : NaN
  const seed = Number.isFinite(parsedSeed)
    ? Math.min(Math.abs(Math.trunc(parsedSeed)), Number.MAX_SAFE_INTEGER)
    : deriveDefaultSeed([mode, topicGroupId ?? 'all', level, String(length)])

  return { mode, topicGroupId, level, length, seed }
}

// ---------------------------------------------------------------------------
// Question selection
// ---------------------------------------------------------------------------

/** The subset of fields every selectable question type (PracticeQuestion, InterviewQuestion) shares. */
export interface SelectableQuestion {
  id: string
  topicId: string
  difficulty: PracticeDifficulty
}

export type SessionBuildResult<T> = { status: 'ok'; questions: T[] } | { status: 'insufficient'; available: number; requested: number }

function matchesLevel(difficulty: PracticeDifficulty, level: SessionLevel): boolean {
  return level === 'mixed' || difficulty === level
}

/**
 * The eligible, de-duplicated pool for a topic-group + level (+ optional
 * mode-specific eligibility predicate) combination -- the shared core both
 * selectSessionQuestions() and countEligibleQuestions() build on, so the
 * exact same filtering logic backs both "give me N questions" and "how many
 * are there", and the two can never quietly drift apart.
 */
function getEligiblePool<T extends SelectableQuestion>(
  { topicGroupId, level }: Pick<NormalizedSessionParams, 'topicGroupId' | 'level'>,
  allQuestions: T[],
  isEligible?: (question: T) => boolean
): T[] {
  const topicIds = topicIdsForGroup(topicGroupId)

  let pool = allQuestions.filter((q) => (topicIds ? topicIds.includes(q.topicId) : true) && matchesLevel(q.difficulty, level))
  if (isEligible) pool = pool.filter(isEligible)

  const seenIds = new Set<string>()
  pool = pool.filter((q) => {
    if (seenIds.has(q.id)) return false
    seenIds.add(q.id)
    return true
  })

  return pool
}

/**
 * Core selection algorithm shared by Guided Practice and Quick Quiz --
 * takes exactly `length` questions from the eligible pool via a seeded
 * shuffle. Never silently returns fewer questions while claiming a full-
 * length session -- an insufficient pool is reported explicitly (this is
 * the server-side fallback that still applies for a manually edited,
 * malformed, or JS-disabled URL even though the builder's own client-side
 * availability matrix should normally prevent ever submitting one) so the
 * caller can show a clear recovery state instead.
 */
export function selectSessionQuestions<T extends SelectableQuestion>(
  params: Pick<NormalizedSessionParams, 'topicGroupId' | 'level' | 'length' | 'seed'>,
  allQuestions: T[],
  isEligible?: (question: T) => boolean
): SessionBuildResult<T> {
  const pool = getEligiblePool(params, allQuestions, isEligible)

  if (pool.length < params.length) {
    return { status: 'insufficient', available: pool.length, requested: params.length }
  }

  return { status: 'ok', questions: seededShuffle(pool, params.seed).slice(0, params.length) }
}

/** The exact count of eligible questions for a topic-group + level combination -- the same filtering selectSessionQuestions() uses, without a length requirement. Powers buildQuizAvailabilityMatrix() below. */
export function countEligibleQuestions<T extends SelectableQuestion>(
  params: Pick<NormalizedSessionParams, 'topicGroupId' | 'level'>,
  allQuestions: T[],
  isEligible?: (question: T) => boolean
): number {
  return getEligiblePool(params, allQuestions, isEligible).length
}

/** Quick Quiz can only auto-grade multiple-choice questions -- 'scenario' questions have a free-text model answer, not a single verbatim correct string, so they stay Guided-Practice-only. No new stored field needed; this is a pure derivation from the existing `type`. */
export function isQuizEligible(question: PracticeQuestion): boolean {
  return question.type === 'multiple-choice'
}

export function buildGuidedOrQuizSession(
  mode: 'guided' | 'quiz',
  params: Pick<NormalizedSessionParams, 'topicGroupId' | 'level' | 'length' | 'seed'>,
  allQuestions: PracticeQuestion[]
): SessionBuildResult<PracticeQuestion> {
  return selectSessionQuestions(params, allQuestions, mode === 'quiz' ? isQuizEligible : undefined)
}

// ---------------------------------------------------------------------------
// Quiz availability matrix -- lets the builder disable/omit combinations
// that can never succeed, instead of only rejecting them after submission.
// ---------------------------------------------------------------------------

/** The non-'advanced' levels Quick Quiz actually offers -- see isValidLevel()'s own comment for why 'advanced' is interview-only. */
export const QUIZ_LEVELS: Array<Exclude<SessionLevel, 'advanced'>> = ['beginner', 'intermediate', 'mixed']

/** The key used for "All Topics" (no topic filter) in a QuizAvailabilityMatrix -- the empty string, matching the actual `topicGroup=` query-param value an "All Topics" selection submits. */
export const ALL_TOPICS_KEY = ''

export interface QuizAvailabilityEntry {
  count: number
  supportsLength: Record<SessionLength, boolean>
}

/** topicGroupId (or ALL_TOPICS_KEY) -> level -> availability. */
export type QuizAvailabilityMatrix = Record<string, Record<Exclude<SessionLevel, 'advanced'>, QuizAvailabilityEntry>>

/**
 * Computes real, current availability for every topic-group x level
 * combination the Quick Quiz builder can offer, straight from the live
 * PRACTICE_QUESTIONS catalog -- never a hardcoded count that could drift
 * out of sync with the actual content. Small and fully serializable (13
 * topic groups + "All Topics", x 3 levels, x a `{count, supportsLength}`
 * each) -- safe to pass to a client component without shipping the
 * underlying question content itself.
 */
export function buildQuizAvailabilityMatrix(allQuestions: PracticeQuestion[]): QuizAvailabilityMatrix {
  const groupIds = [ALL_TOPICS_KEY, ...PRACTICE_TOPIC_GROUPS.map((g) => g.id)]
  const matrix = {} as QuizAvailabilityMatrix

  for (const groupId of groupIds) {
    const perLevel = {} as QuizAvailabilityMatrix[string]
    for (const level of QUIZ_LEVELS) {
      const count = countEligibleQuestions({ topicGroupId: groupId || null, level }, allQuestions, isQuizEligible)
      perLevel[level] = { count, supportsLength: { 1: false, 5: count >= 5, 10: count >= 10 } }
    }
    matrix[groupId] = perLevel
  }

  return matrix
}

/**
 * Whether a single level's availability entry can actually run a session at
 * one of the lengths the caller offers -- having *some* eligible questions
 * is not enough (e.g. 3 eligible questions is still zero when the builder
 * only ever offers 5- or 10-question sessions). This is the single source
 * of truth for "runnable" -- the builder form, its auto-correction, and the
 * regression suite all call this (or isTopicRunnable/isConfigRunnable
 * below) instead of re-deriving their own count-based check, so the three
 * can never quietly drift apart.
 */
export function isLevelRunnable(entry: QuizAvailabilityEntry | undefined, offeredLengths: SessionLength[]): boolean {
  if (!entry) return false
  return offeredLengths.some((length) => entry.supportsLength[length])
}

/**
 * Whether a topic (or "All Topics") has at least one level that's runnable
 * at one of the offered lengths. A topic is never "available" merely
 * because it contains one or more questions -- see isLevelRunnable().
 */
export function isTopicRunnable(perLevel: QuizAvailabilityMatrix[string] | undefined, offeredLengths: SessionLength[]): boolean {
  if (!perLevel) return false
  return QUIZ_LEVELS.some((level) => isLevelRunnable(perLevel[level], offeredLengths))
}

/** Whether one exact topic+level+length combination can actually start a session. */
export function isConfigRunnable(entry: QuizAvailabilityEntry | undefined, length: SessionLength): boolean {
  return entry?.supportsLength[length] ?? false
}

// ---------------------------------------------------------------------------
// Quiz scoring
// ---------------------------------------------------------------------------

export interface QuizAnswerResult {
  questionId: string
  correct: boolean
  userAnswer: string | null
}

export interface QuizResult {
  correctCount: number
  total: number
  results: QuizAnswerResult[]
}

/** Pure scoring -- an unanswered question (missing from `answers`) is always incorrect, never silently skipped from the total. */
export function scoreQuiz(questions: PracticeQuestion[], answers: Record<string, string>): QuizResult {
  const results: QuizAnswerResult[] = questions.map((q) => {
    const userAnswer = Object.prototype.hasOwnProperty.call(answers, q.id) ? answers[q.id] : null
    return { questionId: q.id, correct: userAnswer !== null && userAnswer === q.correctAnswer, userAnswer }
  })
  return { correctCount: results.filter((r) => r.correct).length, total: questions.length, results }
}

export function selectRetryQuestions(questions: PracticeQuestion[], result: QuizResult): PracticeQuestion[] {
  const incorrectIds = new Set(result.results.filter((r) => !r.correct).map((r) => r.questionId))
  return questions.filter((q) => incorrectIds.has(q.id))
}
