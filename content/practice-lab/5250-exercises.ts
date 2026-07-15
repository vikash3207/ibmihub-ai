/**
 * 5250 Command Practice -- exercise list.
 *
 * Sourced from planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md
 * Section 4 (PR #134). PR #136 implemented command-line-basics, wrkobj,
 * and dspobjd; PR #137 added wrksplf, wrkoutq, dspjob, and wrkactjob; PR
 * #138 adds a troubleshooting-focused batch -- msgw-job, dspjob-joblog
 * (new), and wrkobjlck. All ten are now `status: 'available'` with full
 * simulator content. Only wrklib remains `status: 'planned'`.
 *
 * The msgw-job/dspjob-joblog/wrkobjlck exercises (PR #138) also set
 * commandCheck.blockedActionCommands, so a learner trying a real
 * job-control action (ENDJOB, RLSJOB, CHGJOB, SNDRPY) gets a distinct,
 * safety-focused message instead of the generic "not available" fallback
 * -- see lib/practice-lab/5250-simulator.ts.
 *
 * All simulated data below (library/object/job names, dates, contents) is
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
    status: 'available',
    instructions: 'WRKSPLF lists your own spool files. Try: WRKSPLF',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===>'],
    },
    commandCheck: {
      commandName: 'WRKSPLF',
      acceptedCommands: ['WRKSPLF', 'WRKSPLF SELECT(*CURRENT)', 'WRKSPLF USER(*CURRENT)'],
    },
    hints: [
      'WRKSPLF on its own lists your current spool files.',
      'WRKSPLF SELECT(*CURRENT) and WRKSPLF USER(*CURRENT) both mean "just my own spool files" here.',
    ],
    successMessage:
      'This simulated screen lists your spool files. Each one is tied to the job that created it, and sits ' +
      'in an output queue until it prints or is deleted.',
    successScreen: {
      title: 'Work with Spooled Files',
      lines: [
        'File          User        Status    Pages   Output Queue',
        'QSYSPRT       DEMOUSER    RDY       3       QPRINT',
        'INVOICE       DEMOUSER    RDY       1       QPRINT',
        'PICKLIST      DEMOUSER    SAV       2       QPRINT',
      ],
    },
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
    status: 'available',
    instructions: 'WRKOUTQ lists spool files waiting in an output queue. Try: WRKOUTQ OUTQ(QPRINT)',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===> WRKOUTQ OUTQ('],
    },
    commandCheck: {
      commandName: 'WRKOUTQ',
      acceptedCommands: ['WRKOUTQ OUTQ(QPRINT)', 'WRKOUTQ OUTQ(IBMIHUB/QPRINT)', 'WRKOUTQ OUTQ(*ALL)'],
      requiredParamName: 'OUTQ',
      acceptedParamValues: ['QPRINT', 'IBMIHUB/QPRINT', '*ALL'],
    },
    hints: [
      'WRKOUTQ needs an OUTQ parameter naming the queue, like OUTQ(QPRINT).',
      'OUTQ(*ALL) shows every output queue you can see instead of just one.',
    ],
    successMessage:
      'This simulated screen shows the QPRINT output queue: its writer status and the spool files currently ' +
      'waiting in it -- the holding area a spool file sits in before it prints.',
    successScreen: {
      title: 'Work with Output Queue QPRINT',
      lines: [
        'Library: IBMIHUB        Writer status: STARTED',
        '',
        'File          User        Status    Pages',
        'QSYSPRT       DEMOUSER    RDY       3',
        'INVOICE       DEMOUSER    HLD       1',
        'PICKLIST      DEMOUSER    RDY       2',
      ],
    },
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
    status: 'available',
    instructions: 'DSPJOB displays details about one job. Try: DSPJOB',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===>'],
    },
    commandCheck: {
      commandName: 'DSPJOB',
      acceptedCommands: ['DSPJOB', 'DSPJOB JOB(123456/DEMOUSER/ORDJOB)', 'DSPJOB OPTION(*JOBLOG)'],
    },
    hints: [
      'DSPJOB on its own shows the job you are currently running in.',
      'You can also qualify a specific job: JOB(123456/DEMOUSER/ORDJOB), or jump to its messages with OPTION(*JOBLOG).',
    ],
    successMessage:
      "This simulated screen shows one job's identity, status, and run priority. OPTION(*JOBLOG) jumps " +
      "straight to that job's message log -- usually the first place to look when something goes wrong.",
    successScreen: {
      title: 'Display Job',
      lines: [
        'Job name . . . . . . :   ORDJOB',
        'User . . . . . . . . :   DEMOUSER',
        'Number . . . . . . . :   123456',
        'Status . . . . . . . :   ACTIVE',
        'Job queue/Subsystem  :   QBATCH',
        'Run priority . . . . :   50',
        'Current library  . . :   IBMIHUB',
      ],
    },
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
    status: 'available',
    instructions: 'WRKACTJOB shows every job currently active on the system. Try: WRKACTJOB',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===>'],
    },
    commandCheck: {
      commandName: 'WRKACTJOB',
      acceptedCommands: ['WRKACTJOB', 'WRKACTJOB SBS(QINTER)', 'WRKACTJOB SBS(QBATCH)'],
    },
    hints: [
      'WRKACTJOB on its own lists every active job across all subsystems.',
      'WRKACTJOB SBS(QINTER) or SBS(QBATCH) narrows the list to just that subsystem.',
    ],
    successMessage:
      'This simulated screen lists active jobs with their subsystem, user, and status. RUN means actively ' +
      'executing; DEQW, MSGW, and TIMW all mean the job is currently waiting on something, not crashed.',
    successScreen: {
      title: 'Work with Active Jobs',
      lines: [
        'Subsystem   Job         User        Number   Status   CPU%',
        'QINTER      DEMOUSER    DEMOUSER    123456   RUN      2.1',
        'QBATCH      ORDJOB      DEMOUSER    123457   DEQW     0.0',
        'QBATCH      RPTJOB      DEMOUSER    123458   MSGW     0.0',
        'QBATCH      TIMWJOB     DEMOUSER    123459   TIMW     0.0',
      ],
    },
  },
  {
    id: '5250-09',
    slug: 'msgw-job',
    title: 'Investigate a MSGW Job',
    labType: '5250',
    difficulty: 'intermediate',
    summary: 'Recognize MSGW (message-wait) status and the workflow to find out what message a job is waiting on.',
    learningObjectives: [
      'Identify a job in MSGW status',
      'Explain that MSGW means waiting, not hung or crashed',
      'Know the safe first step before acting on a stuck job',
    ],
    relatedLessonSlugs: ['job-status-values-explained', 'reading-ibm-i-message-ids'],
    status: 'available',
    instructions:
      'A job showing MSGW status is waiting for someone to reply to a message -- it has not crashed or ' +
      'hung. Use WRKACTJOB to find it. Try: WRKACTJOB',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===>'],
    },
    commandCheck: {
      commandName: 'WRKACTJOB',
      acceptedCommands: ['WRKACTJOB', 'WRKACTJOB SBS(QINTER)', 'WRKACTJOB SBS(QBATCH)'],
      blockedActionCommands: ['ENDJOB', 'RLSJOB', 'CHGJOB', 'SNDRPY'],
    },
    hints: [
      'WRKACTJOB on its own lists every active job -- look for a Status column showing MSGW.',
      'WRKACTJOB SBS(QBATCH) narrows the list down if you already suspect a batch job.',
    ],
    successMessage:
      "Notice the ORDJOB row is in MSGW status. That means the job is paused, waiting for a reply to a " +
      "message -- not stuck or crashed. On a real system, the safe next step is to read that job's job " +
      "log before doing anything else (see the next exercise), not to end or change it right away.",
    successScreen: {
      title: 'Work with Active Jobs',
      lines: [
        'Subsystem   Job         User        Number   Status   CPU%',
        'QINTER      DEMOUSER    DEMOUSER    100234   RUN      2.1',
        'QBATCH      ORDJOB      DEMOUSER    123456   MSGW     0.0',
        'QBATCH      RPTJOB      DEMOUSER    123458   RUN      1.4',
      ],
    },
  },
  {
    id: '5250-10',
    slug: 'dspjob-joblog',
    title: 'Review a Job Log with DSPJOB OPTION(*JOBLOG)',
    labType: '5250',
    difficulty: 'intermediate',
    summary: 'Use DSPJOB OPTION(*JOBLOG) to see why a job is waiting, by reading its message log.',
    learningObjectives: [
      'Run DSPJOB OPTION(*JOBLOG) against a specific job',
      'Read a message ID and message text at a beginner level',
      'Explain why the job log is the first place to check on a stuck job',
    ],
    relatedLessonSlugs: ['dspjob-and-job-information-basics', 'reading-ibm-i-message-ids'],
    status: 'available',
    instructions:
      'The job log explains what a job has been doing and what it is waiting on. Try: ' +
      'DSPJOB JOB(123456/DEMOUSER/ORDJOB) OPTION(*JOBLOG)',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===> DSPJOB'],
    },
    commandCheck: {
      commandName: 'DSPJOB',
      acceptedCommands: ['DSPJOB JOB(123456/DEMOUSER/ORDJOB) OPTION(*JOBLOG)', 'DSPJOB OPTION(*JOBLOG)'],
      // OPTION is the parameter that actually unlocks the job-log view in
      // this exercise (JOB(...) just narrows which job -- it's optional,
      // defaulting to "the current job", per the accepted forms above), so
      // OPTION is what gets the specific "missing parameter" message here.
      requiredParamName: 'OPTION',
      acceptedParamValues: ['*JOBLOG'],
      blockedActionCommands: ['ENDJOB', 'RLSJOB', 'CHGJOB', 'SNDRPY'],
    },
    hints: [
      'DSPJOB needs OPTION(*JOBLOG) to jump straight to a job\'s messages.',
      'Add JOB(123456/DEMOUSER/ORDJOB) if you want a specific job\'s log instead of your own current job.',
    ],
    successMessage:
      'This simulated job log shows why ORDJOB is waiting: a resource it needs is locked by another job, ' +
      'and a device message needs a reply. Reading the job log oldest-to-newest like this is usually the ' +
      'fastest way to understand what a job is actually doing before you act on it.',
    successScreen: {
      title: 'Display Job Log -- ORDJOB (123456/DEMOUSER)',
      lines: [
        'MSGID     Severity   Time       Text',
        'CPF1124   00         09:14:02   Job 123456/DEMOUSER/ORDJOB started.',
        'CPF0907   40         09:14:55   Object CUSTPF in library IBMIHUB locked by another job.',
        'CPA5305   60         09:15:10   Device or resource not available -- reply required.',
      ],
    },
  },
  {
    id: '5250-11',
    slug: 'wrkobjlck',
    title: 'Find an Object Lock using WRKOBJLCK',
    labType: '5250',
    difficulty: 'intermediate',
    summary: 'Recognize that "why can\'t I update/delete this object" is often an object-lock question, and WRKOBJLCK is the tool to answer it.',
    learningObjectives: [
      'Run WRKOBJLCK against an object',
      'Explain the difference between a lock holder and a job waiting on that lock',
      'Explain the difference between a shared and an exclusive lock',
    ],
    relatedLessonSlugs: ['object-locks-basics', 'handling-object-locks-as-a-developer'],
    status: 'available',
    instructions:
      'WRKOBJLCK shows which jobs currently hold a lock on an object. Try: WRKOBJLCK OBJ(CUSTPF) OBJTYPE(*FILE)',
    initialScreen: {
      title: 'Command Entry',
      lines: ['Type a command below and press Enter to run it.', '', 'Command ===> WRKOBJLCK OBJ('],
    },
    commandCheck: {
      commandName: 'WRKOBJLCK',
      acceptedCommands: [
        'WRKOBJLCK OBJ(CUSTPF) OBJTYPE(*FILE)',
        'WRKOBJLCK OBJ(IBMIHUB/CUSTPF) OBJTYPE(*FILE)',
        'WRKOBJLCK OBJ(IBMIHUB/ORDHDR) OBJTYPE(*FILE)',
      ],
      requiredParamName: 'OBJ',
      acceptedParamValues: ['CUSTPF', 'IBMIHUB/CUSTPF', 'IBMIHUB/ORDHDR'],
      blockedActionCommands: ['ENDJOB', 'RLSJOB', 'CHGJOB', 'SNDRPY'],
    },
    hints: [
      'WRKOBJLCK needs both OBJ and OBJTYPE, like OBJ(CUSTPF) OBJTYPE(*FILE).',
      'You can also check ORDHDR: OBJ(IBMIHUB/ORDHDR) OBJTYPE(*FILE).',
    ],
    successMessage:
      "This simulated screen shows ORDJOB holding a *SHRUPD (shared-for-update) lock on CUSTPF -- that's " +
      "why another job trying to update it has to wait. WRKOBJLCK only shows you who holds the lock; it " +
      "does not release it or change anything.",
    successScreen: {
      title: 'Work with Object Locks',
      lines: [
        'Object: CUSTPF     Library: IBMIHUB     Type: *FILE',
        '',
        'Job          User        Number   Lock Type',
        'ORDJOB       DEMOUSER    123456   *SHRUPD',
        'RPTJOB       DEMOUSER    123458   *SHRRD',
      ],
    },
  },
]
