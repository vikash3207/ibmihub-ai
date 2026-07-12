import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SITE_NAME } from '@/lib/config'

interface AuthCardProps {
  title: string
  subtitle: string
  wide?: boolean
  children: React.ReactNode
}

/** Shared shell for the auth (login/sign-up/password) and onboarding pages. */
export function AuthCard({ title, subtitle, wide, children }: AuthCardProps) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className={cn('w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8', wide ? 'max-w-lg' : 'max-w-sm')}>
        <Link href="/" className="mb-6 flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Cpu className="h-4 w-4" aria-hidden="true" />
          </span>
          {SITE_NAME}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">{title}</h1>
        <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
        {children}
      </div>
    </main>
  )
}
