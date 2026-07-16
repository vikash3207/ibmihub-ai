'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { submitAiTutorFeedback } from '@/lib/actions/ai-tutor-feedback'
import { GENERAL_CONTEXT, getContextLabel, type AiTutorContext, type AiTutorSourceRef } from './types'
import type { ChatMessage, FeedbackState } from './chat-thread'

/** Must match app/api/ai-tutor/route.ts. */
const MAX_USER_TURNS = 20
const MAX_MESSAGE_LENGTH = 4000
/** Must match the header name set in app/api/ai-tutor/route.ts. */
const CONTEXT_LABEL_HEADER = 'X-Ai-Tutor-Context-Label'
/** Must match the header name set in app/api/ai-tutor/route.ts. */
const SOURCES_HEADER = 'X-Ai-Tutor-Sources'

interface AiTutorPanelValue {
  isOpen: boolean
  context: AiTutorContext
  contextLabel: string | null
  messages: ChatMessage[]
  input: string
  setInput: (value: string) => void
  isStreaming: boolean
  error: string | null
  /** Set only alongside `error` when the server included a contact link (currently just the daily-quota-exhausted message) -- see app/api/ai-tutor/route.ts. */
  errorContactHref: string | null
  requiresLogin: boolean
  feedback: Record<string, FeedbackState>
  /** Source lesson references per assistant message id, from the RAG v2 retrieval used to ground that reply (PR #132). */
  sources: Record<string, AiTutorSourceRef[]>
  limitReached: boolean
  /** Opens the panel, optionally seeding/replacing the active context (does not clear the conversation). */
  openPanel: (context?: AiTutorContext) => void
  closePanel: () => void
  /** Updates the active context without opening/closing the panel or clearing the conversation. */
  updateContext: (context: AiTutorContext) => void
  /** Clears the conversation -- the only way history is cleared while the tab stays open (Spec 001 v1.1 AI-TUTOR-FR-024). */
  newChat: () => void
  submitMessage: (text: string) => Promise<void>
  handleFeedback: (responseId: string, isHelpful: boolean) => Promise<void>
}

const AiTutorPanelContext = createContext<AiTutorPanelValue | null>(null)

/** Build the wire payload for a given context -- only ever includes fields already present on the context object (see components/ai-tutor/types.ts for the pre-reveal answer-safety guarantee). */
function buildContextPayload(context: AiTutorContext) {
  if (context.sourceType === 'general') {
    return undefined
  }
  return context
}

export function AiTutorPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<AiTutorContext>(GENERAL_CONTEXT)
  const [contextLabel, setContextLabel] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorContactHref, setErrorContactHref] = useState<string | null>(null)
  const [requiresLogin, setRequiresLogin] = useState(false)
  const [feedback, setFeedback] = useState<Record<string, FeedbackState>>({})
  const [sources, setSources] = useState<Record<string, AiTutorSourceRef[]>>({})

  const userTurnCount = messages.filter((m) => m.role === 'user').length
  const limitReached = userTurnCount >= MAX_USER_TURNS

  const openPanel = useCallback((nextContext?: AiTutorContext) => {
    if (nextContext) {
      setContext(nextContext)
      setContextLabel(getContextLabel(nextContext))
    }
    setIsOpen(true)
  }, [])

  const closePanel = useCallback(() => setIsOpen(false), [])

  const updateContext = useCallback((nextContext: AiTutorContext) => {
    setContext(nextContext)
    setContextLabel(getContextLabel(nextContext))
  }, [])

  const newChat = useCallback(() => {
    setMessages([])
    setError(null)
    setErrorContactHref(null)
    setRequiresLogin(false)
    setFeedback({})
    setSources({})
  }, [])

  const submitMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) {
        return
      }
      if (limitReached) {
        setError("You've reached the message limit for this session. Start a new chat to continue.")
        return
      }
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer. Please shorten your question.`)
        return
      }

      setError(null)
      setErrorContactHref(null)
      setRequiresLogin(false)
      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed }
      const nextMessages = [...messages, userMessage]
      setMessages(nextMessages)
      setInput('')
      setIsStreaming(true)

      const assistantId = crypto.randomUUID()
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      try {
        const response = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
            context: buildContextPayload(context),
          }),
        })

        if (response.status === 401) {
          setMessages((prev) => prev.filter((m) => m.id !== assistantId))
          setRequiresLogin(true)
          return
        }

        if (!response.ok || !response.body) {
          let message = 'AI Tutor is temporarily unavailable. Please try again.'
          let contactHref: string | null = null
          try {
            const data = await response.json()
            if (typeof data.error === 'string') {
              message = data.error
            }
            if (typeof data.contactHref === 'string') {
              contactHref = data.contactHref
            }
          } catch {
            // Non-JSON error body -- keep the generic message.
          }
          setMessages((prev) => prev.filter((m) => m.id !== assistantId))
          setError(message)
          setErrorContactHref(contactHref)
          return
        }

        const rawContextLabel = response.headers.get(CONTEXT_LABEL_HEADER)
        if (rawContextLabel) {
          try {
            setContextLabel(decodeURIComponent(rawContextLabel))
          } catch {
            // Malformed header value -- keep whatever label was already shown.
          }
        }

        const rawSources = response.headers.get(SOURCES_HEADER)
        if (rawSources) {
          try {
            const parsed = JSON.parse(decodeURIComponent(rawSources)) as AiTutorSourceRef[]
            setSources((prev) => ({ ...prev, [assistantId]: parsed }))
          } catch {
            // Malformed header value -- this reply just shows no sources.
          }
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
          )
        }
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        setError('AI Tutor is temporarily unavailable. Please try again.')
      } finally {
        setIsStreaming(false)
      }
    },
    [messages, context, isStreaming, limitReached]
  )

  const handleFeedback = useCallback(async (responseId: string, isHelpful: boolean) => {
    setFeedback((prev) => ({ ...prev, [responseId]: isHelpful ? 'helpful' : 'not_helpful' }))
    const result = await submitAiTutorFeedback(responseId, isHelpful)
    if (!result.ok) {
      setFeedback((prev) => ({ ...prev, [responseId]: 'none' }))
    }
  }, [])

  const value: AiTutorPanelValue = {
    isOpen,
    context,
    contextLabel,
    messages,
    input,
    setInput,
    isStreaming,
    error,
    errorContactHref,
    requiresLogin,
    feedback,
    sources,
    limitReached,
    openPanel,
    closePanel,
    updateContext,
    newChat,
    submitMessage,
    handleFeedback,
  }

  return <AiTutorPanelContext.Provider value={value}>{children}</AiTutorPanelContext.Provider>
}

export function useAiTutorPanel(): AiTutorPanelValue {
  const ctx = useContext(AiTutorPanelContext)
  if (!ctx) {
    throw new Error('useAiTutorPanel must be used within an AiTutorPanelProvider')
  }
  return ctx
}
