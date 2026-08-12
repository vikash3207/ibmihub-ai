/**
 * Contact-form constants shared between the client (components/contact-
 * form.tsx) and the server (lib/contact-form-validation.ts,
 * app/api/contact/route.ts). PR #201.
 *
 * Deliberately has zero Node-only imports (no node:crypto, nothing
 * webpack can't resolve in a browser bundle) -- lib/contact-form-
 * validation.ts needs node:crypto for hashIp() and is fine to import that
 * from server code, but the client form component must import field limits
 * and the honeypot field name from here instead, or a client bundle build
 * would try to resolve 'node:crypto' and fail.
 */

export const MAX_NAME_LENGTH = 100
export const MAX_SUBJECT_LENGTH = 200
export const MIN_MESSAGE_LENGTH = 10
export const MAX_MESSAGE_LENGTH = 5000
/** Rejects a request body larger than this before it is even parsed as JSON. */
export const MAX_REQUEST_BODY_BYTES = 20_000

/**
 * Hidden field name for the honeypot. A real visitor never sees or fills
 * this field (see components/contact-form.tsx); any non-empty value here
 * means the request came from a bot filling every field it can find.
 */
export const HONEYPOT_FIELD_NAME = 'companyWebsite'

const SUBMISSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** True for a well-formed UUID string -- the only shape a client-generated `crypto.randomUUID()` submission id can take. */
export function isValidSubmissionId(value: unknown): value is string {
  return typeof value === 'string' && SUBMISSION_ID_PATTERN.test(value)
}
