/**
 * Anthropic provider wrapper -- the only file in this codebase that imports
 * @anthropic-ai/sdk (Spec 001 AI-TUTOR-FR-013 provider abstraction layer).
 * Server-only. No other module should call the Anthropic SDK directly.
 */
import 'server-only'

import Anthropic, { APIConnectionError, APIError, RateLimitError } from '@anthropic-ai/sdk'

// Lazily constructed so that importing this module (e.g. during `next build`'s
// route page-data collection, which happens before any request and without
// runtime secrets necessarily present) never throws. The key is only
// required -- and only checked -- when a Tutor response is actually
// requested.
let client: Anthropic | null = null

function getClient(): Anthropic {
  if (client) {
    return client
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing ANTHROPIC_API_KEY. lib/ai/anthropic.ts must only be used in server-side contexts with this variable set.'
    )
  }

  client = new Anthropic({ apiKey })
  return client
}

/** Primary AI Tutor model, verified per ADR-005 (Batch 18 update). */
export const PRIMARY_MODEL = 'claude-sonnet-5'

/**
 * Cost fallback model constant (ADR-005). Switching to this model is a
 * deliberate one-line change to the `model` argument passed to
 * streamTutorResponse -- MVP does not automatically fail over to it at
 * runtime.
 */
export const FALLBACK_MODEL = 'claude-haiku-4-5-20251001'

const MAX_RESPONSE_TOKENS = 1024

export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface TutorUsage {
  inputTokens: number
  outputTokens: number
}

export type TutorErrorKind = 'rate_limited' | 'provider_error' | 'network_error'

export class TutorProviderError extends Error {
  readonly kind: TutorErrorKind

  constructor(kind: TutorErrorKind, message: string) {
    super(message)
    this.name = 'TutorProviderError'
    this.kind = kind
  }
}

function mapProviderError(err: unknown): TutorProviderError {
  if (err instanceof RateLimitError) {
    return new TutorProviderError('rate_limited', 'AI Tutor rate limit exceeded')
  }
  if (err instanceof APIConnectionError) {
    return new TutorProviderError('network_error', 'Network error contacting AI provider')
  }
  if (err instanceof APIError) {
    return new TutorProviderError('provider_error', 'AI provider returned an error')
  }
  return new TutorProviderError('provider_error', 'Unknown AI provider error')
}

/**
 * Stream a Tutor response for the given conversation history.
 *
 * Returns an async-iterable of text deltas to forward to the client, plus a
 * promise that resolves to token usage once the stream completes (or null
 * if usage could not be determined). Never throws raw SDK errors -- callers
 * receive a TutorProviderError with a safe, generic kind/message.
 */
export function streamTutorResponse(
  systemPrompt: string,
  messages: TutorMessage[],
  model: string = PRIMARY_MODEL
): { textStream: AsyncIterable<string>; usage: Promise<TutorUsage | null> } {
  function createStream() {
    return getClient().messages.stream({
      model,
      max_tokens: MAX_RESPONSE_TOKENS,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })
  }

  let stream: ReturnType<typeof createStream>

  try {
    stream = createStream()
  } catch (err) {
    throw mapProviderError(err)
  }

  const usage: Promise<TutorUsage | null> = stream
    .finalMessage()
    .then((message) => ({
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    }))
    .catch(() => null)

  async function* textStream(): AsyncGenerator<string> {
    try {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield event.delta.text
        }
      }
    } catch (err) {
      throw mapProviderError(err)
    }
  }

  return { textStream: textStream(), usage }
}
