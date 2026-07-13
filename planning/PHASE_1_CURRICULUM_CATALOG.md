# Phase 1 Curriculum Catalog Skeleton

## Document Metadata

| Field | Value |
|---|---|
| Title | Phase 1 Curriculum Catalog Skeleton |
| Status | **Draft — Planning Only. No lesson content, no application code, no auth/session/progress/AI Tutor logic changed.** |
| Version | 0.1 |
| Owner | Product + Content |
| Depends on | `planning/CURRICULUM_EXPANSION_BLUEPRINT.md` (v0.2), `specs/009-content-governance/spec.md` (v2.1-draft), `specs/002-learning-center/spec.md` (v2.1-draft), `specs/006-progress-tracking/spec.md` (v2.1-draft) |
| Scope of this document | Defines the first 50–60 Phase 1 lessons at catalog/skeleton level (track, module, title, summary, difficulty, depth, persona tags, priority, mapping to existing content). **No lesson Markdown files are created. No metadata schema, database, or application code is touched.** |

---

## 0. Purpose and Governance Note

`planning/CURRICULUM_EXPANSION_BLUEPRINT.md` Section 9 named this document as the concrete next planning deliverable after the Spec 009/002/006 v2.0 governance amendments (PR #55). This document expands the blueprint's Section 7 "first 50" list into the full catalog-level detail needed before any lesson gets written: exactly which lesson, in which track and module, at what difficulty and depth, for which persona, and at what priority.

**This document does not authorize lesson production by itself.** Per Spec 009 v2.1's SDD Handoff Notes, lesson production still requires: (1) full Product Owner approval of the Spec 009/002/006 v2.0 amendments as a whole (their open questions are resolved, but the amendments themselves are still in Draft status), and (2) the metadata schema migration (Spec 009 Section 5B) to actually be implemented in code. Both are still pending. This catalog exists so that work is ready to start the moment those two gates clear — it does not clear them itself.

**Terminology used consistently throughout:** IBM i (never "IBMi" as a platform name), Db2 for i, RPGLE, CLLE — matching the terminology conventions already established in the product's published lesson content and specs.

---

## 1. Summary

| Metric | Count |
|---|---|
| **Total planned lessons in this catalog** | **60** |
| Existing lessons retained as-is (no rewrite) | 11 |
| Existing lesson needing rewrite | 1 ("Where to Go Next") |
| New lessons to be written | 48 |
| P0 (minimum useful Phase 1 spine) | 40 |
| P1 (completes the "serious beginner release" claim) | 17 |
| P2 (valuable, could follow shortly after) | 3 |

**P0/P1 note:** P0 is Tracks 1–5 and Track 12 *except* for 3 lessons within Tracks 1–2 that are themselves "new coverage additions" beyond the blueprint's original Section 7 list (catalog #8, #16, #17 — see Section 2.11) and are deliberately tiered as P1 rather than P0, since they're valuable orientation/context but not strictly load-bearing for the core beginner spine. Tracks 8, 9, and 13 are P1; Track 16 is P2. See Section 5 for the exact breakdown.

This catalog covers exactly the 60-lesson ceiling of the blueprint's Phase 1 target range (50–60), reflecting the 10 coverage areas requested for this document. It **extends** the blueprint's own Section 7 "first 50" list (which stopped deliberately at 50) with 10 additional lessons to reach the requested 10 coverage areas — see Section 2.11 (new coverage additions) for exactly what was added and why.

---

## 2. The Catalog

Each table below covers one track. Columns: lesson number in this catalog, module, lesson title, one-line summary, difficulty, depth, persona tags, priority, and status (existing/new/rewrite, with a reference to the corresponding one of the current 12 published lessons where applicable).

All 60 lessons in this catalog are **`depth: foundation`** — Phase 1 is, by definition, the foundation layer of the curriculum (per blueprint Section 2.3 and Section 7's own depth note). No `depth: professional` lessons are planned until Phase 2/3, once these modules have matured. The Depth column is still included per lesson for consistency with the metadata model, even though its value is uniform in this document.

### 2.1 Track 1 — IBM i Foundations (9 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | M1: What IBM i Is | What is IBM i? | A beginner-friendly introduction to IBM i, the integrated platform that runs on IBM Power Systems. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 1) — retained as-is |
| 2 | M2: Why IBM i Still Matters | Why IBM i Still Matters | Why organizations continue to rely on IBM i for critical systems, and what makes replacing it a slow, deliberate decision. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 2) — retained as-is |
| 3 | M3: The Big Picture Map | IBM i Platform Overview | A high-level map of the major parts of the IBM i platform and how they work together. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 3) — retained as-is |
| 4 | M3: The Big Picture Map | Common Myths About IBM i, Debunked | Addresses the most common misconceptions ("it's dead," "it's just a database," "green screen means outdated") with a clear, factual response to each. | beginner | foundation | beginner | P0 | New |
| 5 | M4: Learning Paths and Career Orientation | Where IBM i Shows Up Today: Industries and Real Use Cases | A tour of the industries and company types (banking, distribution, manufacturing, government, healthcare) where IBM i runs critical systems today. | beginner | foundation | beginner | P0 | New |
| 6 | M4: Learning Paths and Career Orientation | IBM i Job Roles and What They Actually Do | What a junior IBM i developer, a support/production developer, and an operations-adjacent role each actually spend their day doing. | beginner | foundation | beginner, working-developer | P0 | New |
| 7 | M4: Learning Paths and Career Orientation | How to Use This Curriculum and the AI Tutor Effectively | How the track/module structure works, how to pick a starting point, and how to get the most out of AI Tutor questions while learning. | beginner | foundation | beginner | P0 | New |
| 8 | M4: Learning Paths and Career Orientation *(new coverage addition — Section 2.11)* | IBM i Today: A Quick Look at Modern Tools and Practices | A short, honest orientation to how IBM i is actually used today — IBM i Access Client Solutions (ACS), open-source tooling on i, and modern languages working alongside RPG and CL — without overstating what any one tool does. | beginner | foundation | beginner, working-developer | P1 | New |
| 9 | M5: Where to Go Next | Where to Go Next | Closing lesson for the recommended beginner path; routes learners into the broader track catalog based on their stated goal. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 12) — **NEEDS REWRITE**: current version assumes a single linear path; must be rewritten to route into the full 16-track catalog (per blueprint Section 8 / Spec 009 Section 5B) |

### 2.2 Track 2 — 5250 Terminal and Core Commands (8 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 10 | M1: 5250 Basics | 5250 Screen Basics | What a 5250 screen is, how people navigate it, and why many IBM i applications still use it. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 5) — retained as-is |
| 11 | M2: Navigating Menus and Command Entry | Navigating Menus, Function Keys, and the Command Line | The command line, common function keys (F3, F9, F12), and how menu-driven navigation works on a 5250 session. | beginner | foundation | beginner | P0 | New |
| 12 | M4: System Values and Signing On | Signing On, User Profiles, and Current Library | What happens at sign-on, what a user profile is, and what "current library" means for a session. | beginner | foundation | beginner | P0 | New |
| 13 | M3: Core Commands for Developers | WRKACTJOB and WRKOBJ: Seeing What's Happening on the System | Two of the most commonly used commands for seeing active jobs and finding objects, at a beginner-appropriate level. | beginner | foundation | beginner | P0 | New |
| 14 | M3: Core Commands for Developers | WRKSPLF and DSPLIB: Finding Things You Need | Finding your own spool files and seeing what's in a library, without needing full parameter mastery yet. | beginner | foundation | beginner | P0 | New |
| 15 | M5: Command Parameters and Prompting Efficiently | Prompting Commands Effectively with F4 | Using F4 to prompt an unfamiliar command instead of memorizing syntax, and reading the prompt screen confidently. | intermediate | foundation | beginner | P0 | New |
| 16 | M1: 5250 Basics *(new coverage addition — Section 2.11)* | Introduction to IBM i Access Client Solutions (ACS) | What ACS is, how it relates to a traditional 5250 session, and what a beginner would actually use it for early on. | beginner | foundation | beginner | P1 | New |
| 17 | M1: 5250 Basics *(new coverage addition — Section 2.11)* | Using the Built-In Help System and Documentation | How to use IBM i's built-in help (including command-level help) and where to find official reference documentation when a lesson doesn't cover something. | beginner | foundation | beginner | P1 | New |

### 2.3 Track 3 — Libraries, Objects, and the IFS (6 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 18 | M1: Objects and Libraries | Libraries and Objects | How IBM i organizes programs, files, and other objects using libraries, and why the library list matters. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 4) — retained as-is |
| 19 | M2: Common Object Types | Common Object Types Every Developer Should Know | A practical introduction to *PGM, *FILE, *DTAARA, *MSGF, and *SRVPGM — what they are, not full technical reference. | beginner | foundation | beginner | P0 | New |
| 20 | M1: Objects and Libraries | The Library List and Search Order, in Practice | How IBM i searches the library list to resolve an unqualified object name, worked through with a concrete example. | beginner | foundation | beginner | P0 | New |
| 21 | M3: The IFS | What the IFS Is and How It Differs from Libraries | What the Integrated File System is, how it differs from the library-based model, and why both exist side by side. | beginner | foundation | beginner | P0 | New |
| 22 | M4: Authority and Object Security Basics | Object Authority Basics for Developers | *PUBLIC authority and object-level permissions at a level every developer should know, without a full security deep dive. | intermediate | foundation | beginner, working-developer | P0 | New |
| 23 | M5: Working with Libraries and Objects Day to Day | Common Library and Object Mistakes Beginners Make | The most frequent "object not found" and library-list confusion mistakes, and how to reason through them. | beginner | foundation | beginner | P0 | New |

### 2.4 Track 4 — Db2 for i, DDS, Physical Files, and Logical Files (7 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 24 | M1: Physical and Logical Files | Physical Files and Logical Files | How IBM i stores data in physical files and provides different views of that data through logical files. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 6) — retained as-is |
| 25 | M2: Db2 for i | Introduction to Db2 for i | What Db2 for i is, how it relates to physical and logical files, and how applications access the data it stores. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 9) — retained as-is |
| 26 | M3: DDS Fundamentals | Writing Your First DDS Physical File | A first, beginner-appropriate walkthrough of DDS field definitions and key fields for a physical file. | beginner | foundation | beginner | P0 | New |
| 27 | M4: DDS for Logical Files | Building a Logical File Over Existing Data | Writing a simple logical file over an existing physical file, covering basic select/omit. | beginner | foundation | beginner | P0 | New |
| 28 | M1: Physical and Logical Files | Keyed Access, Explained Simply | What keyed access means and why it matters for looking up and ordering records efficiently. | beginner | foundation | beginner | P0 | New |
| 29 | M5: Referential Integrity and Data Design Basics | Referential Integrity Basics on IBM i | Primary/foreign key concepts on IBM i and why early data design decisions matter for the RPGLE programs built later. | intermediate | foundation | beginner | P0 | New |
| 30 | M6: Journaling Basics for Developers | Journaling: What It Is and Why Developers Should Care | What journaling is, why it exists, and the minimum a developer (not an operator) needs to know about it. | intermediate | foundation | beginner, working-developer | P0 | New |

### 2.5 Track 5 — RPGLE Beginner (10 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 31 | M1: What RPGLE Is | Introduction to RPGLE | What RPGLE is, how it's used to build IBM i business applications, and how it connects to what you've learned so far. | beginner | foundation | beginner | P0 | **Existing** (current Lesson 7) — retained as-is |
| 32 | M2: Free-Format RPGLE Basics | Free-Format RPGLE: Program Structure and Basic Syntax | The shape of a free-format RPGLE program: `ctl-opt`, `dcl-s`, comments, and basic data types. | beginner | foundation | beginner | P0 | New |
| 33 | M2: Free-Format RPGLE Basics | Declaring Variables and Basic Data Types | How to declare variables in free-format RPGLE and choose an appropriate data type for simple business data. | beginner | foundation | beginner | P0 | New |
| 34 | M3: Basic Program Flow | If/Else, Select/When, and Basic Program Flow | Conditional logic in RPGLE: if/else and select/when, with original worked examples. | beginner | foundation | beginner | P0 | New |
| 35 | M3: Basic Program Flow | Loops in RPGLE: DOW and DOU | The two most common RPGLE loop constructs and when to reach for each. | beginner | foundation | beginner | P0 | New |
| 36 | M4: Native File I/O Basics | Declaring and Reading a File in RPGLE | Declaring a file with `dcl-f` and reading records with basic status checking. | beginner | foundation | beginner | P0 | New |
| 37 | M4: Native File I/O Basics | Writing and Updating Records | Writing new records and updating existing ones from an RPGLE program. | beginner | foundation | beginner | P0 | New |
| 38 | M5: Building a First Complete Program | Putting It Together: Your First Complete RPGLE Program | An original, end-to-end program that reads a file, applies a simple business rule, and writes output — tying the whole track together. | beginner | foundation | beginner | P0 | New |
| 39 | M6: Common Beginner Mistakes | Common Beginner RPGLE Mistakes | The most frequent beginner logic errors, end-of-file handling mistakes, and indicator confusion. | beginner | foundation | beginner | P0 | New |
| 40 | M6: Common Beginner Mistakes | Reading a Compile Listing for the First Time | How to read an RPGLE compile listing and locate the actual problem when a compile fails. | beginner | foundation | beginner, support-developer | P0 | New |

### 2.6 Track 8 — CLLE, Beginner Intro (6 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 41 | M1: What CLLE Is | Introduction to CLLE | What CLLE is, how it's used to control and coordinate IBM i processes, and how it differs from RPGLE. | beginner | foundation | beginner | P1 | **Existing** (current Lesson 8) — retained as-is |
| 42 | M2: Basic CL Programs | Writing Your First CL Program | A minimal, complete CL program: parameters, variables, and a simple command sequence. | beginner | foundation | beginner | P1 | New |
| 43 | M2: Basic CL Programs | Parameters and Variables in CL | Declaring and using parameters and variables in a CL program. | beginner | foundation | beginner | P1 | New |
| 44 | M3: Calling Programs and Checking Results | Calling a Program from CL and Checking the Result | Using CALL, checking return codes, and a first look at MONMSG. | beginner | foundation | beginner | P1 | New |
| 45 | M2: Basic CL Programs | Basic Conditional Logic in CL | Conditional logic in CL programs at a beginner level. | beginner | foundation | beginner | P1 | New |
| 46 | M5: Job Scheduling and Automation Patterns | The Nightly Process Pattern: Orchestrating a Simple Job | The classic pattern of a CL program coordinating an RPGLE program and checking whether it succeeded before continuing. | beginner | foundation | beginner, working-developer | P1 | New |

### 2.7 Track 9 — Display Files and Subfiles, Beginner Intro (5 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 47 | M1: Display File Basics | What a Display File Is and How It Works | What a display file is and the DDS behind a simple single-record screen. | beginner | foundation | beginner | P1 | New |
| 48 | M1: Display File Basics | Writing DDS for a Simple Data-Entry Screen | Writing the DDS for a basic data-entry screen with input-capable fields. | beginner | foundation | beginner | P1 | New |
| 49 | M2: Handling User Input | Handling User Input and Basic Validation | Basic input validation and using indicators for simple screen control. | beginner | foundation | beginner | P1 | New |
| 50 | M3: Subfile Fundamentals | What a Subfile Is, Conceptually | A conceptual introduction to subfiles and the load/display cycle, before writing any subfile code. | beginner | foundation | beginner | P1 | New |
| 51 | M3: Subfile Fundamentals | Your First Subfile: Loading and Displaying a List | A first, minimal working subfile that loads and displays a list of records. | beginner | foundation | beginner | P1 | New |

### 2.8 Track 12 — Debugging, Job Logs, and Problem Diagnosis, Beginner Intro (3 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 52 | M1: Job Logs and Spool Files Basics | Job Logs and Spool Files Basics | What job logs and spool files are, how they help with troubleshooting, and how they differ from physical and logical files. | beginner | foundation | beginner, support-developer | P0 | **Existing** (current Lesson 10) — retained as-is |
| 53 | M2: Reading a Job Log | Reading a Job Log: A Guided Walkthrough | A guided, step-by-step walkthrough of tracing a failure back through a job log using message severity and message IDs. | beginner | foundation | beginner, support-developer | P0 | New |
| 54 | M3: Common Runtime Errors *(new coverage addition — Section 2.11)* | A First Look at Common Beginner Error Messages | The handful of runtime error messages a true beginner is most likely to hit first, explained plainly. | beginner | foundation | beginner, support-developer | P0 | New |

### 2.9 Track 13 — IBM i Operations for Developers, Beginner Intro (3 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 55 | M1: The Basic Development Workflow | Basic IBM i Development Workflow | A general mental model for how IBM i developers move from source code to a tested, released program. | beginner | foundation | beginner, working-developer | P1 | **Existing** (current Lesson 11) — retained as-is; requires no new writing, so may be surfaced immediately regardless of its P1 tier |
| 56 | M2: Jobs, Subsystems, and Work Management Basics *(new coverage addition)* | Jobs, Subsystems, and Work Management: The Basics | What a subsystem is and why work management exists, at the vocabulary level a developer actually needs. | beginner | foundation | beginner, working-developer | P1 | New |
| 57 | *(new coverage addition — "intro to modern IBM i practices," Section 2.11)* | Modern IBM i Development at a Glance: Beyond 5250 and RPG | An honest, brief orientation to how modernization actually happens on IBM i today (without claiming IBM i needs replacing) — sets expectations before Track 14 (Integration and Modernization) is available in a later phase. | beginner | foundation | beginner, working-developer | P1 | New |

### 2.10 Track 16 — Interview and Professional Readiness, Beginner Intro (3 lessons)

| # | Module | Lesson Title | Summary | Difficulty | Depth | Persona Tags | Priority | Status |
|---|---|---|---|---|---|---|---|---|
| 58 | M1: How IBM i Interviews Work | How IBM i Interviews Work | Common IBM i interview formats and what interviewers actually assess, including how to talk about self-taught knowledge credibly. | beginner | foundation | beginner, interview-prep | P2 | New |
| 59 | M2: Conceptual Question Bank | Common Beginner-Level IBM i Interview Questions | A first set of "explain the difference between X and Y" style questions drawn from Tracks 1–4 content, with model answers. | beginner | foundation | beginner, interview-prep | P2 | New |
| 60 | M1: How IBM i Interviews Work | Talking About Self-Taught or Course-Based IBM i Skills Credibly | Practical guidance for framing self-taught or course-based IBM i knowledge confidently and honestly in an interview. | beginner | foundation | beginner, interview-prep | P2 | New |

**A note on lesson 57's placement:** this lesson directly answers the requested "intro to modern IBM i practices" coverage area. It is deliberately scoped as a brief orientation only — it must not duplicate or preempt Track 14 (Integration and Modernization), which remains a Phase 3 track per the blueprint. Its job is to set honest expectations ("here's roughly what modernization looks like on IBM i"), not to teach modernization techniques.

### 2.11 New Coverage Additions Beyond the Blueprint's Original 50

The blueprint's Section 7 "first 50" list deliberately stopped at 50 lessons across Tracks 1–5, 8, 9, and 12 only. This catalog adds 10 lessons beyond that list to satisfy this document's requested 10 coverage areas in full — specifically, coverage areas 2 ("5250, ACS, commands, help system"), 8 ("basic developer workflow," partially already covered by an existing lesson), 9 ("intro to modern IBM i practices," not previously scoped anywhere in Phase 1), and 10 ("beginner career/interview readiness," previously scoped by the blueprint only as part of the "next 10 to reach 60," not enumerated). The 10 additions are:

| Catalog # | Track | Lesson | Why Added |
|---|---|---|---|
| 8 | 1 | IBM i Today: A Quick Look at Modern Tools and Practices | Coverage area 9 ("intro to modern IBM i practices") — orientation-level placement in Track 1 |
| 16 | 2 | Introduction to IBM i Access Client Solutions (ACS) | Coverage area 2 ("ACS") — not named anywhere in the blueprint's Track 2 module list |
| 17 | 2 | Using the Built-In Help System and Documentation | Coverage area 2 ("help system") — same gap |
| 54 | 12 | A First Look at Common Beginner Error Messages | Coverage area 7 ("debugging basics") — the blueprint's first-50 only included 2 of Track 12's Phase 1 modules (M1, M2); this adds a beginner-appropriate slice of M3 |
| 56 | 13 | Jobs, Subsystems, and Work Management: The Basics | Coverage area 8 ("basic developer workflow") — the blueprint's first-50 didn't include Track 13 at all; this adds its Phase 1/2-boundary M2 module at a beginner level |
| 57 | 13 | Modern IBM i Development at a Glance: Beyond 5250 and RPG | Coverage area 9 ("intro to modern IBM i practices") — a second, more developer-workflow-oriented angle on the same coverage area as catalog #8 |
| 58–60 | 16 | How IBM i Interviews Work; Common Beginner-Level IBM i Interview Questions; Talking About Self-Taught or Course-Based IBM i Skills Credibly | Coverage area 10 ("beginner career/interview readiness") — the blueprint named Track 16's Phase 1 intro as part of the "next 10 to reach 60" but did not enumerate specific lesson titles; this catalog does so |

These 10 additions are all tiered P1 or P2 (Section 1), reflecting that they extend and round out Phase 1's coverage rather than forming its load-bearing core.

---

## 3. Existing 12 Lessons — Consolidated Mapping

This mirrors `planning/CURRICULUM_EXPANSION_BLUEPRINT.md` Section 8 and `specs/009-content-governance/spec.md` Section 5B exactly, reproduced here so the mapping is visible in this catalog without cross-referencing three documents.

| Existing Lesson | Current Order | Catalog # | Track | Rewrite Needed? |
|---|---|---|---|---|
| What is IBM i? | 1 | 1 | Track 1: IBM i Foundations | No — retained as-is |
| Why IBM i Still Matters | 2 | 2 | Track 1: IBM i Foundations | No — retained as-is |
| IBM i Platform Overview | 3 | 3 | Track 1: IBM i Foundations | No — retained as-is |
| Libraries and Objects | 4 | 18 | Track 3: Libraries, Objects, and the IFS | No — retained as-is |
| 5250 Screen Basics | 5 | 10 | Track 2: 5250 Terminal and Core Commands | No — retained as-is |
| Physical Files and Logical Files | 6 | 24 | Track 4: Db2 for i, DDS, Physical Files, and Logical Files | No — retained as-is |
| Introduction to RPGLE | 7 | 31 | Track 5: RPGLE Beginner | No — retained as-is |
| Introduction to CLLE | 8 | 41 | Track 8: CLLE | No — retained as-is |
| Introduction to Db2 for i | 9 | 25 | Track 4: Db2 for i, DDS, Physical Files, and Logical Files | No — retained as-is |
| Job Logs and Spool Files Basics | 10 | 52 | Track 12: Debugging, Job Logs, and Problem Diagnosis | No — retained as-is |
| Basic IBM i Development Workflow | 11 | 55 | Track 13: IBM i Operations for Developers | No — retained as-is |
| Where to Go Next | 12 | 9 | Track 1: IBM i Foundations | **Yes** — must be rewritten to route into the full track catalog rather than a single linear "next" |

**All 12 lessons are accounted for in this catalog.** 11 need zero new writing (only the `trackId`/`moduleId`/`difficulty`/`depth` metadata retag once the schema exists). Only "Where to Go Next" requires new content.

---

## 4. Recommended Publishing Order

Publishing order follows the pedagogical dependency chain, not the catalog numbering:

1. **Track 1 — IBM i Foundations** (no prerequisites; must exist before anything else makes sense)
2. **Track 2 — 5250 Terminal and Core Commands** (depends on Track 1)
3. **Track 3 — Libraries, Objects, and the IFS** (depends on Track 1; benefits from Track 2)
4. **Track 4 — Db2 for i, DDS, Physical Files, and Logical Files** (depends on Track 3)
5. **Track 5 — RPGLE Beginner** (depends on Tracks 3 and 4)
6. **Track 12 — Debugging intro** (depends on Track 1; most useful once Track 5 exists, since beginners start hitting real errors at that point)
7. **Track 8 — CLLE intro** (depends on Track 2; recommended after Track 5, since CL programs commonly call RPG programs)
8. **Track 9 — Display Files intro** (depends on Track 5; recommended after Track 8)
9. **Track 13 — IBM i Operations intro** (depends on Tracks 2 and 3; existing Lesson 11 can be surfaced immediately since it needs no new writing)
10. **Track 16 — Interview readiness intro** (no hard prerequisite, but most valuable once a learner has actually completed Tracks 1–5)

---

## 5. Minimum Useful Phase 1 Release Set

The **P0 tier (40 lessons: Tracks 1, 2, 3, 4, 5, and 12, minus 3 "new coverage addition" lessons in Tracks 1–2 that are tiered P1)** is the minimum set that makes IBMiHub AI "genuinely useful," per the blueprint's own Phase 1 goal: a learner with zero IBM i background can go from nothing to writing and running a simple RPGLE program, navigating a 5250 session, understanding the platform's data layer, and having basic troubleshooting instinct.

The remaining 20 lessons (P1/P2) meaningfully strengthen the release but are not strictly blocking:

- **P1, 17 lessons:** Track 8 (CLLE intro, 6), Track 9 (Display Files intro, 5), Track 13 (Operations intro, 3), plus 3 orientation lessons within Tracks 1–2 (catalog #8, #16, #17). CLLE and Display Files intros in particular make the platform feel like a real development environment rather than "RPGLE in isolation."
- **P2, 3 lessons:** Track 16 (Interview readiness intro). This is the safest single track to defer if a release needs to ship with fewer than 60 lessons, since it depends on Tracks 1–5 already existing and adds career-readiness value rather than core technical competence.

---

## 6. Lessons That Should Be Written First

Of the 48 new lessons, the highest-leverage subset to write first is the **P0 new-content spine**: the 32 new lessons across Tracks 1, 3, 4, and 5 (Track 2's 6 P0 lessons plus these make up the true beginner path). Concretely, in order:

1. Track 1's 5 new orientation lessons (catalog #4–8) — completes the onboarding narrative around the 3 existing Track 1 lessons
2. Track 2's 5 new lessons (catalog #11–15) — 5250 navigation is a prerequisite for describing anything else concretely
3. Track 3's 5 new lessons (catalog #19, 20, 21, 22, 23) — needed before Track 4 makes sense
4. Track 4's 5 new lessons (catalog #26–30) — needed before Track 5's file I/O lessons make sense
5. Track 5's 9 new lessons (catalog #32–40) — the capstone deliverable of Phase 1 (a working RPGLE program), and the single most differentiating content in this catalog

The 11 existing lessons require zero new writing and can be retagged and surfaced as soon as the metadata schema migration lands, in parallel with the above.

---

## 7. Dependencies and Prerequisites Between Tracks

This catalog does not yet populate the `prerequisites` metadata field lesson-by-lesson (that requires the field to exist in the schema first, per Spec 009 Section 5B). At the track level, the dependency graph is:

| Track | Depends On |
|---|---|
| 1 — IBM i Foundations | None |
| 2 — 5250 Terminal and Core Commands | Track 1 |
| 3 — Libraries, Objects, and the IFS | Track 1 |
| 4 — Db2 for i, DDS, Physical Files, and Logical Files | Track 3 |
| 5 — RPGLE Beginner | Tracks 3, 4 |
| 8 — CLLE (Beginner intro) | Track 2; Track 5 recommended first |
| 9 — Display Files and Subfiles (Beginner intro) | Track 5; Track 2 recommended first |
| 12 — Debugging (Beginner intro) | Track 1; most useful once Track 5 exists |
| 13 — IBM i Operations (Beginner intro) | Tracks 2, 3 |
| 16 — Interview and Professional Readiness (Beginner intro) | None formally; most valuable after Tracks 1–5 |

---

## 8. Gaps Remaining After Phase 1

This catalog deliberately does **not** cover, per the blueprint's own phasing (Sections 3, 3.2):

- **SQL for IBM i** (Track 11) — entirely absent from Phase 1; begins in Phase 2
- **RPGLE Intermediate and Advanced** (Tracks 6, 7) — subprocedures, service programs, ILE architecture, embedded SQL, performance-aware coding
- **Printer Files and Reports** (Track 10) — begins in Phase 2
- **Full CLLE, Display Files, Debugging, and IBM i Operations depth** — this catalog only covers each track's Phase 1 introductory module(s); full depth is Phase 2/3
- **Real-World Projects** (Track 15) — first projects begin in Phase 2
- **Integration and Modernization** (Track 14) — Phase 3; lesson 57 in this catalog is an intentionally light teaser only, not a substitute
- **Interview and Professional Readiness depth** (remaining Track 16 modules) — code-reading/scenario questions, senior-level questions, resume framing — Phase 2/3
- **Any `depth: professional` lessons** — none exist yet; the earliest professional-depth counterparts are expected once Phase 2 modules mature (blueprint Section 2.3)
- **The public-facing A–K taxonomy's "Performance and Architecture" and "Security and Administration" categories** — only lightly touched (Track 13's basic authority/workflow content); their fuller treatment is Phase 3/4 per blueprint Section 3.1's stretch-track notes

None of these are regressions or oversights — they are the explicit, planned content of later phases, and calling them out here is meant to keep expectations honest rather than to imply they were forgotten.

---

## 9. Recommended Next PR

The next PR is **not another planning document** — it is the first PR in this entire initiative that touches actual code:

**Metadata Schema Migration PR** — implement the Spec 009 v2.0 metadata fields (`trackId`, `moduleId`, `difficulty`, `depth`, `tags`, `prerequisites`, `relatedLessons`, `personaTags`, and converting `aiTutorPrompts` to a list) in the lesson metadata model, and execute the Section 5B migration: retag the 11 retained lessons with their Track 1/2/3/4/5/8/12/13 assignments (per Section 3 of this document) and rewrite "Where to Go Next" (catalog lesson #9).

This PR should **not** begin until:
1. The Spec 009, Spec 002, and Spec 006 v2.0 amendments are approved by the Product Owner as a whole (their open questions are already resolved per PR #55, but full amendment sign-off is still pending), and
2. This catalog (or a revision of it) is confirmed by the Product Owner.

Once the migration PR lands, lesson-writing PRs can begin against the priority order in Sections 4–6 above — starting with the P0 new-content spine (Tracks 1, 3, 4, 5), which remains **planning/no-code-yet** until that point.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-14 | 0.1 | Initial draft: Phase 1 Curriculum Catalog Skeleton covering 60 lessons across 10 tracks, all 12 existing lessons mapped, publishing order, minimum useful release set, dependencies, remaining gaps, and recommended next PR (metadata schema migration). No lesson content, no application code, no auth/session/progress/AI Tutor logic touched. |
