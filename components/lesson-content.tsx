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
      className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:shadow-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
