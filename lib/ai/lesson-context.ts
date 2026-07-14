/**
 * Resolves a single lesson (by slug) into a compact context block for the
 * AI Tutor prompt. Server-only. Only ever resolves Published lessons --
 * getPublishedLessonBySlugOrNull already enforces that filter.
 */
import 'server-only'

import { getPublishedLessonBySlugOrNull, loadLessonMarkdown } from '@/lib/lessons'

/** Caps how much of a lesson's body is included, to bound prompt size. */
const MAX_LESSON_BODY_CHARS = 6000

export interface LessonContext {
  slug: string
  title: string
  shortDescription: string
  tags: string[]
  bodyExcerpt: string
}

/** Resolve a lesson's context for prompting, or null if the slug is missing/invalid/unpublished. */
export async function getLessonContext(lessonSlug: string): Promise<LessonContext | null> {
  const lesson = await getPublishedLessonBySlugOrNull(lessonSlug)
  if (!lesson) {
    return null
  }

  let body = ''
  try {
    body = await loadLessonMarkdown(lesson)
  } catch {
    // A lesson with unreadable content still has useful title/summary/tags
    // context -- degrade gracefully rather than dropping context entirely.
    body = ''
  }

  return {
    slug: lesson.slug,
    title: lesson.title,
    shortDescription: lesson.short_description,
    tags: lesson.tags ?? [],
    bodyExcerpt: body.slice(0, MAX_LESSON_BODY_CHARS),
  }
}

/** Format a resolved lesson context as a prompt section. */
export function formatLessonContextForPrompt(context: LessonContext): string {
  const tagsLine = context.tags.length > 0 ? context.tags.join(', ') : 'none'
  return `The learner is currently viewing this lesson on IBMiHub AI:
Title: ${context.title}
Summary: ${context.shortDescription}
Tags: ${tagsLine}
Lesson content (may be truncated for length):
"""
${context.bodyExcerpt}
"""`
}
