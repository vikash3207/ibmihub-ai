'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, Sparkles, RotateCcw } from 'lucide-react'
import { useAiTutorPanel } from './ai-tutor-panel-provider'
import { ChatMessageList, ChatComposer } from './chat-thread'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Embedded AI Tutor panel (Spec 001 v1.1 AI-TUTOR-FR-020). Reads all state
 * from AiTutorPanelProvider -- this component owns no conversation state
 * of its own. Three responsive tiers, matched by AiTutorContentShift
 * (which reserves layout space in the `xl:` tier so this component and the
 * page content never overlap there):
 *   - below `lg` (mobile/narrow tablet): full-screen sheet.
 *   - `lg` to `xl` (narrow desktop/tablet landscape): a right-side overlay
 *     ("drawer") -- content is not reflowed at this width to avoid
 *     squeezing it uncomfortably narrow.
 *   - `xl` and up (normal desktop): a right-side panel with page content
 *     reflowed to share space, never covered (Bugfix PR #129).
 *
 * The message list and the input form are deliberately separate flex
 * children (list scrolls, composer is pinned) so the chat input is never
 * pushed off-screen or hidden behind a mobile keyboard.
 *
 * z-[60] is deliberately above SiteHeader's z-50 (components/site-header.tsx):
 * SiteHeader is `sticky top-0`, so at scroll position 0 it occupies the
 * same top strip as this panel's own header. At the previous z-40 the site
 * header painted over this panel's header -- including the close button --
 * making it invisible even though it was present in the DOM (PR #129,
 * Issue 1).
 *
 * Not rendered on /ai-tutor itself: that page already shows the same
 * shared conversation inline (see app/(authenticated)/ai-tutor/page.tsx),
 * so overlaying the floating panel there would just duplicate it.
 */
export function EmbeddedAiTutorPanel() {
  const pathname = usePathname()
  const {
    isOpen,
    contextLabel,
    messages,
    input,
    setInput,
    isStreaming,
    error,
    requiresLogin,
    feedback,
    limitReached,
    closePanel,
    newChat,
    submitMessage,
    handleFeedback,
  } = useAiTutorPanel()

  const isRenderable = isOpen && pathname !== '/ai-tutor'

  // Escape closes the panel, matching standard dialog/drawer behavior --
  // only registered while the panel is actually open.
  useEffect(() => {
    if (!isRenderable) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRenderable, closePanel])

  if (!isRenderable) {
    return null
  }

  const loginHref = `/auth/login?next=${encodeURIComponent(pathname ?? '/')}`

  return (
    <div
      role="dialog"
      aria-label="AI Tutor"
      className="fixed inset-0 z-[60] flex flex-col bg-white lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[400px] lg:border-l lg:border-slate-200 lg:shadow-2xl xl:shadow-none"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-cyan-900">
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
            AI Tutor
          </p>
          {contextLabel && <p className="mt-0.5 truncate text-xs text-slate-500">{contextLabel}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={newChat}
              title="Start a new chat"
              aria-label="Start a new chat"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={closePanel}
            title="Close"
            aria-label="Close AI Tutor"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {requiresLogin ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-700">Log in to ask the AI Tutor a question.</p>
            <Link href={loginHref} className={buttonVariants({ variant: 'ai' })}>
              Log in
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ChatMessageList
              messages={messages}
              isStreaming={isStreaming}
              error={error}
              feedback={feedback}
              onFeedback={handleFeedback}
            />
          </div>
          <div className="shrink-0 border-t border-slate-100 px-4 py-3">
            <ChatComposer
              input={input}
              onInputChange={setInput}
              onSubmit={(e) => {
                e.preventDefault()
                void submitMessage(input)
              }}
              isStreaming={isStreaming}
              limitReached={limitReached}
            />
          </div>
        </>
      )}
    </div>
  )
}
