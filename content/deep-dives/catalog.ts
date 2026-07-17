/**
 * Deep Dives catalog (PR #154). Every entry here is `status: 'planned'` --
 * this PR ships the framework, taxonomy, and listing page, not the
 * content itself (see planning/DEEP_DIVES_STRATEGY.md for why these 16
 * topics were chosen, and planning/DEEP_DIVE_TEMPLATE.md for the
 * structure each one will follow once written).
 *
 * Do not add `estimatedReadTime` to a `planned` entry -- there is no real
 * content yet to estimate a reading time from, and showing one would
 * imply content exists when it doesn't (see lib/deep-dives.ts).
 */

import type { DeepDive } from '@/lib/deep-dives'

export const DEEP_DIVES: DeepDive[] = [
  {
    slug: 'stored-procedures-on-ibm-i',
    title: 'Stored Procedures on IBM i',
    description:
      'How SQL and external (RPGLE/CLLE) stored procedures work on Db2 for i, when to reach for one, and how they fit into a real application.',
    category: 'sql-db2',
    difficulty: 'professional',
    status: 'planned',
    tags: ['sql', 'stored-procedures', 'db2-for-i'],
  },
  {
    slug: 'database-triggers-on-ibm-i',
    title: 'Database Triggers on IBM i',
    description:
      'Before/after triggers on physical files: what they can and can’t safely do, common pitfalls, and how they interact with commitment control.',
    category: 'sql-db2',
    difficulty: 'professional',
    status: 'planned',
    tags: ['sql', 'triggers', 'db2-for-i'],
    relatedDeepDiveSlugs: ['commitment-control-deep-dive'],
  },
  {
    slug: 'service-programs-and-binding-directories',
    title: 'Service Programs and Binding Directories',
    description:
      'Building reusable *SRVPGM modules, exporting procedures with a binder source, and organizing binding directories for a real multi-program application.',
    category: 'ile-service-programs',
    difficulty: 'professional',
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
    difficulty: 'expert',
    status: 'planned',
    tags: ['ile', 'activation-groups'],
    relatedDeepDiveSlugs: ['service-programs-and-binding-directories'],
  },
  {
    slug: 'commitment-control-deep-dive',
    title: 'Commitment Control',
    description:
      'Journaling-backed commitment control end to end: starting it, commit/rollback boundaries, isolation levels, and what happens when a job ends mid-transaction.',
    category: 'journaling-commitment-control',
    difficulty: 'professional',
    status: 'planned',
    tags: ['commitment-control', 'journaling', 'transactions'],
    relatedDeepDiveSlugs: ['journaling-in-real-applications'],
  },
  {
    slug: 'journaling-in-real-applications',
    title: 'Journaling in Real Applications',
    description:
      'Beyond "turn on journaling": receiver management, remote journals, and using journal entries for real recovery and auditing scenarios.',
    category: 'journaling-commitment-control',
    difficulty: 'professional',
    status: 'planned',
    tags: ['journaling', 'auditing', 'recovery'],
    relatedDeepDiveSlugs: ['commitment-control-deep-dive'],
  },
  {
    slug: 'record-locking-in-rpgle',
    title: 'Record Locking in RPGLE',
    description:
      'How UPDAT/DLTE locking actually behaves under the hood, diagnosing lock waits and RNX/RNQ escapes, and designing for concurrent access without deadlocking.',
    category: 'rpgle',
    difficulty: 'intermediate',
    status: 'planned',
    tags: ['rpgle', 'record-locking', 'concurrency'],
    relatedLessonSlugs: ['chain-for-keyed-access'],
  },
  {
    slug: 'native-io-vs-sql',
    title: 'Native I/O vs SQL',
    description:
      'A practical decision guide for choosing native RPGLE file I/O versus embedded SQL for a given piece of logic -- performance, readability, and maintenance tradeoffs.',
    category: 'rpgle',
    difficulty: 'intermediate',
    status: 'planned',
    tags: ['rpgle', 'sql', 'performance'],
  },
  {
    slug: 'sqlrpgle-cursor-patterns',
    title: 'SQLRPGLE Cursor Patterns',
    description:
      'Reusable patterns for declaring, opening, and fetching from cursors in SQLRPGLE -- including scrollable cursors and common SQLCODE/SQLSTATE handling mistakes.',
    category: 'sql-db2',
    difficulty: 'professional',
    status: 'planned',
    tags: ['sqlrpgle', 'sql', 'cursors'],
  },
  {
    slug: 'subfile-design-patterns',
    title: 'Subfile Design Patterns',
    description:
      'Load-all vs. page-at-a-time subfiles, multi-record-format screens, and structuring RPGLE code so a subfile-heavy program stays maintainable.',
    category: 'rpgle',
    difficulty: 'professional',
    status: 'planned',
    tags: ['rpgle', 'subfiles', 'display-files'],
  },
  {
    slug: 'job-log-and-msgw-troubleshooting',
    title: 'Job Log and MSGW Troubleshooting',
    description:
      'A practical checklist for reading a job log under pressure, diagnosing a job stuck in MSGW, and the commands that actually help you resolve it.',
    category: 'operations-troubleshooting',
    difficulty: 'intermediate',
    status: 'planned',
    tags: ['job-logs', 'msgw', 'troubleshooting'],
  },
  {
    slug: 'data-queues-deep-dive',
    title: 'Data Queues',
    description:
      'Using *DTAQ objects for inter-job communication -- keyed vs. FIFO queues, blocking receives, and where data queues fit versus a database table.',
    category: 'apis-integration',
    difficulty: 'intermediate',
    status: 'planned',
    tags: ['data-queues', 'ipc'],
  },
  {
    slug: 'job-queues-and-subsystems',
    title: 'Job Queues and Subsystems',
    description:
      'How subsystem descriptions, job queues, and routing entries actually control where and how a submitted job runs, with real troubleshooting scenarios.',
    category: 'operations-troubleshooting',
    difficulty: 'professional',
    status: 'planned',
    tags: ['subsystems', 'job-queues', 'operations'],
  },
  {
    slug: 'authority-and-adopted-authority',
    title: 'Authority and Adopted Authority',
    description:
      'Object/data authority in practice, how adopted authority (USRPRF(*OWNER)) actually propagates through a call stack, and where it commonly goes wrong.',
    category: 'security',
    difficulty: 'professional',
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
    difficulty: 'intermediate',
    status: 'planned',
    tags: ['ifs', 'apis', 'integration'],
  },
  {
    slug: 'apis-and-external-integration-on-ibm-i',
    title: 'APIs and External Integration on IBM i',
    description:
      'Exposing IBM i logic to the outside world and consuming external services from IBM i -- REST basics, common gateway patterns, and where each fits.',
    category: 'apis-integration',
    difficulty: 'professional',
    status: 'planned',
    tags: ['apis', 'integration', 'rest'],
  },
]
