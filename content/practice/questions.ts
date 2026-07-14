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
export type PracticeDifficulty = 'beginner'

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
      'A partial-name search naturally fits an embedded SQL cursor with LIKE, and showing multiple matches at once naturally fits a subfile -- combining both concepts from different topics.',
    relatedLessonSlugs: ['sqlrpgle-interview-scenarios', 'understanding-rrn-in-subfile-programs'],
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
    relatedLessonSlugs: ['simple-order-list-subfile', 'understanding-rrn-in-subfile-programs'],
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
