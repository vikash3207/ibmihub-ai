/**
 * Shared BreadcrumbList JSON-LD builder for the Deep Dive and Insight
 * readers (Deep Dives, IBM i Insights and Reader-Experience Polish).
 *
 * Generalized out of lib/insight-structured-data.ts's own
 * buildBreadcrumbStructuredData(insight), which only ever built a 3-level
 * Home -> IBM i Insights -> {title} breadcrumb. The Deep Dive reader had no
 * BreadcrumbList at all despite the same 3-level shape applying equally
 * (Home -> Deep Dives -> {title}) -- this is the one, shared builder both
 * readers now call, rather than two near-identical hand-written object
 * literals drifting apart over time.
 *
 * Framework-free (no Next.js import) so scripts/*-regression.ts can import
 * and execute it directly, same reasoning as lib/insight-structured-data.ts.
 */
import { SITE_URL } from './config'

export interface ReaderBreadcrumbSegment {
  name: string
  /** Site-relative path, e.g. '/deep-dives' or '/deep-dives/sql-on-ibm-i'. */
  path: string
}

export function buildReaderBreadcrumbStructuredData(section: ReaderBreadcrumbSegment, article: ReaderBreadcrumbSegment) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: section.name, item: `${SITE_URL}${section.path}` },
      { '@type': 'ListItem', position: 3, name: article.name, item: `${SITE_URL}${article.path}` },
    ],
  }
}
