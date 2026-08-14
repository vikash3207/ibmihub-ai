/**
 * AI Tutor page-context regression pass (PR #181; extended to Insights by
 * AI Tutor Insights/Deep Dives Grounding).
 *
 * Covers the trusted client/server context contract added so the header's
 * AI Tutor trigger knows which lesson, Insight, or Deep Dive the learner is
 * reading. Asserts the pure/inspectable parts -- context identity and
 * labelling, the canonical Insight/Deep Dive registries the server
 * validates against, the usage-origin mapping, migrations 009/013's shape,
 * the file-tracing config the deployed retrieval route depends on, and the
 * detail pages' context registration + CTA wiring. Model output is
 * deliberately not asserted; see the manual answer-quality checklist in the
 * PR notes.
 *
 * Usage:
 *   npm run test:ai-tutor-context
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { getContextKey, getContextLabel, GENERAL_CONTEXT, type AiTutorContext } from '../components/ai-tutor/types'
import { DEEP_DIVES } from '../content/deep-dives/catalog'
import { isDeepDiveAvailable } from '../lib/deep-dives'
import { INSIGHTS } from '../content/insights/catalog'
import { isInsightAvailable } from '../lib/insights'

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

const deepDive: AiTutorContext = {
  sourceType: 'deep-dive',
  deepDiveSlug: 'sql-error-handling-on-ibm-i',
  deepDiveTitle: 'SQL Error Handling on IBM i',
  deepDivePath: '/deep-dives/sql-error-handling-on-ibm-i',
}
const learningCenter: AiTutorContext = { sourceType: 'learning-center', title: 'iRPGenie Learning Center' }
const lesson: AiTutorContext = {
  sourceType: 'lesson',
  lessonSlug: 'what-is-ibm-i',
  lessonTitle: 'What is IBM i?',
  lessonPath: '/learn/ibm-i-fundamentals/what-is-ibm-i',
}
const insight: AiTutorContext = {
  sourceType: 'insight',
  insightSlug: 'db2-for-i-qsys2-services-developers-should-know',
  insightTitle: 'Db2 for i and QSYS2 Services Every Developer Should Know',
  insightPath: '/insights/db2-for-i-qsys2-services-developers-should-know',
}

// ---------------------------------------------------------------------------
section('1. Context identity keys are stable and distinct')

{
  check('deep-dive key includes the slug', getContextKey(deepDive) === 'deep-dive:sql-error-handling-on-ibm-i:')
  check('insight key includes the slug', getContextKey(insight) === 'insight:db2-for-i-qsys2-services-developers-should-know')
  check('learning-center has a stable key', getContextKey(learningCenter) === 'learning-center')
  check('general is unchanged', getContextKey(GENERAL_CONTEXT) === 'general')
  check('lesson key is unchanged (no regression)', getContextKey(lesson) === 'lesson:what-is-ibm-i')

  const keys = [deepDive, insight, learningCenter, lesson, GENERAL_CONTEXT].map(getContextKey)
  check('every context type has a distinct key', new Set(keys).size === keys.length, keys.join(','))

  // Section changes must produce a new key so the panel re-syncs.
  const withSection: AiTutorContext = { ...deepDive, sectionId: 'get-diagnostics' } as AiTutorContext
  check('a section id changes the deep-dive key', getContextKey(withSection) !== getContextKey(deepDive))
}

// ---------------------------------------------------------------------------
section('2. Client-side labels never overclaim')

{
  check('deep-dive label names the Deep Dive', getContextLabel(deepDive) === 'Using Deep Dive context: SQL Error Handling on IBM i')
  check('insight label names the Insight', getContextLabel(insight) === 'Using Insight context: Db2 for i and QSYS2 Services Every Developer Should Know')
  check('learning-center has a label', getContextLabel(learningCenter) === 'Using Learning Center context')
  check('general has NO label (never claims grounding)', getContextLabel(GENERAL_CONTEXT) === null)
  check('lesson label unchanged (no regression)', getContextLabel(lesson) === 'Using lesson context: What is IBM i?')
}

// ---------------------------------------------------------------------------
section('3. Deep Dive slugs the server will accept')

{
  const published = DEEP_DIVES.filter(isDeepDiveAvailable)

  check('there is at least one published Deep Dive to ground in', published.length > 0, `${published.length}`)
  check(
    'the fixture slug used above is genuinely published',
    published.some((d) => d.slug === 'sql-error-handling-on-ibm-i')
  )
  check(
    'an unpublished Deep Dive is NOT accepted',
    !published.some((d) => d.slug === 'native-io-vs-sql'),
    'native-io-vs-sql is a planned entry and must not validate'
  )
  check('a spoofed slug is not in the catalog', !DEEP_DIVES.some((d) => d.slug === '../../etc/passwd'))
  check('slugs are unique', new Set(DEEP_DIVES.map((d) => d.slug)).size === DEEP_DIVES.length)
}

// ---------------------------------------------------------------------------
section('3b. Insight slugs the server will accept')

{
  const published = INSIGHTS.filter(isInsightAvailable)

  check('there is at least one published Insight to ground in', published.length > 0, `${published.length}`)
  check(
    'the fixture slug used above is genuinely published',
    published.some((i) => i.slug === 'db2-for-i-qsys2-services-developers-should-know')
  )
  check(
    'a draft Insight would NOT be accepted (structural check: isInsightAvailable requires status === published)',
    (() => {
      const draftFixture = { ...published[0], status: 'draft' as const }
      return !isInsightAvailable(draftFixture)
    })()
  )
  check('a spoofed slug is not in the catalog', !INSIGHTS.some((i) => i.slug === '../../etc/passwd'))
  check('slugs are unique', new Set(INSIGHTS.map((i) => i.slug)).size === INSIGHTS.length)
}

// ---------------------------------------------------------------------------
section('4. Server route: trusted resolution and origin mapping')

{
  const route = readFileSync(join(process.cwd(), 'app', 'api', 'ai-tutor', 'route.ts'), 'utf8')
  const collapsed = route.replace(/\s+/g, ' ')

  check(
    'deep-dive slugs are validated against the catalog AND publication state',
    /DEEP_DIVES\.some\(.*isDeepDiveAvailable/.test(collapsed)
  )
  check(
    'only the slug is retained from a deep-dive context (no client title/path trusted)',
    /return \{ sourceType: 'deep-dive', deepDiveSlug: slug \}/.test(route)
  )
  check(
    'insight slugs are validated against the catalog AND publication state',
    /INSIGHTS\.some\(.*isInsightAvailable/.test(collapsed)
  )
  check(
    'only the slug is retained from an insight context (no client title/path trusted)',
    /return \{ sourceType: 'insight', insightSlug: slug \}/.test(route)
  )
  check(
    'learning-center context carries no client-supplied data',
    /return \{ sourceType: 'learning-center' \}/.test(route)
  )
  check('deep-dive maps to its own persisted origin', /case 'deep-dive':[\s\S]{0,300}return 'deep-dive'/.test(route))
  check('insight maps to its own persisted origin', /case 'insight':[\s\S]{0,300}return 'insight'/.test(route))
  check(
    'learning-center does NOT expand the persisted origin enum',
    /case 'learning-center':[\s\S]{0,400}return 'standalone'/.test(route)
  )
  check(
    'the Deep Dive prompt section points at retrieved content for grounding (not a "body unavailable" disclaimer -- Deep Dive bodies joined the retrieval index)',
    /included in the retrieved content section below/.test(route) && !/NOT available to you/.test(route)
  )
  check(
    'the Insight prompt section points at retrieved content for grounding the same way',
    /reading the iRPGenie Insight/.test(route) && /included in the retrieved content section below/.test(route)
  )
  check(
    'retrievePublishedContent() is called with currentInsightSlug/currentDeepDiveSlug, not just currentLessonSlug (both content types actually get grounded, not just page-aware)',
    /currentInsightSlug: resolvedInsight\?\.slug/.test(route) && /currentDeepDiveSlug: resolvedDeepDive\?\.slug/.test(route)
  )
  check(
    'the Learning Center prompt section defines iRPGenie Deep Dives',
    /Deep Dives" are iRPGenie/.test(route) || /iRPGenie product terms/.test(route)
  )
  check(
    'the Learning Center prompt section also defines iRPGenie Insights',
    /Insights" are iRPGenie/.test(route)
  )
}

// ---------------------------------------------------------------------------
section('5. Provider resolves page context on a bare openPanel()')

{
  const provider = readFileSync(
    join(process.cwd(), 'components', 'ai-tutor', 'ai-tutor-panel-provider.tsx'),
    'utf8'
  )
  const register = readFileSync(
    join(process.cwd(), 'components', 'ai-tutor', 'register-page-context.tsx'),
    'utf8'
  )

  check('openPanel falls back to the registered page context', /nextContext \?\? pageContextRef\.current/.test(provider))
  check(
    'with neither, it resets to general rather than reusing stale context',
    /setContext\(GENERAL_CONTEXT\)/.test(provider)
  )
  check('page context is a ref, so registering does not re-render the tree', /useRef<AiTutorContext \| null>/.test(provider))
  check('registration is cleared on unmount (no stale leak)', /return \(\) => registerPageContext\(null\)/.test(register))
  check('an open panel follows a client-side navigation', /if \(isOpen\) \{\s*updateContext\(context\)/.test(register))
}

// ---------------------------------------------------------------------------
section('6. Header trigger uses page context, not a hard-coded general one')

{
  // The click-interception logic (Site-wide Navigation and Section Landing
  // Page Visual Upgrade) now lives in lib/nav-links.ts, a plain module both
  // components/site-nav-links.tsx (desktop pill nav) and
  // components/site-mobile-nav.tsx (mobile panel) import from -- checking
  // that shared source is what actually matters here, not either
  // component's own file, which now just calls the shared function.
  const navLinks = readFileSync(join(process.cwd(), 'lib', 'nav-links.ts'), 'utf8')
  const navComponent = readFileSync(join(process.cwd(), 'components', 'site-nav-links.tsx'), 'utf8')
  const mobileNavComponent = readFileSync(join(process.cwd(), 'components', 'site-mobile-nav.tsx'), 'utf8')

  check('header opens with no explicit context', /openPanel\(\)/.test(navLinks))
  check('header no longer forces GENERAL_CONTEXT', !/openPanel\(GENERAL_CONTEXT\)/.test(navLinks))
  check('modified clicks still fall through to the real route', /metaKey \|\| event\.ctrlKey/.test(navLinks))
  check('the canonical /ai-tutor href is preserved', /href: '\/ai-tutor'/.test(navLinks))
  check('the desktop nav component uses the shared handler, not a second copy', navComponent.includes('handleAiTutorNavClick'))
  check('the mobile nav component uses the same shared handler', mobileNavComponent.includes('handleAiTutorNavClick'))
}

// ---------------------------------------------------------------------------
section('7. Migration 009 safely widens the origin constraint')

{
  const sql = readFileSync(
    join(process.cwd(), 'supabase', 'migrations', '009_ai_tutor_deep_dive_origin.sql'),
    'utf8'
  ).toLowerCase()

  check('all four origins are permitted', /'standalone',\s*'lesson',\s*'practice',\s*'deep-dive'/.test(sql))
  check('the old constraint name is discovered, not guessed', /from pg_constraint/.test(sql) && /conname/.test(sql))
  check('the new constraint is explicitly named', /add constraint ai_tutor_usage_events_origin_check/.test(sql))
  check('it is idempotent', /if not exists/.test(sql))
  // Strip comment lines first: the header comment legitimately *mentions*
  // blocked_reason to say it is left alone, which is not the same as the
  // executable SQL touching it.
  const executableSql = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
  check('no executable statement touches blocked_reason', !/blocked_reason/.test(executableSql))
  check('only the origin constraint is dropped', (executableSql.match(/drop constraint/g) ?? []).length === 1)
  check('migration 006 is not modified by this file', !/create table/.test(sql))
  check('verification queries are documented', /pg_get_constraintdef/.test(sql))
}

// ---------------------------------------------------------------------------
section('8. Migration 013 safely widens the origin constraint further (adds insight)')

{
  const sql = readFileSync(
    join(process.cwd(), 'supabase', 'migrations', '013_ai_tutor_insight_origin.sql'),
    'utf8'
  ).toLowerCase()

  check('all five origins are permitted', /'standalone',\s*'lesson',\s*'practice',\s*'deep-dive',\s*'insight'/.test(sql))
  check('it targets the constraint 009 already named, rather than re-discovering it', /conname = 'ai_tutor_usage_events_origin_check'/.test(sql))
  check('the new constraint is explicitly named', /add constraint ai_tutor_usage_events_origin_check/.test(sql))
  check('it is idempotent (guarded by an existence check)', /if exists/.test(sql) || /if not exists/.test(sql))
  const executableSql = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
  check('no executable statement touches blocked_reason', !/blocked_reason/.test(executableSql))
  check('only the origin constraint is dropped', (executableSql.match(/drop constraint/g) ?? []).length === 1)
  check('migrations 006 through 012 are not modified by this file', !/create table/.test(sql))
  check('verification queries are documented', /pg_get_constraintdef/.test(sql))
}

// ---------------------------------------------------------------------------
section('9. next.config.mjs traces Deep Dive/Insight markdown for the deployed AI Tutor route')

{
  // A real bug this PR fixes: content/deep-dives/*.md and content/insights/*.md
  // were only traced for their own detail routes, not for /api/ai-tutor --
  // retrievePublishedContent() now reads both from inside that route, so a
  // deployed Vercel function without this entry would 404 on file reads that
  // work fine in local dev (which reads straight off the real filesystem).
  const config = readFileSync(join(process.cwd(), 'next.config.mjs'), 'utf8')
  const apiRouteEntryMatch = config.match(/'\/api\/ai-tutor':\s*\[([^\]]*)\]/)
  const apiRouteEntry = apiRouteEntryMatch?.[1] ?? ''

  check("outputFileTracingIncludes has an '/api/ai-tutor' entry", apiRouteEntryMatch !== null)
  check('that entry traces content/lessons/*.md (no regression)', /content\/lessons\/\*\.md/.test(apiRouteEntry))
  check('that entry traces content/deep-dives/*.md', /content\/deep-dives\/\*\.md/.test(apiRouteEntry))
  check('that entry traces content/insights/*.md', /content\/insights\/\*\.md/.test(apiRouteEntry))
}

// ---------------------------------------------------------------------------
section('10. Insight and Deep Dive detail pages register context and offer a CTA')

{
  const insightPage = readFileSync(join(process.cwd(), 'app', 'insights', '[slug]', 'page.tsx'), 'utf8')
  const deepDivePage = readFileSync(join(process.cwd(), 'app', 'deep-dives', '[slug]', 'page.tsx'), 'utf8')

  check('the Insight page registers its AI Tutor page context', /<RegisterAiTutorPageContext context={aiTutorContext} \/>/.test(insightPage))
  check(
    "the Insight page's context carries sourceType 'insight' with only stable identifiers",
    /sourceType: 'insight',\s*insightSlug: insight\.slug,\s*insightTitle: insight\.title,\s*insightPath: `\/insights\/\$\{insight\.slug\}`,/.test(insightPage)
  )
  check(
    'the Insight page offers the specifically-worded "Ask AI Tutor about this Insight" CTA',
    /Ask AI Tutor about this Insight/.test(insightPage)
  )
  check('the Insight CTA opens the shared panel with the verified context, not a generic/general one', /<AskAiTutorButton context={aiTutorContext}/.test(insightPage))

  check('the Deep Dive page still registers its AI Tutor page context (no regression)', /<RegisterAiTutorPageContext context={aiTutorContext} \/>/.test(deepDivePage))
  check('the Deep Dive CTA wording now names the Deep Dive too, matching the Insight CTA\'s specificity', /Ask AI Tutor about this Deep Dive/.test(deepDivePage))
  check('the Deep Dive CTA no longer claims Deep Dives are outside the retrieval index (that claim is now false)', !/are not part of the AI Tutor's/.test(deepDivePage))
}

// ---------------------------------------------------------------------------

console.log('\n' + '-'.repeat(60))
if (failures > 0) {
  console.error(`AI Tutor context regression: ${passed} passed, ${failures} failed.`)
  process.exit(1)
}
console.log(`AI Tutor context regression: ${passed} passed, 0 failed.`)
console.log('AI Tutor context regression passed.')
