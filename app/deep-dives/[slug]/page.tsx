import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { isDeepDiveAvailable, type DeepDive } from '@/lib/deep-dives'
import { loadDeepDiveMarkdown } from '@/lib/deep-dive-content'
import { renderLessonMarkdown } from '@/lib/markdown'
import { addDeepDiveHeadingAnchors, tagDeepDiveCallouts, type DeepDiveTocItem } from '@/lib/deep-dive-render'
import { LessonContent } from '@/components/lesson-content'
import { DeepDiveToc } from '@/components/deep-dive-toc'
import { StructuredData } from '@/components/structured-data'
import { DEEP_DIVE_CATEGORIES, DEEP_DIVE_ACCENT_CLASSES, getDeepDiveAccent } from '@/lib/deep-dive-categories'
import { getPublishedLessonBySlugOrNull } from '@/lib/lessons'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Deep Dive detail page (PR #156 -- first published Deep Dive: SQL on IBM i).
 *
 * No auth dependency (unlike the lesson detail route) -- Deep Dives are
 * public, non-linear, and have no progress/completion tracking, so this
 * page is statically generated via generateStaticParams() over the
 * repository-committed DEEP_DIVES catalog rather than force-dynamic.
 *
 * Only `published` catalog entries resolve here; `planned`/`review-ready`
 * slugs (and unknown slugs) 404 via notFound(), the same way an
 * unpublished lesson slug 404s from getPublishedLessonBySlug().
 */
function findPublishedDeepDive(slug: string): DeepDive | undefined {
  const deepDive = DEEP_DIVES.find((d) => d.slug === slug)
  return deepDive && isDeepDiveAvailable(deepDive) ? deepDive : undefined
}

export function generateStaticParams() {
  return DEEP_DIVES.filter(isDeepDiveAvailable).map((deepDive) => ({ slug: deepDive.slug }))
}

/**
 * Per-slug SEO description overrides (Product Owner-provided copy distinct
 * from the card-facing `description` in the catalog). Falls back to the
 * catalog description for any published Deep Dive that doesn't have one.
 */
const SEO_DESCRIPTIONS: Partial<Record<string, string>> = {
  'sql-on-ibm-i':
    'Learn SQL on IBM i with practical Db2 for i examples covering schemas, tables, joins, CTEs, SQLCODE, catalog queries, constraints, indexes, views, authority, and production practices.',
  'embedded-sql-in-rpgle':
    'Learn embedded SQL in RPGLE on IBM i with practical SQLRPGLE examples covering host variables, indicator variables, SELECT INTO, cursor loops, SQLCODE, commitment control, dynamic SQL, and production practices.',
  'sql-cursors-on-ibm-i':
    'Learn SQL cursors on IBM i with practical SQLRPGLE examples covering DECLARE, OPEN, FETCH, CLOSE, scrollable cursors, WHERE CURRENT OF, multi-row fetch, SQLERRD(3), WITH HOLD, SQLCODE handling, and production practices.',
}

function getSeoDescription(deepDive: DeepDive): string {
  return SEO_DESCRIPTIONS[deepDive.slug] ?? deepDive.description
}

/**
 * TechArticle structured data (PR #159 -- SEO crawling/indexing audit).
 * `author` is the site's actual author, not a claim of IBM affiliation --
 * `publisher` is iRPGenie itself, an independent, unofficial resource.
 * `dateModified` only appears when the catalog entry actually has a
 * `lastUpdated` value; there's nothing to report otherwise.
 */
function buildDeepDiveStructuredData(deepDive: DeepDive, description: string) {
  const url = `${SITE_URL}/deep-dives/${deepDive.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${deepDive.title} Deep Dive`,
    description,
    url,
    mainEntityOfPage: url,
    ...(deepDive.lastUpdated ? { dateModified: deepDive.lastUpdated } : {}),
    author: { '@type': 'Person', name: 'Vikash Choudhary' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const deepDive = findPublishedDeepDive(slug)
  if (!deepDive) return {}

  const title = `${deepDive.title} Deep Dive`
  const description = getSeoDescription(deepDive)

  return {
    title,
    description,
    alternates: { canonical: `/deep-dives/${deepDive.slug}` },
    openGraph: { title, description, url: `/deep-dives/${deepDive.slug}` },
  }
}

export default async function DeepDivePage({ params }: Props) {
  const { slug } = await params
  const deepDive = findPublishedDeepDive(slug)

  if (!deepDive) {
    notFound()
  }

  const accent = getDeepDiveAccent(deepDive.category)
  const accentClasses = DEEP_DIVE_ACCENT_CLASSES[accent]
  const categoryLabel = DEEP_DIVE_CATEGORIES.find((c) => c.id === deepDive.category)?.label ?? deepDive.category

  let bodyHtml = ''
  let toc: DeepDiveTocItem[] = []
  let loadError = false
  try {
    const markdown = await loadDeepDiveMarkdown(deepDive)
    const rendered = await renderLessonMarkdown(markdown)
    const withAnchors = addDeepDiveHeadingAnchors(rendered)
    bodyHtml = tagDeepDiveCallouts(withAnchors.html)
    toc = withAnchors.toc
  } catch {
    loadError = true
  }

  // Only ever links to lessons that are still actually Published right now
  // -- a lesson that gets unpublished later simply drops out of this list
  // instead of becoming a dead link, the same guarantee getPublishedLessons()
  // already gives every other public page.
  const relatedLessons = deepDive.relatedLessonSlugs
    ? (
        await Promise.all(deepDive.relatedLessonSlugs.map((lessonSlug) => getPublishedLessonBySlugOrNull(lessonSlug)))
      ).filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== null)
    : []

  const relatedDeepDiveSlugs = deepDive.relatedDeepDiveSlugs ?? []
  const relatedDeepDives = DEEP_DIVES.filter((d) => relatedDeepDiveSlugs.includes(d.slug))

  const seoDescription = getSeoDescription(deepDive)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StructuredData data={buildDeepDiveStructuredData(deepDive, seoDescription)} />
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <Link href="/deep-dives" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600">
            <span aria-hidden="true">&larr;</span> All Deep Dives
          </Link>

          <div className="mt-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-10">
            <DeepDiveToc items={toc} />

            <article className={`max-w-3xl space-y-8 rounded-2xl border-t-4 bg-white p-6 shadow-sm sm:p-8 ${accentClasses.topBorder}`}>
              <div
                className={`-mx-6 -mt-6 rounded-t-2xl border-b border-slate-100 px-6 pb-6 pt-6 sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-8 ${accentClasses.headerWash}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${accentClasses.badgeBg} ${accentClasses.badgeText} ${accentClasses.badgeBorder}`}
                  >
                    {categoryLabel}
                  </span>
                  <Badge variant="success">Available</Badge>
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{deepDive.title}</h1>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">{deepDive.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  {deepDive.estimatedReadTime && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-600">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      ~{deepDive.estimatedReadTime} min read
                    </span>
                  )}
                  {deepDive.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {loadError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-800">
                  This Deep Dive could not be loaded right now. Please try again later, or{' '}
                  <Link href="/deep-dives" prefetch={false} className="underline">
                    return to Deep Dives
                  </Link>
                  .
                </div>
              ) : (
                <div className="deep-dive-article">
                  <LessonContent html={bodyHtml} />
                </div>
              )}

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                <Link href="/practice-lab/sql" className={buttonVariants({ variant: 'secondary' })}>
                  Try the SQL Practice Console
                </Link>
                <Link href={`/practice?topic=${encodeURIComponent('advanced-sql')}`} className={buttonVariants({ variant: 'secondary' })}>
                  Practice questions
                </Link>
              </div>

              {relatedLessons.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Related lessons</h2>
                  <ul className="space-y-2">
                    {relatedLessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <Link
                          href={`/learn/ibm-i-fundamentals/${lesson.slug}`}
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
                        >
                          <span>{lesson.title}</span>
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {relatedDeepDives.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Related Deep Dives</h2>
                  <ul className="space-y-2">
                    {relatedDeepDives.map((related) => (
                      <li
                        key={related.slug}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500"
                      >
                        <span>{related.title}</span>
                        <Badge variant={isDeepDiveAvailable(related) ? 'success' : 'neutral'}>
                          {isDeepDiveAvailable(related) ? 'Available' : 'Coming soon'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Card variant="ai">
                <p className="flex items-center gap-1.5 text-sm font-medium text-cyan-900">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Have a question?
                </p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  The AI Tutor is for educational guidance only. It cannot connect to a real IBM i
                  system, execute code, or analyze production code. See the &ldquo;Ask the AI
                  Tutor&rdquo; section above for good prompts to start with.
                </p>
                <Link href="/ai-tutor" className={cn(buttonVariants({ variant: 'ai', size: 'sm' }), 'mt-3')}>
                  Open the AI Tutor
                </Link>
              </Card>
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
