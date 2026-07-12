import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import { SITE_NAME } from '@/lib/config'
import { Button, buttonVariants } from '@/components/ui/button'

/**
 * Shared public header. Server component only -- checks the Supabase session
 * server-side to decide Log in vs. Log out. Intentionally does not read or
 * display any user profile fields (email, id, etc.); it only needs to know
 * whether a session exists. No account menu, per Batch 2 scope.
 */
export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-y-2">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Cpu className="h-4 w-4" aria-hidden="true" />
          </span>
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/learn"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Learning Center
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                prefetch={false}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/ai-tutor"
                prefetch={false}
                className="text-sm font-medium text-cyan-700 hover:text-cyan-800 transition-colors"
              >
                AI Tutor
              </Link>
              <form>
                <Button type="submit" formAction={logout} variant="ghost" size="sm" className="px-0">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/auth/login" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
