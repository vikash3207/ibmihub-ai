/**
 * Lesson content loading and metadata queries.
 * All public queries return ONLY Published lessons.
 * Server-side only - do not import in client components.
 */

import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { basename, resolve, sep, join } from 'path'
import { IBM_I_FUNDAMENTALS_LESSONS } from '@/content/lessons/metadata'

/** The only directory lesson Markdown files may ever be read from. */
const LESSON_CONTENT_DIR = join(process.cwd(), 'content', 'lessons')

export interface Lesson {
  id: string
  slug: string
  title: string
  short_description: string
  lesson_order: number
  learning_path_id: string
  status: string
  content_source_path: string
  estimated_reading_time: number | null
  ai_tutor_starter_question: string | null
}

/** Return all Published lessons ordered by lesson_order. */
export async function getPublishedLessons(): Promise<Lesson[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('status', 'Published')
    .order('lesson_order', { ascending: true })

  if (error) {
    console.error('getPublishedLessons error:', error.message)
    return []
  }

  return (data ?? []) as Lesson[]
}

/** Return a single Published lesson by slug, or call notFound() if not published. */
export async function getPublishedLessonBySlug(slug: string): Promise<Lesson> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'Published')
    .maybeSingle()

  if (error) {
    console.error('getPublishedLessonBySlug error:', error.message)
    notFound()
  }

  if (!data) {
    // Lesson does not exist or is not Published - returns 404
    notFound()
  }

  return data as Lesson
}

/** Return the count of Published lessons (used as progress denominator). */
export async function getPublishedLessonCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Published')

  if (error) {
    console.error('getPublishedLessonCount error:', error.message)
    return 0
  }

  return count ?? 0
}

/**
 * Load Markdown content for a lesson.
 * Returns the raw Markdown string, or throws if the file cannot be read.
 * Call this from a server component or server action only.
 *
 * The file path is never taken directly from the database record. It is
 * resolved by slug against the repository-committed metadata file
 * (content/lessons/metadata.ts), then constrained to LESSON_CONTENT_DIR and
 * re-validated after resolution. This means a compromised or misconfigured
 * "lessons.content_source_path" database value can never cause a file read
 * outside content/lessons - the database is not a trusted source for
 * filesystem paths.
 */
export async function loadLessonMarkdown(lesson: Lesson): Promise<string> {
  const knownLesson = IBM_I_FUNDAMENTALS_LESSONS.find((entry) => entry.slug === lesson.slug)

  if (!knownLesson) {
    console.error(`No repository metadata entry found for lesson slug: ${lesson.slug}`)
    throw new Error(`Lesson content not available for: ${lesson.slug}`)
  }

  // basename() strips any directory components, so fileName can never
  // contain "../" or an absolute path segment.
  const fileName = basename(knownLesson.contentSourcePath)

  // turbopackIgnore: this path is built from a fixed base directory plus a
  // sanitized basename, not inferred from an arbitrary runtime string -
  // next.config.mjs outputFileTracingIncludes tells the bundler which files
  // this route actually needs.
  const absolutePath = /* turbopackIgnore: true */ resolve(LESSON_CONTENT_DIR, fileName)

  if (!absolutePath.startsWith(LESSON_CONTENT_DIR + sep)) {
    console.error(`Rejected lesson content path outside content/lessons: ${knownLesson.contentSourcePath}`)
    throw new Error(`Lesson content not available for: ${lesson.slug}`)
  }

  try {
    return await readFile(absolutePath, 'utf-8')
  } catch (err) {
    console.error(`Failed to read lesson file: ${absolutePath}`, err)
    throw new Error(`Lesson content not available for: ${lesson.slug}`)
  }
}
