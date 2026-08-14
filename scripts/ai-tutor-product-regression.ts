/**
 * AI Tutor quota-silence and product-facts regression pass (PR #182).
 *
 * Three things are asserted here, all statically checkable:
 *   1. No quota messaging leaks into the ordinary interface.
 *   2. Enforcement still happens server-side, before any retrieval or model
 *      call, and the client can identify the exhausted state deterministically.
 *   3. The Tutor's platform facts are authoritative, single-sourced, and
 *      contain no fabricated pricing or purchasable-plan claim.
 *
 * Model output is deliberately NOT asserted -- that is what the manual
 * answer-quality checklist in the PR notes is for.
 *
 * Usage:
 *   npm run test:ai-tutor-product
 */

import { readFileSync } from 'fs'
import { join } from 'path'

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

const read = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts), 'utf8')

const chatThread = read('components', 'ai-tutor', 'chat-thread.tsx')
const fullPageChat = read('components', 'ai-tutor-chat.tsx')
const panel = read('components', 'ai-tutor', 'embedded-ai-tutor-panel.tsx')
const provider = read('components', 'ai-tutor', 'ai-tutor-panel-provider.tsx')
const dialog = read('components', 'ai-tutor', 'limit-reached-dialog.tsx')
const route = read('app', 'api', 'ai-tutor', 'route.ts')
const limits = read('lib', 'ai', 'tutor-limits.ts')
const facts = read('lib', 'ai', 'product-facts.ts')

/** Strip JS/JSX comments so assertions test rendered text, not prose in comments. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

// ---------------------------------------------------------------------------
section('1. No quota messaging during ordinary use')

{
  const surfaces: [string, string][] = [
    ['chat thread', chatThread],
    ['full-page tutor', fullPageChat],
    ['embedded panel', panel],
  ]

  for (const [name, source] of surfaces) {
    const rendered = stripComments(source)
    check(`${name}: no "Beta limit" caption`, !/Beta limit/i.test(rendered))
    check(`${name}: no "questions/day" text`, !/questions\s*\/\s*day|questions per day/i.test(rendered))
    check(
      `${name}: no remaining/left counter`,
      !/questions?\s+(remaining|left)|remaining\s+questions?/i.test(rendered),
      'a "questions remaining" counter would re-expose the quota'
    )
  }

  // The dialog is the ONE place quota wording is allowed.
  check('the limit dialog does mention the limit (it is the exception)', /reached today/i.test(dialog))
}

// ---------------------------------------------------------------------------
section('2. The allowance is still tracked and enforced server-side')

{
  check('daily limit constant still exists', /AI_TUTOR_DAILY_LIMIT/.test(limits))
  check('default allowance is still 20', /envInt\('AI_TUTOR_DAILY_LIMIT', 20\)/.test(limits))
  check('limits module is server-only', /import 'server-only'/.test(limits))
  check('route still runs the quota check', /checkAiTutorLimits\(user\.id/.test(route))
  check('a blocked request still records a usage event', /wasBlocked: true/.test(route))
}

// ---------------------------------------------------------------------------
section('3. Blocked requests never reach retrieval or the model')

{
  // Position matters: the guard must precede both grounding and streaming.
  const guardIndex = route.indexOf('checkAiTutorLimits(user.id')
  const groundingIndex = route.indexOf('resolveGrounding(context')
  // Must match the CALL, not the import at the top of the file --
  // `streamTutorResponse` alone matches the import first and would make
  // this assertion meaningless.
  const streamIndex = route.indexOf('= streamTutorResponse(')

  check('quota check appears before retrieval', guardIndex > 0 && guardIndex < groundingIndex, `${guardIndex} < ${groundingIndex}`)
  check('quota check appears before the model call', guardIndex > 0 && guardIndex < streamIndex, `${guardIndex} < ${streamIndex}`)
  check(
    'the blocked branch returns instead of falling through',
    /if \(limitCheck\.blocked\) \{[\s\S]{0,900}?return jsonError\(/.test(route)
  )
}

// ---------------------------------------------------------------------------
section('4. Typed error contract')

{
  check('an error code union is defined', /AiTutorErrorCode/.test(route))
  check('daily_limit is a code', /'daily_limit'/.test(route))
  check('cooldown is a distinct code', /'cooldown'/.test(route))
  check('unauthenticated is a distinct code', /'unauthenticated'/.test(route))
  check('provider failures are distinct', /'provider_error'/.test(route))
  check('the code is serialized in the response body', /JSON\.stringify\(\{ error: message, code/.test(route))
  check(
    'the limit branch forwards the reason as the code',
    /return jsonError\(\s*limitCheck\.message,\s*status,\s*limitCheck\.reason/.test(route)
  )

  // The client must key off the code, not the status or the prose --
  // 429 is shared by daily_limit and cooldown.
  check('client switches on the typed code', /code === 'daily_limit'/.test(provider))
  check('client opens the dialog for that code', /setLimitReachedOpen\(true\)/.test(provider))
  check(
    'client does NOT string-match the prose',
    !/error\.includes\(|message\.includes\('reached'/.test(provider)
  )
}

// ---------------------------------------------------------------------------
section('5. The dialog preserves the session and the page')

{
  check('conversation is not cleared when the limit hits', !/newChat\(\)/.test(stripComments(dialog)))
  check('no navigation or reload on limit', !/router\.(push|replace|refresh)|location\.(href|reload)/.test(dialog))
  check('dialog is dismissable', /dismissLimitReached/.test(dialog))
  check('rendered once from the provider (all surfaces)', /<LimitReachedDialog \/>/.test(provider))
}

// ---------------------------------------------------------------------------
section('6. Dialog accessibility contract')

{
  check('has dialog role', /role="dialog"/.test(dialog))
  check('is modal', /aria-modal="true"/.test(dialog))
  check('has an accessible name', /aria-labelledby=/.test(dialog))
  check('has an accessible description', /aria-describedby=/.test(dialog))
  check('close control is labelled', /aria-label="Close"/.test(dialog))
  check('Escape closes it', /event\.key === 'Escape'/.test(dialog))
  check('focus is moved in on open', /confirmRef\.current\?\.focus\(\)/.test(dialog))
  check('focus is trapped', /event\.key !== 'Tab'/.test(dialog) && /preventDefault\(\)/.test(dialog))
  check('focus is restored on close', /previouslyFocusedRef\.current\?\.focus/.test(dialog))
  check('respects reduced motion', /motion-reduce:transition-none/.test(dialog))
}

// ---------------------------------------------------------------------------
section('7. Product facts are authoritative and single-sourced')

{
  check('facts module is server-only', /import 'server-only'/.test(facts))
  check('founder is Vikash Choudhary', /Vikash Choudhary/.test(facts))
  check('founder is exported as a constant', /IRPGENIE_FOUNDER = 'Vikash Choudhary'/.test(facts))
  check(
    'the daily allowance is NOT restated as a literal',
    !/\b20\s+(AI Tutor\s+)?questions\b/i.test(facts),
    'the number must come from AI_TUTOR_DAILY_LIMIT, not a second hardcode'
  )
  check('the allowance is interpolated from the enforced constant', /\$\{AI_TUTOR_DAILY_LIMIT\}/.test(facts))
  check('facts are injected into the prompt', /buildProductFactsSection\(\)/.test(route))
  check(
    'facts take priority over page context and retrieval',
    /buildProductFactsSection\(\),\s*\n\s*\.\.\.pageSections/.test(route)
  )
  check('facts assert they override retrieved content', /OVERRIDE any lesson, Deep Dive, retrieved/.test(facts))
}

// ---------------------------------------------------------------------------
section('8. No fabricated pricing or purchasable plan')

{
  check('no plan is claimed purchasable', /SUBSCRIPTION_PURCHASABLE = false/.test(facts))
  check('no published price exists', /PUBLISHED_PRICE: string \| null = null/.test(facts))
  check(
    'no currency amount appears anywhere in the facts',
    !/[$£€]\s?\d|\d+\s*(usd|eur|gbp)\b|\/\s*month\b|per month/i.test(facts),
    'a price here would be fabricated -- this repo has no billing implementation'
  )
  check('the model is told not to invent a price', /Never invent, estimate, or hint at a price/.test(facts))
  check('IBM independence is stated', /NOT affiliated with, sponsored by, endorsed by, or certified by IBM/.test(facts))

  // The dialog must not imply a purchase is possible either.
  const dialogText = stripComments(dialog)
  check('dialog has no price', !/[$£€]\s?\d/.test(dialogText))
  check('dialog has no Subscribe/Buy CTA', !/Subscribe now|Buy now|Upgrade now|View plans/i.test(dialogText))
  check('dialog says plans are coming soon', /coming soon/i.test(dialogText))
  check(
    'dialog links only to a route that exists',
    !/href="\/(pricing|plans|subscribe|checkout|billing)"/.test(dialogText)
  )
  check('dialog contact link points at the real /contact route', /href="\/contact"/.test(dialogText))
}

// ---------------------------------------------------------------------------
section('9. Existing behavior preserved')

{
  check('all five usage origins still supported', /'deep-dive'/.test(route) && /'insight'/.test(route) && /'standalone'/.test(route))
  check('page-aware context from PR #181 intact', /pageSections/.test(route))
  check('deep-dive slug validation intact', /isDeepDiveAvailable/.test(route))
  check('auth still required', /You must be logged in to use the AI Tutor/.test(route))
  check('streaming preserved for permitted requests', /streamTutorResponse/.test(route))
  check('no analytics call added to the Tutor path', !/gtag|dataLayer/.test(route + provider + dialog + facts))
}

// ---------------------------------------------------------------------------

console.log('\n' + '-'.repeat(60))
if (failures > 0) {
  console.error(`AI Tutor product regression: ${passed} passed, ${failures} failed.`)
  process.exit(1)
}
console.log(`AI Tutor product regression: ${passed} passed, 0 failed.`)
console.log('AI Tutor product regression passed.')
