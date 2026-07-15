# AI Tutor RAG v2 — Design Audit

**Date:** 2026-07-15
**Author:** Audit performed as PR #130, following PR #129 (Fix Embedded AI Tutor Panel Close and Layout Behavior).
**Purpose:** Audit the current AI Tutor retrieval/grounding implementation, identify its real limitations, and propose a safe, phased RAG v2 roadmap -- without implementing any of it yet.

**This PR is analysis/design only.** No AI Tutor runtime behavior, Supabase schema, or application code was changed. `git status` at the end of this PR shows only this new planning document.

---

## A. Current Behavior

### How lesson context is passed today

`app/learn/ibm-i-fundamentals/[slug]/page.tsx` builds an `AiTutorContext` (`components/ai-tutor/types.ts`) with `sourceType: 'lesson'`, carrying `lessonSlug`, `lessonTitle`, `lessonPath`, `topicId`, `masterCategoryId`, and `suggestedQuestion`. Clicking "Ask the AI Tutor" (`AskAiTutorButton`) opens the embedded panel with this context; `SyncActiveLessonContext` keeps it current if the learner navigates to another lesson while the panel stays open (Spec 001 v1.1 AI-TUTOR-FR-024).

On submit, the panel/provider (`ai-tutor-panel-provider.tsx`) sends `{ messages, context }` to `POST /api/ai-tutor`. The route's `parseContext()` extracts only `lessonSlug` from a `sourceType: 'lesson'` context (title/path/topicId/masterCategoryId are UI-only today -- **not sent to or used by the grounding step at all**, see Limitations below). `lib/ai/lesson-context.ts`'s `getLessonContext(lessonSlug)` then:
- Resolves the lesson via `getPublishedLessonBySlugOrNull()` -- Draft/Review Ready/unknown slugs resolve to `null` and fall through to general retrieval.
- Loads the lesson's markdown body via `loadLessonMarkdown()` and truncates it to `MAX_LESSON_BODY_CHARS = 6000` characters (a **hard cut at a character count, not a section boundary** -- see Limitations).
- Returns `{ slug, title, shortDescription, tags, bodyExcerpt }`.

`formatLessonContextForPrompt()` turns this into a single prompt section: title, summary, tags, then the raw (possibly mid-sentence-truncated) body excerpt.

### How practice-question context is passed today

`components/practice-browser.tsx` builds an `AiTutorContext` with `sourceType: 'practice'` on every render of a question card, from that question's live `revealed`/`selectedOption` state: `questionId`, `topicId`, `questionTitle`, `questionText`, `options`, `selectedAnswer`, `revealed`, `relatedLessonSlugs`, and -- **only when `revealed` is true** -- `correctAnswer`/`explanation`, via a conditional object spread (`...(revealed ? { correctAnswer, explanation } : {})`). An unrevealed question's context literally never contains those two fields.

The API route's `parseContext()` independently re-derives `revealed` from the payload and only honors `correctAnswer`/`explanation` when it is `true` -- a second, server-side enforcement of the same rule, so a client-side bug alone couldn't leak an answer. `lib/ai/practice-context.ts`'s `formatPracticeContextForPrompt()` renders this into a prompt section, adding an explicit "do not state or reveal the correct answer yourself" instruction when unrevealed.

### How general AI Tutor questions retrieve course context today

When there is no lesson/practice context (or a `sourceType: 'lesson'` context resolves to an unknown/unpublished slug), `resolveGrounding()` calls `lib/ai/retrieve-lessons.ts`'s `retrieveRelevantLessons(latestUserMessage, { maxResults: 5 })`. This is a **keyword-overlap retrieval, not a vector/semantic search**:
1. Tokenizes the query (lowercase, alphanumeric runs, length ≥ 3, minus a hand-written English stopword list).
2. Scores every Published lesson by weighted token overlap against **title** (weight 5), **tags** (weight 4), and **short description** (weight 2) only -- no lesson body is read at this stage.
3. Takes the top 20 metadata-scored candidates (`BODY_SCORING_SHORTLIST_SIZE`), reads each one's actual markdown body, adds 1 point per additional token match found in the body (weight 1), and extracts a ±150-character excerpt around the first matching token.
4. Returns the top `maxResults` by combined score, or an empty array if nothing scored above zero.

When a specific lesson **is** known (the `sourceType: 'lesson'` path), the same function is called again with `maxResults: 3` and `excludeSlug` set, to surface a small number of *additional* related lessons alongside the primary lesson's own full context. The practice path does the same, minus the `excludeSlug` (there is no "current lesson" to exclude for a practice question).

### Does retrieval use title/tags/body/category/metadata?

Title, tags, short description, and (for the shortlist only) body text -- **yes**. `masterCategoryId`/`masterSubcategory` (PR #121), `trackId`/`moduleId`, `prerequisites`/`relatedLessons`, `difficulty`/`depth`, and `personaTags` -- **no, none of these are read anywhere in `retrieve-lessons.ts` or `lesson-context.ts` today.** This is confirmed by direct inspection: `scoreMetadata()` only destructures `lesson.title`, `lesson.short_description`, and `lesson.tags`.

### Is retrieval Published-only, and are Review Ready lessons safely excluded?

**Yes, unconditionally.** `retrieveRelevantLessons()` calls `getPublishedLessons()` (which filters `status = 'Published'` at the Supabase query level, per `lib/lessons.ts`), and `getLessonContext()` calls `getPublishedLessonBySlugOrNull()` (same filter). There is no code path in the AI Tutor grounding pipeline that reads a non-Published lesson's content. This was true before this audit and remains true; the audit found no gap here.

### Are practice questions included in retrieval, or only direct context?

**Only direct context, when explicitly opened from that question.** `content/practice/questions.ts`'s 169 questions are never scored, searched, or surfaced by `retrieveRelevantLessons()` -- a general AI Tutor question can never be grounded in "here's a practice question that covers this," only in lessons. `relatedLessonSlugs` on a practice question is passed through in the practice context payload but is **not currently used** by `resolveGrounding()`'s practice branch to fetch or boost those specific lessons -- it flows into the parsed context object but the practice grounding path only calls generic `retrieveRelevantLessons(latestUserMessage, ...)`, ignoring `relatedLessonSlugs` entirely. This is a real, easily-fixed gap (see Limitations).

### Do AI responses cite or mention related lesson titles?

The system prompt (`lib/ai/system-prompt.ts`) instructs the model to end with a "Related lessons to review:" list naming 1-3 lesson titles from the provided context "when they would actually help, never as a rote footer" -- this is a **prompt-level instruction**, not a structural guarantee. There is no code that independently verifies or renders a citation list from the actual retrieved lessons; if the model doesn't follow the instruction, nothing enforces it, and there is no UI affordance (like a "Sources" section) separate from whatever the model chooses to write inline.

---

## B. Current Retrieval Strengths

- **Lesson-specific questions work well.** Opening the panel from a lesson gives the model that lesson's actual title, summary, tags, and up to 6,000 characters of its body -- for the large majority of this course's lessons (most are a few hundred to low thousands of words), this is the *entire* lesson, not a fragment. For these lessons, this is functionally full-document grounding already.
- **Practice-question explanations work well post-reveal.** The question, options, selected answer, correct answer, and explanation are all passed verbatim -- the model has everything a human tutor would have, and the pre-reveal case is safely handled (see Section A).
- **Topic/keyword questions land reasonably.** Title- and tag-weighted keyword scoring is a good fit for a well-tagged, consistently-titled catalog like this one (every lesson batch in this project's history has had its tags/titles reviewed) -- a question containing a distinctive IBM i term (e.g. "SQLCODE," "adopted authority," "SAVOBJ") will very likely surface the lesson whose title or tags contain that exact term.
- **Course-navigation questions ("where should I learn about X?") are well served** by the same mechanism -- the retrieval result set is exactly the kind of "which lessons are relevant" answer this question type needs.
- **Honest "not covered" framing already exists.** The system prompt explicitly instructs the model to say a topic "is not covered deeply yet in the course" when retrieval finds nothing relevant, rather than fabricating coverage -- and `formatRetrievedLessonsForPrompt()` returns an honest "no closely related lessons were found" string when the array is empty, so the model isn't left to invent something from silence.

---

## C. Current Retrieval Limitations

1. **Keyword-only matching, no semantic understanding.** A question using different words than the lesson's own title/tags/description (a synonym, a rephrasing, a "how do I...", a misremembered term) will score zero or low, even if a lesson directly answers it. Example: "why does my program keep the old data after I change a file" would likely miss `basic-file-locking-concept-in-rpgle` or `understanding-found-after-chain` unless the exact words overlap.
2. **Weak handling of synonyms/abbreviations.** No stemming, no synonym table (e.g. "auth" vs "authority" vs "authorization," "svc pgm" vs "service program," "DSPF" vs "display file"). A learner using shop jargon or abbreviations gets materially worse retrieval than one using this course's exact vocabulary.
3. **No markdown section/chunk-level retrieval.** `getLessonContext()` truncates at a raw character count (`MAX_LESSON_BODY_CHARS = 6000`), which can cut a lesson's body mid-section or mid-sentence rather than at a clean heading boundary -- and for the general-retrieval path, only a single ±150-character excerpt around the *first* keyword match is shown, which may not be the most relevant part of a longer lesson.
4. **No semantic/vector search.** Confirmed no `pgvector` extension or embedding column exists anywhere in `supabase/migrations/`. All retrieval is exact-token overlap.
5. **Possible token bloat on the lesson path.** A known lesson always sends its full (up to 6,000-character) body *plus* up to 3 additional retrieved lessons' excerpts, every single turn of a conversation -- the system prompt (with grounding) is rebuilt and resent on every message, not cached or summarized across turns. For a long conversation about one lesson, this repeats the same ~6,000+ characters of system-prompt content on every request.
6. **Weak ranking, no tie-breaking, no confidence score.** Ranking is a raw summed integer score; there's no normalization, no minimum-score threshold beyond ">0", and no confidence signal exposed to the prompt or the UI -- the model is never told "this match is weak, treat it skeptically" versus "this is a strong, exact match."
7. **No category-aware boosting.** `masterCategoryId`/`masterSubcategory` (PR #121) exist on 287 of 288 lessons and are never read by retrieval. A lesson-context question could reasonably boost same-category lessons in its "3 additional related lessons" pass; today that pass is topic-blind.
8. **No practice-question retrieval.** As covered in Section A, a general question can never surface "there's a practice question that tests exactly this" -- a missed opportunity given 169 practice questions now exist across 22 topics.
9. **`relatedLessonSlugs` (practice) and `relatedLessons`/`prerequisites` (lesson metadata) are collected but unused by retrieval.** These are curated, human-authored relevance signals already sitting in the data model, currently invisible to the grounding pipeline.
10. **No citation-like structural source list.** As covered in Section A, "Related lessons to review" is prompt-requested, not code-rendered -- there's no way to programmatically confirm which lessons a given response was actually grounded in versus which ones the model chose to mention.
11. **No retrieval debugging/logging.** There is no log, admin view, or dev-only endpoint showing what `retrieveRelevantLessons()` actually returned for a given query -- diagnosing "why didn't it find lesson X" today requires reading code and manually re-running the scoring logic.
12. **Possible irrelevant lesson matches on short/generic queries.** A short query like "how" or "job" (mostly stopwords, or a single very common IBM i term used across many lesson titles) can produce a broad, low-precision candidate set, since there's no minimum-score floor beyond ">0" and no query-length-aware confidence adjustment.
13. **Body-text scoring only runs on a pre-filtered shortlist of 20.** This is a deliberate, reasonable performance tradeoff (documented in the file itself), but it does mean a lesson with a strong body-text match but a weak/zero title-tag-description match can be excluded before body scoring ever sees it, if 20+ other lessons scored higher on metadata alone.

---

## D. RAG v2 MVP Proposal (No Vector Embeddings)

The goal of this phase is to fix the highest-value limitations from Section C using only richer, still-deterministic scoring and chunking -- no new infrastructure, no new Supabase tables, no embeddings.

### D.1 Chunk lessons by heading, not by character count

Every lesson already follows the standard 7-section template (`## Learning Objective`, `## Simple Explanation`, `## Why It Matters`, `## Practical Example`, `## Common Confusions`, `## Quick Recap`, `## Try Asking the AI Tutor`). Parse each lesson's markdown into an array of `{ heading, body }` chunks by splitting on `##` headings, computed once per request from the same `loadLessonMarkdown()` call already in use (no new storage -- see "reuse chunks server-side from local content files" below: this can be a pure in-memory computation per request, or a request-scoped cache, not a new persistent store).

### D.2 Retrieve top chunks, not entire lessons

Instead of returning whole lessons (general path) or one giant body excerpt (lesson-known path), score **chunks** against the query and return the top 5-8 chunks across all candidate lessons, each tagged with its source lesson's title/slug and its own heading (e.g. "SAVOBJ and RSTOBJ Basics -- Common Confusions"). This directly fixes Limitation #3 (clean section boundaries instead of a raw character cutoff) and improves precision (a learner's question about "common mistakes" can surface just the `## Common Confusions` chunks across several lessons, not entire lesson bodies).

### D.3 Richer scoring signal set

Extend `scoreMetadata()`-equivalent logic to weigh, in addition to the existing title/tags/description/body signals:
- **masterCategoryId / masterSubcategory match** (Limitation #7): if the query's tokens match words in the category/subcategory label, add a boost -- cheap, since this data already exists on 287/288 lessons.
- **relatedLessons / prerequisites / relatedLessonSlugs** (Limitation #9): when a specific lesson or practice question is already the active context, give a smaller boost to lessons it explicitly lists as related -- surfacing curated relationships the content authors already established, instead of ignoring them.
- **Heading match**: a chunk whose own heading contains a query token scores higher than a chunk that only matches in body prose -- rewards the existing, consistent 7-section structure.
- **Practice question tags/relatedLessonSlugs**: extend retrieval to also score the 169 practice questions the same way lessons are scored (Limitation #8), and surface "there's a practice question on this" as an optional additional prompt section (distinct from lesson chunks), with a link back to `/practice?topic=...` in the system prompt so the model can suggest it.

### D.4 Return shape and prompt integration

- Return the top 5-8 scored chunks (not lessons) plus, separately, 0-2 matched practice-question references.
- Each chunk in the prompt section explicitly includes: lesson title, slug, heading, and the chunk body -- giving the model (and, per Section F, a future debug view) a clean "source" unit rather than an undifferentiated blob.
- **Cap total context size** explicitly (e.g. a fixed character budget across all chunks combined, distributed by score rather than truncated arbitrarily) -- directly fixes Limitation #5's token-bloat concern, and is more precise than today's flat 6,000-character-per-lesson cap since it now applies across the *combined* selected chunks, not per-lesson.
- Filter: only Published lessons, exactly as today -- no change to this guarantee.
- Add a short, structured "Sources used" section to the very end of the grounding text (lesson title + slug list), so a future UI (Section F) can parse and render it independent of whatever prose the model produces -- this is the structural fix for Limitation #10, replacing "hope the model lists sources" with "the source list is data, not model output."
- Prompt instruction (Section G) continues to require an honest "not deeply covered" framing when the chunk scores are all low/zero -- now with an actual numeric threshold to check against (Limitation #6), rather than only an empty-array check.

### D.5 What stays exactly as it is

- The Anthropic provider abstraction (`lib/ai/anthropic.ts`), streaming, feedback, and usage-logging -- untouched.
- The pre-reveal/post-reveal practice-answer safety mechanism (Section A/H) -- untouched, already correct.
- `getPublishedLessons()`/`getPublishedLessonBySlugOrNull()` as the only source of truth for what's retrievable -- untouched.
- The embedded panel/provider/UI (PR #128/#129) -- untouched; RAG v2 is a grounding-quality change behind the same API contract, not a UI change.

---

## E. Vector RAG / pgvector Future Proposal (Not Implemented)

A later, optional phase, only worth pursuing once RAG v2's keyword/chunk approach is shipped and its remaining gaps (mainly synonym/rephrasing handling, Limitation #1-2) are validated as still painful in practice.

### Chunk table design

A new `lesson_chunks` table (additive-only, following the exact precedent of migrations 004/005): `id`, `lesson_id` (FK to `lessons.id`), `slug` (denormalized, for fast filtering), `heading`, `chunk_index`, `content`, `embedding vector(1536)` (or whatever dimension the chosen embedding model produces), `updated_at`. One row per heading-delimited chunk (Section D.1's chunking logic, persisted instead of computed per-request).

### Embedding generation flow

A build/seed-time step (parallel to `npm run seed`, e.g. `npm run seed:embeddings`) that: reads all Published lessons, re-runs the D.1 chunker, calls an embedding API (a provider-abstraction module mirroring `lib/ai/anthropic.ts`'s existing pattern -- one file responsible for all embedding-provider calls) for any chunk whose content hash has changed since the last run, and upserts rows into `lesson_chunks`. This should be triggered manually/on-demand initially (mirroring how `npm run seed` itself is run manually today, not on every deploy), to keep embedding API costs bounded and predictable.

### Supabase pgvector considerations

Requires enabling the `pgvector` extension (`create extension if not exists vector;`) -- not currently enabled anywhere in this project's migrations, confirmed by this audit. Needs an approximate-nearest-neighbor index (e.g. `ivfflat` or `hnsw`) on the `embedding` column once the table has enough rows to matter; below a few thousand rows, a plain sequential scan is likely fine and an index would be premature.

### Cost/token implications

Embedding generation is a one-time (plus incremental re-embed) cost per chunk, separate from and much cheaper than per-request Anthropic token costs -- but it is a new, distinct cost line that doesn't exist today and needs its own budget/monitoring, mirroring the existing `ai_usage_log` pattern (a parallel `embedding_usage_log`, or an extra column, if usage tracking is wanted for this too).

### Re-index strategy when lesson content changes

Content changes happen through the existing Git-based workflow (`content/lessons/*.md` + `metadata.ts`, then `npm run seed`). The embedding step should hash each chunk's content and only re-embed chunks whose hash changed, so a typical PR that edits one or two lessons doesn't force a full re-embed of all 288 lessons' chunks -- this keeps the embedding refresh step cheap and safe to run frequently.

### Filtering by status Published only

The `lesson_chunks` table should either (a) only ever contain rows for Published lessons (deleting/not creating rows for Review Ready/Draft lessons, requiring the embedding step to re-run after every publish), or (b) contain rows for all lessons but always be queried with a join back to `lessons.status = 'Published'` at read time, mirroring exactly how `getPublishedLessons()` already filters today. Option (b) is safer (a single, consistent filter point, matching the existing pattern) and should be preferred over relying on the embedding step's own bookkeeping to keep Review Ready content out.

### Metadata filtering by category/tags

Vector similarity search can be combined with a `WHERE` clause on `master_category_id`/`tags` (already-existing columns, per PR #121/#122) to pre-filter candidates before ranking by embedding distance -- e.g., "search only within Security-category chunks" when the active lesson/practice context is already known to be in that category. This is a natural extension of Section D.3's category-boosting idea, made precise instead of just a scoring boost.

### Fallback to keyword retrieval

The existing `retrieveRelevantLessons()` (or its RAG v2 chunk-based evolution) should remain as an explicit fallback if the embedding lookup fails, times out, or the `lesson_chunks` table is empty/stale for a given lesson -- mirroring the existing `resolveGrounding()` try/catch pattern in `app/api/ai-tutor/route.ts`, which already treats grounding as "an enhancement, not a hard dependency."

### Migration and rollback risks

Additive-only migration (new table, no changes to `lessons`), so rollback is simply "stop reading from `lesson_chunks`" with no data-loss risk to existing tables -- consistent with every migration in this project so far (004/005 are both explicitly additive-only). The main risk is operational: an embedding generation job that silently fails or drifts out of sync with `content/lessons/`, leaving retrieval quietly stale -- worth a simple staleness check (e.g. comparing chunk count/hash against the current `metadata.ts` at request time, falling back to keyword retrieval on mismatch) rather than assuming the embedding store is always current.

---

## F. Recommended Architecture (RAG v2 MVP, Section D)

| File | Role |
|---|---|
| `lib/ai/lesson-chunks.ts` | Parses a lesson's markdown into `{ heading, body }` chunks by `##` headings (Section D.1). Pure function, no I/O of its own -- takes markdown text, returns chunks. |
| `lib/ai/retrieval-score.ts` | Shared scoring logic: tokenization, stopwords, and the weighted-signal scoring function (title/tags/description/body/category/subcategory/heading/related-lessons), extracted so both lesson-chunk retrieval and practice-question retrieval use one scoring implementation instead of two. |
| `lib/ai/retrieve-course-context.ts` | The new top-level retrieval entry point (replaces today's `retrieve-lessons.ts` call sites in `app/api/ai-tutor/route.ts`): given a query and optional active context (lesson/practice), returns top-scored chunks plus any matched practice-question references, using `lesson-chunks.ts` and `retrieval-score.ts`. `retrieve-lessons.ts` itself can either be refactored in place or kept temporarily as the fallback path described in Section E. |
| `lib/ai/practice-context.ts` | Unchanged in shape; optionally extended so its formatter can also accept the newly-available "related practice questions" list from `retrieve-course-context.ts` for the lesson-context path (a lesson page's questions could surface "practice this" the same way a practice page's questions currently surface "related lessons"). |
| `lib/ai/retrieval-debug.ts` (optional, dev-only) | A small helper that formats a retrieval result set as a plain-text or JSON debug summary (scores, matched signals, chunk headings) -- not exposed in production UI, but usable from a temporary script or a dev-only query param, addressing Limitation #11 without building a full admin feature. |

This keeps the same file-per-concern pattern already established by `lesson-context.ts`/`retrieve-lessons.ts`/`practice-context.ts`, just adding the chunk/score layer those files currently lack.

---

## G. Prompt Grounding Improvements

Reviewing `lib/ai/system-prompt.ts`'s existing "Course grounding" paragraph against Section C/D's findings:

- **Already good, keep as-is:** prioritizing course context over general knowledge when it directly answers the question; the instruction to say a topic "is not covered deeply yet" rather than fabricating coverage; the beginner-friendly-by-default, adjust-for-experience language; the plain-text-only formatting contract (paragraphs/bullets/numbered steps/code fences only, no markdown headings/bold/tables) that `components/ai-tutor/chat-thread.tsx`'s renderer depends on structurally.
- **Update once RAG v2 chunks land:** the grounding section should explicitly tell the model it is being given *chunks* (with lesson title + heading identifying each one), not full lessons, so it doesn't assume a chunk represents everything that lesson covers -- avoids a subtly new failure mode where the model treats a `## Common Confusions` chunk as if it were the lesson's complete content.
- **Add a lightweight confidence framing:** once Section D.3's numeric scores exist, the prompt can distinguish "strong match" vs "weak match" context (e.g. only include the honest "not deeply covered" framing when the top score is below a threshold, rather than only when the array is literally empty as today) -- directly using Limitation #6's fix.
- **Keep the "Related lessons to review" model-generated list, but make it advisory, not authoritative** once Section D.4's structural "Sources used" list exists -- the model's own prose recommendation and the code-rendered source list can both exist; a future UI (Section F/J) should trust the structural list for anything program-rendered (e.g. clickable source links), not parse the model's free text.
- **Keep "avoid overclaiming/fake certainty" language exactly as it is** -- already present ("Avoid overconfidence... acknowledge this where relevant... say so explicitly rather than guessing") and matches Spec 001's own safety requirements; no change needed.
- **No change needed** to the "stay in scope" / IBM i domain-focus instruction, or the sensitive-data warning -- both are orthogonal to retrieval quality and already correct.

---

## H. Safety and Privacy

All of the following are **already true today** and must remain true through any RAG v2 implementation -- this audit found no existing violation, and each is called out explicitly so a future implementation PR treats it as a hard constraint, not an assumption:

- **Review Ready/Draft lessons are never retrievable.** Both `getLessonContext()` and `retrieveRelevantLessons()` exclusively read through `getPublishedLessonBySlugOrNull()`/`getPublishedLessons()`. Any RAG v2 chunk store (Section D) or future embedding table (Section E) must preserve this exact guarantee -- either by only ever containing Published-lesson data, or by filtering at read time, never trusting client input to decide what's retrievable.
- **Protected lesson content is not exposed beyond what the lesson page itself already allows.** The AI Tutor grounding pipeline reads the same `loadLessonMarkdown()` used to render the lesson page itself -- it does not create a second, less-gated path to lesson content. (Note: today, a logged-in user opening the AI Tutor from a lesson they haven't unlocked would still get that lesson's content in the grounding, same as if they'd read the lesson page directly with an active session -- this matches existing lesson-page gating, not a new exposure.)
- **Practice correctAnswer/explanation are never passed pre-reveal**, enforced at both the client-construction site and the server's independent re-validation (Section A) -- this exact mechanism must be preserved unchanged in any RAG v2 revision to `practice-context.ts` or the API route.
- **No secrets or private user data should ever be logged.** `logUsage()` already only logs token counts and a status enum, never message content -- any future retrieval-debug logging (Section F) must follow the same discipline: log query tokens/scores/matched slugs, never raw user message text, to a persistent store.
- **Avoid sending too much content to the model.** Directly addressed by Section D.4's explicit context-size cap, an improvement over today's implicit 6,000-character-per-lesson ceiling.
- **No production system execution claims.** Unrelated to retrieval quality; already correctly handled by the system prompt's existing "cannot connect to a real IBM i system, execute code" language -- unaffected by this proposal.

---

## I. QA Scenarios for Future Implementation

These are acceptance scenarios a RAG v2 implementation PR should be tested against -- not run in this audit PR, since no code changed.

1. Ask "How is CHAIN different from READ?" -- should retrieve `chain-for-keyed-access` and/or `reading-physical-files-in-rpgle-with-read`.
2. Ask "What does SQLCODE 100 mean?" -- should retrieve `sqlcode-and-sqlstate-basics-in-sqlrpgle` and/or `handling-no-row-found-in-sqlrpgle`.
3. Ask "Why is my job in MSGW?" -- should retrieve `job-status-values-explained` and/or relevant debugging-track lessons.
4. Ask "How does adopted authority work?" -- should retrieve `adopted-authority-basics`.
5. Ask "What is journaling vs backup?" -- should retrieve `backup-vs-journaling-vs-high-availability` and/or `what-is-journaling-on-ibm-i`.
6. Ask "Where should I learn about subfiles?" -- should retrieve multiple lessons from the `display-files-and-subfiles` track / `screen-ui-development` category, not just one.
7. Ask a question from an **unrevealed** practice question -- response must not state or imply the correct answer.
8. Ask a question from a **revealed** practice question -- response should correctly reference that question's actual explanation.
9. Ask an advanced topic this course doesn't cover deeply (e.g. COBOL, PowerHA, BRMS) -- response must say course coverage is limited/absent, not fabricate coverage.
10. Confirm (e.g. via the Section F debug helper, or a temporary audit script) that no Review Ready lesson ever appears in a retrieval result set, across a representative sample of queries.

---

## J. Recommended Implementation Roadmap

1. **PR 1 -- RAG v2 keyword/chunk retrieval implementation** (Section D, F): `lesson-chunks.ts`, `retrieval-score.ts`, `retrieve-course-context.ts`; category/related-lesson/practice-question-aware scoring; chunk-level (not whole-lesson) grounding; explicit context-size cap; structural "Sources used" list. No schema changes, no new dependencies.
2. **PR 2 -- AI Tutor source/reference display**: surface the structural source list (from PR 1) as an actual UI affordance in the embedded panel/standalone page (e.g. a small "Sources" row under an assistant response, linking to the real lesson pages) instead of relying on the model's own prose to mention lessons.
3. **PR 3 -- retrieval QA/regression tests**: a repeatable script (not necessarily a new test framework/dependency, consistent with this project having none today) that runs Section I's scenario list against the live retrieval function and reports pass/fail, so future content or scoring changes can be checked for regressions before merge.
4. **PR 4 -- optional pgvector/embedding prototype** (Section E): only after PR 1-3 ship and a real gap (e.g. synonym/rephrasing misses) is still observed in practice; a genuinely optional, separate infrastructure investment, not a default next step.
5. **PR 5 -- production hardening**: retrieval-debug tooling promoted from ad hoc script to a lightweight, access-controlled dev view if useful; embedding freshness/staleness checks if PR 4 shipped; usage/cost monitoring for any new embedding-provider calls, mirroring the existing `ai_usage_log` pattern.

---

## Validation Results

This PR is documentation-only. The following was run to confirm nothing else changed:

- `npm run seed` -- 288 succeeded, 0 failed (unchanged)
- `npm run lint` -- clean
- `npx tsc --noEmit` -- clean
- `npm run build` -- clean

## Manual QA

- `git status` shows only `planning/AI_TUTOR_RAG_V2_DESIGN_AUDIT.md` added
- `/learn` loads correctly, still shows 288 lessons published
- `/practice` still loads (gated, unchanged)
- Embedded AI Tutor panel still opens (unchanged, no code touched)
- `/ai-tutor` standalone route still works (unchanged, no code touched)
- Protected lesson gating unchanged (no code touched)
- No lesson URLs changed (no code touched)
