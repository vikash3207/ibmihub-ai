import { PASSWORD_UPDATED_MESSAGE } from '@/lib/auth-messages'
import { continueAfterPasswordReset } from '@/lib/actions/auth'
import { SubmitButton } from '@/components/ui/submit-button'
import type { PostAuthDestination } from '@/lib/auth-destination'

/**
 * The password-reset confirmation, shared by both places it can be reached
 * from (PR #192):
 *
 *   - app/auth/reset-password/page.tsx's own success branch, gated on the
 *     server-issued success marker -- the lasting, authoritative render.
 *   - components/auth/reset-password-form.tsx's immediate client-side render
 *     of the Server Action's return value -- instant feedback before that
 *     page-level refresh lands.
 *
 * No directive: has no hooks and calls no server-only API, so it renders
 * correctly whichever tree it is composed into.
 *
 * The "Continue" button is a real form bound to continueAfterPasswordReset
 * rather than a plain link, because reaching the destination is also the
 * moment the success marker is deliberately cleared (see
 * lib/auth-success-state.ts for why that marker's lifetime matters).
 */
export function ResetSuccessContent({ destination }: { destination: PostAuthDestination }) {
  return (
    <>
      {/* role="status" matters most when this replaces the form live within
          the same page (the client-rendered path); harmless on a fresh
          server render. */}
      <div
        role="status"
        className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
      >
        {PASSWORD_UPDATED_MESSAGE}
      </div>

      <form>
        {/* Not user input -- destination is always one of the literal
            PostAuthDestination values computed server-side, never anything
            read back from a query parameter. */}
        <input type="hidden" name="destination" value={destination} />
        <SubmitButton formAction={continueAfterPasswordReset} variant="primary" className="w-full">
          Continue to iRPGenie
        </SubmitButton>
      </form>
    </>
  )
}
