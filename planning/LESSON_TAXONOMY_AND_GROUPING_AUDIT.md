# Lesson Taxonomy & Logical Grouping Audit

**Date:** 2026-07-15
**Author:** Audit performed as PR #120, following PR #119 (Save/Restore and Object Backup Basics).
**Purpose:** Propose a logical category/subcategory mapping for the full 288-lesson IBM i / AS400 curriculum against the 27-category master topic list (from `planning/IBM_I_MASTER_TOPIC_COVERAGE_AUDIT.md`, PR #110), and assess whether the current flat file layout and `trackId`/`moduleId`/topic-filter grouping is still the right structure as the catalog has grown.

**This PR is analysis/documentation only.** No lesson files were moved or renamed, no slugs changed, no routes changed, no metadata changed, and no application behavior changed. `git status` at the end of this PR shows only this new planning document.

**Method:** Every one of the 288 records in `content/lessons/metadata.ts` was read (slug, title, `lessonOrder`, `trackId`, `moduleId`, `tags`, `status`), cross-referenced against `content/lessons/tracks.ts` (18 declared tracks), `lib/topics.ts` (19 topic filters), `lib/lessons.ts` (content-loading and slug-resolution logic), `scripts/seed-lessons.ts` (what actually gets pushed to Supabase), `app/learn` routes (how URLs are built), and `content/practice/questions.ts` (96 practice questions across 16 practice topic IDs). Markdown files were read directly wherever a title/tag alone left real ambiguity (e.g. the Save/Restore batch, `backup-vs-journaling-vs-high-availability`, `data-areas-in-clle`).

**Current catalog state at time of audit:** 288 lesson records — 280 Published, 8 Review Ready (the PR #119 Save/Restore batch, still pending its own publish pass). No lessons, tracks, topic filters, or practice questions were modified as part of this audit.

---

## Coverage Status Definitions

Confidence values used in the table below:
- **High** — clearly belongs to this category.
- **Medium** — reasonable fit, but genuinely overlaps another category (secondary category listed).
- **Low** — ambiguous; flagged for Product Owner review rather than force-fit.

Rows marked **Uncategorized** could not be reduced to a single primary category without misrepresenting their content, per the instruction not to force-fit ambiguous lessons.

---

## Master Lesson-Level Table (all 288 lessons)

| Current Order | Current Slug | Current Title | Current trackId | Current moduleId | Proposed Master Category | Proposed Subcategory/Topic | Secondary Category, if any | Confidence | Notes/Ambiguity |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `what-is-ibm-i` | What is IBM i? | `ibm-i-foundations` | `what-ibm-i-is` | 1. IBM i Platform Fundamentals | What IBM i Is |  | High |  |
| 2 | `why-ibm-i-still-matters` | Why IBM i Still Matters | `ibm-i-foundations` | `why-ibm-i-still-matters` | 1. IBM i Platform Fundamentals | Why IBM i Still Matters |  | High |  |
| 3 | `ibm-i-platform-overview` | IBM i Platform Overview | `ibm-i-foundations` | `the-big-picture-map` | 1. IBM i Platform Fundamentals | The Big Picture Map |  | High |  |
| 4 | `libraries-and-objects` | Libraries and Objects | `libraries-objects-and-ifs` | `objects-and-libraries` | 4. Object & Library Management | Objects And Libraries |  | High |  |
| 5 | `5250-screen-basics` | 5250 Screen Basics | `5250-terminal-and-commands` | `5250-basics` | 2. 5250 Terminal & Navigation | 5250 Basics |  | High |  |
| 6 | `physical-files-and-logical-files` | Physical Files and Logical Files | `db2-for-i-and-dds` | `physical-and-logical-files` | 5. Database Fundamentals | Physical And Logical Files |  | High |  |
| 7 | `introduction-to-rpgle` | Introduction to RPGLE | `rpgle-beginner` | `what-rpgle-is` | 8. RPG Programming | What RPGLE Is |  | High |  |
| 8 | `introduction-to-clle` | Introduction to CLLE | `clle` | `what-clle-is` | 3. CL Programming | What CLLE Is |  | High |  |
| 9 | `introduction-to-db2-for-i` | Introduction to Db2 for i | `db2-for-i-and-dds` | `db2-for-i` | 5. Database Fundamentals | Db2 For i |  | High |  |
| 10 | `job-logs-and-spool-files-basics` | Job Logs and Spool Files Basics | `debugging-and-job-logs` | `job-logs-and-spool-files-basics` | 14. Job & Work Management | Job Logs And Spool Files Basics | 12 | Medium |  |
| 11 | `basic-ibm-i-development-workflow` | Basic IBM i Development Workflow | `ibm-i-operations` | `basic-development-workflow` | 1. IBM i Platform Fundamentals | Basic Development Workflow | 2, 14 | Low | General onboarding lesson spanning commands/jobs/platform; trackId is ibm-i-operations but content is broader orientation. |
| 12 | `where-to-go-next` | Where to Go Next | `ibm-i-foundations` | `where-to-go-next` | 1. IBM i Platform Fundamentals | Where To Go Next |  | Low | Meta/orientation lesson (course navigation), thin fit to Platform Fundamentals. |
| 13 | `as400-iseries-and-ibm-i-naming-explained` | AS/400, iSeries, and IBM i Naming Explained | `ibm-i-foundations` | `what-ibm-i-is` | 1. IBM i Platform Fundamentals | What IBM i Is |  | High |  |
| 14 | `ibm-i-access-client-solutions-overview` | IBM i Access Client Solutions Overview | `5250-terminal-and-commands` | `5250-basics` | 2. 5250 Terminal & Navigation | 5250 Basics |  | High |  |
| 15 | `signing-on-user-profiles-and-current-library` | Signing On, User Profiles, and Current Library | `5250-terminal-and-commands` | `system-values-and-signing-on` | 2. 5250 Terminal & Navigation | System Values And Signing On |  | High |  |
| 16 | `ibm-i-command-structure` | Understanding IBM i Command Structure | `5250-terminal-and-commands` | `navigating-menus-and-command-entry` | 2. 5250 Terminal & Navigation | Navigating Menus And Command Entry |  | High |  |
| 17 | `using-f4-prompt-and-command-help` | Using F4 Prompt and Command Help | `5250-terminal-and-commands` | `command-parameters-and-prompting` | 2. 5250 Terminal & Navigation | Command Parameters And Prompting |  | High |  |
| 18 | `common-ibm-i-object-types` | Common IBM i Object Types | `libraries-objects-and-ifs` | `common-object-types` | 4. Object & Library Management | Common Object Types |  | High |  |
| 19 | `library-list-explained-in-depth` | Library List Explained in Depth | `libraries-objects-and-ifs` | `library-list-in-depth` | 4. Object & Library Management | Library List In Depth |  | High |  |
| 20 | `source-physical-files-and-source-members` | Source Physical Files and Source Members | `libraries-objects-and-ifs` | `source-members` | 4. Object & Library Management | Source Members | 19 | Medium | Source-member management also touches the Modern Dev Tools gap (source members vs IFS source workflow). |
| 21 | `ifs-basics-for-ibm-i-beginners` | IFS Basics for IBM i Beginners | `libraries-objects-and-ifs` | `ifs-basics` | 18. IFS | IFS Basics | 4 | High |  |
| 22 | `native-objects-vs-stream-files` | Native Objects vs Stream Files | `libraries-objects-and-ifs` | `native-objects-vs-stream-files` | 18. IFS | Native Objects Vs Stream Files | 4 | Medium |  |
| 23 | `object-naming-and-qualified-names-in-practice` | Object Naming and Qualified Names in Practice | `libraries-objects-and-ifs` | `object-naming-and-qualification` | 4. Object & Library Management | Object Naming And Qualification |  | High |  |
| 24 | `working-with-wrkobj-dspobjd-and-wrklib` | Working with WRKOBJ, DSPOBJD, and WRKLIB | `libraries-objects-and-ifs` | `common-object-commands` | 4. Object & Library Management | Common Object Commands |  | High |  |
| 25 | `dds-and-sql-two-ways-to-define-db2-for-i-data` | DDS and SQL: Two Ways to Define Db2 for i Data | `db2-for-i-and-dds` | `dds-vs-sql-orientation` | 5. Database Fundamentals | DDS Vs SQL Orientation | 6 | Medium |  |
| 26 | `physical-files-explained-in-depth` | Physical Files Explained in Depth | `db2-for-i-and-dds` | `physical-files-in-depth` | 5. Database Fundamentals | Physical Files In Depth |  | High |  |
| 27 | `dds-field-definitions` | DDS Field Definitions | `db2-for-i-and-dds` | `dds-field-definitions` | 5. Database Fundamentals | DDS Field Definitions |  | High |  |
| 28 | `keyed-physical-files` | Keyed Physical Files | `db2-for-i-and-dds` | `keyed-physical-files` | 5. Database Fundamentals | Keyed Physical Files |  | High |  |
| 29 | `logical-files-explained-in-depth` | Logical Files Explained in Depth | `db2-for-i-and-dds` | `logical-files-in-depth` | 5. Database Fundamentals | Logical Files In Depth |  | High |  |
| 30 | `access-paths-and-why-they-matter` | Access Paths and Why They Matter | `db2-for-i-and-dds` | `access-paths` | 5. Database Fundamentals | Access Paths | 25 | Medium | Access paths/indexing border Performance Tuning; kept at foundation level here. |
| 31 | `sql-tables-vs-dds-physical-files` | SQL Tables vs DDS Physical Files | `db2-for-i-and-dds` | `sql-tables-vs-dds` | 5. Database Fundamentals | SQL Tables Vs DDS | 6 | Medium |  |
| 32 | `basic-select-on-ibm-i` | Basic SELECT on IBM i | `sql-for-ibm-i` | `basic-select` | 6. SQL on IBM i | Basic Select |  | High |  |
| 33 | `rpgle-program-structure` | RPGLE Program Structure | `rpgle-beginner` | `program-structure` | 8. RPG Programming | Program Structure |  | High |  |
| 34 | `rpgle-source-layout-and-free-format-basics` | RPGLE Source Layout and Free Format Basics | `rpgle-beginner` | `source-layout-and-free-format` | 8. RPG Programming | Source Layout And Free Format |  | High |  |
| 35 | `variables-and-data-types-in-rpgle` | Variables and Data Types in RPGLE | `rpgle-beginner` | `variables-and-data-types` | 8. RPG Programming | Variables And Data Types |  | High |  |
| 36 | `constants-and-literals-in-rpgle` | Constants and Literals in RPGLE | `rpgle-beginner` | `constants-and-literals` | 8. RPG Programming | Constants And Literals |  | High |  |
| 37 | `expressions-and-assignment-in-rpgle` | Expressions and Assignment in RPGLE | `rpgle-beginner` | `expressions-and-assignment` | 8. RPG Programming | Expressions And Assignment |  | High |  |
| 38 | `if-else-in-rpgle` | IF / ELSE in RPGLE | `rpgle-beginner` | `conditional-logic-if-else` | 8. RPG Programming | Conditional Logic If Else |  | High |  |
| 39 | `select-when-other-in-rpgle` | SELECT / WHEN / OTHER in RPGLE | `rpgle-beginner` | `conditional-logic-select` | 8. RPG Programming | Conditional Logic Select |  | High |  |
| 40 | `do-loops-and-basic-iteration-in-rpgle` | DO Loops and Basic Iteration in RPGLE | `rpgle-beginner` | `loops-and-iteration` | 8. RPG Programming | Loops And Iteration |  | High |  |
| 41 | `built-in-functions-in-rpgle` | Built-in Functions in RPGLE | `rpgle-beginner` | `built-in-functions` | 8. RPG Programming | Built In Functions |  | High |  |
| 42 | `data-structures-in-rpgle` | Data Structures in RPGLE | `rpgle-beginner` | `data-structures` | 8. RPG Programming | Data Structures |  | High |  |
| 43 | `arrays-in-rpgle` | Arrays in RPGLE | `rpgle-beginner` | `arrays` | 8. RPG Programming | Arrays |  | High |  |
| 44 | `indicators-in-modern-rpgle` | Indicators in Modern RPGLE | `rpgle-beginner` | `indicators` | 8. RPG Programming | Indicators |  | High |  |
| 45 | `procedures-and-subprocedures-in-rpgle` | Procedures and Subprocedures in RPGLE | `rpgle-beginner` | `procedures-and-subprocedures` | 8. RPG Programming | Procedures And Subprocedures |  | High |  |
| 46 | `parameters-and-prototypes-in-rpgle` | Parameters and Prototypes in RPGLE | `rpgle-beginner` | `parameters-and-prototypes` | 8. RPG Programming | Parameters And Prototypes |  | High |  |
| 47 | `basic-error-handling-in-rpgle` | Basic Error Handling in RPGLE | `rpgle-beginner` | `basic-error-handling` | 8. RPG Programming | Basic Error Handling |  | High |  |
| 48 | `debugging-rpgle-programs` | Debugging RPGLE Programs | `rpgle-beginner` | `debugging-basics` | 8. RPG Programming | Debugging Basics |  | High |  |
| 49 | `when-to-use-clle-vs-rpgle` | When to Use CLLE vs RPGLE | `clle` | `choosing-clle-vs-rpgle` | 3. CL Programming | Choosing CLLE Vs RPGLE |  | High |  |
| 50 | `clle-program-structure` | CLLE Program Structure | `clle` | `program-structure` | 3. CL Programming | Program Structure |  | High |  |
| 51 | `cl-commands-and-parameters` | CL Commands and Parameters | `clle` | `commands-and-parameters` | 3. CL Programming | Commands And Parameters |  | High |  |
| 52 | `variables-in-clle` | Variables in CLLE | `clle` | `variables` | 3. CL Programming | Variables |  | High |  |
| 53 | `if-do-and-basic-control-flow-in-clle` | IF, DO, and Basic Control Flow in CLLE | `clle` | `control-flow` | 3. CL Programming | Control Flow |  | High |  |
| 54 | `calling-rpgle-programs-from-clle` | Calling RPGLE Programs from CLLE | `clle` | `calling-programs` | 3. CL Programming | Calling Programs |  | High |  |
| 55 | `monmsg-and-basic-error-handling-in-clle` | MONMSG and Basic Error Handling in CLLE | `clle` | `error-handling` | 3. CL Programming | Error Handling |  | High |  |
| 56 | `sbmjob-and-batch-job-basics` | SBMJOB and Batch Job Basics | `clle` | `batch-jobs` | 3. CL Programming | Batch Jobs | 14 | Medium |  |
| 57 | `passing-parameters-to-clle-programs` | Passing Parameters to CLLE Programs | `clle` | `passing-parameters-to-programs` | 3. CL Programming | Passing Parameters To Programs |  | High |  |
| 58 | `calling-rpgle-programs-with-parameters-from-clle` | Calling RPGLE Programs with Parameters from CLLE | `clle` | `two-way-parameters-with-rpgle` | 3. CL Programming | Two Way Parameters With RPGLE |  | High |  |
| 59 | `working-with-ibm-i-job-attributes-in-clle` | Working with IBM i Job Attributes in CLLE | `clle` | `job-attributes` | 3. CL Programming | Job Attributes | 14 | Medium |  |
| 60 | `checking-objects-with-chkobj` | Checking Objects with CHKOBJ | `clle` | `checking-objects` | 3. CL Programming | Checking Objects | 4 | Medium |  |
| 61 | `sending-and-receiving-messages-in-clle` | Sending and Receiving Messages in CLLE | `clle` | `messages` | 3. CL Programming | Messages |  | High |  |
| 62 | `data-areas-in-clle` | Data Areas in CLLE | `clle` | `data-areas` | 17. APIs & System Interfaces | Data Areas | 3 | Medium | Data Areas are a native IBM i API/system-interface concept; CLLE is just the access language. Matches original Coverage Audit row 17 citation. |
| 63 | `using-clle-for-batch-job-orchestration` | Using CLLE for Batch Job Orchestration | `clle` | `batch-orchestration` | 3. CL Programming | Batch Orchestration | 14 | Medium |  |
| 64 | `common-clle-mistakes-and-best-practices` | Common CLLE Mistakes and Best Practices | `clle` | `best-practices` | 3. CL Programming | Best Practices |  | High |  |
| 65 | `what-is-a-display-file-in-ibm-i` | What is a Display File in IBM i? | `display-files-and-subfiles` | `what-a-display-file-is` | 11. Screen & UI Development | What A Display File Is |  | High |  |
| 66 | `5250-screen-design-basics` | 5250 Screen Design Basics | `display-files-and-subfiles` | `screen-design-basics` | 11. Screen & UI Development | Screen Design Basics |  | High |  |
| 67 | `display-file-record-formats` | Display File Record Formats | `display-files-and-subfiles` | `record-formats` | 11. Screen & UI Development | Record Formats |  | High |  |
| 68 | `input-output-and-both-fields-in-display-files` | Input Fields, Output Fields, and Both Fields | `display-files-and-subfiles` | `input-output-and-both-fields` | 11. Screen & UI Development | Input Output And Both Fields |  | High |  |
| 69 | `function-keys-and-response-indicators-in-display-files` | Function Keys and Response Indicators | `display-files-and-subfiles` | `function-keys-and-response-indicators` | 11. Screen & UI Development | Function Keys And Response Indicators |  | High |  |
| 70 | `basic-display-file-dds-keywords` | Basic Display File DDS Keywords | `display-files-and-subfiles` | `basic-dds-keywords` | 11. Screen & UI Development | Basic DDS Keywords |  | High |  |
| 71 | `rpgle-program-calling-a-display-file` | RPGLE Program Calling a Display File | `display-files-and-subfiles` | `calling-a-display-file-from-rpgle` | 11. Screen & UI Development | Calling A Display File From RPGLE |  | High |  |
| 72 | `simple-inquiry-screen-flow` | Simple Inquiry Screen Flow | `display-files-and-subfiles` | `inquiry-screen-flow` | 11. Screen & UI Development | Inquiry Screen Flow |  | High |  |
| 73 | `display-file-indicators-explained` | Display File Indicators Explained | `display-files-and-subfiles` | `indicators-explained` | 11. Screen & UI Development | Indicators Explained |  | High |  |
| 74 | `function-keys-in-more-depth` | Function Keys in More Depth | `display-files-and-subfiles` | `function-keys-in-depth` | 11. Screen & UI Development | Function Keys In Depth |  | High |  |
| 75 | `screen-field-validation-basics` | Screen Field Validation Basics | `display-files-and-subfiles` | `field-validation-basics` | 11. Screen & UI Development | Field Validation Basics |  | High |  |
| 76 | `displaying-error-messages-on-5250-screens` | Displaying Error Messages on 5250 Screens | `display-files-and-subfiles` | `error-messages` | 11. Screen & UI Development | Error Messages |  | High |  |
| 77 | `window-records-and-simple-popup-screens` | Window Records and Simple Popup Screens | `display-files-and-subfiles` | `window-records` | 11. Screen & UI Development | Window Records |  | High |  |
| 78 | `read-write-exfmt-and-screen-flow` | READ, WRITE, EXFMT, and Screen Flow | `display-files-and-subfiles` | `read-write-exfmt` | 11. Screen & UI Development | Read Write Exfmt |  | High |  |
| 79 | `basic-inquiry-screen-pattern` | Basic Inquiry Screen Pattern | `display-files-and-subfiles` | `inquiry-screen-pattern` | 11. Screen & UI Development | Inquiry Screen Pattern |  | High |  |
| 80 | `common-display-file-mistakes-and-best-practices` | Common Display File Mistakes and Best Practices | `display-files-and-subfiles` | `best-practices` | 11. Screen & UI Development | Best Practices |  | High |  |
| 81 | `what-is-a-subfile-in-ibm-i` | What is a Subfile in IBM i? | `display-files-and-subfiles` | `what-a-subfile-is` | 11. Screen & UI Development | What A Subfile Is |  | High |  |
| 82 | `subfile-record-format-vs-subfile-control-record-format` | Subfile Record Format vs Subfile Control Record Format | `display-files-and-subfiles` | `subfile-vs-control-record-format` | 11. Screen & UI Development | Subfile Vs Control Record Format |  | High |  |
| 83 | `sfldsp-sfldspctl-and-sflclr-explained` | SFLDSP, SFLDSPCTL, and SFLCLR Explained | `display-files-and-subfiles` | `sfldsp-sfldspctl-sflclr` | 11. Screen & UI Development | Sfldsp Sfldspctl Sflclr |  | High |  |
| 84 | `load-all-subfile-concept` | Load-All Subfile Concept | `display-files-and-subfiles` | `load-all-subfiles` | 11. Screen & UI Development | Load All Subfiles |  | High |  |
| 85 | `page-at-a-time-subfile-concept` | Page-at-a-Time Subfile Concept | `display-files-and-subfiles` | `page-at-a-time-subfiles` | 11. Screen & UI Development | Page At A Time Subfiles |  | High |  |
| 86 | `simple-inquiry-subfile-pattern` | Simple Inquiry Subfile Pattern | `display-files-and-subfiles` | `inquiry-subfile-pattern` | 11. Screen & UI Development | Inquiry Subfile Pattern |  | High |  |
| 87 | `function-keys-in-subfile-programs` | Function Keys in Subfile Programs | `display-files-and-subfiles` | `function-keys-in-subfiles` | 11. Screen & UI Development | Function Keys In Subfiles |  | High |  |
| 88 | `common-subfile-mistakes-and-best-practices` | Common Subfile Mistakes and Best Practices | `display-files-and-subfiles` | `best-practices` | 11. Screen & UI Development | Best Practices |  | High |  |
| 89 | `understanding-rrn-in-subfile-programs` | Understanding RRN in Subfile Programs | `display-files-and-subfiles` | `understanding-rrn` | 11. Screen & UI Development | Understanding RRN |  | High |  |
| 90 | `clearing-and-reloading-a-subfile` | Clearing and Reloading a Subfile | `display-files-and-subfiles` | `clearing-and-reloading` | 11. Screen & UI Development | Clearing And Reloading |  | High |  |
| 91 | `using-sflend-to-show-end-of-list` | Using SFLEND to Show End of List | `display-files-and-subfiles` | `sflend` | 11. Screen & UI Development | Sflend |  | High |  |
| 92 | `option-fields-in-subfile-screens` | Option Fields in Subfile Screens | `display-files-and-subfiles` | `option-fields` | 11. Screen & UI Development | Option Fields |  | High |  |
| 93 | `selecting-a-row-in-a-subfile` | Selecting a Row in a Subfile | `display-files-and-subfiles` | `selecting-a-row` | 11. Screen & UI Development | Selecting A Row |  | High |  |
| 94 | `basic-update-delete-subfile-pattern` | Basic Update/Delete Subfile Pattern | `display-files-and-subfiles` | `update-delete-pattern` | 11. Screen & UI Development | Update Delete Pattern |  | High |  |
| 95 | `introduction-to-sflnxtchg` | Introduction to SFLNXTCHG | `display-files-and-subfiles` | `sflnxtchg` | 11. Screen & UI Development | Sflnxtchg |  | High |  |
| 96 | `debugging-subfile-programs` | Debugging Subfile Programs | `display-files-and-subfiles` | `debugging-subfiles` | 11. Screen & UI Development | Debugging Subfiles |  | High |  |
| 97 | `rpgle-file-declarations-with-dcl-f` | RPGLE File Declarations with dcl-f | `rpgle-beginner` | `file-declarations` | 8. RPG Programming | File Declarations |  | High |  |
| 98 | `reading-physical-files-in-rpgle-with-read` | Reading Physical Files in RPGLE with READ | `rpgle-beginner` | `read-operation` | 8. RPG Programming | Read Operation |  | High |  |
| 99 | `understanding-eof-in-rpgle-file-processing` | Understanding %EOF in RPGLE File Processing | `rpgle-beginner` | `percent-eof` | 8. RPG Programming | Percent Eof |  | High |  |
| 100 | `chain-for-keyed-access` | CHAIN for Keyed Access | `rpgle-beginner` | `chain-keyed-access` | 8. RPG Programming | Chain Keyed Access |  | High |  |
| 101 | `understanding-found-after-chain` | Understanding %FOUND after CHAIN | `rpgle-beginner` | `percent-found` | 8. RPG Programming | Percent Found |  | High |  |
| 102 | `writing-records-with-write` | Writing Records with WRITE | `rpgle-beginner` | `write-operation` | 8. RPG Programming | Write Operation |  | High |  |
| 103 | `updating-records-with-update` | Updating Records with UPDATE | `rpgle-beginner` | `update-operation` | 8. RPG Programming | Update Operation |  | High |  |
| 104 | `deleting-records-with-delete` | Deleting Records with DELETE | `rpgle-beginner` | `delete-operation` | 8. RPG Programming | Delete Operation |  | High |  |
| 105 | `setll-in-rpgle` | SETLL in RPGLE | `rpgle-beginner` | `setll-positioning` | 8. RPG Programming | Setll Positioning |  | High |  |
| 106 | `reade-for-reading-matching-keys` | READE for Reading Matching Keys | `rpgle-beginner` | `reade-matching-keys` | 8. RPG Programming | Reade Matching Keys |  | High |  |
| 107 | `readp-and-reading-backward` | READP and Reading Backward | `rpgle-beginner` | `readp-backward-reading` | 8. RPG Programming | Readp Backward Reading |  | High |  |
| 108 | `processing-duplicate-keys-in-rpgle` | Processing Duplicate Keys in RPGLE | `rpgle-beginner` | `duplicate-keys` | 8. RPG Programming | Duplicate Keys |  | High |  |
| 109 | `basic-file-locking-concept-in-rpgle` | Basic File Locking Concept in RPGLE | `rpgle-beginner` | `file-locking-basics` | 8. RPG Programming | File Locking Basics |  | High |  |
| 110 | `handling-file-io-errors-at-a-beginner-level` | Handling File I/O Errors at a Beginner Level | `rpgle-beginner` | `file-io-error-handling` | 8. RPG Programming | File Io Error Handling |  | High |  |
| 111 | `debugging-rpgle-file-io-programs` | Debugging RPGLE File I/O Programs | `rpgle-beginner` | `file-io-debugging` | 8. RPG Programming | File Io Debugging |  | High |  |
| 112 | `common-rpgle-file-io-mistakes-and-best-practices` | Common RPGLE File I/O Mistakes and Best Practices | `rpgle-beginner` | `file-io-best-practices` | 8. RPG Programming | File Io Best Practices |  | High |  |
| 113 | `what-is-sqlrpgle` | What is SQLRPGLE? | `sql-for-ibm-i` | `sqlrpgle-basics` | 6. SQL on IBM i | Sqlrpgle Basics |  | High |  |
| 114 | `native-rpgle-file-io-vs-embedded-sql` | Native RPGLE File I/O vs Embedded SQL | `sql-for-ibm-i` | `sql-vs-native-io` | 6. SQL on IBM i | SQL Vs Native Io |  | High |  |
| 115 | `basic-exec-sql-syntax-in-rpgle` | Basic EXEC SQL Syntax in RPGLE | `sql-for-ibm-i` | `exec-sql-syntax` | 6. SQL on IBM i | Exec SQL Syntax |  | High |  |
| 116 | `host-variables-in-sqlrpgle` | Host Variables in SQLRPGLE | `sql-for-ibm-i` | `host-variables` | 6. SQL on IBM i | Host Variables |  | High |  |
| 117 | `select-into-for-reading-one-row` | SELECT INTO for Reading One Row | `sql-for-ibm-i` | `select-into` | 6. SQL on IBM i | Select Into |  | High |  |
| 118 | `using-sql-cursor-to-read-multiple-rows` | Using SQL Cursor to Read Multiple Rows | `sql-for-ibm-i` | `sql-cursor` | 6. SQL on IBM i | SQL Cursor |  | High |  |
| 119 | `insert-with-embedded-sql` | INSERT with Embedded SQL | `sql-for-ibm-i` | `embedded-sql-insert` | 6. SQL on IBM i | Embedded SQL Insert |  | High |  |
| 120 | `update-and-delete-with-embedded-sql` | UPDATE and DELETE with Embedded SQL | `sql-for-ibm-i` | `embedded-sql-update-delete` | 6. SQL on IBM i | Embedded SQL Update Delete |  | High |  |
| 121 | `sqlcode-and-sqlstate-basics-in-sqlrpgle` | SQLCODE and SQLSTATE Basics in SQLRPGLE | `sql-for-ibm-i` | `sqlcode-sqlstate-basics` | 6. SQL on IBM i | Sqlcode Sqlstate Basics |  | High |  |
| 122 | `handling-no-row-found-in-sqlrpgle` | Handling No Row Found in SQLRPGLE | `sql-for-ibm-i` | `no-row-found` | 6. SQL on IBM i | No Row Found |  | High |  |
| 123 | `fetch-loop-for-reading-multiple-rows` | FETCH Loop for Reading Multiple Rows | `sql-for-ibm-i` | `fetch-loop` | 6. SQL on IBM i | Fetch Loop |  | High |  |
| 124 | `basic-where-conditions-in-embedded-sql` | Basic WHERE Conditions in Embedded SQL | `sql-for-ibm-i` | `where-conditions` | 6. SQL on IBM i | Where Conditions |  | High |  |
| 125 | `order-by-and-result-ordering` | ORDER BY and Result Ordering | `sql-for-ibm-i` | `order-by` | 6. SQL on IBM i | Order By |  | High |  |
| 126 | `simple-join-in-sqlrpgle` | Simple JOIN in SQLRPGLE | `sql-for-ibm-i` | `simple-join` | 6. SQL on IBM i | Simple Join |  | High |  |
| 127 | `null-handling-basics-in-sqlrpgle` | NULL Handling Basics in SQLRPGLE | `sql-for-ibm-i` | `null-handling` | 6. SQL on IBM i | Null Handling |  | High |  |
| 128 | `common-sqlrpgle-mistakes-and-best-practices` | Common SQLRPGLE Mistakes and Best Practices | `sql-for-ibm-i` | `sqlrpgle-best-practices` | 6. SQL on IBM i | Sqlrpgle Best Practices |  | High |  |
| 129 | `what-is-a-printer-file-in-ibm-i` | What is a Printer File in IBM i? | `printer-files-and-reports` | `printer-file-basics` | 12. Printer & Report Programming | Printer File Basics |  | High |  |
| 130 | `printer-file-dds-basics` | Printer File DDS Basics | `printer-files-and-reports` | `printer-file-dds` | 12. Printer & Report Programming | Printer File DDS |  | High |  |
| 131 | `report-record-formats` | Report Record Formats | `printer-files-and-reports` | `report-record-formats` | 12. Printer & Report Programming | Report Record Formats |  | High |  |
| 132 | `rpgle-program-writing-to-a-printer-file` | RPGLE Program Writing to a Printer File | `printer-files-and-reports` | `rpgle-printer-file-write` | 12. Printer & Report Programming | RPGLE Printer File Write |  | High |  |
| 133 | `report-headings-and-detail-lines` | Report Headings and Detail Lines | `printer-files-and-reports` | `headings-and-detail-lines` | 12. Printer & Report Programming | Headings And Detail Lines |  | High |  |
| 134 | `page-overflow-basics` | Page Overflow Basics | `printer-files-and-reports` | `page-overflow` | 12. Printer & Report Programming | Page Overflow |  | High |  |
| 135 | `spool-files-and-output-queues` | Spool Files and Output Queues | `printer-files-and-reports` | `spool-files-and-output-queues` | 12. Printer & Report Programming | Spool Files And Output Queues | 14 | Medium |  |
| 136 | `common-printer-file-mistakes-and-best-practices` | Common Printer File Mistakes and Best Practices | `printer-files-and-reports` | `printer-file-best-practices` | 12. Printer & Report Programming | Printer File Best Practices |  | High |  |
| 137 | `report-totals-and-summary-lines` | Report Totals and Summary Lines | `printer-files-and-reports` | `report-totals` | 12. Printer & Report Programming | Report Totals |  | High |  |
| 138 | `multi-record-format-reports` | Multi-Record Format Reports | `printer-files-and-reports` | `multi-record-format-reports` | 12. Printer & Report Programming | Multi Record Format Reports |  | High |  |
| 139 | `controlling-page-breaks` | Controlling Page Breaks | `printer-files-and-reports` | `page-breaks` | 12. Printer & Report Programming | Page Breaks |  | High |  |
| 140 | `working-with-spool-files-using-wrksplf` | Working with Spool Files using WRKSPLF | `printer-files-and-reports` | `wrksplf-basics` | 12. Printer & Report Programming | Wrksplf Basics | 14 | Medium |  |
| 141 | `working-with-output-queues-using-wrkoutq` | Working with Output Queues using WRKOUTQ | `printer-files-and-reports` | `wrkoutq-basics` | 12. Printer & Report Programming | Wrkoutq Basics | 14 | Medium |  |
| 142 | `printer-file-overrides-basics` | Printer File Overrides Basics | `printer-files-and-reports` | `printer-file-overrides` | 12. Printer & Report Programming | Printer File Overrides |  | High |  |
| 143 | `debugging-report-output-problems` | Debugging Report Output Problems | `printer-files-and-reports` | `report-debugging` | 12. Printer & Report Programming | Report Debugging |  | High |  |
| 144 | `printer-file-vs-display-file-vs-database-file` | Printer File vs Display File vs Database File | `printer-files-and-reports` | `file-type-comparison` | 12. Printer & Report Programming | File Type Comparison |  | High |  |
| 145 | `why-debugging-matters-on-ibm-i` | Why Debugging Matters on IBM i | `debugging-and-job-logs` | `why-debugging-matters` | 14. Job & Work Management | Why Debugging Matters | 8 | Low | Generic debugging-mindset lesson; master list has no dedicated Debugging category, folds into 3/8/14. |
| 146 | `strdbg-basics-for-rpgle` | STRDBG Basics for RPGLE | `debugging-and-job-logs` | `strdbg-basics` | 8. RPG Programming | Strdbg Basics | 14 | Medium |  |
| 147 | `setting-and-using-breakpoints` | Setting and Using Breakpoints | `debugging-and-job-logs` | `breakpoints` | 8. RPG Programming | Breakpoints | 14 | Medium |  |
| 148 | `watching-variables-during-debug` | Watching Variables During Debug | `debugging-and-job-logs` | `watching-variables` | 8. RPG Programming | Watching Variables | 14 | Medium |  |
| 149 | `understanding-job-logs` | Understanding Job Logs | `debugging-and-job-logs` | `job-logs-deep-dive` | 14. Job & Work Management | Job Logs Deep Dive |  | High |  |
| 150 | `reading-ibm-i-message-ids` | Reading IBM i Message IDs | `debugging-and-job-logs` | `message-ids` | 14. Job & Work Management | Message Ids |  | High |  |
| 151 | `compile-errors-vs-runtime-errors` | Compile Errors vs Runtime Errors | `debugging-and-job-logs` | `compile-vs-runtime-errors` | 8. RPG Programming | Compile Vs Runtime Errors | 3 | Low | Applies equally to RPGLE and CLLE; no single natural home. |
| 152 | `common-ibm-i-debugging-mistakes` | Common IBM i Debugging Mistakes | `debugging-and-job-logs` | `debugging-best-practices` | 8. RPG Programming | Debugging Best Practices | 3 | Low |  |
| 153 | `dspjob-and-job-information-basics` | DSPJOB and Job Information Basics | `debugging-and-job-logs` | `dspjob-basics` | 14. Job & Work Management | Dspjob Basics |  | High |  |
| 154 | `wrkactjob-basics-for-developers` | WRKACTJOB Basics for Developers | `debugging-and-job-logs` | `wrkactjob-basics` | 14. Job & Work Management | Wrkactjob Basics |  | High |  |
| 155 | `finding-program-failures-from-error-messages` | Finding Program Failures from Error Messages | `debugging-and-job-logs` | `finding-program-failures` | 14. Job & Work Management | Finding Program Failures |  | High |  |
| 156 | `understanding-call-stack-basics` | Understanding Call Stack Basics | `debugging-and-job-logs` | `call-stack-basics` | 14. Job & Work Management | Call Stack Basics |  | High |  |
| 157 | `debugging-batch-jobs-at-a-beginner-level` | Debugging Batch Jobs at a Beginner Level | `debugging-and-job-logs` | `batch-job-debugging` | 14. Job & Work Management | Batch Job Debugging |  | High |  |
| 158 | `using-job-logs-for-sqlrpgle-and-file-io-issues` | Using Job Logs for SQLRPGLE and File I/O Issues | `debugging-and-job-logs` | `job-logs-for-sql-and-file-io` | 14. Job & Work Management | Job Logs For SQL And File Io | 6 | Medium |  |
| 159 | `basic-troubleshooting-flow-for-ibm-i-developers` | Basic Troubleshooting Flow for IBM i Developers | `debugging-and-job-logs` | `troubleshooting-flow` | 14. Job & Work Management | Troubleshooting Flow |  | High |  |
| 160 | `debugging-checklist-for-beginners` | Debugging Checklist for Beginners | `debugging-and-job-logs` | `debugging-checklist` | 8. RPG Programming | Debugging Checklist | 14 | Medium |  |
| 161 | `ibm-i-jobs-explained` | IBM i Jobs Explained | `ibm-i-operations` | `jobs-explained` | 14. Job & Work Management | Jobs Explained |  | High |  |
| 162 | `interactive-jobs-vs-batch-jobs` | Interactive Jobs vs Batch Jobs | `ibm-i-operations` | `interactive-vs-batch-jobs` | 14. Job & Work Management | Interactive Vs Batch Jobs |  | High |  |
| 163 | `job-queues-and-output-queues` | Job Queues and Output Queues | `ibm-i-operations` | `job-queues-vs-output-queues` | 14. Job & Work Management | Job Queues Vs Output Queues |  | High |  |
| 164 | `subsystems-basics` | Subsystems Basics | `ibm-i-operations` | `subsystems-basics` | 14. Job & Work Management | Subsystems Basics |  | High |  |
| 165 | `library-list-in-real-job-execution` | Library List in Real Job Execution | `ibm-i-operations` | `library-list-job-execution` | 4. Object & Library Management | Library List Job Execution | 14 | Medium |  |
| 166 | `object-locks-basics` | Object Locks Basics | `ibm-i-operations` | `object-locks-basics` | 4. Object & Library Management | Object Locks Basics | 14 | Medium |  |
| 167 | `authorities-and-object-access-basics` | Authorities and Object Access Basics | `ibm-i-operations` | `authorities-basics` | 13. Security on IBM i | Authorities Basics | 14 | Medium | Lives in ibm-i-operations track but subject matter is Security; original Coverage Audit row 13 already cited this file. |
| 168 | `common-ibm-i-operations-commands-for-developers` | Common IBM i Operations Commands for Developers | `ibm-i-operations` | `operations-commands-recap` | 14. Job & Work Management | Operations Commands Recap |  | High |  |
| 169 | `submitted-jobs-and-wrksbmjob` | Submitted Jobs and WRKSBMJOB | `ibm-i-operations` | `wrksbmjob-basics` | 14. Job & Work Management | Wrksbmjob Basics |  | High |  |
| 170 | `job-logs-in-batch-jobs` | Job Logs in Batch Jobs | `ibm-i-operations` | `batch-job-logs` | 14. Job & Work Management | Batch Job Logs |  | High |  |
| 171 | `job-status-values-explained` | Job Status Values Explained | `ibm-i-operations` | `job-status-values` | 14. Job & Work Management | Job Status Values |  | High |  |
| 172 | `basic-job-scheduling-concepts` | Basic Job Scheduling Concepts | `ibm-i-operations` | `job-scheduling-basics` | 14. Job & Work Management | Job Scheduling Basics |  | High |  |
| 173 | `handling-object-locks-as-a-developer` | Handling Object Locks as a Developer | `ibm-i-operations` | `handling-object-locks` | 4. Object & Library Management | Handling Object Locks | 14 | Medium |  |
| 174 | `authority-failures-and-how-to-investigate-them` | Authority Failures and How to Investigate Them | `ibm-i-operations` | `authority-failures` | 13. Security on IBM i | Authority Failures | 14 | Medium | Same track/category mismatch as authorities-and-object-access-basics. |
| 175 | `library-list-problems-in-real-applications` | Library List Problems in Real Applications | `ibm-i-operations` | `library-list-problems` | 4. Object & Library Management | Library List Problems | 14 | Medium |  |
| 176 | `common-ibm-i-operations-mistakes-and-best-practices` | Common IBM i Operations Mistakes and Best Practices | `ibm-i-operations` | `operations-best-practices` | 14. Job & Work Management | Operations Best Practices |  | High |  |
| 177 | `customer-inquiry-program` | Mini Project: Customer Inquiry Program | `real-world-projects` | `customer-inquiry-project` | 11. Screen & UI Development | Customer Inquiry Project | 8 | Medium | Mini-project capstone; primary category chosen by dominant technology (display file + CHAIN). |
| 178 | `item-master-lookup-program` | Mini Project: Item Master Lookup Program | `real-world-projects` | `item-master-lookup-project` | 11. Screen & UI Development | Item Master Lookup Project | 8 | Medium |  |
| 179 | `simple-order-list-subfile` | Mini Project: Simple Order List Subfile | `real-world-projects` | `order-list-subfile-project` | 11. Screen & UI Development | Order List Subfile Project | 6 | Medium |  |
| 180 | `batch-report-program` | Mini Project: Batch Report Program | `real-world-projects` | `batch-report-project` | 12. Printer & Report Programming | Batch Report Project | 8 | Medium |  |
| 181 | `clle-wrapper-to-run-a-report` | Mini Project: CLLE Wrapper to Run a Report | `real-world-projects` | `clle-wrapper-project` | 3. CL Programming | CLLE Wrapper Project | 12 | Medium |  |
| 182 | `sqlrpgle-customer-lookup` | Mini Project: SQLRPGLE Customer Lookup | `real-world-projects` | `sqlrpgle-lookup-project` | 6. SQL on IBM i | Sqlrpgle Lookup Project | 8 | Medium |  |
| 183 | `debugging-a-broken-file-io-program` | Mini Project: Debugging a Broken File I/O Program | `real-world-projects` | `debugging-project` | 8. RPG Programming | Debugging Project | 14 | Medium |  |
| 184 | `end-to-end-mini-dms-style-flow` | Mini Project: End-to-End Mini DMS-Style Flow | `real-world-projects` | `end-to-end-project` | **Uncategorized — needs Product Owner discussion** | End To End Project |  | Low | Capstone deliberately spanning RPGLE + CLLE end-to-end; does not cleanly reduce to one master category. |
| 185 | `customer-maintenance-add-change-delete` | Mini Project: Customer Maintenance Add/Change/Delete | `real-world-projects` | `customer-maintenance-project` | 11. Screen & UI Development | Customer Maintenance Project | 8 | Medium |  |
| 186 | `order-entry-skeleton` | Mini Project: Order Entry Skeleton | `real-world-projects` | `order-entry-project` | 11. Screen & UI Development | Order Entry Project | 8 | Medium |  |
| 187 | `report-with-clle-submit-job-flow` | Mini Project: Report with CLLE Submit Job Flow | `real-world-projects` | `submit-job-flow-project` | 3. CL Programming | Submit Job Flow Project | 14 | Medium |  |
| 188 | `subfile-row-selection-with-detail-screen` | Mini Project: Subfile Row Selection with Detail Screen | `real-world-projects` | `subfile-selection-project` | 11. Screen & UI Development | Subfile Selection Project | 8 | Medium |  |
| 189 | `sqlrpgle-search-screen` | Mini Project: SQLRPGLE Search Screen | `real-world-projects` | `sqlrpgle-search-project` | 6. SQL on IBM i | Sqlrpgle Search Project | 11 | Medium |  |
| 190 | `printer-file-report-with-totals` | Mini Project: Printer File Report with Totals | `real-world-projects` | `report-totals-project` | 12. Printer & Report Programming | Report Totals Project | 8 | Medium |  |
| 191 | `troubleshooting-locked-record-scenario` | Mini Project: Troubleshooting Locked Record Scenario | `real-world-projects` | `locked-record-troubleshooting-project` | 4. Object & Library Management | Locked Record Troubleshooting Project | 14 | Medium |  |
| 192 | `batch-job-failure-investigation` | Mini Project: Batch Job Failure Investigation | `real-world-projects` | `batch-failure-troubleshooting-project` | 14. Job & Work Management | Batch Failure Troubleshooting Project | 8 | Medium |  |
| 193 | `ibm-i-developer-interview-roadmap` | IBM i Developer Interview Roadmap | `interview-and-professional-readiness` | `interview-roadmap` | 27. Career & Certification Path | Interview Roadmap |  | High |  |
| 194 | `rpgle-basic-interview-questions` | RPGLE Basic Interview Questions | `interview-and-professional-readiness` | `rpgle-basic-interview` | 27. Career & Certification Path | RPGLE Basic Interview |  | High |  |
| 195 | `rpgle-file-io-interview-scenarios` | RPGLE File I/O Interview Scenarios | `interview-and-professional-readiness` | `rpgle-file-io-interview` | 27. Career & Certification Path | RPGLE File Io Interview |  | High |  |
| 196 | `clle-interview-scenarios` | CLLE Interview Scenarios | `interview-and-professional-readiness` | `clle-interview` | 27. Career & Certification Path | CLLE Interview |  | High |  |
| 197 | `sqlrpgle-interview-scenarios` | SQLRPGLE Interview Scenarios | `interview-and-professional-readiness` | `sqlrpgle-interview` | 27. Career & Certification Path | Sqlrpgle Interview |  | High |  |
| 198 | `display-file-and-subfile-interview-questions` | Display File and Subfile Interview Questions | `interview-and-professional-readiness` | `display-subfile-interview` | 27. Career & Certification Path | Display Subfile Interview |  | High |  |
| 199 | `debugging-scenario-based-questions` | Debugging Scenario-Based Questions | `interview-and-professional-readiness` | `debugging-interview` | 27. Career & Certification Path | Debugging Interview |  | High |  |
| 200 | `real-support-ticket-analysis-for-beginners` | Real Support Ticket Analysis for Beginners | `interview-and-professional-readiness` | `support-ticket-analysis` | 27. Career & Certification Path | Support Ticket Analysis |  | High |  |
| 201 | `explaining-your-ibm-i-project-experience` | Explaining Your IBM i Project Experience | `interview-and-professional-readiness` | `explaining-project-experience` | 27. Career & Certification Path | Explaining Project Experience |  | High |  |
| 202 | `rpgle-scenario-based-interview-practice` | RPGLE Scenario-Based Interview Practice | `interview-and-professional-readiness` | `rpgle-scenario-practice` | 27. Career & Certification Path | RPGLE Scenario Practice |  | High |  |
| 203 | `sqlrpgle-vs-native-io-interview-discussion` | SQLRPGLE vs Native I/O Interview Discussion | `interview-and-professional-readiness` | `sqlrpgle-vs-native-discussion` | 27. Career & Certification Path | Sqlrpgle Vs Native Discussion |  | High |  |
| 204 | `debugging-live-issue-interview-practice` | Debugging Live Issue Interview Practice | `interview-and-professional-readiness` | `debugging-live-practice` | 27. Career & Certification Path | Debugging Live Practice |  | High |  |
| 205 | `ibm-i-support-ticket-walkthrough` | IBM i Support Ticket Walkthrough | `interview-and-professional-readiness` | `support-ticket-walkthrough` | 27. Career & Certification Path | Support Ticket Walkthrough |  | High |  |
| 206 | `resume-points-for-ibm-i-developers` | Resume Points for IBM i Developers | `interview-and-professional-readiness` | `resume-points` | 27. Career & Certification Path | Resume Points |  | High |  |
| 207 | `common-ibm-i-interview-mistakes` | Common IBM i Interview Mistakes | `interview-and-professional-readiness` | `common-interview-mistakes` | 27. Career & Certification Path | Common Interview Mistakes |  | High |  |
| 208 | `mock-ibm-i-developer-interview` | Mock IBM i Developer Interview | `interview-and-professional-readiness` | `mock-interview` | 27. Career & Certification Path | Mock Interview |  | High |  |
| 209 | `opm-vs-ile-on-ibm-i` | OPM vs ILE on IBM i | `rpgle-intermediate` | `opm-vs-ile` | 10. ILE Concepts | Opm Vs ILE |  | High |  |
| 210 | `modules-programs-and-service-programs` | What are Modules, Programs, and Service Programs? | `rpgle-intermediate` | `modules-programs-service-programs` | 10. ILE Concepts | Modules Programs Service Programs |  | High |  |
| 211 | `creating-rpgle-modules-with-crtrpgmod` | Creating RPGLE Modules with CRTRPGMOD | `rpgle-intermediate` | `crtrpgmod` | 10. ILE Concepts | Crtrpgmod |  | High |  |
| 212 | `binding-modules-into-programs-with-crtpgm` | Binding Modules into Programs with CRTPGM | `rpgle-intermediate` | `crtpgm` | 10. ILE Concepts | Crtpgm |  | High |  |
| 213 | `prototypes-and-procedure-interfaces-in-ile` | Prototypes and Procedure Interfaces in ILE | `rpgle-intermediate` | `prototypes-procedure-interfaces` | 10. ILE Concepts | Prototypes Procedure Interfaces |  | High |  |
| 214 | `internal-procedures-vs-exported-procedures` | Internal Procedures vs Exported Procedures | `rpgle-intermediate` | `internal-vs-exported-procedures` | 10. ILE Concepts | Internal Vs Exported Procedures |  | High |  |
| 215 | `introduction-to-service-programs` | Introduction to Service Programs | `rpgle-intermediate` | `intro-service-programs` | 10. ILE Concepts | Intro Service Programs |  | High |  |
| 216 | `activation-groups-basics` | Activation Groups Basics | `rpgle-intermediate` | `activation-groups` | 10. ILE Concepts | Activation Groups |  | High |  |
| 217 | `binding-directories-basics` | Binding Directories Basics | `rpgle-intermediate` | `binding-directories` | 10. ILE Concepts | Binding Directories |  | High |  |
| 218 | `creating-service-programs-with-crtsrvpgm` | Creating Service Programs with CRTSRVPGM | `rpgle-intermediate` | `crtsrvpgm` | 10. ILE Concepts | Crtsrvpgm |  | High |  |
| 219 | `binder-source-introduction` | Binder Source Introduction | `rpgle-intermediate` | `binder-source` | 10. ILE Concepts | Binder Source |  | High |  |
| 220 | `service-program-signatures-at-a-beginner-level` | Service Program Signatures at a Beginner Level | `rpgle-intermediate` | `signatures` | 10. ILE Concepts | Signatures |  | High |  |
| 221 | `updating-service-programs-safely` | Updating Service Programs Safely | `rpgle-intermediate` | `updating-service-programs` | 10. ILE Concepts | Updating Service Programs |  | High |  |
| 222 | `activation-group-problems-and-common-confusions` | Activation Group Problems and Common Confusions | `rpgle-intermediate` | `activation-group-problems` | 10. ILE Concepts | Activation Group Problems |  | High |  |
| 223 | `debugging-ile-programs` | Debugging ILE Programs | `rpgle-intermediate` | `debugging-ile` | 10. ILE Concepts | Debugging ILE | 8 | Medium |  |
| 224 | `common-ile-mistakes-and-best-practices` | Common ILE Mistakes and Best Practices | `rpgle-intermediate` | `common-ile-mistakes` | 10. ILE Concepts | Common ILE Mistakes |  | High |  |
| 225 | `modern-ibm-i-development-overview` | Modern IBM i Development Overview | `integration-and-modernization` | `modern-ibm-i-overview` | 26. Modernization Topics | Modern IBM i Overview | 21 | Medium |  |
| 226 | `why-apis-matter-on-ibm-i` | Why APIs Matter on IBM i | `integration-and-modernization` | `why-apis-matter` | 26. Modernization Topics | Why Apis Matter | 21 | Medium |  |
| 227 | `rest-api-concepts-for-ibm-i-developers` | REST API Concepts for IBM i Developers | `integration-and-modernization` | `rest-api-concepts` | 21. Integration & Connectivity | Rest API Concepts |  | High |  |
| 228 | `json-basics-for-rpgle-developers` | JSON Basics for RPGLE Developers | `integration-and-modernization` | `json-basics` | 21. Integration & Connectivity | Json Basics |  | High |  |
| 229 | `ifs-and-api-payload-files` | IFS and API Payload Files | `integration-and-modernization` | `ifs-api-payloads` | 21. Integration & Connectivity | IFS API Payloads | 18 | Medium |  |
| 230 | `calling-external-apis-from-ibm-i` | Calling External APIs from IBM i | `integration-and-modernization` | `calling-external-apis` | 21. Integration & Connectivity | Calling External Apis |  | High |  |
| 231 | `exposing-ibm-i-logic-as-an-api` | Exposing IBM i Logic as an API | `integration-and-modernization` | `exposing-ibm-i-api` | 26. Modernization Topics | Exposing IBM i API | 21 | Medium |  |
| 232 | `common-ibm-i-integration-mistakes` | Common IBM i Integration Mistakes | `integration-and-modernization` | `integration-mistakes` | 21. Integration & Connectivity | Integration Mistakes |  | High |  |
| 233 | `http-methods-and-status-codes-for-ibm-i-developers` | HTTP Methods and Status Codes for IBM i Developers | `integration-and-modernization` | `http-methods-status-codes` | 21. Integration & Connectivity | Http Methods Status Codes |  | High |  |
| 234 | `api-request-and-response-design-basics` | API Request and Response Design Basics | `integration-and-modernization` | `api-request-response-design` | 21. Integration & Connectivity | API Request Response Design |  | High |  |
| 235 | `json-parsing-concepts-in-rpgle` | JSON Parsing Concepts in RPGLE | `integration-and-modernization` | `json-parsing-concepts` | 21. Integration & Connectivity | Json Parsing Concepts |  | High |  |
| 236 | `api-error-handling-basics` | API Error Handling Basics | `integration-and-modernization` | `api-error-handling` | 21. Integration & Connectivity | API Error Handling |  | High |  |
| 237 | `logging-integration-requests-and-responses` | Logging Integration Requests and Responses | `integration-and-modernization` | `logging-integration` | 21. Integration & Connectivity | Logging Integration |  | High |  |
| 238 | `securing-ibm-i-apis-at-a-beginner-level` | Securing IBM i APIs at a Beginner Level | `integration-and-modernization` | `securing-apis` | 21. Integration & Connectivity | Securing Apis | 13 | Medium | Cross-category: integration content applying security concepts. |
| 239 | `batch-vs-real-time-integration` | Batch vs Real-Time Integration | `integration-and-modernization` | `batch-vs-realtime` | 21. Integration & Connectivity | Batch Vs Realtime |  | High |  |
| 240 | `debugging-api-integration-issues` | Debugging API Integration Issues | `integration-and-modernization` | `debugging-api-integration` | 21. Integration & Connectivity | Debugging API Integration |  | High |  |
| 241 | `ddl-on-ibm-i-create-alter-drop-table` | DDL on IBM i: CREATE TABLE, ALTER TABLE, and DROP TABLE | `sql-for-ibm-i` | `ddl-basics` | 6. SQL on IBM i | Ddl Basics |  | High |  |
| 242 | `sql-indexes-and-views-on-db2-for-i` | SQL Indexes and Views on Db2 for i | `sql-for-ibm-i` | `indexes-and-views` | 6. SQL on IBM i | Indexes And Views | 7 | Medium |  |
| 243 | `constraints-on-ibm-i-primary-foreign-unique-check` | Constraints on IBM i: Primary Key, Foreign Key, Unique, and Check | `sql-for-ibm-i` | `constraints` | 6. SQL on IBM i | Constraints | 7 | Medium |  |
| 244 | `acs-run-sql-scripts-for-ibm-i-developers` | ACS Run SQL Scripts for IBM i Developers | `sql-for-ibm-i` | `acs-run-sql-scripts` | 6. SQL on IBM i | ACS Run SQL Scripts | 19 | Medium |  |
| 245 | `sql-stored-procedures-on-ibm-i` | SQL Stored Procedures on IBM i | `sql-for-ibm-i` | `sql-stored-procedures` | 6. SQL on IBM i | SQL Stored Procedures |  | High |  |
| 246 | `external-stored-procedures-with-rpgle` | External Stored Procedures with RPGLE | `sql-for-ibm-i` | `external-stored-procedures` | 6. SQL on IBM i | External Stored Procedures |  | High |  |
| 247 | `sql-triggers-on-ibm-i` | SQL Triggers on IBM i | `sql-for-ibm-i` | `sql-triggers` | 6. SQL on IBM i | SQL Triggers |  | High |  |
| 248 | `user-defined-functions-on-ibm-i` | User-Defined Functions on IBM i | `sql-for-ibm-i` | `user-defined-functions` | 6. SQL on IBM i | User Defined Functions |  | High |  |
| 249 | `sqlca-sqlcode-and-sqlstate-in-depth` | SQLCA, SQLCODE, and SQLSTATE in Depth | `sql-for-ibm-i` | `sqlca-in-depth` | 6. SQL on IBM i | Sqlca In Depth |  | High |  |
| 250 | `static-sql-vs-dynamic-sql-on-ibm-i` | Static SQL vs Dynamic SQL on IBM i | `sql-for-ibm-i` | `static-vs-dynamic-sql` | 6. SQL on IBM i | Static Vs Dynamic SQL |  | High |  |
| 251 | `sql-precompilation-with-crtsqlrpgi` | SQL Precompilation with CRTSQLRPGI | `sql-for-ibm-i` | `precompilation` | 6. SQL on IBM i | Precompilation |  | High |  |
| 252 | `query-optimization-basics-on-db2-for-i` | Query Optimization Basics on Db2 for i | `sql-for-ibm-i` | `query-optimization-basics` | 6. SQL on IBM i | Query Optimization Basics | 25 | Medium |  |
| 253 | `sqe-vs-cqe-at-a-beginner-friendly-level` | SQE vs CQE at a Beginner-Friendly Level | `sql-for-ibm-i` | `sqe-vs-cqe` | 6. SQL on IBM i | Sqe Vs Cqe | 25 | Medium |  |
| 254 | `encoded-vector-indexes-introduction` | Encoded Vector Indexes Introduction | `sql-for-ibm-i` | `evi-introduction` | 6. SQL on IBM i | Evi Introduction | 7, 25 | Medium |  |
| 255 | `drda-and-distributed-database-concepts` | DRDA and Distributed Database Concepts | `sql-for-ibm-i` | `drda-distributed-database` | 6. SQL on IBM i | Drda Distributed Database | 21 | Medium |  |
| 256 | `common-advanced-sql-mistakes-on-ibm-i` | Common Advanced SQL Mistakes on IBM i | `sql-for-ibm-i` | `advanced-sql-mistakes` | 6. SQL on IBM i | Advanced SQL Mistakes |  | High |  |
| 257 | `user-profiles-and-group-profiles-on-ibm-i` | User Profiles and Group Profiles on IBM i | `security-and-compliance` | `user-and-group-profiles` | 13. Security on IBM i | User And Group Profiles |  | High |  |
| 258 | `object-authority-in-depth` | Object Authority in Depth | `security-and-compliance` | `object-authority-in-depth` | 13. Security on IBM i | Object Authority In Depth |  | High |  |
| 259 | `public-authority-and-private-authority-in-depth` | Public Authority and Private Authority in Depth | `security-and-compliance` | `public-vs-private-authority` | 13. Security on IBM i | Public Vs Private Authority |  | High |  |
| 260 | `authorization-lists-on-ibm-i` | Authorization Lists on IBM i | `security-and-compliance` | `authorization-lists` | 13. Security on IBM i | Authorization Lists |  | High |  |
| 261 | `special-authorities-explained` | Special Authorities Explained | `security-and-compliance` | `special-authorities` | 13. Security on IBM i | Special Authorities |  | High |  |
| 262 | `adopted-authority-basics` | Adopted Authority Basics | `security-and-compliance` | `adopted-authority` | 13. Security on IBM i | Adopted Authority |  | High |  |
| 263 | `investigating-authority-failures-in-depth` | Investigating Authority Failures in Depth | `security-and-compliance` | `authority-failures-in-depth` | 13. Security on IBM i | Authority Failures In Depth |  | High |  |
| 264 | `ibm-i-security-best-practices-for-developers` | IBM i Security Best Practices for Developers | `security-and-compliance` | `security-best-practices` | 13. Security on IBM i | Security Best Practices |  | High |  |
| 265 | `qsecurity-system-value-explained` | QSECURITY System Value Explained | `security-and-compliance` | `qsecurity-system-value` | 13. Security on IBM i | Qsecurity System Value |  | High |  |
| 266 | `auditing-basics-and-qaudjrn-overview` | Auditing Basics and QAUDJRN Overview | `security-and-compliance` | `qaudjrn-overview` | 13. Security on IBM i | Qaudjrn Overview |  | High |  |
| 267 | `exit-points-and-exit-programs-overview` | Exit Points and Exit Programs Overview | `security-and-compliance` | `exit-points-overview` | 13. Security on IBM i | Exit Points Overview |  | High |  |
| 268 | `ifs-security-basics` | IFS Security Basics | `security-and-compliance` | `ifs-security-basics` | 13. Security on IBM i | IFS Security Basics |  | High |  |
| 269 | `digital-certificates-and-tls-concepts-on-ibm-i` | Digital Certificates and TLS Concepts on IBM i | `security-and-compliance` | `certificates-and-tls` | 13. Security on IBM i | Certificates And TLS | 21 | Medium |  |
| 270 | `rcac-and-field-procedures-overview` | Row and Column Access Control and Field Procedures Overview | `security-and-compliance` | `rcac-and-fieldproc` | 13. Security on IBM i | Rcac And Fieldproc | 7 | Medium | RCAC/FIELDPROC genuinely straddles Security and Database Design. |
| 271 | `authority-collection-overview` | Authority Collection Overview | `security-and-compliance` | `authority-collection` | 13. Security on IBM i | Authority Collection |  | High |  |
| 272 | `common-ibm-i-security-mistakes-and-best-practices` | Common IBM i Security Mistakes and Best Practices | `security-and-compliance` | `security-mistakes-and-best-practices` | 13. Security on IBM i | Security Mistakes And Best Practices |  | High |  |
| 273 | `what-is-journaling-on-ibm-i` | What is Journaling on IBM i? | `journaling-and-commitment-control` | `what-is-journaling` | 16. Journaling & Commitment Control | What Is Journaling |  | High |  |
| 274 | `journal-receivers-explained` | Journal Receivers Explained | `journaling-and-commitment-control` | `journal-receivers` | 16. Journaling & Commitment Control | Journal Receivers |  | High |  |
| 275 | `starting-journaling-with-strjrnpf` | Starting Journaling with STRJRNPF | `journaling-and-commitment-control` | `strjrnpf` | 16. Journaling & Commitment Control | Strjrnpf |  | High |  |
| 276 | `viewing-journal-entries-basics` | Viewing Journal Entries Basics | `journaling-and-commitment-control` | `viewing-journal-entries` | 16. Journaling & Commitment Control | Viewing Journal Entries |  | High |  |
| 277 | `commitment-control-overview` | Commitment Control Overview | `journaling-and-commitment-control` | `commitment-control-overview` | 16. Journaling & Commitment Control | Commitment Control Overview |  | High |  |
| 278 | `strcmtctl-commit-and-rollback-basics` | STRCMTCTL, COMMIT, and ROLLBACK Basics | `journaling-and-commitment-control` | `strcmtctl-commit-rollback` | 16. Journaling & Commitment Control | Strcmtctl Commit Rollback |  | High |  |
| 279 | `journaling-for-recovery-and-auditing` | Journaling for Recovery and Auditing | `journaling-and-commitment-control` | `journaling-recovery-and-auditing` | 16. Journaling & Commitment Control | Journaling Recovery And Auditing |  | High |  |
| 280 | `common-journaling-and-commitment-control-mistakes` | Common Journaling and Commitment Control Mistakes | `journaling-and-commitment-control` | `journaling-commitment-control-mistakes` | 16. Journaling & Commitment Control | Journaling Commitment Control Mistakes |  | High |  |
| 281 | `why-backup-and-restore-matter-on-ibm-i` | Why Backup and Restore Matter on IBM i | `libraries-objects-and-ifs` | `why-backup-restore-matters` | 4. Object & Library Management | Why Backup Restore Matters |  | High |  |
| 282 | `savobj-and-rstobj-basics` | SAVOBJ and RSTOBJ Basics | `libraries-objects-and-ifs` | `savobj-rstobj-basics` | 4. Object & Library Management | Savobj Rstobj Basics |  | High |  |
| 283 | `savlib-and-rstlib-basics` | SAVLIB and RSTLIB Basics | `libraries-objects-and-ifs` | `savlib-rstlib-basics` | 4. Object & Library Management | Savlib Rstlib Basics |  | High |  |
| 284 | `save-files-explained` | Save Files Explained | `libraries-objects-and-ifs` | `save-files-explained` | 4. Object & Library Management | Save Files Explained |  | High |  |
| 285 | `go-save-options-21-22-and-23-overview` | GO SAVE Options 21, 22, and 23 Overview | `libraries-objects-and-ifs` | `go-save-options-overview` | 4. Object & Library Management | Go Save Options Overview |  | High |  |
| 286 | `restoring-objects-safely-in-development-and-test` | Restoring Objects Safely in Development and Test | `libraries-objects-and-ifs` | `restoring-safely-dev-test` | 4. Object & Library Management | Restoring Safely Dev Test |  | High |  |
| 287 | `backup-vs-journaling-vs-high-availability` | Backup vs Journaling vs High Availability | `libraries-objects-and-ifs` | `backup-vs-journaling-vs-ha` | 4. Object & Library Management | Backup Vs Journaling Vs Ha | 16, 22 | Medium | Deliberately compares backup, journaling, and HA as three distinct concepts; touches Categories 16 and 22 as much as 4. |
| 288 | `common-save-restore-mistakes` | Common Save/Restore Mistakes | `libraries-objects-and-ifs` | `save-restore-mistakes` | 4. Object & Library Management | Save Restore Mistakes | 22 | High |  |

**Totals:** 288 rows — 226 High confidence, 56 Medium confidence, 6 Low confidence (1 of which is fully Uncategorized).

---

## A. Executive Summary

**How well is the current curriculum logically grouped today?** Reasonably well, given that grouping was never the primary design goal — `trackId`/`moduleId` were added additively (Spec 009 v2.1) on top of a `lessonOrder`-driven flat sequence, and they still track fairly closely to the master category list. 233 of 288 lessons (81%) map to their master category at **High** confidence purely from their existing `trackId`, with no adjustment needed. That is a strong signal that the existing track structure was built with real subject-matter boundaries in mind, not arbitrarily.

**Where current track/module grouping works well:** Tracks that map 1:1 onto a single master category with no exceptions at all: `rpgle-intermediate` → ILE Concepts (16/16), `display-files-and-subfiles` → Screen & UI Development (32/32), `printer-files-and-reports` → Printer & Report Programming (16/16 primary, a few also touch Job & Work Management secondarily), `journaling-and-commitment-control` → Journaling & Commitment Control (8/8), `security-and-compliance` → Security on IBM i (16/16), `interview-and-professional-readiness` → Career & Certification Path (16/16), `5250-terminal-and-commands` → 5250 Terminal & Navigation (5/5), `db2-for-i-and-dds` → Database Fundamentals (9/9 primary). These are the tracks that were each built as a single, well-scoped batch around one clear topic — the grouping already matches the master taxonomy closely enough that no changes are needed there.

**Where it is confusing or too broad:**
- **`ibm-i-operations`** (17 lessons) is really three different master categories wearing one trackId: Job & Work Management (the majority), Security (2 lessons — object authority content that predates the dedicated security track), and Object & Library Management (4 lessons — object locks and library-list troubleshooting). This is the single biggest track/category mismatch found in this audit (Section E).
- **`libraries-objects-and-ifs`** (24 lessons after PR #119) now blends three genuinely distinct concerns under one trackId/one topic filter: core object & library management, IFS, and — since PR #119 — Save/Restore/backup. IFS in particular deserves its own identity in any future category-aware UI, since it is its own master category (18), not a subset of Object & Library Management.
- **`debugging-and-job-logs`** (17 lessons) and **`real-world-projects`** (16 lessons) are both deliberately cross-cutting by design (confirmed again in this pass, consistent with the original Coverage Audit's own Section D finding) — genuinely valuable pedagogical groupings, but neither reduces to a single master category, which matters if a future UI ever tries to filter strictly "by master category."
- **`clle`** contains one lesson (`data-areas-in-clle`) whose actual subject is a master category (17, native APIs/system interfaces) that has no other representation anywhere in the curriculum — a learner would never find IBM i's only "native API" content by looking for it, only by stumbling into it inside the CLLE topic filter.

**Is physical file reorganization needed?** **No.** See Section F/G below — the safest and sufficient path is a metadata-only taxonomy addition (`masterCategoryId`), not moving any of the 288 markdown files. The existing flat `content/lessons/` layout, `trackId`/`moduleId` grouping, and `TOPIC_FILTERS` should all remain exactly as they are; this audit's proposed category mapping is additive metadata, not a restructuring mandate.

---

## B. Category Coverage Count

*Practice count reflects `content/practice/questions.ts`'s 96 questions across 16 topic IDs. Two practice topic pools — `mini-projects` (6 questions) and `mixed-review` (6 questions) — are themselves cross-cutting and are not attributed to any single category below; the `debugging` topic pool (6 questions) is split across RPGLE-debugging and job-log-troubleshooting lessons and is likewise not cleanly attributable to one category.*

| # | Master Category | Lesson Count (primary) | Practice Count | Current Track(s) Involved | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | IBM i Platform Fundamentals | 6 | 6 (`ibm-i-fundamentals`) | `ibm-i-foundations` (+ `ibm-i-operations` for 1 orientation lesson) | Balanced | Includes 2 Low-confidence meta/orientation lessons (`where-to-go-next`, `basic-ibm-i-development-workflow`). |
| 2 | 5250 Terminal & Navigation | 5 | 6 (`commands-5250`) | `5250-terminal-and-commands` | Balanced | Clean 1:1 track mapping. |
| 3 | CL Programming | 18 | 6 (`clle-basics`) | `clle` (+ `real-world-projects` for 2 mini-projects) | Balanced | Practice count (6) is thin relative to 18 lessons but consistent with every foundation track. |
| 4 | Object & Library Management | 19 | 6 (`libraries-and-objects`) | `libraries-objects-and-ifs`, `ibm-i-operations` (+ `real-world-projects` for 1) | Underrepresented (practice) | 19 lessons (the largest single category outside RPG/SQL/Screen-UI/Job-mgmt) but still only 6 practice questions, and the 8-lesson Save/Restore batch (PR #119) has zero. |
| 5 | Database Fundamentals | 9 | 6 (`physical-logical-files`) | `db2-for-i-and-dds` | Balanced | Clean 1:1 track mapping. |
| 6 | SQL on IBM i | 35 | 6 (`sqlrpgle-basics`) | `sql-for-ibm-i` (+ `real-world-projects` for 2) | Overrepresented (lessons) / Underrepresented (practice) | The 16 Advanced SQL lessons (PR #111/#112) have **zero** practice questions — the beginner subset is the only part with coverage. |
| 7 | Database Design & Advanced DB2 for i | 0 (primary) | 0 | — (only secondary on 5 SQL lessons) | Empty | Confirmed Not Covered, consistent with the original Coverage Audit. |
| 8 | RPG Programming | 40 | 12 (`rpgle-foundations` + `rpgle-file-io`) + share of `debugging` pool | `rpgle-beginner` (+ `debugging-and-job-logs`, `real-world-projects`) | Overrepresented | Largest single category in the whole curriculum by lesson count. |
| 9 | COBOL on IBM i | 0 | 0 | — | Empty (by design) | Deliberate RPG-first scope choice, unchanged since the original audit. |
| 10 | ILE Concepts | 16 | 0 | `rpgle-intermediate` | Underrepresented (practice) | Zero practice questions for a 16-lesson, professional-depth category — repeats Gap #10 from the original Coverage Audit, still unresolved. |
| 11 | Screen & UI Development | 38 | 12 (`display-files` + `subfiles`) | `display-files-and-subfiles` (+ `real-world-projects` for 6) | Overrepresented | Second-largest category. |
| 12 | Printer & Report Programming | 18 | 6 (`printer-files`) | `printer-files-and-reports` (+ `real-world-projects` for 2) | Balanced | — |
| 13 | Security on IBM i | 18 | 0 | `security-and-compliance` (+ `ibm-i-operations` for 2) | Underrepresented (practice) | Zero practice questions across an 18-lesson category — same gap flagged for SQL/ILE/Journaling/Integration below. |
| 14 | Job & Work Management | 22 | 6 (`ibm-i-operations`) + share of `debugging` pool | `ibm-i-operations`, `debugging-and-job-logs` (+ `real-world-projects` for 1) | Balanced | Lessons span two tracks; practice questions are concentrated in one topic ID. |
| 15 | System Administration | 0 | 0 | — | Empty (by design) | Correctly out of scope for a developer-focused curriculum. |
| 16 | Journaling & Commitment Control | 8 | 0 | `journaling-and-commitment-control` | Underrepresented (practice) | Zero practice questions, same pattern as ILE/Security/Integration. |
| 17 | APIs & System Interfaces (native) | 1 | 0 | `clle` | Near-empty | Only one lesson (`data-areas-in-clle`) platform-wide represents this category, and it's "hidden" inside the CLLE topic filter (see Section E). |
| 18 | IFS | 2 | 0 | `libraries-objects-and-ifs` (+ `integration-and-modernization` for 1 secondary) | Underrepresented | Thin relative to how often IFS comes up in real integration/security work. |
| 19 | Modern Development Tools | 0 (primary) | 0 | — (secondary on 1 SQL lesson: ACS Run SQL Scripts) | Empty | Still the single largest structural gap identified by the original Coverage Audit (Gap #5); still unaddressed. |
| 20 | Web & Open Source on IBM i | 0 | 0 | — | Empty (by design) | Niche/deferred, unchanged. |
| 21 | Integration & Connectivity | 13 | 0 | `integration-and-modernization` | Underrepresented (practice) | Zero practice questions across a 13-lesson, professional-depth category. |
| 22 | Backup, HA & Enterprise Tooling | 0 (primary) | 0 | — (secondary on 2 Save/Restore lessons) | Empty | The developer-relevant subset (basic object/library-level backup) now lives under Category 4 via PR #119; BRMS/PowerHA/Db2 Mirror remain correctly out of scope. |
| 23 | Legacy & Query Tools | 0 | 0 | — | Empty (by design) | Unchanged. |
| 24 | Change Management & DevOps | 0 | 0 | — | Empty | Pairs with Category 19's gap (Git/CI/CD expectations). |
| 25 | Performance Tuning | 0 (primary) | 0 | — (secondary on 4 SQL/DB lessons) | Empty | Query optimization/EVI/access-path lessons touch this at an introductory level only, as intended. |
| 26 | Modernization Topics | 3 | 0 | `integration-and-modernization` | Underrepresented | Thin; the 3 lessons here were already cited by the original Coverage Audit under this exact category. |
| 27 | Career & Certification Path | 16 | 6 (`interview-readiness`) | `interview-and-professional-readiness` | Balanced | Clean 1:1 track mapping. |
| — | *(Uncategorized)* | 1 | — | `real-world-projects` | N/A | `end-to-end-mini-dms-style-flow` — flagged for Product Owner discussion, not force-fit. |

**Sum check:** 6+5+18+19+9+35+0+40+0+16+38+18+18+22+0+8+1+2+0+0+13+0+0+0+0+3+16+1 (Uncategorized) = **288**, matching the full catalog.

---

## C. Categories With No Lessons

| Category | Launch Concern? | Recommended Future Action |
|---|---|---|
| 7. Database Design & Advanced DB2 for i | No | Defer; if ever pursued, extend `sql-for-ibm-i` rather than create a new track (normalization/FIELDPROC/cross-reference topics are a natural SQL-track extension). |
| 9. COBOL on IBM i | No | Keep deferred — deliberate RPG-first positioning, not an oversight. If ever added, it must be its own explicit track, never folded into RPGLE. |
| 15. System Administration | No | Keep deferred indefinitely unless the platform's audience broadens beyond developers. |
| 19. Modern Development Tools | **Yes** | Still the single largest unresolved gap flagged by the original Coverage Audit (Recommended PR #5, "Modern IBM i Developer Tooling Overview") — this audit reconfirms it is still empty. Should be prioritized as the next content batch. |
| 20. Web & Open Source on IBM i | No | Niche/specialized; reasonable to keep deferred. |
| 22. Backup, HA & Enterprise Tooling | No | The developer-relevant subset is already covered under Category 4 via the PR #119 Save/Restore batch; BRMS/PowerHA/Db2 Mirror correctly remain out of scope unless the platform adds an admin/ops track. |
| 23. Legacy & Query Tools | No | Low priority; defer. |
| 24. Change Management & DevOps | Mild | Pairs naturally with Category 19's gap (Git/version control, CI/CD are now baseline expectations at many shops); fold into the same future Modern Dev Tools batch rather than a standalone PR. |
| 25. Performance Tuning | No | Advanced/specialized; appropriate for later expansion. |

---

## D. Ambiguous / Cross-Category Lessons

The full per-lesson Secondary Category column above records all 56 Medium-confidence and 6 Low-confidence rows. The most structurally significant ones are called out here:

| Lesson | Slug | Primary | Secondary | Recommendation |
|---|---|---|---|---|
| Mini Project: End-to-End Mini DMS-Style Flow | `end-to-end-mini-dms-style-flow` | **Uncategorized** | — | Genuinely spans RPGLE + CLLE as a deliberate capstone. Product Owner should decide whether mini-project capstones get their own pseudo-category in any future taxonomy, or always default to their dominant technology. |
| Data Areas in CLLE | `data-areas-in-clle` | 17. APIs & System Interfaces | 3. CL Programming | This is the curriculum's *only* representative of native API/system-interface content, but it is filed under the CLLE topic filter, where a learner looking for "IBM i APIs" would never find it. Recommend surfacing it via a secondary tag if/when master-category filtering ships. |
| Authorities and Object Access Basics / Authority Failures and How to Investigate Them | `authorities-and-object-access-basics`, `authority-failures-and-how-to-investigate-them` | 13. Security on IBM i | 14. Job & Work Management | Live in `ibm-i-operations` (predates the dedicated `security-and-compliance` track from PR #114) but their subject matter is Security. The original Coverage Audit already cited both files under its Security row. Worth a Product Owner decision on whether to re-home `trackId` to `security-and-compliance` — see Section E. |
| Object Locks Basics / Handling Object Locks as a Developer | `object-locks-basics`, `handling-object-locks-as-a-developer` | 4. Object & Library Management | 14. Job & Work Management | Same track/category mismatch pattern, less urgent since Object & Library Management is a less "owned" category than Security. |
| Library List in Real Job Execution / Library List Problems in Real Applications | `library-list-in-real-job-execution`, `library-list-problems-in-real-applications` | 4. Object & Library Management | 14. Job & Work Management | Same pattern; library list is fundamentally an object/library concept applied in a job-execution context. |
| RCAC and Field Procedures Overview | `rcac-and-field-procedures-overview` | 13. Security on IBM i | 7. Database Design & Advanced DB2 for i | Genuinely straddles two categories that are both, coincidentally, thin/empty elsewhere — RCAC/FIELDPROC is arguably as much a database-design feature as a security feature. |
| Encoded Vector Indexes Introduction | `encoded-vector-indexes-introduction` | 6. SQL on IBM i | 7. Database Design & Advanced DB2 for i, 25. Performance Tuning | Three-way overlap; kept at SQL-track/introductory depth per that batch's own explicit content guidance. |
| Backup vs Journaling vs High Availability | `backup-vs-journaling-vs-high-availability` | 4. Object & Library Management | 16. Journaling & Commitment Control, 22. Backup/HA/Enterprise Tooling | Deliberately compares all three concepts; arguably could be primary-categorized under any of the three. |
| Modern IBM i Development Overview / Why APIs Matter on IBM i / Exposing IBM i Logic as an API | `modern-ibm-i-development-overview`, `why-apis-matter-on-ibm-i`, `exposing-ibm-i-logic-as-an-api` | 26. Modernization Topics | 21. Integration & Connectivity | These three were the ones the original Coverage Audit itself cited under Category 26 (Modernization); the rest of the `integration-and-modernization` track lessons are Category 21. Confirms the track already contains two genuinely distinct master categories. |
| IFS and API Payload Files | `ifs-and-api-payload-files` | 21. Integration & Connectivity | 18. IFS | Also cited by the original audit under both categories 18 and 21. |
| Securing IBM i APIs at a Beginner Level | `securing-ibm-i-apis-at-a-beginner-level` | 21. Integration & Connectivity | 13. Security on IBM i | Same dual-citation pattern as above in the original audit. |

*(The remaining ~40 Medium-confidence rows are lower-stakes overlaps — e.g. mini-projects touching both their primary screen/SQL/report technology and a secondary RPGLE/debugging angle, or printer-file lessons that also lightly touch Job & Work Management via output queues — already fully itemized in the lesson-level table above.)*

---

## E. Current Track/Module Issues

- **`ibm-i-operations` is really three master categories under one trackId.** 10 lessons are genuinely Job & Work Management, 2 are Security (predate the PR #114 security track), and 4 are Object & Library Management (object locks, library-list troubleshooting). This is the most consequential track/category mismatch in the catalog — worth a Product Owner decision on whether to re-home the 6 non-Job-Management lessons' `trackId` (a metadata-only change; would not affect slugs/URLs) or leave them as-is and rely on the proposed `masterCategoryId` metadata field instead.
- **`libraries-objects-and-ifs` now blends three concerns**: core object/library management, IFS, and (since PR #119) Save/Restore. IFS is its own dedicated master category (18) with real, distinct subject matter (stream files, directory structure) — it's currently invisible as a separate concern in the UI because it shares a `trackId` and topic filter with everything else in that track.
- **`data-areas-in-clle` is the sole representative of Category 17** (native APIs/system interfaces) and is filed under the CLLE topic filter — a learner will never find it by looking for "APIs." This is a discoverability gap, not a data error.
- **`debugging-and-job-logs` and `real-world-projects` are both intentionally cross-cutting tracks**, confirmed again in this pass (consistent with the original Coverage Audit's own Section D finding that these are valuable pedagogical formats, not distinct master categories). They remain fine as tracks; they simply cannot be mapped 1:1 to a single master category, which any future "group by master category" UI will need to handle at the lesson level, not the track level.
- **`rpgle-advanced` still exists in `tracks.ts` with 0 lessons.** Confirmed unchanged since the original audit — still an intentional placeholder, still worth a conscious decision (keep reserved vs. remove) rather than leaving it as an open question indefinitely.
- **No `lib/topics.ts` filter is technically missing** — every `trackId` has a corresponding `TOPIC_FILTERS` entry. However, several existing filters are **misleading** relative to true master-category content: the "CLLE" filter includes a native-API lesson; the "Libraries, Objects & IFS" filter now spans three distinct master categories (Object & Library Management, IFS, and Backup-adjacent Save/Restore content).
- **Should any category become a track, module, tag, or UI-filter-only?** Given the volume mismatch across categories (Category 8 = 40 lessons vs. Category 17 = 1 lesson), master categories should **not** be forced into a 1:1 relationship with `trackId`. Some categories (Security, Journaling, ILE, SQL, Screen & UI) already warrant their own track and should keep it. Others (native APIs, IFS, Database Design, Performance Tuning) are too thin today to justify a dedicated track and are better served as **tag/filter-only** groupings layered on top of the existing track structure — this is exactly what the proposed `masterCategoryId` metadata field (Section H) is for.

---

## F. Recommended Grouping Strategy

### Option 1: Physical folder reorganization
*Example: `content/lessons/03-cl-programming/01-clle-program-structure.md`*

- **Benefits:** Filesystem browsing would visually reflect the taxonomy; could reinforce category boundaries for content authors.
- **Risks:** Touches all 288 files in a single change; git history for every file would show as a rename/move, complicating `git blame`/history review; introduces real risk of a broken or duplicated file if any move is mis-scripted.
- **Impact on `contentSourcePath`:** All 288 values in `metadata.ts` would need to change to the new relative path.
- **Impact on `scripts/seed-lessons.ts`:** No script logic change needed — it pushes whatever `contentSourcePath` string is in `metadata.ts` verbatim — but every one of the 288 upserts would carry a changed `content_source_path` value, and `npm run seed` would need a full re-run.
- **Impact on `lib/lessons.ts`:** **This is the critical blocker.** `loadLessonMarkdown()` ([lib/lessons.ts:137-158](lib/lessons.ts#L137-L158)) deliberately calls `basename(knownLesson.contentSourcePath)` and resolves the file against a single flat `LESSON_CONTENT_DIR` — it **strips any directory component from `contentSourcePath` today, by design**, as a path-traversal safeguard. A physical folder reorg would silently break content loading (or worse, silently keep loading the old flat-directory copy if one were left behind) unless this function is also rewritten to preserve and validate a nested relative path. This is real production code that would need a coordinated change, not just a content move.
- **Impact on `relatedLessonSlugs` / `prerequisites` / `relatedLessons`:** None — all cross-references are by `slug`, never by file path.
- **Impact on practice questions:** None — `relatedLessonSlugs` in `content/practice/questions.ts` is slug-based.
- **Impact on existing URLs:** None directly (URLs are slug-based — see Section G) — but only if the `lib/lessons.ts` change above is done correctly and verified for every lesson.
- **Migration effort:** High — 288 file moves, 288 `contentSourcePath` edits, one `lib/lessons.ts` code change, a full reseed, and full regression QA on every existing lesson URL.
- **Rollback risk:** High — a partial or interrupted reorg leaves the catalog in a broken, hard-to-diagnose state (some lessons loading, others silently 500ing).

### Option 2: Keep files flat, improve metadata taxonomy
*Example: add `masterCategoryId` / `masterSubcategory` fields alongside existing `trackId` / `moduleId` / `tags`.*

- **Benefits:** Zero risk to URLs, content loading, or seeding logic. Purely additive fields, following the exact same precedent already used for `trackId`/`moduleId`/`tags`/etc. (Spec 009 v2.1 Section 11.3, migration `004_lesson_v2_metadata.sql`). Can be populated directly from this audit's lesson-level table with no further analysis needed.
- **Risks:** None to existing behavior. The only "risk" is doing the classification work now, which this audit has already done.
- **Impact on `contentSourcePath`:** None — unchanged.
- **Impact on `scripts/seed-lessons.ts`:** One additive line per new field in the upsert object, mirroring the existing pattern.
- **Impact on `lib/lessons.ts`:** None required for this PR's scope; the `Lesson` interface would eventually need two new optional fields when a future PR starts reading them.
- **Impact on AI Tutor retrieval:** None required now; available as a future signal if lesson-context retrieval is ever extended to reason about category.
- **Impact on `relatedLessonSlugs` / practice questions:** None required now; optional future extension (Phase 2, see Section H).
- **Impact on existing URLs:** None.
- **Migration effort:** Low — one bulk metadata edit, one small Supabase migration for two new nullable columns (same shape as migration 004), one reseed.
- **Rollback risk:** Very low — additive-only columns/fields; safe to leave unpopulated or drop later with no data loss elsewhere.

### Option 3: Hybrid — flat files today, metadata taxonomy now, optional UI regrouping later
- Identical technical footprint to Option 2 in this PR's scope, but frames it explicitly as the first phase of a longer plan: once `masterCategoryId` exists on every lesson, a future PR can optionally group the Learning Center / lesson sidebar by master category *in addition to* (not instead of) the existing `trackId`-based `TOPIC_FILTERS`, without ever touching a file path.
- **Recommendation: adopt Option 3.** It has the same near-zero risk profile as Option 2, and it explicitly keeps the door open for better UI grouping later without ever taking on Option 1's `lib/lessons.ts`/URL/reseed risk. There is no strong reason found in this audit to physically move any file — nothing in the current codebase or lesson volume creates real navigational pain that metadata can't solve.

---

## G. URL and Slug Safety Analysis

- **Public lesson URLs are based on `slug`, not file path.** `app/learn/ibm-i-fundamentals/[slug]/page.tsx` resolves lessons via `getPublishedLessonBySlug(slug)` ([lib/lessons.ts:63-83](lib/lessons.ts#L63-L83)), which queries Supabase's `lessons.slug` column. `contentSourcePath` is only ever used server-side to read the markdown file off disk — it never appears in a URL.
- **Would moving markdown files break existing URLs?** Not directly — URLs don't reference file paths. But it **would break content loading** unless `contentSourcePath` in `metadata.ts` is updated **and** `lib/lessons.ts`'s `loadLessonMarkdown()` is changed to stop discarding the directory portion via `basename()` (see Option 1 above). A physical move done without that code change would not 404 the lesson page itself, but would throw `Lesson content not available for: {slug}` when the page tries to render the body.
- **Would renaming slugs break existing links?** Yes, unconditionally. Slugs are the literal URL path segment (`/learn/ibm-i-fundamentals/{slug}`) and the Supabase lookup key. This audit does not propose renaming any slug, and no future phase of the plan below requires it.
- **Would changing `contentSourcePath` require a seed change?** Yes — `contentSourcePath` is one of the columns `npm run seed` pushes into Supabase (`scripts/seed-lessons.ts:45`), so any change requires editing `metadata.ts` and re-running `npm run seed` for the new value to take effect, on top of the `lib/lessons.ts` fix if the new path is actually nested.
- **What depends on slug stability?** The Supabase `lessons.slug` column (primary lookup key for every published-lesson query), every `/learn/ibm-i-fundamentals/{slug}` URL, `prerequisites`/`relatedLessons` cross-references in `metadata.ts`, `relatedLessonSlugs` in `content/practice/questions.ts`, AI Tutor's lesson-context resolution (`getPublishedLessonBySlugOrNull`), and the lesson sidebar's prev/next navigation.
- **How to reorganize without breaking deployed URLs, if ever pursued:** Treat any future physical reorg as three coordinated changes done together in one dedicated PR — (1) update `contentSourcePath` values, (2) update `loadLessonMarkdown()` to preserve and validate the full relative path instead of `basename()`-only, (3) re-run `npm run seed` — followed by full regression QA hitting every existing lesson URL before and after. No redirect/compatibility layer would be needed, since slugs and URLs never change in this scenario; the only real risk is content-loading, not routing.

---

## H. Proposed Future Implementation Plan

**Phase 1 — Metadata taxonomy (no behavior change):**
- Add optional `masterCategoryId` (1-27) and `masterSubcategory` (free text) fields to the `LessonMetadata` interface in `metadata.ts`.
- Populate all 288 lessons using this audit's own primary-category mapping (Section 1 above) — the classification work is already done.
- Add two new nullable columns via a Supabase migration, following the exact precedent of migration `004_lesson_v2_metadata.sql`.
- Add the two fields to the `scripts/seed-lessons.ts` upsert object.
- No `lib/lessons.ts`, routing, or UI change. `contentSourcePath` and every slug stay untouched.

**Phase 2 — Optional UI/retrieval extensions (separate PR, only once Phase 1 ships):**
- Extend `lib/topics.ts` / the Learning Center / lesson sidebar to optionally group by `masterCategoryId` *in addition to* the existing `trackId`-based `TOPIC_FILTERS` — never replacing them, to avoid breaking any bookmarked `?topic=` link.
- Extend AI Tutor lesson-context retrieval to consider `masterCategoryId` as an additional signal, if/when cross-lesson retrieval logic is built.
- Extend `content/practice/questions.ts`'s `PracticeTopic` records with a `masterCategoryId`, closing the practice-to-category traceability gap this audit surfaced (Section B).

**Phase 3 — Optional physical reorganization (only if Phase 1/2 usage reveals a real navigational problem metadata alone can't solve):**
- Execute as its own dedicated PR, bundling the `contentSourcePath` updates, the `lib/lessons.ts` fix described in Section G, and a full reseed, with complete regression QA on every existing lesson URL before merge.
- No redirect/compatibility layer is expected to be necessary, since URLs are slug-based, not path-based (Section G) — but this should still be explicitly re-verified at that time.

---

## I. Recommended Next PR

In priority order:

1. **Metadata Taxonomy Implementation (Phase 1 of this audit)** — directly operationalizes this audit's own findings; lowest risk, highest immediate value, and unblocks Phase 2's UI work whenever the Product Owner wants it.
2. **Professional Practice Questions for Advanced Tracks** — this audit reconfirms that Categories 10 (ILE), 13 (Security), 16 (Journaling), 17 (native APIs), 18 (IFS), and 21 (Integration) — 91 lessons combined — still have **zero** practice questions, the same gap flagged in the original Coverage Audit and every PR since. Pure-additive, no taxonomy risk, fastest win available.
3. **Modern IBM i Developer Tooling Overview** — Category 19 remains completely empty and is reconfirmed here as the largest true content gap (RDi/VS Code for i/Git/Merlin), unchanged since the original Coverage Audit's Recommended PR #5.
4. **Save/Restore Review + Publish Pass** — still pending from PR #119; the 8 Save/Restore lessons remain Review Ready and uncounted in the public Published total.

---

## Validation Results

This PR is documentation-only. The following was run to confirm nothing else changed:

- `npm run seed` — 288 succeeded, 0 failed (unchanged from PR #119: 280 Published + 8 Review Ready)
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — clean

## Manual QA

- Only `planning/LESSON_TAXONOMY_AND_GROUPING_AUDIT.md` was added; `git status --short` shows no other changes
- No lesson `.md` files were moved, renamed, or edited
- No slugs were changed
- No `metadata.ts`, `tracks.ts`, or `lib/topics.ts` changes — read-only analysis throughout
- `/learn` loads correctly, still shows 280 lessons published
- `/practice` loads correctly
- AI Tutor still opens
- Protected lesson gating (Review Ready lessons still 404, Published lessons still 200) is unchanged
- No auth/session, protected-route, progress/Mark Complete, Supabase RLS, AI Tutor streaming, or practice scoring code was touched
