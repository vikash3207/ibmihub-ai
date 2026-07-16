import Link from 'next/link'
import type { Metadata } from 'next'
import { login } from '@/lib/actions/auth'
import { AuthCard } from '@/components/auth-card'
import { buttonVariants } from '@/components/ui/button'

// Not useful search-result content, and excluded from app/sitemap.ts --
// explicitly opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Log In',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { next = '/', error } = await searchParams

  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue your IBM i learning journey.">
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
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-slate-500 hover:text-blue-600">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <button formAction={login} className={buttonVariants({ variant: 'primary', className: 'w-full' })}>
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href={`/auth/sign-up?next=${encodeURIComponent(next)}`} className="font-medium text-blue-600 hover:underline">
          Create one free
        </Link>
      </p>
    </AuthCard>
  )
}
