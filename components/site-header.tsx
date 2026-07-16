import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import { PRIMARY_CTA_LABEL, SITE_NAME } from '@/lib/config'
import { buttonVariants } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { SiteNavLinks } from '@/components/site-nav-links'

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
          <SiteNavLinks isLoggedIn={Boolean(user)} />
          {user ? (
            <form>
              <SubmitButton formAction={logout} variant="secondary" size="sm" pendingLabel="Logging out...">
                Log out
              </SubmitButton>
            </form>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors active:opacity-70"
              >
                Log in
              </Link>
              <Link href="/auth/sign-up" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                {PRIMARY_CTA_LABEL}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
