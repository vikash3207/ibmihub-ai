/**
 * Site-wide Navigation and Section Landing Page Visual Upgrade -- regression
 * pass. Standalone via `tsx`, no test framework dependency -- matches the
 * existing scripts/*-regression.ts style (check/section helpers, pass/fail
 * counter, process.exit(1) on any failure).
 *
 * This suite covers what's new in this PR specifically: the pill-row +
 * mobile navigation, the AI Tutor click-interception behavior (executed
 * against the real function, not just regex, since that's the part most
 * likely to silently regress), the shared visual primitives, and source
 * checks that the pages this PR was explicitly told not to touch (Deep Dive
 * catalog/publication status, the empty Insights catalog, Dashboard metric
 * calculations, Practice/Practice Lab auth gating) still look untouched.
 * Deeper coverage of those specific areas already lives in their own
 * suites (test:insights, test:dashboard-metrics, test:achievements, the
 * auth-* suites) -- this file adds direct, explicit checks for the specific
 * navigation/visual-system items this PR touched, without re-implementing
 * those suites.
 *
 * Imports from lib/nav-links.ts, not components/site-nav-links.tsx -- the
 * latter is a 'use client' component that transitively pulls in a
 * 'use server' action module, and Node's `server-only` package throws
 * unconditionally outside a bundler's `react-server` export condition, so a
 * plain `tsx` script importing that chain crashes before any assertion
 * runs (see lib/nav-links.ts's own header comment for the full story).
 *
 * Usage:
 *   npm run test:site-navigation
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  getNavLinks,
  handleAiTutorNavClick,
  isNavLinkActive,
  navItemClasses,
  type NavLinkDef,
} from '../lib/nav-links'

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

// Minimal mock of the fields handleAiTutorNavClick reads off a MouseEvent --
// avoids pulling in a DOM/testing-library dependency this repo doesn't have
// for a plain function that only touches these specific properties/methods.
function mockClickEvent(overrides: Partial<{
  defaultPrevented: boolean
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  button: number
}> = {}) {
  let prevented = overrides.defaultPrevented ?? false
  return {
    get defaultPrevented() {
      return prevented
    },
    metaKey: overrides.metaKey ?? false,
    ctrlKey: overrides.ctrlKey ?? false,
    shiftKey: overrides.shiftKey ?? false,
    altKey: overrides.altKey ?? false,
    button: overrides.button ?? 0,
    preventDefault() {
      prevented = true
    },
  } as unknown as Parameters<typeof handleAiTutorNavClick>[0]
}

async function main() {
  // ---------------------------------------------------------------------------
  section('1. Nav link data: every destination is preserved for both auth states')
  // ---------------------------------------------------------------------------

  {
    const loggedIn = getNavLinks(true)
    const loggedOut = getNavLinks(false)
    const loggedInHrefs = loggedIn.map((l) => l.href)
    const loggedOutHrefs = loggedOut.map((l) => l.href)

    check(
      'logged-in nav includes all seven expected destinations',
      ['/dashboard', '/learn', '/deep-dives', '/insights', '/practice', '/ai-tutor', '/contact'].every((href) =>
        loggedInHrefs.includes(href)
      ),
      loggedInHrefs.join(', ')
    )
    check(
      'logged-out nav includes all six expected destinations (Practice added -- Homepage Hierarchy and Signed-Out Feature Discovery; no Dashboard, which stays a signed-in-only feature)',
      ['/learn', '/deep-dives', '/insights', '/practice', '/ai-tutor', '/contact'].every((href) => loggedOutHrefs.includes(href)),
      loggedOutHrefs.join(', ')
    )
    check('logged-out nav omits /dashboard', !loggedOutHrefs.includes('/dashboard'))
    check(
      'logged-out nav now includes /practice (it renders a public preview instead of redirecting -- app/(authenticated)/practice/page.tsx)',
      loggedOutHrefs.includes('/practice')
    )
    check('every logged-in link has a non-empty label', loggedIn.every((l) => l.label.trim().length > 0))
    check('every nav link carries a full accent-class bundle (no dynamic/interpolated color)', [...loggedIn, ...loggedOut].every(hasFullAccent))
  }

  // ---------------------------------------------------------------------------
  section('2. Section accents are restrained: only AI Tutor is always-accented')
  // ---------------------------------------------------------------------------

  {
    const loggedIn = getNavLinks(true)
    const aiTutor = loggedIn.find((l) => l.href === '/ai-tutor')
    const others = loggedIn.filter((l) => l.href !== '/ai-tutor')

    check('AI Tutor is the one link marked alwaysAccented (a restrained, persistent cyan tint)', aiTutor?.alwaysAccented === true)
    check('no other link is alwaysAccented (default state stays neutral, not a rainbow row)', others.every((l) => !l.alwaysAccented))
    check('AI Tutor still opens the shared panel (opensAiTutorPanel)', aiTutor?.opensAiTutorPanel === true)

    // Active state must be identifiable by more than color alone: a background pill, not just text color.
    for (const link of loggedIn) {
      const activeClasses = navItemClasses(link, true)
      check(`${link.label}'s active state includes a background pill, not just text color`, /\bbg-/.test(activeClasses))
      check(`${link.label}'s active state includes bold/semibold text weight`, /font-semibold/.test(activeClasses))
    }
  }

  // ---------------------------------------------------------------------------
  section('3. isNavLinkActive() matches the exact route and its sub-routes only')
  // ---------------------------------------------------------------------------

  {
    check('exact match is active', isNavLinkActive('/deep-dives', '/deep-dives') === true)
    check('a sub-route is active', isNavLinkActive('/deep-dives/sql-on-ibm-i', '/deep-dives') === true)
    check('an unrelated route is not active', isNavLinkActive('/learn', '/deep-dives') === false)
    check(
      'a route that merely starts with the same characters (no slash boundary) is not active',
      isNavLinkActive('/deep-divesx', '/deep-dives') === false
    )
  }

  // ---------------------------------------------------------------------------
  section('4. AI Tutor click interception -- executed against the real handler')
  // ---------------------------------------------------------------------------

  {
    let openCount = 0
    const openPanel = () => {
      openCount += 1
    }

    const plainClick = mockClickEvent()
    handleAiTutorNavClick(plainClick, openPanel)
    check('a plain left click calls preventDefault()', plainClick.defaultPrevented === true)
    check('a plain left click opens the panel exactly once', openCount === 1)

    openCount = 0
    const cmdClick = mockClickEvent({ metaKey: true })
    handleAiTutorNavClick(cmdClick, openPanel)
    check('Cmd/Ctrl-click (new tab) does not call preventDefault()', cmdClick.defaultPrevented === false)
    check('Cmd/Ctrl-click does not open the panel -- the real /ai-tutor navigation proceeds', openCount === 0)

    openCount = 0
    const middleClick = mockClickEvent({ button: 1 })
    handleAiTutorNavClick(middleClick, openPanel)
    check('a non-primary-button click (e.g. middle-click) falls through untouched', middleClick.defaultPrevented === false && openCount === 0)

    openCount = 0
    const alreadyHandled = mockClickEvent({ defaultPrevented: true })
    handleAiTutorNavClick(alreadyHandled, openPanel)
    check('an already-prevented event is left alone (no double-handling)', openCount === 0)
  }

  // ---------------------------------------------------------------------------
  section('5. Desktop and mobile nav share one link/behavior source (no duplicated logic)')
  // ---------------------------------------------------------------------------

  {
    const pureNavLinksSrc = readRepoFile('lib/nav-links.ts')
    const desktopSrc = readRepoFile('components/site-nav-links.tsx')
    const mobileSrc = readRepoFile('components/site-mobile-nav.tsx')

    check("desktop nav imports its link data/handlers from lib/nav-links.ts (one source of truth)", /import\s*\{[^}]*getNavLinks[^}]*\}\s*from\s*'@\/lib\/nav-links'/.test(desktopSrc))
    check("mobile nav imports the same link data/handlers from lib/nav-links.ts", /import\s*\{[^}]*getNavLinks[^}]*\}\s*from\s*'@\/lib\/nav-links'/.test(mobileSrc))
    check('mobile nav imports the shared handleAiTutorNavClick (not a second copy of the click logic)', /import\s*\{[^}]*handleAiTutorNavClick[^}]*\}\s*from\s*'@\/lib\/nav-links'/.test(mobileSrc))
    check('the AI Tutor click-interception logic is defined exactly once, in lib/nav-links.ts', (pureNavLinksSrc.match(/function handleAiTutorNavClick/g) ?? []).length === 1)
    check('neither nav component redefines its own metaKey/ctrlKey guard', !/metaKey \|\| event\.ctrlKey/.test(desktopSrc) && !/metaKey \|\| event\.ctrlKey/.test(mobileSrc))
  }

  // ---------------------------------------------------------------------------
  section('6. Mobile navigation accessibility')
  // ---------------------------------------------------------------------------

  {
    const mobileSrc = readRepoFile('components/site-mobile-nav.tsx')

    check('the trigger is a real, keyboard-focusable <button>', /<button[\s\S]{0,120}aria-expanded=\{isOpen\}/.test(mobileSrc))
    check('the trigger reports open/closed state via aria-expanded', /aria-expanded=\{isOpen\}/.test(mobileSrc))
    check('the trigger points at the panel it controls via aria-controls', /aria-controls=\{panelId\}/.test(mobileSrc))
    check(
      'the trigger has an accessible name that changes with state ("Open menu"/"Close menu")',
      /aria-label=\{isOpen \? 'Close menu' : 'Open menu'\}/.test(mobileSrc)
    )
    check('the panel closes automatically on route change (no stale open panel over a new page)', /lastPathname/.test(mobileSrc) && /setIsOpen\(false\)/.test(mobileSrc))
    check('the panel is only rendered below the lg: breakpoint (no overlap with the desktop pill nav)', mobileSrc.includes('lg:hidden'))
    check(
      'mobile nav performs no auth/session check of its own',
      !/supabase\.auth\.getUser\(\)/.test(mobileSrc) && !/createClient\(\)/.test(mobileSrc) && !mobileSrc.includes("from '@/lib/supabase/server'")
    )
  }

  // ---------------------------------------------------------------------------
  section('7. Header: profile avatar and Log out remain present; desktop nav is gated to lg: and up')
  // ---------------------------------------------------------------------------

  {
    const headerSrc = readRepoFile('components/site-header.tsx')

    check('exactly one getUser() call in the header (no new auth/session lookup)', (headerSrc.match(/auth\.getUser\(\)/g) ?? []).length === 1)
    check('UserMenu (avatar/dropdown) is still rendered for authenticated users', headerSrc.includes('<UserMenu'))
    check("the standalone Log out control is still present", headerSrc.includes('Log out'))
    check('MobileNav is wired in alongside the desktop nav (not instead of it)', headerSrc.includes('<MobileNav'))
    check('the account-controls row only shows at lg: and up (avoids overlap with the mobile trigger)', /hidden lg:flex items-center gap-3/.test(headerSrc))
    check('the desktop pill nav is rendered via the shared SiteNavLinks component', headerSrc.includes('<SiteNavLinks'))
  }

  // ---------------------------------------------------------------------------
  section('8. Reusable visual primitives exist and are actually reused, not copy-pasted per page')
  // ---------------------------------------------------------------------------

  {
    const heroSrc = readRepoFile('components/section-hero.tsx')
    const cardSrc = readRepoFile('components/section-feature-card.tsx')
    const themeSrc = readRepoFile('lib/section-theme.ts')

    check('SectionHero is a server component (no "use client")', !heroSrc.includes("'use client'"))
    check('SectionFeatureCard is a server component (no "use client")', !cardSrc.includes("'use client'"))
    check('SectionHero decorative elements are aria-hidden', (heroSrc.match(/pointer-events-none absolute/g) ?? []).length === (heroSrc.match(/pointer-events-none absolute[\s\S]{0,200}?aria-hidden="true"/g) ?? []).length)
    check('SectionHero respects prefers-reduced-motion via the shared .section-hero-enter class', heroSrc.includes('section-hero-enter'))
    check('SectionFeatureCard hover elevation respects prefers-reduced-motion', cardSrc.includes('motion-reduce:transition-none'))

    const consumers = ['app/deep-dives/page.tsx', 'app/(authenticated)/practice-lab/page.tsx']
    for (const consumer of consumers) {
      const src = readRepoFile(consumer)
      check(`${consumer} imports the shared section-theme config rather than inlining new colors`, /from '@\/lib\/section-theme'/.test(src))
    }

    check('app/deep-dives/page.tsx uses <SectionHero>', readRepoFile('app/deep-dives/page.tsx').includes('<SectionHero'))
    check('app/deep-dives/page.tsx uses <SectionFeatureCard> (reused, not a one-off copy)', readRepoFile('app/deep-dives/page.tsx').includes('<SectionFeatureCard'))
    // Strips block/line comments first -- the file's own header comment
    // illustrates the anti-pattern it forbids (e.g. "never string-
    // interpolated (e.g. `bg-${color}-600/20`)"), which would otherwise
    // make this check fail against its own documentation, not real code.
    const themeCodeOnly = themeSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    check('lib/section-theme.ts uses only full static class strings (no `${` interpolation in actual code)', !themeCodeOnly.includes('${'))
  }

  // ---------------------------------------------------------------------------
  section('9. No stale PR-number references in the new reusable/nav code')
  // ---------------------------------------------------------------------------

  {
    const files = [
      'components/site-header.tsx',
      'components/site-nav-links.tsx',
      'components/site-mobile-nav.tsx',
      'components/section-hero.tsx',
      'components/section-feature-card.tsx',
      'lib/section-theme.ts',
      'lib/nav-links.ts',
      'app/deep-dives/page.tsx',
      'app/learn/page.tsx',
      'app/(authenticated)/practice/page.tsx',
      'app/(authenticated)/practice-lab/page.tsx',
    ]
    for (const file of files) {
      const src = readRepoFile(file)
      check(`${file} has no stale numeric "PR #196" self-reference`, !/PR #196\b/.test(src))
    }
  }

  // ---------------------------------------------------------------------------
  section('10. Untouched behavior: Deep Dive catalog/status, Insights catalog, auth gating, data-driven counts')
  // ---------------------------------------------------------------------------

  {
    const deepDivesPageSrc = readRepoFile('app/deep-dives/page.tsx')
    check('Deep Dives page still renders the real catalog, not a hand-picked subset', deepDivesPageSrc.includes('deepDives={DEEP_DIVES}'))
    check('Deep Dives page still imports DEEP_DIVES from the untouched catalog module', deepDivesPageSrc.includes("from '@/content/deep-dives/catalog'"))

    const browserSrc = readRepoFile('components/deep-dive-browser.tsx')
    check('DeepDiveBrowser still derives "Available"/"Coming soon" from deepDive.status, not new logic', browserSrc.includes("deepDive.status === 'published'"))

    // These two checks used to assert the Insights catalog was still empty
    // and untouched by *this* (site-wide nav visual upgrade) PR -- true at
    // the time, but PR #199 is the one that legitimately publishes the
    // first Insight. Detailed coverage of that catalog/listing/detail-route
    // behavior now lives in scripts/insights-regression.ts; this section
    // just confirms the nav-upgrade-era untouched-behavior checks around it
    // (Deep Dives, Practice, auth gating, etc.) still hold.
    const insightsPageSrc = readRepoFile('app/insights/page.tsx')
    check('IBM i Insights listing page now imports the (no longer empty) Insights catalog', insightsPageSrc.includes("from '@/content/insights/catalog'"))

    const catalogSrc = readRepoFile('content/insights/catalog.ts')
    check('the Insights catalog now publishes at least one Insight', /INSIGHTS: Insight\[\] = \[\s*\{/.test(catalogSrc))

    const practiceSrc = readRepoFile('app/(authenticated)/practice/page.tsx')
    // Homepage Hierarchy and Signed-Out Feature Discovery: an unauthenticated
    // visitor now sees a public preview (<PracticePreview>) instead of being
    // redirected straight to login -- deeper coverage of that preview lives
    // in scripts/protected-preview-regression.ts (test:protected-preview).
    check('an unauthenticated visitor now sees <PracticePreview> instead of a login redirect', practiceSrc.includes('return <PracticePreview />'))
    check('Practice still preserves the exact INTRO_NOTICE wording', practiceSrc.includes('there is no ') && practiceSrc.includes('score, ranking, or certificate attached to them'))

    const practiceLabSrc = readRepoFile('app/(authenticated)/practice-lab/page.tsx')
    check('an unauthenticated visitor now sees <PracticeLabPreview> instead of a login redirect', practiceLabSrc.includes('return <PracticeLabPreview />'))
    check('Practice Lab still renders the untouched <SimulatorNotice /> component (exact safety wording lives there) for signed-in users', practiceLabSrc.includes('<SimulatorNotice />'))

    const learnSrc = readRepoFile('app/learn/page.tsx')
    // Learning Center and 288-Lesson Catalog Simplification: the Start/Continue
    // Learning card needs the real lesson list (not just a count) to pick a
    // recommended lesson, so this now calls getPublishedLessons() instead of
    // the count-only getPublishedLessonCount() -- same underlying query, still
    // never a hardcoded number (lessons.length replaces the old published count).
    check('Learning Center still derives its lesson count from getPublishedLessons(), not a hardcoded number', learnSrc.includes('getPublishedLessons()'))
    check('Learning Center still derives its Deep Dives count from DEEP_DIVES.length, not a hardcoded number', learnSrc.includes('DEEP_DIVES.length'))

    const dashboardSrc = readRepoFile('app/(authenticated)/dashboard/page.tsx')
    check('Dashboard still calls the real metric functions, not reimplemented inline math', [
      'calculateOverallProgress',
      'calculateTopicProgress',
      'summarizeTopics',
      'selectContinueLesson',
      'reconcileAchievementsForUser',
    ].every((fn) => dashboardSrc.includes(fn)))

    const aiTutorSrc = readRepoFile('app/(authenticated)/ai-tutor/page.tsx')
    // PRIVACY_NOTICE is written as several string literals joined with `+`
    // and wrapped across lines, so a contiguous .includes() would fail on
    // the source text even with the wording byte-for-byte unchanged --
    // collapsing whitespace/quote-concatenation first checks the actual
    // semantic content instead of how the source happens to be line-wrapped.
    const aiTutorFlattened = aiTutorSrc.replace(/'\s*\+\s*\n?\s*'/g, '').replace(/\s+/g, ' ')
    check(
      'AI Tutor still shows the exact, unmodified PRIVACY_NOTICE wording',
      aiTutorFlattened.includes('AI Tutor is for educational guidance only') &&
        aiTutorFlattened.includes('The tutor cannot connect to a real IBM i system')
    )
    check('AI Tutor chat behavior/props are unchanged (<AiTutorChat> still receives the same two props)', /<AiTutorChat starterPrompts=\{STARTER_PROMPTS\} initialLessonContext=\{initialLessonContext\} \/>/.test(aiTutorSrc))
  }

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Site-wide navigation/visual-system regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Site-wide navigation/visual-system regression FAILED.')
    process.exit(1)
  }
  console.log('Site-wide navigation/visual-system regression passed.')
}

function hasFullAccent(link: NavLinkDef): boolean {
  const keys: (keyof NavLinkDef['accent'])[] = ['activeBg', 'activeText', 'hoverBg', 'hoverText', 'ring']
  return keys.every((key) => typeof link.accent[key] === 'string' && link.accent[key].length > 0)
}

main().catch((err) => {
  console.error('Site-wide navigation/visual-system regression script crashed:', err)
  process.exit(1)
})
