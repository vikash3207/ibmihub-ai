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

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
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
