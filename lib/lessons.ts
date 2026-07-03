/**
 * Lesson content loading and metadata queries.
 * All public queries return ONLY Published lessons.
 * Server-side only - do not import in client components.
 */

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { join } from 'path'

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
    // Lesson does not exist or is not Published -- returns 404
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
 * Load Markdown content from the lesson's content_source_path.
 * Returns the raw Markdown string, or throws if the file cannot be read.
 * Call this from a server component or server action only.
 */
export async function loadLessonMarkdown(lesson: Lesson): Promise<string> {
  const absolutePath = join(process.cwd(), lesson.content_source_path)
  try {
    return await readFile(absolutePath, 'utf-8')
  } catch (err) {
    console.error(`Failed to read lesson file: ${absolutePath}`, err)
    throw new Error(`Lesson content not available for: ${lesson.slug}`)
  }
}
