/**
 * Deep Dive TOC / heading-anchor regression pass (PR #162).
 *
 * PR #161 fixed a bug where the "On this page" navigator's title lost a
 * heading's leading ordinal ("2. Where you'll actually type SQL" showed
 * as just "Where you'll actually type SQL") while the anchor `id` stayed
 * correctly stable. This script is a permanent regression guard for that
 * specific bug -- run standalone via `tsx`, no test framework dependency,
 * matching the existing scripts/rag-regression.ts style.
 *
 * Usage:
 *   npm run test:deep-dive-toc
 */

import { addDeepDiveHeadingAnchors, tagDeepDiveCallouts } from '../lib/deep-dive-render'

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

// ---------------------------------------------------------------------------
// Section 1: the exact PR #161 regression case
// ---------------------------------------------------------------------------
section('1. Numbered heading keeps its ordinal in the TOC title, not just the article')

{
  const { html, toc } = addDeepDiveHeadingAnchors("<h2>2. Where you'll actually type SQL</h2>")
  const item = toc[0]

  check('produces exactly one TOC item', toc.length === 1, `got ${toc.length}`)
  check(
    'TOC title matches the heading\'s full text, including the ordinal',
    item?.title === "2. Where you'll actually type SQL",
    `got ${JSON.stringify(item?.title)}`
  )
  check(
    'anchor id is ordinal-free and stable (same as before PR #161\'s fix)',
    item?.id === 'where-youll-actually-type-sql',
    `got ${JSON.stringify(item?.id)}`
  )
  check('TOC item is level 2 (h2)', item?.level === 2, `got ${item?.level}`)
  check(
    'rendered html carries the same id on the actual <h2>, heading text untouched',
    html === '<h2 id="where-youll-actually-type-sql">2. Where you\'ll actually type SQL</h2>',
    `got ${JSON.stringify(html)}`
  )
}

// ---------------------------------------------------------------------------
// Section 2: unnumbered headings are unaffected
// ---------------------------------------------------------------------------
section('2. Unnumbered heading renders and titles unchanged')

{
  const { toc } = addDeepDiveHeadingAnchors('<h2>Who this is for</h2>')
  const item = toc[0]

  check('title has no injected ordinal', item?.title === 'Who this is for', `got ${JSON.stringify(item?.title)}`)
  check('id is the plain slug', item?.id === 'who-this-is-for', `got ${JSON.stringify(item?.id)}`)
}

// ---------------------------------------------------------------------------
// Section 3: h3 sub-headings and multi-heading documents
// ---------------------------------------------------------------------------
section('3. h3 sub-headings are collected at level 3, in document order')

{
  const { toc } = addDeepDiveHeadingAnchors(
    "<h2>3. Naming conventions: *SQL vs *SYS</h2><h3>Simplifying names with CURRENT SCHEMA</h3><h2>4. Build the practice database</h2>"
  )

  check('collects all three headings', toc.length === 3, `got ${toc.length}`)
  check('first item is level 2 with its ordinal', toc[0]?.title === '3. Naming conventions: *SQL vs *SYS')
  check('second item is level 3, unnumbered', toc[1]?.level === 3 && toc[1]?.title === 'Simplifying names with CURRENT SCHEMA')
  check('third item keeps its own ordinal', toc[2]?.title === '4. Build the practice database')
}

// ---------------------------------------------------------------------------
// Section 4: duplicate heading text still gets disambiguated ids
// ---------------------------------------------------------------------------
section('4. Slug collisions are still disambiguated after the fix')

{
  const { toc } = addDeepDiveHeadingAnchors('<h2>1. Overview</h2><h2>2. Overview</h2>')

  check('first "Overview" keeps the plain slug', toc[0]?.id === 'overview', `got ${JSON.stringify(toc[0]?.id)}`)
  check('second "Overview" gets a disambiguating suffix', toc[1]?.id === 'overview-2', `got ${JSON.stringify(toc[1]?.id)}`)
  check('both titles keep their own distinct ordinal', toc[0]?.title === '1. Overview' && toc[1]?.title === '2. Overview')
}

// ---------------------------------------------------------------------------
// Section 5: callout tagging is unaffected by this fix (sanity check only)
// ---------------------------------------------------------------------------
section('5. Callout classification still works alongside the heading fix')

{
  const html = tagDeepDiveCallouts('<blockquote><p><strong>Worth noticing:</strong> example.</p></blockquote>')
  check('blockquote gets the callout-note class', html.includes('class="callout-note"'), html)
}

async function main() {
  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Deep Dive TOC regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Deep Dive TOC regression FAILED.')
    process.exit(1)
  }
  console.log('Deep Dive TOC regression passed.')
}

main().catch((err) => {
  console.error('Deep Dive TOC regression script crashed:', err)
  process.exit(1)
})
