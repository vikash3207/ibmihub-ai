'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HONEYPOT_FIELD_NAME, MAX_NAME_LENGTH, MAX_SUBJECT_LENGTH, MAX_MESSAGE_LENGTH } from '@/lib/contact-form-shared'

/** Seconds the submit button stays disabled after any completed attempt, win or lose -- a lightweight client-side throttle on top of the server's own rate limit. */
const CLIENT_COOLDOWN_SECONDS = 5

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

interface ContactApiResponse {
  ok: boolean
  error?: string
}

/**
 * Contact-page form (PR #201). Submits to app/api/contact/route.ts, which
 * sends via Resend server-side -- replaces the previous mailto: link
 * (PR #148) that depended on the visitor having a local email app
 * configured. See that route and lib/contact-form-validation.ts for the
 * server-side validation and anti-abuse rules this UI has to cooperate
 * with (honeypot field, one submission id per form-fill, a body shape the
 * server will actually accept).
 */
export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const [status, setStatus] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // One id per form-fill, generated client-side so a retried/double-clicked
  // request can be recognized as the same logical submission (server-side
  // duplicate-send protection + Resend idempotency key -- see the route). A
  // lazy useState initializer, not an effect: the id itself is never
  // rendered into the DOM (only read inside the submit handler), so a
  // server-vs-client value mismatch during hydration cannot surface as a
  // markup mismatch, and this avoids the extra render an effect would cost.
  const [submissionId, setSubmissionId] = useState<string>(() => crypto.randomUUID())

  // Set synchronously at the top of handleSubmit, read synchronously there
  // too -- a plain ref update is not batched the way setStatus() is, so it
  // closes a race that state alone cannot: two clicks dispatched back-to-back
  // (double-click, or a stuck key) can both run their handler before React
  // re-renders with isSubmitting === true. The server's own idempotency key
  // (submissionId, unchanged for both racing requests) is still the actual
  // guarantee against a duplicate email -- this ref is what keeps a normal
  // double-click from firing two HTTP requests in the first place.
  const isSubmittingRef = useRef(false)

  const statusRegionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      statusRegionRef.current?.focus()
    }
  }, [status])

  useEffect(() => {
    if (cooldownRemaining <= 0) return
    const timer = setTimeout(() => setCooldownRemaining((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldownRemaining])

  const isSubmitting = status === 'submitting'
  const isDisabled = isSubmitting || cooldownRemaining > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isDisabled || isSubmittingRef.current) return
    isSubmittingRef.current = true

    setStatus('submitting')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          submissionId,
          [HONEYPOT_FIELD_NAME]: honeypot,
        }),
      })

      let data: ContactApiResponse | null = null
      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (response.ok && data?.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
        // A fresh id for any further message in this same page visit.
        setSubmissionId(crypto.randomUUID())
      } else {
        setStatus('error')
        setErrorMessage(data?.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    } finally {
      isSubmittingRef.current = false
      setCooldownRemaining(CLIENT_COOLDOWN_SECONDS)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot -- invisible and unreachable by keyboard for a real
          visitor (off-screen, not display:none, not aria-hidden's usual
          tabIndex trap either -- tabIndex={-1} keeps it out of the tab
          order directly). Any non-empty value here means a bot filled
          every field it could find. */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="contact-company-website">Company Website</label>
        <input
          id="contact-company-website"
          name={HONEYPOT_FIELD_NAME}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={MAX_NAME_LENGTH}
            required
            disabled={isSubmitting}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-slate-700">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What's this about?"
          maxLength={MAX_SUBJECT_LENGTH}
          required
          disabled={isSubmitting}
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Let us know what's on your mind..."
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={isSubmitting}
          className={FIELD_CLASS}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={isDisabled}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending&hellip;
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              {cooldownRemaining > 0 ? `Send Message (${cooldownRemaining}s)` : 'Send Message'}
            </>
          )}
        </Button>
        {status !== 'error' && (
          <p className="text-xs text-slate-500">We&apos;ll reply to the email address you provide.</p>
        )}
      </div>

      {/* Single live region for both outcomes so screen readers announce
          whichever one fires; tabIndex={-1} lets us move keyboard focus
          here without it being part of the normal tab order. Cleared
          (unmounted) in the idle state so nothing stale is ever announced. */}
      <div ref={statusRegionRef} role="status" aria-live="polite" tabIndex={-1} className="outline-none">
        {status === 'success' && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Thanks! Your message has been sent to iRPGenie.
          </p>
        )}
        {status === 'error' && errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-medium">{errorMessage}</p>
            <p className="mt-1">
              You can try again, or email{' '}
              <a href="mailto:contact@irpgenie.com" className="font-medium underline underline-offset-2">
                contact@irpgenie.com
              </a>{' '}
              directly.
            </p>
          </div>
        )}
      </div>
    </form>
  )
}
