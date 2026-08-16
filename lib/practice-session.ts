/**
 * Practice Hub session logic (Guided Practice, Quick Quizzes and Interview
 * Preparation) -- pure, framework-free module, no fetching, no `server-only`
 * import, same "pure logic outside any server-only/client boundary"
 * convention lib/search.ts and lib/deep-dive-render.ts already establish for
 * this codebase, so it's directly exercised by scripts/practice-hub-
 * regression.ts against synthetic fixtures.
 *
 * There is no persistence layer for Practice today (confirmed by audit: no
 * Supabase table, PracticeBrowser's state was always local `useState`), so
 * a session's *composition* (which questions, in what order) is entirely a
 * pure function of its URL query params -- deterministic via a seeded
 * shuffle, never randomized in a way that would make a refresh, Back/
 * Forward, or hydration replace the question set. Two ways a caller can
 * arrive at a seed:
 *  - No `seed` param at all: deriveDefaultSeed() turns the rest of the
 *    params into one deterministically, so a bare/shared/bookmarked URL is
 *    stable and reproducible on every load.
 *  - An explicit `seed` param (e.g. Date.now(), set by a "Start another
 *    session"/"Retry" action): gives a genuinely different question order
 *    or selection on demand, without needing any storage.
 */

import type { PracticeQuestion, PracticeDifficulty } from '@/content/practice/questions'
import { resolveTopicGroup, topicIdsForGroup } from './practice-topic-groups'

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
 * hit the zero-inventory case. The new 60-question interview bank is
 * authored across all three real levels by design, so Interview Prep gets
 * the full range.
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

  const parsedSeed = raw.seed ? Number(raw.seed) : NaN
  const seed = Number.isFinite(parsedSeed) ? parsedSeed : deriveDefaultSeed([mode, topicGroupId ?? 'all', level, String(length)])

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
 * Core selection algorithm shared by Guided Practice, Quick Quiz, and
 * Interview Prep -- filters by topic group + level, optionally by a mode-
 * specific eligibility predicate, de-duplicates by id (defensive: a session
 * must never show the same question twice even if the source catalog ever
 * had an accidental duplicate id), then takes exactly `length` questions via
 * a seeded shuffle. Never silently returns fewer questions while claiming a
 * full-length session -- an insufficient pool is reported explicitly so the
 * caller can show a clear recovery state instead.
 */
export function selectSessionQuestions<T extends SelectableQuestion>(
  { topicGroupId, level, length, seed }: Pick<NormalizedSessionParams, 'topicGroupId' | 'level' | 'length' | 'seed'>,
  allQuestions: T[],
  isEligible?: (question: T) => boolean
): SessionBuildResult<T> {
  const topicIds = topicIdsForGroup(topicGroupId)

  let pool = allQuestions.filter((q) => (topicIds ? topicIds.includes(q.topicId) : true) && matchesLevel(q.difficulty, level))
  if (isEligible) pool = pool.filter(isEligible)

  const seenIds = new Set<string>()
  pool = pool.filter((q) => {
    if (seenIds.has(q.id)) return false
    seenIds.add(q.id)
    return true
  })

  if (pool.length < length) {
    return { status: 'insufficient', available: pool.length, requested: length }
  }

  return { status: 'ok', questions: seededShuffle(pool, seed).slice(0, length) }
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

export function buildInterviewSession<T extends SelectableQuestion>(
  params: Pick<NormalizedSessionParams, 'topicGroupId' | 'level' | 'length' | 'seed'>,
  allQuestions: T[]
): SessionBuildResult<T> {
  return selectSessionQuestions(params, allQuestions)
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

// ---------------------------------------------------------------------------
// Interview self-assessment (never a numeric score)
// ---------------------------------------------------------------------------

export type InterviewAssessment = 'needs-review' | 'partial' | 'confident'

export interface InterviewSummary {
  reviewed: number
  byBucket: Record<InterviewAssessment, number>
  /** topicIds the learner marked Confident on every reviewed question for that topic within this session. */
  topicsConfident: string[]
  /** topicIds with at least one Needs review/Partially covered mark in this session. */
  topicsNeedingReview: string[]
}

/**
 * Deliberately produces only categorical buckets and topic lists -- never a
 * percentage or "readiness" number. A small self-reported sample must not
 * be dressed up as a measured score or a certification claim.
 */
export function summarizeInterview<T extends SelectableQuestion>(
  questions: T[],
  assessments: Record<string, InterviewAssessment>
): InterviewSummary {
  const byBucket: Record<InterviewAssessment, number> = { 'needs-review': 0, partial: 0, confident: 0 }
  const confidentTopics = new Set<string>()
  const needsReviewTopics = new Set<string>()
  let reviewed = 0

  for (const q of questions) {
    const assessment = assessments[q.id]
    if (!assessment) continue
    reviewed += 1
    byBucket[assessment] += 1
    if (assessment === 'confident') {
      confidentTopics.add(q.topicId)
    } else {
      needsReviewTopics.add(q.topicId)
    }
  }

  // A topic only counts as "confident" overall if nothing in this session
  // marked it otherwise -- one weak answer should surface the topic as
  // needing review, not be masked by a stronger answer elsewhere.
  for (const topicId of needsReviewTopics) {
    confidentTopics.delete(topicId)
  }

  return {
    reviewed,
    byBucket,
    topicsConfident: Array.from(confidentTopics),
    topicsNeedingReview: Array.from(needsReviewTopics),
  }
}
