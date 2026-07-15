/**
 * Renders pre-sanitized lesson HTML produced by lib/markdown.ts.
 * Safe to use dangerouslySetInnerHTML here: the HTML comes from our own
 * repository-controlled Markdown files via a pipeline that never enables
 * `allowDangerousHtml`, so no raw HTML or scripts from the source file can
 * reach the DOM -- see lib/markdown.ts for the rendering pipeline.
 *
 * Prose styling (PR #140 visual polish) is grouped by element below for
 * maintainability. Fenced-code-block and table overrides continue in
 * app/globals.css -- see that file's comments for why (inline-code-vs-
 * code-block bleed, and a plain-CSS responsive-table technique that isn't
 * expressible as a `prose-*` modifier).
 */
const LESSON_PROSE_CLASSES = [
  'prose prose-slate max-w-none',

  // Headings -- clearer hierarchy and stronger visual separation between sections.
  'prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900',
  // (Tailwind Typography already zeroes out the very first child's margin-top, so the
  // first heading in a lesson body doesn't need special-casing here.)
  'prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100',
  'prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3',

  // Paragraphs.
  'prose-p:leading-relaxed prose-p:text-slate-700',

  // Lists -- more breathing room between items than the plugin default.
  'prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:marker:text-slate-400',

  // Links and emphasis.
  'prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline',
  'prose-strong:text-slate-900 prose-strong:font-semibold',

  // Blockquotes -- a soft callout treatment instead of the plugin's default italic look,
  // ready for lesson content that uses Note:/Tip:/Important:-style blockquotes.
  'prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-slate-700',
  'prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50/40',
  'prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4',

  // Inline code.
  'prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5',
  'prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none',

  // Fenced code blocks -- padding-top/label/table scroll continue in app/globals.css.
  'prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-800',
  'prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:shadow-sm',

  // Tables -- horizontal scroll is handled in app/globals.css; this just tidies borders/spacing.
  'prose-table:text-sm prose-th:font-semibold prose-th:text-slate-700',
  'prose-thead:border-b prose-thead:border-slate-200 prose-tr:border-slate-100',

  // Horizontal rules -- subtle section breaks.
  'prose-hr:my-10 prose-hr:border-slate-100',
].join(' ')

export function LessonContent({ html }: { html: string }) {
  return <div className={LESSON_PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: html }} />
}
