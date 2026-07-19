/**
 * Deep Dives catalog (PR #154). Every entry here is `status: 'planned'` --
 * this PR ships the framework, taxonomy, and listing page, not the
 * content itself (see planning/DEEP_DIVES_STRATEGY.md for why these
 * topics were chosen and how they're ordered, and
 * planning/DEEP_DIVE_TEMPLATE.md for the structure each one will follow
 * once written).
 *
 * Order matters here: it's the Product-Owner-approved priority order for
 * which topics get written first (see DEEP_DIVES_STRATEGY.md), not just
 * a data listing -- keep new entries appended in priority order, and
 * check with the Product Owner before reordering existing ones.
 *
 * No `difficulty` field on any entry (Product Owner clarification): Deep
 * Dives are professional-grade by definition, so there is nothing to
 * label. Do not add `estimatedReadTime` to a `planned` entry either --
 * there is no real content yet to estimate a reading time from, and
 * showing one would imply content exists when it doesn't (see
 * lib/deep-dives.ts).
 */

import type { DeepDive } from '@/lib/deep-dives'

export const DEEP_DIVES: DeepDive[] = [
  {
    slug: 'sql-on-ibm-i',
    title: 'SQL on IBM i',
    description:
      'A professional deep dive into SQL on IBM i, covering Db2 for i architecture, naming conventions, schemas, tables, joins, CTEs, SQLCODE, catalog queries, constraints, indexes, views, optimizer basics, authority, and production practices.',
    category: 'sql-db2',
    status: 'published',
    estimatedReadTime: 20,
    tags: ['sql', 'db2-for-i', 'sqlcode', 'catalog', 'referential-integrity'],
    relatedLessonSlugs: [
      'introduction-to-db2-for-i',
      'dds-and-sql-two-ways-to-define-db2-for-i-data',
      'sql-tables-vs-dds-physical-files',
      'acs-run-sql-scripts-for-ibm-i-developers',
      'sql-indexes-and-views-on-db2-for-i',
      'static-sql-vs-dynamic-sql-on-ibm-i',
      'sqlca-sqlcode-and-sqlstate-in-depth',
      'query-optimization-basics-on-db2-for-i',
    ],
    relatedPracticeTopics: ['advanced-sql', 'sqlrpgle-basics'],
    relatedDeepDiveSlugs: ['embedded-sql-in-rpgle'],
    lastUpdated: '2026-07-18',
  },
  {
    slug: 'embedded-sql-in-rpgle',
    title: 'Embedded SQL in RPGLE',
    description:
      'A professional deep dive into embedded SQL in RPGLE -- SQLRPGLE source setup, host variables, indicator variables, singleton SELECT, cursor loops, commitment control, dynamic SQL, and SQLCODE troubleshooting.',
    category: 'sql-db2',
    status: 'published',
    estimatedReadTime: 22,
    tags: ['sql', 'rpgle', 'sqlrpgle', 'embedded-sql', 'sqlcode'],
    relatedLessonSlugs: [
      'what-is-sqlrpgle',
      'basic-exec-sql-syntax-in-rpgle',
      'host-variables-in-sqlrpgle',
      'null-handling-basics-in-sqlrpgle',
      'using-sql-cursor-to-read-multiple-rows',
      'handling-no-row-found-in-sqlrpgle',
      'sqlcode-and-sqlstate-basics-in-sqlrpgle',
      'common-sqlrpgle-mistakes-and-best-practices',
    ],
    relatedPracticeTopics: ['sqlrpgle-basics', 'advanced-sql'],
    relatedDeepDiveSlugs: ['sql-on-ibm-i', 'sql-cursors-on-ibm-i'],
    lastUpdated: '2026-07-18',
  },
  {
    slug: 'sql-cursors-on-ibm-i',
    title: 'SQL Cursors on IBM i',
    description:
      'A professional deep dive into SQL cursors on IBM i -- the cursor lifecycle, DECLARE options, scrollable cursors, WHERE CURRENT OF, multi-row FETCH, SQLERRD(3), WITH HOLD, cursor-specific SQLCODE handling, and production practices.',
    category: 'sql-db2',
    status: 'published',
    estimatedReadTime: 20,
    tags: ['sql', 'cursors', 'sqlrpgle', 'sqlcode', 'with-hold'],
    relatedLessonSlugs: [
      'select-into-for-reading-one-row',
      'using-sql-cursor-to-read-multiple-rows',
      'fetch-loop-for-reading-multiple-rows',
      'handling-no-row-found-in-sqlrpgle',
      'sqlca-sqlcode-and-sqlstate-in-depth',
      'commitment-control-overview',
      'strcmtctl-commit-and-rollback-basics',
      'common-advanced-sql-mistakes-on-ibm-i',
    ],
    relatedPracticeTopics: ['sqlrpgle-basics', 'advanced-sql'],
    relatedDeepDiveSlugs: ['embedded-sql-in-rpgle', 'sql-error-handling-with-sqlcode-and-sqlstate'],
    lastUpdated: '2026-07-20',
  },
  {
    slug: 'stored-procedures-on-ibm-i',
    title: 'Stored Procedures on IBM i',
    description:
      'How SQL and external (RPGLE/CLLE) stored procedures work on Db2 for i, when to reach for one, and how they fit into a real application.',
    category: 'sql-db2',
    status: 'planned',
    tags: ['sql', 'stored-procedures', 'db2-for-i'],
  },
  {
    slug: 'database-triggers-on-ibm-i',
    title: 'Database Triggers on IBM i',
    description:
      'Before/after triggers on physical files: what they can and can’t safely do, common pitfalls, and how they interact with commitment control.',
    category: 'sql-db2',
    status: 'planned',
    tags: ['sql', 'triggers', 'db2-for-i'],
    relatedDeepDiveSlugs: ['commitment-control-deep-dive'],
  },
  {
    slug: 'sql-error-handling-with-sqlcode-and-sqlstate',
    title: 'SQL Error Handling with SQLCODE and SQLSTATE',
    description:
      'Reading and responding to SQLCODE/SQLSTATE in SQLRPGLE -- the codes that come up most in practice, and reliable checking patterns that don’t silently swallow errors.',
    category: 'sql-db2',
    status: 'planned',
    tags: ['sql', 'sqlcode', 'sqlstate', 'error-handling'],
    relatedDeepDiveSlugs: ['sql-cursors-on-ibm-i'],
  },
  {
    slug: 'native-io-vs-sql',
    title: 'Native I/O vs SQL Decision Guide',
    description:
      'A practical decision guide for choosing native RPGLE file I/O versus embedded SQL for a given piece of logic -- performance, readability, and maintenance tradeoffs.',
    category: 'rpgle',
    status: 'planned',
    tags: ['rpgle', 'sql', 'performance'],
  },
  {
    slug: 'commitment-control-deep-dive',
    title: 'Commitment Control with SQL and RPGLE',
    description:
      'Journaling-backed commitment control end to end, from both SQL and native RPGLE -- commit/rollback boundaries, isolation levels, and what happens when a job ends mid-transaction.',
    category: 'journaling-commitment-control',
    status: 'planned',
    tags: ['commitment-control', 'journaling', 'transactions', 'sql'],
    relatedDeepDiveSlugs: ['journaling-in-real-applications'],
  },
  {
    slug: 'sql-performance-basics-on-ibm-i',
    title: 'SQL Performance Basics on IBM i',
    description:
      'The SQL performance fundamentals every IBM i developer should know -- indexes, access plans, and the habits that keep queries fast as data grows.',
    category: 'sql-db2',
    status: 'planned',
    tags: ['sql', 'performance', 'db2-for-i'],
  },
  {
    slug: 'service-programs-and-binding-directories',
    title: 'Service Programs and Binding Directories',
    description:
      'Building reusable *SRVPGM modules, exporting procedures with a binder source, and organizing binding directories for a real multi-program application.',
    category: 'ile-service-programs',
    status: 'planned',
    tags: ['ile', 'service-programs', 'binding-directories'],
    relatedDeepDiveSlugs: ['activation-groups-deep-dive'],
  },
  {
    slug: 'activation-groups-deep-dive',
    title: 'Activation Groups',
    description:
      'What activation groups actually control (scoping, resource cleanup, RCLACTGRP behavior), and why the wrong choice causes hard-to-diagnose production bugs.',
    category: 'ile-service-programs',
    status: 'planned',
    tags: ['ile', 'activation-groups'],
    relatedDeepDiveSlugs: ['service-programs-and-binding-directories'],
  },
  {
    slug: 'record-locking-in-rpgle',
    title: 'Record Locking in RPGLE',
    description:
      'How UPDAT/DLTE locking actually behaves under the hood, diagnosing lock waits and RNX/RNQ escapes, and designing for concurrent access without deadlocking.',
    category: 'rpgle',
    status: 'planned',
    tags: ['rpgle', 'record-locking', 'concurrency'],
    relatedLessonSlugs: ['chain-for-keyed-access'],
  },
  {
    slug: 'journaling-in-real-applications',
    title: 'Journaling in Real Applications',
    description:
      'Beyond "turn on journaling": receiver management, remote journals, and using journal entries for real recovery and auditing scenarios.',
    category: 'journaling-commitment-control',
    status: 'planned',
    tags: ['journaling', 'auditing', 'recovery'],
    relatedDeepDiveSlugs: ['commitment-control-deep-dive'],
  },
  {
    slug: 'job-log-and-msgw-troubleshooting',
    title: 'Job Log and MSGW Troubleshooting',
    description:
      'A practical checklist for reading a job log under pressure, diagnosing a job stuck in MSGW, and the commands that actually help you resolve it.',
    category: 'operations-troubleshooting',
    status: 'planned',
    tags: ['job-logs', 'msgw', 'troubleshooting'],
  },
  {
    slug: 'subfile-design-patterns',
    title: 'Subfile Design Patterns',
    description:
      'Load-all vs. page-at-a-time subfiles, multi-record-format screens, and structuring RPGLE code so a subfile-heavy program stays maintainable.',
    category: 'rpgle',
    status: 'planned',
    tags: ['rpgle', 'subfiles', 'display-files'],
  },
  {
    slug: 'data-queues-deep-dive',
    title: 'Data Queues',
    description:
      'Using *DTAQ objects for inter-job communication -- keyed vs. FIFO queues, blocking receives, and where data queues fit versus a database table.',
    category: 'apis-integration',
    status: 'planned',
    tags: ['data-queues', 'ipc'],
  },
  {
    slug: 'job-queues-and-subsystems',
    title: 'Job Queues and Subsystems',
    description:
      'How subsystem descriptions, job queues, and routing entries actually control where and how a submitted job runs, with real troubleshooting scenarios.',
    category: 'operations-troubleshooting',
    status: 'planned',
    tags: ['subsystems', 'job-queues', 'operations'],
  },
  {
    slug: 'authority-and-adopted-authority',
    title: 'Authority and Adopted Authority',
    description:
      'Object/data authority in practice, how adopted authority (USRPRF(*OWNER)) actually propagates through a call stack, and where it commonly goes wrong.',
    category: 'security',
    status: 'planned',
    tags: ['security', 'adopted-authority', 'authority'],
    relatedLessonSlugs: ['authorities-and-object-access-basics', 'adopted-authority-basics'],
  },
  {
    slug: 'ifs-for-developers',
    title: 'IFS for Developers',
    description:
      'Working with the Integrated File System from RPGLE and CLLE -- stream file APIs, path handling, and common integration scenarios (CSV/JSON exchange, uploads).',
    category: 'apis-integration',
    status: 'planned',
    tags: ['ifs', 'apis', 'integration'],
  },
  {
    slug: 'apis-and-external-integration-on-ibm-i',
    title: 'APIs and External Integration on IBM i',
    description:
      'Exposing IBM i logic to the outside world and consuming external services from IBM i -- REST basics, common gateway patterns, and where each fits.',
    category: 'apis-integration',
    status: 'planned',
    tags: ['apis', 'integration', 'rest'],
  },
]
