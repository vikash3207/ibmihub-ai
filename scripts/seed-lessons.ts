/**
 * Seed / sync lesson metadata from content/lessons/metadata.ts → Supabase.
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
        },
        { onConflict: 'slug' }
      )

    if (error) {
      console.error(`  ✗ Failed: ${lesson.slug}`, error.message)
    } else {
      console.log(`  ✓ ${lesson.slug} (${lesson.status})`)
    }
  }

  console.log('\nSeed complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
