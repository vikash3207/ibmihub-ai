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

export async function renderLessonMarkdown(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}
