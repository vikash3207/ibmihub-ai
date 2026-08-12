import type { Metadata } from 'next'
import { LifeBuoy, Mail, MessageCircle, PenSquare, ShieldAlert, User } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'
import { ContactForm } from '@/components/contact-form'
import { PublicBetaNotice } from '@/components/public-beta-notice'
import { SectionHero } from '@/components/section-hero'
import { CONTACT_HERO_THEME } from '@/lib/section-theme'
import { SITE_NAME, SUPPORT_EMAIL, CONTACT_EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${SITE_NAME} for support, feedback, or general questions about IBM i, RPGLE, and SQL learning.`,
  alternates: { canonical: '/contact' },
}

/**
 * Contact page (PR #148; form backed by Resend as of PR #201). The two
 * contact cards remain plain mailto: links -- if either email constant is
 * ever unset, its card/section is omitted rather than showing a broken
 * mailto: link. The "Send a message" form (components/contact-form.tsx)
 * submits to app/api/contact/route.ts, which sends via Resend server-side;
 * it no longer depends on the visitor having a local email app configured.
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <SectionHero
          icon={Mail}
          badgeLabel="We read every message"
          title={`Contact ${SITE_NAME}`}
          accentWord={SITE_NAME}
          description="Have feedback, questions, or suggestions for improving IBM&nbsp;i, RPGLE, SQL, or Practice Lab learning? We'd love to hear from you."
          theme={CONTACT_HERO_THEME}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 -mt-6 sm:-mt-8 pb-16 sm:pb-20 space-y-12">
          <PublicBetaNotice compact />

          {/* -- Contact cards ---------------------------------------------- */}
          <div className="grid sm:grid-cols-2 gap-6">
            {SUPPORT_EMAIL && (
              <Card className="group p-6 border-t-4 border-t-blue-600 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <LifeBuoy className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-slate-900 mb-1">Support</h2>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="block text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 rounded"
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
              <Card variant="ai" className="group p-6 border-t-4 border-t-cyan-500 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-slate-900 mb-1">General Contact</h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="block text-sm font-semibold text-cyan-800 hover:text-cyan-950 hover:underline mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-1 rounded"
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
              PR #150 added this section; PR #151 gives it a stronger,
              more personal visual treatment (gradient wash, accent border,
              a richer avatar ring) per Product Owner feedback that it felt
              plain. No photo placeholder -- add one only once a real image
              is provided. */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/40 p-6 shadow-md sm:p-8">
            <div
              className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-200/30 blur-[70px]"
              aria-hidden="true"
            />
            <div className="relative mb-6 flex items-center gap-5">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md ring-4 ring-white">
                <User className="h-8 w-8" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Founder &amp; Author</p>
                <h2 className="text-xl font-bold text-slate-900">Vikash Choudhary</h2>
                <p className="text-sm text-slate-500">Senior IBM i (AS/400) Consultant</p>
              </div>
            </div>
            <div className="relative space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>Hi, I&apos;m Vikash Choudhary, the founder of iRPGenie.com.</p>
              <p>
                I work as a Senior IBM&nbsp;i (AS/400) Consultant and have been passionate about
                IBM&nbsp;i technologies for many years. Throughout my career, I&apos;ve enjoyed
                solving complex technical challenges, mentoring developers, and continuously
                learning new technologies.
              </p>
              <p>
                I created iRPGenie with a simple vision — to build a modern, AI-powered platform
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
          </div>

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
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-blue-600 text-white">
                  <PenSquare className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold text-slate-900">Send a message</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Send your feedback, question, or suggestion directly to {SITE_NAME}. We&apos;ll use
                your details only to review and respond to your message.
              </p>
              <ContactForm />
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
