/**
 * Homepage Hierarchy and Signed-Out Feature Discovery -- regression pass for
 * the homepage restructure specifically. Standalone via `tsx`, no test
 * framework dependency -- matches the existing scripts/*-regression.ts style
 * (check/section helpers, pass/fail counter, process.exit(1) on failure).
 *
 * Source-text checks only (no rendering) -- same approach
 * scripts/site-navigation-regression.ts already uses for this repo's
 * server components. Covers: the old confusing "Choose your path" section is
 * gone and replaced by the three goal-based journeys, the detailed roadmap
 * and the duplicate Audience/large-Contact sections are gone, every required
 * capability is still represented exactly once, and the homepage no longer
 * performs its own now-unnecessary getUser() call.
 *
 * Usage:
 *   npm run test:homepage
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

let failures = 0
let passed = 0

function check(description: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1
    console.log(`  OK    ${description}`)
  } else {
    failures += 1
    console.error(`  FAIL  ${description}${detail ? ` -- ${detail}` : ''}`)
  }
}

function section(title: string) {
  console.log(`\n${title}`)
}

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf-8')
}

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1
}

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

async function main() {
  const page = readRepoFile('app/page.tsx')
  // Occurrence counts below check rendered content, not this file's own
  // doc comments (which legitimately reference removed/renamed sections by
  // name while explaining the change) -- see lib/section-theme.ts's own
  // themeCodeOnly precedent for the same distinction.
  const pageCodeOnly = stripComments(page)

  // ---------------------------------------------------------------------------
  section('1. Hero and final CTA are untouched')
  // ---------------------------------------------------------------------------

  {
    check('hero headline is unchanged', page.includes('The AI-powered learning platform for IBM&nbsp;i professionals.'))
    check('hero product-preview panel (progress tracking mock) is unchanged', page.includes('Path progress') && page.includes('Mark Complete'))
    check('final CTA heading is unchanged', page.includes('Start learning IBM&nbsp;i today.'))
    check('final CTA still links to /learn with PRIMARY_CTA_LABEL', /href="\/learn" className=\{buttonVariants\(\{ variant: 'primary', size: 'lg' \}\)\}>\s*\{PRIMARY_CTA_LABEL\}/.test(page))
  }

  // ---------------------------------------------------------------------------
  section('2. Old "Choose your path" / Audience / Roadmap sections are gone')
  // ---------------------------------------------------------------------------

  {
    check('the old "Choose your path" heading is gone', !page.includes('Choose your path'))
    check('Foundations and Advanced no longer appear as two separate cards to the same /learn destination', !page.includes('>Advanced<'))
    check('the old "Why iRPGenie?" Audience section heading is gone', !page.includes('Why iRPGenie?'))
    check('the old "IBM i Beginners" audience card heading is gone', !page.includes('IBM i Beginners'))
    check('the old "Working IBM i Developers" audience card heading is gone', !page.includes('Working IBM i Developers'))
    check('the detailed roadmap heading is gone', !page.includes('Professional-grade content is coming next'))
    check('the roadmap item list (ROADMAP_ITEMS) is gone', !page.includes('ROADMAP_ITEMS'))
    check('the old two-email-card Contact section heading is gone', !page.includes('>General Contact<'))
  }

  // ---------------------------------------------------------------------------
  section('3. New "Choose your learning journey" section: three goal-based cards')
  // ---------------------------------------------------------------------------

  {
    check('new journeys heading is present', page.includes('Choose your learning journey'))
    check('Journey 1 ("New to IBM i") is present', page.includes('New to IBM&nbsp;i'))
    check('Journey 1 CTA links to Lesson 1', page.includes('href="/learn/ibm-i-fundamentals/what-is-ibm-i"'))
    check('Journey 1 secondary CTA links to the Learning Center', page.includes('Browse the Learning Center'))
    check('Journey 2 ("Already working with IBM i") is present', page.includes('Already working with IBM&nbsp;i'))
    check('Journey 2 links to Deep Dives', /href="\/deep-dives"[\s\S]{0,700}Deep Dives/.test(page))
    check('Journey 2 links to IBM i Insights', /href="\/insights"[\s\S]{0,700}IBM i Insights/.test(page))
    check(
      'Journey 2 gives Deep Dives and Insights distinct descriptions (not implying they are the same content type)',
      page.includes('Reference-grade, non-linear topic guides') && page.includes('Practical articles on modernization ideas')
    )
    check('Journey 3 ("Want hands-on practice") is present', page.includes('Want hands-on practice?'))
    check('Journey 3 states these are simulations, not a real IBM i system', page.includes('not a connection to a real IBM&nbsp;i system'))
    check('Journey 3 CTA links to the public Practice experience', page.includes('href="/practice"') && page.includes('Explore Practice'))
    check('AI Tutor is framed as cross-journey, not a fourth journey card', page.includes('AI Tutor works alongside every path above'))
  }

  // ---------------------------------------------------------------------------
  section('4. Contact section is now compact, linking to the dedicated /contact page')
  // ---------------------------------------------------------------------------

  {
    check('a compact contact CTA is present', page.includes('Have feedback or a question?'))
    check('it links to /contact', /href="\/contact"[\s\S]{0,200}Contact us/.test(page))
    check('SUPPORT_EMAIL/CONTACT_EMAIL are no longer imported into the homepage (no duplicated email content)', !/SUPPORT_EMAIL|CONTACT_EMAIL/.test(page))
  }

  // ---------------------------------------------------------------------------
  section('5. Every required capability is represented exactly once')
  // ---------------------------------------------------------------------------

  {
    // "Exactly once" is checked against the *heading/label* occurrence for
    // capabilities that get a dedicated section, not every incidental
    // mention -- e.g. "AI Tutor" legitimately appears in the journeys strip
    // AND its own showcase section by design (a cross-journey capability
    // gets named where it's relevant, not confined to one spot).
    check('Structured curriculum is covered (IBM i Fundamentals highlight section)', page.includes('IBM i Fundamentals') && page.includes('Explore the Learning Center'))
    check('Deep Dives is covered exactly once as a section/card', countOccurrences(pageCodeOnly, 'Deep Dives') === 1)
    check('IBM i Insights is covered exactly once as a section/card', countOccurrences(pageCodeOnly, 'IBM i Insights') === 1)
    check('AI Tutor showcase section (cross-journey) is present', page.includes('Ask IBM&nbsp;i questions, get IBM&nbsp;i-specific answers'))
    check('Progress tracking is represented via the hero product-preview panel', page.includes('Path progress'))
    check('5250-style Practice Lab is mentioned', page.includes('5250-style'))
    check('ACS-style SQL Console is mentioned', page.includes('SQL Console') || page.includes('ACS-style SQL'))
    // IBM i Practice Hub: Journey 3's body copy broadened from "practice
    // questions" specifically to cover guided practice, quick quizzes, and
    // interview preparation -- the hub is no longer just a question browser.
    check('Guided practice is mentioned', page.includes('guided practice'))
    check('Quick quizzes are mentioned', page.includes('quick quizzes'))
    check('Interview preparation is mentioned', page.includes('technical interviews'))
  }

  // ---------------------------------------------------------------------------
  section('6. Homepage no longer performs its own getUser() call')
  // ---------------------------------------------------------------------------

  {
    check(
      'no auth.getUser() call on the homepage (CTAs no longer branch on auth state -- destinations own that now)',
      !page.includes('auth.getUser()')
    )
    check('no direct Supabase client import on the homepage (SiteHeader owns its own session check)', !page.includes("from '@/lib/supabase/server'"))
    check('dynamic = force-dynamic is still set (SiteHeader still reads the session)', page.includes("export const dynamic = 'force-dynamic'"))
  }

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Homepage journeys regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Homepage journeys regression FAILED.')
    process.exit(1)
  }
  console.log('Homepage journeys regression passed.')
}

main().catch((err) => {
  console.error('Homepage journeys regression script crashed:', err)
  process.exit(1)
})
