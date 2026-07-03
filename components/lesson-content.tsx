/**
 * Renders pre-sanitized lesson HTML produced by lib/markdown.ts.
 * Safe to use dangerouslySetInnerHTML here: the HTML comes from our own
 * repository-controlled Markdown files via a pipeline that never enables
 * `allowDangerousHtml`, so no raw HTML or scripts from the source file can
 * reach the DOM -- see lib/markdown.ts for the rendering pipeline.
 */
export function LessonContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-slate max-w-none prose-pre:overflow-x-auto prose-pre:bg-slate-900 prose-pre:text-slate-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
