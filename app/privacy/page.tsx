import Link from 'next/link'
import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal-page-layout'
import { SITE_NAME, SUPPORT_EMAIL, LEGAL_PAGES_LAST_UPDATED } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE_NAME} collects, uses, and protects your information during public beta.`,
  alternates: { canonical: '/privacy' },
}

/**
 * Plain-language public-beta Privacy Policy (PR #144, following the trust-
 * page requirements in planning/PUBLIC_BETA_READINESS_AUDIT.md Section 4).
 *
 * NOT formal legal advice -- see the notice at the top of the page. Every
 * data-practice claim below was checked against the actual Supabase schema
 * (supabase/migrations/001-003) before writing it, rather than assumed:
 * user_profiles (onboarding response only), lesson_completions (which
 * lessons, when), ai_tutor_feedback and ai_usage_log (both explicitly
 * comment "Neither table stores prompt text, response text, or
 * conversation content" -- migrations/003_ai_tutor_feedback_and_usage.sql).
 * Practice question answers and Practice Lab/SQL Console state are not
 * persisted anywhere server-side -- confirmed by the absence of any table
 * for them, not assumed. The Contact form claims (PR #201) were checked the
 * same way against supabase/migrations/012_contact_form_submissions.sql and
 * lib/contact-email-template.ts: that table stores only a hashed IP and
 * submission status/outcome, never name/email/subject/message content,
 * which instead goes to Resend as the email itself.
 */
export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LEGAL_PAGES_LAST_UPDATED}>
      <p>
        <strong>This is a plain-language policy for {SITE_NAME}&apos;s public beta.</strong> It is
        not formal legal advice, and it is written to be genuinely readable rather than exhaustive.
        This policy will be reviewed and formalized (with legal review, if required) before any
        wider commercial launch.
      </p>

      <h2>What {SITE_NAME} is</h2>
      <p>
        {SITE_NAME} is an AI-powered IBM i learning platform: structured lessons, practice
        questions, an AI Tutor, a 5250-style Practice Lab, and an ACS-style SQL Practice Console.
        It is currently in <strong>public beta</strong>.
      </p>

      <h2>Account and login data</h2>
      <p>
        Creating an account uses Supabase Auth, a third-party authentication service. We store
        your email address and an authentication session; your password itself is handled and
        hashed by Supabase, not stored by us in plain text. If you answer the optional onboarding
        question ("I am new to IBM i...", etc.), that response is stored against your account so
        the dashboard can personalize its copy for you.
      </p>

      <h2>Learning progress data</h2>
      <p>
        When you mark a lesson complete, we store which lesson and when, tied to your account, so
        your progress persists across sessions and devices.
      </p>

      <h2>Practice question activity</h2>
      <p>
        Practice questions (answer selection, reveal state) are <strong>not saved anywhere</strong>{' '}
        -- there is no score, ranking, or history stored for them. They exist only in your
        browser while you&apos;re using the page.
      </p>

      <h2>AI Tutor usage</h2>
      <p>
        When you ask the AI Tutor a question, your message and relevant course context are sent to
        Anthropic (our AI model provider) to generate a response -- this is necessary for the AI
        Tutor to work at all. We do <strong>not</strong> store the text of your questions or the
        AI Tutor&apos;s responses in our own database. We do store, per response: which model
        answered, a token-usage count (for cost/reliability monitoring), whether the request
        succeeded, and -- only if you click it -- a simple &ldquo;Helpful&rdquo; /
        &ldquo;Not helpful&rdquo; rating. None of this includes the actual conversation content.
      </p>
      <p>
        <strong>Do not enter secrets, credentials, private production data, customer data, or
        confidential job logs/source code into the AI Tutor</strong> -- see the{' '}
        <Link href="/disclaimer">Beta &amp; AI Disclaimer</Link> for why.
      </p>

      <h2>Practice Lab and SQL Console activity</h2>
      <p>
        The 5250-style Practice Lab and ACS-style SQL Practice Console run entirely against
        simulated, fabricated sample data in your browser. Nothing you type there -- commands,
        SQL, exercise progress -- is saved to our servers.
      </p>

      <h2>Contact form</h2>
      <p>
        The &ldquo;Send a message&rdquo; form on the <Link href="/contact">Contact page</Link>{' '}
        sends your name, email address, subject, and message to <strong>Resend</strong>, our
        transactional email provider, which delivers it as an email to our contact inbox. We use
        this information only to review and respond to your message. We do not store the content
        of your submission in our own database -- it exists only as that email, subject to the
        retention of that inbox and of Resend. Your reply-to address is used only so we can
        respond to you; the form does not add you to any mailing list or marketing communications.
      </p>
      <p>
        To prevent abuse of this public form, our servers also retain a one-way cryptographic hash
        of the sending IP address (never the IP address itself) alongside the submission&apos;s
        status, used only for spam and rate-limiting and never linked to your message content.
      </p>
      <p>
        <strong>Do not send passwords, IBM&nbsp;i credentials, production system details, client
        confidential data, private source code, or other secrets through the contact form</strong>{' '}
        -- the same guidance as the AI Tutor above.
      </p>

      <h2>Basic technical logs</h2>
      <p>
        Our hosting provider (Vercel) and database provider (Supabase) generate standard
        infrastructure-level logs (e.g. request timing, error rates) as part of operating the
        service.
      </p>

      <h2>Analytics</h2>
      <p>
        {SITE_NAME} uses <strong>Google Analytics</strong> to understand how the site is used --
        which pages get visited, roughly how many people are using the site, and which content is
        useful -- so we can improve the learning content and overall experience. Google Analytics
        may collect information such as the pages you visit, general device and browser
        information, approximate location (typically city/region level, derived from IP address,
        not precise GPS location), and basic interaction events (e.g. clicks, scrolling).
      </p>
      <p>
        We do <strong>not</strong> use Google Analytics (or anything else) to collect IBM i
        credentials, production system data, source code, job logs, or any content you type into
        the AI Tutor, Practice Lab, or SQL Console -- analytics only ever sees which pages you
        visit and basic technical/interaction information, never the content of what you&apos;re
        learning or working on. We have not enabled advertising, remarketing, or cross-site ad
        tracking features in Google Analytics, and we do not send it your name, email, or any
        other directly identifying account information.
      </p>
      <p>
        You can control or opt out of analytics tracking through your browser&apos;s cookie/privacy
        settings, browser extensions that block analytics scripts, or Google&apos;s own tools (e.g.
        the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics Opt-out Browser Add-on
        </a>
        ).
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We use essential cookies for authentication and session management (via Supabase Auth) --
        these are required for the site to know you&apos;re logged in. Google Analytics also sets
        its own cookies to distinguish visitors and sessions for the usage statistics described
        above. We do not use advertising or cross-site ad-tracking cookies.
      </p>

      <h2>Third-party services we use</h2>
      <ul>
        <li><strong>Supabase</strong> -- authentication and database hosting.</li>
        <li><strong>Vercel</strong> -- application hosting and deployment.</li>
        <li><strong>Anthropic</strong> -- the AI model provider behind the AI Tutor.</li>
        <li><strong>Resend</strong> -- delivers email sent through the Contact page&apos;s form.</li>
        <li><strong>Google Analytics</strong> -- website usage statistics, described above.</li>
      </ul>
      <p>Each provider only receives the minimum data needed to perform its role, described above.</p>

      <h2>Your responsibility</h2>
      <p>
        Please do not enter secrets, credentials, private production data, or confidential client
        or customer information anywhere in {SITE_NAME} -- including the AI Tutor, Practice Lab,
        or SQL Console. None of these are designed or intended to handle sensitive data.
      </p>

      <h2>Data deletion</h2>
      <p>
        During beta, account/data deletion is handled manually on request rather than through a
        self-service control in the product yet.{' '}
        {SUPPORT_EMAIL ? (
          <>Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to request it.</>
        ) : (
          'Contact details for this will be added before wider launch.'
        )}
      </p>

      <h2>Beta status</h2>
      <p>
        {SITE_NAME} is in public beta. Features, data practices, and this policy may change as the
        product evolves -- we&apos;ll update this page when they do.
      </p>

      <h2>Contact</h2>
      <p>
        {SUPPORT_EMAIL ? (
          <>Questions about this policy? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, or visit the{' '}
          <Link href="/contact">Contact page</Link>.</>
        ) : (
          'Contact details will be added before wider launch.'
        )}
      </p>
    </LegalPageLayout>
  )
}
