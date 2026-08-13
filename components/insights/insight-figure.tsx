import type { ReactNode } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InsightFigureAccent = 'cyan' | 'indigo' | 'violet' | 'blue' | 'emerald' | 'amber'

/**
 * Full, static Tailwind class strings per accent -- not string-interpolated
 * -- so Tailwind's JIT scanner can see them (this file lives under
 * ./components, already covered by tailwind.config.ts's content globs; see
 * scripts/tailwind-content-regression.ts for why that matters).
 */
/**
 * `wash` is a single flat, very-subtle tint (no gradient stops) -- a
 * follow-up-pass fix. The original version used a 3-stop `bg-gradient-to-b`
 * (tint -> white -> white) applied to the whole `<figure>`; for a short
 * figure that reached its white stop while still inside the visible area,
 * but for a taller one (Figure 2's 4-step sequence) the tint ran out
 * roughly a third of the way down and the rest of the figure read as flat
 * white -- an abrupt, uneven patch rather than one coherent surface. A flat
 * tint has no "runs out" point regardless of figure height.
 */
const ACCENT_CLASSES: Record<InsightFigureAccent, { border: string; wash: string; badgeBg: string; badgeText: string }> = {
  cyan: { border: 'border-t-cyan-500', wash: 'bg-cyan-50/40', badgeBg: 'bg-cyan-100', badgeText: 'text-cyan-800' },
  indigo: { border: 'border-t-indigo-500', wash: 'bg-indigo-50/40', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800' },
  violet: { border: 'border-t-violet-500', wash: 'bg-violet-50/40', badgeBg: 'bg-violet-100', badgeText: 'text-violet-800' },
  blue: { border: 'border-t-blue-500', wash: 'bg-blue-50/40', badgeBg: 'bg-blue-100', badgeText: 'text-blue-800' },
  emerald: { border: 'border-t-emerald-500', wash: 'bg-emerald-50/40', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800' },
  amber: { border: 'border-t-amber-500', wash: 'bg-amber-50/35', badgeBg: 'bg-amber-100', badgeText: 'text-amber-800' },
}

interface InsightFigureProps {
  number: number
  title: string
  caption: string
  accent: InsightFigureAccent
  /** Wrapped in its own horizontally-scrollable viewport instead of shrinking below a readable size -- see globals.css's insight-figure-scroll. */
  scrollable?: boolean
  children: ReactNode
}

/**
 * Shared chrome for every original diagram in the IBM i MCP Server Insight
 * (and any future Insight that needs one): a numbered, titled, captioned
 * `<figure>` with the section's cyan/indigo/violet accent language. Content
 * is rendered as a sibling of the Markdown body's `.prose` chunks (see
 * lib/insight-render.ts), never nested inside one, so this intentionally
 * doesn't rely on any `.prose` styling.
 *
 * `scrollable` figures get their own bounded `overflow-x-auto` viewport
 * (with a visible scroll affordance) rather than either shrinking labels to
 * an unreadable size or causing page-level horizontal overflow at 320px. A
 * diagram that's wider than the article column will otherwise render its
 * default (unscrolled) view looking like a cut-off/broken box-and-arrow
 * chain rather than an intentionally scrollable one -- the small hint row
 * below and the right-edge fade in globals.css exist specifically to make
 * "there's more, scroll" obvious without needing JS scroll-position
 * tracking (the fade is a static hint, not scroll-aware).
 */
export function InsightFigure({ number, title, caption, accent, scrollable = false, children }: InsightFigureProps) {
  const classes = ACCENT_CLASSES[accent]

  return (
    <figure
      className={cn(
        'my-10 overflow-hidden rounded-2xl border border-slate-100 border-t-4 shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5',
        classes.border,
        classes.wash
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', classes.badgeBg, classes.badgeText)}>
            Figure {number}
          </span>
          <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{title}</h3>
        </div>
        {scrollable && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 sm:hidden">
            <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Scroll to see all
          </span>
        )}
      </div>

      <div className="relative">
        <div className={cn('px-2 py-5 sm:px-4', scrollable && 'insight-figure-scroll overflow-x-auto')}>{children}</div>
        {scrollable && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 bg-gradient-to-l from-white to-transparent sm:block"
            aria-hidden="true"
          />
        )}
      </div>

      {scrollable && (
        <p className="hidden items-center gap-1.5 px-5 pb-1 text-xs text-slate-400 sm:flex sm:px-6">
          <MoveHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Scroll horizontally within the diagram to see the full flow.
        </p>
      )}

      <figcaption className="border-t border-slate-100 bg-white/60 px-5 py-4 text-[15px] leading-relaxed text-slate-600 sm:px-6">
        {caption}
      </figcaption>
    </figure>
  )
}
