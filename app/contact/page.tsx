import type { Metadata } from 'next'
import { LifeBuoy, MessageCircle, ShieldAlert, User } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'
import { ContactForm } from '@/components/contact-form'
import { SITE_NAME, SUPPORT_EMAIL, CONTACT_EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${SITE_NAME} for support, feedback, or general questions about IBM i, RPGLE, and SQL learning.`,
  alternates: { canonical: '/contact' },
}

/**
 * Contact page (PR #148). No backend: no server action, API route, or
 * database table -- the two contact cards are plain mailto: links, and the
 * optional form (components/contact-form.tsx) just composes a mailto: URL
 * client-side. If either email constant is ever unset, its card/section is
 * omitted rather than showing a broken mailto: link.
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* -- Hero --------------------------------------------------------- */}
        <section className="bg-slate-50 border-b border-slate-100 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Contact {SITE_NAME}
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
              Have feedback, questions, or suggestions for improving IBM&nbsp;i, RPGLE, SQL, or
              Practice Lab learning? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 space-y-12">
          {/* -- Contact cards ---------------------------------------------- */}
          <div className="grid sm:grid-cols-2 gap-6">
            {SUPPORT_EMAIL && (
              <Card className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <LifeBuoy className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-slate-900 mb-1">Support</h2>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline mb-3"
                >
                  {SUPPORT_EMAIL}
                </a>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">Use for</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>Login or account help</li>
                  <li>Bugs and technical issues</li>
                  <li>AI Tutor issues</li>
                  <li>Practice Lab issues</li>
                </ul>
              </Card>
            )}

            {CONTACT_EMAIL && (
              <Card variant="ai" className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-slate-900 mb-1">General Contact</h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="block text-sm font-medium text-cyan-700 hover:text-cyan-900 hover:underline mb-3"
                >
                  {CONTACT_EMAIL}
                </a>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">Use for</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>Feedback</li>
                  <li>Content suggestions</li>
                  <li>Collaboration</li>
                  <li>General questions</li>
                </ul>
              </Card>
            )}
          </div>

          {/* -- Founder & Author ---------------------------------------------
              PR #150. No photo placeholder -- Product Owner asked for one
              only once a real image is provided. */}
          <Card className="p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Founder &amp; Author
                </p>
                <h2 className="text-lg font-semibold text-slate-900">Vikash Choudhary</h2>
                <p className="text-sm text-slate-500">Senior IBM i (AS/400) Consultant</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>Hi, I&apos;m Vikash Choudhary, the founder of iRPGenie.com.</p>
              <p>
                I work as a Senior IBM&nbsp;i (AS/400) Consultant and have been passionate about
                IBM&nbsp;i technologies for many years. Throughout my career, I&apos;ve enjoyed
                solving complex technical challenges, mentoring developers, and continuously
                learning new technologies.
              </p>
              <p>
                I created iRPGenie with a simple vision -- to build a modern, AI-powered platform
                where anyone can learn IBM&nbsp;i, RPG, CL, SQL, and related technologies in a
                practical, interactive, and enjoyable way.
              </p>
              <p>
                Whether you&apos;re a beginner taking your first steps or an experienced
                professional sharpening your skills, I hope iRPGenie becomes a valuable companion
                in your learning journey.
              </p>
              <p>Thank you for visiting and being part of this growing community. Happy learning!</p>
            </div>
          </Card>

          {/* -- Safety note -------------------------------------------------- */}
          <Card className="flex items-start gap-3 border-amber-100 bg-amber-50 p-6">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm text-amber-900 leading-relaxed">
              Please do not send passwords, IBM&nbsp;i credentials, production system details,
              client confidential data, private source code, or secrets through email.
            </p>
          </Card>

          {/* -- Optional mailto-composing form -------------------------------- */}
          {CONTACT_EMAIL && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Send a message</h2>
              <p className="text-sm text-slate-500 mb-6">
                Prefer not to copy an email address by hand? Fill this in and it opens your email
                app with everything pre-filled -- nothing here is sent or stored by {SITE_NAME}
                itself.
              </p>
              <ContactForm toEmail={CONTACT_EMAIL} />
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
