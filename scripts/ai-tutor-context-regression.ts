/**
 * AI Tutor page-context regression pass (PR #181).
 *
 * Covers the trusted client/server context contract added so the header's
 * AI Tutor trigger knows which lesson or Deep Dive the learner is reading.
 * Asserts the pure/inspectable parts -- context identity and labelling, the
 * canonical Deep Dive registry the server validates against, the usage-origin
 * mapping, and migration 009's shape. Model output is deliberately not
 * asserted; see the manual answer-quality checklist in the PR notes.
 *
 * Usage:
 *   npm run test:ai-tutor-context
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { getContextKey, getContextLabel, GENERAL_CONTEXT, type AiTutorContext } from '../components/ai-tutor/types'
import { DEEP_DIVES } from '../content/deep-dives/catalog'
import { isDeepDiveAvailable } from '../lib/deep-dives'

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

// ---------------------------------------------------------------------------
section('1. Context identity keys are stable and distinct')

{
  check('deep-dive key includes the slug', getContextKey(deepDive) === 'deep-dive:sql-error-handling-on-ibm-i:')
  check('learning-center has a stable key', getContextKey(learningCenter) === 'learning-center')
  check('general is unchanged', getContextKey(GENERAL_CONTEXT) === 'general')
  check('lesson key is unchanged (no regression)', getContextKey(lesson) === 'lesson:what-is-ibm-i')

  const keys = [deepDive, learningCenter, lesson, GENERAL_CONTEXT].map(getContextKey)
  check('every context type has a distinct key', new Set(keys).size === keys.length, keys.join(','))

  // Section changes must produce a new key so the panel re-syncs.
  const withSection: AiTutorContext = { ...deepDive, sectionId: 'get-diagnostics' } as AiTutorContext
  check('a section id changes the deep-dive key', getContextKey(withSection) !== getContextKey(deepDive))
}

// ---------------------------------------------------------------------------
section('2. Client-side labels never overclaim')

{
  check('deep-dive label names the Deep Dive', getContextLabel(deepDive) === 'Using Deep Dive context: SQL Error Handling on IBM i')
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
section('4. Server route: trusted resolution and origin mapping')

{
  const route = readFileSync(join(process.cwd(), 'app', 'api', 'ai-tutor', 'route.ts'), 'utf8')

  check(
    'deep-dive slugs are validated against the catalog AND publication state',
    /DEEP_DIVES\.some\(.*isDeepDiveAvailable/.test(route.replace(/\s+/g, ' '))
  )
  check(
    'only the slug is retained from a deep-dive context (no client title/path trusted)',
    /return \{ sourceType: 'deep-dive', deepDiveSlug: slug \}/.test(route)
  )
  check(
    'learning-center context carries no client-supplied data',
    /return \{ sourceType: 'learning-center' \}/.test(route)
  )
  check('deep-dive maps to its own persisted origin', /case 'deep-dive':[\s\S]{0,300}return 'deep-dive'/.test(route))
  check(
    'learning-center does NOT expand the persisted origin enum',
    /case 'learning-center':[\s\S]{0,400}return 'standalone'/.test(route)
  )
  check(
    'the Deep Dive prompt section states the body is unavailable (no false grounding)',
    /NOT available to you/.test(route)
  )
  check(
    'the Learning Center prompt section defines iRPGenie Deep Dives',
    /Deep Dives" are iRPGenie/.test(route) || /iRPGenie product terms/.test(route)
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
  const nav = readFileSync(join(process.cwd(), 'components', 'site-nav-links.tsx'), 'utf8')

  check('header opens with no explicit context', /openPanel\(\)/.test(nav))
  check('header no longer forces GENERAL_CONTEXT', !/openPanel\(GENERAL_CONTEXT\)/.test(nav))
  check('modified clicks still fall through to the real route', /metaKey \|\| event\.ctrlKey/.test(nav))
  check('the canonical /ai-tutor href is preserved', /href: '\/ai-tutor'/.test(nav))
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

console.log('\n' + '-'.repeat(60))
if (failures > 0) {
  console.error(`AI Tutor context regression: ${passed} passed, ${failures} failed.`)
  process.exit(1)
}
console.log(`AI Tutor context regression: ${passed} passed, 0 failed.`)
console.log('AI Tutor context regression passed.')
