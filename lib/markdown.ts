/**
 * Lesson Markdown -> HTML rendering.
 * Approved pipeline (IMP-Q-001): remark -> remark-gfm -> remark-rehype -> rehype-stringify.
 *
 * Safety: remark-rehype is used WITHOUT `allowDangerousHtml`. Any literal HTML
 * typed inside a lesson .md file is treated as plain text, not parsed as live
 * markup -- this is what makes it safe to render the resulting string with
 * dangerouslySetInnerHTML in components/lesson-content.tsx. Do not add the
 * `allowDangerousHtml` option or a raw-HTML rehype plugin without re-reviewing
 * that safety assumption.
 */

import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

/**
 * Every lesson .md file starts with a "# Title" line matching lesson.title,
 * which app/learn/ibm-i-fundamentals/[slug]/page.tsx already renders as its
 * own styled <h1> above the body. Left in, that line rendered a second,
 * unstyled <h1> at the top of the body -- a visible duplicate title (PR
 * #140 visual polish fix). Mirrors the identical stripping already done
 * for AI Tutor grounding in lib/ai/lesson-chunks.ts, for the same reason.
 */
function stripLeadingTitle(markdown: string): string {
  return markdown.replace(/^#\s+.+\r?\n+/, '')
}

/**
 * Every lesson in this course follows the same fixed 7-heading template
 * (confirmed across the content set, and already relied on for AI Tutor
 * RAG chunking in lib/ai/lesson-chunks.ts). This is what makes exact-text
 * matching safe here rather than fragile: these are not guessed prefixes,
 * they're a heading vocabulary that is already load-bearing elsewhere.
 * A heading that doesn't match one of these exact strings is simply left
 * alone -- generic prose-h2 styling still applies, nothing breaks.
 */
const KNOWN_HEADING_CLASSES: Record<string, string> = {
  'Learning Objective': 'lesson-heading--objective',
  'Simple Explanation': 'lesson-heading--explanation',
  'Why It Matters': 'lesson-heading--why',
  'Practical Example': 'lesson-heading--example',
  'Common Confusions': 'lesson-heading--mistake',
  'Quick Recap': 'lesson-heading--summary',
  'Try Asking the AI Tutor': 'lesson-heading--ai-tutor',
}

function tagKnownHeadings(html: string): string {
  let result = html
  for (const [text, className] of Object.entries(KNOWN_HEADING_CLASSES)) {
    result = result.split(`<h2>${text}</h2>`).join(`<h2 class="${className}">${text}</h2>`)
  }
  return result
}

/**
 * Friendly, title-cased labels for the fenced-code-block languages actually
 * used across the lesson content set. Anything not in this list falls back
 * to the language identifier itself (upper-cased) via tagCodeBlockLanguages,
 * and a block with no language at all keeps the generic "Code" label that
 * app/globals.css already applies by default.
 */
const LANGUAGE_LABELS: Record<string, string> = {
  rpgle: 'RPGLE',
  clle: 'CLLE',
  sql: 'SQL',
  json: 'JSON',
  text: 'Text',
  cobol: 'COBOL',
  dds: 'DDS',
}

/**
 * remark-rehype/rehype-stringify render a fenced ```lang block as exactly
 * `<pre><code class="language-lang">`. Matching that literal, narrow
 * pattern (not a general HTML parse) and tagging the `<pre>` with a
 * `data-lang-label` attribute lets app/globals.css show a language-specific
 * label via `content: attr(data-lang-label)` -- see the CSS rule there.
 */
function tagCodeBlockLanguages(html: string): string {
  return html.replace(/<pre><code class="language-([a-z0-9]+)">/g, (match, lang: string) => {
    const label = LANGUAGE_LABELS[lang] ?? lang.toUpperCase()
    return `<pre data-lang-label="${label}"><code class="language-${lang}">`
  })
}

export async function renderLessonMarkdown(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(stripLeadingTitle(markdown))

  return tagCodeBlockLanguages(tagKnownHeadings(String(file)))
}
