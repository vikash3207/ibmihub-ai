# IBM i / AS400 Curriculum Expansion Blueprint

## Document Metadata

| Field | Value |
|---|---|
| Title | IBM i / AS400 Curriculum Expansion Blueprint |
| Status | **Draft — Pending Product Owner Review** (not an approved spec; no lesson content or code should be produced from this document until reviewed) |
| Version | 0.1 |
| Owner | Product + Content |
| Depends on / Interacts with | Spec 009 (Content Governance — Approved, single-path model), Spec 002 (Learning Center), Spec 003 (Lesson Experience), Spec 006 (Progress Tracking) |
| Scope of this document | Planning only. No lesson Markdown files, no metadata schema migration, no spec edits are performed as part of this document. |

---

## 0. Why This Document Exists, and a Governance Note Up Front

IBMiHub AI shipped with a single, approved 12-lesson "IBM i Fundamentals" path (Spec 009: Content Governance, Approved v1.0). That spec was deliberately narrow for MVP: one learning path, one status field, a fixed lesson sequence. It was the right scope to launch with, and it is not enough to make IBMiHub AI "a serious beginner-to-advanced learning platform."

This document proposes what a comprehensive IBM i / AS400 curriculum should look like — tracks, modules, lesson templates, a richer metadata model, a quality bar, and a phased rollout. **It does not implement any of it.**

**Important governance callout:** Spec 009 in its current Approved form assumes exactly one learning path and a single status field with no track/module/difficulty dimensions. Spec 002 (Learning Center) and Spec 006 (Progress Tracking) were written against that same single-path assumption (e.g., Spec 006's progress denominator is "published lesson count," singular). **Acting on this blueprint will require a revision to Spec 009 (and likely amendments to Specs 002 and 006) before any multi-track lesson content is produced or coded against.** That revision is intentionally not done here — it should happen only after this blueprint itself is reviewed and the track/phase structure is agreed, so the spec revision reflects a settled plan rather than a moving target. Treat "revise Spec 009" as the first concrete next step after this document is approved, not a side effect of it.

---

## 1. Executive Summary

- Propose **16 top-level learning tracks** (Section 2), expanding from the user's example list of 14 by splitting RPGLE into three explicit difficulty tiers and giving SQL for IBM i its own dedicated track (both changes explained in Section 2.0).
- Propose **4 release phases** growing from 50–60 lessons to a 400–500+ lesson academy (Section 3).
- Propose an **expanded lesson template** (Section 4) that keeps everything Spec 009's current template already requires and adds the new sections this task calls for (beginner example, real-world example, advanced notes, debugging/support angle, interview/scenario question, multiple AI Tutor prompts, related lessons).
- Propose an **expanded metadata model** (Section 5) that adds track/module/difficulty/tags/prerequisites to the existing Spec 009 metadata fields, without breaking anything currently published.
- Propose a **quality bar** (Section 6) that extends Spec 009 Section 12's checklist with checks specific to multi-track, multi-level content.
- Recommend the **first 50 lessons** to build (Section 7), chosen to make IBMiHub AI genuinely useful to a beginner on day one, not just a proof of concept.
- Section 8 explicitly maps the **existing 12 lessons** onto the new structure — nothing already written is wasted or thrown away.

---

## 2. Top-Level Learning Tracks

### 2.0 Differences from the requested example list

The request's example list had 14 tracks. This blueprint proposes 16, with two deliberate changes:

1. **RPGLE is split into three tracks (Beginner / Intermediate / Advanced)** instead of two. RPGLE is the single largest domain in this curriculum and the one most job-relevant skill for the target audience; collapsing "intermediate" into either Beginner or Advanced would make one of those two tracks unreasonably large and hard to gate by prerequisite.
2. **SQL for IBM i is its own track**, not folded into "Db2 for i, DDS, Physical Files, Logical Files." The content principles explicitly call for "native I/O and SQL examples where relevant" — SQL is a distinct skill (embedded SQL, interactive SQL, SQL vs. native I/O tradeoffs) that working developers increasingly need as a first-class subject, not a footnote inside the DDS/file track.

Everything else follows the requested list closely.

### 2.1 Track Summary Table

| # | Track | Difficulty Span | Phase Introduced | Priority |
|---|---|---|---|---|
| 1 | IBM i Foundations | Beginner | Phase 1 | Highest |
| 2 | 5250 Terminal and Core Commands | Beginner → Intermediate | Phase 1 | Highest |
| 3 | Libraries, Objects, and the IFS | Beginner → Intermediate | Phase 1 | Highest |
| 4 | Db2 for i, DDS, Physical Files, and Logical Files | Beginner → Intermediate | Phase 1 | Highest |
| 5 | RPGLE Beginner | Beginner | Phase 1 | Highest |
| 6 | RPGLE Intermediate | Intermediate | Phase 2 | High |
| 7 | RPGLE Advanced | Advanced | Phase 3 | Medium |
| 8 | CLLE (Control Language Programming) | Beginner → Advanced | Phase 1 (intro) → Phase 2 (full) | High |
| 9 | Display Files and Subfiles | Beginner → Advanced | Phase 1 (intro) → Phase 2 (full) | High |
| 10 | Printer Files and Reports | Beginner → Intermediate | Phase 2 | Medium |
| 11 | SQL for IBM i | Beginner → Advanced | Phase 2 | High |
| 12 | Debugging, Job Logs, and Problem Diagnosis | Beginner → Advanced | Phase 1 (intro) → Phase 2/3 (full) | Highest |
| 13 | IBM i Operations for Developers | Beginner → Intermediate | Phase 1 (intro) → Phase 2 (full) | High |
| 14 | Integration and Modernization | Intermediate → Advanced | Phase 3 | Medium |
| 15 | Real-World Projects | Intermediate → Advanced | Phase 2 (first projects) → Phase 4 (full library) | Medium-High |
| 16 | Interview and Professional Readiness | All levels | Phase 1 (intro) → Phase 3/4 (full bank) | High |

### 2.2 Track Details

Each track below lists: goal, target audience, prerequisites, modules with representative lesson titles (Phase 1–2 depth is titled individually; Phase 3–4 depth is described at the topic/module level rather than fully titled — see the note in Section 3 on why), difficulty classification, example types, and priority.

---

#### Track 1 — IBM i Foundations

**Goal:** Give absolute beginners a correct, durable mental model of what IBM i is, where it came from, and how its pieces fit together, before any hands-on skill track begins.
**Audience:** absolute beginners, career changers, students, non-technical stakeholders needing orientation.
**Prerequisites:** none.
**Difficulty:** Beginner only.
**Priority:** Highest (Phase 1 opening track).

Modules:
- **M1: What IBM i Is** — history and lineage (AS/400 → iSeries → System i → IBM i), IBM Power Systems vs. IBM i, the "integrated platform" philosophy, common myths debunked ("it's dead," "it's just a database," "green screen means outdated").
- **M2: Why IBM i Still Matters** — industries and company types that rely on it, why replacement is slow and deliberate, IBM i in the news/industry today.
- **M3: The Big Picture Map** — a guided tour of the pieces every other track goes deep on (objects/libraries, 5250, Db2 for i, RPGLE, CLLE, job logs) — deliberately shallow here; depth lives in the dedicated tracks.
- **M4: Learning Paths and Career Orientation** — what a junior IBM i developer's day looks like, common job titles, how the rest of this curriculum is organized, how to use the AI Tutor effectively.
- **M5: Where to Go Next** — capstone lesson pointing into Tracks 2–5 based on the learner's stated goal (mirrors today's onboarding "which best describes you" answers).

Example types: analogies to general computing concepts, timelines, "myth vs. fact" call-outs, a visual map of platform pieces (described in prose, since lessons are Markdown-only per Spec 003).
Estimated lesson count: ~8 (Phase 1).

---

#### Track 2 — 5250 Terminal and Core Commands

**Goal:** Make a beginner genuinely comfortable navigating a 5250 session and running common commands, not just knowing what a green screen is.
**Audience:** absolute beginners, junior developers, support staff who need to navigate IBM i day-to-day.
**Prerequisites:** Track 1 (What is IBM i?, Big Picture Map).
**Difficulty:** Beginner → Intermediate.
**Priority:** Highest (Phase 1).

Modules:
- **M1: 5250 Basics** — what a session is, emulator software, "green screen" nickname, function keys, menus.
- **M2: Navigating Menus and Command Entry** — command line, prompting (F4), message lines, common navigation function keys (F3, F12, F9, F1).
- **M3: Core Commands for Developers** — WRKACTJOB, WRKOBJ, WRKLIB, DSPLIB, WRKSPLF, WRKUSRJOB, WRKSYSSTS at a beginner-appropriate level (what they show and why you'd use them, not full parameter mastery).
- **M4: System Values and Signing On** — user profiles, sign-on basics, current library, library list basics (bridges into Track 3).
- **M5 (Intermediate): Command Parameters and Prompting Efficiently** — using F4 prompting effectively, command abbreviations, F9 retrieve, building comfort with unfamiliar commands.

Example types: step-by-step "you type this, you see that" walkthroughs (described in prose), common command cheat-sheets, "what does this screen mean" interpretation exercises.
Estimated lesson count: ~6 (Phase 1) → ~10 by Phase 2.

---

#### Track 3 — Libraries, Objects, and the IFS

**Goal:** Build a working understanding of how IBM i organizes everything (objects, libraries, library lists) and how the Integrated File System (IFS) relates to and differs from that model.
**Audience:** beginners, junior developers, developers coming from other platforms who assume a folder/filesystem mental model.
**Prerequisites:** Track 1; helpful to pair with Track 2.
**Difficulty:** Beginner → Intermediate.
**Priority:** Highest (Phase 1).

Modules:
- **M1: Objects and Libraries** — what an object is, library as a flat container, library list and search order (existing Lesson 4 seeds this module).
- **M2: Common Object Types** — *PGM, *FILE, *DTAARA, *MSGF, *SRVPGM (conceptual introduction, not full technical reference).
- **M3: The IFS** — what the IFS is, how it differs from the library-based file system, why both exist side by side, common IFS use cases (config files, logs, integration payloads).
- **M4 (Intermediate): Authority and Object Security Basics** — *PUBLIC authority, object vs. IFS-style permissions, why this matters for developers (not a full security-track deep dive — that's a Phase 4 topic under Track 13).
- **M5 (Intermediate): Working with Libraries and Objects Day to Day** — creating/copying/moving objects, common developer object-management tasks and mistakes.

Example types: side-by-side library-vs-folder comparisons, object type reference tables, common "object not found" / library-list troubleshooting scenarios.
Estimated lesson count: ~6 (Phase 1) → ~12 by Phase 2.

---

#### Track 4 — Db2 for i, DDS, Physical Files, and Logical Files

**Goal:** Build a solid data-layer foundation: how data is physically stored, how DDS defines it, and how logical files provide views, before SQL (Track 11) or RPGLE I/O (Track 5) build on top of it.
**Audience:** beginners, junior developers, developers who only know SQL-first databases and need the DDS/native model explained.
**Prerequisites:** Track 3 (objects/libraries).
**Difficulty:** Beginner → Intermediate.
**Priority:** Highest (Phase 1).

Modules:
- **M1: Physical and Logical Files** — records/fields, keyed access, logical files as views, no-duplication principle (existing Lesson 6 seeds this).
- **M2: Db2 for i** — the integrated relational database, tables/rows/columns vs. records/fields terminology mapping (existing Lesson 9 seeds this).
- **M3: DDS Fundamentals** — writing basic DDS for a physical file, field definitions, key fields, basic keywords (beginner-appropriate subset).
- **M4: DDS for Logical Files** — building a logical file over an existing physical file, select/omit basics.
- **M5 (Intermediate): Referential Integrity and Data Design Basics** — primary/foreign key concepts on IBM i, why data design decisions matter for RPG programs later.
- **M6 (Intermediate): Journaling Basics for Developers** — what journaling is, why it exists, what a developer needs to know (not an operations-level deep dive).

Example types: annotated DDS source examples, "physical vs. logical" worked comparisons, a running example dataset reused across this track's lessons for continuity.
Estimated lesson count: ~7 (Phase 1) → ~13 by Phase 2.

---

#### Track 5 — RPGLE Beginner

**Goal:** Take a learner from zero RPG knowledge to writing and understanding a simple, complete free-format RPGLE program that reads and processes data.
**Audience:** absolute beginners to programming or to RPG specifically; junior developers starting their first IBM i job.
**Prerequisites:** Tracks 3 and 4.
**Difficulty:** Beginner only.
**Priority:** Highest (Phase 1).

Modules:
- **M1: What RPGLE Is** — history (Report Program Generator → modern RPGLE), fixed-format vs. free-format, why both still exist (existing Lesson 7 seeds this).
- **M2: Free-Format RPGLE Basics** — program structure, **ctl-opt**, **dcl-s**, basic data types, comments.
- **M3: Basic Program Flow** — if/else, dow/dou, select/when, basic operators.
- **M4: Native File I/O Basics** — declaring a file with **dcl-f**, read/chain/write/update basics, indicators vs. modern status checking.
- **M5: Building a First Complete Program** — a small, original, end-to-end program (e.g., read a file, apply a simple rule, write output) tying M1–M4 together.
- **M6: Common Beginner Mistakes** — off-by-one logic errors, forgetting to close/handle end-of-file, indicator confusion, compile error basics.

Example types: fully worked original code samples (free-format, IBMiHub-authored, not copied), "spot the bug" exercises, incremental build-up of one running example program across the track.
Estimated lesson count: ~10 (Phase 1).

---

#### Track 6 — RPGLE Intermediate

**Goal:** Build real job-ready RPGLE skill — subprocedures, more complete I/O patterns, embedded SQL basics, and structured error handling.
**Audience:** junior developers who finished Track 5; working developers formalizing self-taught knowledge.
**Prerequisites:** Track 5; Track 11 (SQL for IBM i) recommended in parallel.
**Difficulty:** Intermediate.
**Priority:** High (Phase 2).

Modules:
- **M1: Subprocedures and Local Scope** — defining and calling subprocedures, parameters, return values, why they replace older subroutine patterns.
- **M2: Data Structures in Depth** — qualified data structures, arrays, multiple-occurrence considerations (conceptual, since MODS is legacy-leaning).
- **M3: Embedded SQL in RPGLE** — basic SELECT/INSERT/UPDATE embedded in a program, host variables, SQLCODE/SQLSTATE basics (bridges to Track 11).
- **M4: Error Handling** — monitor, %error, on-error, designing a program that fails gracefully instead of abending.
- **M5: Working with Multiple Files** — join logic in RPG vs. join logic in SQL, choosing native I/O vs. embedded SQL.
- **M6: Intermediate Debugging Habits** — reading a compile listing, common runtime error patterns, using debug output effectively (bridges to Track 12).

Example types: refactoring exercises (subroutine → subprocedure), before/after error-handling examples, small multi-file programs.
Estimated lesson count: ~12 (Phase 2).

---

#### Track 7 — RPGLE Advanced

**Goal:** Reach professional-level RPGLE: ILE architecture, service programs, performance-aware coding, and patterns used in real production shops.
**Audience:** working RPGLE developers, developers preparing for senior roles, developers modernizing legacy code.
**Prerequisites:** Track 6.
**Difficulty:** Advanced.
**Priority:** Medium (Phase 3).

Modules:
- **M1: ILE Architecture Deep Dive** — modules, binding, service programs, activation groups (conceptual + practical).
- **M2: Building and Using Service Programs** — designing a reusable service program, binder language basics, versioning considerations.
- **M3: Advanced SQL-in-RPG Patterns** — cursors, result sets, dynamic SQL basics, performance-aware query design.
- **M4: Performance-Aware RPGLE** — common performance pitfalls, array vs. file lookups, understanding when native I/O beats SQL and vice versa.
- **M5: Legacy Code Literacy** — reading and safely modernizing fixed-format RPG III/RPG400 code without rewriting it wholesale (critical for the "legacy AS/400 → modern practices" audience).
- **M6: Advanced Error Handling and Resilience** — designing for support teams, meaningful error messages, defensive coding patterns.

Example types: annotated legacy-to-modern refactors, service-program design walkthroughs, performance before/after comparisons (described conceptually — no live system access, so framed as "why this would be faster" reasoning, not measured benchmarks).
Estimated lesson count: ~20 (Phase 3).

---

#### Track 8 — CLLE (Control Language Programming)

**Goal:** Take a learner from "what is CLLE" to writing real control/orchestration programs used in production job scheduling and automation.
**Audience:** junior developers, operations-adjacent developers, support developers who script routine tasks.
**Prerequisites:** Track 2 (commands); Track 5 recommended before CLLE's advanced module (CL programs commonly call RPG programs).
**Difficulty:** Beginner → Advanced (single track spanning all three, per the request's example list).
**Priority:** High.

Modules:
- **M1: What CLLE Is** — CLLE vs. RPGLE roles, orchestration vs. business logic (existing Lesson 8 seeds this). *(Phase 1)*
- **M2: Basic CL Programs** — parameters, variables, basic commands in a program, simple conditional logic. *(Phase 1)*
- **M3: Calling Programs and Checking Results** — CALL, return codes, MONMSG basics. *(Phase 2)*
- **M4: Looping and Control Flow in CL** — DOWHILE/DOFOR equivalents, structured CL patterns. *(Phase 2)*
- **M5: Job Scheduling and Automation Patterns** — the "nightly process" pattern (coordinating an RPG program, checking success, producing a report), tying to Track 12 (job logs). *(Phase 2)*
- **M6 (Advanced): Robust CL for Production** — comprehensive error handling, escape messages, designing CL that support teams can trust. *(Phase 3)*

Example types: full annotated CL program listings, "what happens if this step fails" scenario walkthroughs, a running nightly-batch example reused across the track.
Estimated lesson count: ~6 (Phase 1 intro) → ~12 (Phase 2 full) → ~16 (Phase 3 advanced).

---

#### Track 9 — Display Files and Subfiles

**Goal:** Teach interactive 5250 application development — from a single-record display file to a working subfile-based list-and-detail screen.
**Audience:** junior-to-working RPGLE developers building or maintaining interactive applications.
**Prerequisites:** Track 5; Track 2 (5250 navigation) helps learners understand what they're building toward.
**Difficulty:** Beginner → Advanced.
**Priority:** High.

Modules:
- **M1: Display File Basics** — what a display file is, DDS for a simple single-record screen, record formats. *(Phase 1)*
- **M2: Handling User Input** — input-capable fields, basic validation, indicators for screen control. *(Phase 1)*
- **M3: Subfile Fundamentals** — what a subfile is, load/display cycle, page-at-a-time processing. *(Phase 2)*
- **M4: Subfile Interaction** — selecting a row, handling roll up/down, updating a subfile record. *(Phase 2)*
- **M5: Multi-Screen Applications** — menu-driven navigation between display files, passing data between programs/screens. *(Phase 2)*
- **M6 (Advanced): Modern Interactive Patterns** — window support, message subfiles, building a maintainable interactive application structure. *(Phase 3)*

Example types: full DDS + RPGLE pairs for one running example application (e.g., an "order lookup" screen evolved across the track), common subfile bugs (load cycle mistakes, RRN handling).
Estimated lesson count: ~5 (Phase 1 intro) → ~13 (Phase 2 full) → ~18 (Phase 3 advanced).

---

#### Track 10 — Printer Files and Reports

**Goal:** Teach how IBM i applications produce printed/report output, from a basic printer file to a well-formatted business report.
**Audience:** junior-to-working RPGLE developers.
**Prerequisites:** Track 5; Track 4 (data layer).
**Difficulty:** Beginner → Intermediate.
**Priority:** Medium (Phase 2).

Modules:
- **M1: Printer File Basics** — DDS for a printer file, basic layout, page headers/footers.
- **M2: Generating a Report from RPGLE** — writing to a printer file from a program, control breaks, totals.
- **M3: Spool File Management for Developers** — how generated reports relate to spool files (bridges to Track 12), common WRKSPLF developer tasks.
- **M4 (Intermediate): Advanced Report Formatting** — multi-level control breaks, conditional formatting, overflow handling.

Example types: full annotated printer-file + RPGLE pairs, a running "monthly sales report" example evolved across the track.
Estimated lesson count: ~8 (Phase 2).

---

#### Track 11 — SQL for IBM i

**Goal:** Build genuine SQL fluency on IBM i — interactive SQL, embedded SQL, and knowing when SQL is the better tool versus native I/O.
**Audience:** junior-to-working developers, developers from SQL-first backgrounds who need the IBM i-specific angle, developers preparing for modern IBM i roles.
**Prerequisites:** Track 4; pairs well with Track 6 for embedded SQL.
**Difficulty:** Beginner → Advanced.
**Priority:** High.

Modules:
- **M1: Interactive SQL Basics** — SELECT, WHERE, ORDER BY, running SQL via IBM i Access / ACS, mapping SQL terms to DDS/native terms learners already know. *(Phase 2)*
- **M2: Joins and Aggregation** — INNER/LEFT JOIN, GROUP BY, common reporting queries. *(Phase 2)*
- **M3: DDL on IBM i** — CREATE TABLE vs. DDS, when teams choose one over the other, migrating a DDS physical file to SQL-defined table conceptually. *(Phase 2)*
- **M4: Embedded SQL in RPGLE** — deeper pairing with Track 6 M3, host variables, error handling with SQLCODE. *(Phase 2/3)*
- **M5 (Advanced): Performance and Query Design** — indexes vs. logical files, understanding SQE/CQE conceptually, writing efficient queries for large IBM i tables. *(Phase 3)*
- **M6 (Advanced): SQL Stored Procedures and Functions on IBM i** — basic SQL PL, when to use a stored procedure vs. an RPG program. *(Phase 3)*

Example types: side-by-side SQL/native-I/O comparisons for the same task, annotated query examples against a consistent example schema, common SQL mistakes specific to IBM i (e.g., commitment control surprises, library/schema confusion).
Estimated lesson count: ~12 (Phase 2) → ~22 (Phase 3).

---

#### Track 12 — Debugging, Job Logs, and Problem Diagnosis

**Goal:** Build real troubleshooting competence — reading job logs, understanding spool files, and diagnosing why something failed.
**Audience:** all audiences, especially support/production developers; this track is explicitly called out as important for that persona.
**Prerequisites:** Track 1; deepens alongside Tracks 5–9 as programs get more complex.
**Difficulty:** Beginner → Advanced.
**Priority:** Highest — this is one of the most job-critical, most requested-by-persona tracks.

Modules:
- **M1: Job Logs and Spool Files Basics** — what each is, how they differ, why they matter for troubleshooting (existing Lesson 10 seeds this). *(Phase 1)*
- **M2: Reading a Job Log** — message severity, message IDs, tracing a failure back through a job log. *(Phase 1)*
- **M3: Common Runtime Errors** — the most frequent RPG/CL runtime error messages a beginner will hit, and what they actually mean. *(Phase 2)*
- **M4: Interactive Debugging Basics** — using STRDBG-style debugging conceptually, breakpoints, watching variables. *(Phase 2)*
- **M5: Diagnosing Data Problems** — distinguishing a logic bug from a data problem from an environment problem, systematic diagnosis habits. *(Phase 2/3)*
- **M6 (Advanced): Production Support Mindset** — triage under time pressure, what to check first, when to escalate, writing a good incident summary. *(Phase 3)*
- **M7 (Advanced): Performance Diagnosis Basics** — recognizing a performance problem vs. a correctness problem, where a developer would start looking (conceptual, not a full performance-tuning specialization).

Example types: original fabricated job-log excerpts (never real customer data, per the existing NFR Privacy rule), "what would you check first" scenario branches, a recurring "the report was wrong" mystery worked through step by step across the track.
Estimated lesson count: ~5 (Phase 1 intro) → ~12 (Phase 2) → ~20+ (Phase 3 advanced).

---

#### Track 13 — IBM i Operations for Developers

**Goal:** Give developers just enough operations literacy to work effectively with ops/sysadmin teams — not to train system administrators.
**Audience:** junior-to-working developers, developers moving from legacy AS/400 shops into more modern practices.
**Prerequisites:** Track 2; Track 3.
**Difficulty:** Beginner → Intermediate.
**Priority:** High.

Modules:
- **M1: The Basic Development Workflow** — source → compile → test → release, at a conceptual level (existing Lesson 11 seeds this). *(Phase 1)*
- **M2: Jobs, Subsystems, and Work Management Basics** — what a subsystem is, why work management exists, developer-relevant vocabulary only. *(Phase 1/2)*
- **M3: Save/Restore Concepts for Developers** — why backups matter to a developer, what SAVLIB/SAVOBJ conceptually do, why you don't casually delete production objects. *(Phase 2)*
- **M4: Change Management and Release Basics** — promoting code between environments (dev/test/production), why organizations gate this carefully. *(Phase 2)*
- **M5 (Intermediate): Security Basics Every Developer Should Know** — object authority, user profiles vs. group profiles, least-privilege thinking (a light version of what a full security specialization would cover). *(Phase 2)*
- **M6 (Advanced, Phase 4): Working with Ops and Sysadmin Teams** — how to write a good change request, how to reason about risk, how to communicate during an incident.

Example types: workflow diagrams described in prose, "who owns this decision" scenario questions, a running example of one change moving from a developer's desk to production.
Estimated lesson count: ~4 (Phase 1 intro) → ~10 (Phase 2 full) → ~16 (Phase 3/4 advanced).

---

#### Track 14 — Integration and Modernization

**Goal:** Show working developers how IBM i connects to the outside world — APIs, web services, and common modernization approaches — without pretending IBM i needs to be replaced to do this.
**Audience:** working developers, developers preparing for modernization-focused roles, developers moving from legacy-only practices.
**Prerequisites:** Track 6 (RPGLE Intermediate), Track 11 (SQL).
**Difficulty:** Intermediate → Advanced.
**Priority:** Medium (Phase 3).

Modules:
- **M1: Why and How IBM i Modernizes** — realistic modernization patterns (adding a web front end, not replacing the back end), correcting the "rip and replace" myth.
- **M2: Calling IBM i from the Outside World** — ODBC/JDBC concepts, IBM i Access/ACS, what a connection actually does under the hood.
- **M3: Exposing IBM i Data and Logic** — building a simple web service around an RPG program conceptually, JSON basics, calling RPG-generated data from a modern client.
- **M4: Open Access-Style Modernization of 5250 Screens** — the concept of separating display logic from business logic, why this matters for modernization (framed conceptually, not tied to one commercial product).
- **M5 (Advanced): Working Alongside Modern Languages** — how Node.js, Python, PHP, or Java commonly integrate with IBM i in real shops, division of responsibility between RPG/CL and modern glue code.
- **M6 (Advanced): DevOps and Source Control for IBM i** — Git-based RPG source management concepts, why this differs from traditional PDM-based workflows, CI/CD concepts applied to IBM i.

Example types: architecture-diagram-style prose walkthroughs, sample JSON payloads, "old way vs. new way" comparisons.
Estimated lesson count: ~20 (Phase 3) → ~28 by Phase 4.

---

#### Track 15 — Real-World Projects

**Goal:** Apply multiple tracks together in complete, original mini-projects that simulate real IBM i development work end to end.
**Audience:** junior-to-working developers who've completed the relevant prerequisite tracks for each project.
**Prerequisites:** varies per project; each project lesson states its own prerequisites explicitly.
**Difficulty:** Intermediate → Advanced.
**Priority:** Medium-High — this is what turns isolated skills into demonstrable competence, which matters most once the foundational tracks exist.

Representative projects (each spans several lessons — a build log, not a single lesson):
- **Project A: Order Lookup Application** — display file + subfile + physical/logical files (Tracks 4, 9). *(Phase 2)*
- **Project B: Nightly Batch Report** — CLLE orchestration + RPGLE processing + printer file (Tracks 5, 8, 10). *(Phase 2)*
- **Project C: Data Migration Utility** — reading legacy data, transforming it, writing to a new structure, with error handling (Tracks 6, 11). *(Phase 3)*
- **Project D: Simple Web-Exposed Report** — SQL query + basic JSON exposure concept (Tracks 11, 14). *(Phase 3)*
- **Project E: Legacy Modernization Exercise** — take a deliberately old-style fixed-format program and modernize it step by step (Tracks 7, 14). *(Phase 3/4)*
- Additional projects (Phase 4): inventory management mini-system, approval-workflow CL+RPG combo, a small service-program-based utility library, a debugging "murder mystery" project built entirely around Track 12 skills.

Example types: full build logs (requirements → design → code → test → common mistakes made along the way), explicitly framed as original, fictional scenarios.
Estimated lesson count: ~5 (Phase 2, first projects) → ~15 (Phase 3) → ~25+ (Phase 4).

---

#### Track 16 — Interview and Professional Readiness

**Goal:** Help learners translate curriculum knowledge into job readiness — interview performance, scenario reasoning, and professional communication.
**Audience:** all audiences, especially those explicitly preparing for interviews or a first IBM i role.
**Prerequisites:** none formally, but most value is realized after completing at least Tracks 1, 3, 4, 5.
**Difficulty:** spans all levels — questions are tagged by the difficulty of the track they draw from.
**Priority:** High — this is a strong differentiator and was explicitly named as a target persona.

Modules:
- **M1: How IBM i Interviews Work** — common interview formats, what interviewers actually assess, how to talk about self-taught or course-based knowledge credibly. *(Phase 1)*
- **M2: Conceptual Question Bank** — "explain the difference between X and Y" style questions drawn from Tracks 1–4 (physical vs. logical file, library vs. folder, job log vs. spool file, etc.). *(Phase 1/2)*
- **M3: Code-Reading and Scenario Questions** — "what does this code do," "what would you check first," "what's wrong with this program" exercises drawn from Tracks 5–9. *(Phase 2)*
- **M4: Whiteboard/Verbal Reasoning Practice** — practicing explaining a concept out loud in plain language, a core interview skill distinct from knowing the answer. *(Phase 2/3)*
- **M5 (Advanced): Senior-Level and Architecture Questions** — service program design tradeoffs, modernization judgment calls, performance reasoning, drawn from Tracks 7, 11, 14. *(Phase 3)*
- **M6: Career Path and Resume Framing** — how to describe IBM i skills to non-IBM i-familiar recruiters, portfolio project framing using Track 15 projects. *(Phase 3/4)*

Example types: Q&A pairs with model answers, "good answer vs. weak answer" comparisons, scenario-branch questions ("the report is wrong — walk me through your first three steps").
Estimated lesson count: ~3 (Phase 1 intro) → ~10 (Phase 2) → ~25 (Phase 3) → ~40+ (Phase 4, a genuinely large question bank).

---

## 3. Recommended Release Phases

A note on granularity: Phase 1 and Phase 2 content above is described down to individual lesson titles because that's the actionable near-term work. Phase 3 and Phase 4 are described at the module/topic level rather than fully titled lesson-by-lesson — inventing 300–500 exact lesson titles today would be premature (better decided once Phase 1–2 are live and real learner behavior/AI Tutor question logs inform what Phase 3+ actually needs) and would make this document far less usable as a working reference. This blueprint should be revisited and the Phase 3/4 module lists expanded into full lesson lists once Phase 2 ships.

| Phase | Target Lesson Count | Theme | Tracks Actively Built |
|---|---|---|---|
| **Phase 1** | 50–60 | Serious beginner course — a learner with zero IBM i background can go from nothing to writing and running a simple RPGLE program and understanding the platform around it. | 1 (Foundations), 2 (5250/Commands), 3 (Libraries/IFS), 4 (Db2/DDS/PF/LF), 5 (RPGLE Beginner), 8 (CLLE — intro only), 9 (Display Files — intro only), 12 (Debugging — intro only), 13 (IBM i Ops — intro only), 16 (Interview — intro only) |
| **Phase 2** | 120–150 (cumulative) | Job-ready developer course — a learner can credibly claim entry-to-mid-level IBM i developer skills. | Full-depth 8, 9, 10 (new), 11 (new), 13; deepened 3, 4, 12; first entries in 15 (Real-World Projects); expanded 16 |
| **Phase 3** | 250–300 (cumulative) | Professional course — working developers gain advanced, senior-adjacent skill. | 6 → 7 transition complete, full 7 (RPGLE Advanced), full 14 (Integration/Modernization), deepened 11, 12, 15, 16 |
| **Phase 4** | 400–500+ (cumulative) | Long-term academy — comprehensive depth, large scenario/interview bank, full project library, niche advanced topics across every track. | Long-tail depth in every track; Track 15 project library matures; Track 16 becomes a large, genuinely comprehensive question bank; possible new stretch tracks (see Section 3.1) |

### 3.1 Possible future stretch tracks (Phase 4+, not scoped in detail here)

- **IBM i Security Deep Dive** (split out from Track 13 M5 once it outgrows "basics")
- **Performance Tuning for RPGLE/SQL** (split out from Tracks 7/11/12 advanced modules once mature)
- **IBM i for Technical Leads/Architects** (design-tradeoff-level content, distinct audience from working developers)

These are explicitly out of scope to design now; flagged only so Phase 4 planning doesn't start from zero.

---

## 4. Lesson Template (Expanded)

This extends — it does not replace — the Spec 009 Section 6 approved template. Everything Spec 009 currently requires (Learning Objective, Simple Explanation, Why It Matters, Practical Example, Common Confusions, Quick Recap, Try Asking AI Tutor) is preserved below under renamed/expanded sections; nothing already-published needs to change shape to comply.

| # | Section | Purpose | Required? |
|---|---|---|---|
| 1 | Title | Clearly identifies the lesson topic. | Always |
| 2 | Learning Objective | What the learner will understand after this lesson. | Always |
| 3 | Simple Explanation | Beginner-friendly explanation of the concept — same as today. | Always |
| 4 | Why It Matters | Connects the concept to real IBM i work — same as today. | Always |
| 5 | Beginner Example | A minimal, easy-to-follow example — may be the same as today's "Practical Example" for Beginner-tier lessons. | Always |
| 6 | Real-World Example | A slightly larger, more realistic scenario showing the concept in a plausible production-like context. May be combined with Section 5 for short Beginner-tier lessons (matches Spec 009's existing allowance to combine sections for short lessons). | Always for Intermediate/Advanced; optional-but-recommended for Beginner |
| 7 | Advanced Notes | Deeper detail, edge cases, or "here's what changes at a senior level" callouts. | Intermediate/Advanced lessons; omitted for pure-beginner lessons where it would be noise |
| 8 | Common Mistakes | What beginners (or careless experienced developers) typically get wrong — expands today's "Common Confusions" from a Q&A format to an explicit mistakes list where that fits the topic better. | Always |
| 9 | Debugging / Support Angle | How this concept shows up when something goes wrong, and how a support/production developer would investigate it. | Required for Track 12 lessons and any lesson with an operational failure mode; optional elsewhere |
| 10 | Interview / Scenario Question | At least one interview-style or scenario-reasoning question with a model answer approach (not just the answer — the reasoning). | Always |
| 11 | Quick Recap | Same as today. | Always |
| 12 | AI Tutor Prompt Suggestions | Expanded from today's single starter question to 2–3 suggested prompts of varying depth (a beginner follow-up, a "why" follow-up, and — where relevant — a scenario follow-up). | Always |
| 13 | Related Lessons | Explicit links (by lesson ID/slug) to prerequisite and follow-on lessons across tracks — new section enabling real cross-track navigation. | Always |
| 14 | Mark Complete | UI element, not authored content — unchanged from Spec 009. | N/A (UI) |
| 15 | Next Lesson | Now driven by module/track order plus the Related Lessons metadata, not just a single linear "next" — unchanged in spirit from Spec 009, expanded in mechanism (Section 5). | N/A (UI) |

**Note on template flexibility:** Exactly like the current Spec 009 template, sections may be combined or lightly abbreviated for short lessons, but may not be skipped without justification recorded at review time.

---

## 5. Metadata Model Recommendation

This extends Spec 009 Section 11. Fields already required today are marked **(existing)**; new fields are marked **(new)**.

### Required fields

| Field | Purpose | Notes |
|---|---|---|
| Lesson ID **(existing)** | Unique stable identifier | Unchanged |
| Slug **(existing)** | URL-friendly route identifier | Unchanged; stability rule (CONTENT-FR-009) still applies |
| Title **(existing)** | Human-readable lesson name | Unchanged |
| Short description **(existing)** | One or two sentences for lesson lists | Unchanged |
| **Track ID (new)** | Which of the 16 tracks this lesson belongs to | Replaces the implicit assumption of a single path; a lesson belongs to exactly one primary track |
| **Module ID (new)** | Which module within the track | Groups lessons for navigation and progress sub-totals |
| Lesson order **(existing, reinterpreted)** | Position within its module | Previously "position in the one path"; now scoped to module, not the whole curriculum |
| Learning path ID **(existing, generalized)** | Reference to a learning path | Generalizes from "the IBM i Fundamentals path" (singular) to "one of N tracks" |
| Status **(existing)** | Draft → Review Ready → Approved → Published → Unpublished/Archived | Unchanged lifecycle; still the single authoritative visibility field per Spec 009 OQ-CONTENT-003 |
| **Difficulty (new)** | Beginner / Intermediate / Advanced | Drives filtering, badges, and prerequisite gating display |
| Content source path **(existing)** | File path to the lesson Markdown file | Unchanged |
| Created date / Updated date **(existing)** | Record-keeping | Unchanged |

### New fields to support multi-track/multi-level content

| Field | Purpose | Notes |
|---|---|---|
| **Tags** | Free-form topical tags (e.g., "RPGLE", "SQL", "debugging", "interview") | Enables cross-track discovery ("show me everything tagged debugging") independent of the primary Track/Module hierarchy |
| **Prerequisite Lesson IDs** | Explicit list of lessons that should be completed first | Distinct from "Related Lessons" in the content body — this is a structured field the Learning Center can use to gate or warn, not just a content link |
| **Related Lesson IDs** | Cross-track "see also" links | Powers Section 13 of the lesson template |
| **Estimated reading time (existing)** | Approximate completion time | Unchanged, still optional |
| **AI Tutor prompt suggestions (existing, expanded)** | Was a single optional starter question; now a small list (2–3) | Still reviewed per CONTENT-FR-010; list instead of single value |
| **Persona tags** | Which target audience persona(s) this lesson most serves (absolute beginner / junior developer / working developer / support-production / interview-prep / legacy-to-modern) | Optional but recommended — supports future personalized recommendations without building a recommendation engine in MVP |

### Progress tracking implications (for a future Spec 006 revision — not designed here)

- The single "published lesson count" denominator becomes, at minimum, a **per-track denominator** (progress within a track), and likely also a **per-module** sub-denominator for tracks with many lessons.
- A learner's overall "curriculum progress" becomes a roll-up across tracks rather than one flat percentage — this is a materially different progress model than Spec 006 v1.0 and should be scoped as its own revision, sequenced after this blueprint is approved and before Phase 1 of this expansion ships multiple tracks.

---

## 6. Quality Bar — What Makes a Lesson Publishable

This extends Spec 009 Section 12. All of Spec 009's existing 13 checklist items still apply unchanged. The additions below are specific to a multi-track, multi-level curriculum.

### Additional required checks

| # | Check | Description |
|---|---|---|
| 14 | Difficulty-appropriate depth | The lesson's actual content matches its declared Difficulty — a "Beginner" lesson doesn't assume Advanced-track prerequisite knowledge, and an "Advanced" lesson isn't padded with beginner-level restatement. |
| 15 | Correct track/module placement | The lesson is filed under the track and module where a learner would actually look for it; placement is checked against the track's stated scope in Section 2. |
| 16 | Prerequisite accuracy | Declared prerequisite lessons are genuinely required to understand this lesson — not over-listed defensively or under-listed optimistically. |
| 17 | No unjustified cross-track duplication | If a concept genuinely needs restating in a second track (e.g., "job log basics" referenced from both Track 8 and Track 12), it must cross-reference rather than re-teach it in full — one canonical lesson per concept. |
| 18 | Real-world example is plausible, not generic | The Real-World Example section (Section 4.6) reads like a believable production scenario, not a restatement of the Beginner Example with bigger numbers. |
| 19 | Interview/scenario question has a real model answer approach | Section 4.10 doesn't just state a question — it walks through how a strong candidate would reason about it, not only the final answer. |
| 20 | Debugging/support angle is concrete when present | Where Section 4.9 is included, it names an actual failure mode and diagnostic step, not a generic "check the job log" non-answer. |
| 21 | AI Tutor prompts are genuinely varied | The 2–3 suggested prompts differ meaningfully in depth/angle, not just reworded versions of the same question. |
| 22 | Related Lessons are bidirectional where appropriate | If Lesson A lists Lesson B as related, and the relationship is genuinely mutual, Lesson B should generally list Lesson A back (checked at review time, not enforced automatically). |

### Unchanged from Spec 009 (still fully in force)

- Correct IBM i terminology, beginner-friendly baseline explanation, no unsupported technical claims, no production-safe guarantee, no private/customer data, no credentials, template compliance, Markdown renders correctly, **original content only — nothing copied from IBM documentation, Go4AS400, Redbooks, RPGPGM, or any other external source**, sensible next-lesson flow, appropriate AI Tutor prompts, correct code blocks.

The existing rule bears repeating given this blueprint explicitly names external references: **IBM official documentation, Go4AS400, IBM Redbooks, RPGPGM, and similar resources may be used only for topic discovery and fact-checking. No text, code example, or structural pattern may be copied from them.** This should be called out explicitly in the review checklist once it's updated for the expanded curriculum.

---

## 7. First Implementation Recommendation — The First 50 Lessons

Chosen so that Phase 1, on its own, is genuinely useful: a true beginner can go from zero to a working understanding of the platform, comfortable 5250 navigation, a real data-layer foundation, a complete simple RPGLE program, a first taste of CLLE and interactive screens, basic troubleshooting instinct, and a sense of what a real IBM i job involves.

### Track 1 — IBM i Foundations (8)
1. What is IBM i? *(existing — retained as-is, seeds this track)*
2. Why IBM i Still Matters *(existing — retained)*
3. IBM i Platform Overview *(existing — retained)*
4. Common Myths About IBM i, Debunked *(new)*
5. Where IBM i Shows Up Today: Industries and Real Use Cases *(new)*
6. IBM i Job Roles and What They Actually Do *(new)*
7. How to Use This Curriculum and the AI Tutor Effectively *(new)*
8. Where to Go Next *(existing — retained, rewritten to point into the full track structure)*

### Track 2 — 5250 Terminal and Core Commands (6)
9. 5250 Screen Basics *(existing — retained, seeds this track)*
10. Navigating Menus, Function Keys, and the Command Line *(new)*
11. Signing On, User Profiles, and Current Library *(new)*
12. WRKACTJOB and WRKOBJ: Seeing What's Happening on the System *(new)*
13. WRKSPLF and DSPLIB: Finding Things You Need *(new)*
14. Prompting Commands Effectively with F4 *(new)*

### Track 3 — Libraries, Objects, and the IFS (6)
15. Libraries and Objects *(existing — retained, seeds this track)*
16. Common Object Types Every Developer Should Know *(new)*
17. The Library List and Search Order, in Practice *(new)*
18. What the IFS Is and How It Differs from Libraries *(new)*
19. Object Authority Basics for Developers *(new)*
20. Common Library and Object Mistakes Beginners Make *(new)*

### Track 4 — Db2 for i, DDS, Physical Files, and Logical Files (7)
21. Physical Files and Logical Files *(existing — retained, seeds this track)*
22. Introduction to Db2 for i *(existing — retained)*
23. Writing Your First DDS Physical File *(new)*
24. Building a Logical File Over Existing Data *(new)*
25. Keyed Access, Explained Simply *(new)*
26. Referential Integrity Basics on IBM i *(new)*
27. Journaling: What It Is and Why Developers Should Care *(new)*

### Track 5 — RPGLE Beginner (10)
28. Introduction to RPGLE *(existing — retained, seeds this track)*
29. Free-Format RPGLE: Program Structure and Basic Syntax *(new)*
30. Declaring Variables and Basic Data Types *(new)*
31. If/Else, Select/When, and Basic Program Flow *(new)*
32. Loops in RPGLE: DOW and DOU *(new)*
33. Declaring and Reading a File in RPGLE *(new)*
34. Writing and Updating Records *(new)*
35. Putting It Together: Your First Complete RPGLE Program *(new)*
36. Common Beginner RPGLE Mistakes *(new)*
37. Reading a Compile Listing for the First Time *(new)*

### Track 8 — CLLE, intro (6)
38. Introduction to CLLE *(existing — retained, seeds this track)*
39. Writing Your First CL Program *(new)*
40. Parameters and Variables in CL *(new)*
41. Calling a Program from CL and Checking the Result *(new)*
42. Basic Conditional Logic in CL *(new)*
43. The Nightly Process Pattern: Orchestrating a Simple Job *(new)*

### Track 9 — Display Files and Subfiles, intro (5)
44. What a Display File Is and How It Works *(new)*
45. Writing DDS for a Simple Data-Entry Screen *(new)*
46. Handling User Input and Basic Validation *(new)*
47. What a Subfile Is, Conceptually *(new)*
48. Your First Subfile: Loading and Displaying a List *(new)*

### Track 12 — Debugging, Job Logs, intro (5, one already used as track-count example above but listed once here)
49. Job Logs and Spool Files Basics *(existing — retained, seeds this track)*
50. Reading a Job Log: A Guided Walkthrough *(new)*

**Note:** items 49–50 bring the count to exactly 50. The remaining Phase 1 scope described in Section 3 (IBM i Operations intro, Interview Readiness intro, and a few more Debugging/Track 9 lessons to round Phase 1 out to 60) are the natural next 10 after these 50 and are already scoped in Section 2's per-track module lists — they were deliberately left just outside the "first 50" so the first 50 stays tightly focused on making tracks 1–5 (the true beginner spine) fully solid before spreading into CLLE/Display Files/Ops/Interview intros.

### Migration note on the existing lessons

**11 of the current 12 published lessons are retained as-is** (items 1, 2, 3, 8, 9, 15, 21, 22, 28, 38, and 49 above), needing only a Track/Module metadata assignment once the expanded metadata model exists — no content rewrite. Only **"Where to Go Next"** (existing Lesson 12) needs a substantive rewrite, since its current framing ("here's what to explore next") assumes the old single-path structure and should instead route learners into whichever of Tracks 2–5 fits their stated goal. See Section 8 for the full mapping.

---

## 8. How the Existing 12 Lessons Map Into the New Structure

| Existing Lesson | Existing Order | New Track | New Position | Rewrite Needed? |
|---|---|---|---|---|
| What is IBM i? | 1 | Track 1: Foundations | M1, Lesson 1 | No — retained as-is |
| Why IBM i Still Matters | 2 | Track 1: Foundations | M2, Lesson 1 | No — retained as-is |
| IBM i Platform Overview | 3 | Track 1: Foundations | M3, Lesson 1 | No — retained as-is |
| Libraries and Objects | 4 | Track 3: Libraries/Objects/IFS | M1, Lesson 1 | No — retained as-is |
| 5250 Screen Basics | 5 | Track 2: 5250/Commands | M1, Lesson 1 | No — retained as-is |
| Physical Files and Logical Files | 6 | Track 4: Db2/DDS/PF/LF | M1, Lesson 1 | No — retained as-is |
| Introduction to RPGLE | 7 | Track 5: RPGLE Beginner | M1, Lesson 1 | No — retained as-is |
| Introduction to CLLE | 8 | Track 8: CLLE | M1, Lesson 1 | No — retained as-is |
| Introduction to Db2 for i | 9 | Track 4: Db2/DDS/PF/LF | M2, Lesson 1 | No — retained as-is |
| Job Logs and Spool Files Basics | 10 | Track 12: Debugging | M1, Lesson 1 | No — retained as-is |
| Basic IBM i Development Workflow | 11 | Track 13: IBM i Operations | M1, Lesson 1 | No — retained as-is |
| Where to Go Next | 12 | Track 1: Foundations | M5 (capstone) | **Yes** — must be rewritten to route into the new track structure rather than a single linear "next" |

All 12 lessons keep their existing Markdown files, slugs, and (per CONTENT-FR-009) URLs. Only their Track/Module metadata assignment and, for one lesson, their body content change. This is a metadata-and-one-rewrite migration, not a content-production restart.

---

## 9. Recommended Immediate Next Steps

1. **Review and approve this blueprint** (Product Owner).
2. **Revise Spec 009 (Content Governance)** to support multiple tracks, the expanded metadata model (Section 5), and the expanded template (Section 4) — this is required before any new lesson beyond the current 12 is authored under this plan.
3. **Scope a Spec 006 (Progress Tracking) amendment** for per-track/per-module progress, sequenced after Spec 009's revision.
4. **Confirm the "first 50" list in Section 7** with the Product Owner, adjusting persona emphasis if needed before content production begins.
5. Only after 1–4 are done: begin Phase 1 lesson production, starting with the 39 new lessons in Section 7 (the 11 existing lessons need no new writing, just re-tagging once the metadata model exists).

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-14 | 0.1 | Initial draft curriculum blueprint for Product Owner review. No specs revised, no lesson content produced. |
