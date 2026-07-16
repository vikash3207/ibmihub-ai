/**
 * AI Tutor beta usage limits (PR #149). Centralizes the three cost/abuse
 * guardrails so they aren't hardcoded deep inside the API route --
 * override any of them per-environment via a Vercel env var, with no code
 * change. Falls back to the recommended beta defaults when unset or set to
 * something non-numeric.
 *
 * Server-only by design: enforcement must never depend on a value the
 * client could see or influence. See components/ai-tutor/chat-thread.tsx
 * for the (separately hardcoded, display-only) "Beta limit" caption --
 * keep that text in sync with AI_TUTOR_DAILY_LIMIT's default below if it
 * ever changes.
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
