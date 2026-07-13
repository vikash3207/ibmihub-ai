/**
 * IBM i / AS400 Curriculum -- Approved Track Reference List (v2.0)
 * Source: specs/009-content-governance/spec.md v2.1 Section 5 (v2.0 Proposed
 * Multi-Track Structure); planning/CURRICULUM_EXPANSION_BLUEPRINT.md Section 2.1
 *
 * This is a plain reference list only -- it is not read by any application
 * code yet and does not drive any UI. It exists so lesson metadata (see
 * metadata.ts) references stable, typo-free track IDs instead of ad hoc
 * strings, ahead of the future track-catalog UI that will actually consume it.
 *
 * Adding, removing, or renaming a track requires Product Owner approval and a
 * revision to Spec 009 Section 5 (per CONTENT-FR-015) -- this file must stay
 * in sync with that spec, not diverge from it.
 */

export type TrackDifficultySpan =
  | 'Beginner'
  | 'Beginner → Intermediate'
  | 'Beginner → Advanced'
  | 'Intermediate'
  | 'Advanced'
  | 'Intermediate → Advanced'
  | 'All levels'

export interface TrackMetadata {
  id: string
  name: string
  difficultySpan: TrackDifficultySpan
}

export const TRACKS: TrackMetadata[] = [
  { id: 'ibm-i-foundations', name: 'IBM i Foundations', difficultySpan: 'Beginner' },
  { id: '5250-terminal-and-commands', name: '5250 Terminal and Core Commands', difficultySpan: 'Beginner → Intermediate' },
  { id: 'libraries-objects-and-ifs', name: 'Libraries, Objects, and the IFS', difficultySpan: 'Beginner → Intermediate' },
  { id: 'db2-for-i-and-dds', name: 'Db2 for i, DDS, Physical Files, and Logical Files', difficultySpan: 'Beginner → Intermediate' },
  { id: 'rpgle-beginner', name: 'RPGLE Beginner', difficultySpan: 'Beginner' },
  { id: 'rpgle-intermediate', name: 'RPGLE Intermediate', difficultySpan: 'Intermediate' },
  { id: 'rpgle-advanced', name: 'RPGLE Advanced', difficultySpan: 'Advanced' },
  { id: 'clle', name: 'CLLE (Control Language Programming)', difficultySpan: 'Beginner → Advanced' },
  { id: 'display-files-and-subfiles', name: 'Display Files and Subfiles', difficultySpan: 'Beginner → Advanced' },
  { id: 'printer-files-and-reports', name: 'Printer Files and Reports', difficultySpan: 'Beginner → Intermediate' },
  { id: 'sql-for-ibm-i', name: 'SQL for IBM i', difficultySpan: 'Beginner → Advanced' },
  { id: 'debugging-and-job-logs', name: 'Debugging, Job Logs, and Problem Diagnosis', difficultySpan: 'Beginner → Advanced' },
  { id: 'ibm-i-operations', name: 'IBM i Operations for Developers', difficultySpan: 'Beginner → Intermediate' },
  { id: 'integration-and-modernization', name: 'Integration and Modernization', difficultySpan: 'Intermediate → Advanced' },
  { id: 'real-world-projects', name: 'Real-World Projects', difficultySpan: 'Intermediate → Advanced' },
  { id: 'interview-and-professional-readiness', name: 'Interview and Professional Readiness', difficultySpan: 'All levels' },
]

export function getTrackById(id: string): TrackMetadata | undefined {
  return TRACKS.find((track) => track.id === id)
}
