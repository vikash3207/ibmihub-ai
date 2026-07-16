'use client'

import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactFormProps {
  /** Where the composed mailto: link is sent -- always contact@irpgenie.com today, passed in rather than imported so this component has no config-file coupling. */
  toEmail: string
}

/**
 * Contact-page form (PR #148). Deliberately has no backend: there is no
 * server action, API route, or database table behind it. Submitting just
 * builds a `mailto:` URL from the fields (via encodeURIComponent) and
 * navigates to it, which hands off to the visitor's own configured email
 * app -- the same trust boundary as the plain mailto links elsewhere on
 * this page, just pre-filled.
 */
export function ContactForm({ toEmail }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const bodyLines = [
      message.trim(),
      '',
      '---',
      `From: ${name.trim() || '(not provided)'}`,
      `Reply-to email: ${email.trim() || '(not provided)'}`,
    ]
    const mailSubject = subject.trim() || 'Message from the iRPGenie contact page'
    const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`

    window.location.href = mailtoUrl
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary">
          <Send className="h-4 w-4" aria-hidden="true" />
          Send Email
        </Button>
        <p className="text-xs text-slate-500">This opens your email app with the message pre-filled.</p>
      </div>
    </form>
  )
}
