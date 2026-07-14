/**
 * IBM i Fundamentals - Approved Lesson Sequence
 * Source: Spec 009 Section 5; D-CONT-001 resolved
 *
 * This file is the editable source of truth for lesson metadata.
 * Run `npm run seed` to sync this config into Supabase.
 *
 * Status values: 'Draft' | 'Review Ready' | 'Approved' | 'Published' | 'Unpublished / Archived'
 * All lessons start as 'Draft'. Change status here and re-run the seed script to publish.
 *
 * v2.0 fields (trackId, moduleId, difficulty, depth, tags, prerequisites,
 * relatedLessons, personaTags, aiTutorPrompts) are additive metadata from
 * Spec 009 v2.1 Section 11.3 / planning/CURRICULUM_EXPANSION_BLUEPRINT.md
 * Section 5. They do not change lessonOrder's existing role as the single
 * global ordering field the Learning Center, lesson navigation, and progress
 * "next lesson" calculation all currently depend on -- that behavior is
 * unchanged. See content/lessons/tracks.ts for the canonical track ID list.
 */

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type LessonDepth = 'foundation' | 'professional'
export type PersonaTag = 'beginner' | 'working-developer' | 'support-developer' | 'interview-prep'

export interface LessonMetadata {
  slug: string
  title: string
  shortDescription: string
  lessonOrder: number
  learningPathId: string
  status: 'Draft' | 'Review Ready' | 'Approved' | 'Published' | 'Unpublished / Archived'
  contentSourcePath: string
  estimatedReadingTime?: number
  aiTutorStarterQuestion?: string
  /** v2.0 (optional): see content/lessons/tracks.ts for approved track IDs. */
  trackId?: string
  /** v2.0 (optional): free-text module identifier within trackId. */
  moduleId?: string
  /** v2.0 (optional): single declared difficulty value, no ranges. */
  difficulty?: LessonDifficulty
  /** v2.0 (optional): foundation = first explanation; professional = production-grade counterpart. */
  depth?: LessonDepth
  /** v2.0 (optional): free-form topical tags for future cross-track discovery. */
  tags?: string[]
  /** v2.0 (optional): lesson slugs that should be completed first. */
  prerequisites?: string[]
  /** v2.0 (optional): cross-track "see also" lesson slugs. */
  relatedLessons?: string[]
  /** v2.0 (optional): approved values only -- see PersonaTag. */
  personaTags?: PersonaTag[]
  /** v2.0 (optional): expands aiTutorStarterQuestion into 2-3 suggested prompts. */
  aiTutorPrompts?: string[]
}

export const IBM_I_FUNDAMENTALS_LESSONS: LessonMetadata[] = [
  {
    slug: 'what-is-ibm-i',
    title: 'What is IBM i?',
    shortDescription: 'A beginner-friendly introduction to IBM i, the integrated platform that runs on IBM Power Systems.',
    lessonOrder: 1,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/what-is-ibm-i.md',
    estimatedReadingTime: 5,
    aiTutorStarterQuestion: "What's the difference between IBM i and IBM Power Systems?",
    trackId: 'ibm-i-foundations',
    moduleId: 'what-ibm-i-is',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ["What's the difference between IBM i and IBM Power Systems?"],
  },
  {
    slug: 'why-ibm-i-still-matters',
    title: 'Why IBM i Still Matters',
    shortDescription: 'Why organizations continue to rely on IBM i for critical systems, and what makes replacing it a slow, deliberate decision.',
    lessonOrder: 2,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/why-ibm-i-still-matters.md',
    estimatedReadingTime: 5,
    aiTutorStarterQuestion: "Why don't companies just migrate off IBM i if it's an older platform?",
    trackId: 'ibm-i-foundations',
    moduleId: 'why-ibm-i-still-matters',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ["Why don't companies just migrate off IBM i if it's an older platform?"],
  },
  {
    slug: 'ibm-i-platform-overview',
    title: 'IBM i Platform Overview',
    shortDescription: 'A high-level map of the major parts of the IBM i platform and how they work together.',
    lessonOrder: 3,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/ibm-i-platform-overview.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'How do libraries, objects, and Db2 for i files all fit together on IBM i?',
    trackId: 'ibm-i-foundations',
    moduleId: 'the-big-picture-map',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ['How do libraries, objects, and Db2 for i files all fit together on IBM i?'],
  },
  {
    slug: 'libraries-and-objects',
    title: 'Libraries and Objects',
    shortDescription: 'How IBM i organizes programs, files, and other objects using libraries, and why the library list matters.',
    lessonOrder: 4,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/libraries-and-objects.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: "What's the difference between an IBM i library and a folder on my computer?",
    trackId: 'libraries-objects-and-ifs',
    moduleId: 'objects-and-libraries',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ["What's the difference between an IBM i library and a folder on my computer?"],
  },
  {
    slug: '5250-screen-basics',
    title: '5250 Screen Basics',
    shortDescription: 'What a 5250 screen is, how people navigate it, and why many IBM i applications still use it.',
    lessonOrder: 5,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/5250-screen-basics.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'What do function keys like F3 typically do on a 5250 screen?',
    trackId: '5250-terminal-and-commands',
    moduleId: '5250-basics',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ['What do function keys like F3 typically do on a 5250 screen?'],
  },
  {
    slug: 'physical-files-and-logical-files',
    title: 'Physical Files and Logical Files',
    shortDescription: 'How IBM i stores data in physical files and provides different views of that data through logical files.',
    lessonOrder: 6,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/physical-files-and-logical-files.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: "What's the difference between a physical file and a logical file on IBM i?",
    trackId: 'db2-for-i-and-dds',
    moduleId: 'physical-and-logical-files',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ["What's the difference between a physical file and a logical file on IBM i?"],
  },
  {
    slug: 'introduction-to-rpgle',
    title: 'Introduction to RPGLE',
    shortDescription: "What RPGLE is, how it's used to build IBM i business applications, and how it connects to what you've learned so far.",
    lessonOrder: 7,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/introduction-to-rpgle.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'What is the difference between fixed-format and free-format RPGLE?',
    trackId: 'rpgle-beginner',
    moduleId: 'what-rpgle-is',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ['What is the difference between fixed-format and free-format RPGLE?'],
  },
  {
    slug: 'introduction-to-clle',
    title: 'Introduction to CLLE',
    shortDescription: "What CLLE is, how it's used to control and coordinate IBM i processes, and how it differs from RPGLE.",
    lessonOrder: 8,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/introduction-to-clle.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: "What's the difference between CLLE and RPGLE?",
    trackId: 'clle',
    moduleId: 'what-clle-is',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ["What's the difference between CLLE and RPGLE?"],
  },
  {
    slug: 'introduction-to-db2-for-i',
    title: 'Introduction to Db2 for i',
    shortDescription: 'What Db2 for i is, how it relates to physical and logical files, and how applications access the data it stores.',
    lessonOrder: 9,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/introduction-to-db2-for-i.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'How does Db2 for i relate to physical and logical files?',
    trackId: 'db2-for-i-and-dds',
    moduleId: 'db2-for-i',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ['How does Db2 for i relate to physical and logical files?'],
  },
  {
    slug: 'job-logs-and-spool-files-basics',
    title: 'Job Logs and Spool Files Basics',
    shortDescription: 'What job logs and spool files are, how they help with troubleshooting, and how they differ from physical and logical files.',
    lessonOrder: 10,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/job-logs-and-spool-files-basics.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: "What's the difference between a job log and a spool file?",
    trackId: 'debugging-and-job-logs',
    moduleId: 'job-logs-and-spool-files-basics',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner', 'support-developer'],
    aiTutorPrompts: ["What's the difference between a job log and a spool file?"],
  },
  {
    slug: 'basic-ibm-i-development-workflow',
    title: 'Basic IBM i Development Workflow',
    shortDescription: 'A general mental model for how IBM i developers move from source code to a tested, released program.',
    lessonOrder: 11,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/basic-ibm-i-development-workflow.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: "What's the difference between compiling a program and deploying it?",
    trackId: 'ibm-i-operations',
    moduleId: 'basic-development-workflow',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner', 'working-developer'],
    aiTutorPrompts: ["What's the difference between compiling a program and deploying it?"],
  },
  {
    slug: 'where-to-go-next',
    title: 'Where to Go Next',
    shortDescription: "A closing look at what you've learned across the IBM i Fundamentals path, and practical directions for continuing to learn.",
    lessonOrder: 12,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Published',
    contentSourcePath: 'content/lessons/where-to-go-next.md',
    estimatedReadingTime: 5,
    aiTutorStarterQuestion: 'What should I focus on learning next after finishing IBM i Fundamentals?',
    trackId: 'ibm-i-foundations',
    moduleId: 'where-to-go-next',
    difficulty: 'beginner',
    depth: 'foundation',
    personaTags: ['beginner'],
    aiTutorPrompts: ['What should I focus on learning next after finishing IBM i Fundamentals?'],
  },
  // --- Phase 1 Content Batch 1 (PR #58) ---
  // Status intentionally 'Review Ready', not 'Published': content is complete
  // and quality-bar-passing, but per Spec 009 Section 7 / CONTENT-FR-006, only
  // a Product Owner/Founder Approved -> Published transition makes a lesson
  // visible or countable toward the progress denominator. That transition is
  // a deliberate follow-up action, not part of this content-expansion PR.
  {
    slug: 'as400-iseries-and-ibm-i-naming-explained',
    title: 'AS/400, iSeries, and IBM i Naming Explained',
    shortDescription: 'Why the same platform has been called AS/400, iSeries, System i, and IBM i, and how these names relate to each other.',
    lessonOrder: 13,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Review Ready',
    contentSourcePath: 'content/lessons/as400-iseries-and-ibm-i-naming-explained.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: "If AS/400 and IBM i are the same platform, why do people still call it AS/400?",
    trackId: 'ibm-i-foundations',
    moduleId: 'what-ibm-i-is',
    difficulty: 'beginner',
    depth: 'foundation',
    tags: ['naming', 'history', 'as400', 'iseries'],
    prerequisites: ['what-is-ibm-i'],
    relatedLessons: ['why-ibm-i-still-matters'],
    personaTags: ['beginner'],
    aiTutorPrompts: [
      "If AS/400 and IBM i are the same platform, why do people still call it AS/400?",
      'What is Power Systems, and how does it relate to IBM i?',
    ],
  },
  {
    slug: 'ibm-i-access-client-solutions-overview',
    title: 'IBM i Access Client Solutions Overview',
    shortDescription: 'What IBM i Access Client Solutions (ACS) is, what its main tools do, and how it fits alongside the 5250 interface.',
    lessonOrder: 14,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Review Ready',
    contentSourcePath: 'content/lessons/ibm-i-access-client-solutions-overview.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'What is the difference between the 5250 emulator in ACS and the database tool in ACS?',
    trackId: '5250-terminal-and-commands',
    moduleId: '5250-basics',
    difficulty: 'beginner',
    depth: 'foundation',
    tags: ['acs', 'tools', '5250'],
    prerequisites: ['5250-screen-basics'],
    relatedLessons: ['5250-screen-basics'],
    personaTags: ['beginner'],
    aiTutorPrompts: [
      'What is the difference between the 5250 emulator in ACS and the database tool in ACS?',
      'Do I need special permission from IBM to install ACS?',
    ],
  },
  {
    slug: 'signing-on-user-profiles-and-current-library',
    title: 'Signing On, User Profiles, and Current Library',
    shortDescription: 'What happens when you sign on to IBM i, what a user profile is, and why your current library affects what you can find.',
    lessonOrder: 15,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Review Ready',
    contentSourcePath: 'content/lessons/signing-on-user-profiles-and-current-library.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'How is current library related to the library list I learned about earlier?',
    trackId: '5250-terminal-and-commands',
    moduleId: 'system-values-and-signing-on',
    difficulty: 'beginner',
    depth: 'foundation',
    tags: ['sign-on', 'user-profile', 'current-library'],
    prerequisites: ['5250-screen-basics'],
    relatedLessons: ['libraries-and-objects'],
    personaTags: ['beginner'],
    aiTutorPrompts: [
      'How is current library related to the library list I learned about earlier?',
      'What kinds of things can a user profile restrict besides libraries?',
    ],
  },
  {
    slug: 'ibm-i-command-structure',
    title: 'Understanding IBM i Command Structure',
    shortDescription: 'How IBM i command names follow a verb-plus-object pattern, and how commands and parameters fit together.',
    lessonOrder: 16,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Review Ready',
    contentSourcePath: 'content/lessons/ibm-i-command-structure.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'What are some other common verb abbreviations used in IBM i commands besides CRT, DSP, WRK, and DLT?',
    trackId: '5250-terminal-and-commands',
    moduleId: 'navigating-menus-and-command-entry',
    difficulty: 'beginner',
    depth: 'foundation',
    tags: ['commands', 'cl', 'syntax'],
    prerequisites: ['5250-screen-basics'],
    relatedLessons: ['using-f4-prompt-and-command-help'],
    personaTags: ['beginner'],
    aiTutorPrompts: [
      'What are some other common verb abbreviations used in IBM i commands besides CRT, DSP, WRK, and DLT?',
      "How do I know which parameters a command like CRTLIB actually needs?",
    ],
  },
  {
    slug: 'using-f4-prompt-and-command-help',
    title: 'Using F4 Prompt and Command Help',
    shortDescription: 'How to use the F4 prompt to fill in command parameters interactively, and how to use built-in command help.',
    lessonOrder: 17,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Review Ready',
    contentSourcePath: 'content/lessons/using-f4-prompt-and-command-help.md',
    estimatedReadingTime: 5,
    aiTutorStarterQuestion: 'What happens if I press Enter on a prompt screen without filling in a required parameter?',
    trackId: '5250-terminal-and-commands',
    moduleId: 'command-parameters-and-prompting',
    difficulty: 'beginner',
    depth: 'foundation',
    tags: ['f4', 'prompting', 'commands', 'help'],
    prerequisites: ['ibm-i-command-structure'],
    relatedLessons: ['ibm-i-command-structure'],
    personaTags: ['beginner'],
    aiTutorPrompts: [
      'What happens if I press Enter on a prompt screen without filling in a required parameter?',
      'Can I use F4 prompting on any IBM i command, or only some of them?',
    ],
  },
  {
    slug: 'common-ibm-i-object-types',
    title: 'Common IBM i Object Types',
    shortDescription: 'Common IBM i object types like *LIB, *FILE, *PGM, *USRPRF, and *OUTQ, and what each one is generally used for.',
    lessonOrder: 18,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Review Ready',
    contentSourcePath: 'content/lessons/common-ibm-i-object-types.md',
    estimatedReadingTime: 6,
    aiTutorStarterQuestion: 'What are some other IBM i object types besides *LIB, *FILE, *PGM, *USRPRF, and *OUTQ?',
    trackId: 'libraries-objects-and-ifs',
    moduleId: 'common-object-types',
    difficulty: 'beginner',
    depth: 'foundation',
    tags: ['objects', 'object-types', 'libraries'],
    prerequisites: ['libraries-and-objects'],
    relatedLessons: ['ibm-i-platform-overview', 'libraries-and-objects'],
    personaTags: ['beginner'],
    aiTutorPrompts: [
      'What are some other IBM i object types besides *LIB, *FILE, *PGM, *USRPRF, and *OUTQ?',
      'How can I find out the object type of something I am looking at on IBM i?',
    ],
  },
]
