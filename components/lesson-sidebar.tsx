import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface LessonSidebarItem {
  slug: string
  title: string
  lessonOrder: number
}

interface LessonSidebarProps {
  items: LessonSidebarItem[]
  currentSlug: string
  topicLabel: string
  topicId?: string
  learningCenterHref: string
}

function hrefFor(slug: string, topicId: string | undefined) {
  return topicId
    ? `/learn/ibm-i-fundamentals/${slug}?topic=${topicId}`
    : `/learn/ibm-i-fundamentals/${slug}`
}

function LessonList({
  items,
  currentSlug,
  topicId,
}: {
  items: LessonSidebarItem[]
  currentSlug: string
  topicId: string | undefined
}) {
  return (
    <ol className="max-h-[60vh] space-y-1 overflow-y-auto pr-1 lg:max-h-[calc(100vh-16rem)]">
      {items.map((item) => {
        const isCurrent = item.slug === currentSlug
        return (
          <li key={item.slug}>
            <Link
              href={hrefFor(item.slug, topicId)}
              prefetch={false}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                isCurrent
                  ? 'bg-blue-50 text-blue-900 font-medium ring-1 ring-inset ring-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                  isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                )}
              >
                {item.lessonOrder}
              </span>
              <span className="leading-snug">{item.title}</span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Lesson reader sidebar: shows the current lesson's topic group, highlights
 * the active lesson, and offers previous/next within that group. Always
 * scoped to a single topic (never the full 200+ lesson catalog) so the list
 * stays short and scannable -- see components/lesson-browser.tsx for the
 * full, searchable/filterable Learning Center list.
 *
 * Server component: purely link-based, no client state. The mobile
 * collapsible list uses a native <details>/<summary> element so no
 * client-side JavaScript is required for the drawer behavior.
 */
export function LessonSidebar({ items, currentSlug, topicLabel, topicId, learningCenterHref }: LessonSidebarProps) {
  const currentIndex = items.findIndex((item) => item.slug === currentSlug)
  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  return (
    <nav aria-label="Lesson navigation" className="space-y-3">
      <Link
        href={learningCenterHref}
        prefetch={false}
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
      >
        &larr; Learning Center
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{topicLabel}</p>
        <p className="text-xs text-slate-400">
          {currentIndex >= 0 ? currentIndex + 1 : '?'} of {items.length} in this topic
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {previousItem ? (
          <Link
            href={hrefFor(previousItem.slug, topicId)}
            prefetch={false}
            className="flex-1 truncate rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700"
          >
            &larr; Previous
          </Link>
        ) : (
          <span className="flex-1 rounded-lg border border-transparent px-2.5 py-1.5 text-slate-300">&larr; Previous</span>
        )}
        {nextItem ? (
          <Link
            href={hrefFor(nextItem.slug, topicId)}
            prefetch={false}
            className="flex-1 truncate rounded-lg border border-slate-200 px-2.5 py-1.5 text-right font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700"
          >
            Next &rarr;
          </Link>
        ) : (
          <span className="flex-1 rounded-lg border border-transparent px-2.5 py-1.5 text-right text-slate-300">Next &rarr;</span>
        )}
      </div>

      {/* Desktop: always-visible, scrollable list. */}
      <div className="hidden lg:block">
        <LessonList items={items} currentSlug={currentSlug} topicId={topicId} />
      </div>

      {/* Mobile/tablet: collapsed by default so it doesn't dominate the
          screen -- no client JS needed, <details> handles the toggle. */}
      <details className="rounded-xl border border-slate-200 bg-white lg:hidden">
        <summary className="cursor-pointer select-none rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700">
          Lessons in {topicLabel}
        </summary>
        <div className="border-t border-slate-100 px-3 py-2">
          <LessonList items={items} currentSlug={currentSlug} topicId={topicId} />
        </div>
      </details>
    </nav>
  )
}
