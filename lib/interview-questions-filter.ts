/**
 * Interview Prep's own pure filter/facet logic (IBM i Practice Hub --
 * Interview Prep phase 1). Deliberately NOT lib/practice-session.ts's
 * `selectSessionQuestions`/`isTopicRunnable`/etc. -- those exist to build
 * one fixed-length, seed-shuffled session and report whether a length is
 * "runnable," which doesn't fit an unbounded, filterable browse catalog
 * (there's no session length here, no seed, no "insufficient" case -- just
 * "show me everything matching these filters").
 */

import type { InterviewQuestion, InterviewQuestionType } from '@/content/practice/interview-questions'
import type { PracticeDifficulty } from '@/content/practice/questions'

export interface InterviewQuestionFilters {
  topicIds?: string[]
  difficulties?: PracticeDifficulty[]
  questionTypes?: InterviewQuestionType[]
}

/** Every filter dimension is OR-within, AND-across: an empty/omitted dimension matches everything. */
export function filterInterviewQuestions(questions: InterviewQuestion[], filters: InterviewQuestionFilters): InterviewQuestion[] {
  const { topicIds, difficulties, questionTypes } = filters

  return questions.filter((q) => {
    if (topicIds && topicIds.length > 0 && !topicIds.includes(q.topicId)) return false
    if (difficulties && difficulties.length > 0 && !difficulties.includes(q.difficulty)) return false
    if (questionTypes && questionTypes.length > 0 && !questionTypes.includes(q.questionType)) return false
    return true
  })
}

export interface TopicFacetCount {
  topicId: string
  count: number
}

/** Real per-topic counts derived from whatever question set is passed in (the caller decides published-only vs. all). */
export function countByTopic(questions: InterviewQuestion[]): TopicFacetCount[] {
  const counts = new Map<string, number>()
  for (const q of questions) {
    counts.set(q.topicId, (counts.get(q.topicId) ?? 0) + 1)
  }
  return [...counts.entries()].map(([topicId, count]) => ({ topicId, count }))
}

export interface DifficultyFacetCount {
  difficulty: PracticeDifficulty
  count: number
}

export function countByDifficulty(questions: InterviewQuestion[]): DifficultyFacetCount[] {
  const order: PracticeDifficulty[] = ['beginner', 'intermediate', 'advanced']
  return order
    .map((difficulty) => ({ difficulty, count: questions.filter((q) => q.difficulty === difficulty).length }))
    .filter((entry) => entry.count > 0)
}

export interface TypeFacetCount {
  questionType: InterviewQuestionType
  count: number
}

export function countByType(questions: InterviewQuestion[]): TypeFacetCount[] {
  const order: InterviewQuestionType[] = ['conceptual', 'scenario-based', 'code-based']
  return order
    .map((questionType) => ({ questionType, count: questions.filter((q) => q.questionType === questionType).length }))
    .filter((entry) => entry.count > 0)
}
