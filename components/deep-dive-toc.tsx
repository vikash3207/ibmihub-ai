'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { List, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { groupTocItems, resolveExpandedGroupId, resolveHashHeadingId, type DeepDiveTocItem } from '@/lib/deep-dive-render'

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
 * `variant` added PR #202; grouped/progressive-disclosure rendering added in
 * Deep Dives, IBM i Insights and Reader-Experience Polish). A single
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
 *
 * TOC simplification: a long article's h3 sub-headings (e.g. 41 of them
 * across 23 h2 sections in the "SQL Error Handling on IBM i" Deep Dive) used
 * to all render flatly at once -- the sidebar read like a second article.
 * Exactly ONE group's h3 children render at a time now, via
 * resolveExpandedGroupId() (lib/deep-dive-render.ts) -- a single pure
 * function that covers every case a review found the first version of this
 * fell back to "every group expanded" for:
 *  - Initial load, no scroll yet: the first group (`activeId` starts null;
 *    resolveExpandedGroupId's own fallback is "the first group", so this
 *    needs no special-casing here).
 *  - A direct URL with a heading hash (h2 or h3): resolveHashHeadingId()
 *    validates the fragment against real heading ids, and a
 *    `useLayoutEffect` applies it as the initial `activeId` BEFORE paint --
 *    not `useEffect` -- so a hash-targeted load never flashes the
 *    first-group default first. The initial `useState(null)` itself stays
 *    hash-free (SSR-safe, no hydration mismatch: server and client render
 *    the same "first group" default on the first pass).
 *  - Scrolling: the existing IntersectionObserver below still owns
 *    `activeId`; resolveExpandedGroupId() just always resolves it to a real
 *    owning group, so the TOC can never end up with zero or "all" groups
 *    expanded once a heading has ever been active.
 *
 * All h2 links are always rendered regardless of which group is expanded --
 * only h3 children are conditionally shown. The `ChevronRight` indicator on
 * an h2 with children is deliberately non-interactive (no cursor/hover/focus
 * styling, `aria-hidden`) -- it reports which group is currently expanded,
 * it is not a control of its own; clicking a heading still just navigates
 * to it, the same real `<a href="#id">` it always was.
 */
export function DeepDiveToc({ items, variant = 'default' }: DeepDiveTocProps) {
  // Starts null on both server and client -- reading window.location.hash
  // in the initializer would make the very first client render differ from
  // the server-rendered HTML (a hydration mismatch). resolveExpandedGroupId()
  // treats null the same as "no match": the first group. The layout effect
  // below corrects this to the hash-targeted group, if any, before the
  // browser paints.
  const [activeId, setActiveId] = useState<string | null>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const isInsight = variant === 'insight'
  const groups = useMemo(() => groupTocItems(items), [items])
  const expandedGroupId = useMemo(() => resolveExpandedGroupId(groups, activeId), [groups, activeId])

  // Resolves an initial hash-targeted heading (h2 or h3) before paint --
  // useLayoutEffect, not useEffect, so a direct link to a heading deep in
  // the article never flashes the first-group default first. Runs once per
  // `items` identity (a new article), same dependency as the observer
  // effect below.
  useLayoutEffect(() => {
    const hashId = resolveHashHeadingId(items, window.location.hash)
    // One-time sync from an external system (the URL, which the server
    // never sees) on mount -- not the cascading-render pattern this rule
    // otherwise guards against. The alternative, reading window.location.hash
    // in the useState initializer above, would cause an actual hydration
    // mismatch, which is the one thing this effect exists to avoid.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hashId) setActiveId(hashId)
    // Deliberately depends on `items` only -- resolveHashHeadingId and
    // setActiveId are both stable references, and this must run once per
    // article (mount), not re-fire on every activeId update the observer
    // below makes, or it would keep re-pinning the TOC back to the URL's
    // original hash instead of following the reader's scroll position.
  }, [items])

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

  function renderLink(item: DeepDiveTocItem) {
    const { ordinal, rest } = splitOrdinal(item.title)
    const isActive = activeId === item.id
    const isSubItem = item.level === 3

    return (
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
    )
  }

  function renderGroupedList() {
    return (
      <ul className="space-y-0.5">
        {groups.map((group) => {
          // Exactly one group is ever expanded -- resolveExpandedGroupId()
          // already picked it (first group by default, the hash-targeted or
          // currently-scrolled-to group otherwise), so this is a direct
          // equality check, not a fallback.
          const showChildren = group.children.length > 0 && group.heading.id === expandedGroupId

          return (
            <li key={group.heading.id}>
              <div className="flex items-center gap-1">
                <div className="min-w-0 flex-1">{renderLink(group.heading)}</div>
                {group.children.length > 0 && (
                  <ChevronRight
                    className={cn(
                      'h-3 w-3 shrink-0 text-slate-300 transition-transform motion-reduce:transition-none',
                      showChildren && 'rotate-90'
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
              {showChildren && (
                <ul className={cn('ml-3 space-y-0.5 border-l pl-3', isInsight ? 'border-indigo-100' : 'border-cyan-100')}>
                  {group.children.map((child) => (
                    <li key={child.id}>{renderLink(child)}</li>
                  ))}
                </ul>
              )}
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
          <div className="max-h-72 overflow-y-auto border-t border-blue-100 bg-white/70 px-4 pb-4 pt-3">{renderGroupedList()}</div>
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
            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto p-3 pr-2">{renderGroupedList()}</div>
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
        <div className="mt-3 max-h-72 overflow-y-auto border-t border-cyan-100 pt-3">{renderGroupedList()}</div>
      </details>

      {/* Desktop / wide screens: sticky left sidebar. */}
      <nav aria-label="On this page" className="hidden lg:sticky lg:top-24 lg:block">
        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-b from-cyan-50/70 via-white to-white p-4 shadow-sm">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            <List className="h-3.5 w-3.5 text-cyan-500" aria-hidden="true" />
            On this page
          </p>
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-2">{renderGroupedList()}</div>
        </div>
      </nav>
    </>
  )
}
