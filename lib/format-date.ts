/**
 * Locale-aware date formatting for server-rendered pages (PR #178).
 *
 * Formatting happens on the server using the request's own
 * `Accept-Language` header rather than in a client effect. That choice is
 * deliberate: formatting during a client render would disagree with the
 * server's output and cause a hydration mismatch, and correcting it in a
 * post-mount effect means a setState-in-effect cascade. Reading the header
 * gives the visitor's actual language preference with no client JavaScript,
 * no mismatch, and no extra render.
 *
 * Pure and dependency-free so it can be unit tested directly.
 */

/**
 * Extract a usable BCP 47 locale from an `Accept-Language` header value.
 * Takes the first (highest priority) entry, drops any `;q=` weight, and
 * falls back to `en-US` for a missing, malformed, or wildcard value.
 */
export function parseAcceptLanguage(headerValue: string | null | undefined): string {
  const fallback = 'en-US'
  if (!headerValue) return fallback

  const first = headerValue.split(',')[0]?.split(';')[0]?.trim()
  if (!first || first === '*') return fallback

  // Guard against a malformed header reaching Intl, which throws a RangeError
  // on an invalid language tag.
  return /^[a-zA-Z]{2,8}(-[a-zA-Z0-9]{2,8})*$/.test(first) ? first : fallback
}

/**
 * Format an ISO timestamp as a date (never a time of day) in the given
 * locale. `completed_at` is a real timestamp, but showing a to-the-minute
 * "activity time" would overstate what the value usefully tells a learner.
 *
 * Returns the raw ISO date slice if the timestamp is unparseable, so a bad
 * row degrades to something honest rather than "Invalid Date".
 */
export function formatCompletionDate(isoTimestamp: string, locale: string): string {
  const parsed = new Date(isoTimestamp)
  if (Number.isNaN(parsed.getTime())) return isoTimestamp.slice(0, 10)

  try {
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(parsed)
  } catch {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(parsed)
  }
}
