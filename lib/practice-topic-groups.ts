/**
 * Consolidated topic groups for the Practice Hub session builder (IBM i
 * Practice Hub -- Guided Practice, Quick Quizzes and Interview Preparation).
 *
 * content/practice/questions.ts's 22 PRACTICE_TOPICS ids are the taxonomy of
 * record and stay completely untouched by this file -- every existing
 * PracticeQuestion.topicId value is still valid and unrenamed. This module
 * only adds a consolidation *layer* on top, purely for the session builder's
 * topic selector: 22 individual pills was flagged during planning as too
 * fragmented for a usable picker, so closely related topics are grouped
 * under one of 13 labels closely matching the brief's own suggested topic
 * list (e.g. "IBM i Fundamentals", "RPGLE", "Db2 for i and SQL", ...).
 *
 * Three existing topic ids are deliberately left out of every group's
 * `topicIds` list: `mini-projects` and `mixed-review` are cross-topic
 * review sets, not a single topic; `interview-readiness` is conceptually
 * superseded by the new, dedicated Interview Prep mode (content/practice/
 * interview-questions.ts). None of the three are deleted -- their questions
 * remain fully reachable through the "All Topics" selection (topicGroupId
 * `null`), which is not filtered by this module at all.
 *
 * No dependency on lib/lessons.ts or any server-only module, so this file
 * is safe to import from client components, matching the same reasoning
 * lib/deep-dive-categories.ts and lib/insight-categories.ts already
 * document for their own taxonomies.
 */

export interface PracticeTopicGroup {
  id: string
  label: string
  /** Underlying content/practice/questions.ts PRACTICE_TOPICS ids this group covers. */
  topicIds: string[]
}

export const PRACTICE_TOPIC_GROUPS: PracticeTopicGroup[] = [
  {
    id: 'ibm-i-fundamentals',
    label: 'IBM i Fundamentals',
    topicIds: ['ibm-i-fundamentals', 'commands-5250'],
  },
  {
    id: 'libraries-objects-ifs',
    label: 'Libraries, Objects and IFS',
    topicIds: ['libraries-and-objects'],
  },
  {
    id: 'rpgle',
    label: 'RPGLE',
    topicIds: ['rpgle-foundations', 'rpgle-file-io'],
  },
  {
    id: 'sqlrpgle',
    label: 'SQLRPGLE',
    topicIds: ['sqlrpgle-basics'],
  },
  {
    id: 'db2-for-i-and-sql',
    label: 'Db2 for i and SQL',
    topicIds: ['advanced-sql'],
  },
  {
    id: 'clle',
    label: 'CLLE',
    topicIds: ['clle-basics'],
  },
  {
    id: 'dds-display-files-subfiles',
    label: 'DDS, Display Files and Subfiles',
    topicIds: ['physical-logical-files', 'display-files', 'subfiles', 'printer-files'],
  },
  {
    id: 'ile-service-programs',
    label: 'ILE, Modules and Service Programs',
    topicIds: ['rpgle-ile'],
  },
  {
    id: 'jobs-operations',
    label: 'Jobs, Subsystems and Operations',
    topicIds: ['ibm-i-operations', 'save-restore'],
  },
  {
    id: 'debugging-troubleshooting',
    label: 'Debugging and Troubleshooting',
    topicIds: ['debugging'],
  },
  {
    id: 'journaling-commitment-control',
    label: 'Journaling and Commitment Control',
    topicIds: ['journaling-commitment-control'],
  },
  {
    id: 'apis-integration-modernization',
    label: 'APIs, Integration and Modernization',
    topicIds: ['integration-modernization'],
  },
  {
    id: 'security',
    label: 'Security',
    topicIds: ['security'],
  },
]

const GROUP_BY_ID = new Map(PRACTICE_TOPIC_GROUPS.map((g) => [g.id, g]))

export function resolveTopicGroup(id: string | null | undefined): PracticeTopicGroup | null {
  if (!id) return null
  return GROUP_BY_ID.get(id) ?? null
}

/** The underlying PRACTICE_TOPICS ids a group covers, or null for "All Topics" (no filtering). */
export function topicIdsForGroup(groupId: string | null | undefined): string[] | null {
  const group = resolveTopicGroup(groupId)
  return group ? group.topicIds : null
}
