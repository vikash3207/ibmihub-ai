# IBM i Master Topic Coverage Audit

**Date:** 2026-07-15
**Author:** Audit performed as part of PR #110, following PR #109 (Modern IBM i / APIs / Integration Review + Status Audit).
**Purpose:** Cross-reference the current, shipped IBMiHub AI curriculum against a 27-category master IBM i / AS400 topic list (Beginner → Professional) to identify what is genuinely covered, what is partial, and what is missing, before any public launch / SEO / domain work resumes.

**Method:** This audit is based on the actual shipped content in the repository, not on planning documents or intentions:
- `content/lessons/metadata.ts` — all 240 lesson records (slug, title, trackId, moduleId, tags, difficulty, depth, status)
- `content/lessons/tracks.ts` — the 16 declared tracks
- `content/practice/questions.ts` — 112 practice questions across 16 practice topic IDs
- Lesson markdown files in `content/lessons/` were spot-checked where a title/tag alone did not make coverage depth clear

**Current catalog state at time of audit:** 240 lessons, **all status: Published**, 0 Review Ready, 0 Draft. (Confirmed via the same structural audit pattern used in PR #104/#107/#109 — see Validation Results below.)

No lesson content, metadata, tracks, or practice questions were modified as part of this audit. This is a documentation-only PR.

---

## Coverage Status Definitions (as specified)

- **Fully Covered** — one or more dedicated lessons; most important subtopics explained clearly; practical examples where appropriate; findable via metadata/search/filter; strong enough for the intended level of the current curriculum.
- **Partially Covered** — some dedicated lessons or mentions exist; important subtopics are missing; may be beginner-only where the master list expects professional depth; a learner would still need more lessons to feel confident.
- **Not Covered** — no meaningful lesson or practice content exists; at most a passing mention with no explanation or teachable content.

## Priority Definitions (as specified)

- **P0** — important gap before serious public beta / core curriculum credibility
- **P1** — important for job-ready/professional path, can come after beta
- **P2** — advanced/specialized/enterprise topic for later expansion
- **Optional** — useful but outside current IBMiHub AI focus unless the platform decides to broaden

---

## Master Coverage Table

| # | Category | Status | Priority | Covered Subtopics | Missing Subtopics | Source Lesson File(s) | Practice Coverage | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | IBM i Platform Fundamentals | Partially Covered | P1 | History/naming (System/38→AS/400→iSeries→IBM i), Objects & object-based architecture, Libraries & LIBL, OS overview/big-picture | Single-Level Storage & TIMI (not explicitly taught), LPAR/Virtualization Basics, Editions & Licensing | `what-is-ibm-i.md`, `why-ibm-i-still-matters.md`, `ibm-i-platform-overview.md`, `as400-iseries-and-ibm-i-naming-explained.md`, `libraries-and-objects.md` | `ibm-i-fundamentals` practice topic | TIMI/Single-Level Storage is one of IBM i's most distinctive, frequently-asked concepts and is a real gap despite strong general "what is IBM i" coverage. |
| 2 | 5250 Terminal & Navigation | Partially Covered | P1 | 5250 emulation, sign-on/current library, command structure, F4 prompting, ACS overview | System Request Menu, QSYSOPR message handling specifically, Display Station Control, Fast Path syntax | `5250-screen-basics.md`, `signing-on-user-profiles-and-current-library.md`, `ibm-i-command-structure.md`, `using-f4-prompt-and-command-help.md`, `ibm-i-access-client-solutions-overview.md` | `commands-5250` practice topic | Solid entry point; the QSYSOPR/System Request/display-station-control subtopics are more operator-facing and thinner. |
| 3 | CL (Control Language) Programming | Fully Covered | P2 | Syntax, program structure, variables, control flow, calling programs, parameters, MONMSG/error handling, RTVJOBA, batch orchestration, best practices | RTVSYSVAL/RTVMSG not named explicitly; no dedicated "debugging a CLLE program with STRDBG" lesson | 17 lessons under `clle` track, e.g. `clle-program-structure.md`, `if-do-and-basic-control-flow-in-clle.md`, `calling-rpgle-programs-from-clle.md`, `monmsg-and-basic-error-handling-in-clle.md`, `common-clle-mistakes-and-best-practices.md` | `clle-basics` practice topic | One of the strongest, most complete tracks in the whole curriculum. |
| 4 | Object & Library Management | Partially Covered | P1 | Object types, library list, WRKOBJ/DSPOBJD/WRKLIB, CHKOBJ, object authority basics, object locks | Save/Restore (SAVOBJ, RSTOBJ, SAVLIB) is **entirely absent** from the whole 240-lesson catalog; CRTDUPOBJ not covered | `common-ibm-i-object-types.md`, `working-with-wrkobj-dspobjd-and-wrklib.md`, `checking-objects-with-chkobj.md`, `object-locks-basics.md` | `libraries-and-objects` practice topic | Save/Restore is a genuinely surprising gap for an IBM i curriculum — it's one of the most fundamental admin/dev-adjacent skills. |
| 5 | Database Fundamentals (DB2 for i) | Partially Covered | P1 | Overview, physical vs logical files, DDS basics, record formats, key fields & access paths, file types | Journaling Basics — **zero coverage anywhere in the catalog** | `introduction-to-db2-for-i.md`, `physical-files-explained-in-depth.md`, `dds-field-definitions.md`, `keyed-physical-files.md`, `logical-files-explained-in-depth.md`, `access-paths-and-why-they-matter.md` | `physical-logical-files` practice topic | Very strong on files/DDS/keys/access paths; journaling is the one clear hole (see also #16). |
| 6 | SQL on IBM i | Partially Covered | **P0** | DML (SELECT/INSERT/UPDATE/DELETE), embedded SQL basics, host variables, cursors/FETCH loops, SQLCODE/SQLSTATE, WHERE/ORDER BY/JOIN, NULL handling, SQL vs native I/O | DDL (CREATE TABLE/INDEX/VIEW), Stored Procedures (SQL PL + external), Triggers (native + SQL), UDFs, Constraints (PK/FK/Check/Unique), Dynamic vs static SQL, Precompilation (CRTSQLRPGI), EVI, DRDA, ACS Run SQL Scripts, Query optimization (SQE/CQE), COBOL-side embedded SQL | 17 lessons under `sql-for-ibm-i`, e.g. `what-is-sqlrpgle.md`, `using-sql-cursor-to-read-multiple-rows.md`, `sqlcode-and-sqlstate-basics-in-sqlrpgle.md`, `simple-join-in-sqlrpgle.md` | `sqlrpgle-basics` practice topic | This is a broad master category by design (per the interpretation guidance) and it shows: beginner SQLRPGLE is genuinely solid, but everything a working developer needs for stored procedures, triggers, and constraints is missing. Largest, most consequential single gap in the curriculum. |
| 7 | Database Design & Advanced DB2 for i | Not Covered | P2 | — | Normalization basics, referential integrity enforcement, FIELDPROC (column encryption/masking), database cross-reference files (QADBXREF/DSPFD/DSPFFD), logical access paths vs SQL indexes | — | None | No dedicated content; `access-paths-and-why-they-matter.md` and `sql-tables-vs-dds-physical-files.md` are adjacent but don't reach design-level topics. |
| 8 | RPG Programming (RPG III → RPG IV → Free-Form) | Fully Covered | P2 | Free-form RPGLE end to end: program structure, variables, expressions, conditionals, loops, BIFs, data structures, arrays, indicators (legacy vs modern), procedures/subprocedures, prototypes, error handling (%ERROR/MONITOR), embedded SQL, debugging | RPG III / fixed-format basics, legacy Program Cycle, F/D/C-specs, Multiple Occurrence Data Structures, LIKEDS/LIKEREC specifically, COPY/INCLUDE members, DSPPGMREF cross-reference/impact analysis | 33 lessons under `rpgle-beginner` plus the `rpgle-intermediate` ILE batch | `rpgle-foundations`, `rpgle-file-io` practice topics | The deepest, strongest track in the whole curriculum for the modern free-form path. The fixed-format/RPG III/legacy-cycle material is **intentionally not taught** — a defensible, modern-first design choice, not an oversight, but it should be stated explicitly rather than left implicit (see Gap #6 below). |
| 9 | COBOL on IBM i | Not Covered | P2 | — | Everything: basics, divisions, file handling, COBOL/DB2 integration, ILE COBOL | — | None | Zero COBOL content anywhere in the catalog. Per interpretation guidance, this must be reported honestly and separately — it is **not** folded into or implied by the RPGLE coverage. This is a deliberate scope choice (RPG-first curriculum), not a hidden gap, but it should be stated as a positioning decision. |
| 10 | ILE (Integrated Language Environment) Concepts | Fully Covered | P2 | Modules/programs/service programs, binding (CRTRPGMOD/CRTPGM/CRTSRVPGM), binding directories, prototypes/procedure interfaces, internal vs exported procedures, activation groups (incl. troubleshooting), binder source, signatures, safe service-program updates, ILE debugging, common mistakes | Explicit "static vs dynamic binding" terminology/contrast; cross-language procedure calls (e.g. RPG calling COBOL); deeper ILE exception-handling APIs (CEE*, condition handling) beyond MONITOR/%ERROR | 16 lessons under `rpgle-intermediate`, e.g. `modules-programs-and-service-programs.md`, `binding-directories-basics.md`, `activation-group-problems-and-common-confusions.md`, `common-ile-mistakes-and-best-practices.md` | None dedicated (practice questions for ILE/Integration lessons do not yet exist — see Gap #8) | A genuine strength; this is professional-depth material, reviewed twice (PR #104, PR #107) with zero issues found each time. |
| 11 | Screen & UI Development | Fully Covered | P2 | DDS display files, all major subfile patterns (load-all, page-at-a-time, RRN, SFLEND, option fields, row selection, update/delete, SFLNXTCHG), window/popup records, function keys, field validation, error messages, best practices | Expandable subfiles specifically named as a variant, custom DDS-based menu building, message subfiles (distinct from single ERRMSG), modern UI alternatives (PHP/Node/Java web front ends) | 32 lessons under `display-files-and-subfiles` | `display-files`, `subfiles` practice topics | Second-deepest track in the curriculum. "Modern UI alternatives" is intentionally deferred to the Modernization/API track's conceptual framing rather than duplicated here — reasonable, but worth a cross-link. |
| 12 | Printer & Report Programming | Partially Covered | P1 | DDS printer files, spool files & output queues (WRKSPLF/WRKOUTQ), report headings/detail/totals/page breaks/overflow, overrides, debugging report output | PDF/HTML output — **not covered at all** | 16 lessons under `printer-files-and-reports` | `printer-files` practice topic | Excellent for traditional green-screen/spool reporting. PDF/HTML output is a common real-world need and a natural bridge to the Modernization track. |
| 13 | Security on IBM i | Partially Covered | **P0** | Basic object authority concepts, authority-failure troubleshooting, beginner-level API authentication/authorization/HTTPS/least-privilege | Authorization Lists, Adopted Authority, QSECURITY system value, Exit Points/Exit Programs, Auditing (QAUDJRN), Authority Collection, Row and Column Access Control (RCAC), Field Procedures/encryption, Digital Certificates/TLS setup, MFA, IFS-specific security | `authorities-and-object-access-basics.md`, `authority-failures-and-how-to-investigate-them.md`, `securing-ibm-i-apis-at-a-beginner-level.md` | None dedicated | Per interpretation guidance, this category is intentionally broad and the audit distinguishes basic authority/object access (present) from advanced native security topics (absent). Currently the thinnest topic relative to its real-world importance. |
| 14 | Job & Work Management | Partially Covered | P1 | Jobs, job queues, interactive vs batch, submitted jobs (WRKSBMJOB), job logs in batch jobs, job status values, basic job scheduling, WRKACTJOB, DSPJOB | Subsystem Descriptions (creating/configuring, routing entries), Autostart Job Entries, Job Descriptions (JOBD objects), Memory/Storage Pools, WRKSYSACT (system-wide performance) | 17 lessons under `ibm-i-operations`, e.g. `ibm-i-jobs-explained.md`, `subsystems-basics.md`, `submitted-jobs-and-wrksbmjob.md` | `ibm-i-operations` practice topic | Per interpretation guidance: developer-level job/subsystem concepts are solid; admin/performance-level work management is the gap. |
| 15 | System Administration | Not Covered | P2 | — | System values, network attributes, TCP/IP config, device config, profile management (admin side), PTFs/software install, license management, backup & recovery strategy, ASPs, HA/replication basics, DR planning | — | None | Correctly out of scope for a developer-focused curriculum today; should not be overclaimed, per interpretation guidance. |
| 16 | Journaling & Commitment Control | Not Covered | **P1** | — | Journals/journal receivers, journaling setup (STRJRNPF/STRJRN), commitment control (STRCMTCTL), journal-based auditing, remote journaling | — | None | **Zero mentions anywhere in 240 lessons.** Unlike most other "Not Covered" categories, journaling is genuinely foundational (not just enterprise/advanced) and is commonly discussed even with junior IBM i developers — this is a surprising and notable complete gap, not merely a specialization the curriculum has chosen to skip. |
| 17 | APIs & System Interfaces | Partially Covered | P1 | Data Areas (CLLE) | Program-callable APIs (e.g. QCMDEXC-style), User Spaces, Data Queues, QSHELL | `data-areas-in-clle.md` | None dedicated | **Important disambiguation:** this master category means native IBM i system APIs (data queues, user spaces, QSHELL, program-callable APIs). It is a completely different meaning of "API" from the `integration-and-modernization` track's REST/web API content (which maps instead to master category #21). Do not conflate the two when reporting curriculum strength. |
| 18 | IFS (Integrated File System) | Partially Covered | P2 | Directory structure basics, stream files vs database files (native objects), IFS as an integration payload/log location | IFS-specific commands (WRKLNK, CPY, MD, RMVLNK) at the command level, NetServer/network drive mapping, mounting IFS | `ifs-basics-for-ibm-i-beginners.md`, `native-objects-vs-stream-files.md`, `ifs-and-api-payload-files.md` | None dedicated | Good conceptual foundation reused well by the Integration track; command-level IFS operations are the gap. |
| 19 | Modern Development Tools | Not Covered | **P1** | ILE Debugger concept is covered extensively via STRDBG (counts toward category 8/10, not this one) | RDi, VS Code for i / Code for IBM i extension, Merlin, Git integration, SEU/PDM (legacy), source-member-vs-IFS-source tooling workflow | `source-physical-files-and-source-members.md` touches source members conceptually but not tooling | None | Most real IBM i shops today develop with RDi or VS Code + Code for IBM i + Git. This is a modern, practical, job-readiness-relevant gap that is currently a complete blank — arguably a higher-value near-term investment than several P0/P1 native-admin topics. |
| 20 | Web & Open Source on IBM i | Not Covered | P2 | ACS overview only | HTTP Server (Apache), PHP (Zend Server), Node.js, Python, Java, open source package management (yum/RPM) | `ibm-i-access-client-solutions-overview.md` | None | Niche/specialized relative to the curriculum's current developer focus; reasonable to defer. |
| 21 | Integration & Connectivity | Partially Covered | P1 | REST API concepts, calling external APIs, exposing IBM i logic as an API, JSON, request/response design, error handling, security basics, batch-vs-real-time, debugging integrations | ODBC/JDBC, SOAP, MQ Series (explicitly out of scope by the Integration batches' own stated content guidance), FTP, SMTP/mail, EDI basics, cloud connectivity, Db2 Web Query/BI tools | 16 lessons under `integration-and-modernization` | None dedicated | The REST/API/JSON/integration-thinking content is genuinely good and reviewed clean twice (PR #107, PR #109). ODBC/JDBC and FTP/SMTP are the most commonly-needed missing pieces for real-world integration work. |
| 22 | Backup, High Availability & Enterprise Tooling | Not Covered | P2 | — | BRMS, PowerHA for i, Db2 Mirror for i, third-party job schedulers, tape/virtual tape management (SAVSYS, GO SAVE) | — | None | Enterprise/admin specialization; correctly out of scope for now per interpretation guidance ("should not be overclaimed"). |
| 23 | Legacy & Query Tools | Not Covered | P2 | — | Query/400 (WRKQRY), OPNQRYF, Db2 Web Query/BI reporting, OMNIFIND text search | — | None | Legacy tooling, lower priority but still occasionally encountered in real shops. |
| 24 | Change Management & DevOps | Not Covered | **P1** | — | Source control (Git/ARCAD/Aldon), change management tools (Turnover/SCMi), CI/CD pipelines, automated testing, version control best practices | — | None | Increasingly expected for a "modern IBM i developer" job-readiness story; pairs naturally with Modern Development Tools (#19) and the Modernization track. |
| 25 | Performance Tuning | Not Covered | P2 | — | Performance analysis tools (Navigator for i, PDI), query optimization, resource monitoring, disk I/O tuning, memory pool tuning | — | None | Advanced/specialized; appropriate for later expansion. |
| 26 | Modernization Topics | Partially Covered | P1 | Modernization mindset (integration, not replacement), API-fying legacy apps, why APIs matter | RPG free-format conversion (as an explicit topic), legacy screen → web/mobile modernization, low-code/no-code integration, **AI/ML integration with IBM i data**, explicit Rehost/Refactor/Replace strategy framing | `modern-ibm-i-development-overview.md`, `exposing-ibm-i-logic-as-an-api.md`, `why-apis-matter-on-ibm-i.md` | None dedicated | The AI/ML-integration gap is notable given IBMiHub AI's own "AI-powered" positioning — currently the platform teaches *about* APIs but not *how IBM i data could feed AI/ML workflows*, which would be an on-brand, differentiated addition. |
| 27 | Career & Certification Path | Partially Covered | P1 | Interview roadmap, resume points, common interview mistakes, mock interviews, explaining project experience, scenario-based practice across RPGLE/CLLE/SQLRPGLE/debugging/subfiles | IBM i certifications overview, common career roles (dev vs admin vs ops vs modernization specialist), industry use cases, community & resources (COMMON, forums) | 16 lessons under `interview-and-professional-readiness` | `interview-readiness` practice topic | Strong, hands-on interview-prep content. Correctly avoids fake certification/placement/salary claims (per governing content rules already in effect) — the gap is informational (what certifications/roles/communities exist), not promotional. |

---

## A. Executive Summary

**Overall curriculum strength:** The shipped curriculum (240 Published lessons, 112 practice questions) is genuinely strong and technically well-reviewed for a **beginner-to-intermediate, hands-on IBM i developer path**, with a credible first step into **professional-depth ILE and API/integration thinking**. Every lesson batch in this project's history has gone through at least one dedicated review pass, and repeated fresh re-reads (PR #104, #107, #109, and this audit) have found the existing content technically accurate and free of stale/false claims.

**Strongest areas** (Fully Covered, professional-grade depth):
- RPG Programming — free-form RPGLE end to end (49 lessons across beginner + ILE)
- ILE Concepts — modules/programs/service programs/binding/activation groups (16 lessons, zero issues found across two independent reviews)
- Screen & UI Development — display files and every major subfile pattern (32 lessons)
- CL Programming — CLLE end to end (17 lessons)

**Weakest areas** (Not Covered or thin relative to real-world importance):
- **Security on IBM i (P0)** — only basic object-authority concepts exist; authorization lists, adopted authority, auditing, RCAC, exit points are entirely absent.
- **SQL on IBM i (P0)** — beginner SQLRPGLE is solid, but stored procedures, triggers, UDFs, constraints, and DDL are entirely absent.
- **Journaling & Commitment Control** — a complete, surprising zero despite being foundational IBM i knowledge.
- **Modern Development Tools / DevOps (P1)** — RDi, VS Code for i, Git, CI/CD are entirely absent despite being how real IBM i shops actually work today.
- Several enterprise/admin categories (System Administration, Backup/HA/Enterprise Tooling, Performance Tuning) are correctly Not Covered and should stay deferred rather than overclaimed.

**Is the curriculum strong enough for a beginner/job-ready beta?** **Yes.** The core hands-on skills (RPGLE, CLLE, display files/subfiles, printer files, SQLRPGLE basics, debugging, IBM i operations for developers, ILE, and now API/integration thinking) are deep, technically sound, and paired with genuinely useful interview/career-readiness content and 112 practice questions. This supports a confident "learn IBM i development from zero to job-ready fundamentals" positioning.

**Is the curriculum strong enough for a blanket "professional/advanced" claim?** **Not yet, across the board.** The RPGLE/ILE/screen-programming/debugging depth genuinely earns a "professional" label in those specific areas. But a platform-wide "professional IBM i development" claim would currently overreach given the P0 gaps in Security and advanced SQL, and the complete absence of Journaling and modern tooling/DevOps content. Recommendation: keep any "professional" or "advanced" marketing language scoped to the areas that actually earn it today, rather than applying it uniformly.

---

## B. Top 10 Most Important Gaps

1. **SQL on IBM i — stored procedures, triggers, UDFs, constraints, DDL**
   *Why it matters:* SQL depth is core to virtually all modern IBM i development work; the current curriculum stops at beginner embedded-SQL basics.
   *Current status:* Partially Covered, P0.
   *Recommended next batch:* "Advanced SQL for IBM i Batch 1" (see Recommended PR #1 below).
   *Suggested lesson titles:* "Creating Tables and Constraints with DDL", "Writing a Simple SQL Stored Procedure", "Native and SQL Triggers on IBM i", "User-Defined Functions (UDFs) Basics", "Dynamic vs Static SQL Explained".

2. **Security on IBM i — authorization lists, adopted authority, auditing, RCAC**
   *Why it matters:* Security is a core professional/job-readiness topic and a common interview subject; currently only the most basic object-authority concept is taught.
   *Current status:* Partially Covered, P0.
   *Recommended next batch:* "IBM i Security Fundamentals Batch 1" (see Recommended PR #2 below).
   *Suggested lesson titles:* "Authorization Lists Explained", "What is Adopted Authority?", "Introduction to QAUDJRN and Auditing", "Exit Points and Exit Programs Basics", "Row and Column Access Control (RCAC) at a Beginner Level".

3. **Journaling & Commitment Control — entirely absent**
   *Why it matters:* Journaling underlies data integrity, recovery, and commitment control on IBM i and is foundational knowledge, not merely advanced/enterprise trivia.
   *Current status:* Not Covered.
   *Recommended next batch:* "Journaling and Commitment Control Basics" (see Recommended PR #3 below).
   *Suggested lesson titles:* "What is Journaling on IBM i?", "Starting Journaling with STRJRNPF and STRJRN", "Commitment Control Basics with STRCMTCTL", "Why Journals Matter for Recovery and Auditing".

4. **Save/Restore — SAVOBJ, RSTOBJ, SAVLIB entirely absent**
   *Why it matters:* Backup/restore is one of the most basic, universally-needed IBM i skills; its complete absence is a surprising gap for a curriculum this deep elsewhere.
   *Current status:* Not Covered (within Object & Library Management).
   *Recommended next batch:* "Save/Restore and Object Backup Basics" (see Recommended PR #4 below).
   *Suggested lesson titles:* "Saving Objects with SAVOBJ", "Restoring Objects with RSTOBJ", "Saving and Restoring a Library with SAVLIB/RSTLIB", "Duplicating Objects with CRTDUPOBJ".

5. **Modern Development Tools — RDi, VS Code for i, Git, Merlin**
   *Why it matters:* This is how real IBM i shops develop today; its absence undercuts a "job-ready" claim more than most enterprise/admin gaps.
   *Current status:* Not Covered.
   *Recommended next batch:* "Modern IBM i Developer Tooling Overview" (see Recommended PR #5 below).
   *Suggested lesson titles:* "RDi and VS Code for i: What's the Difference?", "Source Members vs IFS Source in Practice", "Git Basics for IBM i Developers", "Using the Code for IBM i / Merlin Extension".

6. **RPG III / fixed-format legacy path — intentionally absent but undocumented as a choice**
   *Why it matters:* Learners and reviewers may reasonably ask "why isn't fixed-format RPG covered?" A short, explicit lesson or note framing this as a deliberate modern-first choice (with a pointer to what fixed-format looks like conceptually) closes an easy credibility gap cheaply.
   *Current status:* Not Covered (by design).
   *Recommended next batch:* Could be a single lesson added to a future RPG-related batch rather than a standalone PR.
   *Suggested lesson title:* "RPG III, Fixed-Format, and Why This Course Teaches Free-Form".

7. **Modern Development Tools / DevOps — Git, CI/CD, change management**
   *Why it matters:* Pairs with #5; version control and change management are now baseline expectations even at many traditional IBM i shops.
   *Current status:* Not Covered.
   *Recommended next batch:* Could be folded into the same batch as #5, or its own follow-up.
   *Suggested lesson titles:* "Why Version Control Matters for IBM i Development", "CI/CD Concepts for IBM i Teams".

8. **APIs & System Interfaces (native) — Data Queues, User Spaces, QSHELL**
   *Why it matters:* These are common building blocks for IBM i-native automation and integration, distinct from the REST/web API content already covered.
   *Current status:* Partially Covered.
   *Recommended next batch:* Could extend a future Integration batch or a dedicated "Native IBM i APIs" mini-batch.
   *Suggested lesson titles:* "Data Queues Basics", "Introduction to User Spaces", "What is QSHELL?".

9. **AI/ML Integration with IBM i Data — zero coverage despite the platform's own AI positioning**
   *Why it matters:* IBMiHub AI is an AI-powered learning platform; teaching how IBM i data can feed AI/ML workflows would be a natural, differentiated, on-brand addition once core integration content is more complete.
   *Current status:* Not Covered (within Modernization Topics).
   *Recommended next batch:* Best positioned as a follow-up to the existing Integration/Modernization track rather than an immediate priority.
   *Suggested lesson title:* "How IBM i Data Can Feed AI and Analytics Workflows (Conceptual Overview)".

10. **Practice question coverage for Advanced RPGLE/ILE and Modern IBM i/APIs/Integration**
    *Why it matters:* All 32 lessons across these two professional-depth tracks currently have **zero** matching practice questions (`content/practice/questions.ts` has no ILE or integration topic IDs at all), while every beginner/foundation track has dedicated practice coverage.
    *Current status:* Not Covered (practice-question gap specifically, not lesson-content gap).
    *Recommended next batch:* A practice-questions-only batch extending the existing practice format to these two tracks — no new lessons needed, purely additive practice content.
    *Suggested scope:* ~16-24 new practice questions across two new topic IDs (e.g. `rpgle-ile`, `integration-and-modernization`).

---

## C. Launch Impact Classification

- **Launch blockers:** None identified. No shipped content was found to be false, broken, or misleading. The gaps below are about *completeness*, not correctness — nothing here should block a beta launch on its own.

- **Should fix before wider public launch** (if launch messaging claims "professional" or "job-ready across the full stack"):
  - SQL on IBM i — stored procedures/triggers/UDFs/constraints/DDL (P0)
  - Security on IBM i — authorization lists/adopted authority/auditing/RCAC (P0)

- **Can be added after public beta:**
  - Journaling & Commitment Control
  - Save/Restore (Object & Library Management)
  - Modern Development Tools (RDi/VS Code/Git/Merlin) and Change Management & DevOps
  - Job & Work Management — admin/performance-level (subsystem descriptions, memory pools, WRKSYSACT)
  - Integration & Connectivity — ODBC/JDBC, FTP, SMTP, EDI
  - Modernization Topics — screen modernization, low-code, AI/ML integration
  - Career & Certification Path — certifications overview, industry use cases, community resources
  - Practice question coverage for Advanced RPGLE/ILE and Integration tracks
  - PDF/HTML report output (Printer & Report Programming)
  - Database Design & Advanced DB2 for i (normalization, FIELDPROC, cross-reference files)
  - APIs & System Interfaces (native: data queues, user spaces, QSHELL)
  - IFS command-level operations, NetServer/mounting

- **Long-term professional/enterprise expansion:**
  - System Administration
  - Backup, High Availability & Enterprise Tooling (BRMS, PowerHA, Db2 Mirror)
  - Performance Tuning
  - Legacy & Query Tools (Query/400, OPNQRYF, OMNIFIND)
  - Web & Open Source on IBM i (Apache, PHP, Node.js, Python, Java, package management)
  - COBOL on IBM i (if the platform ever decides to broaden beyond RPG-first)
  - IBM i Platform Fundamentals depth (TIMI/Single-Level Storage, LPAR/virtualization, licensing)

---

## D. Topics Covered in Current Curriculum But Not Clearly in Master List

| Topic | Source Lesson(s) | Keep / Merge / Rename / Cut | Reason |
|---|---|---|---|
| Mini Projects / Real-World Projects (capstone applied lessons combining RPGLE, CLLE, SQL, subfiles, debugging) | 16 lessons under `real-world-projects` | **Keep** | Not a distinct master-list topic category, but a pedagogical format that reinforces multiple master categories at once. Genuinely valuable, no cutting warranted. |
| Debugging & Job Logs as a first-class track | 17 lessons under `debugging-and-job-logs`, plus debugging lessons embedded in RPGLE file I/O, subfiles, printer files, ILE, and Integration tracks | **Keep** | The master list treats debugging as a subtopic within categories 3, 8, and 14 rather than its own category. IBMiHub AI's choice to make it a first-class, dedicated track is a strength, not a mismatch — recommend no change. |
| Interview & Professional Readiness — scenario-based practice, mock interviews, resume points | 16 lessons under `interview-and-professional-readiness` | **Keep** | Maps to master category 27 (Career & Certification Path) but goes further into practical interview simulation than the master list describes. This is additive value, not a gap to fix. |

No topics were found that seem entirely unrelated to the master list or candidates for removal.

---

## E. Duplicate or Overlapping Areas

*(Identified for awareness only — no lessons or metadata were modified.)*

- **Debugging content is fragmented across ~8 different contexts** (RPGLE file I/O, subfiles, printer files, ILE, Integration, plus the dedicated `debugging-and-job-logs` track). This is not accidental duplication — each lesson is genuinely scoped to its own context (e.g. debugging a subfile program vs. debugging an API integration) — but it does mean there is no single "debugging index" a learner can browse. **Recommendation:** keep all lessons as-is; consider a future cross-linking or navigation aid (not a content change) that surfaces the full debugging surface area in one place.

- **"Common X Mistakes and Best Practices" capstone lessons** appear at the end of nearly every track (CLLE, display files, subfiles, printer files, RPGLE file I/O, SQLRPGLE, IBM i operations, ILE, Integration). This is a deliberate, consistent pedagogical pattern established early in the curriculum's history and repeated intentionally. **Recommendation:** keep — this is a consistency strength, not overlap requiring cleanup.

- **SQL content currently lives entirely in `sql-for-ibm-i`** (`difficultySpan: 'Beginner → Advanced'` in `tracks.ts`), but no Advanced-level SQL lessons exist yet despite the track already being declared to span that range. **Recommendation:** when advanced SQL content (Gap #1) is authored, extend this existing track in place rather than creating a new one — the track's declared difficulty span already anticipates this, so no `tracks.ts` change is needed, only new lessons.

- **`rpgle-advanced` track exists in `tracks.ts` with 0 lessons.** The Advanced RPGLE/ILE batches (PR #102/#103) were deliberately placed in `rpgle-intermediate` instead, per that batch's own documented reasoning (difficulty stayed `'intermediate'` throughout). This leaves `rpgle-advanced` as a currently-empty placeholder. **Recommendation:** keep as a reserved placeholder for genuinely advanced-only content (e.g. if RPG III/legacy material or deeper performance-tuning-adjacent RPG content is ever authored), rather than removing it — but flag it in any future track cleanup as intentionally empty, not forgotten.

---

## F. Recommended Next 5 PRs

1. **PR Title:** Advanced SQL for IBM i Batch 1
   **Goal:** Cover DDL (CREATE TABLE/INDEX/VIEW), constraints (PK/FK/Check/Unique), a simple SQL PL stored procedure, native and SQL triggers, and UDF basics.
   **Why it matters:** Closes the single largest P0 gap; SQL depth is core to modern IBM i development.
   **Rough scope:** ~8 lessons, extending the existing `sql-for-ibm-i` track (already declared Beginner → Advanced).
   **Type:** Content.

2. **PR Title:** IBM i Security Fundamentals Batch 1
   **Goal:** Cover authorization lists, adopted authority, QSECURITY system value, exit points/exit programs, and an introduction to QAUDJRN/auditing.
   **Why it matters:** Closes the second P0 gap; security is a core professional/interview topic currently very thin.
   **Rough scope:** ~8 lessons; likely needs a new track (e.g. `security-and-compliance`) since security-basics content currently lives inside `ibm-i-operations`.
   **Type:** Content.

3. **PR Title:** Journaling and Commitment Control Basics
   **Goal:** Cover what journaling is and why it matters, STRJRNPF/STRJRN, commitment control with STRCMTCTL, and journal-based auditing at a conceptual level.
   **Why it matters:** Currently a complete, surprising zero despite being foundational IBM i knowledge.
   **Rough scope:** 5-6 lessons.
   **Type:** Content.

4. **PR Title:** Save/Restore and Object Backup Basics
   **Goal:** Cover SAVOBJ, RSTOBJ, SAVLIB/RSTLIB, and CRTDUPOBJ conceptually for developers (not full admin/DR depth).
   **Why it matters:** Fills a surprising, basic-level gap in Object & Library Management.
   **Rough scope:** 4-5 lessons, likely extending `libraries-objects-and-ifs`.
   **Type:** Content.

5. **PR Title:** Modern IBM i Developer Tooling Overview
   **Goal:** Conceptual overview of RDi vs VS Code for i, the Code for IBM i / Merlin extension, source members vs IFS source in modern workflows, and Git basics for IBM i developers.
   **Why it matters:** This is how real IBM i shops develop today; a job-readiness-relevant gap that may matter more to hiring conversations than several deeper admin topics.
   **Rough scope:** 6-8 lessons; likely a new track (e.g. `modern-dev-tools`) or an extension of `integration-and-modernization`.
   **Type:** Content.

*(Not ranked in the top 5, but flagged as a fast, low-risk follow-up: a practice-questions-only PR adding practice coverage for the existing Advanced RPGLE/ILE and Modern IBM i/APIs/Integration tracks — see Gap #10 above. This requires no new lessons and could realistically ship before or alongside PR #1.)*

---

## G. Suggested Track/Navigation Adjustments

*(Recommendations only — nothing here is implemented in this PR.)*

- **Extend `sql-for-ibm-i` in place** for advanced SQL content (Recommended PR #1) rather than creating a new track — its `difficultySpan` already declares `'Beginner → Advanced'`.
- **Consider a new `security-and-compliance` track** once security content (Recommended PR #2) is authored. Today, `authorities-and-object-access-basics.md` and `authority-failures-and-how-to-investigate-them.md` live inside `ibm-i-operations`, which was reasonable when security was only a passing developer-operations concern, but will feel misplaced once a dedicated security batch exists.
- **Consider a new `journaling-and-commitment-control` track** (Recommended PR #3) rather than folding it into `db2-for-i-and-dds`, to keep it cleanly aligned with the master list's own dedicated category.
- **Consider a new `modern-dev-tools` track** (or an extension of `integration-and-modernization`) for RDi/VS Code/Git/DevOps content (Recommended PR #5 and Gap #7).
- **Resolve the empty `rpgle-advanced` track** — either reserve it explicitly (documented) for future legacy/RPG III or deep advanced-only content, or remove it if the team decides that split will never happen. No urgency, but it should be a conscious decision rather than an oversight.
- **`lib/topics.ts` (added in PR #108) will need a matching topic filter entry for every new track added above** — this has already been demonstrated as a small, additive, low-risk change (two new filters were added there for the ILE and Integration tracks) and should be repeated for any new track from this audit's recommendations.
- **Practice question topic IDs (`content/practice/questions.ts`)** should also get new topic IDs whenever a new track is added, matching the existing one-topic-ID-per-track-ish pattern already in use, to avoid repeating the current gap where two entire tracks (32 lessons) have no practice questions at all.

---

## Validation Results

This PR is documentation-only. The following validation was run to confirm nothing else changed:

- `npm run seed` — 240 succeeded, 0 failed (unchanged from PR #109)
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — clean

## Manual QA

- `/learn` loads correctly, still shows 240 lessons published
- `/practice` still loads
- AI Tutor still opens
- No lesson metadata, tracks, or practice content was modified
- No auth/progress/lesson-gating code was touched
- `git status` shows only this new planning document added
