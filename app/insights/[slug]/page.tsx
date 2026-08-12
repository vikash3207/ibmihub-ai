import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, Calendar } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { INSIGHTS } from '@/content/insights/catalog'
import { isInsightAvailable, type Insight } from '@/lib/insights'
import { loadInsightMarkdown } from '@/lib/insight-content'
import { renderLessonMarkdown } from '@/lib/markdown'
import { addDeepDiveHeadingAnchors, tagDeepDiveCallouts, wrapDeepDiveTables, type DeepDiveTocItem } from '@/lib/deep-dive-render'
import { LessonContent } from '@/components/lesson-content'
import { DeepDiveToc } from '@/components/deep-dive-toc'
import { StructuredData } from '@/components/structured-data'
import { INSIGHT_CATEGORIES, INSIGHT_ACCENT_CLASSES, getInsightAccent } from '@/lib/insight-categories'
import { buildInsightStructuredData, buildBreadcrumbStructuredData } from '@/lib/insight-structured-data'
import { splitInsightHtmlOnFigureMarkers } from '@/lib/insight-render'
import { INSIGHT_FIGURE_REGISTRY } from '@/components/insights/mcp-figures'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { isDeepDiveAvailable } from '@/lib/deep-dives'
import { getPublishedLessonBySlugOrNull } from '@/lib/lessons'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Insight detail page. Structurally a sibling of
 * app/deep-dives/[slug]/page.tsx, not a variant of it: it reads
 * from the independent INSIGHTS catalog only, and INSIGHTS never appears in
 * DEEP_DIVES or vice versa. It does reuse several genuinely generic Deep
 * Dive presentation primitives that have no DeepDive-specific coupling --
 * addDeepDiveHeadingAnchors/tagDeepDiveCallouts/wrapDeepDiveTables are plain
 * HTML string transforms, and DeepDiveToc renders generic {id,title,level}
 * items -- rather than forking that logic. Public, static, no auth
 * dependency, same as Deep Dives.
 *
 * Figures (PR #199): an Insight's body can embed original diagrams by
 * placing `[[FIGURE:name]]` on its own paragraph in the Markdown source --
 * see lib/insight-render.ts for why this exists (renderLessonMarkdown()
 * never enables allowDangerousHtml, so a raw component can't be embedded
 * directly in the Markdown). splitInsightHtmlOnFigureMarkers() runs on the
 * already fully-rendered/anchored/classified HTML, so heading ids and the
 * TOC stay correct regardless of where a figure falls; each string segment
 * still renders through <LessonContent> unchanged, and each figure name is
 * looked up in INSIGHT_FIGURE_REGISTRY[insight.slug] -- a real, hand-written
 * component, never anything derived from file content. An Insight with no
 * figure markers (or an unrecognized one) still renders fine: the split is
 * a no-op and an unmatched name is just skipped.
 */
function findPublishedInsight(slug: string): Insight | undefined {
  const insight = INSIGHTS.find((i) => i.slug === slug)
  return insight && isInsightAvailable(insight) ? insight : undefined
}

export function generateStaticParams() {
  return INSIGHTS.filter(isInsightAvailable).map((insight) => ({ slug: insight.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const insight = findPublishedInsight(slug)
  if (!insight) return {}

  return {
    title: insight.title,
    description: insight.description,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      title: insight.title,
      description: insight.description,
      url: `/insights/${insight.slug}`,
      type: 'article',
      publishedTime: insight.publishedAt,
      ...(insight.updatedAt ? { modifiedTime: insight.updatedAt } : {}),
    },
  }
}

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params
  const insight = findPublishedInsight(slug)

  if (!insight) {
    notFound()
  }

  const accent = getInsightAccent(insight.category)
  const accentClasses = INSIGHT_ACCENT_CLASSES[accent]
  const categoryLabel = INSIGHT_CATEGORIES.find((c) => c.id === insight.category)?.label ?? insight.category

  let bodyHtml = ''
  let toc: DeepDiveTocItem[] = []
  let loadError = false

  try {
    const markdown = await loadInsightMarkdown(insight)
    const rendered = await renderLessonMarkdown(markdown)
    const withAnchors = addDeepDiveHeadingAnchors(rendered)
    bodyHtml = wrapDeepDiveTables(tagDeepDiveCallouts(withAnchors.html))
    toc = withAnchors.toc
  } catch {
    loadError = true
  }

  const relatedLessons = insight.relatedLessonSlugs
    ? (
        await Promise.all(insight.relatedLessonSlugs.map((lessonSlug) => getPublishedLessonBySlugOrNull(lessonSlug)))
      ).filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== null)
    : []

  const relatedDeepDiveSlugs = insight.relatedDeepDiveSlugs ?? []
  const relatedDeepDives = DEEP_DIVES.filter((d) => relatedDeepDiveSlugs.includes(d.slug) && isDeepDiveAvailable(d))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StructuredData data={buildInsightStructuredData(insight)} />
      <StructuredData data={buildBreadcrumbStructuredData(insight)} />
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link
              href="/"
              className="rounded hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/insights"
              className="rounded hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              IBM i Insights
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-slate-700" aria-current="page">
              {insight.title}
            </span>
          </nav>

          <div className="mt-2 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-10">
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
                  <Badge variant="ai">Insight</Badge>
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{insight.title}</h1>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">{insight.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <time dateTime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-600">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    ~{insight.readingTimeMinutes} min read
                  </span>
                  {insight.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {loadError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-800">
                  This Insight could not be loaded right now. Please try again later, or{' '}
                  <Link
                    href="/insights"
                    prefetch={false}
                    className="rounded underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                  >
                    return to IBM i Insights
                  </Link>
                  .
                </div>
              ) : (
                // `deep-dive-article` reuses that scope's existing table/callout/heading CSS
                // (app/globals.css) rather than duplicating it; `insight-article` is Insights'
                // own hook for any future insight-only styling, kept separate from the start.
                <div className="insight-article deep-dive-article">
                  {splitInsightHtmlOnFigureMarkers(bodyHtml).map((segment, i) => {
                    if (segment.type === 'html') {
                      return <LessonContent key={i} html={segment.html} />
                    }
                    const Figure = INSIGHT_FIGURE_REGISTRY[insight.slug]?.[segment.name]
                    return Figure ? <Figure key={i} /> : null
                  })}
                </div>
              )}

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                <Link href="/insights" className={buttonVariants({ variant: 'secondary' })}>
                  &larr; All IBM i Insights
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
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Related Deep Dive</h2>
                  <ul className="space-y-2">
                    {relatedDeepDives.map((related) => (
                      <li key={related.slug}>
                        <Link
                          href={`/deep-dives/${related.slug}`}
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                        >
                          <span>{related.title}</span>
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
