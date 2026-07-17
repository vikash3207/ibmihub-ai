'use client'

import { ThumbsUp, ThumbsDown, Bot, User, Send, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { AiTutorHeader } from './chat-header'
import { cn } from '@/lib/utils'
import type { AiTutorSourceRef } from './types'

/**
 * Shared, presentational AI Tutor conversation UI (Spec 001 v1.1
 * AI-TUTOR-FR-023: the embedded panel and the standalone /ai-tutor page
 * must share one underlying implementation, not two). All conversation
 * state and network logic live in ai-tutor-panel-provider.tsx; this
 * component only renders it.
 *
 * The message formatting logic below (Block types, classifyChunk,
 * formatAssistantContent, mergeAdjacentLists, renderInlineFormatting) is
 * deliberately not a markdown parser -- it's a small, safe-by-construction
 * text-to-React-elements formatter (no dangerouslySetInnerHTML anywhere in
 * this file). PR #153 added renderInlineFormatting() for single-backtick
 * inline code; everything else here is unchanged since the pre-panel
 * components/ai-tutor-chat.tsx.
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

/**
 * Renders `` `word` ``-wrapped segments of plain text (paragraphs, list
 * items) as styled inline `<code>` spans (PR #153) -- everything else
 * passes through unchanged. Splitting on a literal backtick and
 * alternating text/code by array index is safe by construction: no HTML
 * parsing, no dangerouslySetInnerHTML, just plain strings mapped to React
 * elements. Only applies within already-safe text nodes; fenced code
 * blocks (handled separately above) are untouched.
 */
function renderInlineFormatting(text: string, keyPrefix: string) {
  const segments = text.split('`')
  if (segments.length === 1) {
    return text
  }
  return segments.map((segment, i) =>
    i % 2 === 1 ? (
      <code key={`${keyPrefix}-${i}`} className="rounded bg-slate-200 px-1 py-0.5 font-mono text-[0.85em] text-slate-800">
        {segment}
      </code>
    ) : (
      segment
    )
  )
}

function AssistantContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.key} className="whitespace-pre-wrap">
                {renderInlineFormatting(block.text, block.key)}
              </p>
            )
          case 'bullet-list':
            return (
              <ul key={block.key} className="list-disc space-y-1.5 pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>{renderInlineFormatting(item, `${block.key}-${i}`)}</li>
                ))}
              </ul>
            )
          case 'numbered-list':
            return (
              <ol key={block.key} className="list-decimal space-y-1.5 pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>{renderInlineFormatting(item, `${block.key}-${i}`)}</li>
                ))}
              </ol>
            )
          case 'code':
            return (
              <pre
                key={block.key}
                className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100"
              >
                <code>{block.text}</code>
              </pre>
            )
        }
      })}
    </div>
  )
}

/**
 * Compact "Sources used" pills for a single assistant reply (PR #132,
 * restyled as small chips in PR #153). Deliberately title-first and
 * link-only: no raw chunk text, no visible relevance score. `heading`
 * (present only when a lesson contributed a single distinct section -- see
 * buildSourceRefs in the API route) is appended inline, never its own link.
 */
function SourcesList({ sources }: { sources: AiTutorSourceRef[] }) {
  return (
    <div className="mb-2.5">
      <p className="mb-1.5 font-medium text-slate-500">Sources used</p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((source) => (
          <Link
            key={source.lessonSlug}
            href={source.lessonPath}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-800 transition-colors hover:border-cyan-300 hover:bg-cyan-100"
          >
            <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate font-medium">
              {source.lessonTitle}
              {source.heading && <span className="font-normal text-cyan-700"> — {source.heading}</span>}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <span className="inline-flex items-center gap-2 py-0.5 text-slate-500">
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
      </span>
      <span className="text-xs">AI Tutor is thinking...</span>
    </span>
  )
}

/** Small circular avatar shown beside each message bubble -- cyan for the assistant (matches the AI Tutor brand accent used in Card/Badge/Button "ai" variants elsewhere), neutral slate for the user. */
function MessageAvatar({ role }: { role: 'user' | 'assistant' }) {
  if (role === 'assistant') {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white" aria-hidden="true">
        <Bot className="h-3.5 w-3.5" />
      </span>
    )
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600" aria-hidden="true">
      <User className="h-3.5 w-3.5" />
    </span>
  )
}

export interface ChatMessageListProps {
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
  /** Set only alongside `error` for the daily-quota-exhausted message (PR #149) -- renders as a small link under the error text. */
  errorContactHref?: string | null
  feedback: Record<string, FeedbackState>
  onFeedback: (responseId: string, isHelpful: boolean) => void
  starterPrompts?: string[]
  onStarterPromptClick?: (prompt: string) => void
  /** Source lesson references per assistant message id (PR #132) -- omitted or empty means that reply shows no "Sources used" block. */
  sources?: Record<string, AiTutorSourceRef[]>
}

/** The scrollable part of a conversation: starter prompts, message bubbles, and any error banner. Contains no input -- see ChatComposer. */
export function ChatMessageList({
  messages,
  isStreaming,
  error,
  errorContactHref,
  feedback,
  onFeedback,
  starterPrompts,
  onStarterPromptClick,
  sources,
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
              <div key={message.id} className={cn('flex items-end gap-2', isUser ? 'justify-end' : 'justify-start')}>
                {!isUser && <MessageAvatar role="assistant" />}
                <div
                  className={cn(
                    'min-w-0 rounded-2xl px-4 py-2.5',
                    isUser
                      ? 'max-w-[80%] bg-blue-600 text-white sm:max-w-[70%]'
                      : 'max-w-[85%] bg-slate-100 text-slate-800 sm:max-w-[80%]'
                  )}
                >
                  {/* Visually hidden -- the avatar + left/right alignment already conveys who's speaking sighted; without this, removing the old visible "You"/"AI Tutor" label would silently drop that context for screen reader users. */}
                  <span className="sr-only">{isUser ? 'You said:' : 'AI Tutor said:'}</span>
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
                    <div className="mt-3 border-t border-slate-200 pt-2 text-xs">
                      {sources?.[message.id] && sources[message.id].length > 0 && (
                        <SourcesList sources={sources[message.id]} />
                      )}
                      <div className="flex items-center gap-4">
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
                    </div>
                  )}
                </div>
                {isUser && <MessageAvatar role="user" />}
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <div className="flex items-end justify-start gap-2">
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800 max-w-[85%] sm:max-w-[80%]">
            <p>{error}</p>
            {errorContactHref && (
              <a href={errorContactHref} className="mt-1.5 inline-block font-medium underline hover:text-red-900">
                Contact us
              </a>
            )}
          </div>
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
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter (or any IME composition) inserts a
            // newline -- unchanged behavior, just documented explicitly now
            // that the button is icon-only and no longer labeled "Ask".
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              if (input.trim() && !isStreaming) {
                onSubmit(e)
              }
            }
          }}
          disabled={isStreaming}
          rows={2}
          maxLength={4000}
          aria-label="Ask the AI Tutor a question"
          placeholder="Ask about RPG, CL, SQL, IBM i..."
          className="flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          aria-label={isStreaming ? 'AI Tutor is thinking' : 'Send message'}
          className={cn(buttonVariants({ variant: 'ai' }), 'h-11 w-11 shrink-0 rounded-full p-0')}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {/* Display-only -- keep in sync with AI_TUTOR_DAILY_LIMIT's default in lib/ai/tutor-limits.ts (PR #149) if that default ever changes. */}
      <p className="text-xs text-slate-400">Beta limit: 20 AI Tutor questions/day</p>
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
  /** Set only alongside `error` for the daily-quota-exhausted message (PR #149). */
  errorContactHref?: string | null
  limitReached: boolean
  feedback: Record<string, FeedbackState>
  onFeedback: (responseId: string, isHelpful: boolean) => void
  starterPrompts?: string[]
  onStarterPromptClick?: (prompt: string) => void
  /** Source lesson references per assistant message id (PR #132). */
  sources?: Record<string, AiTutorSourceRef[]>
  /** Set when the last request failed with 401 -- the caller isn't authenticated. */
  requiresLogin?: boolean
  loginHref?: string
  /** Shown in the shared header when a lesson/practice context is active. */
  contextLabel?: string | null
}

/**
 * Self-contained chat window for callers that render in normal document
 * flow (the standalone /ai-tutor page) -- a bordered card with its own
 * header (components/ai-tutor/chat-header.tsx), a scrollable message
 * area, and a composer pinned at the bottom. The embedded panel doesn't
 * use this: it needs its own fixed-position/dialog wrapper, so it renders
 * AiTutorHeader + ChatMessageList + ChatComposer directly instead -- see
 * embedded-ai-tutor-panel.tsx. Message bubbles, the header, and the
 * composer are the same shared components either way (PR #153).
 */
export function ChatThread({
  messages,
  input,
  onInputChange,
  onSubmit,
  isStreaming,
  error,
  errorContactHref,
  limitReached,
  feedback,
  onFeedback,
  starterPrompts,
  onStarterPromptClick,
  sources,
  requiresLogin,
  loginHref,
  contextLabel,
}: ChatThreadProps) {
  return (
    <div className="flex h-[70vh] min-h-[420px] max-h-[720px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <AiTutorHeader contextLabel={contextLabel} />

      {requiresLogin ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-700">Log in to ask the AI Tutor a question.</p>
            <Link href={loginHref ?? '/auth/login'} className={buttonVariants({ variant: 'ai' })}>
              Log in
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <ChatMessageList
              messages={messages}
              isStreaming={isStreaming}
              error={error}
              errorContactHref={errorContactHref}
              feedback={feedback}
              onFeedback={onFeedback}
              starterPrompts={starterPrompts}
              onStarterPromptClick={onStarterPromptClick}
              sources={sources}
            />
          </div>
          <div className="shrink-0 border-t border-slate-100 px-4 py-3 sm:px-6">
            <ChatComposer
              input={input}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              isStreaming={isStreaming}
              limitReached={limitReached}
            />
          </div>
        </>
      )}
    </div>
  )
}
