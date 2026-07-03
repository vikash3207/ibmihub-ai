/**
 * IBM i Fundamentals -- Approved Lesson Sequence
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
    shortDescription: 'Understanding why IBM i remains important for business-critical applications.',
    lessonOrder: 2,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/why-ibm-i-still-matters.md',
  },
  {
    slug: 'ibm-i-platform-overview',
    title: 'IBM i Platform Overview',
    shortDescription: 'A high-level look at the IBM i architecture and its integrated components.',
    lessonOrder: 3,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/ibm-i-platform-overview.md',
  },
  {
    slug: 'libraries-and-objects',
    title: 'Libraries and Objects',
    shortDescription: 'How IBM i organizes resources using libraries and objects.',
    lessonOrder: 4,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/libraries-and-objects.md',
  },
  {
    slug: '5250-screen-basics',
    title: '5250 Screen Basics',
    shortDescription: 'Understanding the 5250 terminal interface used to interact with IBM i.',
    lessonOrder: 5,
    learningPathId: 'ibm-i-fundamentals',
    status: 'Draft',
    contentSourcePath: 'content/lessons/5250-screen-basics.md',
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
