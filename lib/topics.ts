/**
 * Shared topic/track grouping for lesson navigation UI.
 * Used by components/lesson-browser.tsx (topic filter buttons) and the
 * lesson reader sidebar (components/lesson-sidebar.tsx via the lesson
 * detail page) so both surfaces group lessons into the same topics.
 *
 * Only a type-only import of Lesson is taken from lib/lessons.ts, so this
 * module is safe to import from client components: `import type` is erased
 * at compile time and never pulls the `server-only` marker into a client
 * bundle.
 */

import type { Lesson } from '@/lib/lessons'

export interface TopicFilter {
  id: string
  label: string
  match: (lesson: Lesson) => boolean
}

/**
 * Buckets are derived from real trackId values in content/lessons/tracks.ts,
 * with RPGLE/File I/O and Display Files/Subfiles each split from their
 * shared trackId using the `tags` convention already used consistently
 * across every lesson in those two tracks ('file-io' and 'subfiles').
 */
export const TOPIC_FILTERS: TopicFilter[] = [
  { id: 'foundations', label: 'Foundations', match: (l) => l.track_id === 'ibm-i-foundations' },
  { id: 'commands', label: 'Commands', match: (l) => l.track_id === '5250-terminal-and-commands' },
  { id: 'libraries-objects-ifs', label: 'Libraries, Objects & IFS', match: (l) => l.track_id === 'libraries-objects-and-ifs' },
  { id: 'db2-dds', label: 'Db2 / DDS', match: (l) => l.track_id === 'db2-for-i-and-dds' },
  { id: 'rpgle', label: 'RPGLE', match: (l) => l.track_id === 'rpgle-beginner' && !(l.tags ?? []).includes('file-io') },
  { id: 'file-io', label: 'File I/O', match: (l) => l.track_id === 'rpgle-beginner' && (l.tags ?? []).includes('file-io') },
  { id: 'clle', label: 'CLLE', match: (l) => l.track_id === 'clle' },
  {
    id: 'display-files',
    label: 'Display Files',
    match: (l) => l.track_id === 'display-files-and-subfiles' && !(l.tags ?? []).includes('subfiles'),
  },
  { id: 'subfiles', label: 'Subfiles', match: (l) => l.track_id === 'display-files-and-subfiles' && (l.tags ?? []).includes('subfiles') },
  { id: 'sqlrpgle', label: 'SQLRPGLE', match: (l) => l.track_id === 'sql-for-ibm-i' },
  { id: 'printer-files', label: 'Printer Files', match: (l) => l.track_id === 'printer-files-and-reports' },
  { id: 'debugging', label: 'Debugging', match: (l) => l.track_id === 'debugging-and-job-logs' },
  { id: 'operations', label: 'Operations', match: (l) => l.track_id === 'ibm-i-operations' },
  { id: 'security', label: 'Security', match: (l) => l.track_id === 'security-and-compliance' },
  { id: 'journaling', label: 'Journaling & Commitment Control', match: (l) => l.track_id === 'journaling-and-commitment-control' },
  { id: 'rpgle-ile', label: 'Advanced RPGLE / ILE', match: (l) => l.track_id === 'rpgle-intermediate' || l.track_id === 'rpgle-advanced' },
  { id: 'integration', label: 'Modern IBM i / APIs / Integration', match: (l) => l.track_id === 'integration-and-modernization' },
  { id: 'mini-projects', label: 'Mini Projects', match: (l) => l.track_id === 'real-world-projects' },
  { id: 'interview', label: 'Interview Readiness', match: (l) => l.track_id === 'interview-and-professional-readiness' },
]

/** Return the first topic whose match() is true for the given lesson, if any. */
export function getTopicForLesson(lesson: Lesson): TopicFilter | undefined {
  return TOPIC_FILTERS.find((topic) => topic.match(lesson))
}

/** Return the topic filter for a given topic id, if it exists. */
export function getTopicById(topicId: string | null | undefined): TopicFilter | undefined {
  if (!topicId) return undefined
  return TOPIC_FILTERS.find((topic) => topic.id === topicId)
}
