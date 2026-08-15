/**
 * Homepage Hierarchy and Signed-Out Feature Discovery -- regression pass for
 * the signed-out protected-feature previews (AI Tutor, Practice, Practice
 * Lab) and the contextual auth messaging / `next` redirect-safety work that
 * goes with them. Standalone via `tsx`, no test framework dependency --
 * matches the existing scripts/*-regression.ts style.
 *
 * Two kinds of checks:
 *  - Real function execution against the pure, dependency-free modules
 *    (lib/auth-redirect.ts's safeInternalPath, lib/auth-destination-content.ts's
 *    authCopyFor) -- these are exactly the functions that stand between a
 *    crafted `?next=` value and an open redirect, so they're worth running
 *    directly rather than only pattern-matching source text.
 *  - Source-text checks for the three page files and the auth pages,
 *    confirming the shared preview shell is actually reused (not
 *    copy-pasted per page) and that the authenticated branch of each page
 *    still renders the real, unmodified protected UI.
 *
 * Usage:
 *   npm run test:protected-preview
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { safeInternalPath } from '../lib/auth-redirect'
import { authCopyFor } from '../lib/auth-destination-content'

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

/**
 * Slices out just one function's source, from its declaration up to (but not
 * including) the next given marker -- e.g. isolating a preview component's
 * body from the real page component defined right after it in the same
 * file. Substring slicing rather than a regex spanning both functions,
 * which would otherwise match through into the second function entirely
 * (a `[\s\S]*?<X` search still scans forward past the first function's own
 * closing brace looking for the nearest `<X` anywhere in the rest of the
 * file).
 */
function sliceBetween(src: string, startMarker: string, endMarker: string): string {
  const start = src.indexOf(startMarker)
  const end = src.indexOf(endMarker, start)
  if (start === -1 || end === -1) return ''
  return src.slice(start, end)
}

async function main() {
  // ---------------------------------------------------------------------------
  section('1. safeInternalPath rejects everything an open redirect needs')
  // ---------------------------------------------------------------------------

  {
    check('accepts a plain internal path', safeInternalPath('/practice-lab', '/') === '/practice-lab')
    check('accepts an internal path with a sub-route', safeInternalPath('/practice-lab/5250', '/') === '/practice-lab/5250')
    check('rejects an absolute external URL', safeInternalPath('https://evil.com', '/') === '/')
    check('rejects a scheme-relative URL', safeInternalPath('//evil.com', '/') === '/')
    check('rejects a backslash variant of scheme-relative', safeInternalPath('/\\evil.com', '/') === '/')
    check('rejects a bare host with no leading slash', safeInternalPath('evil.com', '/') === '/')
    check('rejects a javascript: scheme smuggled after a slash', safeInternalPath('/javascript:alert(1)', '/') === '/')
    check('rejects null/undefined/empty, falling back to the given default', [null, undefined, ''].every((v) => safeInternalPath(v, '/practice') === '/practice'))
  }

  // ---------------------------------------------------------------------------
  section('2. authCopyFor maps known destinations without ever echoing raw input')
  // ---------------------------------------------------------------------------

  {
    check('maps /ai-tutor to AI Tutor copy', authCopyFor('/ai-tutor')?.feature === 'the AI Tutor')
    check('maps /practice to Practice copy', authCopyFor('/practice')?.feature === 'Practice')
    check('maps /practice-lab to Practice Lab copy', authCopyFor('/practice-lab')?.feature === 'the Practice Lab')
    check('maps /dashboard to Dashboard copy', authCopyFor('/dashboard')?.feature === 'your learning dashboard')
    check('maps a Practice Lab sub-route to the same Practice Lab copy', authCopyFor('/practice-lab/5250')?.feature === 'the Practice Lab')
    check('maps a Dashboard sub-route to the same Dashboard copy', authCopyFor('/dashboard/achievements')?.feature === 'your learning dashboard')
    check('returns null for an unrecognized internal path (falls back to generic copy)', authCopyFor('/profile') === null)
    check('returns null for the root path (falls back to generic copy)', authCopyFor('/') === null)
    check(
      'every known destination heading is a fixed string, never built from the input path',
      Object.values({
        aiTutor: authCopyFor('/ai-tutor'),
        practice: authCopyFor('/practice'),
        practiceLab: authCopyFor('/practice-lab'),
        dashboard: authCopyFor('/dashboard'),
      }).every((copy) => copy && !copy.loginHeading.includes('/') && !copy.signupHeading.includes('/'))
    )
  }

  // ---------------------------------------------------------------------------
  section('3. login()/signUp()/saveOnboardingResponse() validate `next` before redirecting')
  // ---------------------------------------------------------------------------

  {
    const authActionsSrc = readRepoFile('lib/actions/auth.ts')
    check(
      "signUp() reads `next` through safeInternalPath, not a raw formData cast",
      /const next = safeInternalPath\(formData\.get\('next'\) as string \| null, '\/'\)/.test(authActionsSrc)
    )
    const nextAssignments = authActionsSrc.match(/const next = safeInternalPath\(formData\.get\('next'\)/g) ?? []
    check('both signUp() and login() validate next this way (two call sites)', nextAssignments.length === 2)
    check("login()'s final redirect uses the validated `next`, not a raw value", /redirect\(next\)/.test(authActionsSrc))
    check(
      'saveOnboardingResponse() also validates its next param before redirecting',
      /redirect\(safeInternalPath\(next, '\/'\)\)/.test(authActionsSrc)
    )
  }

  // ---------------------------------------------------------------------------
  section('4. Login/sign-up pages validate `next` and never render the raw query string')
  // ---------------------------------------------------------------------------

  {
    for (const file of ['app/auth/login/page.tsx', 'app/auth/sign-up/page.tsx']) {
      const src = readRepoFile(file)
      check(`${file} runs its \`next\` searchParam through safeInternalPath`, /safeInternalPath\(rawNext, '\/'\)/.test(src))
      check(`${file} looks up contextual copy via authCopyFor(next), not from raw input`, /authCopyFor\(next\)/.test(src))
      check(`${file} falls back to generic copy when no destination match is found`, /destinationCopy\?\./.test(src) && /\?\?/.test(src))
      check(`${file} never interpolates the raw query value directly into a heading/description`, !/searchParams\.next/.test(src))
    }
  }

  // ---------------------------------------------------------------------------
  section('5. AI Tutor / Practice / Practice Lab: shared preview shell is reused, not copy-pasted')
  // ---------------------------------------------------------------------------

  {
    const files = [
      'app/(authenticated)/ai-tutor/page.tsx',
      'app/(authenticated)/practice/page.tsx',
      'app/(authenticated)/practice-lab/page.tsx',
    ]
    for (const file of files) {
      const src = readRepoFile(file)
      check(`${file} imports the shared FeaturePreviewShell`, /from '@\/components\/feature-preview\/feature-preview-shell'/.test(src))
      check(`${file} imports the shared PreviewAuthCta`, /from '@\/components\/feature-preview\/preview-auth-cta'/.test(src))
      check(`${file} no longer redirects an unauthenticated visitor to login`, !/if \(!user\) \{\s*redirect\(/.test(src))
    }

    const shellSrc = readRepoFile('components/feature-preview/feature-preview-shell.tsx')
    check('FeaturePreviewShell is defined exactly once', (shellSrc.match(/export function FeaturePreviewShell/g) ?? []).length === 1)
    check('FeaturePreviewShell is a server component (no "use client")', !shellSrc.includes("'use client'"))
  }

  // ---------------------------------------------------------------------------
  section('6. Authenticated branch still renders the real, unmodified protected UI')
  // ---------------------------------------------------------------------------

  {
    const aiTutorSrc = readRepoFile('app/(authenticated)/ai-tutor/page.tsx')
    const aiTutorPreviewBody = sliceBetween(aiTutorSrc, 'function AiTutorPreview', 'export default async function AiTutorPage')
    check('AI Tutor still renders <AiTutorChat> for a signed-in user', aiTutorSrc.includes('<AiTutorChat'))
    check(
      'AI Tutor preview body renders no <AiTutorChat> (no real tutor UI before auth)',
      aiTutorPreviewBody.length > 0 && !aiTutorPreviewBody.includes('<AiTutorChat')
    )

    const practiceSrc = readRepoFile('app/(authenticated)/practice/page.tsx')
    const practicePreviewBody = sliceBetween(practiceSrc, 'function PracticePreview', 'export default async function PracticePage')
    check('Practice still renders <PracticeBrowser> for a signed-in user', practiceSrc.includes('<PracticeBrowser'))
    check(
      'Practice preview body renders no <PracticeBrowser> (no real question data before auth)',
      practicePreviewBody.length > 0 && !practicePreviewBody.includes('<PracticeBrowser')
    )

    const practiceLabSrc = readRepoFile('app/(authenticated)/practice-lab/page.tsx')
    check(
      'Practice Lab still links to the real /practice-lab/5250 and /practice-lab/sql module routes for a signed-in user',
      practiceLabSrc.includes('href="/practice-lab/5250"') && practiceLabSrc.includes('href="/practice-lab/sql"')
    )
  }

  // ---------------------------------------------------------------------------
  section('7. Preview CTAs preserve the intended destination via a validated `next`')
  // ---------------------------------------------------------------------------

  {
    check('AI Tutor preview CTA targets /ai-tutor', readRepoFile('app/(authenticated)/ai-tutor/page.tsx').includes('<PreviewAuthCta next="/ai-tutor"'))
    check('Practice preview CTA targets /practice', readRepoFile('app/(authenticated)/practice/page.tsx').includes('<PreviewAuthCta next="/practice"'))
    check('Practice Lab preview CTA targets /practice-lab', readRepoFile('app/(authenticated)/practice-lab/page.tsx').includes('<PreviewAuthCta next="/practice-lab"'))

    const ctaSrc = readRepoFile('components/feature-preview/preview-auth-cta.tsx')
    check('PreviewAuthCta encodes `next` before composing the URL', ctaSrc.includes('encodeURIComponent(next)'))
    check('PreviewAuthCta links to both /auth/login and /auth/sign-up', ctaSrc.includes("/auth/login?next=") && ctaSrc.includes("/auth/sign-up?next="))
  }

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Protected-feature preview regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Protected-feature preview regression FAILED.')
    process.exit(1)
  }
  console.log('Protected-feature preview regression passed.')
}

main().catch((err) => {
  console.error('Protected-feature preview regression script crashed:', err)
  process.exit(1)
})
