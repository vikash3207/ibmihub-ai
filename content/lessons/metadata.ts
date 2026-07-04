/**
 * IBM i Fundamentals - Approved Lesson Sequence
 * Source: Spec 009 Section 5; D-CONT-001 resolved
 *
 * This file is the editable source of truth for lesson metadata.
 * Run `npm run seed` to sync this config into Supabase.
 *
 * Status values: 'Draft' | 'Review Ready' | 'Approved' | 'Published' | 'Unpublished / Archived'
 * All lessons start as 'Draft'. Change status here and re-run the seed script to publish.
 */

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
  },
  {
    slug: 'physical-files-and-logical-files',
    title: 'Physical Files and Logical Files',
    shortDescription: 'How IBM i stores data using physical and logical file structures.',
    lessonOrder: 6,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/physical-files-and-logical-files.md',
  },
  {
    slug: 'introduction-to-rpgle',
    title: 'Introduction to RPGLE',
    shortDescription: 'A first look at RPGLE, the primary programming language for IBM i development.',
    lessonOrder: 7,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/introduction-to-rpgle.md',
  },
  {
    slug: 'introduction-to-clle',
    title: 'Introduction to CLLE',
    shortDescription: 'Understanding Control Language and its role in IBM i system workflows.',
    lessonOrder: 8,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/introduction-to-clle.md',
  },
  {
    slug: 'introduction-to-db2-for-i',
    title: 'Introduction to DB2 for i',
    shortDescription: 'An introduction to the integrated relational database built into IBM i.',
    lessonOrder: 9,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/introduction-to-db2-for-i.md',
  },
  {
    slug: 'job-logs-and-spool-files-basics',
    title: 'Job Logs and Spool Files Basics',
    shortDescription: 'Understanding how IBM i records job activity and manages output.',
    lessonOrder: 10,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/job-logs-and-spool-files-basics.md',
  },
  {
    slug: 'basic-ibm-i-development-workflow',
    title: 'Basic IBM i Development Workflow',
    shortDescription: 'How a typical IBM i development and deployment workflow is structured.',
    lessonOrder: 11,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/basic-ibm-i-development-workflow.md',
  },
  {
    slug: 'where-to-go-next',
    title: 'Where to Go Next',
    shortDescription: 'Guidance on continuing your IBM i learning journey after completing the fundamentals.',
    lessonOrder: 12,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/where-to-go-next.md',
  },
]
