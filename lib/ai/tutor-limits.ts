/**
 * AI Tutor beta usage limits (PR #149). Centralizes the three cost/abuse
 * guardrails so they aren't hardcoded deep inside the API route --
 * override any of them per-environment via a Vercel env var, with no code
 * change. Falls back to the recommended beta defaults when unset or set to
 * something non-numeric.
 *
 * Server-only by design: enforcement must never depend on a value the
 * client could see or influence.
 *
 * AI_TUTOR_DAILY_LIMIT is now the ONLY place the daily allowance is
 * written down (PR #182). The old display-only "Beta limit: 20 ..."
 * caption in components/ai-tutor/chat-thread.tsx duplicated the number and
 * had to be hand-synced; it has been removed, and lib/ai/product-facts.ts
 * reads this constant rather than restating it, so the AI Tutor's own
 * answer to "how many questions do I get?" cannot drift from what is
 * actually enforced.
 */
import 'server-only'

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

/** Max allowed AI Tutor requests per authenticated user per UTC calendar day. */
export const AI_TUTOR_DAILY_LIMIT = envInt('AI_TUTOR_DAILY_LIMIT', 20)

/** Max characters allowed in the newest user message of a single request. */
export const AI_TUTOR_MAX_MESSAGE_CHARS = envInt('AI_TUTOR_MAX_MESSAGE_CHARS', 2000)

/** Minimum seconds required between two allowed requests from the same user. */
export const AI_TUTOR_COOLDOWN_SECONDS = envInt('AI_TUTOR_COOLDOWN_SECONDS', 8)
