/**
 * Splits a published content item's markdown body into heading-delimited
 * chunks for AI Tutor retrieval (RAG v2 MVP --
 * planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md Section D). Server-only-safe
 * (no I/O itself). Pure function: takes the item's own metadata plus its
 * already-loaded markdown text and returns chunks -- it does not fetch
 * anything itself.
 *
 * Originally lib/ai/lesson-chunks.ts, lesson-only. Generalized to cover
 * IBM i Insights and Deep Dive guides too (AI Tutor Insights/Deep Dives
 * Grounding): every published content type in this app is authored as
 * Markdown with `##`-level section headings (lessons follow a fixed
 * 7-section template; Insights and Deep Dives use `##` for their major
 * sections, sometimes with `###` subsections nested underneath).
 *
 * Two behaviors added after PR review of the Insights/Deep Dives Grounding
 * change:
 *   1. Content appearing before the first `##` heading (real, substantial
 *      intro prose in both the QSYS2 and RPG-modernization Insights, ~900
 *      characters each) used to be silently dropped -- never chunked, never
 *      retrievable. It is now preserved as its own "Introduction" chunk.
 *   2. A single `##` section can be much larger than the 3,000-character
 *      current-page budget or even the 8,000-character overall retrieval
 *      budget (lib/ai/retrieve-published-content.ts) -- confirmed against
 *      real content: several sections in content/deep-dives/sql-error-
 *      handling-on-ibm-i.md exceed 4,000-8,700 characters, including a
 *      comparison table with no blank lines between rows (so no natural
 *      paragraph boundary at all). Both consumer loops always include at
 *      least one candidate chunk regardless of its size (to avoid
 *      returning an empty result), so an oversized chunk could single-
 *      handedly blow either budget. Rather than patch each consumer, the
 *      invariant is enforced once, here, at the source, with no exception:
 *      splitOversizedSection() guarantees no chunk this module emits ever
 *      exceeds MAX_CHUNK_CHARS (2,000 -- comfortably under both budgets),
 *      splitting along author-intended boundaries in priority order:
 *      `###` subsections first, then blank-line paragraphs. A paragraph
 *      that is itself still oversized (a large table, a large fenced code
 *      block) is split further at a line boundary -- never mid-line, so a
 *      table row or a line of code is never corrupted -- with a fenced
 *      code block additionally re-wrapped so every resulting piece is its
 *      own well-formed fence rather than a dangling/unterminated one. Only
 *      a single unbroken line/run with no line breaks at all (never seen
 *      in real content, but not impossible) falls through to a final
 *      hard slice at the nearest whitespace. All resulting pieces from one
 *      oversized `##` section share that section's heading (or, for a
 *      subsection split, "<section> — <subsection>"), so "Sources used"
 *      still shows one clean, coherent citation rather than several
 *      confusingly-numbered fragments.
 *
 * IMPORTANT: this module has no opinion about which content is safe to
 * chunk. The caller (lib/ai/retrieve-published-content.ts) is the single
 * enforcement point for "only Published/published content," exactly
 * mirroring how lib/lessons.ts's getPublishedLessons(), content/insights/
 * catalog.ts's getPublishedInsights(), and content/deep-dives/catalog.ts's
 * DEEP_DIVES.filter(isDeepDiveAvailable) are the only sources of content
 * metadata passed in here. Never call this with draft/review-ready/planned
 * content.
 *
 * Not tagged `server-only`: this module is pure (no fs/db access, just
 * string/regex processing of markdown text passed in by the caller) and is
 * imported directly by scripts/rag-regression.ts (PR #133) for regression
 * testing, which cannot run inside Next's server-component bundling context.
 * Only lib/ai/retrieve-published-content.ts (itself server-only) imports
 * this in the app, so nothing client-facing is affected.
 */
import type { AiContentType } from '@/components/ai-tutor/types'

export interface ChunkableContent {
  contentType: AiContentType
  slug: string
  title: string
  /** Canonical site-relative route, e.g. /learn/ibm-i-fundamentals/x, /insights/x, /deep-dives/x. */
  path: string
  tags: string[]
  /** Lesson-only taxonomy fields; always null for Insights and Deep Dives, which don't use the master-category system. */
  masterCategoryId: string | null
  masterSubcategory: string | null
  secondaryCategoryIds: string[]
}

export interface ContentChunk {
  contentType: AiContentType
  slug: string
  title: string
  path: string
  heading: string
  chunkText: string
  tags: string[]
  masterCategoryId: string | null
  masterSubcategory: string | null
  secondaryCategoryIds: string[]
}

const HEADING_RE = /^##\s+(.+)$/gm
const SUBHEADING_RE = /^###\s+(.+)$/gm
const CODE_FENCE_RE = /^```/

/** The heading used for content that appears before the first `##` -- real, substantial intro prose in this codebase's Insights (see module comment), previously dropped entirely. */
export const INTRODUCTION_HEADING = 'Introduction'

/**
 * No single chunk emitted by this module may exceed this many characters --
 * comfortably under both lib/ai/retrieve-published-content.ts's 3,000-
 * character current-page budget and its 8,000-character overall retrieval
 * budget, so an oversized `##` (or `###`) section can never single-handedly
 * exceed either one, even though both consumer loops always admit at least
 * one chunk regardless of size (to guarantee a non-empty guaranteed-current-
 * page bucket -- see selectGuaranteedChunks() in lib/ai/retrieval-score.ts).
 */
const MAX_CHUNK_CHARS = 2000

interface SplitPiece {
  heading: string
  text: string
}

/**
 * Splits markdown text into paragraphs on blank lines, except never inside
 * a fenced ``` code block -- a blank line inside a code sample must not
 * become a paragraph boundary, and the fence pair stays together with its
 * contents as one atomic unit that is never split mid-block.
 */
function splitIntoCodeAwareParagraphs(text: string): string[] {
  const lines = text.split('\n')
  const paragraphs: string[] = []
  let current: string[] = []
  let inCodeFence = false

  for (const line of lines) {
    if (CODE_FENCE_RE.test(line.trim())) {
      inCodeFence = !inCodeFence
      current.push(line)
      continue
    }
    if (!inCodeFence && line.trim() === '' && current.length > 0) {
      const paragraph = current.join('\n').trim()
      if (paragraph) paragraphs.push(paragraph)
      current = []
      continue
    }
    current.push(line)
  }
  if (current.length > 0) {
    const paragraph = current.join('\n').trim()
    if (paragraph) paragraphs.push(paragraph)
  }
  return paragraphs
}

/** True when a paragraph is exactly one fenced code block: an opening ``` line, a closing ``` line, and body lines in between. */
function isFencedCodeBlock(paragraph: string): boolean {
  const lines = paragraph.split('\n')
  return lines.length >= 2 && CODE_FENCE_RE.test(lines[0].trim()) && CODE_FENCE_RE.test(lines[lines.length - 1].trim())
}

/** Greedily groups lines into MAX_CHUNK_CHARS-sized batches. A line is the smallest unit ever split on here -- one table row, one code statement, one prose line -- so content is never cut mid-line. */
function groupLinesIntoBudget(lines: string[], maxChars: number): string[][] {
  const groups: string[][] = []
  let current: string[] = []
  let currentLen = 0
  for (const line of lines) {
    const lineLen = line.length + 1 // +1 for the joining newline
    if (currentLen + lineLen > maxChars && current.length > 0) {
      groups.push(current)
      current = []
      currentLen = 0
    }
    current.push(line)
    currentLen += lineLen
  }
  if (current.length > 0) groups.push(current)
  return groups
}

/**
 * Absolute last resort: hard-slices text at the nearest preceding
 * whitespace so a word is never cut in half. Only ever reached for a
 * single unbroken line/run that is itself larger than MAX_CHUNK_CHARS (no
 * blank lines, no line breaks, no fence to key off of) -- everything else
 * is handled by a real structural boundary first.
 */
function hardSliceAtWhitespace(text: string): string[] {
  const pieces: string[] = []
  let remaining = text
  while (remaining.length > MAX_CHUNK_CHARS) {
    let cut = remaining.lastIndexOf(' ', MAX_CHUNK_CHARS)
    if (cut <= 0) cut = MAX_CHUNK_CHARS
    pieces.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }
  if (remaining) pieces.push(remaining)
  return pieces
}

/**
 * Splits a single paragraph that is, on its own, over MAX_CHUNK_CHARS --
 * this is what guarantees no chunk this module ever emits can exceed the
 * cap, with no exception, even for content with no smaller natural
 * boundary (a markdown table with no blank lines between rows; one very
 * large fenced code block). Always splits at a line boundary first (never
 * mid-line, so a table row or a line of code is never corrupted); a fenced
 * code block is additionally re-wrapped so every resulting piece is its
 * own syntactically well-formed fence, never a dangling/unterminated one.
 */
function splitOversizedParagraph(paragraph: string): string[] {
  if (isFencedCodeBlock(paragraph)) {
    const lines = paragraph.split('\n')
    const openFence = lines[0]
    const closeFence = lines[lines.length - 1]
    const bodyLines = lines.slice(1, -1)
    const overhead = openFence.length + closeFence.length + 2
    const groups = groupLinesIntoBudget(bodyLines, Math.max(MAX_CHUNK_CHARS - overhead, 200))
    return groups.length > 0 ? groups.map((g) => [openFence, ...g, closeFence].join('\n')) : [paragraph]
  }

  const lineGroups = groupLinesIntoBudget(paragraph.split('\n'), MAX_CHUNK_CHARS)
  return lineGroups.flatMap((g) => {
    const joined = g.join('\n')
    return joined.length > MAX_CHUNK_CHARS ? hardSliceAtWhitespace(joined) : [joined]
  })
}

/** Accumulates code-aware paragraphs into MAX_CHUNK_CHARS-sized pieces. A single paragraph that is itself over budget (a large table with no blank lines, or a large fenced code block) is further split by splitOversizedParagraph() rather than exceeding the cap. */
function splitByParagraph(text: string): string[] {
  const paragraphs = splitIntoCodeAwareParagraphs(text)
  if (paragraphs.length === 0) return []

  const pieces: string[] = []
  let current = ''
  for (const paragraph of paragraphs) {
    if (paragraph.length > MAX_CHUNK_CHARS) {
      if (current) {
        pieces.push(current)
        current = ''
      }
      pieces.push(...splitOversizedParagraph(paragraph))
      continue
    }
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph
    if (candidate.length > MAX_CHUNK_CHARS && current) {
      pieces.push(current)
      current = paragraph
    } else {
      current = candidate
    }
  }
  if (current) pieces.push(current)
  return pieces
}

/**
 * Splits one oversized section's text into safe-sized pieces, preferring
 * `###` subsection boundaries (a real, author-intended structure -- each
 * subsection gets its own "<heading> — <subheading>" label) and falling
 * back to code-aware paragraph accumulation for anything still too large
 * (or when there are no `###` subheadings at all). A section already
 * within budget is returned unchanged as a single piece.
 */
function splitOversizedSection(heading: string, text: string): SplitPiece[] {
  if (text.length <= MAX_CHUNK_CHARS) {
    return [{ heading, text }]
  }

  const subMatches = [...text.matchAll(SUBHEADING_RE)]
  if (subMatches.length > 0) {
    const pieces: SplitPiece[] = []
    if (subMatches[0].index! > 0) {
      const before = text.slice(0, subMatches[0].index!).trim()
      if (before) pieces.push({ heading, text: before })
    }
    for (let i = 0; i < subMatches.length; i++) {
      const start = subMatches[i].index!
      const end = i + 1 < subMatches.length ? subMatches[i + 1].index! : text.length
      const subheading = subMatches[i][1].trim()
      const subText = text.slice(start, end).trim()
      if (subText) pieces.push({ heading: `${heading} — ${subheading}`, text: subText })
    }
    // Any piece that's still oversized (a long individual subsection, or a
    // long pre-first-### remainder) gets paragraph-split next, keeping its
    // own heading so a subsection split into multiple paragraph pieces
    // still reads as one coherent citation.
    return pieces.flatMap((piece) =>
      piece.text.length > MAX_CHUNK_CHARS
        ? splitByParagraph(piece.text).map((pieceText) => ({ heading: piece.heading, text: pieceText }))
        : [piece]
    )
  }

  const paragraphPieces = splitByParagraph(text)
  return paragraphPieces.length > 0 ? paragraphPieces.map((pieceText) => ({ heading, text: pieceText })) : [{ heading, text }]
}

/**
 * Split a content item's markdown body into one chunk per `##` heading
 * (plus a leading "Introduction" chunk for any content before the first
 * one), or a single fallback chunk if it has no `##` headings at all. Every
 * emitted chunk is capped at MAX_CHUNK_CHARS -- see splitOversizedSection().
 */
export function chunkMarkdownContent(content: ChunkableContent, markdown: string): ContentChunk[] {
  const base = {
    contentType: content.contentType,
    slug: content.slug,
    title: content.title,
    path: content.path,
    tags: content.tags,
    masterCategoryId: content.masterCategoryId,
    masterSubcategory: content.masterSubcategory,
    secondaryCategoryIds: content.secondaryCategoryIds,
  }

  // Strip a leading "# Title" line -- it's redundant with title, which
  // every chunk already carries. Insights never have one (catalog carries
  // the title instead), so this is a no-op for them.
  const withoutTitle = markdown.replace(/^#\s+.+\r?\n+/, '')

  const matches = [...withoutTitle.matchAll(HEADING_RE)]

  if (matches.length === 0) {
    const text = withoutTitle.trim()
    if (!text) return []
    return splitOversizedSection(content.title, text).map((piece) => ({ ...base, heading: piece.heading, chunkText: piece.text }))
  }

  const chunks: ContentChunk[] = []

  if (matches[0].index! > 0) {
    const introText = withoutTitle.slice(0, matches[0].index!).trim()
    if (introText) {
      for (const piece of splitOversizedSection(INTRODUCTION_HEADING, introText)) {
        chunks.push({ ...base, heading: piece.heading, chunkText: piece.text })
      }
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const heading = match[1].trim()
    const start = match.index! + match[0].length
    const end = i + 1 < matches.length ? matches[i + 1].index! : withoutTitle.length
    const chunkText = withoutTitle.slice(start, end).trim()
    if (chunkText) {
      for (const piece of splitOversizedSection(heading, chunkText)) {
        chunks.push({ ...base, heading: piece.heading, chunkText: piece.text })
      }
    }
  }
  return chunks
}
