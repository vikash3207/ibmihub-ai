/**
 * Curriculum numbering / sidebar-data regression pass (PR #176).
 *
 * PR #175's curriculum sidebar appeared to show duplicate lesson numbers
 * (several rows reading "28"). Investigation found the curriculum data is
 * clean -- the real cause was presentational (a 12px-wide number slot that
 * 3-digit numbers overflowed into the title). This script is a permanent
 * guard for the *data* half of that diagnosis, so a future seed/metadata
 * edit that genuinely introduces duplicate or non-canonical lesson numbers
 * fails loudly instead of being mistaken for the old CSS bug again.
 *
 * Run standalone via `tsx`, no test framework dependency, matching the
 * existing scripts/deep-dive-toc-regression.ts and rag-regression.ts style.
 *
 * Usage:
 *   npm run test:curriculum-numbering
 */

import { IBM_I_FUNDAMENTALS_LESSONS } from '../content/lessons/metadata'

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

const published = IBM_I_FUNDAMENTALS_LESSONS.filter((lesson) => lesson.status === 'Published')

// ---------------------------------------------------------------------------
// Section 1: lesson numbers are unique (the reported "duplicate 28" symptom)
// ---------------------------------------------------------------------------
section('1. Every published lesson has a unique lessonOrder')

{
  const byOrder = new Map<number, string[]>()
  for (const lesson of published) {
    const slugs = byOrder.get(lesson.lessonOrder) ?? []
    slugs.push(lesson.slug)
    byOrder.set(lesson.lessonOrder, slugs)
  }

  const duplicates = [...byOrder.entries()].filter(([, slugs]) => slugs.length > 1)

  check(
    'no lessonOrder value is shared by two or more published lessons',
    duplicates.length === 0,
    duplicates.map(([order, slugs]) => `${order}: ${slugs.join(' + ')}`).join('; ')
  )
  check(
    'distinct lessonOrder count equals published lesson count',
    byOrder.size === published.length,
    `${byOrder.size} distinct vs ${published.length} lessons`
  )
}

// ---------------------------------------------------------------------------
// Section 2: numbering is a canonical 1..N sequence over the whole curriculum
// ---------------------------------------------------------------------------
section('2. lessonOrder is a gapless 1..N sequence across the full curriculum')

{
  const orders = published.map((lesson) => lesson.lessonOrder).sort((a, b) => a - b)
  const expected = Array.from({ length: published.length }, (_, i) => i + 1)
  const mismatch = orders.findIndex((order, i) => order !== expected[i])

  check('lowest lessonOrder is 1', orders[0] === 1, `got ${orders[0]}`)
  check(
    'highest lessonOrder equals the published lesson count',
    orders[orders.length - 1] === published.length,
    `got ${orders[orders.length - 1]} for ${published.length} lessons`
  )
  check(
    'sequence has no gaps or repeats',
    mismatch === -1,
    mismatch === -1 ? undefined : `first divergence at index ${mismatch}: expected ${expected[mismatch]}, got ${orders[mismatch]}`
  )
}

// ---------------------------------------------------------------------------
// Section 3: the sidebar renders lesson.lesson_order, NOT a filtered index --
// so a lesson's number must not depend on which topic/category is selected.
// This asserts the property that makes that safe: the number is intrinsic to
// the lesson record, so any subset of the curriculum keeps its original
// numbering.
// ---------------------------------------------------------------------------
section('3. Numbers survive filtering (a subset keeps its canonical numbers)')

{
  // Simulate what the sidebar does: take an arbitrary filtered subset (the
  // sidebar groups by topic) and confirm each lesson still reports its own
  // curriculum-wide number rather than a 1-based position within the subset.
  const subset = published.filter((_, i) => i % 7 === 0)
  const numbersArePositional = subset.every((lesson, i) => lesson.lessonOrder === i + 1)
  const orderBySlug = new Map(IBM_I_FUNDAMENTALS_LESSONS.map((l) => [l.slug, l.lessonOrder]))

  check('a filtered subset is non-trivial', subset.length > 10, `got ${subset.length}`)
  check(
    'subset numbers are NOT a 1..n positional index (they are intrinsic)',
    !numbersArePositional,
    'every subset entry matched its position, which is what a filtered-index bug would look like'
  )
  check(
    'each filtered lesson keeps its curriculum-wide lessonOrder',
    subset.every((lesson) => lesson.lessonOrder === orderBySlug.get(lesson.slug)),
    'a subset entry reported a different number than its source record'
  )
}

// ---------------------------------------------------------------------------
// Section 4: title rendering edge cases the sidebar row must survive
// ---------------------------------------------------------------------------
section('4. Title edge cases are known and accounted for')

{
  const threeDigit = published.filter((lesson) => lesson.lessonOrder >= 100)
  const longest = [...published].sort((a, b) => b.title.length - a.title.length)[0]

  // The original bug: a 12px number slot with this many 3-digit numbers.
  check(
    'curriculum actually contains 3-digit lesson numbers (the overflow case)',
    threeDigit.length > 0,
    `${threeDigit.length} lessons numbered 100+`
  )
  check('no published lesson has an empty title', published.every((lesson) => lesson.title.trim().length > 0))
  check('longest title is known and non-trivial', longest.title.length > 20, `${longest.title.length} chars: ${longest.title}`)
}

// ---------------------------------------------------------------------------

console.log('\n' + '-'.repeat(60))
if (failures > 0) {
  console.error(`Curriculum numbering regression: ${passed} passed, ${failures} failed.`)
  process.exit(1)
}
console.log(`Curriculum numbering regression: ${passed} passed, 0 failed.`)
console.log('Curriculum numbering regression passed.')
