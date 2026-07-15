/**
 * 5250 Command Practice -- exercise list.
 *
 * Sourced from planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md
 * Section 4 (PR #134). PR #136 implements the first three exercises
 * (command-line-basics, wrkobj, dspobjd) end-to-end -- `status: 'available'`
 * with full simulator content -- per its MVP scope. The remaining seven
 * stay `status: 'planned'` (no simulator content yet) for later PRs.
 *
 * All simulated data below (library/object names, dates, contents) is
 * fabricated training data, never real IBM i output (Spec 010 Safety Rules).
 */
import type { PracticeLabExercise } from '@/lib/practice-lab/types'

export const PRACTICE_LAB_5250_EXERCISES: PracticeLabExercise[] = [
  {
    id: '5250-01',
    slug: 'command-line-basics',
    title: 'Command line and prompt style basics',
    labType: '5250',
    difficulty: 'beginner',
    summary: 'Get comfortable with the 5250 command-line pattern: type a command, then press Enter to run it.',
    learningObjectives: ['Recognize the type-then-Enter command line pattern', 'Run a first simulated command'],
    relatedLessonSlugs: ['using-f4-prompt-and-command-help'],
    status: 'available',
    instructions:
      'Every 5250 session has a command line where you type a command and press Enter to run it -- ' +
      'there is no separate "submit" button, and nothing happens until you press Enter. Try it now: ' +
      'type WRKLIB and press Enter.',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===>'],
    },
    commandCheck: {
      commandName: 'WRKLIB',
      acceptedCommands: ['WRKLIB'],
    },
    hints: [
      'Commands are typed on the command line and run with Enter -- there\'s no separate "submit" button.',
      'Try typing WRKLIB exactly (case doesn\'t matter), then press Enter.',
    ],
    successMessage:
      'Nice work! WRKLIB opens a "Work with Libraries" screen. In a real 5250 session, this is exactly ' +
      'how you start almost anything: type a command, then press Enter.',
    successScreen: {
      title: 'Work with Libraries',
      lines: [
        'Library      Type      Text',
        'QGPL         *PROD     General purpose library',
        'QSYS         *PROD     Operating system library',
        'IBMIHUB      *TEST     Sample training library',
      ],
    },
  },
  {
    id: '5250-02',
    slug: 'wrklib',
    title: 'Use WRKLIB',
    labType: '5250',
    difficulty: 'beginner',
    summary: 'List libraries and understand what a library is in IBM i object terms.',
    learningObjectives: ['Run WRKLIB', 'Explain what a library is'],
    relatedLessonSlugs: ['working-with-wrkobj-dspobjd-and-wrklib', 'library-list-explained-in-depth'],
    status: 'planned',
  },
  {
    id: '5250-03',
    slug: 'wrkobj',
    title: 'Use WRKOBJ',
    labType: '5250',
    difficulty: 'beginner',
    summary: 'List objects within a library and recognize object type codes like *PGM and *FILE.',
    learningObjectives: ['Run WRKOBJ against a library', 'Identify common object type codes'],
    relatedLessonSlugs: ['working-with-wrkobj-dspobjd-and-wrklib'],
    status: 'available',
    instructions:
      'WRKOBJ lists objects matching a name (and optionally a library/type). Try: WRKOBJ OBJ(CUSTPF)',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===> WRKOBJ OBJ('],
    },
    commandCheck: {
      commandName: 'WRKOBJ',
      acceptedCommands: [
        'WRKOBJ OBJ(CUSTPF)',
        'WRKOBJ OBJ(IBMIHUB/CUSTPF)',
        'WRKOBJ OBJ(CUSTPF) OBJTYPE(*FILE)',
      ],
      requiredParamName: 'OBJ',
      acceptedParamValues: ['CUSTPF', 'IBMIHUB/CUSTPF'],
    },
    hints: [
      'WRKOBJ needs an OBJ parameter naming the object, like OBJ(CUSTPF).',
      'You can also qualify the object with its library: OBJ(IBMIHUB/CUSTPF).',
    ],
    successMessage:
      'This simulated screen lists objects in the IBMIHUB library. CUSTPF is a *FILE (a physical file) -- ' +
      'WRKOBJ is how you would find and work with any object like this on a real system.',
    successScreen: {
      title: 'Work with Objects',
      lines: [
        'Library: IBMIHUB',
        '',
        'Object      Type      Attribute   Text',
        'CUSTPF      *FILE     PF          Customer master file',
        'ORDHDR      *FILE     PF          Order header file',
        'ITEMPF      *FILE     PF          Item master file',
      ],
    },
  },
  {
    id: '5250-04',
    slug: 'dspobjd',
    title: 'Use DSPOBJD',
    labType: '5250',
    difficulty: 'beginner',
    summary: "Display a single object's description/metadata, and see how that differs from a WRKOBJ worklist.",
    learningObjectives: ['Run DSPOBJD against a single object', 'Explain DSPOBJD vs WRKOBJ'],
    relatedLessonSlugs: ['working-with-wrkobj-dspobjd-and-wrklib'],
    status: 'available',
    instructions:
      "DSPOBJD displays one object's metadata, rather than a worklist of many objects. Try: " +
      'DSPOBJD OBJ(CUSTPF) OBJTYPE(*FILE)',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===> DSPOBJD OBJ('],
    },
    commandCheck: {
      commandName: 'DSPOBJD',
      acceptedCommands: [
        'DSPOBJD OBJ(CUSTPF) OBJTYPE(*FILE)',
        'DSPOBJD OBJ(IBMIHUB/CUSTPF) OBJTYPE(*FILE)',
      ],
      requiredParamName: 'OBJ',
      acceptedParamValues: ['CUSTPF', 'IBMIHUB/CUSTPF'],
    },
    hints: [
      'DSPOBJD needs both OBJ and OBJTYPE, like OBJ(CUSTPF) OBJTYPE(*FILE).',
      'You can also qualify the object with its library: OBJ(IBMIHUB/CUSTPF) OBJTYPE(*FILE).',
    ],
    successMessage:
      'DSPOBJD shows metadata about one specific object -- not a list like WRKOBJ. Notice the created/changed ' +
      'timestamps and text description here.',
    successScreen: {
      title: 'Display Object Description',
      lines: [
        'Object . . . . . . . :   CUSTPF',
        'Library  . . . . . . :   IBMIHUB',
        'Type . . . . . . . . :   *FILE',
        'Attribute  . . . . . :   PF',
        'Text . . . . . . . . :   Customer master file',
        'Created  . . . . . . :   03/14/24  09:12:45',
        'Changed  . . . . . . :   06/02/25  16:47:03',
      ],
    },
  },
  {
    id: '5250-05',
    slug: 'wrksplf',
    title: 'Use WRKSPLF',
    labType: '5250',
    difficulty: 'beginner',
    summary: 'List spool files and understand how a spool file relates to the job that created it.',
    learningObjectives: ['Run WRKSPLF', 'Explain what a spool file is'],
    relatedLessonSlugs: ['working-with-spool-files-using-wrksplf'],
    status: 'planned',
  },
  {
    id: '5250-06',
    slug: 'wrkoutq',
    title: 'Use WRKOUTQ',
    labType: '5250',
    difficulty: 'beginner',
    summary: 'Understand output queues as the holding area spool files live in before printing.',
    learningObjectives: ['Run WRKOUTQ', 'Explain the difference between an output queue and a spool file'],
    relatedLessonSlugs: ['working-with-output-queues-using-wrkoutq', 'working-with-spool-files-using-wrksplf'],
    status: 'planned',
  },
  {
    id: '5250-07',
    slug: 'dspjob',
    title: 'Use DSPJOB',
    labType: '5250',
    difficulty: 'intermediate',
    summary: "Inspect a job's details -- status, job log, open files -- as a troubleshooting starting point.",
    learningObjectives: ['Run DSPJOB', 'Explain what a job log is used for'],
    relatedLessonSlugs: ['dspjob-and-job-information-basics'],
    status: 'planned',
  },
  {
    id: '5250-08',
    slug: 'wrkactjob',
    title: 'Use WRKACTJOB',
    labType: '5250',
    difficulty: 'intermediate',
    summary: "Recognize the system-wide \"what's currently running\" view and its status columns.",
    learningObjectives: ['Run WRKACTJOB', 'Recognize common job status values'],
    relatedLessonSlugs: ['wrkactjob-basics-for-developers', 'job-status-values-explained'],
    status: 'planned',
  },
  {
    id: '5250-09',
    slug: 'investigate-msgw-job',
    title: 'Investigate a MSGW job',
    labType: '5250',
    difficulty: 'intermediate',
    summary: 'Recognize MSGW (message-wait) status and the workflow to find out what message a job is waiting on.',
    learningObjectives: ['Identify a job in MSGW status', 'Explain that MSGW means waiting, not hung or crashed'],
    relatedLessonSlugs: ['job-status-values-explained', 'reading-ibm-i-message-ids'],
    status: 'planned',
  },
  {
    id: '5250-10',
    slug: 'wrkobjlck-object-lock',
    title: 'Find an object lock using WRKOBJLCK',
    labType: '5250',
    difficulty: 'intermediate',
    summary: 'Recognize that "why can\'t I update/delete this object" is often an object-lock question, and WRKOBJLCK is the tool to answer it.',
    learningObjectives: ['Run WRKOBJLCK against an object', 'Explain the difference between a shared and an exclusive lock'],
    relatedLessonSlugs: ['object-locks-basics', 'handling-object-locks-as-a-developer'],
    status: 'planned',
  },
]
