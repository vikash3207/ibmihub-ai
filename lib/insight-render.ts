/**
 * Insight figure-embedding mechanism (PR #199 -- first published Insight).
 *
 * lib/markdown.ts's renderLessonMarkdown() deliberately never enables
 * remark-rehype's `allowDangerousHtml` (see that file's header comment) --
 * literal HTML typed inside a .md file is escaped as plain text, not parsed
 * as live markup. That's a safety property this module does not touch. So a
 * rich, original React/SVG diagram can't be embedded as raw HTML inside an
 * Insight's Markdown body; it has to be composed AFTER rendering, from
 * outside the dangerouslySetInnerHTML boundary.
 *
 * The convention: an Insight's .md source places a figure placeholder on its
 * own paragraph, e.g.
 *
 *   [[FIGURE:architecture]]
 *
 * remark renders that (like any other plain-text paragraph) as literally
 * `<p>[[FIGURE:architecture]]</p>` -- no HTML parsing involved, so it's
 * exactly as safe as any other paragraph of prose. splitOnFigureMarkers()
 * then splits the *already-rendered, already-sanitized* HTML string on that
 * literal pattern. String.prototype.split() with a capturing-group regex
 * interleaves the captured group into the result array, so the output
 * alternates plain HTML chunks and bare figure names:
 *
 *   ["<p>intro</p>", "architecture", "<p>more prose</p>", "request-lifecycle", "..."]
 *
 * The page component renders each string chunk through the existing
 * <LessonContent> (still dangerouslySetInnerHTML of pre-sanitized HTML,
 * unchanged) and looks up each figure name in a real, hand-written React
 * component registry -- never anything derived from file content.
 * addDeepDiveHeadingAnchors()/tagDeepDiveCallouts()/wrapDeepDiveTables()
 * still run once over the *whole* HTML string before splitting, so heading
 * ids/TOC ordering and callout/table classification stay globally correct
 * regardless of where a figure marker falls.
 */

const FIGURE_MARKER_PATTERN = /<p>\[\[FIGURE:([a-z0-9-]+)\]\]<\/p>/g

export type InsightContentSegment = { type: 'html'; html: string } | { type: 'figure'; name: string }

export function splitInsightHtmlOnFigureMarkers(html: string): InsightContentSegment[] {
  const parts = html.split(FIGURE_MARKER_PATTERN)
  const segments: InsightContentSegment[] = []

  parts.forEach((part, index) => {
    // split() alternates unmatched text (even indices) and the captured
    // group -- the figure name -- at odd indices.
    if (index % 2 === 1) {
      segments.push({ type: 'figure', name: part })
    } else if (part.trim().length > 0) {
      segments.push({ type: 'html', html: part })
    }
  })

  return segments
}
