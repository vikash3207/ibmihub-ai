'use client'

import { useState } from 'react'
import { submitAiTutorFeedback } from '@/lib/actions/ai-tutor-feedback'

/** Must match app/api/ai-tutor/route.ts -- client-side mirror for UX only. */
const MAX_USER_TURNS = 20
const MAX_MESSAGE_LENGTH = 4000

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type FeedbackState = 'none' | 'helpful' | 'not_helpful'

interface Props {
  starterPrompts: string[]
}

export function AiTutorChat({ starterPrompts }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, FeedbackState>>({})

  const userTurnCount = messages.filter((m) => m.role === 'user').length
  const limitReached = userTurnCount >= MAX_USER_TURNS

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = input.trim()
    if (!trimmed || isStreaming) {
      return
    }
    if (limitReached) {
      setError("You've reached the message limit for this session. Refresh the page to start a new conversation.")
      return
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setError(`Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer. Please shorten your question.`)
      return
    }

    setError(null)
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
        }),
      })

      if (!response.ok || !response.body) {
        let message = 'AI Tutor is temporarily unavailable. Please try again.'
        try {
          const data = await response.json()
          if (typeof data.error === 'string') {
            message = data.error
          }
        } catch {
          // Non-JSON error body -- keep the generic message.
        }
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        setError(message)
        return
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
  }

  async function handleFeedback(responseId: string, isHelpful: boolean) {
    setFeedback((prev) => ({ ...prev, [responseId]: isHelpful ? 'helpful' : 'not_helpful' }))
    const result = await submitAiTutorFeedback(responseId, isHelpful)
    if (!result.ok) {
      setFeedback((prev) => ({ ...prev, [responseId]: 'none' }))
    }
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
          <p className="text-sm font-medium text-slate-700 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:border-slate-400 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === 'user'
                  ? 'rounded-2xl bg-slate-900 text-white px-4 py-3 ml-auto max-w-lg whitespace-pre-wrap'
                  : 'rounded-2xl border border-slate-100 bg-white px-4 py-3 max-w-lg whitespace-pre-wrap text-slate-800'
              }
            >
              <p className="text-sm">{message.content || (isStreaming ? '...' : '')}</p>

              {message.role === 'assistant' && message.content && !isStreaming && (
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleFeedback(message.id, true)}
                    disabled={feedback[message.id] !== undefined && feedback[message.id] !== 'none'}
                    className="text-slate-500 hover:text-slate-900 disabled:text-emerald-600 disabled:cursor-default"
                  >
                    {feedback[message.id] === 'helpful' ? 'Thanks for your feedback' : 'Helpful'}
                  </button>
                  {feedback[message.id] !== 'helpful' && (
                    <button
                      type="button"
                      onClick={() => handleFeedback(message.id, false)}
                      disabled={feedback[message.id] !== undefined && feedback[message.id] !== 'none'}
                      className="text-slate-500 hover:text-slate-900 disabled:text-slate-400 disabled:cursor-default"
                    >
                      {feedback[message.id] === 'not_helpful' ? 'Thanks for your feedback' : 'Not helpful'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {limitReached ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          You&apos;ve reached the message limit for this session. Refresh the page to start a new
          conversation.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            rows={3}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Ask an IBM i question..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {isStreaming ? 'Thinking...' : 'Ask'}
          </button>
        </form>
      )}
    </div>
  )
}
