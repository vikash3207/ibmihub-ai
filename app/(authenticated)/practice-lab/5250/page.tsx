import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Terminal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRACTICE_LAB_5250_EXERCISES } from '@/content/practice-lab/5250-exercises'
import { PracticeLabExerciseList } from '@/components/practice-lab/exercise-list'
import { SimulatorNotice } from '@/components/practice-lab/simulator-notice'

// Auth-gated page -- never statically cache; always compute fresh per request.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '5250 Command Practice',
  description: 'A guided 5250-style command practice simulator for learning IBM i commands.',
}

export default async function PracticeLab5250Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=%2Fpractice-lab%2F5250')
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/practice-lab" prefetch={false} className="text-sm text-slate-500 hover:text-slate-700">
          &larr; Practice Lab
        </Link>
        <div className="mb-2 mt-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Terminal className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-bold text-slate-900">5250 Command Practice</h1>
        </div>
        <p className="text-slate-600 leading-relaxed">
          A green-screen-style, guided simulator for practicing common IBM i commands --
          command line navigation, object/library commands, and basic operational
          troubleshooting. AI Tutor assistance for each exercise is planned for a future update.
        </p>
      </div>

      <SimulatorNotice />

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Planned exercises</h2>
        <PracticeLabExerciseList exercises={PRACTICE_LAB_5250_EXERCISES} />
      </div>
    </div>
  )
}
