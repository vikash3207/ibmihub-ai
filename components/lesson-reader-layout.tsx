import type { ReactNode } from 'react'

/**
 * Two-column lesson reader shell: a left lesson-index sidebar and a
 * center reading column. On mobile, the columns stack (the sidebar itself
 * decides how to stay compact there -- see components/lesson-sidebar.tsx).
 *
 * A right-hand column is intentionally not part of this layout yet. Adding
 * one later (e.g. a 5250-style Practice Lab panel, IDE-style practice)
 * only needs a third grid track added here -- this component is the single
 * place that would change, so no page using it needs to be touched again to
 * make room for it. (The AI Tutor companion panel, once considered a
 * candidate for this column, shipped instead as a fixed-position overlay --
 * see components/ai-tutor/embedded-ai-tutor-panel.tsx -- not a grid column.)
 */
export function LessonReaderLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="mb-8 lg:sticky lg:top-20 lg:mb-0">{sidebar}</aside>
      <div className="min-w-0 max-w-3xl">{children}</div>
    </div>
  )
}
