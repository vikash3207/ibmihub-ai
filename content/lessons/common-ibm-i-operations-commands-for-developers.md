# Common IBM i Operations Commands for Developers

## Learning Objective

By the end of this lesson, you will have a condensed, practical reference
for which everyday IBM i operations command to reach for, depending on
what you are trying to find out.

## Simple Explanation

This lesson group, together with the Debugging and CLLE lesson groups,
has covered several individual commands, each in its own dedicated
lesson. This lesson brings them together as a quick reference, without
re-explaining each one in full.

- **`DSPJOB`**, covered in the DSPJOB and Job Information Basics lesson:
  inspect one specific job's log, call stack, library list, and
  attributes.
- **`WRKACTJOB`**, covered in the WRKACTJOB Basics for Developers lesson:
  find and see basic status for jobs currently active on the system.
- **`WRKSBMJOB`** (Work with Submitted Jobs): see jobs specifically
  submitted with `SBMJOB`, a more focused view than `WRKACTJOB`'s broader
  list of every active job.
- **`WRKJOBQ`**, covered in the Job Queues and Output Queues lesson: see
  job queues and the batch jobs currently waiting on them.
- **`WRKOUTQ`** and **`WRKSPLF`**, covered in the Working with Output
  Queues using WRKOUTQ and Working with Spool Files using WRKSPLF
  lessons: see spool files waiting on a specific output queue, or your
  own spool files more broadly.
- **`WRKOBJLCK`**, covered in the Object Locks Basics lesson: see what
  locks currently exist on a specific object.
- **`DSPOBJD`**, covered in the Working with WRKOBJ, DSPOBJD, and WRKLIB
  lesson: see detailed descriptive information about one specific,
  already-identified object.
- **`DSPLIBL`**, covered in the Library List Explained in Depth lesson:
  see your own current library list, in actual search order.

## Why It Matters

Knowing which single command actually answers the specific question you
have, rather than reaching for a broad, unfocused search, is what makes
day-to-day IBM i operations work efficient. This condensed reference
turns several individually learned commands into a quick, practical
lookup.

## Practical Example

Imagine a developer trying to understand why a nightly batch job has not
produced its expected report yet. `WRKSBMJOB` or `WRKJOBQ` confirms
whether it is still waiting to start; `WRKACTJOB` or `DSPJOB` confirms
whether it is currently running and what it is doing; and, once it
finishes, `WRKOUTQ` or `WRKSPLF` confirms whether it actually produced a
spool file. Each command answers a specific piece of that overall
question.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects exactly how these commands are meant to
work together in practice.

## Common Confusions

**"Do I need to memorize every parameter for all of these commands?"**
No, exactly as covered in the Using F4 Prompt and Command Help lesson:
pressing F4 after any of these command names shows their available
parameters interactively.

**"Is WRKSBMJOB just a shortcut for WRKACTJOB?"**
Not exactly a shortcut; it is a more focused view specifically of jobs
submitted with `SBMJOB`, rather than every active job on the system,
useful when you specifically care about submitted batch work rather than
everything currently running.

**"Which command should I reach for first when investigating an
unfamiliar problem?"**
It depends on what you already know: if you know a specific job's name,
`DSPJOB` or `WRKACTJOB` are natural starting points; if you are looking
for output, `WRKSPLF` or `WRKOUTQ`; if you suspect a locking problem,
`WRKOBJLCK`. This lesson's list is meant as a reference to consult based
on the specific question at hand, not a strict starting order.

## Quick Recap

- `DSPJOB` and `WRKACTJOB` focus on jobs; `WRKSBMJOB` and `WRKJOBQ` focus
  specifically on submitted batch work.
- `WRKOUTQ` and `WRKSPLF` focus on spool file output; `WRKOBJLCK` and
  `DSPOBJD` focus on objects and their locks or descriptive detail.
- `DSPLIBL` shows your own library list in actual search order.
- Pressing F4 after any of these command names shows their parameters
  interactively, without needing to memorize exact syntax.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Which of these commands would help most if I suspected an authority
  problem rather than a locking problem?"
- "How would WRKSBMJOB and WRKJOBQ show different information for the
  same submitted batch job?"
