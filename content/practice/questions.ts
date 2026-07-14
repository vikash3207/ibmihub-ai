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
