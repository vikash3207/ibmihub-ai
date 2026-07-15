# Embedded AI Tutor Panel — Design Proposal

**Date:** 2026-07-15
**Author:** Proposal produced as PR #126, following PR #125 (Professional Practice Questions for Advanced Tracks).
**Purpose:** Investigate current AI Tutor spec/implementation and propose a safe architecture for opening the AI Tutor as a persistent embedded panel (desktop) / full-screen sheet (mobile) from lesson pages and `/practice`, instead of navigating away to `/ai-tutor`.

**This PR is design/proposal only.** No routes, components, AI Tutor logic, or UI behavior were changed. `git status` at the end of this PR shows only this new planning document.

---

## 1. Existing AI Tutor Spec — What's Documented vs What's Actually Shipped

Three documents govern or reference AI Tutor behavior:

| Document | Status | Relevance |
|---|---|---|
| `specs/001-ai-tutor/spec.md` | v1.0 **Approved** | The governing AI Tutor spec |
| `specs/002-ai-tutor.md` | Undated, no status field | A stale, superseded MVP-placeholder stub (14 lines: "Local UI only, no backend AI integration yet") — clearly predates and is superseded by `specs/001-ai-tutor/spec.md`. Not a current source of truth. |
| `specs/003-lesson-experience/spec.md` | References Spec 001 | Governs the lesson page's AI Tutor **link** specifically |

**Spec 001 v1.0 (Approved) explicitly and repeatedly states, as MVP scope:**
- "Prompt-guidance-only behavior... **no lesson-aware context, no RAG**, no fine-tuning (D-AI-003)" (Section 3)
- "**Lesson-aware AI (AI knowing current lesson context)** | Deferred to post-MVP; adds pipeline complexity (D-AI-003)" (Section 4, Explicitly Out of Scope)
- "**Retrieval-Augmented Generation (RAG)** | Not required for MVP prompt-guidance approach (D-AI-003)" (Section 4)
- "Conversation history is maintained within a single browser session; **it is not persisted server-side across sessions** (D-AI-004)" (Section 3)
- "The AI Tutor is a **dedicated full-page experience** accessible at `/ai-tutor`... Lessons may include a link that navigates the user to `/ai-tutor`, but **the AI Tutor is not embedded as a lesson-aware side panel or modal in MVP**." (Section 12, UX Requirements)

**Spec 003 (Lesson Experience) reinforces this even more explicitly**, in its own Out-of-Scope table and functional requirements:
- "Lesson-aware embedded AI | Deferred to post-MVP (D-AI-003); AI Tutor link only"
- "Inline AI side panel or chat overlay | Not in MVP scope; would require lesson-aware context"
- **LESSON-FR-011 — AI Tutor Link:** "The AI Tutor is **not embedded** in the lesson page (no lesson-aware AI, no side panel); the link navigates away from the lesson"
- Its own acceptance checklist includes: "[ ] The AI Tutor is **not embedded** as a side panel or inline chat; only a link to `/ai-tutor` is present"

### An important, surprising finding: the current implementation already exceeds this documented spec

Reading the actual shipped code (`app/api/ai-tutor/route.ts`, `lib/ai/lesson-context.ts`, `lib/ai/retrieve-lessons.ts`) shows that **lesson-aware context and a form of RAG are already implemented and shipped today** — directly contradicting Spec 001/003's "no lesson-aware context, no RAG" MVP boundary:

- `lib/ai/lesson-context.ts`'s `getLessonContext(lessonSlug)` loads the **actual current lesson's markdown body** (up to 6,000 characters) and injects it into the system prompt via `formatLessonContextForPrompt()`.
- `lib/ai/retrieve-lessons.ts`'s `retrieveRelevantLessons()` is a genuine (keyword-based, not vector) retrieval step that scores all Published lessons against the user's latest message and injects the top matches into the system prompt — this is RAG in substance, even though it predates/avoids vector embeddings.
- The lesson page's own copy already tells users this: *"Opening it from here shares this lesson's title and content so it can answer questions about it directly."*

**This means lesson-aware AI Tutor grounding was already built and shipped at some point without a corresponding spec revision.** This is not something introduced by this proposal — it's a pre-existing gap between documentation and reality that this proposal surfaces as a byproduct of investigating the spec. It's flagged here for visibility, not as something this PR fixes.

### Does the embedded panel change or extend the approved spec?

**It changes it, and needs explicit Product Owner approval before implementation.** Specifically:
- Spec 001 Section 12 and Spec 003 LESSON-FR-011 both explicitly say the AI Tutor is **not** embedded as a side panel — an embedded panel is a direct, literal reversal of a specifically-called-out MVP boundary, not a gray area.
- The lesson-aware *grounding* (content injection, retrieval) is **already shipped** — so the embedded *panel* proposal is really about **UI/UX delivery** of already-existing grounding capability, not about adding grounding that doesn't exist yet. This makes the panel a smaller conceptual leap than the spec text alone suggests, but it is still a documented MVP exclusion.
- **Recommendation:** Before any implementation PR, the Product Owner should either (a) approve a Spec 001/003 revision that formally documents both the already-shipped lesson-aware grounding and the new embedded panel, or (b) explicitly approve the panel as a scoped exception pending a later formal spec update. Shipping the panel without either would leave the spec even further out of sync with reality than it already is.

---

## 2. Current AI Tutor Implementation

### Route / page
`app/(authenticated)/ai-tutor/page.tsx` — a server component, auth-gated (`if (!user) redirect('/auth/login?next=%2Fai-tutor')`), rendered under the `(authenticated)` route group's shared layout (`app/(authenticated)/layout.tsx`).

- Reads `searchParams: Promise<{ lesson?: string }>`.
- Resolves `?lesson=slug` via `getPublishedLessonBySlugOrNull(lessonSlug)` — an unknown, missing, or unpublished slug is treated as a normal "no context" case, never an error.
- Passes `initialLessonContext = { slug, title }` (title/slug only, not body) into `<AiTutorChat>`.

### Component
`components/ai-tutor-chat.tsx` (`'use client'`) — owns **all** conversation state locally via `useState`: `messages`, `input`, `isStreaming`, `error`, `feedback`, `contextLabel`. Nothing here is hoisted to a parent, a URL, or any shared store. Sends `POST /api/ai-tutor` with the full message history plus `lessonSlug` (if present) on every submit; streams the response back via `ReadableStream` and appends chunks to the last assistant message.

### API route
`app/api/ai-tutor/route.ts` — validates the caller is authenticated (`401` if not), validates message shape/length/turn-count (`MAX_USER_TURNS = 20`, `MAX_MESSAGE_LENGTH = 4000`), then calls `resolveGrounding(lessonSlug, latestUserMessage)`:
- If `lessonSlug` resolves to a real Published lesson: injects that lesson's title/summary/tags/body (via `getLessonContext`) **plus** up to 3 other retrieved lessons relevant to the latest message (`retrieveRelevantLessons`, excluding the current lesson).
- Otherwise: retrieves up to 5 generally relevant lessons based on the latest message alone.
- Returns a ready-to-display `contextLabel` string via a response header (`X-Ai-Tutor-Context-Label`), e.g. `"Using lesson context: <title>"` or `"Using course context: N related lessons"`.
- Streams the model response as `text/plain`; logs token usage to `ai_usage_log` via Supabase, best-effort, after the stream completes (`after()`).

### Lesson-aware retrieval/context logic
`lib/ai/lesson-context.ts` and `lib/ai/retrieve-lessons.ts` (both detailed above) are the two grounding primitives. Both are server-only, read exclusively from `getPublishedLessons()`/`getPublishedLessonBySlugOrNull()`, so **Review Ready/Draft lesson content can never reach the AI Tutor prompt** — the same Published-only guarantee the rest of the app relies on.

### Current "Ask the AI Tutor" entry points

| Location | Link | Context passed |
|---|---|---|
| Lesson detail page (`app/learn/ibm-i-fundamentals/[slug]/page.tsx`) | `/ai-tutor?lesson=${lesson.slug}` | Lesson slug only (title/body resolved server-side from it) |
| Practice question card (`components/practice-browser.tsx`) | `/ai-tutor?lesson=${linkableRelatedLessons[0]}` if the question has a linkable related lesson, else bare `/ai-tutor` | **Only a related lesson's slug, if one exists** — the question text, options, selected answer, correctAnswer, and explanation are **not passed at all today**. A learner asking "why is this answer correct?" from Practice currently gets generic lesson-level context, not question-level context. |

Both are plain `<Link href="...">` elements — a full page navigation, not a client-side panel toggle. This is the exact problem this proposal addresses, and also surfaces a second, independent gap: **practice-question context isn't wired to the AI Tutor at all today**, even navigationally.

### Is context passed page-route dependent, and can it be reused in a shared panel?

**Yes, and yes, cleanly.** The `?lesson=` query param → `getLessonContext()` → system-prompt-injection pipeline is entirely decoupled from the `/ai-tutor` page itself — it's just a `lessonSlug: string` accepted by the API route's request body. Nothing about `resolveGrounding()`, `getLessonContext()`, or `retrieveRelevantLessons()` depends on being called from the `/ai-tutor` route specifically. An embedded panel calling the same `POST /api/ai-tutor` endpoint with the same request shape would get identical grounding behavior for free. **What would need to change** is the API route's request contract: today it only accepts `lessonSlug`; a practice-question-aware panel needs the route to also accept practice-question context (see Section 4) so grounding can be extended to cover it — that is new server-side work, not a reuse of something that doesn't exist yet.

---

## 3. Shared Panel Architecture Proposal

### Option A: Local state inside each page
Each of `/practice` and the lesson detail page manages its own "is the tutor open" + conversation state independently.

- **Benefits:** Simplest to write per-page; zero cross-cutting changes.
- **Risks:** Directly fails the stated persistence requirement — navigating from a lesson to `/practice` (or lesson-to-lesson) would unmount the page and lose all conversation state, exactly the current problem. Also guarantees duplicate implementations (the opposite of "prefer one shared implementation").
- **Persistence across lesson navigation:** None — full remount on every route change.
- **Persistence across practice navigation:** None, same reason.
- **Mobile support:** Would need to be built twice.
- **Implementation complexity:** Low per page, high in aggregate (duplication, drift risk).
- **Effect on `/ai-tutor`:** None, but doesn't solve the actual problem.
- **Verdict: rejected** — doesn't meet the core requirement.

### Option B: Shared React context provider at a layout level
A client-side `AiTutorPanelProvider` holds panel open/closed state, conversation messages, and active context, exposed via a React Context. Rendered once, high enough in the tree to survive navigation between `/learn/*` and `/practice`.

- **Benefits:** Conversation state genuinely survives client-side navigation (React Context + component state under a layout that doesn't unmount persists across route changes within that layout's subtree in the App Router). One shared implementation, reused everywhere. No URL complexity.
- **Risks:** Requires finding a layout that actually wraps *both* `/learn/*` and `/practice` — see the concrete finding below, this is less trivial than it sounds in this codebase. State is memory-only; a hard refresh always loses it (matches the stated "acceptable" MVP scope).
- **Persistence across lesson navigation:** Yes, as long as the provider lives above `/learn/*`'s layout.
- **Persistence across practice navigation:** Yes, as long as the provider lives above `/practice`'s layout.
- **Mobile support:** Same provider drives both desktop panel and mobile sheet presentational components — no duplication.
- **Implementation complexity:** Medium — mostly in choosing the right place to mount the provider and building the two presentational shells (panel/sheet).
- **Effect on `/ai-tutor`:** None required — it can keep working exactly as-is, optionally later reading from the same context if desired (not required for MVP).
- **Concrete architectural finding in this codebase:** `/learn/*` pages render under `app/learn/layout.tsx`, while `/practice` and `/ai-tutor` render under `app/(authenticated)/layout.tsx` — **these are sibling route groups, not nested**. The only layout that currently wraps both trees is the root `app/layout.tsx`. This means the provider **must** be mounted in (or just under) the root layout to survive navigation between a lesson page and `/practice` — mounting it inside either `app/learn/layout.tsx` or `app/(authenticated)/layout.tsx` alone would only preserve state within that one tree, not across both, which fails the stated requirement ("navigates between lessons or practice questions").
- **Verdict: recommended**, with the root-layout placement caveat above explicitly called out for the implementation PR.

### Option C: URL/query-param driven panel state
Panel open/closed and active context live entirely in the URL (e.g. `?tutor=open&tutorLesson=slug`), read via `useSearchParams`/`router.push`, no separate client state.

- **Benefits:** Shareable/bookmarkable URLs; browser back/forward naturally opens/closes the panel; survives a hard refresh for the *open/closed* and *context* state (not the conversation itself).
- **Risks:** Conversation *messages* still can't live in a URL (message content is too large and would leak into browser history/analytics) — so this option alone doesn't solve persistence of the actual chat; every route change would still trigger a new page-data fetch and likely reset local component state unless combined with Option B anyway. Query-param-driven UI toggles also tend to fight with `router.push`/`replace` semantics and can cause janky double-renders if not handled carefully.
- **Persistence across lesson navigation:** Only the open/closed + context-label state, not messages, unless paired with B.
- **Persistence across practice navigation:** Same limitation.
- **Mobile support:** No inherent effect either way.
- **Implementation complexity:** Medium-high once you account for keeping URL state in sync with client state without fighting Next.js navigation.
- **Effect on `/ai-tutor`:** Would need `/ai-tutor` itself to also understand `?tutor=open`, which is redundant with just being on that page.
- **Verdict: not sufficient alone** — doesn't solve message persistence, which is the actual pain point.

### Option D: Hybrid — layout-level provider + optional URL state
Option B for the actual state (open/closed, messages, active context) plus a lightweight, optional URL flag purely for deep-linking convenience (e.g. a lesson page could link to itself with `?askTutor=1` to auto-open the panel on load, without encoding the conversation itself in the URL).

- **Benefits:** Gets Option B's real persistence, plus an optional nicety (a link can request "open the tutor for me") without taking on Option C's problems, since the URL never carries message content.
- **Risks:** Slightly more surface area than B alone (one more param to define and consume); needs a clear rule that the URL flag only ever *triggers* an open, never *stores* the conversation.
- **Persistence across lesson/practice navigation:** Same as B (full).
- **Mobile support:** Same as B.
- **Implementation complexity:** B's complexity plus a small amount more.
- **Effect on `/ai-tutor`:** None required.
- **Verdict:** A reasonable enhancement *on top of* B, but not required for an MVP implementation PR. **Recommendation: implement B first; treat D's URL-trigger flag as an optional, later nicety**, not part of the first implementation PR's scope.

### Recommended direction: Option B (root-layout-mounted shared provider), with Option D's URL trigger as a clearly optional future enhancement.

---

## 4. Context Model Proposal

A single discriminated-union payload type, reusable across both origins and a general fallback:

```typescript
// components/ai-tutor/types.ts (proposed, not implemented in this PR)

export type AiTutorContext =
  | {
      sourceType: 'lesson'
      lessonSlug: string
      lessonTitle: string
      lessonPath: string          // e.g. `/learn/ibm-i-fundamentals/${slug}`, for a "back to lesson" link in the panel
      topicId?: string            // lib/topics.ts TopicFilter id, if resolvable
      masterCategoryId?: string   // lib/master-categories.ts id, if resolvable (PR #121/#123)
      selectedText?: string       // optional, future: user-highlighted text
      suggestedQuestion?: string  // aiTutorStarterQuestion, if present
    }
  | {
      sourceType: 'practice'
      questionId: string
      topicId: string             // PracticeTopic id (content/practice/questions.ts)
      questionTitle: string
      questionText: string
      options?: string[]
      selectedAnswer?: string
      revealed: boolean
      correctAnswer?: string      // only included when `revealed` is true -- see Section 9
      explanation?: string        // only included when `revealed` is true -- see Section 9
      relatedLessonSlugs: string[]
    }
  | {
      sourceType: 'general'
    }
```

**How this reaches the existing lesson-aware backend:** `app/api/ai-tutor/route.ts`'s request body today only accepts `{ messages, lessonSlug? }`. This proposal would extend that contract (in the implementation PR, not here) to accept the full `AiTutorContext` shape instead of a bare `lessonSlug`:
- `sourceType: 'lesson'` → maps directly to today's existing `lessonSlug` path through `resolveGrounding()`; no change to `getLessonContext()`/`retrieveRelevantLessons()` needed.
- `sourceType: 'practice'` → is **new** grounding work: a new small formatter (parallel to `formatLessonContextForPrompt`) that turns the question text/options/reveal state into a system-prompt section, optionally still layering `retrieveRelevantLessons()` on top using `relatedLessonSlugs` similar to how the lesson path layers in 3 additional retrieved lessons today.
- `sourceType: 'general'` → maps directly to today's existing no-`lessonSlug` fallback path (already implemented, unchanged).

This keeps the *lesson* grounding path 100% reused as-is, and scopes the *only* new backend work to a practice-question formatter — a small, additive change, not a rewrite.

---

## 5. Routing and URL Behavior

- **Should `/ai-tutor` remain as a standalone page?** Yes. It should keep working exactly as it does today — both as a fallback for anyone with an existing bookmarked/shared link, and as the "general tutor, no specific context" experience. Spec 001 Section 12 already establishes it as "a dedicated full-page experience," and nothing about the embedded panel requires removing or degrading it.
- **Should the embedded panel have a deep-link URL?** Not required for MVP. If added later (Option D), it should be a request-to-open flag only (e.g. `?askTutor=1` on a lesson URL), never a full state-encoding URL.
- **Should the current page URL get `?tutor=open`?** Optional, later (Option D) — not needed for the first implementation PR, since the panel's own open/closed state can live entirely in the Option B provider.
- **Should lesson/practice context be stored in URL, React state, or both?** React state (the Option B provider), derived fresh from whatever lesson/question the learner is currently viewing — not stored in the URL. The URL already encodes "which lesson/question" via the existing route/page, so the provider can re-derive the *current* context from props each time the surrounding page changes, independent of whether the panel itself is reflected in the URL.
- **What happens on browser refresh?** The panel's open/closed state and conversation reset to closed/empty — consistent with Spec 001 D-AI-004's existing "not persisted server-side" behavior, and explicitly acceptable per this proposal's own MVP scope (Section 6).
- **What happens if a user opens a direct `/ai-tutor` route?** Exactly what happens today: the full-page experience, optionally seeded with `?lesson=` if present. Unaffected by the embedded panel work.

---

## 6. Persistence Behavior

| Scenario | Proposed MVP behavior |
|---|---|
| Lesson-to-lesson navigation (panel open) | Conversation persists (Option B state survives, since navigation stays under the root-layout-mounted provider); the active context indicator updates to the new lesson. |
| Practice question-to-question navigation (panel open) | Conversation persists; active context indicator updates to the new question. |
| Topic filter navigation (Learning Center or Practice) | Conversation persists; this is just another client-side navigation under the same provider. |
| Closing and reopening the panel (same page, no navigation) | Conversation persists — closing only toggles visibility, it must not clear state. |
| Full page refresh (F5) | Conversation resets to empty, panel resets to closed. This matches Spec 001 D-AI-004 (no server-side persistence across sessions) and is explicitly acceptable scope per this proposal. |
| Explicit "new chat" action | Conversation clears; a deliberate user action, not an automatic side effect of navigation. |

**Clarified MVP scope, per the task's own instruction:** conversation persisting through **client-side navigation only** is the target. **No Supabase chat-history persistence should be added in the first implementation PR.** The existing `ai_usage_log` table (token/usage metadata only, already written by the API route) is unaffected and out of scope for this proposal — it does not store conversation content today and shouldn't start doing so as part of this work.

---

## 7. Desktop Layout Proposal

- **Right-side panel**, opened alongside existing content — not replacing it.
- **Fixed width** (e.g. `~380–420px`), not resizable, for the first implementation. Resizing is real added complexity (drag handles, min/max constraints, persisting the user's preferred width) with limited MVP value — propose deferring to a later, optional PR (Section 12).
- **Close button** (`×` or similar), always visible in the panel header.
- **Context indicator**: a small line such as *"Using context: Lesson — SAVOBJ and RSTOBJ Basics"* or *"Using context: Practice question — DDL vs DML"*, mirroring the existing `contextLabel` UX already shown in `components/ai-tutor-chat.tsx` today, just relocated into the panel header instead of inline above the chat.
- **New chat / reset button**, next to or near the close button, for the explicit "start a new chat" action from Section 6.
- **No broad page redesign**: the panel is additive screen real estate, not a restructuring of the lesson reader or practice page layouts.

**Compatibility with the current lesson reader layout** (`components/lesson-reader-layout.tsx`): that component's own comment already anticipates this need — *"A right-hand column is intentionally not part of this layout yet. Adding one later (5250 emulator, IDE-style practice, an AI Tutor companion panel) only needs a third grid track added here."* This proposal is exactly the scenario that comment was written for: extending `lg:grid-cols-[260px_minmax(0,1fr)]` to a three-column `lg:grid-cols-[260px_minmax(0,1fr)_auto]`-style layout (exact values TBD at implementation time) when the panel is open, collapsing back to two columns when closed. `/practice` has no existing sidebar to coordinate with, so the panel there is simpler: content column plus an adjacent panel.

---

## 8. Mobile Layout Proposal

- **Full-screen sheet/overlay** — not a squeezed-in split layout. On small screens, opening the tutor should visually replace the current viewport (e.g. a fixed-position overlay sliding up from the bottom or in from the side), with the underlying lesson/practice content still mounted (state preserved) but not visible while the sheet is open.
- **Close button**, prominent and reachable with a thumb (top of the sheet).
- **Context indicator**, same content as desktop, adapted to a narrower width (may wrap to two lines).
- **Chat input always visible** — must not be pushed below the fold or obscured by the on-screen keyboard; this is a common mobile chat-UI pitfall worth explicit QA attention in the implementation PR (see Section 13).
- **No unusable split layout**: explicitly reject any "shrink the lesson content and squeeze a chat panel next to it" approach below a chosen breakpoint (e.g. below Tailwind's `lg`, matching the existing lesson-sidebar's own mobile/desktop breakpoint choice for consistency).

---

## 9. Practice Page Behavior

- "Ask the AI Tutor to explain this question" opens the embedded panel (desktop) or sheet (mobile); the question card remains visible on desktop (it's beside the panel, not replaced).
- **If the explanation is already revealed:** include `correctAnswer` and `explanation` in the context payload sent to the AI Tutor. The learner already has this information on-screen; withholding it from the tutor would just make the tutor's answer less useful and could contradict what's already displayed.
- **If the explanation is not yet revealed:** **do not** include `correctAnswer`/`explanation` in the context payload. Recommendation: **avoid spoiling the answer unless the user explicitly asks for it.** Concretely:
  - Before reveal: send `sourceType: 'practice'` with `questionText`, `options`, `selectedAnswer` (if any), and `revealed: false` — omitting `correctAnswer`/`explanation` entirely from the payload, not merely instructing the model not to mention them. Omitting the data itself is a stronger guarantee than a prompt instruction, consistent with this codebase's existing preference for structural safety over relying on the model to self-censor (see `components/ai-tutor-chat.tsx`'s own comment about never using `dangerouslySetInnerHTML` "safe by construction" rather than trusting model output).
  - If a learner explicitly types something like "just tell me the answer," the AI Tutor can only work with what's in its context — since the answer was never sent, it genuinely cannot leak it prematurely; it would need to explain that revealing the answer in the UI first is how to see it, which is itself a reasonable, honest response.
  - After the learner clicks "Reveal answer" in the existing UI, the panel's context payload updates to include `correctAnswer`/`explanation`, and the tutor can then discuss why the answer is correct.

---

## 10. Lesson Page Behavior

- "Ask the AI Tutor" opens the embedded panel; lesson content remains visible (beside the panel on desktop, preserved-but-hidden under the sheet on mobile).
- Current lesson context (`sourceType: 'lesson'`, per Section 4) is passed — reusing the existing `getLessonContext()`/`retrieveRelevantLessons()` pipeline unchanged.
- **Navigating to the next/previous lesson while the panel is open:**
  - Conversation remains (Option B state, unaffected by the lesson route changing underneath it).
  - The active context indicator updates to reflect the new lesson (the provider re-derives `AiTutorContext` from the new page's lesson data on each navigation).
  - The learner can immediately ask about the new lesson without losing anything already discussed — exactly the stated requirement.

---

## 11. Risks and Constraints

| Risk | Mitigation proposed |
|---|---|
| Duplicate AI Tutor implementations (Practice-specific vs Lesson-specific panels) | Explicitly rejected in Section 3 (Option A) in favor of one shared component/provider/trigger set, reused by both. |
| Losing lesson-aware retrieval | Not at risk — Section 2 confirms the existing grounding pipeline is a small, page-independent function call; the panel reuses it unchanged for the lesson case. |
| Breaking the `/ai-tutor` standalone page | Mitigated by explicitly keeping `/ai-tutor` as its own unmodified route (Section 5); the panel is additive, not a replacement. |
| Auth/session issues | Not touched by this proposal. The panel would need to know `isLoggedIn` to decide whether to show a login prompt vs. the chat input — this should be passed down the same way each page already determines it today (server-side `supabase.auth.getUser()`), not reinvented client-side. Each protected page remains its own source of truth for auth, per the existing, deliberate `proxy.ts` design (middleware only refreshes the session cookie; it does not gate routes — see that file's own extensive comment about why a prior middleware-level redirect approach caused a P0 regression). |
| Mobile overflow / keyboard-obscures-input | Explicitly called out in Section 8 as a named risk requiring dedicated QA in the implementation PR. |
| Resetting chat on navigation | This is the core problem being solved — mitigated by the Option B root-layout placement finding in Section 3, which is the one architectural detail that actually determines whether this risk is avoided or not. |
| Token/context bloat | The practice-question context payload should stay small and structured (question text, options, one revealed answer/explanation) — comparable in size to today's single lesson excerpt (capped at 6,000 characters via `MAX_LESSON_BODY_CHARS`), not a new unbounded input. No change proposed to the existing lesson body cap. |
| Accidentally exposing protected/Review Ready lesson content | Not at risk if the practice-question formatter and lesson context path both continue to resolve exclusively through `getPublishedLessons()`/`getPublishedLessonBySlugOrNull()`, exactly as today — this must be an explicit, tested constraint in the implementation PR, not assumed. |
| Adding too much complexity for the value delivered | Mitigated by scoping the first implementation PR to exactly Option B plus the two entry-point conversions (Section 12), explicitly deferring resize, URL deep-linking, and Supabase persistence to a clearly-separated later PR. |

---

## 12. Recommended Implementation Plan

**PR #127 (proposed next content/engineering PR, pending Product Owner spec approval from Section 1):**
- Create `components/ai-tutor/ai-tutor-panel-provider.tsx` (Option B, mounted at/near the root layout per the Section 3 finding), `components/ai-tutor/embedded-ai-tutor-panel.tsx` (desktop panel + mobile sheet, one shared implementation branching on viewport), and `components/ai-tutor/ask-ai-tutor-button.tsx` (shared trigger, replacing the current plain `<Link>` on both the lesson page and `components/practice-browser.tsx`).
- Keep `/ai-tutor` page working exactly as today, unmodified.
- Convert the lesson page's "Ask the AI Tutor" link to open the panel with `sourceType: 'lesson'` context.
- Convert Practice's "Ask the AI Tutor to explain this question" link to open the panel with `sourceType: 'practice'` context (net-new capability — today it passes no question-level context at all).
- Extend `app/api/ai-tutor/route.ts`'s request contract to accept the full `AiTutorContext` shape (Section 4), adding the new practice-question grounding formatter alongside the existing, unchanged lesson-grounding path.
- Add the desktop side panel and mobile full-screen sheet presentational shells (Sections 7–8).
- Reuse the existing streaming/message-handling logic from `components/ai-tutor-chat.tsx` rather than rewriting it — likely by extracting its message-handling logic into a shared hook the panel and the standalone page can both use, avoiding two divergent implementations of the same streaming/feedback logic.
- **No Supabase persistence** of conversation content, per Section 6.

**PR #128 (optional, later):**
- Persist AI Tutor session history (would require its own spec revision, since Spec 001 D-AI-004 explicitly excludes server-side persistence today).
- Add selected-text "ask about this" capability (the `selectedText` field already reserved in Section 4's type, unused until this phase).
- Add panel resize.
- Add tutor suggestions tailored per lesson/question (beyond the existing `aiTutorStarterQuestion`/starter-prompts pattern).

---

## 13. Acceptance Criteria for the Implementation PR

- [ ] From a lesson page, clicking "Ask the AI Tutor" opens the panel; the lesson content remains visible (desktop) or is preserved-but-hidden under the sheet (mobile).
- [ ] From `/practice`, clicking "Ask the AI Tutor to explain this question" opens the panel; the question card remains visible on desktop.
- [ ] Asking "explain this lesson" in the panel produces a response grounded in the current lesson's actual content (verifiable via the existing `contextLabel` mechanism).
- [ ] Asking "why is this answer correct?" from a revealed practice question produces a response referencing that question's actual correct answer/explanation.
- [ ] Asking the same, from an *unrevealed* practice question, does not receive the correct answer in its context and does not state it unprompted.
- [ ] Navigating to the next/previous lesson with the panel open: the conversation history remains fully intact; the context indicator updates to the new lesson.
- [ ] Navigating to a different practice topic/question with the panel open: the conversation history remains fully intact; the context indicator updates to the new question.
- [ ] Closing and reopening the panel (no navigation in between) preserves the conversation.
- [ ] An explicit "new chat" action clears the conversation.
- [ ] A full page refresh resets the panel to closed and the conversation to empty (matches existing, documented D-AI-004 behavior).
- [ ] On a mobile-width viewport, opening the tutor shows a full-screen sheet, not a squeezed split layout; the chat input remains visible and is not obscured by the on-screen keyboard.
- [ ] The standalone `/ai-tutor` route still works exactly as today, including `?lesson=` seeding.
- [ ] Protected lesson gating is unchanged: a logged-out user still cannot read a non-preview lesson, and the panel does not leak lesson content to a logged-out visitor.
- [ ] No Review Ready or Draft lesson content is ever included in a panel's context payload, verified against both the lesson path and the new practice-question path.
- [ ] AI Tutor auth behavior is unchanged: a logged-out user attempting to use the panel sees the same kind of login prompt the standalone page already shows, not a broken or silently-failing input.

---

## Validation Results

This PR is documentation-only. The following was run to confirm nothing else changed:

- `npm run seed` — 288 succeeded, 0 failed (unchanged)
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — clean

## Manual QA

- `git status` shows only `planning/EMBEDDED_AI_TUTOR_PANEL_PROPOSAL.md` added
- `/learn` loads correctly, still shows 288 lessons published
- `/practice` still loads (gated, 307 for anonymous visitors, unchanged)
- `/ai-tutor` still opens/gates as before (307 for anonymous visitors, unchanged)
- Protected lesson gating unchanged (no code touched)
- No lesson URLs changed (no code touched)
