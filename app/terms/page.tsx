import Link from 'next/link'
import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal-page-layout'
import { SITE_NAME, SUPPORT_EMAIL, LEGAL_PAGES_LAST_UPDATED } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `The terms for using ${SITE_NAME} during public beta.`,
  alternates: { canonical: '/terms' },
}

/**
 * Plain-language public-beta Terms of Use (PR #144). NOT formal legal
 * advice -- see the notice at the top of the page.
 */
export default function TermsOfUsePage() {
  return (
    <LegalPageLayout title="Terms of Use" lastUpdated={LEGAL_PAGES_LAST_UPDATED}>
      <p>
        <strong>This is a plain-language terms page for {SITE_NAME}&apos;s public beta.</strong> It
        is not formal legal advice. It will be reviewed and formalized (with legal review, if
        required) before any wider commercial launch.
      </p>

      <h2>Educational use only</h2>
      <p>
        {SITE_NAME} is an educational platform for learning IBM i concepts, RPGLE, CLLE, Db2 for i,
        SQL, and related topics. It is not a certification body, and using it does not constitute
        or lead to any official IBM i, IBM, or third-party certification.
      </p>

      <h2>Public beta</h2>
      <p>
        The product is in active public beta. Features may change, be added, be removed, or
        temporarily break without advance notice. Content, lesson counts, and Practice Lab/SQL
        Console exercises are still expanding. We&apos;ll try to communicate major changes, but
        beta software should not be relied on for anything mission-critical.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Attempt to abuse, overload, or disrupt the AI Tutor or the platform generally.</li>
        <li>Attempt to extract the AI Tutor&apos;s system prompt or attack/jailbreak the underlying model.</li>
        <li>Scrape lesson content or practice content for republication elsewhere.</li>
        <li>Use an account other than your own, or share login credentials.</li>
      </ul>

      <h2>Your account</h2>
      <p>
        You&apos;re responsible for keeping your login credentials secure and for activity that
        happens under your account. Use a real, working email address so account-related
        communication (like password resets) reaches you.
      </p>

      <h2>AI Tutor</h2>
      <p>
        The AI Tutor provides educational guidance only. It is not guaranteed to be correct,
        complete, or current -- verify anything important against official IBM documentation or an
        experienced IBM i professional before relying on it, especially for production systems.
        Do not enter confidential production data, credentials, customer data, or sensitive job
        logs into the AI Tutor, lessons, Practice Lab, or SQL Console.
      </p>

      <h2>Practice Lab and SQL Console</h2>
      <p>
        The 5250-style Practice Lab and ACS-style SQL Practice Console are guided simulators built
        for learning. They do not connect to any real IBM i system, Db2 database, or production
        environment, and they never execute real commands or SQL against a real system. See the{' '}
        <Link href="/disclaimer">Beta &amp; AI Disclaimer</Link> for more detail.
      </p>

      <h2>No outcome guarantees</h2>
      <p>
        {SITE_NAME} does not guarantee any job, salary, promotion, certification, or career outcome
        as a result of using the platform. It is a tool to help you learn -- what you do with that
        learning is up to you.
      </p>

      <h2>Content is for learning and reference</h2>
      <p>
        Lessons, practice questions, and AI Tutor responses are intended as learning and reference
        material, not as a substitute for official IBM documentation, vendor support, or
        professional judgment when working on a real system.
      </p>

      <h2>Limitation of responsibility</h2>
      <p>
        {SITE_NAME} is provided &ldquo;as is&rdquo; during public beta, without warranty of any
        kind, express or implied, including accuracy, availability, or fitness for a particular
        purpose. To the fullest extent permitted by law, {SITE_NAME} and its operators are not
        liable for any loss or damage arising from your use of the platform, including decisions
        made based on lesson content or AI Tutor responses. This is deliberately broad,
        plain-language phrasing for a free educational beta -- it is not intended to override any
        consumer protections that legally cannot be waived.
      </p>

      <h2>Changes during beta</h2>
      <p>
        We may update, change, or remove features (including the Practice Lab, SQL Console, or AI
        Tutor) at any time during beta as the product develops. We may also update these Terms;
        continued use after an update means you accept the revised Terms.
      </p>

      <h2>Contact</h2>
      <p>
        {SUPPORT_EMAIL ? (
          <>Questions about these Terms? Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, or visit the{' '}
          <Link href="/contact">Contact page</Link>.</>
        ) : (
          'Contact details will be added before wider launch.'
        )}
      </p>
    </LegalPageLayout>
  )
}
