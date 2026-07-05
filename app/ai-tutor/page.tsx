import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AiTutorChat } from '@/components/ai-tutor-chat'

export const metadata: Metadata = {
  title: 'AI Tutor',
  description: 'Ask IBM i learning questions and get educational guidance.',
}

const STARTER_PROMPTS = [
  'What is IBM i?',
  'What is a library in IBM i?',
  'What is the difference between RPGLE and CLLE?',
  'What is a job log?',
]

const PRIVACY_NOTICE =
  'AI Tutor is for educational guidance only. Do not enter customer data, credentials, ' +
  'production code, job logs, or confidential information. The tutor cannot connect to a ' +
  'real IBM i system, execute code, or verify production behavior. For production or ' +
  'operational changes, validate with official documentation and an experienced IBM i ' +
  'professional.'

export default async function AiTutorPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Tutor</h1>
        <p className="text-slate-600 leading-relaxed">
          Ask questions about IBM i concepts and get educational, plain-language guidance.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm text-amber-900 leading-relaxed">{PRIVACY_NOTICE}</p>
      </div>

      <AiTutorChat starterPrompts={STARTER_PROMPTS} />
    </div>
  )
}
