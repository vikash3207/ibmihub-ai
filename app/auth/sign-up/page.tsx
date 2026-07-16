import Link from 'next/link'
import type { Metadata } from 'next'
import { signUp } from '@/lib/actions/auth'
import { AuthCard } from '@/components/auth-card'
import { buttonVariants } from '@/components/ui/button'

// Not useful search-result content, and excluded from app/sitemap.ts --
// explicitly opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Sign Up',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function SignUpPage({ searchParams }: Props) {
  const { next = '/', error } = await searchParams

  return (
    <AuthCard title="Create your account" subtitle="Save your progress and access the AI Tutor.">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <button formAction={signUp} className={buttonVariants({ variant: 'primary', className: 'w-full' })}>
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  )
}
