import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Terminal, Database } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { SimulatorNotice } from '@/components/practice-lab/simulator-notice'

// Auth-gated page -- never statically cache; always compute fresh per request.
// Mirrors app/(authenticated)/practice/page.tsx and dashboard/ai-tutor.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Practice Lab',
  description: 'A guided 5250-style command simulator and ACS-style SQL console for hands-on IBM i practice.',
}

export default async function PracticeLabPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=%2Fpractice-lab')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Practice Lab</h1>
        <p className="text-slate-600 leading-relaxed">
          Practice IBM i skills hands-on with guided, simulated exercises -- a 5250-style command
          practice environment and an ACS-style SQL console, both built for learning.
        </p>
      </div>

      <SimulatorNotice />

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/practice-lab/5250" prefetch={false} className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Terminal className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">5250 Command Practice</span>
            <span className="block text-sm text-slate-600 mt-1 leading-relaxed">
              Practice common IBM i commands in a guided 5250-style simulator. No real system
              connection -- a safe learning environment with predefined exercises.
            </span>
          </Card>
        </Link>

        <Link href="/practice-lab/sql" prefetch={false} className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Database className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">SQL Practice Console</span>
            <span className="block text-sm text-slate-600 mt-1 leading-relaxed">
              Practice SQL using an ACS-style learning console. Sample data only -- safe,
              simulated exercises, not a connection to a real database.
            </span>
          </Card>
        </Link>
      </div>
    </div>
  )
}
