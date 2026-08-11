import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import { PRIMARY_CTA_LABEL, SITE_NAME } from '@/lib/config'
import { buttonVariants } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { SiteNavLinks } from '@/components/site-nav-links'
import { SiteLogoIcon } from '@/components/brand/site-logo-icon'
import { AuthStateBroadcaster } from '@/components/auth/auth-state-broadcaster'
import { UserMenu } from '@/components/user-menu'

/**
 * Shared public header. Server component only -- checks the Supabase session
 * server-side to decide Log in vs. Log out.
 *
 * For an authenticated user it also reads first_name/last_name from
 * user_profiles (Basic User Profile & Header Avatar enhancement) to render
 * the account-menu avatar and dropdown. Still exactly one getUser() call --
 * the profile lookup is a separate, ordinary row select, not a second
 * session check.
 */
export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('user_profiles').select('first_name, last_name').eq('id', user.id).maybeSingle()
    : { data: null }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      {/* Renders nothing. Shares the session check this header already
          performed with the AI Tutor provider in the root layout, so the
          Tutor stops showing "Log in" the moment this header starts showing
          "Log out" -- no refresh, no extra request (PR #186). */}
      <AuthStateBroadcaster isAuthenticated={Boolean(user)} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-y-2">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <SiteLogoIcon size={28} className="shrink-0" />
          {SITE_NAME}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
          <SiteNavLinks isLoggedIn={Boolean(user)} />
          {user ? (
            <>
              {/* Beside, not instead of, the existing Log out control below --
                  this adds the avatar/dropdown without removing or
                  reordering anything that was here before. */}
              <UserMenu
                email={user.email ?? ''}
                firstName={profile?.first_name ?? null}
                lastName={profile?.last_name ?? null}
              />
              <form>
                <SubmitButton formAction={logout} variant="secondary" size="sm" pendingLabel="Logging out...">
                  Log out
                </SubmitButton>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors active:opacity-70"
              >
                Log in
              </Link>
              <Link href="/learn" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                {PRIMARY_CTA_LABEL}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
