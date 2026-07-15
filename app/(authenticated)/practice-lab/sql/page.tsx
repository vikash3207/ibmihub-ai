import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Database } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRACTICE_LAB_SQL_EXERCISES } from '@/content/practice-lab/sql-exercises'
import { PracticeLabExerciseList } from '@/components/practice-lab/exercise-list'
import { SimulatorNotice } from '@/components/practice-lab/simulator-notice'

// Auth-gated page -- never statically cache; always compute fresh per request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SQL Practice Console',
  description: 'An ACS-style SQL practice console for learning SQL on IBM i with sample data.',
}

export default async function PracticeLabSqlPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=%2Fpractice-lab%2Fsql')
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/practice-lab" prefetch={false} className="text-sm text-slate-500 hover:text-slate-700">
          &larr; Practice Lab
        </Link>
        <div className="mb-2 mt-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Database className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-bold text-slate-900">SQL Practice Console</h1>
        </div>
        <p className="text-slate-600 leading-relaxed">
          An ACS &ldquo;Run SQL Scripts&rdquo;-style, guided console for practicing SQL against a
          small sample schema -- SELECT, WHERE, JOIN, aggregates, and reading SQL errors. AI
          Tutor assistance for each exercise is planned for a future update.
        </p>
      </div>

      <SimulatorNotice />

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Planned exercises</h2>
        <PracticeLabExerciseList exercises={PRACTICE_LAB_SQL_EXERCISES} />
      </div>
    </div>
  )
}
