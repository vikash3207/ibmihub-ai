/**
 * Deep Dive-specific HTML post-processing (PR #158 -- Reader Sidebar +
 * Visual Polish). Deliberately layered ON TOP of lib/markdown.ts's
 * renderLessonMarkdown() output, never inside it -- that function is
 * shared with the lesson detail route, and lessons have no TOC/callout
 * requirement. Keeping these transforms in their own module means the
 * lesson rendering pipeline is untouched by this PR.
 *
 * Both functions are plain string transforms over already-sanitized HTML
 * (produced by a remark pipeline that never enables allowDangerousHtml --
 * see lib/markdown.ts), so they carry the same dangerouslySetInnerHTML
 * safety guarantee the HTML already had.
 */

export interface DeepDiveTocItem {
  id: string
  title: string
  level: 2 | 3
}

const HEADING_PATTERN = /<h([23])>([\s\S]*?)<\/h\1>/g

/**
 * Decodes every character reference form rehype-stringify can actually
 * produce inside heading text, not just named ones.
 *
 * Root cause of a real, live bug (Deep Dives, IBM i Insights and
 * Reader-Experience Polish): rehype-stringify's default entity encoder does
 * NOT use named references for `<`/`&` in text content -- it emits hex
 * numeric character references instead (confirmed directly against this
 * pipeline: a heading containing a literal `<` renders as `<h3>...&#x3C;...</h3>`,
 * never `&lt;`). The previous version of this function only handled a
 * hardcoded list of named entities, so any heading with a literal `<` or `&`
 * (e.g. a Deep Dive section titled `Why \`SqlCode < 0\` alone is
 * insufficient`) left the raw text "&#x3C;" in the extracted TOC title --
 * and since that title is later interpolated as plain JSX text (which does
 * not itself interpret HTML entities), the literal string "&#x3C;" rendered
 * visibly in the sidebar instead of "<". The heading anchor id was affected
 * too (slugify() stripped the entity's punctuation into an "x3c" fragment).
 *
 * Numeric references are decoded generically (any codepoint, not a fixed
 * list) before the small set of named ones this pipeline can also emit, so
 * this stays correct even if remark/rehype's own encoding choices change --
 * fixed at this rendering layer, not with a page-level string replacement.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_match, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_match, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '')
}

/**
 * Deep Dive headings are numbered ("1. Why SQL...") in the article body.
 * The anchor `id` is generated from the ordinal-free text so it stays
 * stable if a section is ever renumbered (adding/removing/reordering a
 * heading shouldn't silently break an existing external link or bookmark
 * pointing at #why-sql-on-ibm-i-is-different). The TOC's displayed
 * *title* is a separate concern -- PR #161 fixed a bug where it was built
 * from this same ordinal-free text, so the sidebar showed "Where you'll
 * actually type SQL" while the article showed "2. Where you'll actually
 * type SQL" a few hundred pixels to the right. The TOC title now uses the
 * heading's full original text (see addDeepDiveHeadingAnchors below) so
 * it matches the article exactly; only the id keeps using this stripped
 * version.
 */
function stripOrdinalPrefix(text: string): string {
  return text.replace(/^\d+\.\s*/, '')
}

function slugify(text: string, seen: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'section'

  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

/**
 * Adds a stable `id` to every h2/h3 in a Deep Dive's rendered body HTML and
 * returns a flat table of contents alongside the (lightly) modified HTML.
 * Ids are derived from each heading's own text, so no manual per-Deep-Dive
 * TOC list needs to be maintained -- add a heading to the Markdown source
 * and it automatically appears in the sidebar. Collisions (two headings
 * that slugify to the same id) are disambiguated with a numeric suffix.
 */
export function addDeepDiveHeadingAnchors(html: string): { html: string; toc: DeepDiveTocItem[] } {
  const toc: DeepDiveTocItem[] = []
  const seen = new Map<string, number>()

  const withAnchors = html.replace(HEADING_PATTERN, (_match, level: string, inner: string) => {
    const plainText = decodeEntities(stripTags(inner)).trim()
    const id = slugify(stripOrdinalPrefix(plainText), seen)
    toc.push({ id, title: plainText, level: Number(level) as 2 | 3 })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })

  return { html: withAnchors, toc }
}

export interface DeepDiveTocGroup {
  heading: DeepDiveTocItem
  children: DeepDiveTocItem[]
}

/**
 * Groups a flat h2/h3 TOC list into { heading, children } pairs (Deep
 * Dives, IBM i Insights and Reader-Experience Polish -- TOC simplification).
 * Lives here (a plain, framework-free module already imported by
 * scripts/deep-dive-toc-regression.ts) rather than inside
 * components/deep-dive-toc.tsx, which is a 'use client' component -- same
 * "pure logic stays out of the client component" convention lib/nav-links.ts
 * already documents for the same reason: it keeps this function safely,
 * directly importable from a standalone regression script.
 *
 * Every h2 becomes its own group, in order; every h3 joins the most recent
 * h2's `children`. An h3 with no preceding h2 (not expected from real
 * article content -- addDeepDiveHeadingAnchors() above only ever sees a
 * real article's own heading order -- but not impossible for a hand-built
 * item list in a test) becomes its own top-level group rather than being
 * silently dropped, so no real heading can ever disappear from the TOC.
 */
export function groupTocItems(items: DeepDiveTocItem[]): DeepDiveTocGroup[] {
  const groups: DeepDiveTocGroup[] = []
  for (const item of items) {
    if (item.level === 2) {
      groups.push({ heading: item, children: [] })
      continue
    }
    const lastGroup = groups[groups.length - 1]
    if (lastGroup) {
      lastGroup.children.push(item)
    } else {
      groups.push({ heading: item, children: [] })
    }
  }
  return groups
}

/**
 * Which group's children should currently be expanded (Deep Dives, IBM i
 * Insights and Reader-Experience Polish -- follow-up fix). A review found
 * the original grouping fell back to "every group expanded" whenever
 * `activeId` was still null -- true on first paint, and permanently true if
 * no heading ever happened to intersect the observer's active band. That
 * defeated the whole point of grouping a long TOC.
 *
 * One rule now covers every case the caller needs (initial load, a
 * hash-targeted heading, and live scroll tracking all just become a
 * different `activeId` input to this same function):
 *  - `activeId` names a real heading (h2 or h3) that belongs to one of
 *    `groups` -> that heading's OWNING group (its own group if it's an h2,
 *    its parent's group if it's an h3).
 *  - Anything else (null, or an id that matches nothing -- an unknown hash,
 *    for instance) -> the first group, so there is always exactly one
 *    expanded group, never zero and never "all of them".
 *  - No groups at all -> null (nothing to expand).
 *
 * Pure and side-effect free so it can be unit-tested directly against
 * synthetic group lists, the same reasoning groupTocItems() above already
 * documents.
 */
export function resolveExpandedGroupId(groups: DeepDiveTocGroup[], activeId: string | null): string | null {
  if (groups.length === 0) return null

  if (activeId) {
    const owningGroup = groups.find((group) => group.heading.id === activeId || group.children.some((child) => child.id === activeId))
    if (owningGroup) return owningGroup.heading.id
  }

  return groups[0].heading.id
}

/**
 * Resolves a URL fragment (e.g. `location.hash`, with or without its
 * leading "#") to a real heading id from `items`, or null if the fragment
 * is empty or doesn't match any known heading -- an unknown/stale hash must
 * fall back safely, never be trusted as-is. Deliberately takes the hash as
 * a plain string rather than reading `window.location` itself, so it stays
 * pure and testable without a DOM; the one caller in
 * components/deep-dive-toc.tsx is what actually reads `window.location.hash`.
 */
export function resolveHashHeadingId(items: DeepDiveTocItem[], hash: string | null | undefined): string | null {
  if (!hash) return null
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  if (!id) return null
  return items.some((item) => item.id === id) ? id : null
}

/**
 * Best-effort classification of `> ...` blockquotes into a small set of
 * callout styles (Note, Best practice, Common mistake, Warning, Interview),
 * based on the first bold lead-in text inside the blockquote -- the pattern
 * every callout in the current Deep Dive content already follows (e.g.
 * "> **Worth noticing:** ..."). A blockquote with no bold lead-in, or one
 * that doesn't match a known keyword, is left with no extra class and keeps
 * the existing generic blockquote styling (components/lesson-content.tsx's
 * prose-blockquote rules) -- there is no content rewriting here, only an
 * additive class on blockquotes that already exist.
 */
function classifyCallout(innerHtml: string): string | null {
  const label = innerHtml.match(/<strong>([\s\S]+?)<\/strong>/)?.[1]?.toLowerCase() ?? ''
  if (!label) return null

  if (/drop|destructive|permanently deletes|no undo/.test(label)) return 'callout-warning'
  if (/mistake|gotcha/.test(label)) return 'callout-mistake'
  if (/best practice|habit to build|\brule\b/.test(label)) return 'callout-best-practice'
  if (/interview/.test(label)) return 'callout-interview'
  if (/worth noticing|\bnote\b/.test(label)) return 'callout-note'
  return null
}

export function tagDeepDiveCallouts(html: string): string {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (match, inner: string) => {
    const className = classifyCallout(inner)
    return className ? `<blockquote class="${className}">${inner}</blockquote>` : match
  })
}

/**
 * Wraps every rendered `<table>` in a `<div class="dd-table-wrap">` so
 * app/globals.css can give Deep Dive tables real table layout (wrapping,
 * full-width columns) while still falling back to horizontal scroll on the
 * *wrapper* -- not the table itself -- for the rare table too wide to fit
 * even with wrapping (e.g. the trigger buffer field table). Deep Dive
 * content only ever emits plain, non-nested `<table>` elements (GFM pipe
 * tables via remark-gfm), so this simple non-greedy match is safe -- same
 * assumption tagDeepDiveCallouts above already relies on for blockquotes.
 *
 * Scoped to this module (not lib/markdown.ts) so lesson pages, which share
 * the same base `.prose table` rules, are completely unaffected.
 */
export function wrapDeepDiveTables(html: string): string {
  return html.replace(/<table>[\s\S]*?<\/table>/g, (match) => `<div class="dd-table-wrap">${match}</div>`)
}
