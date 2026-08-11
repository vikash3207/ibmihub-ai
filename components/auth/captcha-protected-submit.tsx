'use client'

import { useState } from 'react'
import { TurnstileWidget } from './turnstile-widget'
import { SubmitButton } from '@/components/ui/submit-button'
import { TURNSTILE_CONFIGURED } from '@/lib/turnstile'

interface CaptchaProtectedSubmitProps {
  /** The Server Action to run. Passed through to the button's formAction. */
  formAction: (formData: FormData) => void | Promise<void>
  children: React.ReactNode
  pendingLabel?: string
}

/**
 * Turnstile challenge + submit button for an Auth form (PR #183).
 *
 * Kept as one component so the token state and the button's disabled state
 * cannot drift apart, and so each Auth page stays a Server Component with
 * only this small client island inside it.
 *
 * Duplicate submissions are already prevented by SubmitButton's
 * useFormStatus() pending state -- reused rather than reimplemented. This
 * adds the second condition: no current token, no submit.
 *
 * Disabling the button is a usability affordance, NOT the security control.
 * The real enforcement is server-side: the Server Action refuses to call
 * Supabase without a token, and Supabase itself validates that token against
 * Cloudflare using the secret key. A user who re-enables the button in
 * devtools still cannot create an account.
 */
export function CaptchaProtectedSubmit({ formAction, children, pendingLabel }: CaptchaProtectedSubmitProps) {
  const [token, setToken] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <TurnstileWidget onTokenChange={setToken} />

      <SubmitButton
        formAction={formAction}
        variant="primary"
        className="w-full"
        pendingLabel={pendingLabel}
        // Blocked while the challenge has not produced a token, and while
        // Turnstile is unconfigured -- never silently allowing an
        // unprotected submission.
        disabled={!TURNSTILE_CONFIGURED || !token}
      >
        {children}
      </SubmitButton>
    </div>
  )
}
