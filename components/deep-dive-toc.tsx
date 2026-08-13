'use client'

import { useEffect, useRef, useState } from 'react'
import { List, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeepDiveTocItem } from '@/lib/deep-dive-render'

interface DeepDiveTocProps {
  items: DeepDiveTocItem[]
  /**
   * 'default' (the historical look, used by app/deep-dives/[slug]/page.tsx --
   * omitting this prop keeps that page pixel-identical) or 'insight'
   * (a richer, more saturated treatment for app/insights/[slug]/page.tsx,
   * PR #202's visual-design pass). Deliberately a prop on the one shared
   * component rather than a fork: Deep Dives must never regress just
   * because Insights wanted a bolder sidebar.
   */
  variant?: 'default' | 'insight'
}

/**
 * Splits a leading "N. " ordinal off an item's title so it can be rendered
 * in its own fixed-width slot next to the rest of the title (PR #161 --
 * Navigator Numbering + Alignment Fix). Unnumbered headings ("Who this is
 * for") return a null ordinal and render as plain text.
 */
function splitOrdinal(title: string): { ordinal: string | null; rest: string } {
  const match = title.match(/^(\d+)\.\s*(.*)$/)
  if (!match) return { ordinal: null, rest: title }
  return { ordinal: match[1], rest: match[2] }
}

/**
 * "On this page" navigator for Deep Dive and Insight detail pages (PR #158;
 * `variant` added PR #202). A single component renders both the desktop
 * sticky sidebar and the mobile collapsible "Contents" card, sharing one
 * active-heading tracker rather than running two separate
 * IntersectionObservers for the same content.
 *
 * The mobile disclosure is a plain <details>/<summary> -- fully keyboard
 * and screen-reader accessible, and functional even with JavaScript
 * disabled, since the anchor links underneath are plain `<a href="#id">`
 * tags. The active-section highlight is a progressive enhancement layered
 * on top: if the IntersectionObserver effect never runs (or `items` is
 * empty), every link still works via normal browser anchor navigation.
 */
export function DeepDiveToc({ items, variant = 'default' }: DeepDiveTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const isInsight = variant === 'insight'

  useEffect(() => {
    if (items.length === 0) return

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    if (headingElements.length === 0) return

    // The "active band" sits just below the sticky site header rather than
    // at the literal viewport top, and extends most of the way down the
    // viewport -- a heading only needs to cross into reading position to
    // count as current, not scroll all the way to the top of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
        setActiveId(topMost.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )

    headingElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  function closeMobilePanel() {
    detailsRef.current?.removeAttribute('open')
  }

  function renderList() {
    return (
      <ul className="space-y-0.5">
        {items.map((item) => {
          const { ordinal, rest } = splitOrdinal(item.title)
          const isActive = activeId === item.id
          const isSubItem = item.level === 3

          return (
            <li
              key={item.id}
              className={isSubItem ? cn('ml-3 border-l pl-3', isInsight ? 'border-indigo-100' : 'border-cyan-100') : undefined}
            >
              <a
                href={`#${item.id}`}
                onClick={closeMobilePanel}
                className={cn(
                  // items-start (not items-center) + the number sitting on its own
                  // line-height keeps a wrapped title's second line flush under the
                  // first, never under the number -- that's the whole fix for the
                  // "wrapped lines align with the number" bug PR #161 addressed; the
                  // color/border changes below are purely additive on top of that.
                  //
                  // Top-level items always carry `border-l-2` (color starts
                  // transparent) so the active/hover accent border never shifts the
                  // text horizontally when it appears -- the 2px is reserved from
                  // the very first render, only its color changes.
                  'flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 leading-snug transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                  isInsight ? 'focus-visible:ring-blue-600' : 'focus-visible:ring-cyan-600',
                  isSubItem ? 'text-xs' : 'border-l-2 text-sm',
                  isInsight
                    ? isActive
                      ? isSubItem
                        ? 'bg-indigo-50 font-semibold text-indigo-800 shadow-sm'
                        : 'border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-sm'
                      : isSubItem
                        ? 'text-slate-500 hover:bg-indigo-50/70 hover:text-indigo-800'
                        : 'border-transparent text-slate-600 hover:border-cyan-300 hover:bg-blue-50/70 hover:text-blue-900'
                    : isActive
                      ? isSubItem
                        ? 'bg-blue-50 font-medium text-blue-800'
                        : 'border-blue-500 bg-blue-50 font-semibold text-blue-800'
                      : isSubItem
                        ? 'text-slate-500 hover:bg-cyan-50/60 hover:text-slate-800'
                        : 'border-transparent text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/60 hover:text-cyan-900'
                )}
              >
                {ordinal && (
                  <span
                    className={cn(
                      'shrink-0 tabular-nums font-semibold',
                      isInsight ? (isActive && !isSubItem ? 'text-white/90' : 'text-indigo-500') : isActive ? 'text-blue-600' : 'text-cyan-600'
                    )}
                  >
                    {ordinal}.
                  </span>
                )}
                <span>{rest}</span>
              </a>
            </li>
          )
        })}
      </ul>
    )
  }

  if (isInsight) {
    return (
      <>
        {/* Mobile / narrow screens: collapsible "Contents" card near the top of the article. */}
        <details
          ref={detailsRef}
          className="group mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-cyan-50/40 to-white shadow-sm lg:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold text-slate-900">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
              <List className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            Contents
            <ChevronDown className="ml-auto h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="max-h-72 overflow-y-auto border-t border-blue-100 bg-white/70 px-4 pb-4 pt-3">{renderList()}</div>
        </details>

        {/* Desktop / wide screens: sticky left sidebar. */}
        <nav aria-label="On this page" className="hidden lg:sticky lg:top-24 lg:block">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-cyan-50/40 to-white shadow-md shadow-blue-900/5">
            <div className="flex items-center gap-2 border-b border-blue-100/80 bg-white/50 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
                <List className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-800">On this page</p>
            </div>
            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto p-3 pr-2">{renderList()}</div>
          </div>
        </nav>
      </>
    )
  }

  return (
    <>
      {/* Mobile / narrow screens: collapsible "Contents" card near the top of the article. */}
      <details
        ref={detailsRef}
        className="group mb-6 rounded-2xl border border-cyan-100 bg-gradient-to-b from-cyan-50/70 via-white to-white p-4 shadow-sm lg:hidden"
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-900">
          <List className="h-4 w-4 text-cyan-600" aria-hidden="true" />
          Contents
          <ChevronDown className="ml-auto h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-3 max-h-72 overflow-y-auto border-t border-cyan-100 pt-3">{renderList()}</div>
      </details>

      {/* Desktop / wide screens: sticky left sidebar. */}
      <nav aria-label="On this page" className="hidden lg:sticky lg:top-24 lg:block">
        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-b from-cyan-50/70 via-white to-white p-4 shadow-sm">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            <List className="h-3.5 w-3.5 text-cyan-500" aria-hidden="true" />
            On this page
          </p>
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-2">{renderList()}</div>
        </div>
      </nav>
    </>
  )
}
