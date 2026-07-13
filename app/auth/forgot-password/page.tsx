import Link from 'next/link'
import { forgotPassword } from '@/lib/actions/auth'
import { AuthCard } from '@/components/auth-card'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { message } = await searchParams

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email address and we'll send you a reset link.">
      {message && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <form className="space-y-4">
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

        <button
          formAction={async (formData) => {
            'use server'
            const { message } = await forgotPassword(formData)
            const { redirect } = await import('next/navigation')
            redirect(`/auth/forgot-password?message=${encodeURIComponent(message)}`)
          }}
          className={buttonVariants({ variant: 'primary', className: 'w-full' })}
        >
          Send Reset Link
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
          Back to login
        </Link>
      </p>
    </AuthCard>
  )
}
