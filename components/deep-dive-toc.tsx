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
            <li key={item.id} className={isSubItem ? 'ml-3 border-l border-slate-100 pl-3' : undefined}>
              <a
                href={`#${item.id}`}
                onClick={closeMobilePanel}
                className={cn(
                  // items-start (not items-center) + the number sitting on its own
                  // line-height keeps a wrapped title's second line flush under the
                  // first, never under the number -- that's the whole fix for the
                  // "wrapped lines align with the number" bug this PR addresses.
                  'flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 leading-snug transition-colors',
                  isSubItem ? 'text-xs' : 'text-sm',
                  isActive
                    ? 'bg-blue-50 font-medium text-blue-700'
                    : isSubItem
                      ? 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {ordinal && <span className="shrink-0 tabular-nums">{ordinal}.</span>}
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
      <details ref={detailsRef} className="group mb-6 rounded-2xl border border-slate-200 bg-white p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-900">
          <List className="h-4 w-4 text-blue-600" aria-hidden="true" />
          Contents
          <ChevronDown className="ml-auto h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-3 max-h-72 overflow-y-auto border-t border-slate-100 pt-3">{renderList()}</div>
      </details>

      {/* Desktop / wide screens: sticky left sidebar. */}
      <nav aria-label="On this page" className="hidden lg:sticky lg:top-24 lg:block">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <List className="h-3.5 w-3.5" aria-hidden="true" />
          On this page
        </p>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">{renderList()}</div>
      </nav>
    </>
  )
}
