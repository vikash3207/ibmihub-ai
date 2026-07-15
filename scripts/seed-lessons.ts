/**
 * Seed / sync lesson metadata from content/lessons/metadata.ts -> Supabase.
 *
 * Usage:
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * The service role key bypasses RLS. This script is server-side only.
 */

import { createClient } from '@supabase/supabase-js'
import { IBM_I_FUNDAMENTALS_LESSONS } from '../content/lessons/metadata'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seed() {
  console.log(`Seeding ${IBM_I_FUNDAMENTALS_LESSONS.length} lessons...`)

  let successCount = 0
  let failureCount = 0

  for (const lesson of IBM_I_FUNDAMENTALS_LESSONS) {
    const { error } = await supabase
      .from('lessons')
      .upsert(
        {
          slug: lesson.slug,
          title: lesson.title,
          short_description: lesson.shortDescription,
          lesson_order: lesson.lessonOrder,
          learning_path_id: lesson.learningPathId,
          status: lesson.status,
          content_source_path: lesson.contentSourcePath,
          estimated_reading_time: lesson.estimatedReadingTime ?? null,
          ai_tutor_starter_question: lesson.aiTutorStarterQuestion ?? null,
          // v2.0 fields (Spec 009 v2.1 Section 11.3) -- additive only; do not
          // affect lesson_order/learning_path_id, which remain the fields the
          // current Learning Center and progress calculations depend on.
          track_id: lesson.trackId ?? null,
          module_id: lesson.moduleId ?? null,
          difficulty: lesson.difficulty ?? null,
          depth: lesson.depth ?? null,
          tags: lesson.tags ?? null,
          prerequisites: lesson.prerequisites ?? null,
          related_lessons: lesson.relatedLessons ?? null,
          persona_tags: lesson.personaTags ?? null,
          ai_tutor_prompts: lesson.aiTutorPrompts ?? null,
          // Taxonomy fields (PR #120/#121/#122, planning/LESSON_TAXONOMY_AND_GROUPING_AUDIT.md)
          // -- additive only; independent of track_id/module_id above, which
          // remain unchanged and authoritative for the current UI.
          master_category_id: lesson.masterCategoryId ?? null,
          master_subcategory: lesson.masterSubcategory ?? null,
          secondary_category_ids: lesson.secondaryCategoryIds ?? null,
        },
        { onConflict: 'slug' }
      )

    if (error) {
      failureCount += 1
      console.error(`  FAILED: ${lesson.slug} - ${error.message}`)
    } else {
      successCount += 1
      console.log(`  OK: ${lesson.slug} (${lesson.status})`)
    }
  }

  console.log(`\nSeed summary: ${successCount} succeeded, ${failureCount} failed.`)

  if (failureCount > 0) {
    console.error('Seed did not complete successfully.')
    process.exit(1)
  }

  console.log('Seed complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
