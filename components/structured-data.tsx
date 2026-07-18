/**
 * Renders a JSON-LD <script> tag (PR #159 -- SEO crawling/indexing audit).
 * Every caller passes a plain object built entirely from trusted,
 * server-known values (site config, catalog/lesson metadata already
 * rendered elsewhere on the same page) -- never raw user input -- so
 * JSON.stringify-ing it and injecting via dangerouslySetInnerHTML carries
 * no XSS risk the same way lib/markdown.ts's already-sanitized HTML
 * doesn't. `</script` is escaped defensively anyway: JSON.stringify never
 * escapes forward slashes, so a stray "</script>" inside a string value
 * (e.g. a description someone writes in the future) could otherwise
 * terminate the tag early.
 */
export function StructuredData({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/<\/script/gi, '<\\/script')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
