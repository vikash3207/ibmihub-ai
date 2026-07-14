import { NextRequest } from 'next/server'
import { after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  streamTutorResponse,
  PRIMARY_MODEL,
  TutorProviderError,
  type TutorMessage,
  type TutorUsage,
  type TutorErrorKind,
} from '@/lib/ai/anthropic'
import { buildGroundedSystemPrompt } from '@/lib/ai/system-prompt'
import { getLessonContext, formatLessonContextForPrompt } from '@/lib/ai/lesson-context'
import { retrieveRelevantLessons, formatRetrievedLessonsForPrompt } from '@/lib/ai/retrieve-lessons'

/** Spec 006-style session cap: 1 turn = 1 user-authored message. */
const MAX_USER_TURNS = 20
/** Simple per-message abuse/cost guardrail. */
const MAX_MESSAGE_LENGTH = 4000
/** How many supplementary related lessons to surface alongside a specific lesson's own context. */
const RELATED_LESSONS_WHEN_LESSON_KNOWN = 3
/** How many lessons to retrieve when there is no specific lesson context. */
const RELATED_LESSONS_GENERAL = 5
/** Response header carrying a ready-to-display context indicator label for the client UI. */
const CONTEXT_LABEL_HEADER = 'X-Ai-Tutor-Context-Label'

type UsageStatus = 'success' | 'error' | 'rate_limited'

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function logUsage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  status: UsageStatus,
  usage: TutorUsage | null
) {
  try {
    await supabase.from('ai_usage_log').insert({
      user_id: userId,
      model: PRIMARY_MODEL,
      input_tokens: usage?.inputTokens ?? 0,
      output_tokens: usage?.outputTokens ?? 0,
      status,
    })
  } catch (err) {
    // Usage logging is best-effort only. It must never break or delay the
    // user-facing response.
    console.error('Failed to log AI Tutor usage:', err)
  }
}

function statusForErrorKind(kind: TutorErrorKind): UsageStatus {
  return kind === 'rate_limited' ? 'rate_limited' : 'error'
}

/**
 * Parse and validate the request body into a TutorMessage[]. Returns either
 * the validated messages or a Response to send back immediately.
 */
function parseMessages(body: unknown): TutorMessage[] | Response {
  if (typeof body !== 'object' || body === null || !Array.isArray((body as { messages?: unknown }).messages)) {
    return jsonError('Invalid request.', 400)
  }

  const rawMessages = (body as { messages: unknown[] }).messages
  const messages: TutorMessage[] = []

  for (const item of rawMessages) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as { content?: unknown }).content !== 'string'
    ) {
      return jsonError('Invalid request.', 400)
    }

    const role = (item as { role?: unknown }).role
    const content = (item as { content: string }).content

    if (role !== 'user' && role !== 'assistant') {
      return jsonError('Invalid request.', 400)
    }
    if (content.length === 0) {
      return jsonError('Invalid request.', 400)
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      return jsonError(
        `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer. Please shorten your question.`,
        400
      )
    }

    messages.push({ role, content })
  }

  const userTurnCount = messages.filter((m) => m.role === 'user').length

  if (userTurnCount === 0) {
    return jsonError('Invalid request.', 400)
  }

  if (userTurnCount > MAX_USER_TURNS) {
    return jsonError(
      "You've reached the message limit for this session. Please refresh the page to start a new conversation.",
      400
    )
  }

  return messages
}

/**
 * Parse the optional lessonSlug field. Returns undefined for anything
 * missing or not slug-shaped -- an invalid or unknown lessonSlug is a
 * normal, silently-ignored case here, never a 400.
 */
function parseLessonSlug(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) {
    return undefined
  }
  const raw = (body as { lessonSlug?: unknown }).lessonSlug
  if (typeof raw !== 'string') {
    return undefined
  }
  const trimmed = raw.trim()
  if (trimmed.length === 0 || trimmed.length > 200 || !/^[a-z0-9-]+$/.test(trimmed)) {
    return undefined
  }
  return trimmed
}

/**
 * Resolve this request's course-content grounding: the current lesson's
 * content (if a valid lessonSlug was provided) plus, either alongside it or
 * on its own, a small set of retrieved lessons relevant to the learner's
 * latest message. Returns the composed system prompt and a short,
 * ready-to-display label describing what context was used (or null if
 * none was found/applicable).
 */
async function resolveGrounding(
  lessonSlug: string | undefined,
  latestUserMessage: string
): Promise<{ systemPrompt: string; contextLabel: string | null }> {
  if (lessonSlug) {
    const lessonContext = await getLessonContext(lessonSlug)
    if (lessonContext) {
      const sections = [formatLessonContextForPrompt(lessonContext)]
      const related = await retrieveRelevantLessons(latestUserMessage, {
        maxResults: RELATED_LESSONS_WHEN_LESSON_KNOWN,
        excludeSlug: lessonContext.slug,
      })
      if (related.length > 0) {
        sections.push(formatRetrievedLessonsForPrompt(related))
      }
      return {
        systemPrompt: buildGroundedSystemPrompt(sections),
        contextLabel: `Using lesson context: ${lessonContext.title}`,
      }
    }
    // Unknown/unpublished lessonSlug -- fall through to general retrieval below.
  }

  const related = await retrieveRelevantLessons(latestUserMessage, { maxResults: RELATED_LESSONS_GENERAL })
  const systemPrompt = buildGroundedSystemPrompt([formatRetrievedLessonsForPrompt(related)])
  const contextLabel =
    related.length > 0
      ? `Using course context: ${related.length} related lesson${related.length === 1 ? '' : 's'}`
      : null

  return { systemPrompt, contextLabel }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return jsonError('You must be logged in to use the AI Tutor.', 401)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid request.', 400)
  }

  const parsed = parseMessages(body)
  if (parsed instanceof Response) {
    return parsed
  }
  const messages = parsed
  const lessonSlug = parseLessonSlug(body)
  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''

  let systemPrompt: string
  let contextLabel: string | null
  try {
    const grounding = await resolveGrounding(lessonSlug, latestUserMessage)
    systemPrompt = grounding.systemPrompt
    contextLabel = grounding.contextLabel
  } catch (err) {
    // Grounding is an enhancement, not a hard dependency -- if lesson lookup
    // or retrieval fails for any reason, fall back to the ungrounded prompt
    // rather than breaking the AI Tutor response entirely.
    console.error('AI Tutor grounding resolution failed:', err)
    systemPrompt = buildGroundedSystemPrompt([])
    contextLabel = null
  }

  let textStream: AsyncIterable<string>
  let usagePromise: Promise<TutorUsage | null>

  try {
    const result = streamTutorResponse(systemPrompt, messages)
    textStream = result.textStream
    usagePromise = result.usage
  } catch (err) {
    const kind = err instanceof TutorProviderError ? err.kind : 'provider_error'
    after(() => logUsage(supabase, user.id, statusForErrorKind(kind), null))

    if (kind === 'rate_limited') {
      return jsonError('AI Tutor is busy right now. Please try again in a moment.', 429)
    }
    return jsonError('AI Tutor is temporarily unavailable. Please try again.', 502)
  }

  const encoder = new TextEncoder()
  let streamFailed = false
  let failureKind: TutorErrorKind = 'provider_error'

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of textStream) {
          controller.enqueue(encoder.encode(chunk))
        }
      } catch (err) {
        streamFailed = true
        failureKind = err instanceof TutorProviderError ? err.kind : 'provider_error'
      } finally {
        controller.close()
      }
    },
  })

  // Logged only once the stream has fully completed (success or failure),
  // scheduled via after() so it never delays the streamed response itself.
  after(async () => {
    if (streamFailed) {
      await logUsage(supabase, user.id, statusForErrorKind(failureKind), null)
      return
    }
    const usage = await usagePromise
    await logUsage(supabase, user.id, 'success', usage)
  })

  const headers: Record<string, string> = { 'Content-Type': 'text/plain; charset=utf-8' }
  if (contextLabel) {
    // Header values must be Latin-1; lesson titles are plain English text,
    // but encode defensively so any unexpected character can never break
    // response construction. The client decodes with decodeURIComponent.
    headers[CONTEXT_LABEL_HEADER] = encodeURIComponent(contextLabel)
  }

  return new Response(stream, { headers })
}
