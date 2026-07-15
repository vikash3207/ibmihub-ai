/**
 * Practice Questions MVP (Assessment/Practice Batch 1).
 *
 * Lightweight, content-driven practice questions for beginner IBM i
 * learners -- not a graded exam engine. No scores, rankings, badges, or
 * certificates are computed anywhere from this data; it exists purely so
 * a learner can check their own understanding and see which lessons to
 * revisit. Kept in its own content/practice/ directory, parallel to
 * content/lessons/, and read the same way (a plain TypeScript array, no
 * database table yet).
 */

export type PracticeQuestionType = 'multiple-choice' | 'scenario'
/** 'intermediate' added alongside the professional-depth practice topics
 *  (Advanced RPGLE/ILE, Integration, Advanced SQL, Security, Journaling,
 *  Save/Restore) -- existing 'beginner' questions and topics are unaffected. */
export type PracticeDifficulty = 'beginner' | 'intermediate'

export interface PracticeTopic {
  id: string
  label: string
  description: string
}

export interface PracticeQuestion {
  id: string
  topicId: string
  title: string
  question: string
  type: PracticeQuestionType
  /** Present for multiple-choice questions; omitted for open-ended scenario questions. */
  options?: string[]
  /** For multiple-choice, one of options verbatim. For scenario, a short model answer. */
  correctAnswer: string
  explanation: string
  relatedLessonSlugs: string[]
  tags: string[]
  difficulty: PracticeDifficulty
}

export const PRACTICE_TOPICS: PracticeTopic[] = [
  {
    id: 'ibm-i-fundamentals',
    label: 'IBM i Fundamentals',
    description: 'What IBM i is, how it fits together, and why organizations rely on it.',
  },
  {
    id: 'libraries-and-objects',
    label: 'Libraries and Objects',
    description: 'Libraries, object types, the library list, and object naming.',
  },
  {
    id: 'commands-5250',
    label: 'Commands / 5250 Basics',
    description: 'The 5250 interface, command structure, F4 prompting, and sign-on basics.',
  },
  {
    id: 'physical-logical-files',
    label: 'Physical Files and Logical Files',
    description: 'How Db2 for i stores and presents data through physical and logical files.',
  },
  {
    id: 'rpgle-foundations',
    label: 'RPGLE Foundations',
    description: 'Program structure, variables, control flow, and arrays in free-format RPGLE.',
  },
  {
    id: 'rpgle-file-io',
    label: 'RPGLE File I/O',
    description: 'CHAIN, %FOUND, WRITE, SETLL/READE, and common native file I/O mistakes.',
  },
  {
    id: 'clle-basics',
    label: 'CLLE Basics',
    description: 'When to use CLLE, MONMSG, SBMJOB, and calling programs from CLLE.',
  },
  {
    id: 'sqlrpgle-basics',
    label: 'SQLRPGLE Basics',
    description: 'SELECT INTO, SQLCODE, host variables, and WHERE conditions in embedded SQL.',
  },
  {
    id: 'display-files',
    label: 'Display Files / 5250 UI',
    description: 'EXFMT, response indicators, function keys, and input/output/both fields.',
  },
  {
    id: 'subfiles',
    label: 'Subfiles',
    description: 'Subfile vs subfile control record formats, RRN, SFLCLR, and load-all vs page-at-a-time.',
  },
  {
    id: 'printer-files',
    label: 'Printer Files / Reports',
    description: 'Spool files, output queues, WRKSPLF, and report heading/detail/total lines.',
  },
  {
    id: 'debugging',
    label: 'Debugging & Troubleshooting',
    description: 'STRDBG, breakpoints, job logs, message IDs, and compile vs runtime errors.',
  },
  {
    id: 'ibm-i-operations',
    label: 'IBM i Operations / Jobs / System Basics',
    description: 'Interactive vs batch jobs, job/output queues, MSGW, library lists, locks, and authority.',
  },
  {
    id: 'mini-projects',
    label: 'Real-World Mini Projects',
    description: "Questions drawn from the course's mini projects: which objects, patterns, and debugging steps apply.",
  },
  {
    id: 'interview-readiness',
    label: 'Interview & Job Readiness',
    description: 'Practice explaining IBM i concepts clearly, the way an interview or job discussion might ask.',
  },
  {
    id: 'mixed-review',
    label: 'Mixed Scenario Review',
    description: 'Cross-topic scenario questions that combine concepts from more than one area at once.',
  },
  {
    id: 'rpgle-ile',
    label: 'Advanced RPGLE / ILE',
    description: 'Modules, programs, service programs, binding, activation groups, and ILE debugging.',
  },
  {
    id: 'integration-modernization',
    label: 'Modern IBM i / APIs / Integration',
    description: 'REST APIs, JSON, HTTP methods and status codes, integration security, and debugging integrations.',
  },
  {
    id: 'advanced-sql',
    label: 'Advanced SQL for IBM i',
    description: 'DDL, constraints, stored procedures, triggers, UDFs, SQLCA/SQLCODE/SQLSTATE, and static vs dynamic SQL.',
  },
  {
    id: 'security',
    label: 'IBM i Security',
    description: 'Object authority, authorization lists, special and adopted authority, QSECURITY, QAUDJRN, and exit points.',
  },
  {
    id: 'journaling-commitment-control',
    label: 'Journaling & Commitment Control',
    description: 'Journals and journal receivers, STRJRNPF, DSPJRN, commitment control, and COMMIT/ROLLBACK.',
  },
  {
    id: 'save-restore',
    label: 'Save/Restore & Object Backup',
    description: 'SAVOBJ/RSTOBJ, SAVLIB/RSTLIB, save files, GO SAVE, safe restores, and backup vs journaling vs HA.',
  },
]

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // --- IBM i Fundamentals ---
  {
    id: 'fund-1',
    topicId: 'ibm-i-fundamentals',
    title: 'What IBM i actually is',
    question: 'Which statement best describes IBM i?',
    type: 'multiple-choice',
    options: [
      'A single database product that runs on top of Windows Server',
      'An integrated operating system and platform that runs on IBM Power Systems hardware, combining the OS, a database, and security into one system',
      'A programming language used only for writing RPG programs',
      'A cloud-only service with no on-premises version',
    ],
    correctAnswer:
      'An integrated operating system and platform that runs on IBM Power Systems hardware, combining the OS, a database, and security into one system',
    explanation:
      'IBM i is an integrated platform: the operating system, Db2 for i database, security, and job management all work together as one system running on IBM Power Systems hardware, rather than being separate products bolted together.',
    relatedLessonSlugs: ['what-is-ibm-i', 'ibm-i-platform-overview'],
    tags: ['ibm-i', 'platform'],
    difficulty: 'beginner',
  },
  {
    id: 'fund-2',
    topicId: 'ibm-i-fundamentals',
    title: 'AS/400, iSeries, and IBM i',
    question:
      'AS/400, iSeries, and IBM i are all names associated with the same platform lineage. What is the most accurate way to describe this?',
    type: 'multiple-choice',
    options: [
      'Three completely unrelated systems',
      'Different historical names IBM has used for the same evolving platform over time',
      'AS/400 is the hardware, iSeries is the software, and IBM i is the network layer',
      'IBM i replaced AS/400 entirely, so AS/400 systems no longer exist',
    ],
    correctAnswer: 'Different historical names IBM has used for the same evolving platform over time',
    explanation:
      "AS/400, iSeries, and IBM i are successive names IBM has used for the same platform lineage as it evolved. Many people still say \"AS/400\" out of habit even on a current IBM i system.",
    relatedLessonSlugs: ['as400-iseries-and-ibm-i-naming-explained'],
    tags: ['ibm-i', 'as400', 'naming'],
    difficulty: 'beginner',
  },
  {
    id: 'fund-3',
    topicId: 'ibm-i-fundamentals',
    title: "Correcting 'just a database'",
    question: "A coworker calls IBM i \"just an old database system.\" What is the most accurate correction?",
    type: 'scenario',
    correctAnswer:
      'IBM i is a full integrated platform (operating system, database, security, and job management together), not only a database -- Db2 for i is one part of it, not the whole system.',
    explanation:
      'Db2 for i is a major part of IBM i, but IBM i itself is a complete operating environment: it manages jobs, security, libraries and objects, and supports multiple programming languages, all integrated together.',
    relatedLessonSlugs: ['ibm-i-platform-overview', 'why-ibm-i-still-matters'],
    tags: ['ibm-i', 'platform'],
    difficulty: 'beginner',
  },
  {
    id: 'fund-4',
    topicId: 'ibm-i-fundamentals',
    title: 'Why IBM i sticks around',
    question: 'Why do many organizations continue to rely on IBM i for critical systems?',
    type: 'multiple-choice',
    options: [
      'Because switching platforms is technically impossible',
      'Because IBM i reliably runs critical business applications, and moving off it is a slow, deliberate decision given the risk involved',
      'Because IBM no longer offers any alternatives',
      'Because IBM i is always the cheapest platform available',
    ],
    correctAnswer:
      'Because IBM i reliably runs critical business applications, and moving off it is a slow, deliberate decision given the risk involved',
    explanation:
      'Many organizations run stable, critical applications on IBM i. Replacing a working, reliable system carries real risk and cost, so migration decisions are made carefully and slowly -- not because moving off is literally impossible.',
    relatedLessonSlugs: ['why-ibm-i-still-matters'],
    tags: ['ibm-i', 'platform'],
    difficulty: 'beginner',
  },
  {
    id: 'fund-5',
    topicId: 'ibm-i-fundamentals',
    title: 'The 5250 interface',
    question: 'Which best describes the 5250 interface?',
    type: 'multiple-choice',
    options: [
      'The only way to interact with IBM i',
      'A terminal-style interface for interacting with IBM i, still widely used alongside more modern interfaces',
      'A programming language for writing RPGLE programs',
      'A type of physical file',
    ],
    correctAnswer: 'A terminal-style interface for interacting with IBM i, still widely used alongside more modern interfaces',
    explanation:
      "The 5250 interface is the classic terminal-style screen many people picture when they think of IBM i. It's one way to interact with the platform, not the platform itself, and IBM i also supports more modern interfaces.",
    relatedLessonSlugs: ['5250-screen-basics', 'ibm-i-platform-overview'],
    tags: ['ibm-i', '5250'],
    difficulty: 'beginner',
  },
  {
    id: 'fund-6',
    topicId: 'ibm-i-fundamentals',
    title: 'IBM i security model',
    question:
      'A beginner assumes IBM i security works like installing antivirus software on top of the system. Why is this an inaccurate comparison?',
    type: 'scenario',
    correctAnswer:
      'On IBM i, security is built into the object model itself, controlling access at the level of individual objects, rather than being added on as a separate layer.',
    explanation:
      'IBM i security is object-based: access is controlled directly at the object level (files, programs, libraries) as a core part of the platform, not bolted on afterward the way antivirus software is added to a general-purpose OS.',
    relatedLessonSlugs: ['ibm-i-platform-overview'],
    tags: ['ibm-i', 'security'],
    difficulty: 'beginner',
  },

  // --- Libraries and Objects ---
  {
    id: 'lib-1',
    topicId: 'libraries-and-objects',
    title: 'What a library is',
    question: 'What is an IBM i library most similar to?',
    type: 'multiple-choice',
    options: [
      'A single file',
      'A folder or container that holds objects like programs and files',
      'A user profile',
      'A network connection',
    ],
    correctAnswer: 'A folder or container that holds objects like programs and files',
    explanation:
      'A library is an organizational container on IBM i that holds objects such as programs, files, and other object types -- conceptually closer to a folder than to a code library in other programming languages.',
    relatedLessonSlugs: ['libraries-and-objects', 'common-ibm-i-object-types'],
    tags: ['libraries', 'objects'],
    difficulty: 'beginner',
  },
  {
    id: 'lib-2',
    topicId: 'libraries-and-objects',
    title: 'What the library list does',
    question: 'What is the library list used for?',
    type: 'multiple-choice',
    options: [
      'Storing user passwords',
      "Telling the system which libraries to search, and in what order, when resolving an unqualified object name",
      'Listing every object type available on IBM i',
      'Encrypting library contents',
    ],
    correctAnswer: 'Telling the system which libraries to search, and in what order, when resolving an unqualified object name',
    explanation:
      "When a program or command references an object without specifying its library, IBM i searches the job's library list, in order, to resolve it. This is why library list order and contents matter so much in real applications.",
    relatedLessonSlugs: ['library-list-explained-in-depth'],
    tags: ['libraries', 'library-list'],
    difficulty: 'beginner',
  },
  {
    id: 'lib-3',
    topicId: 'libraries-and-objects',
    title: 'Object type for database records',
    question: 'Which object type is commonly used to store database records?',
    type: 'multiple-choice',
    options: ['*PGM', '*FILE (specifically a physical file)', '*LIB', '*DTAARA'],
    correctAnswer: '*FILE (specifically a physical file)',
    explanation:
      'A physical file (object type *FILE) is what actually stores database records on IBM i. *PGM is a compiled program, *LIB is a library, and *DTAARA is a small, single-value data area.',
    relatedLessonSlugs: ['common-ibm-i-object-types'],
    tags: ['objects', 'physical-files'],
    difficulty: 'beginner',
  },
  {
    id: 'lib-4',
    topicId: 'libraries-and-objects',
    title: 'Works for one user, not another',
    question: "A program runs fine for one user but fails with \"object not found\" for another. What's the first thing you'd check?",
    type: 'scenario',
    correctAnswer:
      "Compare the two users' library lists -- the object may live in a library that's missing from, or ordered differently in, the failing user's library list.",
    explanation:
      "A very common cause of \"works for one user, not another\" on IBM i is a difference in library lists, not a missing object. Comparing library lists directly is the fastest way to confirm this.",
    relatedLessonSlugs: ['library-list-explained-in-depth', 'library-list-problems-in-real-applications'],
    tags: ['libraries', 'library-list', 'troubleshooting'],
    difficulty: 'beginner',
  },
  {
    id: 'lib-5',
    topicId: 'libraries-and-objects',
    title: 'Qualified object names',
    question: 'What does a fully qualified object name look like on IBM i?',
    type: 'multiple-choice',
    options: ['FILENAME.LIBRARY', 'LIBRARY/OBJECTNAME', 'OBJECTNAME:LIBRARY', 'LIBRARY\\OBJECTNAME'],
    correctAnswer: 'LIBRARY/OBJECTNAME',
    explanation:
      'IBM i object names are qualified as LIBRARY/OBJECTNAME, naming exactly which library an object lives in rather than relying on the library list to find it.',
    relatedLessonSlugs: ['object-naming-and-qualified-names-in-practice'],
    tags: ['objects', 'naming'],
    difficulty: 'beginner',
  },
  {
    id: 'lib-6',
    topicId: 'libraries-and-objects',
    title: 'Looking inside a library',
    question: "Which command would you use to see what's inside a library?",
    type: 'multiple-choice',
    options: ['WRKOBJ or DSPLIB', 'CHKOBJ', 'SBMJOB', 'STRDBG'],
    correctAnswer: 'WRKOBJ or DSPLIB',
    explanation:
      'WRKOBJ (Work with Objects) and DSPLIB (Display Library) both let you see what objects exist inside a library. CHKOBJ only checks whether one specific object exists; SBMJOB submits a batch job; STRDBG starts a debug session.',
    relatedLessonSlugs: ['working-with-wrkobj-dspobjd-and-wrklib'],
    tags: ['commands', 'objects'],
    difficulty: 'beginner',
  },

  // --- Commands / 5250 Basics ---
  {
    id: 'cmd-1',
    topicId: 'commands-5250',
    title: 'F4 prompting',
    question: 'What does pressing F4 after typing a command name do?',
    type: 'multiple-choice',
    options: [
      'Runs the command immediately',
      "Opens a prompt screen showing the command's parameters and descriptions",
      'Cancels the command',
      'Opens the job log',
    ],
    correctAnswer: "Opens a prompt screen showing the command's parameters and descriptions",
    explanation:
      "F4 prompts a command, showing its parameters, short descriptions, and often default values, so you don't need to memorize exact command syntax.",
    relatedLessonSlugs: ['using-f4-prompt-and-command-help'],
    tags: ['commands', 'f4'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-2',
    topicId: 'commands-5250',
    title: 'The current library',
    question: "What is the \"current library\" for a job?",
    type: 'multiple-choice',
    options: [
      "The library where the job's message queue is stored",
      "A specific library placed at a defined position in the job's library list, commonly used as a default target for new objects",
      'The very first library on the system',
      'A temporary library that is deleted at sign-off',
    ],
    correctAnswer:
      "A specific library placed at a defined position in the job's library list, commonly used as a default target for new objects",
    explanation:
      "The current library is a designated library in a job's library list, often used as the default place new objects are created if no library is specified.",
    relatedLessonSlugs: ['signing-on-user-profiles-and-current-library'],
    tags: ['5250', 'current-library'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-3',
    topicId: 'commands-5250',
    title: 'How commands are structured',
    question: 'What is the general structure of an IBM i command?',
    type: 'multiple-choice',
    options: [
      'COMMAND(param1)(param2) with no keywords',
      "A command name followed by keyword parameters, e.g. CRTLIB LIB(MYLIB) TEXT('description')",
      'A single string with no parameters at all',
      'JSON-formatted parameters only',
    ],
    correctAnswer: "A command name followed by keyword parameters, e.g. CRTLIB LIB(MYLIB) TEXT('description')",
    explanation:
      'IBM i commands follow a consistent pattern: a command name (like CRTLIB) followed by keyword parameters in parentheses, such as LIB(MYLIB).',
    relatedLessonSlugs: ['ibm-i-command-structure'],
    tags: ['commands'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-4',
    topicId: 'commands-5250',
    title: 'Inspecting a job log',
    question: "You want to inspect a job's log to understand a recent failure. Which command would you reach for?",
    type: 'scenario',
    correctAnswer: 'DSPJOB (to view job details, including the job log), or WRKJOB, depending on exactly what you need to see.',
    explanation:
      "DSPJOB lets you view a job's details, including its job log, which is the natural first stop for investigating what happened during a job's run.",
    relatedLessonSlugs: ['understanding-job-logs', 'dspjob-and-job-information-basics'],
    tags: ['commands', 'job-logs'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-5',
    topicId: 'commands-5250',
    title: 'What happens at sign-on',
    question: 'What happens at sign-on on IBM i?',
    type: 'multiple-choice',
    options: [
      'Nothing meaningful -- it is purely cosmetic',
      "The system establishes a job for the user and applies their user profile settings, including their initial library list",
      'The system permanently locks the terminal',
      'A new library is automatically created',
    ],
    correctAnswer:
      "The system establishes a job for the user and applies their user profile settings, including their initial library list",
    explanation:
      'Signing on starts a job for that user, and the user profile determines settings for that job, including the initial library list and current library.',
    relatedLessonSlugs: ['signing-on-user-profiles-and-current-library'],
    tags: ['5250', 'user-profiles'],
    difficulty: 'beginner',
  },
  {
    id: 'cmd-6',
    topicId: 'commands-5250',
    title: 'Checking an object before relying on it',
    question: 'Which command would you use to check whether a specific object exists before running a program that depends on it?',
    type: 'multiple-choice',
    options: ['CHKOBJ', 'DLTF', 'CRTPF', 'STRSQL'],
    correctAnswer: 'CHKOBJ',
    explanation:
      'CHKOBJ checks whether a specific object exists (and optionally whether the right authority exists) -- commonly used in CLLE programs before proceeding with logic that depends on that object.',
    relatedLessonSlugs: ['checking-objects-with-chkobj'],
    tags: ['commands', 'clle'],
    difficulty: 'beginner',
  },

  // --- Physical Files and Logical Files ---
  {
    id: 'pf-1',
    topicId: 'physical-logical-files',
    title: 'Physical vs logical files',
    question: 'What is the difference between a physical file and a logical file?',
    type: 'multiple-choice',
    options: [
      'A physical file stores the actual data; a logical file provides a different view over that same data without duplicating it',
      'A logical file stores the actual data; a physical file is just a view',
      'They are two names for exactly the same thing',
      'A physical file can only hold one record',
    ],
    correctAnswer:
      'A physical file stores the actual data; a logical file provides a different view over that same data without duplicating it',
    explanation:
      'A physical file actually stores the data. A logical file provides a different view of that same data, like a different key order or a subset of fields, without duplicating the underlying data.',
    relatedLessonSlugs: ['physical-files-and-logical-files'],
    tags: ['dds', 'physical-files', 'logical-files'],
    difficulty: 'beginner',
  },
  {
    id: 'pf-2',
    topicId: 'physical-logical-files',
    title: 'What makes a file keyed',
    question: 'What makes a physical file "keyed"?',
    type: 'multiple-choice',
    options: [
      'It has been encrypted',
      'One or more fields are designated as a key, letting records be retrieved and ordered by that key rather than only by arrival order',
      'It contains only numeric fields',
      'It can only be read by RPGLE, not SQL',
    ],
    correctAnswer:
      'One or more fields are designated as a key, letting records be retrieved and ordered by that key rather than only by arrival order',
    explanation:
      'A keyed physical file designates one or more fields as a key, enabling operations like CHAIN and SETLL to retrieve records directly by that key value instead of only reading in arrival order.',
    relatedLessonSlugs: ['keyed-physical-files'],
    tags: ['physical-files', 'keys'],
    difficulty: 'beginner',
  },
  {
    id: 'pf-3',
    topicId: 'physical-logical-files',
    title: 'What an access path is',
    question: 'What is an access path?',
    type: 'multiple-choice',
    options: [
      'A duplicate copy of the data',
      'A structure IBM i maintains to support fast, ordered access to a keyed file, similar in spirit to an index',
      'A network route between two systems',
      'A type of user profile',
    ],
    correctAnswer: 'A structure IBM i maintains to support fast, ordered access to a keyed file, similar in spirit to an index',
    explanation:
      "An access path is what makes keyed access efficient -- it tracks key order and record locations so IBM i doesn't have to scan every record. Every keyed physical file and keyed logical file has its own access path.",
    relatedLessonSlugs: ['access-paths-and-why-they-matter'],
    tags: ['access-paths', 'physical-files'],
    difficulty: 'beginner',
  },
  {
    id: 'pf-4',
    topicId: 'physical-logical-files',
    title: 'Two views, one copy of data',
    question:
      'You need customers listed both by customer number and by name, without storing the data twice. What would you create?',
    type: 'scenario',
    correctAnswer:
      "A logical file keyed by name, over the existing physical file that's keyed by customer number -- this gives a name-ordered view without duplicating the actual data.",
    explanation:
      "This is exactly what logical files are for: presenting an alternate view (here, a different key order) over the same underlying physical file data, without storing a second copy.",
    relatedLessonSlugs: ['logical-files-explained-in-depth'],
    tags: ['logical-files', 'design'],
    difficulty: 'beginner',
  },
  {
    id: 'pf-5',
    topicId: 'physical-logical-files',
    title: 'Where field definitions live',
    question: "What defines a field's attributes (like length and data type) in a DDS-described physical file?",
    type: 'multiple-choice',
    options: [
      'The RPGLE program that reads it',
      'DDS field definitions specified when the file is created',
      'The library it lives in',
      "The job's library list",
    ],
    correctAnswer: 'DDS field definitions specified when the file is created',
    explanation:
      "A DDS-described physical file's fields, their lengths, and their data types are defined in the file's DDS source, independent of any one program that later reads it.",
    relatedLessonSlugs: ['dds-field-definitions'],
    tags: ['dds', 'physical-files'],
    difficulty: 'beginner',
  },
  {
    id: 'pf-6',
    topicId: 'physical-logical-files',
    title: 'The cost of logical files',
    question: 'Does adding many logical files over one heavily-updated physical file come at zero cost?',
    type: 'multiple-choice',
    options: [
      'Yes, logical files are always free',
      "No -- every additional access path IBM i maintains adds some overhead whenever the underlying physical file's data changes",
      'Only if the logical file has no key',
      'Only on weekends',
    ],
    correctAnswer:
      "No -- every additional access path IBM i maintains adds some overhead whenever the underlying physical file's data changes",
    explanation:
      'Each keyed logical file has its own access path that IBM i must keep updated as the underlying data changes, so having many logical files over a heavily-updated file is a real design tradeoff to be aware of.',
    relatedLessonSlugs: ['access-paths-and-why-they-matter'],
    tags: ['access-paths', 'design'],
    difficulty: 'beginner',
  },

  // --- RPGLE Foundations ---
  {
    id: 'rpg-1',
    topicId: 'rpgle-foundations',
    title: 'What *INLR = *ON does',
    question: 'What does `*INLR = *ON;` do in an RPGLE program?',
    type: 'multiple-choice',
    options: [
      'It pauses the program',
      'It tells the system the program is done, so resources like open files should be closed when the program ends',
      'It deletes the last record read',
      'It opens a new display file',
    ],
    correctAnswer: 'It tells the system the program is done, so resources like open files should be closed when the program ends',
    explanation:
      'Setting *INLR on signals that the program is finished; without it, the program can leave resources open in a way that causes problems the next time it is called.',
    relatedLessonSlugs: ['rpgle-program-structure'],
    tags: ['rpgle'],
    difficulty: 'beginner',
  },
  {
    id: 'rpg-2',
    topicId: 'rpgle-foundations',
    title: 'Reading a packed field declaration',
    question: 'What does `dcl-s custBal packed(9:2);` declare?',
    type: 'multiple-choice',
    options: [
      'A character field 9 characters long',
      'A packed numeric field with 9 total digits, 2 of them after the decimal point',
      'An array of 9 elements',
      'A data structure',
    ],
    correctAnswer: 'A packed numeric field with 9 total digits, 2 of them after the decimal point',
    explanation:
      'packed(9:2) declares a packed decimal field with 9 total digits, 2 of which are decimal places -- a common way to store currency-like values in RPGLE.',
    relatedLessonSlugs: ['variables-and-data-types-in-rpgle'],
    tags: ['rpgle', 'variables'],
    difficulty: 'beginner',
  },
  {
    id: 'rpg-3',
    topicId: 'rpgle-foundations',
    title: 'SELECT/WHEN vs IF/ELSEIF',
    question: 'When would SELECT/WHEN read more clearly than a chain of IF/ELSEIF statements?',
    type: 'multiple-choice',
    options: [
      'Never -- they are identical in every way',
      'When checking the same variable against several possible values',
      'Only inside a display file',
      'Only when using SQL',
    ],
    correctAnswer: 'When checking the same variable against several possible values',
    explanation:
      'SELECT/WHEN is a clearer way to express checking one variable against several possible values, compared to a long chain of ELSEIFs all testing the same thing.',
    relatedLessonSlugs: ['select-when-other-in-rpgle'],
    tags: ['rpgle', 'control-flow'],
    difficulty: 'beginner',
  },
  {
    id: 'rpg-4',
    topicId: 'rpgle-foundations',
    title: 'Reading an array declaration',
    question: 'In `dcl-s regionNames char(20) dim(4);`, what does `dim(4)` mean?',
    type: 'multiple-choice',
    options: [
      'The field is 4 characters long',
      'The array holds 4 elements',
      'The field has 4 decimal places',
      'The array starts at index 4',
    ],
    correctAnswer: 'The array holds 4 elements',
    explanation:
      'dim(n) declares an array with n elements. RPGLE array indexes start at 1, so this array\'s elements are regionNames(1) through regionNames(4).',
    relatedLessonSlugs: ['arrays-in-rpgle'],
    tags: ['rpgle', 'arrays'],
    difficulty: 'beginner',
  },
  {
    id: 'rpg-5',
    topicId: 'rpgle-foundations',
    title: 'A DOW loop that never stops',
    question: "A DOW loop that's supposed to stop at end-of-file never stops. What's the most likely cause?",
    type: 'scenario',
    correctAnswer:
      "The variable the loop condition checks (commonly an %EOF check) is never actually being updated inside the loop body, so the condition never becomes true.",
    explanation:
      'An infinite DOW loop is almost always caused by the loop\'s exit condition never changing inside the loop -- for example, forgetting to re-read the file on each pass so %EOF never becomes true.',
    relatedLessonSlugs: ['do-loops-and-basic-iteration-in-rpgle'],
    tags: ['rpgle', 'loops'],
    difficulty: 'beginner',
  },
  {
    id: 'rpg-6',
    topicId: 'rpgle-foundations',
    title: 'What a built-in function is for',
    question: 'What is the main purpose of a built-in function (BIF) in RPGLE, like %TRIM or %FOUND?',
    type: 'multiple-choice',
    options: [
      'To define a new object type',
      'To perform a common, ready-made operation (like trimming spaces or checking whether a CHAIN found a record) without writing that logic by hand',
      'To declare a new variable',
      'To create a new library',
    ],
    correctAnswer:
      'To perform a common, ready-made operation (like trimming spaces or checking whether a CHAIN found a record) without writing that logic by hand',
    explanation:
      "Built-in functions provide common, ready-made operations -- %TRIM removes leading/trailing spaces, %FOUND reports whether the last file operation found a record -- without you writing that logic yourself.",
    relatedLessonSlugs: ['built-in-functions-in-rpgle'],
    tags: ['rpgle', 'built-in-functions'],
    difficulty: 'beginner',
  },

  // --- RPGLE File I/O ---
  {
    id: 'fio-1',
    topicId: 'rpgle-file-io',
    title: 'What CHAIN does',
    question: 'What does CHAIN usually do in RPGLE?',
    type: 'multiple-choice',
    options: [
      'Reads every record in a file from the start',
      'Retrieves one specific record from a keyed file by its key value',
      'Deletes a record',
      'Opens a display file',
    ],
    correctAnswer: 'Retrieves one specific record from a keyed file by its key value',
    explanation:
      'CHAIN retrieves a single, specific record from a keyed file using a key value you provide, and %FOUND tells you afterward whether a matching record actually existed.',
    relatedLessonSlugs: ['chain-for-keyed-access'],
    tags: ['rpgle', 'file-io', 'chain'],
    difficulty: 'beginner',
  },
  {
    id: 'fio-2',
    topicId: 'rpgle-file-io',
    title: 'Spot the missing check',
    question:
      'What is wrong with this snippet?\n```\nchain custNbr CUSTMAST;\nCUSTBAL -= paymentAmt;\nupdate CUSTMAST;\n```',
    type: 'scenario',
    correctAnswer:
      "It never checks %FOUND(CUSTMAST) before updating -- if custNbr doesn't exist, UPDATE has no current record to act on and fails at runtime.",
    explanation:
      'Any UPDATE (or DELETE) right after a CHAIN must be guarded by an %FOUND check. Skipping it is one of the most common RPGLE file I/O mistakes, because it works fine until someone enters a key that doesn\'t exist.',
    relatedLessonSlugs: ['understanding-found-after-chain', 'common-rpgle-file-io-mistakes-and-best-practices'],
    tags: ['rpgle', 'file-io', 'chain', 'found'],
    difficulty: 'beginner',
  },
  {
    id: 'fio-3',
    topicId: 'rpgle-file-io',
    title: 'What a file needs for CHAIN',
    question: 'What must a file be declared as for CHAIN and SETLL to work on it?',
    type: 'multiple-choice',
    options: ['disk', 'keyed', 'printer', 'workstn'],
    correctAnswer: 'keyed',
    explanation:
      'A file must be declared keyed (in addition to disk) for CHAIN, SETLL, and READE to work -- these operations retrieve or position by key, which requires a keyed file.',
    relatedLessonSlugs: ['rpgle-file-declarations-with-dcl-f', 'chain-for-keyed-access'],
    tags: ['rpgle', 'file-io'],
    difficulty: 'beginner',
  },
  {
    id: 'fio-4',
    topicId: 'rpgle-file-io',
    title: 'CHAIN vs SETLL plus READE',
    question: 'What is the difference between CHAIN and SETLL followed by READE?',
    type: 'multiple-choice',
    options: [
      'They are exactly the same',
      'CHAIN retrieves one specific record directly; SETLL positions you at a key without retrieving a record, typically followed by READE to step through every record sharing that key',
      'SETLL deletes records; CHAIN only reads',
      'CHAIN only works with SQL, not native RPGLE',
    ],
    correctAnswer:
      'CHAIN retrieves one specific record directly; SETLL positions you at a key without retrieving a record, typically followed by READE to step through every record sharing that key',
    explanation:
      'CHAIN is for a single exact-match lookup. SETLL plus READE is for stepping through every record sharing a key value -- useful for files with legitimate duplicate keys, like an order-history file keyed by customer number.',
    relatedLessonSlugs: ['setll-in-rpgle', 'reade-for-reading-matching-keys'],
    tags: ['rpgle', 'file-io'],
    difficulty: 'beginner',
  },
  {
    id: 'fio-5',
    topicId: 'rpgle-file-io',
    title: 'Using CHAIN for multiple orders',
    question: "If you use CHAIN to try to process every order for a customer who has several orders on file, what happens?",
    type: 'scenario',
    correctAnswer:
      'CHAIN only ever retrieves the first matching record for a given key -- it does not continue to the next matching record, so you would silently miss every order after the first.',
    explanation:
      'This is a common misunderstanding: CHAIN always returns the same first match for a key. Processing every record sharing a key value requires SETLL plus a READE loop instead.',
    relatedLessonSlugs: ['reade-for-reading-matching-keys', 'processing-duplicate-keys-in-rpgle'],
    tags: ['rpgle', 'file-io', 'duplicate-keys'],
    difficulty: 'beginner',
  },
  {
    id: 'fio-6',
    topicId: 'rpgle-file-io',
    title: 'WRITE and duplicate keys',
    question: 'What is required before calling WRITE to add a new record to a keyed file?',
    type: 'multiple-choice',
    options: [
      'Nothing -- WRITE always works regardless of the key',
      'The key value being written must not already exist in the file, or a duplicate-key error occurs',
      'You must first CHAIN to the record',
      'The file must be declared as a printer file',
    ],
    correctAnswer: 'The key value being written must not already exist in the file, or a duplicate-key error occurs',
    explanation:
      "WRITE adds a new record. If the file enforces unique keys and the key you're writing already exists, you'll get a duplicate-key error -- this is different from UPDATE, which requires the record to already exist via a prior CHAIN.",
    relatedLessonSlugs: ['writing-records-with-write'],
    tags: ['rpgle', 'file-io', 'write'],
    difficulty: 'beginner',
  },

  // --- CLLE Basics ---
  {
    id: 'clle-1',
    topicId: 'clle-basics',
    title: 'When to write CLLE',
    question: 'When would you typically write a CLLE program instead of an RPGLE program?',
    type: 'multiple-choice',
    options: [
      'For heavy business logic and calculations',
      'For orchestration: checking things exist, setting up overrides, calling other programs, and submitting batch jobs',
      'For building a 5250 screen with complex validation',
      'For embedded SQL queries',
    ],
    correctAnswer: 'For orchestration: checking things exist, setting up overrides, calling other programs, and submitting batch jobs',
    explanation:
      'CLLE is best suited to orchestration tasks -- checking objects, applying overrides, calling programs, and submitting batch jobs -- rather than heavy business logic, which is better suited to RPGLE or SQLRPGLE.',
    relatedLessonSlugs: ['when-to-use-clle-vs-rpgle'],
    tags: ['clle'],
    difficulty: 'beginner',
  },
  {
    id: 'clle-2',
    topicId: 'clle-basics',
    title: 'What MONMSG does',
    question: 'What does MONMSG do in a CLLE program?',
    type: 'multiple-choice',
    options: [
      'It permanently prevents an error from occurring',
      'It monitors for a specific message ID and lets you decide what to do if it occurs, rather than letting the program fail',
      'It sends an email',
      'It deletes a message queue',
    ],
    correctAnswer: 'It monitors for a specific message ID and lets you decide what to do if it occurs, rather than letting the program fail',
    explanation:
      "MONMSG catches a specific message ID (like an error) and lets the program respond deliberately, rather than fixing the underlying problem by itself -- it's error handling, not a cure.",
    relatedLessonSlugs: ['monmsg-and-basic-error-handling-in-clle'],
    tags: ['clle', 'monmsg'],
    difficulty: 'beginner',
  },
  {
    id: 'clle-3',
    topicId: 'clle-basics',
    title: 'A wrapper that only checks one file',
    question:
      'A CLLE wrapper checks that a file exists with CHKOBJ, then submits a report program with SBMJOB. The wrapper reports success every night, but the report is sometimes missing. What would you check?',
    type: 'scenario',
    correctAnswer:
      'Whether the CHKOBJ check actually covers every file the report program depends on -- a check on only one file can pass even though the report later fails on a different, unchecked file.',
    explanation:
      'A CHKOBJ check is only as complete as the objects it actually names. If the report reads two files but the wrapper only checks one, the wrapper can report success even though the report program later fails on the file it never checked.',
    relatedLessonSlugs: ['checking-objects-with-chkobj', 'using-clle-for-batch-job-orchestration'],
    tags: ['clle', 'troubleshooting'],
    difficulty: 'beginner',
  },
  {
    id: 'clle-4',
    topicId: 'clle-basics',
    title: 'CALL vs SBMJOB',
    question: 'What is the difference between calling a program directly and submitting it with SBMJOB?',
    type: 'multiple-choice',
    options: [
      'There is no difference',
      'SBMJOB submits the program as an independent batch job, so the calling program does not wait for it to finish',
      'SBMJOB only works with RPGLE, not CLLE',
      'Calling a program directly always runs it overnight',
    ],
    correctAnswer: 'SBMJOB submits the program as an independent batch job, so the calling program does not wait for it to finish',
    explanation:
      "SBMJOB runs the target program as its own independent batch job. The calling program continues (or ends) without waiting for that submitted job to complete.",
    relatedLessonSlugs: ['sbmjob-and-batch-job-basics'],
    tags: ['clle', 'sbmjob'],
    difficulty: 'beginner',
  },
  {
    id: 'clle-5',
    topicId: 'clle-basics',
    title: 'Why OVRPRTF order matters',
    question: 'Why must OVRPRTF come before SBMJOB in a wrapper that submits a report program?',
    type: 'multiple-choice',
    options: [
      "It doesn't matter what order they're in",
      "The submitted job needs the override already in place to actually pick it up -- an override applied after submission won't affect the already-submitted job",
      'OVRPRTF must always be the very last line in a program',
      'SBMJOB automatically applies overrides on its own',
    ],
    correctAnswer:
      "The submitted job needs the override already in place to actually pick it up -- an override applied after submission won't affect the already-submitted job",
    explanation:
      "OVRPRTF has to be in effect before SBMJOB submits the job, so the submitted job actually picks up that override. Applying it afterward has no effect on a job that's already been submitted.",
    relatedLessonSlugs: ['printer-file-overrides-basics', 'clle-wrapper-to-run-a-report'],
    tags: ['clle', 'printer-files'],
    difficulty: 'beginner',
  },
  {
    id: 'clle-6',
    topicId: 'clle-basics',
    title: 'Calling a program from CLLE',
    question: 'How does a CLLE program typically call an RPGLE program?',
    type: 'multiple-choice',
    options: ['Using CALL PGM(programname)', 'Using CHKOBJ', 'Using CRTLIB', 'Using DLTF'],
    correctAnswer: 'Using CALL PGM(programname)',
    explanation:
      'CALL PGM(programname) is how a CLLE program invokes another program, such as an RPGLE program, optionally passing parameters to it.',
    relatedLessonSlugs: ['calling-rpgle-programs-from-clle'],
    tags: ['clle'],
    difficulty: 'beginner',
  },

  // --- SQLRPGLE Basics ---
  {
    id: 'sql-1',
    topicId: 'sqlrpgle-basics',
    title: 'The SQL equivalent of CHAIN',
    question: 'What is the SQLRPGLE equivalent of a native CHAIN for a single-record lookup?',
    type: 'multiple-choice',
    options: ['A cursor with FETCH', 'SELECT INTO', 'JOIN', 'DECLARE CURSOR without OPEN'],
    correctAnswer: 'SELECT INTO',
    explanation:
      'SELECT INTO retrieves one row into host variables, the direct embedded-SQL equivalent of a native CHAIN -- instead of checking %FOUND, you check SQLCODE afterward.',
    relatedLessonSlugs: ['select-into-for-reading-one-row'],
    tags: ['sqlrpgle', 'sql'],
    difficulty: 'beginner',
  },
  {
    id: 'sql-2',
    topicId: 'sqlrpgle-basics',
    title: 'What SQLCODE 100 means',
    question: 'What does SQLCODE = 100 usually mean after a SELECT INTO?',
    type: 'multiple-choice',
    options: [
      'A serious database error occurred',
      'No row matched the query -- this is an expected outcome, not necessarily an error',
      'The row was found and updated successfully',
      'The connection to the database was lost',
    ],
    correctAnswer: 'No row matched the query -- this is an expected outcome, not necessarily an error',
    explanation:
      'SQLCODE 100 specifically means no row was found -- often a perfectly normal, expected outcome (like a lookup for a nonexistent customer), distinct from a genuine database error.',
    relatedLessonSlugs: ['sqlcode-and-sqlstate-basics-in-sqlrpgle', 'handling-no-row-found-in-sqlrpgle'],
    tags: ['sqlrpgle', 'sqlcode'],
    difficulty: 'beginner',
  },
  {
    id: 'sql-3',
    topicId: 'sqlrpgle-basics',
    title: 'Why the colon is needed',
    question: 'Why does this line need a colon in front of the variable?\n```\nwhere CUSTNBR = :hCustNbr\n```',
    type: 'scenario',
    correctAnswer:
      'The colon marks hCustNbr as a host variable -- a regular RPGLE variable being passed into the embedded SQL statement -- distinguishing it from a column name.',
    explanation:
      'Inside EXEC SQL, a colon prefix tells the SQL precompiler that what follows is a host variable (an RPGLE variable), not a column name. Leaving it off would cause a compile error or be misread as a column reference.',
    relatedLessonSlugs: ['host-variables-in-sqlrpgle'],
    tags: ['sqlrpgle', 'host-variables'],
    difficulty: 'beginner',
  },
  {
    id: 'sql-4',
    topicId: 'sqlrpgle-basics',
    title: 'A partial-name search',
    question: "You need customers whose name contains \"Smith\" anywhere in it. Which WHERE clause is correct?",
    type: 'multiple-choice',
    options: [
      "WHERE CUSTNAME = 'Smith'",
      "WHERE CUSTNAME LIKE '%Smith%'",
      "WHERE CUSTNAME LIKE 'Smith'",
      "WHERE CUSTNAME CONTAINS 'Smith'",
    ],
    correctAnswer: "WHERE CUSTNAME LIKE '%Smith%'",
    explanation:
      "LIKE with % wildcards on both sides matches \"Smith\" occurring anywhere in the name. Leaving out the wildcards turns the search into an exact match instead of a genuine partial search.",
    relatedLessonSlugs: ['basic-where-conditions-in-embedded-sql'],
    tags: ['sqlrpgle', 'sql', 'where'],
    difficulty: 'beginner',
  },
  {
    id: 'sql-5',
    topicId: 'sqlrpgle-basics',
    title: 'Native file I/O vs embedded SQL',
    question: 'When would you reach for embedded SQL instead of native CHAIN?',
    type: 'scenario',
    correctAnswer:
      'When the task is naturally set-based, such as a partial-name search with LIKE or joining data across files -- native file I/O would require reading every record and checking manually.',
    explanation:
      'Native file I/O is simple and direct for an exact, single-record lookup by key. Embedded SQL is often clearer for filtering or combining data across many rows, which native operations alone would handle awkwardly.',
    relatedLessonSlugs: ['native-rpgle-file-io-vs-embedded-sql'],
    tags: ['sqlrpgle', 'file-io'],
    difficulty: 'beginner',
  },
  {
    id: 'sql-6',
    topicId: 'sqlrpgle-basics',
    title: 'Blank fields after a successful query',
    question:
      'A SELECT INTO runs with no error, but the screen shows blank fields for a customer you know exists. What would you check first?',
    type: 'scenario',
    correctAnswer:
      "Confirm SQLCODE actually came back 0 right after the SELECT INTO, then confirm the retrieved host variable values were actually copied into the display file's own output fields before the next EXFMT.",
    explanation:
      'A successful query and a correctly-displayed screen are two separate things. Checking SQLCODE confirms the lookup itself worked; separately confirming the copy-back step catches the other common cause of this symptom.',
    relatedLessonSlugs: ['select-into-for-reading-one-row', 'sqlrpgle-customer-lookup'],
    tags: ['sqlrpgle', 'debugging'],
    difficulty: 'beginner',
  },

  // --- Display Files / 5250 UI ---
  {
    id: 'disp-1',
    topicId: 'display-files',
    title: 'What EXFMT does',
    question: 'What does EXFMT do when called with a display file record format?',
    type: 'multiple-choice',
    options: [
      'It only writes the format to the screen without reading a response',
      "It writes the record format to the screen and reads back the user's response, in one combined operation",
      'It permanently deletes the record format',
      'It compiles the display file',
    ],
    correctAnswer: "It writes the record format to the screen and reads back the user's response, in one combined operation",
    explanation:
      "EXFMT combines showing a record format and reading the user's response into a single operation -- the most common way an RPGLE program interacts with a display file.",
    relatedLessonSlugs: ['what-is-a-display-file-in-ibm-i', 'rpgle-program-calling-a-display-file', 'read-write-exfmt-and-screen-flow'],
    tags: ['display-files', 'exfmt'],
    difficulty: 'beginner',
  },
  {
    id: 'disp-2',
    topicId: 'display-files',
    title: 'What a response indicator is for',
    question: 'What is a response indicator used for in a display file?',
    type: 'multiple-choice',
    options: [
      'Encrypting the screen',
      'Recording which function key the user pressed so the RPGLE program can respond accordingly',
      'Declaring a new physical file',
      "Storing the customer's balance",
    ],
    correctAnswer: 'Recording which function key the user pressed so the RPGLE program can respond accordingly',
    explanation:
      'A response indicator is tied to a function key (like F3) in the DDS. After EXFMT returns, the program checks that indicator to find out which key the user pressed.',
    relatedLessonSlugs: ['function-keys-and-response-indicators-in-display-files'],
    tags: ['display-files', 'function-keys', 'indicators'],
    difficulty: 'beginner',
  },
  {
    id: 'disp-3',
    topicId: 'display-files',
    title: 'Input, output, and both fields',
    question: 'What is the difference between an input field, an output field, and a both field on a display file?',
    type: 'multiple-choice',
    options: [
      'There is no real difference',
      'An input field only receives typed data, an output field only shows data, and a both field can both show and receive data',
      'Output fields are always numeric',
      'Both fields can only be used in subfiles',
    ],
    correctAnswer: 'An input field only receives typed data, an output field only shows data, and a both field can both show and receive data',
    explanation:
      'Input fields let the user type a value in, output fields only display a value the program sets, and both fields do both -- showing a value and letting the user change it.',
    relatedLessonSlugs: ['input-output-and-both-fields-in-display-files'],
    tags: ['display-files', 'fields'],
    difficulty: 'beginner',
  },
  {
    id: 'disp-4',
    topicId: 'display-files',
    title: 'Reading an indicator check',
    question: 'After EXFMT returns, a program checks *in03. What does that check accomplish?',
    type: 'scenario',
    correctAnswer:
      'It checks whether the user pressed F3 (or whichever key *in03 is tied to), so the program can decide whether to exit or continue.',
    explanation:
      'Indicators like *in03 are the RPGLE side of a DDS-defined function key. Checking it after EXFMT is how the program finds out which key, if any, the user pressed.',
    relatedLessonSlugs: ['function-keys-and-response-indicators-in-display-files', 'rpgle-program-calling-a-display-file'],
    tags: ['display-files', 'indicators'],
    difficulty: 'beginner',
  },
  {
    id: 'disp-5',
    topicId: 'display-files',
    title: 'Conditioning indicators',
    question: 'What is a conditioning indicator used for on a display file field?',
    type: 'multiple-choice',
    options: [
      'To control whether that field is shown or hidden depending on a program condition',
      'To permanently delete a field',
      'To sort subfile rows',
      'To connect to Db2 for i',
    ],
    correctAnswer: 'To control whether that field is shown or hidden depending on a program condition',
    explanation:
      "A conditioning indicator lets the same record format show or hide a field (like an error message) depending on whether the RPGLE program turns that indicator on or off.",
    relatedLessonSlugs: ['display-file-indicators-explained'],
    tags: ['display-files', 'indicators'],
    difficulty: 'beginner',
  },
  {
    id: 'disp-6',
    topicId: 'display-files',
    title: 'A function key that does nothing',
    question: 'A screen program calls EXFMT in a loop, but pressing a function key seems to do nothing. What would you check first?',
    type: 'scenario',
    correctAnswer:
      'Confirm the function key actually has a response indicator wired up to it in the DDS, and that the RPGLE program is checking the correct indicator number after EXFMT.',
    explanation:
      "If a function key \"does nothing,\" the most common cause is a mismatch or missing wiring between the DDS-defined indicator and the indicator the RPGLE program actually checks.",
    relatedLessonSlugs: ['function-keys-and-response-indicators-in-display-files', 'read-write-exfmt-and-screen-flow'],
    tags: ['display-files', 'troubleshooting'],
    difficulty: 'beginner',
  },

  // --- Subfiles ---
  {
    id: 'sfl-1',
    topicId: 'subfiles',
    title: 'Subfile record vs control record format',
    question: 'What is the difference between a subfile record format and a subfile control record format?',
    type: 'multiple-choice',
    options: [
      'They are exactly the same',
      "The subfile record format defines one row's layout; the subfile control record format manages the subfile as a whole, like clearing and displaying it",
      'The control record format holds the actual data rows',
      'Only the subfile record format can have function keys',
    ],
    correctAnswer:
      "The subfile record format defines one row's layout; the subfile control record format manages the subfile as a whole, like clearing and displaying it",
    explanation:
      'A subfile record format (SFL) defines what one row looks like. A subfile control record format (SFLCTL) is paired with it and manages subfile-wide behavior such as clearing, sizing, and displaying it.',
    relatedLessonSlugs: ['what-is-a-subfile-in-ibm-i', 'subfile-record-format-vs-subfile-control-record-format'],
    tags: ['subfiles'],
    difficulty: 'beginner',
  },
  {
    id: 'sfl-2',
    topicId: 'subfiles',
    title: 'What RRN identifies',
    question: 'What does RRN identify in a subfile program?',
    type: 'multiple-choice',
    options: [
      "A customer's business key, like a customer number",
      'The relative position of a record within the subfile -- unrelated to any business meaning',
      "The record's field length",
      'The library the subfile lives in',
    ],
    correctAnswer: 'The relative position of a record within the subfile -- unrelated to any business meaning',
    explanation:
      "RRN (Relative Record Number) identifies a record's position within the subfile itself, such as first-written or second-written -- it's not a business key like a customer or order number.",
    relatedLessonSlugs: ['understanding-rrn-in-subfile-programs'],
    tags: ['subfiles', 'rrn'],
    difficulty: 'beginner',
  },
  {
    id: 'sfl-3',
    topicId: 'subfiles',
    title: 'What SFLCLR does',
    question: 'What does the SFLCLR indicator do when turned on?',
    type: 'multiple-choice',
    options: [
      'It clears the subfile so it can be reloaded with new rows',
      "It permanently deletes the subfile's DDS",
      'It displays the subfile on screen',
      'It sorts the subfile by key',
    ],
    correctAnswer: 'It clears the subfile so it can be reloaded with new rows',
    explanation:
      "Turning on the indicator tied to SFLCLR clears out the subfile's existing rows, a required step before loading a fresh set of rows -- forgetting it is one of the most common subfile bugs.",
    relatedLessonSlugs: ['sfldsp-sfldspctl-and-sflclr-explained', 'clearing-and-reloading-a-subfile'],
    tags: ['subfiles', 'sflclr'],
    difficulty: 'beginner',
  },
  {
    id: 'sfl-4',
    topicId: 'subfiles',
    title: 'Stale rows after a new search',
    question: 'A subfile shows the same rows from a previous search after a user runs a new search. What is the most likely cause?',
    type: 'scenario',
    correctAnswer:
      "The subfile was never cleared (SFLCLR) before being reloaded with the new search's rows, so old rows are still present alongside or instead of the new ones.",
    explanation:
      'This is a very common subfile bug: forgetting the clear-then-load pattern. The subfile must be cleared before writing the new set of rows for a fresh search.',
    relatedLessonSlugs: ['clearing-and-reloading-a-subfile', 'sfldsp-sfldspctl-and-sflclr-explained'],
    tags: ['subfiles', 'troubleshooting'],
    difficulty: 'beginner',
  },
  {
    id: 'sfl-5',
    topicId: 'subfiles',
    title: 'Load-all vs page-at-a-time',
    question: 'What is the main difference between a load-all subfile and a page-at-a-time subfile?',
    type: 'multiple-choice',
    options: [
      'There is no real difference',
      'A load-all subfile loads every matching row up front; a page-at-a-time subfile loads only enough rows to fill the visible page, loading more as the user scrolls',
      'Page-at-a-time subfiles cannot have function keys',
      'Load-all subfiles are always faster regardless of data size',
    ],
    correctAnswer:
      'A load-all subfile loads every matching row up front; a page-at-a-time subfile loads only enough rows to fill the visible page, loading more as the user scrolls',
    explanation:
      'Load-all is simpler to code but loads everything immediately, which can be wasteful for very large result sets. Page-at-a-time loads incrementally, which scales better for large amounts of data but requires more careful RRN handling.',
    relatedLessonSlugs: ['load-all-subfile-concept', 'page-at-a-time-subfile-concept'],
    tags: ['subfiles', 'design'],
    difficulty: 'beginner',
  },
  {
    id: 'sfl-6',
    topicId: 'subfiles',
    title: 'Reading only changed rows',
    question: 'Which native RPGLE operation reads only the subfile rows a user actually changed?',
    type: 'multiple-choice',
    options: ['READ', 'READC', 'CHAIN', 'SETLL'],
    correctAnswer: 'READC',
    explanation:
      'READC reads only the subfile rows the user actually changed (like typing an option), rather than every row in the subfile, which READ would do.',
    relatedLessonSlugs: ['understanding-rrn-in-subfile-programs'],
    tags: ['subfiles', 'readc'],
    difficulty: 'beginner',
  },

  // --- Printer Files / Reports ---
  {
    id: 'prt-1',
    topicId: 'printer-files',
    title: 'Printer file vs spool file',
    question: 'What is the difference between a printer file and a spool file?',
    type: 'multiple-choice',
    options: [
      'They are the same thing',
      'A printer file is the object an RPGLE program writes to; a spool file is the actual output produced by one run, waiting on an output queue',
      'A spool file is a type of physical file',
      'A printer file only exists after printing finishes',
    ],
    correctAnswer:
      'A printer file is the object an RPGLE program writes to; a spool file is the actual output produced by one run, waiting on an output queue',
    explanation:
      "The printer file (*FILE, type printer) is the object a program writes report output to. Each run produces a spool file, the actual queued output, sitting on an output queue until it's printed or viewed.",
    relatedLessonSlugs: ['what-is-a-printer-file-in-ibm-i', 'printer-file-vs-display-file-vs-database-file'],
    tags: ['printer-files', 'spool-files'],
    difficulty: 'beginner',
  },
  {
    id: 'prt-2',
    topicId: 'printer-files',
    title: 'What an output queue is',
    question: 'What is an output queue?',
    type: 'multiple-choice',
    options: [
      'A list of programs waiting to compile',
      'A holding area where spool files wait until they are printed, viewed, or otherwise processed',
      'A type of logical file',
      'A library containing only printer files',
    ],
    correctAnswer: 'A holding area where spool files wait until they are printed, viewed, or otherwise processed',
    explanation:
      "An output queue holds spool files after they're created, until they are actually printed or otherwise handled -- similar in spirit to a print queue on other systems.",
    relatedLessonSlugs: ['spool-files-and-output-queues'],
    tags: ['printer-files', 'output-queues'],
    difficulty: 'beginner',
  },
  {
    id: 'prt-3',
    topicId: 'printer-files',
    title: 'What WRKSPLF lets you do',
    question: 'What does WRKSPLF let you do?',
    type: 'multiple-choice',
    options: [
      'Compile a printer file',
      'See and work with your own spool files, such as checking their status or viewing their content',
      'Delete a library',
      'Submit a batch job',
    ],
    correctAnswer: 'See and work with your own spool files, such as checking their status or viewing their content',
    explanation:
      'WRKSPLF (Work with Spooled Files) lets you see your own spool files and take actions on them, such as viewing, holding, or releasing them.',
    relatedLessonSlugs: ['working-with-spool-files-using-wrksplf'],
    tags: ['printer-files', 'commands'],
    difficulty: 'beginner',
  },
  {
    id: 'prt-4',
    topicId: 'printer-files',
    title: 'Heading vs detail record formats',
    question: 'In a typical IBM i report, what is the purpose of a heading record format versus a detail record format?',
    type: 'multiple-choice',
    options: [
      "There is no difference; they're interchangeable",
      'The heading format is printed once (or once per page) for column titles; the detail format is printed once per data row',
      'The detail format only prints on the last page',
      'The heading format holds the actual business data',
    ],
    correctAnswer:
      'The heading format is printed once (or once per page) for column titles; the detail format is printed once per data row',
    explanation:
      'A heading record format typically prints column titles once at the top (or repeated each page); a detail record format prints once for every row of actual data in the report.',
    relatedLessonSlugs: ['report-headings-and-detail-lines'],
    tags: ['printer-files', 'reports'],
    difficulty: 'beginner',
  },
  {
    id: 'prt-5',
    topicId: 'printer-files',
    title: 'Why the grand total prints once, at the end',
    question: "Why does a report commonly write its grand total record format only once, after the main read loop ends?",
    type: 'scenario',
    correctAnswer:
      'Because the grand total needs to reflect the fully accumulated value across every detail row, which is only known once the loop has finished processing all of them.',
    explanation:
      "A grand total accumulator only holds its final, correct value after every detail row has been processed, so the total format is written once, after the loop, not on every pass.",
    relatedLessonSlugs: ['report-totals-and-summary-lines'],
    tags: ['printer-files', 'totals'],
    difficulty: 'beginner',
  },
  {
    id: 'prt-6',
    topicId: 'printer-files',
    title: 'Completed job, missing spool file',
    question:
      'A report finishes with WRKSBMJOB showing it completed successfully, but no spool file appears. What would you check?',
    type: 'scenario',
    correctAnswer:
      'Check whether a printer file override actually took effect, whether the specified output queue exists, or whether the report program failed after the point the wrapper considered its job done.',
    explanation:
      "A job showing as complete doesn't guarantee a spool file was actually produced -- checking the override, the output queue, and the batch job's own job log narrows down where the gap is.",
    relatedLessonSlugs: ['spool-files-and-output-queues', 'printer-file-vs-display-file-vs-database-file'],
    tags: ['printer-files', 'troubleshooting'],
    difficulty: 'beginner',
  },

  // --- Debugging & Troubleshooting ---
  {
    id: 'dbg-1',
    topicId: 'debugging',
    title: 'What STRDBG lets you do',
    question: 'What does STRDBG let you do?',
    type: 'multiple-choice',
    options: [
      'Delete a program',
      'Start an interactive debug session against a program, letting you set breakpoints and inspect variables',
      'Submit a batch job',
      'Compile RPGLE source',
    ],
    correctAnswer: 'Start an interactive debug session against a program, letting you set breakpoints and inspect variables',
    explanation:
      'STRDBG starts a debug session, the tool you use to set breakpoints, step through code, and inspect variable values while a program runs.',
    relatedLessonSlugs: ['why-debugging-matters-on-ibm-i', 'strdbg-basics-for-rpgle'],
    tags: ['debugging', 'strdbg'],
    difficulty: 'beginner',
  },
  {
    id: 'dbg-2',
    topicId: 'debugging',
    title: 'What a breakpoint is for',
    question: 'What is a breakpoint used for during debugging?',
    type: 'multiple-choice',
    options: [
      'Permanently stopping a program',
      'Pausing program execution at a specific line so you can inspect variables at that exact moment',
      'Deleting a line of code',
      'Compiling faster',
    ],
    correctAnswer: 'Pausing program execution at a specific line so you can inspect variables at that exact moment',
    explanation:
      'A breakpoint pauses execution right before a specific line runs, letting you inspect variable values at that exact moment rather than guessing what they were.',
    relatedLessonSlugs: ['setting-and-using-breakpoints'],
    tags: ['debugging', 'breakpoints'],
    difficulty: 'beginner',
  },
  {
    id: 'dbg-3',
    topicId: 'debugging',
    title: 'Why check the job log first',
    question: 'Why is checking the job log usually the first troubleshooting step, before starting a debug session?',
    type: 'scenario',
    correctAnswer:
      'The job log often already names the failing program and statement directly, which can make starting a full debug session unnecessary.',
    explanation:
      'The job log frequently contains enough detail (the failing statement, the message ID) to point straight at the cause, saving the time of starting a debug session for something already explained.',
    relatedLessonSlugs: ['understanding-job-logs', 'basic-troubleshooting-flow-for-ibm-i-developers'],
    tags: ['debugging', 'job-logs'],
    difficulty: 'beginner',
  },
  {
    id: 'dbg-4',
    topicId: 'debugging',
    title: 'What a message ID is',
    question: 'What is the purpose of an IBM i message ID, like CPF9801?',
    type: 'multiple-choice',
    options: [
      "It's a random tracking number with no real meaning",
      'It identifies a specific, documented condition or error, letting you look up exactly what it means',
      "It only appears in RPGLE programs, never CLLE",
      'It replaces the need for a job log',
    ],
    correctAnswer: 'It identifies a specific, documented condition or error, letting you look up exactly what it means',
    explanation:
      'A message ID like CPF9801 identifies a specific, documented condition, letting you (or a MONMSG in a CLLE program) recognize and respond to that exact situation.',
    relatedLessonSlugs: ['reading-ibm-i-message-ids'],
    tags: ['debugging', 'message-ids'],
    difficulty: 'beginner',
  },
  {
    id: 'dbg-5',
    topicId: 'debugging',
    title: 'Compile errors vs runtime errors',
    question: 'What is the difference between a compile error and a runtime error?',
    type: 'multiple-choice',
    options: [
      'They are the same thing',
      "A compile error means the program never successfully built and can't run at all; a runtime error means the program compiled fine but failed while actually running",
      'A runtime error always means a missing library',
      'A compile error only happens in CLLE, never RPGLE',
    ],
    correctAnswer:
      "A compile error means the program never successfully built and can't run at all; a runtime error means the program compiled fine but failed while actually running",
    explanation:
      "Distinguishing these matters: a runtime error tells you the program's logic compiled correctly, so the problem is in what happens as it executes -- not a syntax problem.",
    relatedLessonSlugs: ['compile-errors-vs-runtime-errors'],
    tags: ['debugging'],
    difficulty: 'beginner',
  },
  {
    id: 'dbg-6',
    topicId: 'debugging',
    title: 'The recommended first troubleshooting step',
    question: 'What is the recommended first step in a basic IBM i troubleshooting flow?',
    type: 'multiple-choice',
    options: [
      'Immediately start STRDBG',
      'Check the job log first, since it often narrows down the problem before you need any other tool',
      'Recompile the program without changes',
      'Delete and recreate the file',
    ],
    correctAnswer: 'Check the job log first, since it often narrows down the problem before you need any other tool',
    explanation:
      'The basic troubleshooting flow starts with the job log, since it frequently already explains what happened, before reaching for more involved tools like a debugger.',
    relatedLessonSlugs: ['basic-troubleshooting-flow-for-ibm-i-developers'],
    tags: ['debugging'],
    difficulty: 'beginner',
  },

  // --- IBM i Operations / Jobs / System Basics ---
  {
    id: 'ops-1',
    topicId: 'ibm-i-operations',
    title: 'Interactive vs batch jobs',
    question: 'What is the difference between an interactive job and a batch job?',
    type: 'multiple-choice',
    options: [
      'There is no difference',
      'An interactive job is tied to a user actively working at a screen; a batch job runs independently, typically without anyone waiting on it in real time',
      'Batch jobs can never fail',
      'Interactive jobs always run overnight',
    ],
    correctAnswer:
      'An interactive job is tied to a user actively working at a screen; a batch job runs independently, typically without anyone waiting on it in real time',
    explanation:
      'An interactive job responds to a user\'s real-time actions, like typing at a 5250 screen. A batch job runs independently, often submitted to run without anyone actively waiting on it.',
    relatedLessonSlugs: ['ibm-i-jobs-explained', 'interactive-jobs-vs-batch-jobs'],
    tags: ['operations', 'jobs'],
    difficulty: 'beginner',
  },
  {
    id: 'ops-2',
    topicId: 'ibm-i-operations',
    title: 'Job queue vs output queue',
    question: 'What is the difference between a job queue and an output queue?',
    type: 'multiple-choice',
    options: [
      'They are the same thing',
      'A job queue holds jobs waiting to run; an output queue holds spool files waiting to be printed or viewed',
      'An output queue holds jobs; a job queue holds spool files',
      'Only batch jobs use queues',
    ],
    correctAnswer: 'A job queue holds jobs waiting to run; an output queue holds spool files waiting to be printed or viewed',
    explanation:
      'A job queue holds submitted jobs waiting for their turn to actually run. An output queue holds the spool file output that jobs produce, waiting to be printed or viewed -- two different kinds of waiting.',
    relatedLessonSlugs: ['job-queues-and-output-queues'],
    tags: ['operations', 'job-queues'],
    difficulty: 'beginner',
  },
  {
    id: 'ops-3',
    topicId: 'ibm-i-operations',
    title: 'What MSGW usually means',
    question: "What does it usually mean when a job's status shows MSGW?",
    type: 'multiple-choice',
    options: [
      'The job finished successfully',
      'The job is waiting for a reply to an inquiry message before it can continue',
      'The job was deleted',
      'The job is running faster than normal',
    ],
    correctAnswer: 'The job is waiting for a reply to an inquiry message before it can continue',
    explanation:
      "MSGW means the job is waiting on a message, typically an inquiry message that needs a reply before the job can proceed -- checking the job's message queue reveals exactly what it's waiting on.",
    relatedLessonSlugs: ['job-status-values-explained'],
    tags: ['operations', 'msgw'],
    difficulty: 'beginner',
  },
  {
    id: 'ops-4',
    topicId: 'ibm-i-operations',
    title: 'Works from one library list, not another',
    question:
      'A program works fine when run from one library list but fails to find an object when run from another. What would you check?',
    type: 'scenario',
    correctAnswer:
      "Compare the two library lists directly -- the object likely lives in a library that's missing from, or positioned differently in, the failing library list.",
    explanation:
      'This is a classic library list problem: the same program behaves differently purely because of what libraries are (or aren\'t) in the library list it\'s running with.',
    relatedLessonSlugs: ['library-list-problems-in-real-applications'],
    tags: ['operations', 'library-list', 'troubleshooting'],
    difficulty: 'beginner',
  },
  {
    id: 'ops-5',
    topicId: 'ibm-i-operations',
    title: 'Two users, one record',
    question: 'Why might two users both trying to update the same record run into a conflict?',
    type: 'scenario',
    correctAnswer:
      "One user's job holds a lock on that record while updating it, and the second job's own attempt to lock or update the same record conflicts with that existing lock -- a normal, expected situation, not necessarily a bug.",
    explanation:
      "Object/record locks are IBM i's way of preventing two jobs from corrupting the same record at once. A lock conflict between two genuinely simultaneous updates is expected behavior, not a sign that the program itself is broken.",
    relatedLessonSlugs: ['object-locks-basics'],
    tags: ['operations', 'locks'],
    difficulty: 'beginner',
  },
  {
    id: 'ops-6',
    topicId: 'ibm-i-operations',
    title: 'Visibility vs authority',
    question: 'If an object clearly exists and is visible to a user, does that guarantee the user has authority to update it?',
    type: 'multiple-choice',
    options: [
      'Yes, visibility always implies full authority',
      'No -- an object existing and being visible is separate from having the specific authority needed to perform an operation like update',
      'Only for physical files',
      'Only if the user is signed on interactively',
    ],
    correctAnswer:
      'No -- an object existing and being visible is separate from having the specific authority needed to perform an operation like update',
    explanation:
      'Authority is checked per operation. A user can see an object exists without having, for example, the authority to change it -- these are two separate questions.',
    relatedLessonSlugs: ['authorities-and-object-access-basics'],
    tags: ['operations', 'authority'],
    difficulty: 'beginner',
  },

  // --- Real-World Mini Projects ---
  {
    id: 'proj-1',
    topicId: 'mini-projects',
    title: 'Customer Inquiry Program pieces',
    question: 'In the Customer Inquiry Program mini project, what two things does the RPGLE program tie together?',
    type: 'multiple-choice',
    options: ['A display file and a keyed physical file', 'Two printer files', 'A subfile and a data area', 'Two CLLE programs'],
    correctAnswer: 'A display file and a keyed physical file',
    explanation:
      'The Customer Inquiry Program mini project ties together a display file (for the screen) and a keyed physical file (CUSTMAST), using CHAIN to look up a customer by number.',
    relatedLessonSlugs: ['customer-inquiry-program'],
    tags: ['mini-projects'],
    difficulty: 'beginner',
  },
  {
    id: 'proj-2',
    topicId: 'mini-projects',
    title: 'Loading the order list subfile',
    question: "In the Simple Order List Subfile mini project, which native operations load the subfile with one customer's orders?",
    type: 'multiple-choice',
    options: ['CHAIN alone', 'SETLL followed by READE', 'WRITE in a loop with no key check', 'DELETE followed by WRITE'],
    correctAnswer: 'SETLL followed by READE',
    explanation:
      'Since a customer can have multiple orders sharing the same key, SETLL positions to the first matching key and a READE loop reads every order sharing it, writing each into the subfile.',
    relatedLessonSlugs: ['simple-order-list-subfile'],
    tags: ['mini-projects', 'subfiles'],
    difficulty: 'beginner',
  },
  {
    id: 'proj-3',
    topicId: 'mini-projects',
    title: 'Batch Report Program fails at runtime',
    question: "The Batch Report Program mini project's RPT001R program is failing at runtime. What is the first thing you would check?",
    type: 'scenario',
    correctAnswer: 'Check the job log first -- it likely names the exact failing statement, before reaching for a debug session.',
    explanation:
      'Consistent with the general troubleshooting flow, checking the job log first is the right move even for a mini-project program, since it usually explains the failure directly.',
    relatedLessonSlugs: ['batch-report-program', 'debugging-a-broken-file-io-program'],
    tags: ['mini-projects', 'debugging'],
    difficulty: 'beginner',
  },
  {
    id: 'proj-4',
    topicId: 'mini-projects',
    title: 'Why add looks different from update/delete',
    question:
      "In the Customer Maintenance Add/Change/Delete mini project, why don't the add (WRITE) and update/delete (CHAIN then UPDATE/DELETE) branches follow the same pattern?",
    type: 'scenario',
    correctAnswer:
      "Adding a new customer has no existing record to retrieve first, so it just WRITEs; updating or deleting requires a CHAIN first (and an %FOUND check) since those operations need an existing record to act on.",
    explanation:
      'WRITE creates a new record and needs no prior lookup. UPDATE and DELETE both require a current record, established via a preceding CHAIN and %FOUND check -- this is why the add branch looks different from the other two.',
    relatedLessonSlugs: ['customer-maintenance-add-change-delete'],
    tags: ['mini-projects', 'file-io'],
    difficulty: 'beginner',
  },
  {
    id: 'proj-5',
    topicId: 'mini-projects',
    title: 'Same code, different outcome',
    question:
      "In the Troubleshooting Locked Record Scenario mini project, why does User A's update succeed while User B's fails, even though they ran the exact same code?",
    type: 'scenario',
    correctAnswer:
      "User A locked the record first and successfully updated it; User B's own update then conflicts with the fact that the record changed since User B's own CHAIN, a timing issue rather than a code bug.",
    explanation:
      'This mini project deliberately shows that identical code can behave differently purely due to timing between two jobs acting on the same record -- not because the code itself is wrong.',
    relatedLessonSlugs: ['troubleshooting-locked-record-scenario'],
    tags: ['mini-projects', 'locks'],
    difficulty: 'beginner',
  },
  {
    id: 'proj-6',
    topicId: 'mini-projects',
    title: "The wrapper's blind spot",
    question: "In the Batch Job Failure Investigation mini project, what was the actual gap in the CLLE wrapper's CHKOBJ check?",
    type: 'scenario',
    correctAnswer:
      'The wrapper only checked CUSTMAST with CHKOBJ, but the report program RPT002R also depended on ORDHIST, which was never checked -- so the wrapper reported success even though the report later failed on the unchecked file.',
    explanation:
      "This mini project's whole point is that a CHKOBJ check is only as complete as the objects it actually names -- missing even one dependency creates a false sense of safety.",
    relatedLessonSlugs: ['batch-job-failure-investigation'],
    tags: ['mini-projects', 'troubleshooting'],
    difficulty: 'beginner',
  },

  // --- Interview & Job Readiness ---
  {
    id: 'int-1',
    topicId: 'interview-readiness',
    title: 'Strong vs weak CHAIN answer',
    question: "Which is the stronger interview answer to \"What does CHAIN do?\"",
    type: 'multiple-choice',
    options: [
      '"CHAIN reads a file."',
      '"CHAIN retrieves one specific record from a keyed file by its key value, and you check %FOUND afterward to confirm whether it actually existed."',
      '"CHAIN is a type of loop."',
      '"CHAIN only works with SQL."',
    ],
    correctAnswer:
      '"CHAIN retrieves one specific record from a keyed file by its key value, and you check %FOUND afterward to confirm whether it actually existed."',
    explanation:
      "A strong interview answer connects the concept to how it's actually used and checked, rather than a vague one-line restatement. Naming %FOUND shows you understand the full pattern, not just the keyword.",
    relatedLessonSlugs: ['ibm-i-developer-interview-roadmap', 'rpgle-file-io-interview-scenarios', 'chain-for-keyed-access'],
    tags: ['interview-readiness'],
    difficulty: 'beginner',
  },
  {
    id: 'int-2',
    topicId: 'interview-readiness',
    title: 'Explaining CHAIN vs READ',
    question: 'How would you explain the difference between CHAIN and READ in an interview?',
    type: 'scenario',
    correctAnswer:
      'CHAIN retrieves one specific record directly by key, typically on a keyed file; READ reads the next record in sequence (arrival or key order) without targeting a specific key value.',
    explanation:
      'A strong answer contrasts the two directly: CHAIN is for a targeted, single lookup; READ is for stepping through records in sequence, one at a time.',
    relatedLessonSlugs: ['rpgle-file-io-interview-scenarios'],
    tags: ['interview-readiness', 'file-io'],
    difficulty: 'beginner',
  },
  {
    id: 'int-3',
    topicId: 'interview-readiness',
    title: 'Explaining SQLCODE 100',
    question: 'How would you explain what SQLCODE = 100 means in an interview?',
    type: 'scenario',
    correctAnswer:
      'SQLCODE 100 specifically means no row matched the query -- a normal, often-expected outcome, not the same as a genuine database error.',
    explanation:
      "Being able to name the specific value (100) and explain that it's an expected \"not found\" condition, distinct from a real error, is exactly the kind of specific answer that stands out in an interview.",
    relatedLessonSlugs: ['sqlrpgle-interview-scenarios', 'sqlcode-and-sqlstate-basics-in-sqlrpgle'],
    tags: ['interview-readiness', 'sqlrpgle'],
    difficulty: 'beginner',
  },
  {
    id: 'int-4',
    topicId: 'interview-readiness',
    title: 'Explaining a record lock scenario',
    question: 'How would you explain a record lock scenario if asked about it in an interview?',
    type: 'scenario',
    correctAnswer:
      'Two jobs both trying to update the same record at nearly the same time can hit a lock conflict -- this is normal, expected behavior, not necessarily a bug, and WRKOBJLCK can show which job holds which lock.',
    explanation:
      "A strong answer recognizes that a lock conflict is often just timing between two legitimate jobs, not a code defect -- and names a real tool (WRKOBJLCK) for investigating it.",
    relatedLessonSlugs: ['common-ibm-i-interview-mistakes', 'real-support-ticket-analysis-for-beginners'],
    tags: ['interview-readiness', 'locks'],
    difficulty: 'beginner',
  },
  {
    id: 'int-5',
    topicId: 'interview-readiness',
    title: 'Explaining job log usage',
    question: "How would you explain job log usage if asked how you'd start debugging a failing program?",
    type: 'scenario',
    correctAnswer:
      "Check the job log first, since it usually names the failing program and statement directly -- only start a debug session if the job log doesn't already make the cause clear.",
    explanation:
      'This answer shows a structured process (job log first, debugger second) rather than jumping straight to the most involved tool, which is exactly what interviewers are usually listening for.',
    relatedLessonSlugs: ['debugging-scenario-based-questions'],
    tags: ['interview-readiness', 'debugging'],
    difficulty: 'beginner',
  },
  {
    id: 'int-6',
    topicId: 'interview-readiness',
    title: 'Spotting the weaker answer',
    question:
      "Which is the weaker answer, and why: (a) \"I would just start debugging\" or (b) \"I would check the job log first, then debug if needed\"?",
    type: 'scenario',
    correctAnswer:
      '(a) is weaker, because it skips straight to the most involved tool without first checking a source (the job log) that often already explains the problem.',
    explanation:
      'Interviewers are listening for a structured, ordered process. Jumping straight to a debugger, without mentioning the job log, signals a less methodical approach.',
    relatedLessonSlugs: ['common-ibm-i-interview-mistakes', 'mock-ibm-i-developer-interview'],
    tags: ['interview-readiness'],
    difficulty: 'beginner',
  },

  // --- Mixed Scenario Review ---
  {
    id: 'mix-1',
    topicId: 'mixed-review',
    title: 'UPDATE without a %FOUND check',
    question: "A program CHAINs to a keyed file, then immediately calls UPDATE without checking %FOUND. What happens if the key doesn't exist?",
    type: 'multiple-choice',
    options: [
      'The program silently does nothing',
      'UPDATE fails at runtime, since there is no current record for it to act on',
      'A new record is automatically created',
      'The program automatically retries with a different key',
    ],
    correctAnswer: 'UPDATE fails at runtime, since there is no current record for it to act on',
    explanation:
      "This is one of the most common RPGLE file I/O mistakes -- skipping the %FOUND check before UPDATE or DELETE causes a runtime failure whenever the key doesn't match a record.",
    relatedLessonSlugs: ['chain-for-keyed-access', 'common-rpgle-file-io-mistakes-and-best-practices'],
    tags: ['mixed-review', 'file-io'],
    difficulty: 'beginner',
  },
  {
    id: 'mix-2',
    topicId: 'mixed-review',
    title: 'A missing step, not a broken program',
    question:
      "A subfile shows stale data from a previous search, and separately, a batch report is missing a spool file even though WRKSBMJOB shows it completed. What do both symptoms have in common?",
    type: 'scenario',
    correctAnswer:
      "Both point to a missing or incomplete step, not a fundamentally broken program -- the subfile needs a clear-before-reload step, and the report needs its own job log checked separately from the wrapper's.",
    explanation:
      'Both scenarios are examples of a common theme: a symptom that looks like a bug is often actually a missing step (clearing a subfile, checking the right job log) rather than broken logic.',
    relatedLessonSlugs: ['clearing-and-reloading-a-subfile', 'batch-job-failure-investigation'],
    tags: ['mixed-review', 'troubleshooting'],
    difficulty: 'beginner',
  },
  {
    id: 'mix-3',
    topicId: 'mixed-review',
    title: 'Combining SQL search with a subfile',
    question: 'You need to search customers by partial name and display multiple matches on screen. Which combination of concepts applies?',
    type: 'multiple-choice',
    options: [
      'CHAIN plus a display file record format',
      'An embedded SQL cursor with a LIKE condition, loading matches into a subfile',
      'SETLL alone, with no subfile',
      'A printer file only',
    ],
    correctAnswer: 'An embedded SQL cursor with a LIKE condition, loading matches into a subfile',
    explanation:
      'A partial-name search naturally fits an embedded SQL cursor with LIKE, and showing multiple matches at once naturally fits a subfile -- combining both concepts from different topics, exactly as the SQLRPGLE Search Screen mini project does.',
    relatedLessonSlugs: ['sqlrpgle-search-screen', 'understanding-rrn-in-subfile-programs'],
    tags: ['mixed-review', 'sqlrpgle', 'subfiles'],
    difficulty: 'beginner',
  },
  {
    id: 'mix-4',
    topicId: 'mixed-review',
    title: "Wrapper success vs the job's own outcome",
    question:
      "A CLLE wrapper submits a report program as a batch job. The wrapper's own job log shows success. Where would you actually find out whether the report program itself failed?",
    type: 'scenario',
    correctAnswer:
      "In the submitted batch job's own separate job log, not the wrapper's -- the wrapper's job log only confirms it submitted successfully, not that the submitted job itself succeeded.",
    explanation:
      "A submitted job (via SBMJOB) runs independently with its own job log. Confirming the wrapper submitted successfully is a separate question from confirming the submitted job itself completed without error.",
    relatedLessonSlugs: ['batch-job-failure-investigation', 'job-queues-and-output-queues'],
    tags: ['mixed-review', 'operations'],
    difficulty: 'beginner',
  },
  {
    id: 'mix-5',
    topicId: 'mixed-review',
    title: 'Combining subfile selection with a detail screen',
    question:
      'Which two mini-project concepts would you combine to build a screen that lets a user select one row from a list and see its full detail?',
    type: 'multiple-choice',
    options: [
      'A load-all subfile plus DELETE',
      'Option fields plus READC, then CHAIN to the selected record and EXFMT a detail screen',
      'A printer file plus MONMSG',
      'CRTLIB plus DSPLIB',
    ],
    correctAnswer: 'Option fields plus READC, then CHAIN to the selected record and EXFMT a detail screen',
    explanation:
      'This combines subfile row-selection (option field, READC) with native file I/O (CHAIN) and display files (EXFMT) -- exactly the combination used in the Subfile Row Selection with Detail Screen mini project.',
    relatedLessonSlugs: ['subfile-row-selection-with-detail-screen', 'simple-order-list-subfile'],
    tags: ['mixed-review', 'subfiles'],
    difficulty: 'beginner',
  },
  {
    id: 'mix-6',
    topicId: 'mixed-review',
    title: 'MSGW and job log investigation share a habit',
    question:
      "In an interview, you're asked to explain why a job might be in MSGW status and how you'd investigate it. What ties this question to earlier debugging concepts?",
    type: 'scenario',
    correctAnswer:
      'Both rely on the same underlying habit: checking the specific message the job (or job log) is actually reporting, rather than guessing, before taking any action.',
    explanation:
      "Whether it's a job in MSGW or a job log after a program failure, the core skill is the same: read the actual message detail first, since it usually tells you exactly what's needed.",
    relatedLessonSlugs: ['job-status-values-explained', 'basic-troubleshooting-flow-for-ibm-i-developers'],
    tags: ['mixed-review', 'operations', 'debugging'],
    difficulty: 'beginner',
  },

  // --- Advanced RPGLE / ILE (added in PR #125) ---
  {
    id: 'ile-1',
    topicId: 'rpgle-ile',
    title: 'OPM vs ILE',
    question:
      'What is the key architectural difference between OPM (Original Program Model) and ILE (Integrated Language Environment) programs on IBM i?',
    type: 'multiple-choice',
    options: [
      'ILE programs can be built from separately compiled modules bound together; OPM programs are compiled as a single, self-contained unit.',
      'OPM programs run faster than ILE programs in every case.',
      'ILE is a newer version of RPG syntax, unrelated to how programs are compiled or bound.',
      'OPM programs cannot call other programs, while ILE programs can.',
    ],
    correctAnswer:
      'ILE programs can be built from separately compiled modules bound together; OPM programs are compiled as a single, self-contained unit.',
    explanation:
      "ILE's defining feature is modular compilation: modules can be compiled independently and then bound together into a program or service program, enabling code reuse and independent updates. OPM programs compile straight to a single program object with no separate module step.",
    relatedLessonSlugs: ['opm-vs-ile-on-ibm-i', 'modules-programs-and-service-programs'],
    tags: ['ile', 'opm', 'architecture'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-2',
    topicId: 'rpgle-ile',
    title: 'Module, Program, and Service Program',
    question: 'Which statement correctly distinguishes a module, a program, and a service program in ILE?',
    type: 'multiple-choice',
    options: [
      "A module is compiled but not yet bound into anything runnable; a program is bound and directly callable as a job's entry point; a service program is bound and exports procedures for other programs to call.",
      'A module and a program are the same thing; only a service program is different.',
      'A service program is just a program with a different file extension.',
      'A module can be called directly from the command line, just like a program.',
    ],
    correctAnswer:
      "A module is compiled but not yet bound into anything runnable; a program is bound and directly callable as a job's entry point; a service program is bound and exports procedures for other programs to call.",
    explanation:
      'These three ILE object types sit at different stages: a module is a compiled building block, a program is something a job can call directly, and a service program is a bound collection of reusable, exported procedures other programs call into.',
    relatedLessonSlugs: ['modules-programs-and-service-programs', 'creating-rpgle-modules-with-crtrpgmod'],
    tags: ['ile', 'modules', 'service-programs'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-3',
    topicId: 'rpgle-ile',
    title: 'CRTRPGMOD',
    question: 'What does CRTRPGMOD produce, and what must happen before that output can actually run?',
    type: 'multiple-choice',
    options: [
      'CRTRPGMOD produces a *MODULE object; it must still be bound into a *PGM or *SRVPGM (e.g. with CRTPGM) before it can run.',
      'CRTRPGMOD produces a runnable *PGM object directly.',
      'CRTRPGMOD produces source code only, with no compilation.',
      'CRTRPGMOD produces a *SRVPGM object directly, skipping the module step.',
    ],
    correctAnswer:
      'CRTRPGMOD produces a *MODULE object; it must still be bound into a *PGM or *SRVPGM (e.g. with CRTPGM) before it can run.',
    explanation:
      'CRTRPGMOD only compiles source into a *MODULE -- a building block, not a runnable object. Binding it into a *PGM or *SRVPGM is a separate, later step.',
    relatedLessonSlugs: ['creating-rpgle-modules-with-crtrpgmod', 'binding-modules-into-programs-with-crtpgm'],
    tags: ['ile', 'crtrpgmod', 'modules'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-4',
    topicId: 'rpgle-ile',
    title: 'Binding Modules with CRTPGM',
    question:
      'A developer has three separately compiled modules: ORDHDR, ORDDTL, and ORDCALC. They want a single runnable program that uses all three. What command would they use, and what does it do?',
    type: 'scenario',
    correctAnswer:
      'CRTPGM, specifying all three modules in its MODULE parameter -- it binds them together into one *PGM object.',
    explanation:
      'CRTPGM is the command that takes one or more previously compiled *MODULE objects and binds them into a single *PGM (or, with CRTSRVPGM, a *SRVPGM). Binding happens at this step, not at compile time.',
    relatedLessonSlugs: ['binding-modules-into-programs-with-crtpgm', 'creating-rpgle-modules-with-crtrpgmod'],
    tags: ['ile', 'crtpgm', 'binding'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-5',
    topicId: 'rpgle-ile',
    title: 'Prototypes and Procedure Interfaces',
    question: 'Why does a procedure need both a prototype and a procedure interface in ILE RPGLE?',
    type: 'multiple-choice',
    options: [
      'The prototype tells the caller how to call the procedure (parameters/return type); the procedure interface defines the same signature inside the procedure itself, so the two must match.',
      'The prototype and procedure interface are two names for exactly the same single declaration.',
      'The procedure interface is only needed for procedures with no parameters.',
      'The prototype is only used for procedures written in CLLE, not RPGLE.',
    ],
    correctAnswer:
      'The prototype tells the caller how to call the procedure (parameters/return type); the procedure interface defines the same signature inside the procedure itself, so the two must match.',
    explanation:
      'The prototype and procedure interface describe the same calling contract from two sides -- the caller and the procedure itself -- and a mismatch between them is a common source of compile or runtime errors.',
    relatedLessonSlugs: ['prototypes-and-procedure-interfaces-in-ile', 'parameters-and-prototypes-in-rpgle'],
    tags: ['ile', 'prototypes', 'procedures'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-6',
    topicId: 'rpgle-ile',
    title: 'Internal vs Exported Procedures',
    question: "What makes a procedure 'exported' rather than just 'internal' in ILE?",
    type: 'multiple-choice',
    options: [
      "An exported procedure is declared in a service program's binder source so other programs can call it; an internal procedure can only be called from within the same module/program.",
      'Exported procedures run faster than internal procedures.',
      'Internal procedures cannot use parameters.',
      'Exported procedures must be written in a separate programming language.',
    ],
    correctAnswer:
      "An exported procedure is declared in a service program's binder source so other programs can call it; an internal procedure can only be called from within the same module/program.",
    explanation:
      "Export status is what makes a procedure visible outside its own module -- it's the mechanism a service program uses to offer procedures to other programs, via its binder source.",
    relatedLessonSlugs: ['internal-procedures-vs-exported-procedures', 'binder-source-introduction'],
    tags: ['ile', 'procedures', 'export'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-7',
    topicId: 'rpgle-ile',
    title: 'Why Use a Service Program',
    question:
      'A shop has a set of validation routines (e.g. checking a customer number format) used by a dozen different programs. What is the main benefit of putting these in a service program rather than copying the logic into each program?',
    type: 'scenario',
    correctAnswer:
      'Every calling program shares one bound copy of the logic -- when the validation rule changes, updating and rebinding the service program updates it for every caller, without touching or recompiling each individual program.',
    explanation:
      'This is the core value of service programs: centralizing reusable logic so it is maintained in one place. Copy-pasting the same logic into every program means every copy has to be found and changed separately whenever the rule changes.',
    relatedLessonSlugs: ['introduction-to-service-programs', 'modules-programs-and-service-programs'],
    tags: ['ile', 'service-programs', 'reuse'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-8',
    topicId: 'rpgle-ile',
    title: 'Activation Groups',
    question: 'What is an activation group, at a conceptual level?',
    type: 'multiple-choice',
    options: [
      'A runtime scope that groups together the resources (like open files and static storage) that ILE programs use while running, controlling when those resources are activated and reclaimed.',
      'A special type of RPG data structure.',
      'A naming convention for RPG procedures.',
      'A setting that only affects how source code is formatted.',
    ],
    correctAnswer:
      'A runtime scope that groups together the resources (like open files and static storage) that ILE programs use while running, controlling when those resources are activated and reclaimed.',
    explanation:
      'Activation groups control the lifetime of runtime resources shared across bound programs -- understanding them matters for both correctness (state that persists or resets unexpectedly) and debugging.',
    relatedLessonSlugs: ['activation-groups-basics', 'opm-vs-ile-on-ibm-i'],
    tags: ['ile', 'activation-groups'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-9',
    topicId: 'rpgle-ile',
    title: 'Binding Directories',
    question:
      'What problem does a binding directory solve when compiling a program that calls procedures in several service programs?',
    type: 'multiple-choice',
    options: [
      'It lets the compiler automatically resolve which service program a called procedure lives in, without the programmer having to list every *SRVPGM by hand.',
      'It replaces the need for binder source entirely.',
      'It stores the actual compiled machine code for every program in the library.',
      'It is only used for CLLE programs, not RPGLE.',
    ],
    correctAnswer:
      'It lets the compiler automatically resolve which service program a called procedure lives in, without the programmer having to list every *SRVPGM by hand.',
    explanation:
      'Binding directories save repetitive, error-prone manual bookkeeping -- instead of specifying every service program on every compile, the compiler looks them up automatically.',
    relatedLessonSlugs: ['binding-directories-basics', 'creating-service-programs-with-crtsrvpgm'],
    tags: ['ile', 'binding-directories'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-10',
    topicId: 'rpgle-ile',
    title: 'Creating a Service Program',
    question:
      'Besides compiling the modules that make up a service program, what additional step (compared to creating a plain *PGM) does creating a *SRVPGM with CRTSRVPGM typically require?',
    type: 'multiple-choice',
    options: [
      'Providing binder source (an export list) that declares which procedures the service program makes available to callers.',
      'Nothing -- CRTSRVPGM works identically to CRTPGM with no extra input.',
      'Writing the service program in a different language than its callers.',
      'Manually assigning an activation group number to every calling program.',
    ],
    correctAnswer:
      'Providing binder source (an export list) that declares which procedures the service program makes available to callers.',
    explanation:
      'Binder source is what makes a service program usable by other programs -- it explicitly declares the exported interface, rather than exposing everything the service program happens to contain.',
    relatedLessonSlugs: ['creating-service-programs-with-crtsrvpgm', 'binder-source-introduction'],
    tags: ['ile', 'crtsrvpgm', 'binder-source'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-11',
    topicId: 'rpgle-ile',
    title: 'Service Program Signatures',
    question:
      "Why does changing a service program's exported procedure -- for example, adding a new required parameter -- carry real risk for existing callers?",
    type: 'scenario',
    correctAnswer:
      'If the change alters the exported signature in a way that breaks binary compatibility, programs bound to the old signature can fail at runtime (or need to be recompiled/rebound) once the service program is updated.',
    explanation:
      'Service program signatures exist to protect callers from silent incompatibility. A careless update to an exported procedure can break every program that calls it, sometimes without an obvious compile-time warning.',
    relatedLessonSlugs: ['service-program-signatures-at-a-beginner-level', 'updating-service-programs-safely'],
    tags: ['ile', 'service-programs', 'signatures'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-12',
    topicId: 'rpgle-ile',
    title: 'Updating a Service Program Safely',
    question:
      "What is the safest general practice when you need to change what a widely-used service program's exported procedure does?",
    type: 'multiple-choice',
    options: [
      "Prefer additive changes (e.g. a new procedure or an optional parameter) over altering an existing exported procedure's required signature, and deliberately test dependent programs rather than assuming the change is safe.",
      'Just change the procedure body directly -- since RPGLE recompiles automatically, no other program is ever affected.',
      'Delete the old service program and let callers figure out that it is gone.',
      'Signature safety is only a concern for CLLE, not RPGLE service programs.',
    ],
    correctAnswer:
      "Prefer additive changes (e.g. a new procedure or an optional parameter) over altering an existing exported procedure's required signature, and deliberately test dependent programs rather than assuming the change is safe.",
    explanation:
      'Additive, backward-compatible changes protect existing callers; changing a required signature in place is exactly the kind of edit that has a real chance of silently breaking other programs.',
    relatedLessonSlugs: ['updating-service-programs-safely', 'service-program-signatures-at-a-beginner-level'],
    tags: ['ile', 'best-practices'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-13',
    topicId: 'rpgle-ile',
    title: 'Activation Group Troubleshooting',
    question:
      'A program intermittently shows leftover data from a previous call, or fails to release a resource, in a way that seems tied to how it is activated. What ILE concept is most directly implicated, and where would a developer start investigating?',
    type: 'scenario',
    correctAnswer:
      'Activation groups -- since they control when resources like static storage and open files are activated and reclaimed, a mismatched or shared activation group between programs is a common cause of this kind of leftover-state symptom.',
    explanation:
      'Activation-group-related problems are a classic source of confusing, hard-to-reproduce ILE bugs precisely because they affect when storage and files are reset -- not something visible from reading the RPG logic alone.',
    relatedLessonSlugs: ['activation-group-problems-and-common-confusions', 'activation-groups-basics'],
    tags: ['ile', 'troubleshooting', 'activation-groups'],
    difficulty: 'intermediate',
  },
  {
    id: 'ile-14',
    topicId: 'rpgle-ile',
    title: 'Debugging Across Modules',
    question:
      'When debugging a program built from multiple bound modules with STRDBG, what do you need to make sure of to be able to step into and see variables from a specific module?',
    type: 'multiple-choice',
    options: [
      'The module was compiled with debug data enabled and is covered by the debug session, since each module needs its own debug information to show its source and variables.',
      'Nothing special -- STRDBG automatically shows full source for every module in a program regardless of how it was compiled.',
      'Only the main module can ever be debugged; bound-in modules are always invisible to the debugger.',
      'Debugging a multi-module program requires a completely different tool than STRDBG.',
    ],
    correctAnswer:
      'The module was compiled with debug data enabled and is covered by the debug session, since each module needs its own debug information to show its source and variables.',
    explanation:
      "Debug visibility is per-module, tied to how that module was compiled -- it's a common surprise for developers new to ILE debugging when a module they expected to step into shows no source.",
    relatedLessonSlugs: ['debugging-ile-programs', 'creating-rpgle-modules-with-crtrpgmod'],
    tags: ['ile', 'debugging', 'strdbg'],
    difficulty: 'intermediate',
  },

  // --- Modern IBM i / APIs / Integration (added in PR #125) ---
  {
    id: 'apiint-1',
    topicId: 'integration-modernization',
    title: 'What a REST API Is',
    question: "In the context of IBM i integration, what does it mean to 'expose IBM i logic as a REST API'?",
    type: 'multiple-choice',
    options: [
      'Wrapping existing IBM i business logic (e.g. an RPGLE program or service program) behind an HTTP endpoint, so external systems can call it over the network and get back structured data like JSON.',
      'Rewriting all RPGLE programs in a web programming language.',
      'Installing a website on the IBM i IFS with no connection to existing programs.',
      'Replacing 5250 green-screen access with a mouse-driven interface.',
    ],
    correctAnswer:
      'Wrapping existing IBM i business logic (e.g. an RPGLE program or service program) behind an HTTP endpoint, so external systems can call it over the network and get back structured data like JSON.',
    explanation:
      'Exposing logic as an API is about adding an HTTP-reachable front door to logic that already exists -- not rewriting or replacing the underlying RPGLE.',
    relatedLessonSlugs: ['why-apis-matter-on-ibm-i', 'rest-api-concepts-for-ibm-i-developers'],
    tags: ['api', 'rest', 'integration'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-2',
    topicId: 'integration-modernization',
    title: 'HTTP Methods',
    question:
      'Which HTTP method is conventionally used to retrieve data without changing anything on the server, and which is conventionally used to create a new resource?',
    type: 'multiple-choice',
    options: [
      'GET retrieves data without side effects; POST typically creates a new resource.',
      'DELETE retrieves data; GET creates a new resource.',
      'PUT and GET are interchangeable and always mean the same thing.',
      'POST is only used for logging in, never for creating data.',
    ],
    correctAnswer: 'GET retrieves data without side effects; POST typically creates a new resource.',
    explanation:
      'HTTP methods carry a conventional meaning that well-behaved APIs follow: GET for safe reads, POST for creating something new, among others.',
    relatedLessonSlugs: ['http-methods-and-status-codes-for-ibm-i-developers', 'rest-api-concepts-for-ibm-i-developers'],
    tags: ['http', 'methods', 'rest'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-3',
    topicId: 'integration-modernization',
    title: 'HTTP Status Codes',
    question: 'An API call returns HTTP status 404. What does that most likely tell the caller?',
    type: 'multiple-choice',
    options: [
      'The requested resource (e.g. a specific record or endpoint) could not be found.',
      'The request succeeded and returned exactly the data requested.',
      'The server experienced an unexpected internal error unrelated to the request.',
      'The caller does not have permission to access the resource.',
      ],
    correctAnswer: 'The requested resource (e.g. a specific record or endpoint) could not be found.',
    explanation:
      "404 specifically means 'not found' -- different from a 401/403 permission problem or a 500 server error, which is exactly why meaningful status codes help a caller react correctly.",
    relatedLessonSlugs: ['http-methods-and-status-codes-for-ibm-i-developers', 'api-error-handling-basics'],
    tags: ['http', 'status-codes'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-4',
    topicId: 'integration-modernization',
    title: 'JSON Basics',
    question: 'What is JSON, at a basic level, and why does it matter for RPGLE developers building or consuming APIs?',
    type: 'multiple-choice',
    options: [
      'A lightweight, text-based data format built from key-value pairs and arrays; RPGLE programs need to construct or parse JSON to exchange data with most modern APIs.',
      'A binary file format that cannot be read as text.',
      'A programming language that replaces RPGLE for API work.',
      'A type of database index used only in Db2 for i.',
    ],
    correctAnswer:
      'A lightweight, text-based data format built from key-value pairs and arrays; RPGLE programs need to construct or parse JSON to exchange data with most modern APIs.',
    explanation:
      'JSON is the data format, not a replacement language -- RPGLE still does the work, but it needs to build or read JSON text to talk to most modern APIs.',
    relatedLessonSlugs: ['json-basics-for-rpgle-developers', 'json-parsing-concepts-in-rpgle'],
    tags: ['json', 'rpgle', 'data-format'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-5',
    topicId: 'integration-modernization',
    title: 'Designing a Request/Response',
    question:
      "You're designing an API endpoint that returns a customer's order history. What should the response generally include, beyond just the raw order data, to be genuinely useful to the calling system?",
    type: 'scenario',
    correctAnswer:
      "Enough structure for the caller to understand the result unambiguously -- typically an explicit status/success indicator and clear field names, not just a bare list of values the caller has to guess the meaning of.",
    explanation:
      "Good request/response design is about returning data in a predictable, self-describing shape so the calling system doesn't have to guess field meanings or handle edge cases (like an empty order history) inconsistently.",
    relatedLessonSlugs: ['api-request-and-response-design-basics', 'json-basics-for-rpgle-developers'],
    tags: ['api-design', 'request-response'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-6',
    topicId: 'integration-modernization',
    title: 'IFS and API Payloads',
    question: "Why might an integration built on IBM i use the IFS to temporarily store an API's request or response payload?",
    type: 'multiple-choice',
    options: [
      'The IFS provides a convenient stream-file location to stage or log a JSON payload during processing, separate from native database objects.',
      'API payloads must always be stored in the IFS before they can be parsed.',
      'The IFS is required to establish an HTTP connection.',
      'Native database files cannot hold any text data, so the IFS is the only option.',
    ],
    correctAnswer:
      'The IFS provides a convenient stream-file location to stage or log a JSON payload during processing, separate from native database objects.',
    explanation:
      'The IFS is a practical staging/logging location for payload data during integration work -- not a required step, but a common and useful one.',
    relatedLessonSlugs: ['ifs-and-api-payload-files', 'logging-integration-requests-and-responses'],
    tags: ['ifs', 'integration', 'payloads'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-7',
    topicId: 'integration-modernization',
    title: 'Calling an External API from IBM i',
    question: 'What does an IBM i program generally need in order to call an external (non-IBM i) REST API?',
    type: 'multiple-choice',
    options: [
      'A way to make an outbound HTTP request plus logic to build the request and parse the JSON response.',
      'Nothing beyond standard RPGLE file I/O -- calling an external API is identical to reading a physical file.',
      'A dedicated physical network cable per API being called.',
      'The external API must be rewritten in RPGLE first.',
    ],
    correctAnswer: 'A way to make an outbound HTTP request plus logic to build the request and parse the JSON response.',
    explanation:
      'Calling out to an external API is a different pattern from native file I/O -- it needs an HTTP mechanism plus request/response handling logic.',
    relatedLessonSlugs: ['calling-external-apis-from-ibm-i', 'json-parsing-concepts-in-rpgle'],
    tags: ['integration', 'external-apis'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-8',
    topicId: 'integration-modernization',
    title: 'Exposing IBM i Logic as an API',
    question:
      'What is typically the most practical way to expose existing IBM i business logic (already implemented in RPGLE) as an API, without a full rewrite?',
    type: 'multiple-choice',
    options: [
      "Wrap the existing logic in a service program or callable procedure, then front it with an HTTP layer that translates requests into calls to that existing logic and its output into an HTTP response.",
      'Delete the existing RPGLE logic and write it again from scratch in a web framework.',
      'APIs cannot be built on top of existing RPGLE logic under any circumstances.',
      'Only CLLE programs can be exposed as APIs, never RPGLE.',
    ],
    correctAnswer:
      "Wrap the existing logic in a service program or callable procedure, then front it with an HTTP layer that translates requests into calls to that existing logic and its output into an HTTP response.",
    explanation:
      'This wrap-and-front-end approach is exactly the modernization pattern this batch covers: reuse existing logic rather than rewriting it.',
    relatedLessonSlugs: ['exposing-ibm-i-logic-as-an-api', 'modern-ibm-i-development-overview'],
    tags: ['api', 'modernization', 'service-programs'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-9',
    topicId: 'integration-modernization',
    title: 'Common Integration Mistake',
    question:
      'A new integration works fine in testing but starts failing intermittently once a second system also starts calling it heavily. What common IBM i integration mistake does this scenario suggest should be checked?',
    type: 'scenario',
    correctAnswer:
      'Not accounting for concurrent access/volume -- e.g. object locks or resource contention -- which is a commonly-cited integration mistake once real, concurrent traffic starts hitting the integration.',
    explanation:
      'Integrations tested with only a single caller often miss issues that only appear under concurrent load, such as lock contention or assumptions that break once multiple systems call in around the same time.',
    relatedLessonSlugs: ['common-ibm-i-integration-mistakes', 'debugging-api-integration-issues'],
    tags: ['integration', 'troubleshooting', 'common-mistakes'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-10',
    topicId: 'integration-modernization',
    title: 'API Error Handling',
    question:
      "Why is it better for an API to return a specific, meaningful status code and message on failure, rather than always returning a generic '200 OK' with an error buried in the body text?",
    type: 'multiple-choice',
    options: [
      "Calling systems and standard tooling rely on the HTTP status code itself to detect failure automatically; hiding errors inside a '200 OK' response can cause callers to treat a failed request as if it succeeded.",
      'HTTP status codes have no effect on how calling systems behave.',
      'Generic 200 responses are always preferred because they are simpler to generate.',
      'Meaningful status codes are only relevant for internal APIs, never external ones.',
    ],
    correctAnswer:
      "Calling systems and standard tooling rely on the HTTP status code itself to detect failure automatically; hiding errors inside a '200 OK' response can cause callers to treat a failed request as if it succeeded.",
    explanation:
      'Status codes are the primary signal most HTTP tooling checks -- burying an error inside a 200 response defeats that mechanism and risks silent failures downstream.',
    relatedLessonSlugs: ['api-error-handling-basics', 'http-methods-and-status-codes-for-ibm-i-developers'],
    tags: ['api', 'error-handling', 'status-codes'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-11',
    topicId: 'integration-modernization',
    title: 'Securing APIs',
    question: 'At a beginner level, what is a basic but essential security consideration for an API exposed from IBM i?',
    type: 'multiple-choice',
    options: [
      "Confirming who is making the request (authentication) and whether they're allowed to do what they're asking (authorization), rather than assuming any caller who can reach the endpoint should be trusted.",
      'Security is unnecessary as long as the API is only used internally.',
      'HTTPS/TLS provides authentication automatically, so no other check is needed.',
      'API security is only a concern for the network team, never for the developer writing the endpoint.',
    ],
    correctAnswer:
      "Confirming who is making the request (authentication) and whether they're allowed to do what they're asking (authorization), rather than assuming any caller who can reach the endpoint should be trusted.",
    explanation:
      'Reachability is not the same as trust -- authentication and authorization are the baseline checks that keep an API from acting on behalf of just anyone who can send it a request.',
    relatedLessonSlugs: ['securing-ibm-i-apis-at-a-beginner-level', 'why-apis-matter-on-ibm-i'],
    tags: ['api', 'security', 'authentication'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-12',
    topicId: 'integration-modernization',
    title: 'Batch vs Real-Time Integration',
    question:
      'A nightly file of thousands of orders needs to be sent to a partner system, versus a single order lookup needed instantly while a customer is on a support call. Which integration approach fits each, and why?',
    type: 'scenario',
    correctAnswer:
      "The nightly bulk transfer fits batch integration (processing many records together on a schedule); the instant lookup fits real-time integration (an immediate request/response for one record) -- forcing either into the other's pattern creates unnecessary complexity or delay.",
    explanation:
      'Choosing batch vs real-time should match the actual timing and volume needs of the use case: bulk, non-urgent transfers fit batch; single, time-sensitive lookups fit real-time.',
    relatedLessonSlugs: ['batch-vs-real-time-integration', 'why-apis-matter-on-ibm-i'],
    tags: ['integration', 'batch', 'real-time'],
    difficulty: 'intermediate',
  },
  {
    id: 'apiint-13',
    topicId: 'integration-modernization',
    title: 'Debugging an API Integration Issue',
    question:
      "An integration is returning unexpected data, and the RPGLE logic looks correct on its own. What's a good first troubleshooting step specific to an API/integration context, before assuming the business logic is wrong?",
    type: 'multiple-choice',
    options: [
      'Log and inspect the actual request and response payloads (and status code) as they cross the integration boundary, to confirm what was actually sent and received.',
      'Immediately rewrite the RPGLE logic without checking anything else.',
      'Assume the issue must be a hardware problem.',
      'Skip investigation and just retry the call repeatedly until it works.',
    ],
    correctAnswer:
      'Log and inspect the actual request and response payloads (and status code) as they cross the integration boundary, to confirm what was actually sent and received.',
    explanation:
      "Integration bugs often live at the boundary, not in the business logic -- confirming what actually crossed that boundary is a faster, more targeted first step than assuming the logic itself is wrong.",
    relatedLessonSlugs: ['debugging-api-integration-issues', 'logging-integration-requests-and-responses'],
    tags: ['debugging', 'integration', 'api'],
    difficulty: 'intermediate',
  },

  // --- Advanced SQL for IBM i (added in PR #125) ---
  {
    id: 'asql-1',
    topicId: 'advanced-sql',
    title: 'DDL vs DML',
    question: 'What is the difference between DDL and DML in SQL, using CREATE TABLE and INSERT as examples?',
    type: 'multiple-choice',
    options: [
      'CREATE TABLE is DDL (Data Definition Language) -- it defines the structure of database objects; INSERT is DML (Data Manipulation Language) -- it works with the data inside those objects.',
      'DDL and DML are two names for exactly the same set of SQL statements.',
      'DDL only applies to DDS-described files, never SQL tables.',
      'DML statements can create new tables, just like DDL.',
    ],
    correctAnswer:
      'CREATE TABLE is DDL (Data Definition Language) -- it defines the structure of database objects; INSERT is DML (Data Manipulation Language) -- it works with the data inside those objects.',
    explanation:
      'DDL shapes the structure (tables, indexes, views); DML works with the rows inside that structure -- keeping the two straight helps when reading SQL documentation or error messages.',
    relatedLessonSlugs: ['ddl-on-ibm-i-create-alter-drop-table', 'basic-select-on-ibm-i'],
    tags: ['sql', 'ddl', 'dml'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-2',
    topicId: 'advanced-sql',
    title: 'Indexes and Views',
    question: "What's the difference between a SQL index and a SQL view on Db2 for i?",
    type: 'multiple-choice',
    options: [
      'An index speeds up how the database finds rows for certain queries; a view is a stored, named query that presents data without duplicating the underlying data.',
      'An index and a view both physically duplicate all the underlying table\'s data.',
      'A view is used only for performance tuning, never for simplifying a query.',
      'An index is required before a table can contain any data.',
    ],
    correctAnswer:
      'An index speeds up how the database finds rows for certain queries; a view is a stored, named query that presents data without duplicating the underlying data.',
    explanation:
      'An index is a performance structure; a view is a saved query definition -- neither one duplicates the base data the way a full copy would.',
    relatedLessonSlugs: ['sql-indexes-and-views-on-db2-for-i', 'access-paths-and-why-they-matter'],
    tags: ['sql', 'indexes', 'views'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-3',
    topicId: 'advanced-sql',
    title: 'Constraints',
    question:
      'A CUSTOMER table has a CUSTNO column that must be unique, and an ORDERS table with a CUSTNO column that must always match a real customer. Which constraints fit each requirement?',
    type: 'scenario',
    correctAnswer:
      'CUSTOMER.CUSTNO should have a UNIQUE (or PRIMARY KEY) constraint; ORDERS.CUSTNO should have a FOREIGN KEY constraint referencing CUSTOMER.CUSTNO.',
    explanation:
      'PRIMARY KEY/UNIQUE constraints enforce uniqueness within one table; FOREIGN KEY constraints enforce that a value in one table corresponds to a real value in another table -- exactly what this scenario needs.',
    relatedLessonSlugs: ['constraints-on-ibm-i-primary-foreign-unique-check', 'ddl-on-ibm-i-create-alter-drop-table'],
    tags: ['sql', 'constraints', 'data-integrity'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-4',
    topicId: 'advanced-sql',
    title: 'SQL Stored Procedures',
    question: 'What is an SQL (SQL PL) stored procedure, at a basic level?',
    type: 'multiple-choice',
    options: [
      'A named, precompiled block of SQL and SQL PL control-flow logic stored in the database that can be called to run a sequence of operations.',
      'A view that automatically updates itself on a schedule.',
      'A synonym for a database trigger.',
      'A type of index used only for text search.',
    ],
    correctAnswer: 'A named, precompiled block of SQL and SQL PL control-flow logic stored in the database that can be called to run a sequence of operations.',
    explanation:
      'A stored procedure packages multiple SQL statements and control-flow logic behind one callable name, rather than sending each statement separately.',
    relatedLessonSlugs: ['sql-stored-procedures-on-ibm-i', 'external-stored-procedures-with-rpgle'],
    tags: ['sql', 'stored-procedures'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-5',
    topicId: 'advanced-sql',
    title: 'External Stored Procedures',
    question: 'How does an external stored procedure differ from an SQL (SQL PL) stored procedure?',
    type: 'multiple-choice',
    options: [
      "An external stored procedure's logic lives in a separately compiled program (such as an RPGLE program), which SQL calls; an SQL PL stored procedure's logic is written directly in SQL PL and stored inside the database.",
      'External stored procedures cannot accept parameters.',
      'There is no real difference -- both terms describe the exact same mechanism.',
      'External stored procedures can only be called from CLLE, never from SQL.',
    ],
    correctAnswer:
      "An external stored procedure's logic lives in a separately compiled program (such as an RPGLE program), which SQL calls; an SQL PL stored procedure's logic is written directly in SQL PL and stored inside the database.",
    explanation:
      'The distinction is where the logic lives and is written -- an external stored procedure delegates to an existing compiled program, while SQL PL stored procedures are self-contained in the database.',
    relatedLessonSlugs: ['external-stored-procedures-with-rpgle', 'sql-stored-procedures-on-ibm-i'],
    tags: ['sql', 'stored-procedures', 'rpgle'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-6',
    topicId: 'advanced-sql',
    title: 'Triggers',
    question: 'What does a database trigger do, conceptually?',
    type: 'multiple-choice',
    options: [
      'It automatically runs a defined block of logic in response to a specific database event (like an INSERT, UPDATE, or DELETE) on a table, without the application explicitly calling it.',
      'It is a manual command a user runs on demand from ACS.',
      'It only runs once, when the table is first created.',
      'It replaces the need for constraints entirely.',
    ],
    correctAnswer:
      'It automatically runs a defined block of logic in response to a specific database event (like an INSERT, UPDATE, or DELETE) on a table, without the application explicitly calling it.',
    explanation:
      'A trigger fires automatically based on a database event, which is exactly what makes it useful (and risky) -- it runs even if the calling application never explicitly asked it to.',
    relatedLessonSlugs: ['sql-triggers-on-ibm-i', 'constraints-on-ibm-i-primary-foreign-unique-check'],
    tags: ['sql', 'triggers', 'data-integrity'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-7',
    topicId: 'advanced-sql',
    title: 'User-Defined Functions',
    question: 'What is a UDF (user-defined function) used for in SQL on IBM i?',
    type: 'multiple-choice',
    options: [
      'Encapsulating a reusable calculation or transformation so it can be called directly inside SQL statements, rather than repeating the same logic in every query.',
      'Creating a brand-new SQL keyword that changes the language\'s syntax.',
      'Replacing the need for any table in the database.',
      'Only formatting output for printer files.',
    ],
    correctAnswer:
      'Encapsulating a reusable calculation or transformation so it can be called directly inside SQL statements, rather than repeating the same logic in every query.',
    explanation:
      'A UDF is reusable logic callable from within SQL itself -- similar in spirit to a stored procedure, but designed to be used as part of a SELECT or WHERE clause.',
    relatedLessonSlugs: ['user-defined-functions-on-ibm-i', 'sql-stored-procedures-on-ibm-i'],
    tags: ['sql', 'udf', 'functions'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-8',
    topicId: 'advanced-sql',
    title: 'SQLCA, SQLCODE, and SQLSTATE',
    question: 'After running an embedded SQL statement, SQLCODE comes back as 100. What does that typically mean?',
    type: 'multiple-choice',
    options: [
      "No row was found matching the query (a common 'not found' condition), not necessarily an error in the traditional sense.",
      'The statement caused a fatal, unrecoverable database error.',
      'The statement succeeded and returned exactly one row.',
      'SQLCODE 100 always means a syntax error in the SQL statement.',
    ],
    correctAnswer:
      "No row was found matching the query (a common 'not found' condition), not necessarily an error in the traditional sense.",
    explanation:
      'SQLCODE 100 is one of the most common values a developer sees -- it signals no matching row, a normal condition to handle deliberately, not a failure to panic over.',
    relatedLessonSlugs: ['sqlca-sqlcode-and-sqlstate-in-depth', 'handling-no-row-found-in-sqlrpgle'],
    tags: ['sql', 'sqlcode', 'sqlstate'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-9',
    topicId: 'advanced-sql',
    title: 'Static vs Dynamic SQL',
    question: "What's the core difference between static SQL and dynamic SQL in an RPGLE program?",
    type: 'multiple-choice',
    options: [
      'Static SQL statements are fixed at compile time and precompiled; dynamic SQL statements are built and prepared at run time, allowing the actual SQL text to vary based on runtime conditions.',
      'Static SQL can only run SELECT statements; dynamic SQL can only run INSERT statements.',
      'Dynamic SQL is always faster than static SQL in every scenario.',
      'Static and dynamic SQL produce result sets in incompatible formats.',
    ],
    correctAnswer:
      'Static SQL statements are fixed at compile time and precompiled; dynamic SQL statements are built and prepared at run time, allowing the actual SQL text to vary based on runtime conditions.',
    explanation:
      'The difference is when the SQL text is known: static SQL is fixed at compile time; dynamic SQL is assembled and prepared while the program is running.',
    relatedLessonSlugs: ['static-sql-vs-dynamic-sql-on-ibm-i', 'sql-precompilation-with-crtsqlrpgi'],
    tags: ['sql', 'static-sql', 'dynamic-sql'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-10',
    topicId: 'advanced-sql',
    title: 'CRTSQLRPGI',
    question: 'What does CRTSQLRPGI do for a program containing embedded SQL statements?',
    type: 'multiple-choice',
    options: [
      'It precompiles the embedded SQL into a form the RPGLE compiler can process, then compiles the resulting program.',
      'It only compiles the SQL statements, ignoring the RPGLE logic in the same source.',
      'It is only used for CLLE, never RPGLE.',
      'It replaces the need for a database entirely.',
    ],
    correctAnswer: 'It precompiles the embedded SQL into a form the RPGLE compiler can process, then compiles the resulting program.',
    explanation:
      'CRTSQLRPGI is a two-stage process rolled into one command: SQL precompilation followed by the regular RPGLE compile.',
    relatedLessonSlugs: ['sql-precompilation-with-crtsqlrpgi', 'what-is-sqlrpgle'],
    tags: ['sql', 'crtsqlrpgi', 'precompilation'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-11',
    topicId: 'advanced-sql',
    title: 'Query Optimization Basics',
    question:
      'A query filtering on a CUSTNO column that has no useful index is running slowly on a large table. What is a reasonable first step to investigate improving its performance?',
    type: 'scenario',
    correctAnswer:
      'Consider whether an appropriate index (access path) on CUSTNO would let the database find matching rows directly, instead of scanning the whole table -- indexing is usually the first, most impactful thing to check.',
    explanation:
      'Query performance problems on large tables very often come down to whether the database has a useful access path for the columns being filtered or joined on.',
    relatedLessonSlugs: ['query-optimization-basics-on-db2-for-i', 'access-paths-and-why-they-matter'],
    tags: ['sql', 'query-optimization', 'indexes'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-12',
    topicId: 'advanced-sql',
    title: 'SQE vs CQE',
    question: 'At a beginner-friendly level, what is the main distinction between SQE (SQL Query Engine) and CQE (Classic Query Engine) on IBM i?',
    type: 'multiple-choice',
    options: [
      'They are two different query engines Db2 for i can use to process a query, with SQE being the newer engine generally preferred for SQL-based access.',
      'SQE and CQE are two names for the exact same underlying engine.',
      'CQE only works with DDS files, and SQE only works with journaled files.',
      'SQE is a tool for creating displays, unrelated to query processing.',
    ],
    correctAnswer:
      'They are two different query engines Db2 for i can use to process a query, with SQE being the newer engine generally preferred for SQL-based access.',
    explanation:
      'SQE and CQE are alternative internal engines for running a query -- knowing they exist helps make sense of performance discussions and IBM documentation.',
    relatedLessonSlugs: ['sqe-vs-cqe-at-a-beginner-friendly-level', 'query-optimization-basics-on-db2-for-i'],
    tags: ['sql', 'sqe', 'cqe'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-13',
    topicId: 'advanced-sql',
    title: 'Encoded Vector Indexes',
    question: 'What is an Encoded Vector Index (EVI) generally well-suited for, compared to a traditional index?',
    type: 'multiple-choice',
    options: [
      'Columns with a relatively small number of distinct values (low cardinality), where an EVI can represent matching rows compactly and efficiently for certain queries.',
      'Columns that are guaranteed to have a unique value in every row.',
      'Replacing primary key constraints entirely.',
      'Storing free-form text documents.',
    ],
    correctAnswer:
      'Columns with a relatively small number of distinct values (low cardinality), where an EVI can represent matching rows compactly and efficiently for certain queries.',
    explanation:
      'EVIs are a specialized index type most useful for low-cardinality columns -- a different fit than a traditional index built for high-cardinality, more unique-valued columns.',
    relatedLessonSlugs: ['encoded-vector-indexes-introduction', 'sql-indexes-and-views-on-db2-for-i'],
    tags: ['sql', 'evi', 'indexes'],
    difficulty: 'intermediate',
  },
  {
    id: 'asql-14',
    topicId: 'advanced-sql',
    title: 'Common Advanced SQL Mistake',
    question:
      'A developer adds a trigger to a heavily-used table without testing it against high-volume batch inserts first, and a nightly batch job that used to finish quickly starts running much longer. What common advanced-SQL mistake does this illustrate?',
    type: 'scenario',
    correctAnswer:
      'Not accounting for the performance impact a trigger has when it fires on every single row of a large batch operation -- a commonly-cited mistake once triggers, procedures, or constraints are added to tables involved in bulk processing.',
    explanation:
      'Triggers run per affected row, so adding non-trivial logic to a trigger on a table involved in large batch operations can quietly turn a fast bulk load into a much slower one.',
    relatedLessonSlugs: ['common-advanced-sql-mistakes-on-ibm-i', 'sql-triggers-on-ibm-i'],
    tags: ['sql', 'triggers', 'common-mistakes'],
    difficulty: 'intermediate',
  },

  // --- IBM i Security (added in PR #125) ---
  {
    id: 'sec-1',
    topicId: 'security',
    title: 'User Profiles vs Group Profiles',
    question:
      'What is the main practical benefit of assigning users to a group profile rather than only managing authority per individual user profile?',
    type: 'multiple-choice',
    options: [
      'Authority can be granted once to the group profile, and every member inherits it -- avoiding repeating the same authority grant for each individual user.',
      'Group profiles remove the need for individual user profiles entirely.',
      'Group profiles are only used for sign-on screens, not authority.',
      'A user can never belong to more than one group.',
    ],
    correctAnswer:
      'Authority can be granted once to the group profile, and every member inherits it -- avoiding repeating the same authority grant for each individual user.',
    explanation:
      'Group profiles exist mainly to simplify authority management -- one grant to the group instead of repeating the same grant across many individual users.',
    relatedLessonSlugs: ['user-profiles-and-group-profiles-on-ibm-i', 'authorities-and-object-access-basics'],
    tags: ['security', 'user-profiles', 'group-profiles'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-2',
    topicId: 'security',
    title: 'Object Authority',
    question: "What does 'object authority' fundamentally control on IBM i?",
    type: 'multiple-choice',
    options: [
      'What operations (like read, change, or delete) a specific user or group is allowed to perform against a specific object.',
      "Which library a user's jobs run in.",
      'How fast a program executes.',
      'Which programming language an object was written in.',
    ],
    correctAnswer:
      'What operations (like read, change, or delete) a specific user or group is allowed to perform against a specific object.',
    explanation:
      'Object authority is the core mechanism that decides who can do what to a specific object -- everything else in IBM i security builds on this concept.',
    relatedLessonSlugs: ['object-authority-in-depth', 'authorities-and-object-access-basics'],
    tags: ['security', 'object-authority'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-3',
    topicId: 'security',
    title: 'Public vs Private Authority',
    question: "What's the difference between an object's public authority and a specific user's private authority to that object?",
    type: 'multiple-choice',
    options: [
      "Public authority applies to any user who doesn't have a more specific private (or group) authority granted; private authority is a grant made directly to one specific user or group.",
      'Public authority only matters for objects owned by QSECOFR.',
      'Private authority always overrides public authority no matter what it grants.',
      'Public and private authority are two names for the same setting.',
    ],
    correctAnswer:
      "Public authority applies to any user who doesn't have a more specific private (or group) authority granted; private authority is a grant made directly to one specific user or group.",
    explanation:
      'Public authority is the fallback for anyone without a more specific grant; private authority is a targeted grant that can be more or less permissive than the public setting.',
    relatedLessonSlugs: ['public-authority-and-private-authority-in-depth', 'object-authority-in-depth'],
    tags: ['security', 'public-authority', 'private-authority'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-4',
    topicId: 'security',
    title: 'Authorization Lists',
    question: 'Why might a shop use an authorization list instead of granting authority to each object individually?',
    type: 'multiple-choice',
    options: [
      'An authorization list lets many objects share one common list of user authorities -- changing the list once updates authority for every object secured by it.',
      'Authorization lists can only secure one object at a time.',
      'Authorization lists remove the need for object ownership.',
      'Authorization lists are only used for IFS objects, never native objects.',
    ],
    correctAnswer:
      'An authorization list lets many objects share one common list of user authorities -- changing the list once updates authority for every object secured by it.',
    explanation:
      'Authorization lists solve the same repetitive-maintenance problem as group profiles, but at the object side: one list, many secured objects.',
    relatedLessonSlugs: ['authorization-lists-on-ibm-i', 'object-authority-in-depth'],
    tags: ['security', 'authorization-lists'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-5',
    topicId: 'security',
    title: 'Special Authorities',
    question:
      'A user profile is granted *ALLOBJ special authority so they can troubleshoot an issue faster. What real risk does this introduce?',
    type: 'scenario',
    correctAnswer:
      '*ALLOBJ grants access to essentially all objects on the system regardless of their individual object authority settings -- if left in place longer than needed, it creates unnecessary risk far beyond the original troubleshooting task.',
    explanation:
      'Special authorities like *ALLOBJ operate above normal object-level authority checks, which is exactly why they should be granted narrowly and temporarily, following least-privilege practice.',
    relatedLessonSlugs: ['special-authorities-explained', 'ibm-i-security-best-practices-for-developers'],
    tags: ['security', 'special-authorities', 'least-privilege'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-6',
    topicId: 'security',
    title: 'Adopted Authority',
    question: "What does 'adopted authority' mean when a program runs?",
    type: 'multiple-choice',
    options: [
      "The program temporarily runs using the authority of the program's owner (or a designated profile), in addition to or instead of the authority of the user who called it.",
      'The user calling the program adopts a brand new user profile permanently.',
      'Adopted authority only applies to CLLE programs, never RPGLE.',
      'It means the program automatically gets *SECOFR authority regardless of who owns it.',
    ],
    correctAnswer:
      "The program temporarily runs using the authority of the program's owner (or a designated profile), in addition to or instead of the authority of the user who called it.",
    explanation:
      "Adopted authority is a deliberate mechanism to let a program perform actions its caller couldn't do directly -- powerful, and worth using carefully.",
    relatedLessonSlugs: ['adopted-authority-basics', 'special-authorities-explained'],
    tags: ['security', 'adopted-authority'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-7',
    topicId: 'security',
    title: 'Investigating an Authority Failure',
    question:
      "A user reports 'not authorized' trying to run a program that used to work. What's a reasonable first step to investigate, beyond just granting *ALLOBJ to make the error go away?",
    type: 'scenario',
    correctAnswer:
      "Look at exactly which object and authority the failure message identifies, and check that user's or group's actual current authority to that object -- rather than immediately granting broad, unnecessary authority.",
    explanation:
      'Authority failure messages are specific about which object and authority were involved -- investigating that detail leads to a targeted fix, whereas granting *ALLOBJ just to silence the error undermines least-privilege practice.',
    relatedLessonSlugs: ['investigating-authority-failures-in-depth', 'object-authority-in-depth'],
    tags: ['security', 'troubleshooting', 'authority-failures'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-8',
    topicId: 'security',
    title: 'QSECURITY System Value',
    question: 'What does the QSECURITY system value control, at a conceptual level?',
    type: 'multiple-choice',
    options: [
      'The overall security level the system enforces (how strictly user profiles and object authority are required and checked), a system-wide setting rather than a per-object one.',
      'The password a specific user must use to sign on.',
      "Which library list a job starts with.",
      'How many concurrent jobs the system can run.',
    ],
    correctAnswer:
      'The overall security level the system enforces (how strictly user profiles and object authority are required and checked), a system-wide setting rather than a per-object one.',
    explanation:
      'QSECURITY sets the baseline security posture for the whole system -- a foundational setting that everything else (object authority, special authorities) operates within.',
    relatedLessonSlugs: ['qsecurity-system-value-explained', 'ibm-i-security-best-practices-for-developers'],
    tags: ['security', 'qsecurity', 'system-values'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-9',
    topicId: 'security',
    title: 'QAUDJRN',
    question: 'What is QAUDJRN used for?',
    type: 'multiple-choice',
    options: [
      "It's the system's security audit journal, recording security-relevant events (like authority failures or profile changes) for later review.",
      "It's a regular database file used to store customer orders.",
      'It automatically prevents all unauthorized access attempts.',
      "It's a synonym for a save file used during backups.",
    ],
    correctAnswer:
      "It's the system's security audit journal, recording security-relevant events (like authority failures or profile changes) for later review.",
    explanation:
      'QAUDJRN is specifically about recording security-relevant events for review -- a distinct purpose from journaling a business application\'s own database changes.',
    relatedLessonSlugs: ['auditing-basics-and-qaudjrn-overview', 'qsecurity-system-value-explained'],
    tags: ['security', 'qaudjrn', 'auditing'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-10',
    topicId: 'security',
    title: 'Exit Points and Exit Programs',
    question: 'What role do exit points and exit programs play in IBM i security?',
    type: 'multiple-choice',
    options: [
      'Exit points are predefined places in system functions (like FTP or ODBC access) where a shop can register its own exit program to run custom checks before the function proceeds.',
      'Exit points are a type of database index.',
      'Exit programs replace the need for object authority entirely.',
      'Exit points only exist for RPGLE compilation, not system access.',
    ],
    correctAnswer:
      'Exit points are predefined places in system functions (like FTP or ODBC access) where a shop can register its own exit program to run custom checks before the function proceeds.',
    explanation:
      'Exit points let a shop add its own logic (like extra logging or access checks) at defined moments in system functions -- without modifying the system function itself.',
    relatedLessonSlugs: ['exit-points-and-exit-programs-overview', 'auditing-basics-and-qaudjrn-overview'],
    tags: ['security', 'exit-points'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-11',
    topicId: 'security',
    title: 'IFS Security',
    question: 'Does object authority still apply to objects stored in the IFS, the same way it applies to native library objects?',
    type: 'multiple-choice',
    options: [
      'Yes -- IFS objects like stream files and directories have their own authority settings that need to be considered, following similar authority concepts to native objects.',
      'No -- the IFS has no security model at all; anyone who can sign on can access every IFS file.',
      'IFS security only applies to files created by IBM-supplied programs.',
      'IFS objects automatically inherit *ALLOBJ authority for every user.',
    ],
    correctAnswer:
      'Yes -- IFS objects like stream files and directories have their own authority settings that need to be considered, following similar authority concepts to native objects.',
    explanation:
      'The IFS looks different from a library-based structure, but authority concepts still apply -- a common misconception is treating the IFS as unsecured by default.',
    relatedLessonSlugs: ['ifs-security-basics', 'ifs-basics-for-ibm-i-beginners'],
    tags: ['security', 'ifs'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-12',
    topicId: 'security',
    title: 'Digital Certificates and TLS',
    question: 'At a conceptual level, what problem do digital certificates and TLS solve for IBM i-hosted APIs?',
    type: 'multiple-choice',
    options: [
      "They let a client verify it's really talking to the expected server and encrypt the data in transit, protecting against eavesdropping and impersonation over the network.",
      'They replace the need for object authority on the server.',
      'They only matter for internal, same-system communication.',
      'TLS is only relevant to 5250 terminal sessions, never HTTP-based APIs.',
    ],
    correctAnswer:
      "They let a client verify it's really talking to the expected server and encrypt the data in transit, protecting against eavesdropping and impersonation over the network.",
    explanation:
      'TLS and certificates protect the connection itself -- confirming identity and encrypting traffic -- which is a different concern from, and complementary to, object-level authority.',
    relatedLessonSlugs: ['digital-certificates-and-tls-concepts-on-ibm-i', 'securing-ibm-i-apis-at-a-beginner-level'],
    tags: ['security', 'tls', 'certificates'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-13',
    topicId: 'security',
    title: 'RCAC and Field Procedures',
    question:
      'What do Row and Column Access Control (RCAC) and Field Procedures (FIELDPROC) let a shop do, conceptually, that plain object authority cannot?',
    type: 'multiple-choice',
    options: [
      'Control access or transform data at a finer grain than the whole object -- for example, restricting which rows a user can see, or automatically masking a column\'s values.',
      'They are two names for the exact same object-level authority setting.',
      'They only apply to DDS-described files, never SQL tables.',
      'They remove the need for any user profile authority checks.',
    ],
    correctAnswer:
      'Control access or transform data at a finer grain than the whole object -- for example, restricting which rows a user can see, or automatically masking a column\'s values.',
    explanation:
      "Plain object authority is all-or-nothing for the whole object; RCAC and FIELDPROC operate at the row and column level, a genuinely finer-grained capability.",
    relatedLessonSlugs: ['rcac-and-field-procedures-overview', 'object-authority-in-depth'],
    tags: ['security', 'rcac', 'fieldproc'],
    difficulty: 'intermediate',
  },
  {
    id: 'sec-14',
    topicId: 'security',
    title: 'Least Privilege in Practice',
    question:
      "Two developers explain why a batch job's user profile shouldn't have *ALLOBJ special authority. Developer A says: 'It's just a best practice everyone follows.' Developer B says: 'If that job's authority is ever misused or compromised, *ALLOBJ would expose every object on the system, not just what the job actually needs.' Which explanation better demonstrates understanding of least privilege, and why?",
    type: 'scenario',
    correctAnswer:
      "Developer B's explanation is stronger -- it explains the actual risk being reduced (blast radius if something goes wrong), rather than just citing the practice as a rule to follow without reasoning through why it matters.",
    explanation:
      'Least privilege is valuable because it limits the damage possible if something does go wrong, not because it is a rule. A strong answer explains that reasoning; a weak answer just restates the rule.',
    relatedLessonSlugs: ['ibm-i-security-best-practices-for-developers', 'special-authorities-explained'],
    tags: ['security', 'least-privilege', 'best-practices'],
    difficulty: 'intermediate',
  },

  // --- Journaling & Commitment Control (added in PR #125) ---
  {
    id: 'jrn-1',
    topicId: 'journaling-commitment-control',
    title: 'Journal vs Journal Receiver',
    question: "What's the relationship between a journal and a journal receiver on IBM i?",
    type: 'multiple-choice',
    options: [
      'The journal is the object that journaled changes are directed to; the journal receiver is where journal entries are physically stored, and receivers can be swapped over time as they fill up.',
      'A journal and a journal receiver are two names for the exact same object.',
      'A journal receiver is a type of save file used only during a restore.',
      'A journal can only ever have exactly one receiver for its entire lifetime with no ability to change it.',
    ],
    correctAnswer:
      'The journal is the object that journaled changes are directed to; the journal receiver is where journal entries are physically stored, and receivers can be swapped over time as they fill up.',
    explanation:
      'The journal is a stable, named target for journaled changes; the underlying receiver storing those entries can be changed out over time without affecting the journal itself.',
    relatedLessonSlugs: ['what-is-journaling-on-ibm-i', 'journal-receivers-explained'],
    tags: ['journaling', 'journal-receivers'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-2',
    topicId: 'journaling-commitment-control',
    title: 'Starting Journaling with STRJRNPF',
    question: 'What does STRJRNPF do?',
    type: 'multiple-choice',
    options: [
      'It starts journaling for a specific physical file, so changes made to that file going forward are recorded as journal entries in the associated journal.',
      'It permanently deletes a journal receiver.',
      'It restores a physical file from a save file.',
      'It is only used to view journal entries, not start journaling.',
    ],
    correctAnswer:
      'It starts journaling for a specific physical file, so changes made to that file going forward are recorded as journal entries in the associated journal.',
    explanation:
      'STRJRNPF is the command that actually turns journaling on for a file -- without it, no journal entries are recorded for that file, no matter how the journal itself is configured.',
    relatedLessonSlugs: ['starting-journaling-with-strjrnpf', 'what-is-journaling-on-ibm-i'],
    tags: ['journaling', 'strjrnpf'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-3',
    topicId: 'journaling-commitment-control',
    title: 'Viewing Journal Entries',
    question: 'How would a developer look at what changes have actually been journaled for a file?',
    type: 'multiple-choice',
    options: [
      'Use DSPJRN against the journal to view recorded entries, such as which records were added, changed, or deleted and when.',
      'Open the physical file directly with CHAIN to see the journal entries mixed into the data.',
      'Journal entries cannot be viewed after they are written; they exist only for internal system use.',
      'Use WRKOBJLCK to see journal entries.',
    ],
    correctAnswer:
      'Use DSPJRN against the journal to view recorded entries, such as which records were added, changed, or deleted and when.',
    explanation:
      'DSPJRN is the tool for actually reviewing what a journal has recorded -- journal entries are meant to be inspectable, not hidden internal-only data.',
    relatedLessonSlugs: ['viewing-journal-entries-basics', 'journal-receivers-explained'],
    tags: ['journaling', 'dspjrn'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-4',
    topicId: 'journaling-commitment-control',
    title: 'Commitment Control',
    question: 'What problem does commitment control solve when a single business transaction needs to update more than one file?',
    type: 'multiple-choice',
    options: [
      'It lets a group of related database changes be treated as one all-or-nothing unit -- either every change in the group is applied, or none are.',
      'It automatically speeds up every database read operation.',
      'It replaces the need for journaling entirely.',
      'It only works for a single file, never multiple files in one transaction.',
    ],
    correctAnswer:
      'It lets a group of related database changes be treated as one all-or-nothing unit -- either every change in the group is applied, or none are.',
    explanation:
      "Commitment control's whole purpose is protecting against a half-finished multi-file update -- exactly the situation this question describes.",
    relatedLessonSlugs: ['commitment-control-overview', 'what-is-journaling-on-ibm-i'],
    tags: ['commitment-control', 'transactions'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-5',
    topicId: 'journaling-commitment-control',
    title: 'STRCMTCTL, COMMIT, and ROLLBACK',
    question: 'In a program using commitment control, what is the difference between COMMIT and ROLLBACK?',
    type: 'multiple-choice',
    options: [
      'COMMIT makes all the changes since the last commit boundary permanent; ROLLBACK undoes all of them, returning the affected data to how it was before that unit of work began.',
      'COMMIT and ROLLBACK both permanently save the changes, just using different commands.',
      'ROLLBACK permanently deletes the journal itself.',
      'COMMIT only works if STRCMTCTL was never called.',
    ],
    correctAnswer:
      'COMMIT makes all the changes since the last commit boundary permanent; ROLLBACK undoes all of them, returning the affected data to how it was before that unit of work began.',
    explanation:
      'COMMIT and ROLLBACK are the two possible outcomes of a unit of work under commitment control -- keep everything, or undo everything.',
    relatedLessonSlugs: ['strcmtctl-commit-and-rollback-basics', 'commitment-control-overview'],
    tags: ['commitment-control', 'commit', 'rollback'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-6',
    topicId: 'journaling-commitment-control',
    title: 'Journaling for Recovery',
    question: 'A file update job crashes halfway through a large update. How could journaling help investigate or recover from that, assuming the file was journaled?',
    type: 'scenario',
    correctAnswer:
      "The journal contains a record of the changes actually made before the crash, which can be reviewed (and, in a recovery scenario, potentially reapplied) -- something that wouldn't be possible from the file's current state alone.",
    explanation:
      'This is exactly why journaling matters for recovery: it preserves a history of changes independent of the file\'s final state, which a point-in-time backup alone cannot provide.',
    relatedLessonSlugs: ['journaling-for-recovery-and-auditing', 'what-is-journaling-on-ibm-i'],
    tags: ['journaling', 'recovery'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-7',
    topicId: 'journaling-commitment-control',
    title: 'Journaling for Auditing',
    question: 'Beyond recovery, why might a shop journal a table specifically for auditing purposes?',
    type: 'multiple-choice',
    options: [
      'Journal entries provide a chronological record of what changed and when, which is valuable for reviewing suspicious activity or demonstrating compliance -- a different purpose than recovery, using the same mechanism.',
      'Auditing and recovery are impossible to support with the same journal.',
      'Journaling for auditing requires a completely different command set than journaling for recovery.',
      'Only QAUDJRN can be used for auditing; regular journals cannot support it.',
    ],
    correctAnswer:
      'Journal entries provide a chronological record of what changed and when, which is valuable for reviewing suspicious activity or demonstrating compliance -- a different purpose than recovery, using the same mechanism.',
    explanation:
      'The same journal entries that support recovery also support auditing -- the mechanism is identical, but the reason someone reviews them differs.',
    relatedLessonSlugs: ['journaling-for-recovery-and-auditing', 'auditing-basics-and-qaudjrn-overview'],
    tags: ['journaling', 'auditing'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-8',
    topicId: 'journaling-commitment-control',
    title: 'Common Journaling Mistake',
    question: "A team assumes that because a file is journaled, they no longer need regular backups of it. What's wrong with that assumption?",
    type: 'scenario',
    correctAnswer:
      "Journaling records a history of changes, but it isn't a substitute for a point-in-time backup -- recovering fully typically still depends on having a base saved copy of the object to apply journal entries against.",
    explanation:
      'This is one of the most common journaling/commitment-control mistakes: journaling and backup solve related but different problems, and dropping one because the other exists creates a real recovery gap.',
    relatedLessonSlugs: ['common-journaling-and-commitment-control-mistakes', 'journaling-for-recovery-and-auditing'],
    tags: ['journaling', 'common-mistakes', 'backup'],
    difficulty: 'intermediate',
  },
  {
    id: 'jrn-9',
    topicId: 'journaling-commitment-control',
    title: 'Journaling vs Commitment Control',
    question: 'Is commitment control possible without journaling being involved at all?',
    type: 'multiple-choice',
    options: [
      "No -- commitment control on IBM i depends on journaling under the hood to track and be able to back out the changes within a unit of work.",
      'Yes -- commitment control and journaling are completely unrelated features.',
      'Journaling is only needed after commitment control has already committed a transaction.',
      'Commitment control replaces journaling entirely, making journaling unnecessary once it is enabled.',
    ],
    correctAnswer:
      "No -- commitment control on IBM i depends on journaling under the hood to track and be able to back out the changes within a unit of work.",
    explanation:
      "Commitment control's ability to roll back a unit of work relies on journaling to track what changed -- the two features are directly connected, not independent.",
    relatedLessonSlugs: ['commitment-control-overview', 'what-is-journaling-on-ibm-i'],
    tags: ['journaling', 'commitment-control'],
    difficulty: 'intermediate',
  },

  // --- Save/Restore & Object Backup (added in PR #125) ---
  {
    id: 'svrs-1',
    topicId: 'save-restore',
    title: 'SAVOBJ vs SAVLIB',
    question:
      'A developer needs to save just one program before making a risky change, not the whole library it lives in. Which command fits, and why?',
    type: 'scenario',
    correctAnswer:
      'SAVOBJ -- it saves one or more specific objects individually, which matches saving just that one program, whereas SAVLIB saves an entire library\'s contents at once.',
    explanation:
      "SAVOBJ operates at the individual-object level, exactly matching a 'save just this one thing before I change it' scenario; SAVLIB is the right tool when the goal is the whole library.",
    relatedLessonSlugs: ['savobj-and-rstobj-basics', 'savlib-and-rstlib-basics'],
    tags: ['save-restore', 'savobj', 'savlib'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-2',
    topicId: 'save-restore',
    title: 'RSTOBJ Target Library',
    question: 'When running RSTOBJ, does the restored object automatically go back to the exact same library it was originally saved from?',
    type: 'multiple-choice',
    options: [
      'Not necessarily -- RSTOBJ restores to whatever library its own parameters specify, which could be the original library or a different one, so confirming the target library deliberately matters.',
      'Yes, always -- RSTOBJ has no way to target a different library than the original.',
      'RSTOBJ can only restore to QGPL.',
      'RSTOBJ always overwrites every object in the target library, not just the one being restored.',
    ],
    correctAnswer:
      'Not necessarily -- RSTOBJ restores to whatever library its own parameters specify, which could be the original library or a different one, so confirming the target library deliberately matters.',
    explanation:
      "RSTOBJ's target is a parameter, not an automatic default back to the original -- exactly why confirming the target library before running it is a genuinely important habit.",
    relatedLessonSlugs: ['savobj-and-rstobj-basics', 'restoring-objects-safely-in-development-and-test'],
    tags: ['save-restore', 'rstobj'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-3',
    topicId: 'save-restore',
    title: 'Save Files and CRTSAVF',
    question: "Before running SAVOBJ with DEV(*SAVF) targeting a save file that doesn't exist yet, what needs to happen first?",
    type: 'multiple-choice',
    options: [
      'The save file must be created first, typically with CRTSAVF -- SAVOBJ does not create a missing save file automatically.',
      'Nothing -- SAVOBJ automatically creates any save file it is pointed at.',
      'The target library must be deleted and recreated.',
      'DSPSAVF must be run first to initialize the save file.',
    ],
    correctAnswer:
      'The save file must be created first, typically with CRTSAVF -- SAVOBJ does not create a missing save file automatically.',
    explanation:
      "A save file is just another IBM i object that needs to exist before it can be targeted -- CRTSAVF is the missing piece behind every save file used earlier in this batch.",
    relatedLessonSlugs: ['save-files-explained', 'savobj-and-rstobj-basics'],
    tags: ['save-restore', 'save-files', 'crtsavf'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-4',
    topicId: 'save-restore',
    title: 'DSPSAVF',
    question: 'What does DSPSAVF actually show you?',
    type: 'multiple-choice',
    options: [
      'Information about what a save file currently contains, such as which objects were saved into it -- not the actual application data inside those saved objects.',
      'The literal row-by-row data inside the saved database files.',
      'A live list of jobs currently using the save file.',
      'The password required to restore from that save file.',
    ],
    correctAnswer:
      'Information about what a save file currently contains, such as which objects were saved into it -- not the actual application data inside those saved objects.',
    explanation:
      'DSPSAVF is a confirmation tool -- it tells you what was saved, not a way to browse the saved data directly.',
    relatedLessonSlugs: ['save-files-explained', 'savobj-and-rstobj-basics'],
    tags: ['save-restore', 'dspsavf'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-5',
    topicId: 'save-restore',
    title: 'GO SAVE Options',
    question: 'How do GO SAVE options 21, 22, and 23 differ in scope from the everyday SAVOBJ/SAVLIB commands covered elsewhere in this batch?',
    type: 'multiple-choice',
    options: [
      'GO SAVE options operate at a much broader, whole-system or whole-environment scope and are generally an administrator\'s responsibility, unlike the object-level and library-level saves developers use day to day.',
      'GO SAVE options are just a menu shortcut for running SAVOBJ on a single object.',
      'GO SAVE options only exist for restoring, never for saving.',
      'There is no real difference -- GO SAVE options and SAVOBJ save exactly the same scope.',
    ],
    correctAnswer:
      'GO SAVE options operate at a much broader, whole-system or whole-environment scope and are generally an administrator\'s responsibility, unlike the object-level and library-level saves developers use day to day.',
    explanation:
      'GO SAVE options are a different scale entirely from the object/library saves a developer runs directly -- useful to recognize, even if a developer rarely runs them personally.',
    relatedLessonSlugs: ['go-save-options-21-22-and-23-overview', 'savlib-and-rstlib-basics'],
    tags: ['save-restore', 'go-save'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-6',
    topicId: 'save-restore',
    title: 'Restoring Safely',
    question: 'Before restoring a saved library into what should be a test environment, what should a developer confirm first, and why?',
    type: 'scenario',
    correctAnswer:
      'Confirm the exact target library (to avoid overwriting a production library with a similar name), sufficient authority to that target, and that no other users or jobs are actively using it -- since a restore replaces whatever currently exists at the target.',
    explanation:
      "A restore isn't a read-only operation -- it overwrites the target. Confirming the target library, authority, and current activity/locks beforehand is exactly the deliberate process that prevents silently overwriting the wrong thing.",
    relatedLessonSlugs: ['restoring-objects-safely-in-development-and-test', 'object-locks-basics'],
    tags: ['save-restore', 'restoring', 'safety'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-7',
    topicId: 'save-restore',
    title: 'Backup vs Journaling vs HA',
    question: 'A system has nightly backups but no journaling and no high availability. If it fails at 3pm, what is lost, and why?',
    type: 'scenario',
    correctAnswer:
      "Everything changed since the previous night's backup is lost -- a backup alone only restores to the point-in-time it was taken; without journaling, there's no ongoing change record to reapply, and without HA, there's no replicated system to fail over to.",
    explanation:
      'This scenario is exactly why backup, journaling, and HA are discussed together: each protects against a different kind of loss, and having only one of the three leaves the corresponding gap uncovered.',
    relatedLessonSlugs: ['backup-vs-journaling-vs-high-availability', 'journaling-for-recovery-and-auditing'],
    tags: ['save-restore', 'journaling', 'high-availability'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-8',
    topicId: 'save-restore',
    title: 'Common Save/Restore Mistake',
    question:
      'A developer restores a library into what they believe is their test library, but it turns out to be a similarly-named production library, silently overwriting real objects. What common mistake does this illustrate, and what habit would have prevented it?',
    type: 'scenario',
    correctAnswer:
      'The mistake is not deliberately confirming the exact target library before running the restore -- the preventing habit is treating restore as a deliberate operation with real, immediate effects, and explicitly confirming the target every time.',
    explanation:
      'This is one of the most consequential and avoidable save/restore mistakes: a restore looks routine but silently replaces whatever exists at the target, so skipping a deliberate target check is exactly the habit that needs to change.',
    relatedLessonSlugs: ['common-save-restore-mistakes', 'restoring-objects-safely-in-development-and-test'],
    tags: ['save-restore', 'common-mistakes', 'troubleshooting'],
    difficulty: 'intermediate',
  },
  {
    id: 'svrs-9',
    topicId: 'save-restore',
    title: 'Why Backup and Restore Matter for Developers',
    question: 'Why should a developer understand save and restore basics, rather than treating it as purely an administrator\'s concern?',
    type: 'multiple-choice',
    options: [
      'Developers use save/restore directly in everyday situations -- protecting their own work before a risky change, refreshing test data, or investigating why an object looks different than expected.',
      'Developers never need to run SAVOBJ, RSTOBJ, SAVLIB, or RSTLIB themselves under any circumstance.',
      'Understanding save/restore is only useful for passing a certification exam.',
      'Save and restore only matter if a shop has no system administrator at all.',
    ],
    correctAnswer:
      'Developers use save/restore directly in everyday situations -- protecting their own work before a risky change, refreshing test data, or investigating why an object looks different than expected.',
    explanation:
      'Save/restore is a genuinely everyday developer tool, not just an admin-only concern -- the whole point of this batch is recognizing and using it responsibly in normal development work.',
    relatedLessonSlugs: ['why-backup-and-restore-matter-on-ibm-i', 'common-save-restore-mistakes'],
    tags: ['save-restore', 'development'],
    difficulty: 'intermediate',
  },
]

/**
 * The first practice topic whose questions reference this lesson slug, or
 * null if no practice question links to it. Used by the lesson detail page
 * to optionally show a "Practice this topic" link -- a lesson only ever
 * needs one topic destination, so the first match is enough.
 */
export function getPracticeTopicIdForLesson(lessonSlug: string): string | null {
  const match = PRACTICE_QUESTIONS.find((q) => q.relatedLessonSlugs.includes(lessonSlug))
  return match?.topicId ?? null
}
