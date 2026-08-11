/**
 * TechArticle / BreadcrumbList JSON-LD builders for Insight detail pages
 * (PR #194). Pulled out of app/insights/[slug]/page.tsx into their own pure,
 * framework-free module -- same reasoning as lib/deep-dive-render.ts being
 * separate from app/deep-dives/[slug]/page.tsx -- so scripts/insights-
 * regression.ts can import and assert on them directly without needing to
 * import a Next.js page module (which pulls in next/navigation and a
 * request context) into a standalone tsx script.
 */
import { SITE_NAME, SITE_URL } from './config'
import type { Insight } from './insights'

export function buildInsightStructuredData(insight: Insight) {
  const url = `${SITE_URL}/insights/${insight.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: insight.title,
    description: insight.description,
    url,
    mainEntityOfPage: url,
    datePublished: insight.publishedAt,
    ...(insight.updatedAt ? { dateModified: insight.updatedAt } : {}),
    author: { '@type': 'Person', name: 'Vikash Choudhary' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}

export function buildBreadcrumbStructuredData(insight: Insight) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'IBM i Insights', item: `${SITE_URL}/insights` },
      { '@type': 'ListItem', position: 3, name: insight.title, item: `${SITE_URL}/insights/${insight.slug}` },
    ],
  }
}
