import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal-page-layout'
import { SITE_NAME, LEGAL_PAGES_LAST_UPDATED } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Beta & AI Disclaimer',
  description: `What ${SITE_NAME}'s public beta, AI Tutor, Practice Lab, and SQL Console are -- and are not.`,
  alternates: { canonical: '/disclaimer' },
}

/**
 * Combined Beta + AI + Practice Lab/SQL Console disclaimer (PR #144).
 * Consolidates language already established and shipped elsewhere in the
 * product -- the landing page's AI-guidance callout, lib/ai/system-prompt.ts,
 * and every Practice Lab/SQL Console page's SimulatorNotice -- into one
 * dedicated, always-linked page, rather than inventing new claims. NOT
 * formal legal advice.
 */
export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Beta & AI Disclaimer" lastUpdated={LEGAL_PAGES_LAST_UPDATED}>
      <p>
        {SITE_NAME} is in <strong>public beta</strong>. This page explains, plainly, what that
        means and what the AI Tutor, Practice Lab, and SQL Console are -- and are not.
      </p>

      <h2>Public beta</h2>
      <p>
        Expect bugs, incomplete features, and content that&apos;s still expanding. The 5250-style
        Practice Lab and ACS-style SQL Practice Console each currently ship with only some of
        their planned exercises available; the rest are clearly marked &ldquo;Coming
        next&rdquo; rather than hidden. Features may change or be temporarily unavailable during
        this period.
      </p>

      <h2>AI Tutor may make mistakes</h2>
      <p>
        The AI Tutor gives educational guidance based on an AI language model plus this
        platform&apos;s own lesson content. It can be wrong, incomplete, or out of date.{' '}
        <strong>
          Always verify anything important -- especially for production systems -- against
          official IBM documentation or an experienced IBM i professional.
        </strong>{' '}
        The AI Tutor cannot connect to a real IBM i system, execute code, or verify production
        behavior, and it never claims otherwise.
      </p>
      <p>
        Do not paste private source code, credentials, sensitive job logs, or customer/production
        data into the AI Tutor.
      </p>

      <h2>The Practice Lab is a guided simulator, not a real system</h2>
      <p>The 5250 Command Practice module:</p>
      <ul>
        <li>Is <strong>not</strong> a real 5250 emulator and does <strong>not</strong> implement the TN5250 protocol.</li>
        <li>Is <strong>not</strong> a live IBM i terminal or session.</li>
        <li>
          Runs a small, finite set of supported commands against fixed, fabricated training data --
          fictional libraries, objects, jobs, and spool files that never existed on any real system.
        </li>
        <li>Never executes a command against, or connects to, any real IBM i system.</li>
      </ul>

      <h2>The SQL Console is ACS-style, not ACS</h2>
      <p>The SQL Practice Console:</p>
      <ul>
        <li>Is inspired by IBM Access Client Solutions&apos; &ldquo;Run SQL Scripts&rdquo; interface, but is <strong>not</strong> ACS and is <strong>not</strong> a clone of it.</li>
        <li>Runs only against a small, fixed sample schema (fabricated customer/order data) -- never a real database.</li>
        <li>Validates SQL by pattern-matching against a finite set of expected forms, not by executing arbitrary SQL.</li>
        <li>Never connects to a real IBM i system, Db2 for i database, or production environment.</li>
      </ul>

      <h2>No real credentials, commands, jobs, locks, or production systems</h2>
      <p>
        Nothing in {SITE_NAME} -- the AI Tutor, the 5250 Practice Lab, or the SQL Console --
        handles real IBM i credentials or connection settings, executes a real command or SQL
        statement against a live system, or reads/writes real jobs, spool files, object locks, or
        production data. Everything simulated is simulated in-memory, using fabricated data, for
        the duration of your session only.
      </p>

      <h2>No official IBM affiliation</h2>
      <p>
        {SITE_NAME} is an independent educational platform. &ldquo;IBM i&rdquo;, &ldquo;AS400&rdquo;,
        &ldquo;5250&rdquo;, and &ldquo;Db2 for i&rdquo; are used throughout this platform strictly
        as educational/technical reference terms describing the systems and concepts being taught
        -- not as a claim of official IBM affiliation, sponsorship, certification, or endorsement,
        unless explicitly stated otherwise.
      </p>

      <h2>No job or certification guarantees</h2>
      <p>
        Completing lessons, practice questions, or Practice Lab exercises does not guarantee any
        job, certification, salary, or career outcome. {SITE_NAME} is a learning tool, not a
        certification body or placement service.
      </p>
    </LegalPageLayout>
  )
}
