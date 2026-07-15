# 5250-Style Practice Lab + SQL Console — Design Proposal

**Date:** 2026-07-16
**Author:** Proposal produced as PR #134, following the completed AI Tutor RAG v2 sequence (PR #130 Design Audit, PR #131 Keyword + Chunk Retrieval, PR #132 Source/Related Lesson References Polish, PR #133 RAG QA / Regression Test Pass).
**Purpose:** Propose a hands-on "Practice Lab" experience — a guided 5250-style command simulator and an ACS-style SQL practice console — that lets learners practice IBM i skills interactively, with AI Tutor assistance, without any real IBM i backend.

**This PR is design/proposal only.** No routes, components, simulator logic, or database schema were changed. `git status` at the end of this PR shows only this new planning document.

---

## 1. Product Definition

**This feature is:** a **"5250-style Practice Lab."**

**This feature explicitly is NOT:**
- a real 5250 emulator
- an IBM i emulator
- an ACS (IBM Access Client Solutions) clone
- a live IBM i terminal or live SQL connection to any real system

### Why this distinction matters

- **Avoids overpromising.** A learner (or a prospective customer evaluating the platform) must never come away believing they can use this to actually administer or connect to a real IBM i partition. "Practice Lab" sets the correct expectation up front: this is a learning tool, not operational tooling. This mirrors the same honesty principle already established in the AI Tutor's own system prompt (`lib/ai/system-prompt.ts`): *"You cannot connect to a real IBM i system, execute code, or verify production behavior. Never claim or imply otherwise."* The Practice Lab must carry the identical guarantee in its own UI copy, not just in the AI Tutor's chat responses.
- **Avoids TN5250 protocol complexity.** A real 5250 emulator means implementing (or embedding) the TN5250E protocol, screen field attributes, AID keys, and a genuine session/socket layer to a host. That is a multi-month systems-engineering effort orthogonal to this platform's actual product (a Next.js learning app with Supabase-backed content), and it would need to talk to *something* — which raises the credential/security problem below. None of that is needed to teach a learner what `WRKOBJ` does or what a `SELECT` statement returns.
- **Avoids credential/security risk.** A real IBM i connection means real user profiles, real passwords or connection secrets, and a real attack surface (arbitrary command execution against a live system, potentially a customer's production partition). This platform has no IBM i systems to connect to today, no way to safely provision disposable ones per learner, and no security review budget for that risk in an MVP. A simulator sidesteps this category of risk entirely by construction — there is no real system to compromise.
- **Focuses on learning outcomes.** The actual pedagogical goal (per Section 2) is command recognition, concept understanding, and safe practice of a workflow — not exact fidelity to every keyboard shortcut, function key, or ACS dialog. A guided simulator with predefined exercises can be *more* effective for a beginner than a real, unconstrained terminal, because it can validate the learner's input, offer a hint, and never let them get stuck in a genuinely broken state.

**Naming/trademark note:** "5250" and "IBM i" are IBM terminology describing a display protocol and platform, used descriptively here (as the rest of this platform already does throughout its lesson content). "ACS" refers to IBM's Access Client Solutions product. This proposal deliberately uses **"5250-style"** and **"ACS-style"** (or "ACS-inspired") throughout — never "5250 emulator," "IBM i emulator," or "ACS" unqualified — to avoid implying this is IBM's product or an official/certified emulator. This is elaborated in Section 12.

---

## 2. Feature Goals

The Practice Lab should help learners:

1. **Practice common IBM i commands** — typing and recognizing commands like `WRKOBJ`, `DSPJOB`, `WRKACTJOB` in a safe, guided setting rather than only reading about them.
2. **Understand green-screen navigation** — command line entry, function-key-driven navigation, and how a "screen" changes in response to input, since this is a genuinely unfamiliar interaction model for learners coming from modern web/GUI backgrounds.
3. **Learn object/library/job/spool concepts** — reinforcing lesson content (library lists, object types, job status, spool files, output queues) through hands-on recognition rather than passive reading.
4. **Practice basic operational troubleshooting** — e.g., recognizing a job stuck in `MSGW`, or finding what has an object locked, mirroring realistic (if simplified) day-one support-developer tasks.
5. **Practice SQL in an ACS-like console** — writing and running `SELECT`/`WHERE`/`JOIN`/aggregate queries against a small sample schema, and reading real (simulated) result sets and error messages.
6. **Ask AI Tutor for contextual help** — get an explanation of the current screen, the current query, or why something didn't work, without leaving the workspace.
7. **Connect lessons to hands-on scenarios** — every exercise links back to the lesson(s) that teach the underlying concept, closing the loop between "read about it" and "try it," which today ends at reading plus a practice multiple-choice question (`content/practice/questions.ts`) with no interactive/typed-command practice at all.

---

## 3. MVP Modules

Two MVP modules, matching the two most concretely teachable, self-contained interaction models in the current curriculum (5250 command navigation and SQL):

### A. 5250 Command Practice
- Green-screen style UI (dark background, monospace, function-key row).
- A single command input line, matching the 5250 "type a command, press Enter" model.
- Predefined simulated screens returned for supported commands.
- Guided exercises, one command/workflow per exercise.
- Command validation against an expected-command pattern (Section 6).
- Friendly error messages for anything unsupported or mistyped — never a raw crash or a blank screen.
- AI Tutor help scoped to "what is the current screen/task" (Section 7).

### B. SQL Practice Console
- ACS "Run SQL Scripts"-inspired UI: editor pane, Run button, result grid, messages pane.
- A small, fixed sample schema (a handful of tables — e.g. `EMPLOYEE`, `DEPARTMENT`, `ORDERS` — reused across exercises).
- Predefined exercises, one SQL concept per exercise.
- Result table display for successful queries.
- Friendly, explained errors for invalid SQL (bad column/table name, syntax issues) rather than a raw driver error string.
- AI Tutor help scoped to "what is the current query/task" (Section 7).

Both modules are **read-mostly**: the 5250 module has no real object/library state to mutate, and the SQL module's `INSERT`/`UPDATE` exercises (Section 5, #8–9) are explicitly simulated/safe-mode only (Section 6) — no exercise in the MVP persists a mutation anywhere, including within the learner's own session, beyond what's needed to show the "expected" simulated result once.

---

## 4. 5250 Command Practice — MVP Exercises

All ten requested exercises, each with the documented fields. `relatedLessonSlugs` reference real, existing slugs in `content/lessons/metadata.ts` (verified against the current 288-lesson catalog) — this proposal does not invent new lesson content.

### 1. Understand command line and prompt style
- **Learning objective:** Recognize the 5250 command-line pattern (type a command, optionally press F4 to prompt for parameters, press Enter to run) before touching any specific command.
- **Expected command(s):** `F4` (prompt) on a blank command line; free-typed placeholder command accepted for the "just try typing something" step.
- **Simulated response screen:** A generic "Prompting" screen showing a command's parameter fields filled with placeholder labels (e.g. `Object . . . . . *ALL`, `Library . . . . *LIBL`), illustrating the F4 pattern without being tied to one real command yet.
- **Common learner mistake:** Trying to "click" fields with a mouse the way a GUI form works, or expecting autocomplete; the exercise's hint text should explicitly call out that 5250 navigation is keyboard/field-based, not pointer-based.
- **AI Tutor hint opportunity:** "What does F4 do here?" / "Why does the screen look like this?"
- **Related lesson slugs:** `using-f4-prompt-and-command-help`

### 2. Use WRKLIB
- **Learning objective:** List libraries and understand what a library is in IBM i object terms.
- **Expected command(s):** `WRKLIB LIB(*ALL)` or `WRKLIB` (bare, accepted as equivalent for the exercise).
- **Simulated response screen:** A fixed, fabricated list of 5–6 library names (e.g. `QGPL`, `QSYS`, a fictional `MYAPPLIB`) in a simple columnar "Work with Libraries" layout, with a status/message line reading `Work with Libraries` as the screen title.
- **Common learner mistake:** Typing `WRKLIBS` (no such command) or omitting the library name/parameter entirely and expecting an error rather than a default "*ALL"-style listing.
- **AI Tutor hint opportunity:** "What is the difference between a library and a folder?"
- **Related lesson slugs:** `working-with-wrkobj-dspobjd-and-wrklib`, `library-list-explained-in-depth`

### 3. Use WRKOBJ
- **Learning objective:** List objects within a library and recognize object type codes (`*PGM`, `*FILE`, etc.).
- **Expected command(s):** `WRKOBJ OBJ(MYAPPLIB/*ALL)` (a fixed fictional library from Exercise 2, so the two exercises feel connected).
- **Simulated response screen:** A fixed fabricated object list (e.g. `CUSTMAST *FILE`, `ORDPGM *PGM`, `ORDPF *FILE`) in a "Work with Objects" layout.
- **Common learner mistake:** Providing a library that doesn't exist in the lab's simulated state and expecting the same list back regardless (see Section 6's "unsupported input" behavior — an unknown-but-plausible library name should return a friendly "no objects found in that library in this lab" message, not the same canned list).
- **AI Tutor hint opportunity:** "What does `*PGM` vs `*FILE` mean here?"
- **Related lesson slugs:** `working-with-wrkobj-dspobjd-and-wrklib`

### 4. Use DSPOBJD
- **Learning objective:** Display a single object's description/metadata rather than a whole-library list.
- **Expected command(s):** `DSPOBJD OBJ(MYAPPLIB/CUSTMAST)` (reusing Exercise 3's fabricated object).
- **Simulated response screen:** A fixed "Display Object Description" detail screen showing object type, owner, text description, and creation-date-style fields (all fabricated but plausible).
- **Common learner mistake:** Confusing `DSPOBJD` (metadata about one object) with `WRKOBJ` (a worklist of many objects) — the exercise's success/failure text should explicitly reinforce this distinction when the learner runs the wrong one of the two.
- **AI Tutor hint opportunity:** "How is this different from WRKOBJ?"
- **Related lesson slugs:** `working-with-wrkobj-dspobjd-and-wrklib`

### 5. Use WRKSPLF
- **Learning objective:** List spool files and recognize the spool-file-to-job relationship.
- **Expected command(s):** `WRKSPLF` (bare, current user's spool files in the lab's fixed simulated state).
- **Simulated response screen:** A fixed list of 3–4 fabricated spool file entries (report name, status `RDY`/`SAV`, page count), in a "Work with Spooled Files" layout.
- **Common learner mistake:** Expecting `WRKSPLF` to show *other users'* spool files by default (it doesn't, without an explicit `SELECT` parameter) — the lab can surface this as a hint rather than a real parameter difference to simulate.
- **AI Tutor hint opportunity:** "What happens to a spool file after I print it?"
- **Related lesson slugs:** `working-with-spool-files-using-wrksplf`

### 6. Use WRKOUTQ
- **Learning objective:** Understand output queues as the holding area spool files live in before printing.
- **Expected command(s):** `WRKOUTQ OUTQ(*ALL)` or `WRKOUTQ` (bare).
- **Simulated response screen:** A fixed list of 2–3 fabricated output queue names with entry counts, in a "Work with Output Queues" layout.
- **Common learner mistake:** Conflating an output queue with a spool file itself (the queue *holds* spool files; it isn't one) — reinforced in the exercise's success text.
- **AI Tutor hint opportunity:** "What's the difference between an output queue and a spool file?"
- **Related lesson slugs:** `working-with-output-queues-using-wrkoutq`, `working-with-spool-files-using-wrksplf`

### 7. Use DSPJOB
- **Learning objective:** Inspect a specific job's details (status, job log, open files) as a troubleshooting starting point.
- **Expected command(s):** `DSPJOB` (bare, defaults to the current simulated job) or `DSPJOB JOB(123456/LABUSER/QPADEV0001)`-style fully-qualified form.
- **Simulated response screen:** A fixed "Display Job" menu screen listing option numbers (job status attributes, job log, open files) — the lab can accept a follow-up numeric option (e.g. option `10` for job log) as a bonus interaction, or simply show the top-level menu for MVP simplicity.
- **Common learner mistake:** Expecting `DSPJOB` to require the fully-qualified job name every time, when in practice (and in the lab) it defaults sensibly to "this job" with no parameters.
- **AI Tutor hint opportunity:** "What is a job log and when would I look at it?"
- **Related lesson slugs:** `dspjob-and-job-information-basics`

### 8. Use WRKACTJOB
- **Learning objective:** Recognize the system-wide "what's currently running" view and its columns (job name, status, CPU%, function).
- **Expected command(s):** `WRKACTJOB` (bare).
- **Simulated response screen:** A fixed list of 5–6 fabricated active job rows with varying `status` values (`RUN`, `DSPW`, `MSGW`, `JOBQ`) — deliberately including a `MSGW` row here as a lead-in to Exercise 9.
- **Common learner mistake:** Assuming every row is "a program," rather than understanding a job can represent an interactive session, a batch job, or a system job.
- **AI Tutor hint opportunity:** "What do these status values mean?"
- **Related lesson slugs:** `wrkactjob-basics-for-developers`, `job-status-values-explained`

### 9. Investigate a MSGW job
- **Learning objective:** Recognize `MSGW` (message-wait) status and the workflow to find out what message a job is waiting on.
- **Expected command(s):** `WRKACTJOB` (to spot the `MSGW` row from Exercise 8) followed by a simulated "select option 5 (work with)" or a direct `WRKJOB` on that job name.
- **Simulated response screen:** A fixed "job is waiting for a reply to message: ..." screen showing one fabricated inquiry message (e.g. a tape/device-related prompt), illustrating that `MSGW` means the job is paused, not hung or crashed.
- **Common learner mistake:** Assuming a `MSGW` job is frozen/broken and should be cancelled, rather than understanding it's waiting for a human to answer a message.
- **AI Tutor hint opportunity:** "Why is my job in MSGW?" (this is one of the exact RAG regression scenarios validated in PR #133, reinforcing the lesson-content ↔ lab ↔ AI Tutor connection this feature is meant to build).
- **Related lesson slugs:** `job-status-values-explained`, `reading-ibm-i-message-ids`

### 10. Find an object lock using WRKOBJLCK
- **Learning objective:** Recognize that "why can't I update/delete this object" is often an object-lock question, and `WRKOBJLCK` is the tool to answer it.
- **Expected command(s):** `WRKOBJLCK OBJ(MYAPPLIB/CUSTMAST) OBJTYPE(*FILE)` (reusing the Exercise 3/4 fabricated object, so a learner sees the same object across multiple exercises, reinforcing continuity).
- **Simulated response screen:** A fixed "Work with Object Locks" screen showing one fabricated job holding a `*SHRUPD` (shared-for-update) lock on the object.
- **Common learner mistake:** Expecting the command to *release* the lock automatically, rather than understanding it only *displays* lock holders (ending the holding job/session is a separate, deliberately out-of-scope-for-this-lab action).
- **AI Tutor hint opportunity:** "What's the difference between an exclusive lock and a shared lock?"
- **Related lesson slugs:** `object-locks-basics`, `handling-object-locks-as-a-developer`

---

## 5. SQL Console — MVP Exercises

All ten requested exercises against one small, shared, fixed sample schema (proposed schema below Exercise list) so a learner builds familiarity with the same tables across exercises, exactly like the ACS "Run SQL Scripts" experience of working against one connection's schema all session.

**Proposed sample schema** (fixed, in-memory, defined once and reused by every SQL exercise):

| Table | Columns |
|---|---|
| `EMPLOYEE` | `EMP_ID`, `FIRST_NAME`, `LAST_NAME`, `DEPT_ID`, `HIRE_DATE`, `SALARY` |
| `DEPARTMENT` | `DEPT_ID`, `DEPT_NAME`, `MANAGER_ID` |
| `ORDERS` | `ORDER_ID`, `EMP_ID`, `ORDER_DATE`, `AMOUNT` |

### 1. SELECT all rows
- **Learning objective:** Recognize the most basic query shape and read a resulting table.
- **Sample table(s):** `DEPARTMENT` (small enough to show every row without scrolling).
- **Expected SQL:** `SELECT * FROM DEPARTMENT`
- **Result table:** All department rows (4–5 fabricated rows).
- **Common mistake:** Forgetting the `FROM` clause, or typing `SELECT *` with no table at all — the friendly error should name the missing clause specifically.
- **AI Tutor hint opportunity:** "What does `SELECT *` actually mean?"
- **Related lesson slugs:** `basic-select-on-ibm-i`

### 2. SELECT specific columns
- **Learning objective:** Understand column projection instead of always using `*`.
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL:** `SELECT FIRST_NAME, LAST_NAME FROM EMPLOYEE`
- **Result table:** Two columns only, all employee rows.
- **Common mistake:** Comma-splicing errors (missing comma between column names) — the friendly error should point at the specific malformed column list.
- **AI Tutor hint opportunity:** "Why would I pick specific columns instead of using `*`?"
- **Related lesson slugs:** `basic-select-on-ibm-i`

### 3. WHERE filter
- **Learning objective:** Filter rows by a condition.
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL:** `SELECT * FROM EMPLOYEE WHERE DEPT_ID = 10`
- **Result table:** Only the fabricated rows matching `DEPT_ID = 10`.
- **Common mistake:** Using `=` vs a string literal without quotes on a text column (e.g. `WHERE LAST_NAME = SMITH` instead of `'SMITH'`) — the friendly error should explain that string values need quotes.
- **AI Tutor hint opportunity:** "Why do I need quotes around text but not numbers?"
- **Related lesson slugs:** `basic-where-conditions-in-embedded-sql`

### 4. ORDER BY
- **Learning objective:** Control result row ordering.
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL:** `SELECT FIRST_NAME, LAST_NAME, SALARY FROM EMPLOYEE ORDER BY SALARY DESC`
- **Result table:** All employees, sorted highest-salary-first.
- **Common mistake:** Assuming results come back "in order" by default without `ORDER BY` (a classic, genuinely-true-on-real-Db2-for-i misconception worth teaching directly).
- **AI Tutor hint opportunity:** "Is there a default row order if I don't say ORDER BY?"
- **Related lesson slugs:** `order-by-and-result-ordering`

### 5. Simple JOIN
- **Learning objective:** Combine two related tables via a shared key.
- **Sample table(s):** `EMPLOYEE`, `DEPARTMENT`
- **Expected SQL:** `SELECT E.FIRST_NAME, E.LAST_NAME, D.DEPT_NAME FROM EMPLOYEE E JOIN DEPARTMENT D ON E.DEPT_ID = D.DEPT_ID`
- **Result table:** Employee names alongside their department name.
- **Common mistake:** Omitting the `ON` condition (accidental cross join / cartesian product) — the friendly error/explanation should call out that every employee row would otherwise be paired with every department row, and why that's usually not intended.
- **AI Tutor hint opportunity:** "What happens if I forget the ON clause?"
- **Related lesson slugs:** `simple-join-in-sqlrpgle`

### 6. Aggregate COUNT / GROUP BY
- **Learning objective:** Summarize rows into per-group counts.
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL:** `SELECT DEPT_ID, COUNT(*) AS EMP_COUNT FROM EMPLOYEE GROUP BY DEPT_ID`
- **Result table:** One row per `DEPT_ID` with a count column.
- **Common mistake:** Selecting a non-aggregated, non-grouped column alongside `COUNT(*)` (e.g. `SELECT FIRST_NAME, COUNT(*) ... GROUP BY DEPT_ID`) — the friendly error should explain that every selected column must be either grouped or aggregated.
- **AI Tutor hint opportunity:** "Why can't I just add FIRST_NAME to the SELECT list here?"
- **Related lesson slugs:** *(none currently — see note below)*

  > **Content gap noted, not fixed in this PR:** no lesson in the current 288-lesson catalog is specifically about `GROUP BY`/aggregate functions (confirmed by search; the closest adjacent lessons are `order-by-and-result-ordering` and `common-advanced-sql-mistakes-on-ibm-i`, neither of which covers aggregation directly). This is a genuine curriculum gap surfaced as a byproduct of writing this proposal, flagged for the content team's awareness — not something this design-only PR should fix by inventing a new lesson.

### 7. SQLCODE 100 / no row found concept
- **Learning objective:** Recognize that "no rows found" is a normal, expected outcome (`SQLCODE 100`), not an error.
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL:** `SELECT * FROM EMPLOYEE WHERE DEPT_ID = 999` (a `DEPT_ID` that deliberately matches nothing in the fixed fabricated data).
- **Result table:** Empty result grid, paired with a message-pane note: `SQLCODE 100 -- Row not found` (styled as an informational message, not a red error banner, to reinforce that this is not a failure).
- **Common mistake:** Treating an empty result as if the query itself failed/errored, rather than as a normal "zero matching rows" outcome.
- **AI Tutor hint opportunity:** "Is SQLCODE 100 an error?" (this exercise is a direct hands-on companion to the existing `sqlcode-and-sqlstate-basics-in-sqlrpgle` / `sqlca-sqlcode-and-sqlstate-in-depth` lessons and to the "What does SQLCODE 100 mean?" scenario already validated in PR #133's RAG regression script.)
- **Related lesson slugs:** `sqlcode-and-sqlstate-basics-in-sqlrpgle`, `sqlca-sqlcode-and-sqlstate-in-depth`

### 8. UPDATE concept in safe simulated mode
- **Learning objective:** Understand `UPDATE`'s shape (`SET` + `WHERE`) and the danger of an unfiltered `UPDATE`, without ever mutating real or even session-persistent data.
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL:** `UPDATE EMPLOYEE SET SALARY = 55000 WHERE EMP_ID = 3`
- **Result table:** No result grid; a message-pane confirmation styled as `1 row would be updated (simulated -- no data was changed)`, plus a small **before/after preview** of just that one fabricated row so the learner sees the effect without any real mutation occurring.
- **Common mistake:** Omitting `WHERE` entirely — the lab should specifically detect a `WHERE`-less `UPDATE`/`DELETE` and respond with a pointed warning message (`This would update ALL rows in EMPLOYEE -- did you forget a WHERE clause?`) rather than silently "simulating" a full-table update, since teaching learners to notice this is a real safety habit worth reinforcing even in a simulator.
- **AI Tutor hint opportunity:** "What would happen if I ran this without a WHERE clause?"
- **Related lesson slugs:** `update-and-delete-with-embedded-sql`

### 9. INSERT concept in safe simulated mode
- **Learning objective:** Understand `INSERT`'s shape (columns + values, or full-row shorthand).
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL:** `INSERT INTO EMPLOYEE (EMP_ID, FIRST_NAME, LAST_NAME, DEPT_ID, SALARY) VALUES (99, 'Alex', 'Rivera', 10, 48000)`
- **Result table:** No result grid; a message-pane confirmation `1 row would be inserted (simulated -- no data was changed)`, with a preview of the would-be new row rendered in the same shape as `EMPLOYEE`'s columns.
- **Common mistake:** Column-count/value-count mismatch (e.g. 5 columns listed, 4 values supplied) — the friendly error should name the mismatch directly ("5 columns listed but 4 values provided").
- **AI Tutor hint opportunity:** "Why did my INSERT fail here?"
- **Related lesson slugs:** `insert-with-embedded-sql`

### 10. Troubleshoot invalid column/table error
- **Learning objective:** Read and act on a real-looking "object not found" SQL error.
- **Sample table(s):** `EMPLOYEE`
- **Expected SQL (the "broken" one the exercise presents or asks the learner to fix):** `SELECT EMPLOEE_NAME FROM EMPLOYEE` (misspelled column) or `SELECT * FROM EMPLOYE` (misspelled table).
- **Result table:** No result grid; a message-pane error styled like a real Db2-for-i error (e.g. `Column EMPLOEE_NAME not found in EMPLOYEE. SQLSTATE 42703` / `Table EMPLOYE not found. SQLSTATE 42704`), with the friendly explanation layered underneath in plain language.
- **Common mistake:** Not noticing the typo at all and assuming the table/column simply "doesn't exist yet" — the AI Tutor hint should nudge toward re-reading the exact name character-by-character rather than immediately revealing the typo.
- **AI Tutor hint opportunity:** "What does SQLSTATE 42703 mean?"
- **Related lesson slugs:** `common-advanced-sql-mistakes-on-ibm-i`, `sqlcode-and-sqlstate-basics-in-sqlrpgle`

---

## 6. Simulation Model

### Options evaluated

| Option | Description | Verdict |
|---|---|---|
| **A. Fully hardcoded exercise validation** | Each exercise hardcodes its one expected command/query string (or a small set of accepted variants) and its one canned output. No general command/SQL parser at all. | **Too rigid alone** — a learner who runs `WRKOBJ OBJ(MYAPPLIB/*ALL)` vs `wrkobj obj(myapplib/*all)` (case) or with harmless extra whitespace would fail for reasons unrelated to the actual learning objective. Needs at least normalization (case-insensitive, whitespace-trimmed, parameter-order-tolerant matching) layered on top to be usable — see recommendation below. |
| **B. Small in-memory simulation engine** | A tiny rules engine: a fixed "fake system state" object (libraries, objects, jobs, spool files in memory) plus a small set of supported command handlers (`WRKOBJ`, `DSPJOB`, etc.) that read/pattern-match against that state and return a templated screen. Unrecognized commands get the friendly fallback message. | **Recommended for 5250** (see below). |
| **C. Browser-side SQL engine using a dependency** (e.g. a WASM SQLite build) | Ship a real, tiny SQL engine to the browser, load the fixed sample schema into it, and execute the learner's actual SQL against it. | Genuinely tempting (real `SELECT`/`JOIN`/`GROUP BY` semantics for free, real error messages) but explicitly **adds a new dependency**, which the task's own constraints ask to avoid "unless absolutely necessary" — and it is not necessary for a documentation-only MVP scope of ~10 fixed exercises. Worth **re-evaluating in the PR #137 implementation proposal** (Section 13) once the exact exercise set is locked, as a possible *later* upgrade path once 3-value/wildcard matching in Option D starts feeling limiting — but not something to commit to in this design doc. |
| **D. Server-side controlled SQL validation** | A small server-side (or shared, isomorphic) function pattern-matches the learner's typed SQL against each exercise's `expectedSqlPatterns` (normalized: case/whitespace-insensitive, tolerant of column/table order where order doesn't matter, e.g. `SELECT` column lists) and returns the exercise's predefined result table on a match, or a predefined "common mistake" response if it matches a known wrong-pattern, or a generic friendly parse-error otherwise. No real SQL execution anywhere. | **Recommended for SQL** (see below). |
| **E. Real IBM i connection** | Actually connect to a real or provisioned IBM i partition and run real commands/SQL. | **Explicitly rejected** — this is precisely the "real emulator" scope this proposal exists to avoid (Section 1), and reintroduces the credential/security risk this whole design is structured to sidestep. Not appropriate for any phase of this feature as currently scoped, MVP or later. |

### Recommendation

- **5250 module → Option B (small in-memory simulation engine).** A fixed, per-exercise "fake system state" (a small TypeScript object literal, not a database) plus a small dispatch table of supported command handlers. Each handler:
  1. Normalizes the typed input (uppercase, trim, collapse whitespace).
  2. Matches it against that exercise's accepted command pattern(s) (exact match or simple parameter-order-tolerant parsing — no general 5250 command-language parser).
  3. Returns that exercise's predefined simulated screen (a plain data structure — headings, rows, a status line — rendered by a shared presentational component, not raw HTML per exercise).
  4. Any command not recognized *at all* (not just "wrong for this exercise") returns a shared, friendly `"XYZ is not available in this lab yet"`-style message — never a stack trace, blank screen, or silent no-op.
  - This keeps the "finite set of supported commands" constraint explicit and enforced by construction: the dispatch table *is* the finite set.

- **SQL module → Option D (server-side controlled SQL validation), with Option A's normalization built in.** Each exercise defines one or more `expectedSqlPatterns` (e.g. via a small structured shape like `{ requiredClauses: ['SELECT', 'FROM EMPLOYEE'], columnListOrder: 'any', ... }` rather than a single brittle exact string) plus one or more named "common mistake" patterns (e.g. "WHERE-less UPDATE/DELETE," "column count ≠ value count on INSERT") that get their own specific friendly message instead of falling through to a generic parse error. Anything matching neither the expected pattern(s) nor a named mistake pattern gets the generic "couldn't recognize this as valid SQL for this exercise" fallback. Running this validation server-side (a Next.js Route Handler/Server Action, not client-only) keeps the pattern-matching rules out of the client bundle (so they can't trivially be reverse-engineered/gamed) and keeps the door open for future server-side telemetry (e.g. "which mistake pattern do learners hit most") without any client-side redesign.
  - **Why not Option C (a real embedded SQL engine) for MVP:** it is the more "honest" simulation (real engine semantics, real error text) but is a new dependency and meaningfully more implementation effort for a first version whose exercise set is small and fixed. This proposal recommends keeping it as an explicitly named **future upgrade path**, not committing to it now.
  - **No real database writes in MVP, anywhere:** `UPDATE`/`INSERT` exercises (Section 5, #8–9) validate the *shape* of the statement and return a simulated "N row(s) would be affected" confirmation plus a before/after preview built from the fixed sample data already in memory — never a Supabase write, never a mutation to any table backing the app itself (the sample schema is not stored in Supabase at all; see Section 11).

---

## 7. AI Tutor Integration

### Context AI Tutor should receive

Extending the existing `AiTutorContext` discriminated union (`components/ai-tutor/types.ts`) with a new `sourceType: 'practice-lab'` variant, following the exact same shape/safety conventions already established for `sourceType: 'practice'`:

```typescript
// components/ai-tutor/types.ts (proposed shape, not implemented in this PR)

| {
    sourceType: 'practice-lab'
    labType: '5250' | 'sql'
    exerciseSlug: string
    exerciseTitle: string
    taskInstruction: string          // the current exercise's learning objective / instruction text
    typedInput: string               // the learner's current command or SQL, as typed
    simulatedOutput?: string         // the simulated screen/result-table text last returned, if any
    errorMessage?: string            // the friendly error/message-pane text last shown, if any
    relatedLessonSlugs: string[]
    hintRequested: boolean           // true only when the learner explicitly clicked "Hint" / "Explain", mirroring the practice module's revealed-answer safety pattern (Section 7, below)
  }
```

### Design principles (reusing, not reinventing, PR #131–#133's conventions)

- **RAG v2 reuse, not a second retrieval path.** Exactly like the existing `practice` context (`lib/ai/practice-context.ts`'s `formatPracticeContextForPrompt`), a new `formatPracticeLabContextForPrompt()`-style formatter would turn this context into a prompt section, and `retrieveCourseContext()` (`lib/ai/retrieve-course-context.ts`, unchanged) would still be the single retrieval entry point, called with `relatedLessonSlugs` from the exercise metadata — identical integration shape to the practice-question path, just a new formatter, not new retrieval machinery.
- **Hint-vs-answer safety, mirroring AI-TUTOR-FR-021.** The practice-question module's structural guarantee (never send `correctAnswer`/`explanation` unless `revealed === true`) has a direct Practice Lab analogue: the AI Tutor should be able to give a *hint* ("check whether your WHERE clause is filtering the column you think it is") without being handed the exercise's literal expected-command/SQL string by default. Concretely: the context payload should **not** include the exercise's `expectedCommands`/`expectedSqlPatterns` at all (mirroring "omit the data, don't just instruct the model not to say it") — only `taskInstruction`, what the learner actually typed, and what came back (simulated output or error). This lets the AI Tutor reason about *why* something didn't match without being able to simply hand back the answer key. A `hintRequested: true` flag (set only when the learner clicks an explicit "Hint" affordance, exactly like Practice's explicit "Reveal answer" click) can allow a more direct hint than an unprompted explanation would give — same asymmetry the practice module already uses.
- **Explaining output/errors.** Because `simulatedOutput`/`errorMessage` are already friendly, structured text (Section 6) rather than raw system output, the AI Tutor's job is to *elaborate* on them in context, not to interpret hostile/unstructured data — this is a meaningfully easier grounding problem than free-form real-terminal output would be, and another reason a simulator (not a real terminal) is the right MVP choice.
- **Never claiming real-system connection.** The Practice Lab's own system-prompt section (appended alongside the existing course-context section, not replacing it) must explicitly state that the current command/query is running in a simulated lab, not a real IBM i system — reinforcing, in this specific context, the same guarantee already in the AI Tutor's base system prompt.
- **Related lesson links keep working.** `relatedLessonSlugs` flows through to the existing Sources UI (PR #132) unchanged — a Practice Lab exercise's AI Tutor response can surface "Sources used" / related lesson links exactly like a lesson or practice-question conversation does today, no new UI component needed for that part.

### What AI Tutor should be able to do here
- Explain what a simulated screen/result table is showing.
- Explain why a command/query didn't match what the exercise expected (without simply stating the expected command/query verbatim, per the hint-safety principle above).
- Give a progressively more direct hint when explicitly asked, without ever handing over the literal answer key unless the learner has effectively already solved it (mirroring "after reveal" behavior).
- Link back to the related lesson(s) for the current exercise.
- Use RAG v2 retrieval exactly as today, with `relatedLessonSlugs` from the exercise as the boost input (identical mechanism to `sourceType: 'practice'`).
- Explicitly avoid claiming it is connected to, or executing against, a real IBM i system.

---

## 8. UX Proposal

### Proposed routes (design only — **not created in this PR**)

- `/practice-lab` — landing page: what the Practice Lab is (with explicit "this is a simulator, not a real system" framing), choose 5250 Command Practice or SQL Console.
- `/practice-lab/5250` — 5250 Command Practice exercise list.
- `/practice-lab/sql` — SQL Console exercise list.
- `/practice-lab/5250/[exerciseSlug]` — a single 5250 exercise workspace.
- `/practice-lab/sql/[exerciseSlug]` — a single SQL exercise workspace.

### Navigation flow
1. Learner lands on `/practice-lab` (likely linked from the Learning Center/dashboard nav, exact placement a Product Owner decision — Section 15) and sees a short explanation plus two module cards (5250 Command Practice, SQL Console).
2. Selecting a module goes to its exercise list (`/practice-lab/5250` or `/practice-lab/sql`), showing all exercises with a completion indicator (visual only in MVP — see Section 15 on whether this should tie into any persisted progress).
3. Selecting an exercise opens its workspace (`/practice-lab/5250/[slug]` or `/practice-lab/sql/[slug]`).
4. From the workspace, the AI Tutor is available via the **existing embedded panel** (`AiTutorPanelProvider` / `EmbeddedAiTutorPanel`, PR #128/#129) — not a new, separate chat UI — with its context seeded to `sourceType: 'practice-lab'` for the current exercise (Section 7), exactly like the lesson page and Practice page already seed `sourceType: 'lesson'` / `'practice'` today.

### Desktop layout
Three logical regions, deliberately similar in spirit to the lesson reader's existing `260px sidebar / content / (optional) AI Tutor panel` three-column shape (`components/lesson-reader-layout.tsx`), reusing that same established pattern rather than inventing a new one:
- **Instruction/task panel** (left or top-left) — exercise title, learning objective, task instruction, hint affordance.
- **Simulator workspace** (center, largest region) — the 5250 green-screen or SQL editor+results, per module.
- **AI Tutor panel** (right, when opened) — the existing embedded panel, unchanged, reflowing the workspace exactly as it already does on lesson pages (PR #129's content-shift behavior).

### Mobile layout
- **Stacked layout**, not a cramped three-column squeeze: instruction text above the simulator workspace, in normal document flow — matching the general mobile pattern already used elsewhere in this app (e.g. the lesson sidebar collapsing below `lg`).
- **AI Tutor as the existing full-screen sheet** (PR #129), not a new mobile chat surface — full reuse, zero new mobile chat code.
- **Avoid a tiny, unusable terminal on narrow screens**: the 5250 workspace's command line and simulated screen should reflow to full width with a readable (not shrunk-to-fit) monospace size; if a screen genuinely cannot render legibly at a given width, prefer horizontal scroll *within the simulated screen's own bounded box* (similar to how a wide code block scrolls) over shrinking text below a legible size. Exact minimum supported width is an implementation-time decision, not fixed here.

---

## 9. 5250 UI Realism

### Recommend ("realistic enough for learning")
- Green-screen-inspired styling (dark background, light/green monospace text) — enough to *feel* like a 5250 session at a glance.
- Monospace font throughout the simulated screen area.
- A single command input line, styled distinctly from the "screen" output above it (matching the real mental model: you type on one line, the screen above is the system's response).
- Function key labels shown where genuinely useful for the MVP exercise set (e.g. `F4=Prompt`, `F3=Exit`, `F12=Cancel`) — only the handful actually wired to something in a given exercise, not an exhaustive `F1`–`F24` bar.
- A status/message area (mirroring the real 5250 bottom message line) for both success confirmations and friendly errors.
- Simulated output rendered as clean, readable tables/lists — legible over pixel-perfect authenticity.

### Explicitly avoid
- Full TN5250E protocol implementation or any real terminal/session emulation.
- Exact keyboard mapping (real AID key codes, exact cursor/field navigation via arrow keys mimicking a physical 5250 keyboard).
- Every function key's real behavior — only the small, curated subset each exercise actually needs.
- Exact ACS/IBM i Access Client Solutions visual replication.
- Any real sign-on, session, or security complexity (no fake "password" prompt, no session timeout modeling) — the lab is already "signed on" as a fixed simulated user for the whole experience.

---

## 10. SQL Console UI Realism

### Recommend (ACS-inspired, not ACS clone)
- A SQL editor pane (plain textarea or a lightweight code-editor component — exact choice an implementation-time decision, default to plain textarea to avoid a new dependency per Section 12's constraints).
- A clearly-labeled **Run** button (or a keyboard shortcut mirroring ACS's own, e.g. a "Run" affordance styled similarly, without claiming exact parity).
- A result grid for successful queries.
- A messages/errors pane, separate from the result grid (matching ACS's own separation of "Result Set" and "Job Log"/messages), so a learner learns to associate errors with a distinct panel rather than an inline popup.
- A small sample-schema panel (the fixed `EMPLOYEE`/`DEPARTMENT`/`ORDERS` tables and their columns) so learners don't have to memorize column names from the exercise text alone.
- Exercise instructions, in the same instruction/task panel described in Section 8.
- AI Tutor help, via the same existing embedded panel (Section 7/8) — no separate SQL-specific chat UI.

### Explicitly avoid
- Full ACS feature replication (no script history, no multiple result-set tabs, no export-to-Excel, no visual explain/index-advisor tooling).
- Any real connection management UI (no "choose a system," no connection profile list) — there is exactly one fixed simulated schema, always available, no connection concept at all.
- Schema-browser complexity (no expandable tree of every table/index/trigger) — a flat, small panel listing the fixed sample tables is sufficient for an MVP with three tables.
- Any real IBM i credential fields anywhere in this UI.
- Any real production/live database connection — the sample schema lives in application code/config (Section 11), never a real Db2 for i connection.

---

## 11. Data/Content Model Proposal

Proposed file structure (**none of these are created in this PR** — design only):

```
content/labs/5250/*.ts          # 5250 exercise metadata + fixed simulated state, one module per exercise or one indexed file
content/labs/sql/*.ts           # SQL exercise metadata + the shared sample schema/data
lib/labs/5250-simulator.ts      # command dispatch table + normalization + fallback-message logic (Section 6, Option B)
lib/labs/sql-simulator.ts       # expectedSqlPatterns matching + common-mistake detection + fallback logic (Section 6, Option D)
components/practice-lab/*       # shared presentational components: instruction panel, simulated-screen renderer, SQL editor+grid, exercise list card, etc.
```

`.ts` (not `.md`) is recommended for exercise content, consistent with `content/practice/questions.ts`'s existing precedent (a plain typed array, not markdown) — Practice Lab exercises are structured data (expected commands, simulated screens) more than prose, unlike lessons (`content/lessons/*.md`), which are genuinely prose-shaped.

### Proposed exercise metadata shape

```typescript
// Illustrative shape -- exact fields to be finalized in the PR #136/#137 implementation proposals, not this PR.

interface PracticeLabExercise {
  id: string
  slug: string
  title: string
  labType: '5250' | 'sql'
  difficulty: 'beginner' | 'intermediate'
  learningObjectives: string[]
  relatedLessonSlugs: string[]
  initialScreen: string            // 5250: the screen shown before any input; SQL: the instruction/starter text
  instructions: string
  expectedCommands?: string[]      // 5250 only -- normalized, parameter-order-tolerant accepted forms
  expectedSqlPatterns?: SqlPattern[] // SQL only -- see Section 6's Option D shape
  hints: string[]                  // progressively more direct, surfaced one at a time on repeated "Hint" clicks
  simulatedOutputs: Record<string, SimulatedScreen | SimulatedResultTable>  // keyed by which accepted input variant produced them, plus named "common mistake" keys
  successCriteria: string          // human-readable, also usable as the completion-check description in QA
}
```

This is intentionally a **content shape proposal**, not a final interface — the implementation PRs (Section 13) should treat this as a starting point to refine against real exercise content, the same way `content/practice/questions.ts`'s `PracticeQuestion` interface evolved through actual content batches rather than being frozen upfront.

---

## 12. Safety and Constraints

- **No real IBM i connection in MVP**, or in any phase currently proposed (Section 6 explicitly rejects Option E for all phases, not just MVP).
- **No credential handling** — no username/password/connection-profile fields anywhere in this feature.
- **No production command execution** — every 5250 "command" is dispatched to a fixed, hardcoded handler over fabricated in-memory state; there is no code path that could reach a real system even by misconfiguration, because no such code path is ever written.
- **No arbitrary system command execution** — the 5250 dispatch table (Section 6) is a finite, explicit set; anything not in it is a friendly fallback message, never a passthrough to any shell/OS command.
- **No unrestricted SQL execution** — the SQL module validates *shape* against known patterns (Section 6, Option D); it does not execute learner-supplied SQL against any real database, including the app's own Supabase database. The sample schema is not a real, queryable database at all in the recommended MVP approach.
- **No user-generated code execution against real systems** — true by construction, per the above; also true against the app's *own* infrastructure (no `eval`, no dynamic SQL execution against Supabase from learner input).
- **Clear UI copy that this is a simulator** — every entry point (`/practice-lab` landing page, both module landing pages, and ideally a small persistent label in the workspace itself) should state plainly that this is a learning simulator, not a connection to a real IBM i system — mirroring the AI Tutor's own existing honesty commitment (Section 1).
- **Avoid IBM trademark confusion** — consistent use of "5250-style" and "ACS-style"/"ACS-inspired" throughout all UI copy and code comments, never unqualified "5250 emulator," "IBM i emulator," or "ACS," per Section 1.

---

## 13. Implementation Roadmap

Phased, small, reviewable PRs — matching this platform's established one-PR-per-scoped-slice pattern (e.g. the RAG v2 sequence PR #130→#133):

- **PR #135 — Practice Lab Design Spec / Routing Skeleton.** Finalize the exercise metadata shape (Section 11) against a first real exercise or two; add the route skeleton (`/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql`, dynamic `[exerciseSlug]` routes) with placeholder/"coming soon" content — no simulator logic yet. Confirms routing, auth-gating (matching existing protected-route conventions), and navigation entry points before any simulator engineering begins.
- **PR #136 — 5250 Command Practice MVP.** Implement `lib/labs/5250-simulator.ts` (Option B engine) and the 10 exercises from Section 4, with the green-screen-inspired UI (Section 9). No AI Tutor integration yet (stub/deferred) — validate the simulator and UI first, in isolation.
- **PR #137 — SQL Practice Console MVP.** Implement `lib/labs/sql-simulator.ts` (Option D engine) and the 10 exercises from Section 5, with the ACS-inspired UI (Section 10). Same deferred-AI-Tutor scoping as PR #136.
- **PR #138 — Practice Lab AI Tutor Integration.** Add the `sourceType: 'practice-lab'` context (Section 7), the new prompt formatter, and wire the existing embedded panel into both modules' workspaces. This is deliberately sequenced *after* both simulators exist and are stable, so the AI Tutor integration has real `simulatedOutput`/`errorMessage` shapes to design against rather than speculative ones.
- **PR #139 — Practice Lab QA / Content Expansion.** A regression pass (mirroring PR #133's approach — lightweight scripts over a new framework) for the simulator dispatch/pattern-matching logic, plus any additional exercises beyond the initial 10+10 the Product Owner wants before a wider rollout.

Each PR should stay scoped to its own module/layer, matching this proposal's own module boundaries — the same discipline the RAG v2 sequence used (design → retrieval → UI polish → QA).

---

## 14. Acceptance Criteria for Future MVP

For the implementation PRs (Section 13) to eventually satisfy, not required to be true of this design-only PR:

- [ ] Learner opens Practice Lab (`/practice-lab`) and sees a clear "this is a simulator" framing plus two module choices.
- [ ] Learner selects 5250 Command Practice and sees the exercise list.
- [ ] Learner completes the `WRKOBJ` guided exercise (types the expected command, sees the predefined simulated object list).
- [ ] Learner types an unsupported/unrecognized command and receives a friendly "not available in this lab yet" response, never a crash or blank screen.
- [ ] Learner asks the AI Tutor for help on the current screen/task and receives a contextual response referencing the current exercise, not a generic answer.
- [ ] Learner opens SQL Console and sees its exercise list.
- [ ] Learner runs the SELECT-all-rows exercise and sees the correct result table.
- [ ] Learner types invalid SQL (e.g. a misspelled column) and sees a friendly, explained error rather than a raw driver error.
- [ ] AI Tutor explains a SQL error using the current exercise's context (task instruction + typed query + error message), without simply stating the corrected SQL unless a hint was explicitly requested.
- [ ] Related lesson links from a Practice Lab exercise's AI Tutor response navigate to the correct, real, Published lesson.
- [ ] Mobile layout remains usable: stacked instruction/workspace, AI Tutor as the existing full-screen sheet, no unreadable shrunk terminal text.
- [ ] No real IBM i (or real Supabase-backed) system connection exists anywhere in the feature — confirmed by code review, not just UI copy.
- [ ] Protected route behavior is unchanged: Practice Lab routes are gated the same way other authenticated-only routes are today, with no new auth/session mechanism introduced.

---

## 15. Product Owner Decisions Needed Before Implementation

- **Navigation placement:** where does `/practice-lab` get linked from — main nav, dashboard, `/practice` page, or all three? Not decided in this proposal.
- **Progress tracking:** should Practice Lab exercise completion tie into any existing progress/Mark Complete concept, or remain purely session-local (no persistence) for the MVP? This proposal takes no position — persistence of any kind (even just "which exercises has this learner completed") would need its own Supabase schema discussion, explicitly out of scope for this PR's constraints.
- **Exercise breadth for launch:** is 10+10 exercises (Sections 4–5) sufficient for a first release, or should the Product Owner want a larger initial set before this reaches learners?
- **The `GROUP BY`/aggregate lesson content gap** (Section 5, Exercise 6): should a lesson be commissioned to cover this before or alongside the SQL Console shipping, so Exercise 6 has a real `relatedLessonSlugs` target rather than none?
- **Option C (embedded SQL engine) re-evaluation timing:** confirm the recommended Option D (pattern-matching, no new dependency) is acceptable for the MVP, or whether the Product Owner would rather approve a small WASM SQL engine dependency now for more realistic query execution/error text from the start.
- **`INSERT`/`UPDATE` simulated-mode copy:** confirm the proposed "N row(s) would be affected (simulated -- no data was changed)" framing (Section 5, Exercises 8–9) is the right tone, versus e.g. a more playful or more clinical alternative.
- **Standalone vs. embedded-only AI Tutor access from the lab:** confirm the recommendation to reuse the existing embedded panel exclusively (no new lab-specific chat surface) rather than, e.g., a permanently-docked (non-collapsible) AI Tutor pane specific to Practice Lab.

---

## Validation Results

This PR is documentation-only. The following was run to confirm nothing else changed:

- `npm run seed` — 288 succeeded, 0 failed (unchanged)
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — clean

## Manual QA

- `git status` shows only `planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md` added
- `/learn` loads correctly, still shows 288 lessons published
- `/practice` still loads (gated, unchanged)
- `/ai-tutor` still opens/gates as before, unchanged
- Embedded AI Tutor panel still works (no code touched)
- `/dashboard` still loads (gated, unchanged)
- Protected lesson gating unchanged (no code touched)
- No lesson URLs changed (no code touched)
