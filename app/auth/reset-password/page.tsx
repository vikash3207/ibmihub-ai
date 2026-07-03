import { resetPassword } from '@/lib/actions/auth'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Set a new password</h1>
        <p className="text-sm text-slate-500 mb-6">Choose a new password for your account.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          <button
            formAction={resetPassword}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </main>
  )
}
