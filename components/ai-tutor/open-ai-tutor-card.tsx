'use client'

import { useAiTutorPanel } from './ai-tutor-panel-provider'
import { GENERAL_CONTEXT } from './types'

/**
 * Wraps an existing card so clicking it opens the shared AI Tutor panel in
 * place instead of navigating to the full-page route (PR #180).
 *
 * A plain <button>, not a link, because there is no destination: the page
 * stays exactly where it is. That also gives correct button semantics for
 * keyboard and screen-reader users, and Enter/Space work natively.
 *
 * General context -- the Dashboard has no lesson or Deep Dive to ground the
 * Tutor in, and no educational context is invented from unrelated page
 * content.
 */
export function OpenAiTutorCard({ children }: { children: React.ReactNode }) {
  const { openPanel } = useAiTutorPanel()

  return (
    <button
      type="button"
      onClick={() => openPanel(GENERAL_CONTEXT)}
      className="block w-full text-left transition-transform motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 rounded-2xl"
    >
      {children}
    </button>
  )
}
