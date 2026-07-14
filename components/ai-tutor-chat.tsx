'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Sparkles, BookOpen } from 'lucide-react'
import { submitAiTutorFeedback } from '@/lib/actions/ai-tutor-feedback'
import { buttonVariants } from '@/components/ui/button'

/** Must match app/api/ai-tutor/route.ts -- client-side mirror for UX only. */
const MAX_USER_TURNS = 20
const MAX_MESSAGE_LENGTH = 4000
/** Must match the header name set in app/api/ai-tutor/route.ts. */
const CONTEXT_LABEL_HEADER = 'X-Ai-Tutor-Context-Label'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type FeedbackState = 'none' | 'helpful' | 'not_helpful'

export interface InitialLessonContext {
  slug: string
  title: string
}

interface Props {
  starterPrompts: string[]
  /** Set when AI Tutor was opened from a specific lesson page (e.g. ?lesson=slug). */
  initialLessonContext?: InitialLessonContext | null
}

/**
 * Plain-text structural formatting for assistant responses.
 *
 * This is deliberately NOT a markdown parser -- it recognizes exactly four
 * patterns (paragraphs, "-"/"*" bullets, "1."/"2)" numbered steps, and
 * ```-fenced code blocks) via string splitting/regex, and renders everything
 * through plain JSX text children. No HTML string is ever constructed and
 * dangerouslySetInnerHTML is never used, so this is safe by construction
 * regardless of what the model outputs -- React escapes all text content.
 *
 * The system prompt (lib/ai/system-prompt.ts) is written to match exactly
 * what this formatter understands; it deliberately avoids asking the model
 * for markdown constructs (bold, headings, tables) this formatter does not
 * render specially, since those would otherwise show up as literal symbol
 * clutter (e.g. stray asterisks).
 */
type Block =
  | { type: 'paragraph'; key: string; text: string }
  | { type: 'bullet-list'; key: string; items: string[] }
  | { type: 'numbered-list'; key: string; items: string[] }
  | { type: 'code'; key: string; text: string }

function classifyChunk(chunk: string, key: string): Block {
  const lines = chunk
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line))) {
    return { type: 'bullet-list', key, items: lines.map((line) => line.replace(/^[-*]\s+/, '')) }
  }

  if (lines.length > 0 && lines.every((line) => /^\d+[.)]\s+/.test(line))) {
    return { type: 'numbered-list', key, items: lines.map((line) => line.replace(/^\d+[.)]\s+/, '')) }
  }

  return { type: 'paragraph', key, text: chunk }
}

/** Strip a leading language-tag line (e.g. "rpgle") from a fenced code block, if present. */
function stripLanguageTag(codeText: string): string {
  const trimmed = codeText.replace(/^\n/, '').replace(/\n$/, '')
  const firstNewline = trimmed.indexOf('\n')
  if (firstNewline === -1) {
    return trimmed
  }
  const firstLine = trimmed.slice(0, firstNewline)
  if (/^[a-zA-Z0-9_-]{1,20}$/.test(firstLine)) {
    return trimmed.slice(firstNewline + 1)
  }
  return trimmed
}

function formatAssistantContent(content: string): Block[] {
  const segments = content.split('```')
  const blocks: Block[] = []
  let key = 0

  segments.forEach((segment, index) => {
    const isCode = index % 2 === 1

    if (isCode) {
      const codeText = stripLanguageTag(segment)
      if (codeText.trim().length > 0) {
        blocks.push({ type: 'code', key: `b${key++}`, text: codeText })
      }
      return
    }

    const chunks = segment
      .split(/\n\s*\n/)
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0)

    for (const chunk of chunks) {
      blocks.push(classifyChunk(chunk, `b${key++}`))
    }
  })

  return mergeAdjacentLists(blocks)
}

/**
 * Merge adjacent list blocks of the same type into one.
 *
 * The model sometimes separates list items with blank lines, which makes
 * each item its own chunk (and therefore its own block) before this merge
 * runs. Without merging, each item would render as its own single-item
 * <ol>/<ul>, and every standalone <ol> restarts its numbering at 1 -- which
 * is what caused every numbered item to display as "1.". Merging adjacent
 * same-type list blocks into one keeps a single <ol>/<ul> per logical list,
 * so numbering increases correctly.
 */
function mergeAdjacentLists(blocks: Block[]): Block[] {
  const merged: Block[] = []

  for (const block of blocks) {
    const previous = merged[merged.length - 1]

    if (previous?.type === 'numbered-list' && block.type === 'numbered-list') {
      merged[merged.length - 1] = { ...previous, items: [...previous.items, ...block.items] }
      continue
    }

    if (previous?.type === 'bullet-list' && block.type === 'bullet-list') {
      merged[merged.length - 1] = { ...previous, items: [...previous.items, ...block.items] }
      continue
    }

    merged.push(block)
  }

  return merged
}

function AssistantContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.key} className="whitespace-pre-wrap">
                {block.text}
              </p>
            )
          case 'bullet-list':
            return (
              <ul key={block.key} className="list-disc space-y-1 pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )
          case 'numbered-list':
            return (
              <ol key={block.key} className="list-decimal space-y-1 pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            )
          case 'code':
            return (
              <pre
                key={block.key}
                className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100"
              >
                <code>{block.text}</code>
              </pre>
            )
        }
      })}
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="AI Tutor is thinking">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
    </span>
  )
}

export function AiTutorChat({ starterPrompts, initialLessonContext }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, FeedbackState>>({})
  const [contextLabel, setContextLabel] = useState<string | null>(
    initialLessonContext ? `Using lesson context: ${initialLessonContext.title}` : null
  )

  const userTurnCount = messages.filter((m) => m.role === 'user').length
  const limitReached = userTurnCount >= MAX_USER_TURNS
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null

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
          ...(initialLessonContext ? { lessonSlug: initialLessonContext.slug } : {}),
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

      const rawContextLabel = response.headers.get(CONTEXT_LABEL_HEADER)
      if (rawContextLabel) {
        try {
          setContextLabel(decodeURIComponent(rawContextLabel))
        } catch {
          // Malformed header value -- keep whatever label was already shown.
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
      {contextLabel && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <BookOpen className="h-3 w-3" aria-hidden="true" />
          {contextLabel}
        </div>
      )}

      {messages.length === 0 && (
        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-6">
          <p className="text-sm font-medium text-slate-700 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-cyan-400 hover:text-cyan-800 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.role === 'user'
            const isCurrentlyStreaming = isStreaming && message.id === lastMessageId

            return (
              <div key={message.id} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    isUser
                      ? 'max-w-[85%] rounded-2xl bg-blue-600 px-4 py-3 text-white sm:max-w-lg'
                      : 'max-w-[85%] rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-slate-800 sm:max-w-2xl'
                  }
                >
                  <p
                    className={
                      isUser
                        ? 'mb-1 text-xs text-blue-100'
                        : 'mb-1 flex items-center gap-1 text-xs font-medium text-cyan-700'
                    }
                  >
                    {isUser ? 'You' : (
                      <>
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        AI Tutor
                      </>
                    )}
                  </p>

                  {isUser ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  ) : message.content ? (
                    <div className="text-sm leading-relaxed">
                      <AssistantContentBlocks blocks={formatAssistantContent(message.content)} />
                      {isCurrentlyStreaming && (
                        <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-slate-400 align-middle" />
                      )}
                    </div>
                  ) : isCurrentlyStreaming ? (
                    <ThinkingIndicator />
                  ) : null}

                  {message.role === 'assistant' && message.content && !isCurrentlyStreaming && (
                    <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleFeedback(message.id, true)}
                        disabled={feedback[message.id] === 'helpful' || feedback[message.id] === 'not_helpful'}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 disabled:cursor-default disabled:text-emerald-600 disabled:hover:text-emerald-600"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                        {feedback[message.id] === 'helpful' ? 'Thanks for your feedback' : 'Helpful'}
                      </button>
                      {feedback[message.id] !== 'helpful' && (
                        <button
                          type="button"
                          onClick={() => handleFeedback(message.id, false)}
                          disabled={feedback[message.id] === 'not_helpful'}
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 disabled:cursor-default disabled:text-slate-400 disabled:hover:text-slate-400"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
                          {feedback[message.id] === 'not_helpful' ? 'Thanks for your feedback' : 'Not helpful'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className={buttonVariants({ variant: 'ai' })}
          >
            {isStreaming ? 'Thinking...' : 'Ask'}
          </button>
        </form>
      )}
    </div>
  )
}
