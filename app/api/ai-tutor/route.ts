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
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { isDeepDiveAvailable } from '@/lib/deep-dives'
import { INSIGHTS } from '@/content/insights/catalog'
import { isInsightAvailable } from '@/lib/insights'
import { SITE_URL } from '@/lib/config'
import { buildGroundedSystemPrompt } from '@/lib/ai/system-prompt'
import { buildProductFactsSection } from '@/lib/ai/product-facts'
import { retrievePublishedContent, formatRetrievedContentForPrompt } from '@/lib/ai/retrieve-published-content'
import { formatPracticeContextForPrompt } from '@/lib/ai/practice-context'
import { buildSourceRefs } from '@/lib/ai/build-source-refs'
import {
  checkAiTutorLimits,
  recordAiTutorUsageEvent,
  estimateTokens,
  type AiTutorUsageOrigin,
} from '@/lib/ai/tutor-usage'
import type { AiTutorSourceRef } from '@/components/ai-tutor/types'

/** Spec 006-style session cap: 1 turn = 1 user-authored message. */
const MAX_USER_TURNS = 20
/** Simple per-message abuse/cost guardrail. */
const MAX_MESSAGE_LENGTH = 4000
/** Response header carrying a ready-to-display context indicator label for the client UI. */
const CONTEXT_LABEL_HEADER = 'X-Ai-Tutor-Context-Label'
/** Response header carrying a JSON-encoded, UI-safe list of source lesson references (PR #132). */
const SOURCES_HEADER = 'X-Ai-Tutor-Sources'

type UsageStatus = 'success' | 'error' | 'rate_limited'

/**
 * Machine-readable error codes (PR #182). Previously the client had only a
 * status code and a prose message to work with, and 429 was shared by the
 * daily-quota block and the short cooldown -- so it could not tell "you are
 * out of questions for today" from "you clicked twice too fast" without
 * string-matching. The client now switches on `code`; prose stays purely
 * for display and can be reworded freely.
 */
export type AiTutorErrorCode =
  | 'daily_limit'
  | 'cooldown'
  | 'message_too_long'
  | 'unauthenticated'
  | 'invalid_request'
  | 'provider_error'
  | 'server_error'

function jsonError(
  message: string,
  status: number,
  code: AiTutorErrorCode,
  extra?: Record<string, unknown>
) {
  // Never include database/provider internals here -- `message` is always a
  // curated, user-facing string chosen at the call site.
  return new Response(JSON.stringify({ error: message, code, ...extra }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** The context's sourceType maps 1:1 to a usage-tracking origin; no context (a general/standalone question) is 'standalone'. */
function originForContext(context: ParsedAiTutorContext): AiTutorUsageOrigin {
  if (!context) return 'standalone'
  switch (context.sourceType) {
    case 'lesson':
      return 'lesson'
    case 'practice':
      return 'practice'
    case 'deep-dive':
      // Persisted as its own origin so Deep Dive usage is distinguishable.
      // REQUIRES migration 009 to have been applied -- see that file.
      return 'deep-dive'
    case 'insight':
      // Persisted as its own origin, mirroring 'deep-dive' above. REQUIRES
      // migration 013 to have been applied -- see that file.
      return 'insight'
    case 'learning-center':
      // Deliberately NOT its own persisted origin: the brief is explicit
      // about not expanding the database enum unnecessarily, and a question
      // asked while browsing the catalog is a standalone question for
      // usage-accounting purposes.
      return 'standalone'
  }
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
    return jsonError('Invalid request.', 400, 'invalid_request')
  }

  const rawMessages = (body as { messages: unknown[] }).messages
  const messages: TutorMessage[] = []

  for (const item of rawMessages) {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as { content?: unknown }).content !== 'string'
    ) {
      return jsonError('Invalid request.', 400, 'invalid_request')
    }

    const role = (item as { role?: unknown }).role
    const content = (item as { content: string }).content

    if (role !== 'user' && role !== 'assistant') {
      return jsonError('Invalid request.', 400, 'invalid_request')
    }
    if (content.length === 0) {
      return jsonError('Invalid request.', 400, 'invalid_request')
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      return jsonError(
        `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer. Please shorten your question.`,
        400,
        'message_too_long'
      )
    }

    messages.push({ role, content })
  }

  const userTurnCount = messages.filter((m) => m.role === 'user').length

  if (userTurnCount === 0) {
    return jsonError('Invalid request.', 400, 'invalid_request')
  }

  if (userTurnCount > MAX_USER_TURNS) {
    return jsonError(
      "You've reached the message limit for this session. Please refresh the page to start a new conversation.",
      400,
      'invalid_request'
    )
  }

  return messages
}

/** A slug-shaped string, or undefined if the value isn't one. */
function parseSlug(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const trimmed = raw.trim()
  if (trimmed.length === 0 || trimmed.length > 200 || !/^[a-z0-9-]+$/.test(trimmed)) {
    return undefined
  }
  return trimmed
}

/** A short, plain-text field within a sane length bound, or undefined. */
function parseShortText(raw: unknown, maxLength: number): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const trimmed = raw.trim()
  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return undefined
  }
  return trimmed
}

interface LessonAiTutorContext {
  sourceType: 'lesson'
  lessonSlug: string
}

interface PracticeAiTutorContext {
  sourceType: 'practice'
  questionTitle: string
  questionText: string
  options?: string[]
  selectedAnswer?: string
  revealed: boolean
  correctAnswer?: string
  explanation?: string
  relatedLessonSlugs?: string[]
}

/**
 * A Deep Dive the learner is reading (PR #181). Only the slug survives
 * parsing -- the client's title/path/section are deliberately discarded and
 * the slug is re-resolved against content/deep-dives/catalog.ts, so a
 * browser cannot inject a fake title or an unpublished Deep Dive.
 */
interface DeepDiveAiTutorContext {
  sourceType: 'deep-dive'
  deepDiveSlug: string
}

/**
 * The learner is reading a published IBM i Insight. Only the slug survives
 * parsing -- the client's title/path are deliberately discarded and the
 * slug is re-resolved against content/insights/catalog.ts, exactly
 * mirroring DeepDiveAiTutorContext above, so a browser cannot inject a fake
 * title or an unpublished/draft Insight.
 */
interface InsightAiTutorContext {
  sourceType: 'insight'
  insightSlug: string
}

/** The learner is browsing the Learning Center curriculum (PR #181). Carries no client data at all. */
interface LearningCenterAiTutorContext {
  sourceType: 'learning-center'
}

type ParsedAiTutorContext =
  | LessonAiTutorContext
  | PracticeAiTutorContext
  | DeepDiveAiTutorContext
  | InsightAiTutorContext
  | LearningCenterAiTutorContext
  | undefined

const MAX_QUESTION_TEXT_LENGTH = 2000
const MAX_OPTION_LENGTH = 500
const MAX_OPTIONS = 12
const MAX_EXPLANATION_LENGTH = 2000

/**
 * Parse the optional `context` field into a known context shape. Returns
 * undefined for anything missing, malformed, or of an unrecognized
 * sourceType -- an invalid/unknown context is always a normal "fall back to
 * general grounding" case here, never a 400. This also supports the legacy
 * `{ lessonSlug }`-only body shape from before the embedded panel, so any
 * caller still using it keeps working unchanged.
 */
function parseContext(body: unknown): ParsedAiTutorContext {
  if (typeof body !== 'object' || body === null) {
    return undefined
  }

  const legacyLessonSlug = parseSlug((body as { lessonSlug?: unknown }).lessonSlug)
  if (legacyLessonSlug) {
    return { sourceType: 'lesson', lessonSlug: legacyLessonSlug }
  }

  const raw = (body as { context?: unknown }).context
  if (typeof raw !== 'object' || raw === null) {
    return undefined
  }
  const sourceType = (raw as { sourceType?: unknown }).sourceType

  if (sourceType === 'lesson') {
    const lessonSlug = parseSlug((raw as { lessonSlug?: unknown }).lessonSlug)
    if (!lessonSlug) {
      return undefined
    }
    return { sourceType: 'lesson', lessonSlug }
  }

  if (sourceType === 'deep-dive') {
    const slug = parseSlug((raw as { deepDiveSlug?: unknown }).deepDiveSlug)
    // Re-resolve against the canonical catalog and require it to be
    // published. An unknown, unpublished, or spoofed slug is not an error --
    // it degrades to general grounding, same as any other invalid context.
    if (!slug || !DEEP_DIVES.some((d) => d.slug === slug && isDeepDiveAvailable(d))) {
      return undefined
    }
    return { sourceType: 'deep-dive', deepDiveSlug: slug }
  }

  if (sourceType === 'insight') {
    const slug = parseSlug((raw as { insightSlug?: unknown }).insightSlug)
    // Re-resolve against the canonical catalog and require it to be
    // published, mirroring the deep-dive case above exactly. An unknown,
    // draft, or spoofed slug is not an error -- it degrades to general
    // grounding, same as any other invalid context.
    if (!slug || !INSIGHTS.some((i) => i.slug === slug && isInsightAvailable(i))) {
      return undefined
    }
    return { sourceType: 'insight', insightSlug: slug }
  }

  if (sourceType === 'learning-center') {
    // Carries nothing from the client -- the type alone is the whole signal.
    return { sourceType: 'learning-center' }
  }

  if (sourceType === 'practice') {
    const questionTitle = parseShortText((raw as { questionTitle?: unknown }).questionTitle, 300)
    const questionText = parseShortText((raw as { questionText?: unknown }).questionText, MAX_QUESTION_TEXT_LENGTH)
    if (!questionTitle || !questionText) {
      return undefined
    }

    const rawOptions = (raw as { options?: unknown }).options
    const options =
      Array.isArray(rawOptions)
        ? rawOptions
            .filter((o): o is string => typeof o === 'string' && o.length > 0 && o.length <= MAX_OPTION_LENGTH)
            .slice(0, MAX_OPTIONS)
        : undefined

    const selectedAnswer = parseShortText((raw as { selectedAnswer?: unknown }).selectedAnswer, MAX_OPTION_LENGTH)
    const revealed = (raw as { revealed?: unknown }).revealed === true

    // correctAnswer/explanation are only ever honored when revealed === true
    // -- this is the server-side half of the AI-TUTOR-FR-021 guarantee. A
    // payload claiming revealed: false but still carrying an answer has that
    // answer silently dropped here, never forwarded to the model.
    const correctAnswer = revealed
      ? parseShortText((raw as { correctAnswer?: unknown }).correctAnswer, MAX_OPTION_LENGTH)
      : undefined
    const explanation = revealed
      ? parseShortText((raw as { explanation?: unknown }).explanation, MAX_EXPLANATION_LENGTH)
      : undefined

    const rawRelated = (raw as { relatedLessonSlugs?: unknown }).relatedLessonSlugs
    const relatedLessonSlugs = Array.isArray(rawRelated)
      ? rawRelated.filter((s): s is string => typeof s === 'string' && parseSlug(s) !== undefined)
      : undefined

    return {
      sourceType: 'practice',
      questionTitle,
      questionText,
      options,
      selectedAnswer,
      revealed,
      correctAnswer,
      explanation,
      relatedLessonSlugs,
    }
  }

  return undefined
}

/**
 * Resolve this request's published-content grounding via the single,
 * shared RAG v2 retrieval entry point (lib/ai/retrieve-published-content.ts)
 * -- lesson-origin, insight-origin, deep-dive-origin, practice-origin, and
 * general questions all go through the exact same retrievePublishedContent()
 * call, differing only in which options are set, per Spec 001 v1.1
 * AI-TUTOR-FR-023 (one implementation, not one per content type). Returns
 * the composed system prompt, a short, ready-to-display label describing
 * what context was used (or null if none was found/applicable), and a
 * compact list of source references for the client's "Sources used" UI
 * (PR #132).
 */
async function resolveGrounding(
  context: ParsedAiTutorContext,
  latestUserMessage: string
): Promise<{ systemPrompt: string; contextLabel: string | null; sources: AiTutorSourceRef[] }> {
  const practiceSection = context?.sourceType === 'practice' ? formatPracticeContextForPrompt(context) : null

  // Server-resolved from the canonical catalogs, never from client input.
  const resolvedDeepDive =
    context?.sourceType === 'deep-dive'
      ? (DEEP_DIVES.find((d) => d.slug === context.deepDiveSlug) ?? null)
      : null
  const resolvedInsight =
    context?.sourceType === 'insight'
      ? (INSIGHTS.find((i) => i.slug === context.insightSlug) ?? null)
      : null

  const result = await retrievePublishedContent({
    query: latestUserMessage,
    currentLessonSlug: context?.sourceType === 'lesson' ? context.lessonSlug : undefined,
    currentInsightSlug: resolvedInsight?.slug,
    currentDeepDiveSlug: resolvedDeepDive?.slug,
    relatedLessonSlugs: context?.sourceType === 'practice' ? context.relatedLessonSlugs : undefined,
  })

  /**
   * Page-awareness sections (PR #181; Deep Dive and Insight bodies both
   * joined the retrieval index in AI Tutor Insights/Deep Dives Grounding).
   * These state *where the learner is* using verified canonical metadata --
   * the actual grounding still comes from the retrieved chunks below
   * (guaranteed to include this item's own sections via
   * currentInsightSlug/currentDeepDiveSlug above), this section is only an
   * orientation anchor naming the title and URL explicitly.
   */
  const pageSections: string[] = []
  if (resolvedDeepDive) {
    pageSections.push(
      [
        'CURRENT PAGE',
        `The learner is reading the iRPGenie Deep Dive "${resolvedDeepDive.title}" (${SITE_URL}/deep-dives/${resolvedDeepDive.slug}).`,
        `Summary: ${resolvedDeepDive.description}`,
        'Relevant excerpts from this Deep Dive are included in the retrieved content section below when applicable. If those sections do not cover the question, answer from general IBM i knowledge and say plainly that you are not quoting this Deep Dive directly. Never invent what this Deep Dive says beyond what is retrieved.',
      ].join('\n')
    )
  } else if (resolvedInsight) {
    pageSections.push(
      [
        'CURRENT PAGE',
        `The learner is reading the iRPGenie Insight "${resolvedInsight.title}" (${SITE_URL}/insights/${resolvedInsight.slug}).`,
        `Summary: ${resolvedInsight.description}`,
        'Relevant excerpts from this Insight are included in the retrieved content section below when applicable. If those sections do not cover the question, answer from general IBM i knowledge and say plainly that you are not quoting this Insight directly. Never invent what this Insight says beyond what is retrieved.',
      ].join('\n')
    )
  } else if (context?.sourceType === 'learning-center') {
    pageSections.push(
      [
        'CURRENT PAGE',
        'The learner is browsing the iRPGenie Learning Center.',
        'On iRPGenie: "lessons" are the ordered IBM i Fundamentals curriculum; "Insights" are iRPGenie\'s focused, practical editorial articles; "Deep Dives" are iRPGenie\'s standalone professional-grade articles on a single topic; "Practice" and "Practice Lab" are the question bank and the guided 5250/SQL simulators; "AI Tutor" is you. These are iRPGenie product terms, not IBM terminology -- if the learner asks what a Deep Dive or an Insight is, explain the iRPGenie feature rather than the generic English phrase.',
      ].join('\n')
    )
  }

  // Priority order (PR #182): trusted platform facts FIRST, then verified
  // current-page context, then whatever retrieval found. Product questions
  // ("who founded this?", "is it free?") must be answerable from the facts
  // block regardless of which lesson, Insight, or Deep Dive is open, and
  // retrieved content must never be able to redefine the founder, quota,
  // pricing, or affiliation. Costs a few hundred tokens per request and no
  // extra model call -- there is deliberately no classifier step.
  const sections = [
    buildProductFactsSection(),
    ...pageSections,
    ...(practiceSection ? [practiceSection] : []),
    formatRetrievedContentForPrompt(result),
  ]
  const systemPrompt = buildGroundedSystemPrompt(sections)

  let contextLabel: string | null
  if (context?.sourceType === 'lesson' && result.resolvedCurrentContent?.contentType === 'lesson') {
    contextLabel = `Using lesson context: ${result.resolvedCurrentContent.title}`
  } else if (context?.sourceType === 'practice') {
    contextLabel = `Using practice context: ${context.questionTitle}`
  } else if (context?.sourceType === 'deep-dive' && resolvedDeepDive) {
    // Names the Deep Dive the learner is on, which the server verified
    // against the catalog. Deep Dive bodies are now in the retrieval index
    // (the currentDeepDiveSlug bucket above guarantees this item's own
    // sections are included), so "Using ... context" is accurate here --
    // matching the lesson/insight phrasing rather than the old "Reading"
    // wording that existed only because retrieval didn't cover Deep Dives
    // yet.
    contextLabel = `Using Deep Dive context: ${resolvedDeepDive.title}`
  } else if (context?.sourceType === 'insight' && resolvedInsight) {
    contextLabel = `Using Insight context: ${resolvedInsight.title}`
  } else if (context?.sourceType === 'learning-center') {
    contextLabel = 'Using Learning Center context'
  } else if (result.chunks.length > 0) {
    contextLabel = `Using course context: ${result.chunks.length} related section${result.chunks.length === 1 ? '' : 's'}`
  } else {
    contextLabel = null
  }

  return { systemPrompt, contextLabel, sources: buildSourceRefs(result) }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return jsonError('You must be logged in to use the AI Tutor.', 401, 'unauthenticated')
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError('Invalid request.', 400, 'invalid_request')
  }

  const parsed = parseMessages(body)
  if (parsed instanceof Response) {
    return parsed
  }
  const messages = parsed
  const context = parseContext(body)
  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
  const origin = originForContext(context)

  // Beta usage limits (PR #149) -- enforced here, before any grounding
  // lookup or model call, so a blocked request never reaches the AI
  // provider. Applies identically to every AI Tutor surface, since the
  // standalone page, the embedded panel (from a lesson or a practice
  // question), and any future caller all send their request through this
  // one route.
  const limitCheck = await checkAiTutorLimits(user.id, latestUserMessage)
  if (limitCheck.blocked) {
    after(() =>
      recordAiTutorUsageEvent({
        userId: user.id,
        origin,
        messageLength: latestUserMessage.length,
        wasBlocked: true,
        blockedReason: limitCheck.reason,
        estimatedInputTokens: estimateTokens(latestUserMessage),
      })
    )
    // `reason` is already exactly the discriminator the client needs, so it
    // doubles as the error code -- this is what lets the UI show the
    // limit-reached dialog for `daily_limit` while treating `cooldown` as an
    // ordinary transient message, even though both are HTTP 429.
    const status = limitCheck.reason === 'message_too_long' ? 400 : 429
    return jsonError(
      limitCheck.message,
      status,
      limitCheck.reason,
      limitCheck.contactHref ? { contactHref: limitCheck.contactHref } : undefined
    )
  }

  let systemPrompt: string
  let contextLabel: string | null
  let sources: AiTutorSourceRef[]
  try {
    const grounding = await resolveGrounding(context, latestUserMessage)
    systemPrompt = grounding.systemPrompt
    contextLabel = grounding.contextLabel
    sources = grounding.sources
  } catch (err) {
    // Grounding is an enhancement, not a hard dependency -- if lesson lookup
    // or retrieval fails for any reason, fall back to the ungrounded prompt
    // rather than breaking the AI Tutor response entirely.
    console.error('AI Tutor grounding resolution failed:', err)
    systemPrompt = buildGroundedSystemPrompt([])
    contextLabel = null
    sources = []
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
    // Counts toward the daily quota even though the provider call failed --
    // the request passed our own guardrails and was forwarded to the model,
    // which is what "20 requests per day" means from the user's side.
    after(() =>
      recordAiTutorUsageEvent({
        userId: user.id,
        origin,
        messageLength: latestUserMessage.length,
        wasBlocked: false,
        estimatedInputTokens: estimateTokens(latestUserMessage),
      })
    )

    if (kind === 'rate_limited') {
      return jsonError('AI Tutor is busy right now. Please try again in a moment.', 429, 'provider_error')
    }
    return jsonError('AI Tutor is temporarily unavailable. Please try again.', 502, 'provider_error')
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
      await recordAiTutorUsageEvent({
        userId: user.id,
        origin,
        messageLength: latestUserMessage.length,
        wasBlocked: false,
        estimatedInputTokens: estimateTokens(latestUserMessage),
      })
      return
    }
    const usage = await usagePromise
    await logUsage(supabase, user.id, 'success', usage)
    await recordAiTutorUsageEvent({
      userId: user.id,
      origin,
      messageLength: latestUserMessage.length,
      wasBlocked: false,
      model: PRIMARY_MODEL,
      // Prefer the provider's actual reported usage; fall back to the
      // character-based estimate only for whichever side it's missing.
      estimatedInputTokens: usage?.inputTokens ?? estimateTokens(latestUserMessage),
      estimatedOutputTokens: usage?.outputTokens,
    })
  })

  const headers: Record<string, string> = { 'Content-Type': 'text/plain; charset=utf-8' }
  if (contextLabel) {
    // Header values must be Latin-1; lesson titles are plain English text,
    // but encode defensively so any unexpected character can never break
    // response construction. The client decodes with decodeURIComponent.
    headers[CONTEXT_LABEL_HEADER] = encodeURIComponent(contextLabel)
  }
  if (sources.length > 0) {
    headers[SOURCES_HEADER] = encodeURIComponent(JSON.stringify(sources))
  }

  return new Response(stream, { headers })
}
