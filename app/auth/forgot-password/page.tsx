import Link from 'next/link'
import { forgotPassword } from '@/lib/actions/auth'

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { message } = await searchParams

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Reset your password</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your email address and we&apos;ll send you a reset link.
        </p>

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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          <button
            formAction={async (formData) => {
              'use server'
              const { message } = await forgotPassword(formData)
              const { redirect } = await import('next/navigation')
              redirect(`/auth/forgot-password?message=${encodeURIComponent(message)}`)
            }}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/auth/login" className="font-medium text-slate-900 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  )
}
