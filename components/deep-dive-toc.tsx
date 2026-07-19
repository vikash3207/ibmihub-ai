'use client'

import { useEffect, useRef, useState } from 'react'
import { List, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DeepDiveTocItem } from '@/lib/deep-dive-render'

interface DeepDiveTocProps {
  items: DeepDiveTocItem[]
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
 * "On this page" navigator for Deep Dive detail pages (PR #158). A single
 * component renders both the desktop sticky sidebar and the mobile
 * collapsible "Contents" card, sharing one active-heading tracker rather
 * than running two separate IntersectionObservers for the same content.
 *
 * The mobile disclosure is a plain <details>/<summary> -- fully keyboard
 * and screen-reader accessible, and functional even with JavaScript
 * disabled, since the anchor links underneath are plain `<a href="#id">`
 * tags. The active-section highlight is a progressive enhancement layered
 * on top: if the IntersectionObserver effect never runs (or `items` is
 * empty), every link still works via normal browser anchor navigation.
 */
export function DeepDiveToc({ items }: DeepDiveTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)

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
            <li key={item.id} className={isSubItem ? 'ml-3 border-l border-cyan-100 pl-3' : undefined}>
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
                  isSubItem ? 'text-xs' : 'border-l-2 text-sm',
                  isActive
                    ? isSubItem
                      ? 'bg-blue-50 font-medium text-blue-800'
                      : 'border-blue-500 bg-blue-50 font-semibold text-blue-800'
                    : isSubItem
                      ? 'text-slate-500 hover:bg-cyan-50/60 hover:text-slate-800'
                      : 'border-transparent text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/60 hover:text-cyan-900'
                )}
              >
                {ordinal && (
                  <span className={cn('shrink-0 tabular-nums font-semibold', isActive ? 'text-blue-600' : 'text-cyan-600')}>
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
