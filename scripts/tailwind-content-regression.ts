/**
 * Tailwind content-scanning regression (Site-wide Navigation and Section
 * Landing Page Visual Upgrade -- correction pass).
 *
 * Root cause of the production defect this guards against: Tailwind's JIT
 * scanner only generates CSS for classes it finds as literal strings in
 * files matched by tailwind.config.ts's `content` globs. Several lib/
 * modules (lib/section-theme.ts, lib/nav-links.ts,
 * lib/deep-dive-categories.ts) hold static Tailwind class-string bundles
 * used by pages/components, but `content` didn't include a glob covering
 * ./lib -- so any class that didn't *also* happen to appear verbatim in an
 * already-scanned ./app or ./components file was silently never generated.
 * This is what made the Deep Dives hero badge nearly invisible and the
 * "Non-linear" pillar card lose its violet styling entirely in the actual
 * Vercel preview, even though `npm run build` succeeded and nothing else
 * caught it.
 *
 * This suite does NOT re-run Tailwind's own build (too slow/heavy for a
 * fast regression check, and would just re-prove the config is syntactically
 * valid). Instead it does the thing that actually would have caught the
 * bug: parse tailwind.config.ts's real `content` array, convert each glob to
 * a regex, and assert every file known to hold a static Tailwind
 * class-string bundle is matched by at least one of them. If someone ever
 * removes the ./lib glob (or narrows it, or one of these bundles moves to a
 * new file/directory without updating `content`), this fails.
 *
 * Standalone via `tsx`, no test framework dependency -- matches the
 * existing scripts/*-regression.ts style (check/section helpers, pass/fail
 * counter, process.exit(1) on any failure).
 *
 * Usage:
 *   npm run test:tailwind-content
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import config from '../tailwind.config'

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

// Minimal glob-to-regex conversion, sufficient for the simple
// './dir/**/*.{ext1,ext2}'-style patterns this config actually uses. Not a
// general-purpose glob library -- deliberately small and easy to audit.
// Segment-based (split on '/') so a bare '**' segment can be treated as
// "zero or more path segments, including the separator" -- a plain
// char-by-char translation of '**' to '.*' fails to match zero-directory
// cases like './lib/**/*.ts' against './lib/section-theme.ts' (no
// subdirectory between 'lib' and the filename).
function segmentToRegExp(segment: string): string {
  let re = ''
  for (let i = 0; i < segment.length; i++) {
    const c = segment[i]
    if (c === '*') {
      re += '[^/]*'
    } else if (c === '{') {
      const close = segment.indexOf('}', i)
      const options = segment
        .slice(i + 1, close)
        .split(',')
        .map((o) => o.replace(/[.+^${}()|[\]\\]/g, '\\$&'))
      re += `(${options.join('|')})`
      i = close
    } else if ('.+^${}()|[]\\'.includes(c)) {
      re += `\\${c}`
    } else {
      re += c
    }
  }
  return re
}

function globToRegExp(glob: string): RegExp {
  const segments = glob.split('/')
  let re = '^'
  segments.forEach((seg, idx) => {
    const isLast = idx === segments.length - 1
    if (seg === '**') {
      re += '(?:.*/)?'
      return
    }
    re += segmentToRegExp(seg)
    if (!isLast) re += '/'
  })
  re += '$'
  return new RegExp(re)
}

function matchesAnyGlob(relativeFilePath: string, globs: string[]): boolean {
  const normalized = relativeFilePath.startsWith('./') ? relativeFilePath : `./${relativeFilePath}`
  return globs.some((glob) => globToRegExp(glob).test(normalized))
}

console.log('Tailwind content-scanning regression\n' + '='.repeat(60))

section('tailwind.config.ts content array')

const contentGlobs = (config.content as string[]) ?? []
check('content is a non-empty array of glob strings', Array.isArray(contentGlobs) && contentGlobs.length > 0)
check(
  'content includes a glob that scans ./lib',
  contentGlobs.some((g) => g.startsWith('./lib/')),
  `got: ${JSON.stringify(contentGlobs)}`,
)

section('Files known to hold static Tailwind class-string bundles')

// Any file added here in the future because it starts holding a static
// class-string bundle (the "full string, never `${interpolated}`" pattern)
// must be covered by one of tailwind.config.ts's content globs, or its
// classes will silently never be generated -- exactly the bug this suite
// exists to catch.
const FILES_WITH_STATIC_CLASS_BUNDLES = [
  'lib/section-theme.ts',
  'lib/nav-links.ts',
  'lib/deep-dive-categories.ts',
]

for (const file of FILES_WITH_STATIC_CLASS_BUNDLES) {
  check(`${file} is matched by a content glob`, matchesAnyGlob(file, contentGlobs))
}

section('No stale "JIT only scans ./app, ./components, ./pages" comments')

// These comments were accurate descriptions of the bug before the fix; if
// they're still present verbatim, either the fix regressed or someone
// copy-pasted the old (now-false) claim into a new file.
const STALE_CLAIM = /JIT scanner \(which only greps/

for (const file of [...FILES_WITH_STATIC_CLASS_BUNDLES, 'tailwind.config.ts']) {
  const source = readRepoFile(file)
  check(`${file} has no stale "only greps ./app, ./components, ./pages" claim`, !STALE_CLAIM.test(source))
}

section('Summary')
console.log(`${passed} passed, ${failures} failed`)

if (failures > 0) {
  process.exit(1)
}
