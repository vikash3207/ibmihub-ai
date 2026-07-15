# Spec 010: Practice Lab

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 010 |
| Feature | Practice Lab (5250-Style Command Practice + ACS-Style SQL Console) |
| Status | Draft — approved product direction (PR #134); this spec and the PR #135 routing skeleton require Product Owner sign-off before PR #136/#137 simulator implementation begins |
| Version | 1.0 (Draft) |
| Owner | Product + Engineering |
| Last Updated | 2026-07-16 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md | PR #134 | Design proposal this spec formalizes — module scope, exercise lists, simulation model recommendation, AI Tutor integration design, UX/route proposal, safety constraints, and implementation roadmap all originate there |
| specs/001-ai-tutor/spec.md | v1.1 Approved | AI Tutor context/grounding conventions this spec's future AI Tutor integration (Section 9) must follow |
| specs/002-learning-center/spec.md | v1.0 Approved | Learning Center access/navigation conventions this spec's route protection follows |
| specs/003-lesson-experience/spec.md | v1.1 Approved | Related-lesson-link conventions (Published-only resolution) this spec's `relatedLessonSlugs` follows |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision this spec's route protection reuses unchanged |

---

## 2. Purpose

The Practice Lab is a hands-on, guided learning simulator that lets a learner practice IBM i skills interactively: a **5250-style command practice** environment and an **ACS-style SQL practice console**, both grounded in predefined exercises and safe, simulated responses.

Today, IBMiHub AI's interactive practice is limited to `content/practice/questions.ts`'s multiple-choice/scenario questions (Spec 006/007) — a learner can check conceptual understanding, but cannot type an actual command or SQL statement and see a (simulated) result. The Practice Lab closes that gap: it connects lesson content (Spec 003) to a typed, interactive exercise, with AI Tutor assistance (Spec 001) available in context.

Getting the product framing right here is as important as the feature itself. This is deliberately **not** a real 5250 emulator, IBM i emulator, ACS clone, or live IBM i terminal — see Section 3 for why that distinction is a hard requirement, not a phrasing preference.

This spec defines the MVP scope, non-goals, module behavior, AI Tutor integration expectations, safety rules, routing expectations, data model, and phased implementation plan for the Practice Lab. This revision (v1.0 Draft) is scoped to **what PR #135 actually builds — a spec plus a safe route/page skeleton with no simulator logic** — while also documenting the full intended feature (5250 simulator, SQL console, AI Tutor integration) so later implementation PRs (#136–#139) have a stable spec to build against instead of re-deriving scope each time.

---

## 3. Product Definition

**This feature is a "5250-style Practice Lab"** — a guided learning simulator consisting of:
- **5250 Command Practice**: a green-screen-inspired UI for practicing IBM i commands against a fixed, fabricated in-memory system state.
- **SQL Practice Console**: an ACS "Run SQL Scripts"-inspired UI for practicing SQL against a small, fixed sample schema.

**This feature is explicitly NOT:**
- a real 5250 emulator
- a real IBM i emulator
- an ACS (IBM Access Client Solutions) clone
- a live IBM i terminal or a live connection to any real IBM i system, in any phase

### Why this distinction is a hard requirement

- **Avoids overpromising.** A learner must never conclude they can use this to administer or connect to a real IBM i partition. Every entry point into this feature must read as "practice simulator," never "terminal" or "connection."
- **Avoids TN5250 protocol complexity.** A real 5250 emulator requires the TN5250E protocol, screen field attributes, AID keys, and a genuine session/socket layer — a multi-month systems effort orthogonal to this platform, and unnecessary to teach command recognition and concept understanding.
- **Avoids credential/security risk.** A real connection means real user profiles, real passwords/connection secrets, and a real attack surface (arbitrary command execution against a live, possibly production, system). This platform has no IBM i systems to connect to and no security review budget for that risk. A simulator has no real system to compromise, by construction.
- **Focuses on learning outcomes.** The pedagogical goal is command/SQL recognition and concept reinforcement, not exact fidelity to every keystroke or ACS dialog. A guided simulator can validate input and never leave a learner in a genuinely broken state — arguably a *better* teaching tool for a beginner than an unconstrained real terminal.

### Trademark/naming discipline

"5250" and "IBM i" describe a display protocol and a platform, used descriptively throughout this codebase's existing lesson content. "ACS" refers to IBM's Access Client Solutions product. All UI copy, code, and content must use **"5250-style"** and **"ACS-style"** / **"ACS-inspired"** — never unqualified "5250 emulator," "IBM i emulator," or "ACS."

---

## 4. MVP Scope

### In Scope — This Spec Revision (PR #135: Spec + Routing Skeleton)

| Capability | Description |
|---|---|
| This spec | Formal documentation of product definition, module behavior, AI Tutor integration design, safety rules, routing, data model, and roadmap |
| `/practice-lab` landing page | Two module cards (5250 Command Practice, SQL Practice Console), gated the same way `/practice` is gated today |
| `/practice-lab/5250` placeholder page | Module explanation, the 10 planned exercises (Section 6) shown as non-interactive, "Coming next"-labeled list items, and the simulator disclaimer (Section 8) |
| `/practice-lab/sql` placeholder page | Module explanation, the 10 planned exercises (Section 7) shown the same way, and the simulator disclaimer |
| Shared exercise metadata type + content | `lib/practice-lab/types.ts`, `content/practice-lab/5250-exercises.ts`, `content/practice-lab/sql-exercises.ts` — structured data only, `status: 'planned'` for every exercise |
| Navigation entries | A card on `/practice` and a card on `/dashboard` linking to `/practice-lab`, matching each page's existing card patterns |

### Out of Scope — This Spec Revision (Future Phases, Sections 6/7/9/13)

| Capability | Deferred to |
|---|---|
| 5250 command dispatch/simulation engine | PR #136 |
| SQL pattern-matching/validation engine | PR #137 |
| Per-exercise workspace pages (`/practice-lab/5250/[exerciseSlug]`, `/practice-lab/sql/[exerciseSlug]`) | PR #136/#137 — not created in PR #135; see Section 10 |
| AI Tutor integration (`sourceType: 'practice-lab'` context, prompt formatter, embedded panel wiring) | PR #138 |
| Exercise content expansion beyond the initial 10+10 | PR #139 |
| Progress/completion persistence for Practice Lab exercises | Not yet decided (Section 14, Open Questions) |
| Any real IBM i connection, in any phase | **Never in scope** — see Section 3 |

---

## 5. Explicitly Out of Scope for MVP (Non-Goals)

- Real 5250/TN5250E protocol implementation.
- Real IBM i emulator behavior of any kind.
- ACS feature-for-feature replication (script history, multiple result-set tabs, export, schema-browser trees, connection profiles).
- Any IBM i credential handling, connection configuration, or session/security modeling.
- Arbitrary command execution or arbitrary SQL execution against any real system, including this platform's own Supabase database.
- Real database writes from any Practice Lab exercise, including `INSERT`/`UPDATE` exercises (Section 7) — those are always simulated (Section 7, LAB-FR-011).
- New Supabase tables, columns, or migrations (this spec revision proposes no schema change at all).
- New third-party dependencies (the recommended simulation model, Section 9's design-proposal reference, explicitly avoids one for MVP).
- Changes to authentication/session logic, protected-route logic, lesson publishing/gating rules, or Supabase RLS.
- New lessons or new practice questions (`content/practice/questions.ts` is unaffected).
- Public launch/SEO/marketing work for this feature.

---

## 6. 5250-Style Command Practice — Behavior

### LAB-FR-001 — Guided, Finite Command Set

The 5250 module must support only a finite, explicitly-defined set of commands per exercise. Any command not recognized must return a friendly "not available in this lab yet" message — never a crash, a blank screen, or a silent no-op.

**Priority:** Must Have (governs PR #136 implementation)
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 6

### LAB-FR-002 — Fixed Simulated System State

The 5250 module must operate against a fixed, fabricated in-memory system state (libraries, objects, jobs, spool files) defined in application content, not a real or per-user-mutable backing store. The same exercise must always produce the same simulated screen for the same accepted input.

**Priority:** Must Have
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 6

### LAB-FR-003 — Ten Initial Guided Exercises

The initial 5250 exercise set must cover: command line/prompt basics, `WRKLIB`, `WRKOBJ`, `DSPOBJD`, `WRKSPLF`, `WRKOUTQ`, `DSPJOB`, `WRKACTJOB`, investigating a `MSGW` job, and finding an object lock via `WRKOBJLCK` — as documented with learning objective, expected command(s), simulated response, common learner mistake, AI Tutor hint opportunity, and related lesson slugs in planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 4. This spec's companion content file is `content/practice-lab/5250-exercises.ts` (added in PR #135, `status: 'planned'` for all ten).

**Priority:** Must Have
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 4

### LAB-FR-004 — Green-Screen-Inspired, Not Protocol-Accurate, UI

The 5250 workspace UI must be "realistic enough for learning": dark background, monospace font, a single command input line, a status/message area, and function-key labels only for keys an exercise actually uses. It must not attempt full TN5250E behavior, exact keyboard/AID-key mapping, every function key, or real sign-on/session modeling.

**Priority:** Must Have (governs PR #136 UI implementation)
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 9

---

## 7. ACS-Style SQL Console — Behavior

### LAB-FR-005 — Fixed Sample Schema

The SQL module must operate against one small, fixed sample schema (proposed: `EMPLOYEE`, `DEPARTMENT`, `ORDERS`), shared across all exercises, defined in application content — never a connection to a real or production database, including this platform's own Supabase database.

**Priority:** Must Have
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 5

### LAB-FR-006 — Ten Initial Guided Exercises

The initial SQL exercise set must cover: `SELECT` all rows, `SELECT` specific columns, a `WHERE` filter, `ORDER BY`, a simple `JOIN`, `COUNT`/`GROUP BY`, the `SQLCODE 100` / no-row-found concept, a simulated `UPDATE`, a simulated `INSERT`, and troubleshooting an invalid column/table error — as documented in planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 5. This spec's companion content file is `content/practice-lab/sql-exercises.ts` (added in PR #135, `status: 'planned'` for all ten).

**Priority:** Must Have
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 5

### LAB-FR-007 — No Content Lesson for GROUP BY/Aggregates (Known Gap)

`content/lessons/metadata.ts` currently has no lesson covering `GROUP BY`/aggregate functions directly. The `count-group-by` exercise (`content/practice-lab/sql-exercises.ts`) is seeded with an empty `relatedLessonSlugs` array rather than pointing at a loosely-related lesson, consistent with this platform's existing "don't overclaim coverage" convention (see `lib/ai/format-course-context.ts`'s weak-match honesty note). This is a content gap for the Product Owner to consider (Section 14), not something this spec or PR #135 resolves.

**Priority:** Should Have (informational — no functional requirement blocks on this)
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 5, Exercise 6 note

### LAB-FR-008 — Server-Side Pattern-Matched Validation, Not Real Execution

SQL exercise validation must pattern-match the learner's typed SQL against each exercise's expected shape (and named common-mistake shapes) — normalized for case/whitespace/column-order where order doesn't matter — rather than executing arbitrary SQL against any real engine. Validation logic must run server-side so pattern rules are not trivially inspectable/gameable from the client bundle.

**Priority:** Must Have (governs PR #137 implementation)
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 6 (Option D)

### LAB-FR-009 — Friendly, Explained Errors

Invalid SQL (misspelled column/table, malformed clause, `WHERE`-less `UPDATE`/`DELETE`, column/value count mismatch on `INSERT`) must produce a specific, friendly, plain-language explanation — never a raw driver error string, stack trace, or silent failure.

**Priority:** Must Have
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 5

### LAB-FR-010 — SQLCODE 100 Is Not an Error

An empty result set must be presented as an informational message (e.g. `SQLCODE 100 -- Row not found`), styled distinctly from an actual error, reinforcing that "no rows found" is a normal outcome.

**Priority:** Must Have
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 5, Exercise 7

### LAB-FR-011 — Simulated Writes Only

`UPDATE`/`INSERT` exercises must never perform a real write anywhere, including to this platform's own Supabase database or any per-session persisted state. They must instead validate the statement's shape and return a "N row(s) would be affected (simulated -- no data was changed)" confirmation with a before/after preview built from the fixed in-memory sample data.

**Priority:** Must Have
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 6

### LAB-FR-012 — ACS-Inspired, Not ACS-Replicated, UI

The SQL console UI must include a SQL editor, a Run action, a result grid, a separate messages/errors pane, a small fixed sample-schema panel, and exercise instructions. It must not include connection management, a full schema-browser tree, script history, or any other ACS feature not needed for the fixed exercise set.

**Priority:** Must Have (governs PR #137 UI implementation)
**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 10

---

## 8. Safety Rules

These rules apply to every phase of this feature, not only the MVP, and are non-negotiable per the product direction approved in PR #134:

- No real IBM i connection, in any phase.
- No TN5250 protocol implementation, in any phase.
- No ACS clone — descriptive "ACS-style"/"ACS-inspired" framing only.
- No IBM i credential handling or connection configuration UI, ever.
- No production command execution.
- No arbitrary system command execution (the 5250 dispatch table is a finite, explicit set — LAB-FR-001).
- No unrestricted SQL execution (pattern-matched validation only — LAB-FR-008).
- No real database writes from any exercise, including simulated `INSERT`/`UPDATE` (LAB-FR-011).
- No user-generated code execution against any real system, including this platform's own infrastructure.
- Clear, persistent UI copy stating this is a guided simulator that does not connect to a real IBM i system, present on every Practice Lab page (`components/practice-lab/simulator-notice.tsx`, added in PR #135).
- Consistent "5250-style"/"ACS-style" language everywhere, per Section 3.

---

## 9. AI Tutor Integration Expectations (Deferred to PR #138)

Not implemented in PR #135. Documented here so PR #138 has a stable target.

- A new `sourceType: 'practice-lab'` variant on `AiTutorContext` (`components/ai-tutor/types.ts`), carrying: `labType`, `exerciseSlug`, `exerciseTitle`, `taskInstruction`, `typedInput`, `simulatedOutput`/`errorMessage`, `relatedLessonSlugs`, and `hintRequested`.
- A new prompt formatter (parallel to `lib/ai/practice-context.ts`'s `formatPracticeContextForPrompt`) — no change to `retrieveCourseContext()` (`lib/ai/retrieve-course-context.ts`), reusing RAG v2 unchanged with `relatedLessonSlugs` as the retrieval boost input, exactly like the existing practice-question path.
- **Hint-safety guarantee, mirroring AI-TUTOR-FR-021:** the exercise's expected command/SQL answer key must never be included in the context payload sent to the model — only the task instruction, what the learner typed, and what came back. This must be a structural omission (the field is never sent), not a prompt instruction relying on the model to self-censor, consistent with this platform's established preference (see `app/api/ai-tutor/route.ts`'s `parseContext()` practice-branch comment).
- AI Tutor access inside the Practice Lab reuses the existing embedded panel (`AiTutorPanelProvider`/`EmbeddedAiTutorPanel`, PR #128/#129) exclusively — no new, Practice-Lab-specific chat surface.
- Related-lesson links from a Practice Lab AI Tutor response reuse the existing Sources UI (PR #132) unchanged.
- The AI Tutor must never claim it is connected to, or executing against, a real IBM i system while assisting inside the Practice Lab — this is an extension of the same guarantee already in `lib/ai/system-prompt.ts`, not a new one.

**Source:** planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 7

---

## 10. Routing Expectations

### Routes (PR #135 — created in this spec revision)

| Route | Page | Auth | Notes |
|---|---|---|---|
| `/practice-lab` | Landing page, two module cards | Required (redirect to `/auth/login?next=%2Fpractice-lab`) | Mirrors `app/(authenticated)/practice/page.tsx`'s exact pattern |
| `/practice-lab/5250` | 5250 module placeholder | Required (redirect to `/auth/login?next=%2Fpractice-lab%2F5250`) | Lists the 10 planned exercises, no interactive simulator |
| `/practice-lab/sql` | SQL module placeholder | Required (redirect to `/auth/login?next=%2Fpractice-lab%2Fsql`) | Lists the 10 planned exercises, no interactive simulator |

### Routes (deferred — not created in PR #135)

| Route | Deferred to | Why deferred |
|---|---|---|
| `/practice-lab/5250/[exerciseSlug]` | PR #136 | Every exercise is `status: 'planned'` in this spec revision; a per-exercise workspace page has nothing to show yet, and creating a stub route with no content behind it adds surface area without value ahead of the simulator engine that would populate it. |
| `/practice-lab/sql/[exerciseSlug]` | PR #137 | Same reasoning as above, for the SQL module. |

### Route protection

All three PR #135 routes are placed under `app/(authenticated)/practice-lab/`, reusing `app/(authenticated)/layout.tsx` (shared `SiteHeader`, `force-dynamic`) exactly as `/practice`, `/dashboard`, and `/ai-tutor` already do. Each page independently checks `supabase.auth.getUser()` and redirects an unauthenticated visitor to `/auth/login?next=...`, matching `app/(authenticated)/practice/page.tsx`'s existing per-page auth pattern byte-for-byte. **No new auth/session mechanism, middleware change, or protected-route logic is introduced** — this spec reuses the existing, deliberate per-page auth-check convention (see `proxy.ts`'s own comment on why middleware does not gate routes).

---

## 11. Data/Content Model

Per planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 11, adopted as-is for PR #135:

```
lib/practice-lab/types.ts              # PracticeLabExercise shared type (added PR #135)
content/practice-lab/5250-exercises.ts # 10 planned 5250 exercises (added PR #135)
content/practice-lab/sql-exercises.ts  # 10 planned SQL exercises (added PR #135)
components/practice-lab/*              # shared presentational components (added PR #135: simulator-notice.tsx, exercise-list.tsx)
lib/labs/5250-simulator.ts             # command dispatch engine (PR #136, not yet created)
lib/labs/sql-simulator.ts              # SQL pattern-validation engine (PR #137, not yet created)
```

`content/practice-lab/*.ts` (not `.md`) follows `content/practice/questions.ts`'s existing precedent — exercise metadata is structured data, not prose.

### `PracticeLabExercise` shape (as implemented in PR #135)

```typescript
export type PracticeLabType = '5250' | 'sql'
export type PracticeLabExerciseStatus = 'planned' | 'available'
export type PracticeLabDifficulty = 'beginner' | 'intermediate'

export interface PracticeLabExercise {
  id: string
  slug: string
  title: string
  labType: PracticeLabType
  difficulty: PracticeLabDifficulty
  summary: string
  learningObjectives: string[]
  relatedLessonSlugs: string[]
  status: PracticeLabExerciseStatus
}
```

All 20 exercises seeded in PR #135 (10 per module) have `status: 'planned'`. `expectedCommands`/`expectedSqlPatterns`/`simulatedOutputs`/`hints`/`successCriteria` fields proposed in planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 11 are intentionally **not** added to this type yet — they belong to the simulator engines (PR #136/#137) and should be designed against real engine requirements rather than speculated here.

---

## 12. UX Requirements (PR #135 Scope)

- `/practice-lab` shows two cards (5250 Command Practice, SQL Practice Console) with the copy specified in the PR #134 proposal, plus the simulator disclaimer.
- Both module pages show: title, short explanation, the 10 planned exercises as a non-interactive numbered list with a "Coming next" badge per item, and the simulator disclaimer.
- All three pages reuse existing UI primitives (`Card`, `buttonVariants`, Tailwind conventions already used by `/practice`/`/dashboard`) — no new design system, no broad redesign.
- A "Try the Practice Lab" card is added to `/practice`; a "Practice Lab" card is added to `/dashboard`'s existing card grid — both following those pages' existing card patterns exactly, no navigation restructuring.
- No mobile-specific layout work is required for this revision beyond what the existing `Card`/grid/stacked patterns already provide responsively — the interactive workspace layouts (Section 8/9/10 of the design proposal — instruction panel / simulator workspace / AI Tutor panel) are PR #136/#137/#138 scope, once there is an actual workspace to lay out.

---

## 13. Future Implementation Phases

| PR | Scope |
|---|---|
| **#135 (this spec)** | Spec + safe route/page skeleton, planned exercise content, navigation entries. No simulator logic. |
| **#136** | 5250 Command Practice MVP: `lib/labs/5250-simulator.ts` (LAB-FR-001/002), the 10 exercises made interactive, green-screen UI (LAB-FR-004), per-exercise workspace routes. No AI Tutor integration yet. |
| **#137** | SQL Practice Console MVP: `lib/labs/sql-simulator.ts` (LAB-FR-008), the 10 exercises made interactive, ACS-inspired UI (LAB-FR-012), per-exercise workspace routes. No AI Tutor integration yet. |
| **#138** | Practice Lab AI Tutor Integration (Section 9): `sourceType: 'practice-lab'` context, new prompt formatter, embedded panel wiring into both modules' workspaces. |
| **#139** | Practice Lab QA / Content Expansion: a regression pass for the simulator/pattern-matching logic (mirroring PR #133's lightweight-script approach), plus additional exercises beyond the initial 10+10. |

---

## 14. Acceptance Criteria

### This Spec Revision (PR #135)

- [ ] `specs/010-practice-lab/spec.md` exists and documents product definition, MVP scope, non-goals, 5250/SQL module behavior, AI Tutor integration expectations, safety rules, routing expectations, data model, roadmap, and acceptance criteria.
- [ ] `/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql` exist, gated identically to `/practice` (redirect to login when logged out).
- [ ] The landing page shows both module cards with the specified copy.
- [ ] Both module pages show their 10 planned exercises, each clearly marked "Coming next"/non-interactive, plus the simulator disclaimer.
- [ ] No 5250 command handling or SQL execution/validation code exists anywhere in this PR.
- [ ] No new dependency was added.
- [ ] No Supabase migration was added.
- [ ] `/learn`, `/practice`, `/ai-tutor` (standalone and embedded panel), and `/dashboard` are unaffected and still work.
- [ ] Protected lesson gating and existing lesson URLs are unchanged.

### Future MVP (PR #136–#139, not required to be true of PR #135)

- [ ] Learner opens Practice Lab, selects 5250 Command Practice, and completes the `WRKOBJ` guided exercise.
- [ ] An unsupported 5250 command returns a friendly response (LAB-FR-001).
- [ ] Learner asks the AI Tutor for help on the current screen/task and gets a response referencing the current exercise (Section 9).
- [ ] Learner opens SQL Console, runs the `SELECT`-all-rows exercise, and sees the correct result table.
- [ ] Invalid SQL shows a friendly explanation, not a raw error (LAB-FR-009).
- [ ] AI Tutor explains a SQL error using the exercise's context without stating the corrected SQL unless a hint was explicitly requested (Section 9).
- [ ] Related lesson links from a Practice Lab exercise navigate to the correct, real, Published lesson.
- [ ] Mobile layout remains usable for the interactive workspace (once built).
- [ ] No real IBM i or real-database connection exists anywhere in the feature, confirmed by code review.
- [ ] Protected route behavior remains unchanged.

---

## 15. Dependencies

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 001: AI Tutor | Governs the future `sourceType: 'practice-lab'` context and embedded panel reuse (Section 9) |
| Spec 002: Learning Center | Related-lesson resolution conventions |
| Spec 003: Lesson Experience | Published-only lesson link resolution conventions this spec's `relatedLessonSlugs` follows |

### External Dependencies

None new. This spec revision (PR #135) adds no third-party dependency, no Supabase migration, and no new environment variable.

---

## 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Learner or prospective customer believes this connects to a real IBM i system | Explicit, persistent simulator disclaimer on every page (Section 8); "5250-style"/"ACS-style" naming discipline everywhere (Section 3) |
| Feature scope creep toward real terminal/ACS fidelity | Sections 4/5/8 explicitly enumerate non-goals; each implementation PR (Section 13) is scoped to reference this spec rather than re-deriving ambition |
| AI Tutor accidentally leaking an exercise's expected answer | Structural omission of `expectedCommands`/`expectedSqlPatterns` from the AI Tutor context payload (Section 9), mirroring the existing AI-TUTOR-FR-021 practice-question guarantee — to be enforced and tested in PR #138 |
| Stub per-exercise routes shipped with nothing behind them | Deliberately not created in PR #135 (Section 10) — deferred until each module's simulator engine exists to populate them |
| Navigation clutter from adding a new top-level feature | No change to `components/site-header.tsx`'s main nav in this revision — entry points added only as cards on `/practice` and `/dashboard`, matching existing patterns |

---

## 17. Open Questions (Product Owner Decisions Needed Before PR #136)

Carried forward from planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 15, still unresolved:

1. Should `/practice-lab` also be linked from the main site navigation (`components/site-header.tsx`), beyond the `/practice` and `/dashboard` cards added in this PR?
2. Should Practice Lab exercise completion tie into any progress/Mark Complete concept, or stay purely session-local with no persistence?
3. Is the initial 10+10 exercise set sufficient for a first release, or should it be larger before reaching learners?
4. Should a lesson covering `GROUP BY`/aggregates be commissioned (LAB-FR-007) before or alongside PR #137?
5. Is the recommended SQL simulation model (server-side pattern-matching, LAB-FR-008, no new dependency) acceptable, or should a small embedded SQL engine dependency be approved instead?
6. Is the proposed "N row(s) would be affected (simulated -- no data was changed)" tone right for simulated `INSERT`/`UPDATE` confirmations (LAB-FR-011)?
7. Confirm AI Tutor access should stay exclusively via the existing embedded panel (Section 9), not a dedicated, always-open Practice Lab chat surface.

---

## 18. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before PR #136 (5250 simulator) or PR #137 (SQL simulator) implementation planning begins. PR #135 (this spec + routing skeleton) does not require full spec approval to merge, since it adds no simulator logic — but the open questions in Section 17 should be resolved before committing engineering time to PR #136/#137.

### Before PR #136/#137 Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP module scope and exercise lists (Sections 6/7)
- [ ] Product Owner has answered the open questions in Section 17
- [ ] Engineering has confirmed the recommended simulation models (LAB-FR-001/002 for 5250, LAB-FR-008 for SQL) are acceptable, or has proposed an approved alternative

### Notes for Implementation Planning

- PR #136/#137 should treat `content/practice-lab/5250-exercises.ts` / `sql-exercises.ts` as a starting point, not a frozen shape — `expectedCommands`/`expectedSqlPatterns`/`simulatedOutputs`/`hints` fields should be added once real engine requirements are clear, the same way `content/practice/questions.ts`'s shape evolved through real content batches.
- PR #138 (AI Tutor integration) should be sequenced strictly after PR #136/#137 are stable, so it has real `simulatedOutput`/`errorMessage` shapes to design the prompt formatter against.
- PR #139's regression approach should mirror PR #133's lightweight-script style (no new test framework) unless circumstances have changed by then.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-16 | 1.0 (Draft) | Initial spec — formalizes the PR #134 design proposal into a numbered functional-requirements spec, scoped to PR #135's routing-skeleton implementation plus the full future roadmap (PR #136–#139) |
