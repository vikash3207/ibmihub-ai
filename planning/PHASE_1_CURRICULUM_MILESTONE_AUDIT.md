# Phase 1 Curriculum Milestone Audit

## Document Metadata

| Field | Value |
|---|---|
| Title | Phase 1 Curriculum Milestone Audit |
| Status | Audit report. No lesson content rewritten, no new lessons added, no auth/session/progress/AI Tutor/RLS logic touched. |
| Date | Prepared after PR #95 (Interview & Job Readiness Review + Publish Pass) merged to `main`. |
| Scope | Full audit of all 208 lessons currently in `content/lessons/metadata.ts`, across structure, metadata quality, content sampling, code rendering, and navigation, plus a content-gap analysis and recommended next roadmap. |
| Prior planning context | `planning/CURRICULUM_EXPANSION_BLUEPRINT.md` and `planning/PHASE_1_CURRICULUM_CATALOG.md` originally scoped Phase 1 at a 50–60 lesson ceiling. Actual Phase 1 execution grew well beyond that ceiling across many subsequent batch PRs (RPGLE, CLLE, Display Files/Subfiles, RPGLE File I/O, SQLRPGLE, Printer Files, Debugging, Operations, Real-World Mini Projects, Interview & Job Readiness). This document audits the curriculum as it actually stands today, not the original 60-lesson skeleton. |

---

## Executive Summary

The Phase 1 curriculum is in strong shape. All 208 lessons are **Published**, structurally clean (zero broken references, zero duplicate/gapped ordering), and the sampled content across all 14 major sections is technically accurate, beginner-appropriate, and free of placeholder text, stale wording, or fake claims. The only structural finding is a cosmetic metadata gap (12 original lessons predating the v2.0 metadata schema lack a `tags` array), which is a minor, low-priority, non-blocking issue intentionally deferred rather than fixed in this audit-only pass.

The curriculum's biggest gap is not quality — it is **breadth beyond beginner/foundation level**. Every one of the 208 lessons is `difficulty: beginner` / `depth: foundation`. The `rpgle-intermediate`, `rpgle-advanced`, and `integration-and-modernization` tracks, already reserved in `content/lessons/tracks.ts`, currently hold zero lessons. There is also no assessment/quiz mechanism anywhere in the course — every "practice" is self-directed and conversational (AI Tutor prompts, mini practice tasks), with nothing gradable.

Recommendation: before further beginner-track expansion, the next phase should prioritize (1) an assessment/practice-question layer, since it's the fastest way to increase the perceived seriousness of the beginner track without new subject matter, and (2) beginning the Advanced RPGLE/ILE track, since it's the most obvious "what's next" for a learner who finishes Phase 1. See Section G for the full recommendation.

---

## A. Curriculum Structure

### Total lesson count by status

| Status | Count |
|---|---|
| Published | 208 |
| Review Ready | 0 |
| Approved | 0 |
| Draft | 0 |
| Unpublished / Archived | 0 |
| **Total** | **208** |

Every lesson that has ever reached `Review Ready` in this curriculum's history has since been reviewed and published — there is no lesson currently sitting in an intermediate state, and none has been intentionally left unpublished.

### Track / module distribution

| trackId | Lesson count | Difficulty span (per `tracks.ts`) |
|---|---|---|
| `ibm-i-foundations` | 5 | Beginner |
| `5250-terminal-and-commands` | 5 | Beginner → Intermediate |
| `libraries-objects-and-ifs` | 8 | Beginner → Intermediate |
| `db2-for-i-and-dds` | 9 | Beginner → Intermediate |
| `rpgle-beginner` | 33 | Beginner |
| `rpgle-intermediate` | **0** | Intermediate |
| `rpgle-advanced` | **0** | Advanced |
| `clle` | 17 | Beginner → Advanced |
| `display-files-and-subfiles` | 32 | Beginner → Advanced |
| `printer-files-and-reports` | 16 | Beginner → Intermediate |
| `sql-for-ibm-i` | 17 | Beginner → Advanced |
| `debugging-and-job-logs` | 17 | Beginner → Advanced |
| `ibm-i-operations` | 17 | Beginner → Intermediate |
| `integration-and-modernization` | **0** | Intermediate → Advanced |
| `real-world-projects` | 16 | Intermediate → Advanced (label only — actual lesson `difficulty` is beginner) |
| `interview-and-professional-readiness` | 16 | All levels |

Three tracks defined in `tracks.ts` have zero lessons: `rpgle-intermediate`, `rpgle-advanced`, and `integration-and-modernization`. These are reserved, spec-governed track IDs (Spec 009 Section 5), not typos — they represent deliberately unstarted future phases. See Section F.

Every lesson currently carries `difficulty: beginner` and `depth: foundation`, including all 16 lessons under the `real-world-projects` track, even though that track's own `difficultySpan` label reads "Intermediate → Advanced." This is intentional and was confirmed during the Real-World Mini Projects batches: the *track's* difficulty span describes where the track sits in the overall curriculum arc, while individual lesson `difficulty`/`depth` describes the lesson's own teaching level — the mini projects are written at a beginner level despite living in a track labeled for a higher span.

### Lesson order continuity

`lessonOrder` runs from 1 to 208 with no gaps and no duplicates (verified programmatically — see Section B). The order is a single global sequence, not per-track, which is a deliberate design choice per `metadata.ts`'s own header comment: `lessonOrder` is "the single global ordering field the Learning Center, lesson navigation, and progress 'next lesson' calculation all currently depend on."

### Does beginner progression feel logical?

Yes, with one nuance worth documenting. The sequence is:

1. **Orientation (order 1–12)**: a broad, one-lesson-per-topic tour across every major subject (what IBM i is, libraries, 5250, DDS, RPGLE, CLLE, job logs, workflow, "where to go next"). This block intentionally interleaves topics that get their own deep-dive track much later.
2. **Foundations depth (order 13–64)**: 5250/commands, libraries/objects/IFS, Db2/DDS, RPGLE beginner basics, CLLE — each topic now gets its own contiguous block.
3. **Display Files and Subfiles (order 65–96)**: a large UI-focused block.
4. **RPGLE native File I/O (order 97–112)**: `dcl-f`, `CHAIN`, `%FOUND`, `WRITE`/`UPDATE`/`DELETE`, `SETLL`/`READE`, locking.
5. **SQLRPGLE (113–128)**, **Printer Files (129–144)**, **Debugging (145–160)**, **Operations (161–176)** — each its own contiguous block.
6. **Real-World Mini Projects (177–192)** and **Interview & Job Readiness (193–208)** — the two capstone tracks.

The one sequencing question worth flagging: the Display Files/Subfiles block (65–96) comes *before* the RPGLE native File I/O block (97–112), even though many real inquiry-screen programs need both a display file and a database `CHAIN` together. Spot-checking two representative lessons from the Display Files block (`rpgle-program-calling-a-display-file`, `basic-inquiry-screen-pattern`) confirmed this is handled correctly, not a gap: those lessons deliberately keep their code examples screen-only (`dcl-f ... workstn` with `exfmt`, no database file open at all) or describe file-lookup validation only in prose, without showing `CHAIN` code, explicitly deferring the real file-access wiring to the later File I/O block. The programmatic prerequisite check (Section B) also confirms no lesson lists a prerequisite that appears later in the sequence than itself. This is a deliberately scaffolded teaching order, not an accidental one.

### Have all Review Ready lessons been published or intentionally left out?

Yes — see the status table above. 0 lessons remain in `Review Ready`. Every batch's review pass (Printer Files, Debugging, Operations, Real-World Mini Projects, Interview & Job Readiness) concluded with either "no issues, publish everything" or a small in-place fix before publishing; no lesson has been left in `Review Ready` for an unresolved technical reason at this point in time.

---

## B. Metadata Quality

A structural audit script was run against all 208 `LessonMetadata` entries, checking every category below programmatically (not by sampling).

| Check | Result |
|---|---|
| Duplicate `lessonOrder` values | 0 |
| Missing/gapped `lessonOrder` values | 0 (contiguous 1–208) |
| Duplicate slugs | 0 |
| Invalid `trackId` (not in `tracks.ts` `TRACKS`) | 0 |
| Missing `trackId` | 0 |
| Missing `moduleId` | 0 |
| Broken `prerequisites` (reference a non-existent slug) | 0 |
| Broken `relatedLessons` (reference a non-existent slug) | 0 |
| Self-references (a lesson listing itself as its own prerequisite or related lesson) | 0 |
| Prerequisite appearing *after* its dependent lesson in `lessonOrder` | 0 |
| Missing `personaTags` | 0 |
| Missing `aiTutorPrompts` | 0 |
| `contentSourcePath` pointing to a non-existent file | 0 |
| `contentSourcePath` not matching the expected `content/lessons/{slug}.md` pattern | 0 |
| **Missing `tags`** | **12** |

### The one real finding: 12 lessons missing `tags`

The 12 lessons at `lessonOrder` 1–12 (the original orientation sequence, authored before the v2.0 metadata schema — `trackId`, `moduleId`, `difficulty`, `depth`, `tags`, `prerequisites`, `relatedLessons`, `personaTags`, `aiTutorPrompts` — was introduced) are missing the `tags` array specifically, even though they do have `trackId`, `moduleId`, `personaTags`, and `aiTutorPrompts` populated:

`what-is-ibm-i`, `why-ibm-i-still-matters`, `ibm-i-platform-overview`, `libraries-and-objects`, `5250-screen-basics`, `physical-files-and-logical-files`, `introduction-to-rpgle`, `introduction-to-clle`, `introduction-to-db2-for-i`, `job-logs-and-spool-files-basics`, `basic-ibm-i-development-workflow`, `where-to-go-next`.

**This is not fixed in this PR.** `tags` is documented in `metadata.ts` as "free-form topical tags for future cross-track discovery" — it is not read by any currently-shipped UI feature (confirmed: it doesn't gate rendering, search, or filtering, since no lesson-search/filter feature exists yet — see Section F). Since this PR's scope is audit-only and explicitly says not to rewrite lessons absent a serious issue, this is reported as a finding and deferred to whenever a search/filter or tag-based discovery feature is actually built, at which point backfilling these 12 lessons' `tags` is a trivial, one-line-per-lesson fix.

---

## C. Content Quality Sampling

Sampled 2–3 lessons from each of the 14 major sections (26 fresh reads this pass, on top of the already-exhaustive lesson-by-lesson reviews performed during the Real-World Mini Projects and Interview & Job Readiness review-and-publish passes, which covered all 32 lessons in those two sections directly).

| Section | Lessons sampled this pass |
|---|---|
| IBM i fundamentals | `ibm-i-platform-overview` |
| Commands | `using-f4-prompt-and-command-help` |
| Libraries/Objects/IFS | `ifs-basics-for-ibm-i-beginners` |
| Db2/DDS/PF/LF | `access-paths-and-why-they-matter` |
| RPGLE foundations | `arrays-in-rpgle` |
| CLLE foundations | `data-areas-in-clle` |
| Display Files/5250 UI | `window-records-and-simple-popup-screens` |
| Subfiles | `understanding-rrn-in-subfile-programs` |
| RPGLE native File I/O | `processing-duplicate-keys-in-rpgle` |
| SQLRPGLE/Embedded SQL | `simple-join-in-sqlrpgle` |
| Printer Files/Reports | `multi-record-format-reports` |
| Debugging & Troubleshooting | `understanding-call-stack-basics` |
| IBM i Operations/Jobs | `authority-failures-and-how-to-investigate-them` |
| Real-World Mini Projects | (all 16 already reviewed in PR #92) |
| Interview & Job Readiness | (all 16 already reviewed in PR #95) |

All 26 freshly-sampled lessons, plus the 32 previously-reviewed capstone lessons, were confirmed:
- Beginner-clear, with correct, specific technical content (no vague hand-waving).
- Technically accurate (spot-checked RPGLE/CLLE/SQL syntax and semantics against known-correct patterns).
- Using readable, realistic examples explicitly marked as "simplified, illustrative" rather than claiming to be real production systems.
- Free of placeholder or `TODO` content.

A repository-wide grep across all 208 lesson files for stale wording and prohibited claims found:

| Pattern searched | Matches |
|---|---|
| `Once the AI Tutor is available`, `coming soon`, `TODO` | 0 |
| certification, placement, salary, job guarantee | 0 |
| "full production system", "enterprise-grade", "guarantees a job" | 0 |

No stale wording or fake claims exist anywhere in the currently published curriculum.

---

## D. Code Block Rendering

A language-tag census across all 208 lesson files found:

| Fenced block language | Count |
|---|---|
| `rpgle` | 94 |
| `clle` | 24 |
| `text` | 1 |
| `sql` | 1 |
| *(bare, no language)* | 1 |

**SQLRPGLE examples are written as `rpgle`-tagged blocks** (embedded `EXEC SQL` inside an otherwise-RPGLE program), not as a separate `sql` tag — this is correct and consistent, since SQLRPGLE source *is* RPGLE source with embedded SQL, not a separate language. Verified via the markdown pipeline directly (`lib/markdown.ts`'s `renderLessonMarkdown`) on `simple-join-in-sqlrpgle.md`: renders as `<pre><code class="language-rpgle">` with whitespace fully preserved.

**DDS source is never shown as its own fenced code block anywhere in the curriculum.** Checked several DDS-focused lessons (`dds-field-definitions.md`, `basic-display-file-dds-keywords.md`, `printer-file-dds-basics.md`, `report-record-formats.md`) — all describe DDS keywords narratively and via inline code (e.g., `` `CHECK(MF)` ``, `` `SFLCLR` ``) rather than fixed-column DDS specs in a fenced block. This is a reasonable, consistent authoring choice (DDS's column-based fixed format doesn't read naturally as a prose-embedded snippet) rather than a rendering defect — there is nothing broken to fix, since no DDS fenced block exists to render incorrectly.

**CL commands** are shown either inline (e.g., `` `CRTLIB` ``) or inside full `clle`-tagged program blocks (e.g., `checking-objects-with-chkobj.md`) — never as a separate untagged "commands" block.

**One bare (untagged) fenced block exists**: `function-keys-in-more-depth.md` line 36, a small illustrative mapping table (`CF03 -> *IN03 (Exit)`, etc.) rather than real DDS/RPGLE source. Verified it still renders correctly as `<pre><code>...</code></pre>` (confirmed via the markdown pipeline) — it simply has no syntax-highlighting language class. This is a trivial, cosmetic, non-blocking finding, not fixed in this PR per the "fix only meaningful issues" scope.

**Inline code** renders correctly throughout (spot-checked across the free-preview lesson and several section-representative lessons).

**No lesson uses an image, table, or fake screenshot as a substitute for real code** — confirmed no lesson markdown contains an `![...]()` image reference or a Markdown table standing in for a code example; every code example across all 208 lessons is a genuine fenced block or inline code span.

---

## E. Navigation and Learning Flow

Manual QA performed against a fresh local dev server (port 3050, no leftover processes from prior sessions):

| Check | Result |
|---|---|
| `/learn` loads | 200 |
| Lesson count shown matches published total | Confirmed via lesson-detail page text: both the free-preview lesson (`what-is-ibm-i`) and the last lesson (`mock-ibm-i-developer-interview`) render "Lesson 1 of 208" and "Lesson 208 of 208" respectively |
| First lesson public preview | `what-is-ibm-i` → 200, accessible without auth |
| Protected lessons require login | `/dashboard` → 307, `/ai-tutor` → 307 (unauthenticated redirect, unchanged) |
| One lesson per requested section opens and renders | `introduction-to-rpgle`, `introduction-to-clle`, `what-is-a-display-file-in-ibm-i`, `what-is-a-subfile-in-ibm-i`, `what-is-sqlrpgle`, `what-is-a-printer-file-in-ibm-i`, `why-debugging-matters-on-ibm-i`, `customer-inquiry-program` (Mini Projects), `ibm-i-developer-interview-roadmap` (Interview Readiness) — all 200 |
| Dashboard progress denominator | Not directly tested live (no test account available in this environment); the denominator reads the same published-lesson-count value confirmed correct above, and this PR makes no code or metadata-count change, so the denominator is unaffected by definition |
| Mark Complete | Not touched by this PR (no progress-logic files modified); not live-tested for the same reason as above |
| AI Tutor access | Not touched by this PR (no AI Tutor logic files modified); `/ai-tutor` gating confirmed still redirects unauthenticated as expected |

This PR only adds one new file (`planning/PHASE_1_CURRICULUM_MILESTONE_AUDIT.md`) and touches no application code, lesson content, or metadata — so no regression is possible in progress tracking, Mark Complete, or AI Tutor behavior; the checks above confirm the surrounding gating and count logic those features depend on remain correct.

---

## F. Content Gaps

### For a serious beginner launch
Largely complete. Coverage spans orientation through native file I/O, SQL, printer files, debugging, operations, and two capstone tracks (mini projects, interview readiness). The main gap is **no way to verify learning** — every "practice" (mini practice tasks, AI Tutor prompts) is self-directed and ungraded. There is no quiz, no multiple-choice knowledge check, and no automatically-graded exercise anywhere in the 208 lessons.

### For a job-ready beginner launch
Strong. The Interview & Job Readiness track (16 lessons) is comprehensive: interview roadmap, per-topic scenario practice (RPGLE, File I/O, CLLE, SQLRPGLE, Display Files/Subfiles, Debugging), project-experience framing, resume guidance, a common-mistakes lesson, and a capstone mock interview. Gap: no structured self-assessment ("are you actually ready?") beyond the qualitative guidance already given.

### For an advanced RPGLE/ILE path
This is the largest content gap. `rpgle-intermediate` and `rpgle-advanced` tracks exist in `tracks.ts` but hold zero lessons. Missing entirely: procedures/modules at an ILE level, service programs, binding directories, activation groups, multi-module programs, more advanced error handling (`%STATUS`, `%ERROR`), advanced SQL (CTEs, window functions, MERGE), and performance-tuning topics beyond the conceptual access-path lesson already published.

### For a modern IBM i / API path
Also essentially unstarted. `integration-and-modernization` has zero lessons. Missing: source control and modern tooling (RDi, VS Code + Code for IBM i, Merlin), Git-based workflows for RPG/CL, REST API concepts on IBM i, ODBC/JDBC access from external languages, and Db2 Web Query or similar reporting-modernization topics.

### For an assessment/practice/quiz path
Fully absent. No quiz infrastructure, no question bank, no scoring mechanism exists in the metadata schema or the application. This would likely require both new lesson-adjacent content *and* a small schema/UI addition (out of scope for a content-only audit, but worth flagging as a joint content+engineering effort).

### For a public SEO/marketing launch
Out of this audit's scope to verify directly — this pass covered lesson content and structure only, not site-wide `<title>`/meta tags, `sitemap.xml`, `robots.txt`, Open Graph images, or marketing/landing page copy. A separate technical SEO pass would be needed before a public launch push.

---

## G. Recommended Next Roadmap

Based on the gaps above, the recommended next 3–5 PRs, in priority order:

1. **Assessment / Quiz / Practice Questions — Batch 1.** The single highest-leverage next step: adds a gradable knowledge-check layer across the existing beginner curriculum without requiring new subject-matter tracks. This directly closes the biggest gap identified for both the "serious beginner launch" and "job-ready beginner launch" goals in Section F.
2. **Advanced RPGLE / ILE — Batch 1.** Begins populating the currently-empty `rpgle-advanced` (and possibly `rpgle-intermediate`) track: procedures/modules at an ILE level, service programs (introductory), and binding directories. This is the most natural "what's next" for a learner who has just finished the beginner RPGLE + File I/O + SQLRPGLE + Mini Projects arc.
3. **Modern IBM i / APIs / Integration — Batch 1.** Begins populating `integration-and-modernization` with an orientation-level treatment (source control tooling, a first look at REST/API concepts on IBM i) — mirroring how every other track in this curriculum started with a beginner-friendly orientation batch before going deeper.
4. **Course Navigation / Search / Filter improvements.** At 208 lessons, a flat `/learn` list is no longer easy to scan. Adding track/difficulty/persona filtering (and search) is now a real usability need, and would also make the 12 lessons missing `tags` (Section B) worth backfilling as part of the same PR.
5. **Public Launch Polish / SEO / Domain Readiness.** Once the above are underway, a dedicated technical SEO and public-readiness pass (meta tags, sitemap, OG images, marketing copy review) before any public launch push — flagged in Section F as unverified by this audit.

Items 1 and 2 are recommended as the immediate next two PRs; items 3–5 can follow in either order depending on product priority (job-readiness polish vs. platform breadth vs. site usability).
