import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, BookOpen, Compass, Sparkles } from 'lucide-react'
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
import { ReaderBreadcrumb } from '@/components/reader-breadcrumb'
import { INSIGHT_FIGURE_REGISTRY } from '@/components/insights/insight-figure-registry'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { isDeepDiveAvailable } from '@/lib/deep-dives'
import { getPublishedLessonBySlugOrNull } from '@/lib/lessons'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AskAiTutorButton } from '@/components/ai-tutor/ask-ai-tutor-button'
import { RegisterAiTutorPageContext } from '@/components/ai-tutor/register-page-context'
import type { AiTutorContext } from '@/components/ai-tutor/types'

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

  // Canonical Insight context (AI Tutor Insights/Deep Dives Grounding),
  // mirroring the Deep Dive detail page's aiTutorContext exactly. Only
  // stable identifiers -- slug, title, route -- are carried; the server
  // re-resolves this slug against content/insights/catalog.ts before
  // trusting any of it. Registering it here is what lets the header's AI
  // Tutor button open already grounded in this Insight, and its body is
  // now genuinely retrievable (not just a page-awareness label) via
  // lib/ai/retrieve-published-content.ts.
  const aiTutorContext: Extract<AiTutorContext, { sourceType: 'insight' }> = {
    sourceType: 'insight',
    insightSlug: insight.slug,
    insightTitle: insight.title,
    insightPath: `/insights/${insight.slug}`,
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <StructuredData data={buildInsightStructuredData(insight)} />
      <StructuredData data={buildBreadcrumbStructuredData(insight)} />
      <RegisterAiTutorPageContext context={aiTutorContext} />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <ReaderBreadcrumb sectionLabel="IBM i Insights" sectionHref="/insights" currentLabel={insight.title} />

          <div className="mt-2 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-10">
            <DeepDiveToc items={toc} variant="insight" />

            <article className={`max-w-3xl space-y-8 rounded-2xl border-t-4 bg-white p-6 shadow-sm sm:p-8 ${accentClasses.topBorder}`}>
              <div
                className={`relative -mx-6 -mt-6 overflow-hidden rounded-t-2xl px-6 pb-7 pt-7 sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-9 sm:pb-9 ${accentClasses.headerWash}`}
              >
                {/* Decorative texture only -- a faint grid plus soft glow blobs,
                    kept but toned down (Insights Header Visual Refinement):
                    the header background is now a soft, light, category-
                    tinted wash rather than a saturated 600/700 gradient, so
                    the grid is dark-on-light at low opacity instead of the
                    old white-on-dark, and the blobs are pale category-color
                    echoes (INSIGHT_ACCENT_CLASSES.headerBlobOne/Two) rather
                    than a fixed cyan/violet pair. All aria-hidden; none of it
                    carries information, so it never needs a text alternative,
                    and none of it sits under text at meaningful opacity, so
                    it never affects text contrast. */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:34px_34px]"
                  aria-hidden="true"
                />
                <div
                  className={`pointer-events-none absolute -top-10 right-0 h-48 w-48 rounded-full blur-[70px] ${accentClasses.headerBlobOne}`}
                  aria-hidden="true"
                />
                <div
                  className={`pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full blur-[80px] ${accentClasses.headerBlobTwo}`}
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm ${accentClasses.headerBadgeBg}`}>
                      {categoryLabel}
                    </span>
                    <Badge variant="ai">Insight</Badge>
                  </div>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{insight.title}</h1>
                  <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">{insight.description}</p>
                  {/* Deliberately no publication date here (IBM i Insights Attribution
                      Cleanup and Date Display Removal) -- this section is meant to read
                      as evergreen, not time-stamped. publishedAt still exists on the
                      Insight record for catalog validation, sitemap lastModified, and
                      the (non-visible) openGraph.publishedTime / JSON-LD datePublished
                      generated elsewhere on this page -- see generateMetadata() above
                      and lib/insight-structured-data.ts. None of those render as
                      visible page content. */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      ~{insight.readingTimeMinutes} min read
                    </span>
                    {insight.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
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
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Related lessons
                  </h2>
                  <ul className="space-y-2">
                    {relatedLessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <Link
                          href={`/learn/ibm-i-fundamentals/${lesson.slug}`}
                          className="flex items-center justify-between gap-2 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-cyan-50/30 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm">
                      <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Related Deep Dive
                  </h2>
                  <ul className="space-y-2">
                    {relatedDeepDives.map((related) => (
                      <li key={related.slug}>
                        <Link
                          href={`/deep-dives/${related.slug}`}
                          className="flex items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 to-violet-50/30 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                          <span>{related.title}</span>
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Card variant="ai">
                <p className="flex items-center gap-1.5 text-sm font-medium text-cyan-900">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Have a question about this Insight?
                </p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  The AI Tutor can answer questions grounded in this article -- ask it to explain a section in
                  simpler terms, compare it with something you already know, or point you to a related lesson or
                  Deep Dive. It cannot connect to a real IBM i system, execute code, or analyze production code.
                </p>
                {/* Opens the shared panel in place (PR #180) so the Insight stays
                    on screen and the reading position is kept, instead of
                    navigating away to the full-page route. This Insight's own
                    sections are guaranteed to be retrieved for a contextless
                    question like "explain this simpler" -- see
                    lib/ai/retrieve-published-content.ts's currentInsightSlug
                    bucket. */}
                <AskAiTutorButton context={aiTutorContext} size="sm" className="mt-3">
                  Ask AI Tutor about this Insight
                </AskAiTutorButton>
              </Card>
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
