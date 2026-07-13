import { resetPassword } from '@/lib/actions/auth'
import { AuthCard } from '@/components/auth-card'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <AuthCard title="Set a new password" subtitle="Choose a new password for your account.">
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
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <button formAction={resetPassword} className={buttonVariants({ variant: 'primary', className: 'w-full' })}>
          Update Password
        </button>
      </form>
    </AuthCard>
  )
}
