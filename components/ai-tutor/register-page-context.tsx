'use client'

import { useEffect } from 'react'
import { useAiTutorPanel } from './ai-tutor-panel-provider'
import { getContextKey, type AiTutorContext } from './types'

/**
 * Registers the current page's canonical AI Tutor context (PR #181).
 *
 * Rendering this from a page/layout is what lets the header and mobile
 * "AI Tutor" triggers open the panel already grounded in whatever the
 * learner is reading, instead of always opening in general mode. Before
 * this, context only ever arrived from a page-specific CTA, so which button
 * you pressed decided whether the Tutor knew where you were.
 *
 * Renders nothing and holds no state of its own -- the whole client cost is
 * one effect. Server-rendered pages stay server components; they just place
 * this small client child inside them.
 *
 * Stale-context safety: the cleanup clears the registration on unmount, so
 * navigating from a Deep Dive to an unrelated page leaves nothing behind for
 * the header to pick up. The provider also re-reads the registration at open
 * time rather than caching it, and falls back to general when it is empty.
 *
 * If the panel is already open when the page changes, the active context is
 * updated too, so the indicator follows the learner across a client-side
 * navigation instead of pointing at the page they just left.
 */
export function RegisterAiTutorPageContext({ context }: { context: AiTutorContext }) {
  const { registerPageContext, updateContext, isOpen } = useAiTutorPanel()
  const key = getContextKey(context)

  useEffect(() => {
    registerPageContext(context)
    if (isOpen) {
      updateContext(context)
    }
    return () => registerPageContext(null)
    // `context` is a fresh object every render; `key` is its stable identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isOpen, registerPageContext, updateContext])

  return null
}
