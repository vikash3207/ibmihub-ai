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
]
