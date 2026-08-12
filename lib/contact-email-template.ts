/**
 * Contact-form notification email content (PR #201). Builds both the HTML
 * and plain-text bodies sent via Resend from app/api/contact/route.ts.
 *
 * Deliberately hand-rolled rather than a React-email component: the content
 * is a handful of labeled fields, and every visitor-supplied value below is
 * passed through escapeHtml() before being placed in the HTML string --
 * there is no other way visitor input reaches raw HTML in this module. Only
 * ever includes what the field list in this file names -- no cookies,
 * tokens, session data, or request headers ever reach this module, let
 * alone the email.
 *
 * No 'server-only' marker: this module touches no secrets and no Node-only
 * API, so scripts/contact-form-regression.ts imports and executes it
 * directly (e.g. to assert a `<script>` payload in `message` is escaped in
 * the HTML output but preserved verbatim in the plain-text output) --
 * mirrors lib/insight-structured-data.ts's reasoning for staying
 * framework-free. It is still only ever called from the server-only route.
 */

export interface ContactEmailFields {
  name: string
  email: string
  subject: string
  message: string
  submissionId: string
  /** Set only when the visitor was signed in at submission time; omitted entirely from the email otherwise. */
  authenticatedUserId?: string
}

/** Escapes the five HTML-significant characters. The only path visitor input takes into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const SUBMISSION_SOURCE = 'iRPGenie Contact page'

export function buildContactEmailSubject(rawSubject: string): string {
  return `[iRPGenie Contact] ${rawSubject}`
}

export function buildContactEmailHtml(fields: ContactEmailFields): string {
  const rows: Array<[string, string]> = [
    ['Name', fields.name],
    ['Email', fields.email],
    ['Subject', fields.subject],
    ['Source', SUBMISSION_SOURCE],
    ...(fields.authenticatedUserId ? ([['Authenticated user ID', fields.authenticatedUserId]] as Array<[string, string]>) : []),
    ['Submission ID', fields.submissionId],
  ]

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;color:#0f172a;font-size:13px;">${escapeHtml(value)}</td></tr>`
    )
    .join('')

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
        <h1 style="margin:0 0 16px;font-size:16px;color:#0f172a;">New iRPGenie contact form submission</h1>
        <table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:16px;">
          ${rowsHtml}
        </table>
        <div style="border-top:1px solid #e2e8f0;padding-top:16px;">
          <p style="margin:0 0 6px;color:#64748b;font-size:13px;">Message</p>
          <p style="margin:0;color:#0f172a;font-size:14px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(fields.message)}</p>
        </div>
      </div>
      <p style="margin:16px 4px 0;color:#94a3b8;font-size:11px;">Reply to this email to respond directly to the sender.</p>
    </div>
  </body>
</html>`
}

export function buildContactEmailText(fields: ContactEmailFields): string {
  const lines = [
    'New iRPGenie contact form submission',
    '',
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Subject: ${fields.subject}`,
    `Source: ${SUBMISSION_SOURCE}`,
    ...(fields.authenticatedUserId ? [`Authenticated user ID: ${fields.authenticatedUserId}`] : []),
    `Submission ID: ${fields.submissionId}`,
    '',
    'Message:',
    fields.message,
    '',
    '---',
    'Reply to this email to respond directly to the sender.',
  ]
  return lines.join('\n')
}
