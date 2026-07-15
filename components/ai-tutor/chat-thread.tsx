'use client'

import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

/**
 * Shared, presentational AI Tutor conversation UI (Spec 001 v1.1
 * AI-TUTOR-FR-023: the embedded panel and the standalone /ai-tutor page
 * must share one underlying implementation, not two). All conversation
 * state and network logic live in ai-tutor-panel-provider.tsx; this
 * component only renders it.
 *
 * The message formatting logic below (Block types, classifyChunk,
 * formatAssistantContent, mergeAdjacentLists) is carried over unchanged
 * from the pre-panel components/ai-tutor-chat.tsx -- see the comment on
 * formatAssistantContent for why this is deliberately not a markdown
 * parser and is safe by construction (no dangerouslySetInnerHTML).
 */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type FeedbackState = 'none' | 'helpful' | 'not_helpful'

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

export interface ChatMessageListProps {
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
  feedback: Record<string, FeedbackState>
  onFeedback: (responseId: string, isHelpful: boolean) => void
  starterPrompts?: string[]
  onStarterPromptClick?: (prompt: string) => void
}

/** The scrollable part of a conversation: starter prompts, message bubbles, and any error banner. Contains no input -- see ChatComposer. */
export function ChatMessageList({
  messages,
  isStreaming,
  error,
  feedback,
  onFeedback,
  starterPrompts,
  onStarterPromptClick,
}: ChatMessageListProps) {
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null

  return (
    <div className="space-y-4">
      {messages.length === 0 && starterPrompts && starterPrompts.length > 0 && (
        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-6">
          <p className="text-sm font-medium text-slate-700 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onStarterPromptClick?.(prompt)}
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
                        onClick={() => onFeedback(message.id, true)}
                        disabled={feedback[message.id] === 'helpful' || feedback[message.id] === 'not_helpful'}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 disabled:cursor-default disabled:text-emerald-600 disabled:hover:text-emerald-600"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                        {feedback[message.id] === 'helpful' ? 'Thanks for your feedback' : 'Helpful'}
                      </button>
                      {feedback[message.id] !== 'helpful' && (
                        <button
                          type="button"
                          onClick={() => onFeedback(message.id, false)}
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
    </div>
  )
}

export interface ChatComposerProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  limitReached: boolean
}

/** The input form -- kept separate from ChatMessageList so a fixed-height container (like the embedded panel) can pin this at the bottom while only the message list scrolls. */
export function ChatComposer({ input, onInputChange, onSubmit, isStreaming, limitReached }: ChatComposerProps) {
  if (limitReached) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        You&apos;ve reached the message limit for this session. Start a new chat to continue.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={isStreaming}
        rows={3}
        maxLength={4000}
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
  )
}

export interface ChatThreadProps {
  messages: ChatMessage[]
  input: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  error: string | null
  limitReached: boolean
  feedback: Record<string, FeedbackState>
  onFeedback: (responseId: string, isHelpful: boolean) => void
  starterPrompts?: string[]
  onStarterPromptClick?: (prompt: string) => void
  /** Set when the last request failed with 401 -- the caller isn't authenticated. */
  requiresLogin?: boolean
  loginHref?: string
}

/**
 * Convenience composition of ChatMessageList + ChatComposer for callers that
 * render in normal document flow (the standalone /ai-tutor page) and don't
 * need the list and input pinned separately. The embedded panel uses
 * ChatMessageList and ChatComposer directly instead -- see
 * embedded-ai-tutor-panel.tsx.
 */
export function ChatThread({
  messages,
  input,
  onInputChange,
  onSubmit,
  isStreaming,
  error,
  limitReached,
  feedback,
  onFeedback,
  starterPrompts,
  onStarterPromptClick,
  requiresLogin,
  loginHref,
}: ChatThreadProps) {
  if (requiresLogin) {
    return (
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-6 text-center space-y-3">
        <p className="text-sm text-slate-700">Log in to ask the AI Tutor a question.</p>
        <Link href={loginHref ?? '/auth/login'} className={buttonVariants({ variant: 'ai' })}>
          Log in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ChatMessageList
        messages={messages}
        isStreaming={isStreaming}
        error={error}
        feedback={feedback}
        onFeedback={onFeedback}
        starterPrompts={starterPrompts}
        onStarterPromptClick={onStarterPromptClick}
      />
      <ChatComposer
        input={input}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        isStreaming={isStreaming}
        limitReached={limitReached}
      />
    </div>
  )
}
