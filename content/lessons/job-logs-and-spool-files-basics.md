# Job Logs and Spool Files Basics

## Learning Objective

By the end of this lesson, you will understand what a job log is, what a spool
file is, and how both help with understanding what happened during a process on
IBM i.

## Simple Explanation

A job is a unit of work running on IBM i, as touched on in Lesson 3. A job log
records the messages and events related to that work as it runs. When a job
succeeds, fails, or produces a warning, that activity is typically reflected in
its job log, which makes job logs useful for understanding failures, errors,
warnings, and what happened during a process.

A spool file is different from a job log. A spool file represents generated
output, such as a report, print output, job output, or a system-generated
listing. It is worth being clear about how this differs from the physical and
logical files covered in Lesson 6: those files store structured business data
meant to be read and written repeatedly by programs, while a spool file is a
generated output artifact, more like the result of a finished task than an
ongoing store of business data.

## Why It Matters

Job logs and spool files matter for developers, support teams, and operations
staff doing troubleshooting. They connect to much of what earlier lessons have
covered: jobs and processes on the platform (Lesson 3), a CLLE program
coordinating steps and needing to know whether something succeeded (Lesson 8),
an RPGLE program running within a job (Lesson 7), file-based data processing
(Lesson 6), and viewing this kind of information through a 5250 session
(Lesson 5).

## Practical Example

Recall the nightly process from Lesson 8, where a CLLE program calls an RPGLE
program and then checks whether that step completed successfully. If something
in that process goes wrong, a developer or support person can look at the job
log to see what messages were recorded during the run, helping them understand
what happened and why.

If that same nightly process also produces a report, the report itself would
likely appear as a spool file, representing the generated output of that job.
Looking at the job log and the spool file together gives a fuller picture: the
job log shows what happened during the run, and the spool file shows what was
produced. This is a simplified, illustrative example rather than a real system,
but it reflects a common troubleshooting pattern.

## Common Confusions

**"Is a spool file the same as a physical file?"**
No. A physical file, covered in Lesson 6, stores structured business data meant
to be read and written repeatedly by programs. A spool file represents generated
output, such as a report or print job, rather than an ongoing store of business
data.

**"Is reading a job log the same as debugging a program?"**
Not quite. A job log records messages and events at a fairly high level, which
is useful for understanding what happened during a process. Detailed debugging
of a program's internal behavior is a separate, deeper activity beyond the scope
of this lesson.

**"Do I need to know specific commands or message details to understand this
lesson?"**
No. This lesson stays at a conceptual level. Specific commands and message
details are beyond the scope of this introductory lesson.

## Quick Recap

- A job is a unit of work running on IBM i, and a job log records the messages
  and events related to that work.
- Job logs are useful for understanding failures, errors, warnings, and what
  happened during a process.
- A spool file represents generated output, such as a report, print output, job
  output, or a system-generated listing.
- Spool files are different from physical and logical files: they represent
  generated output rather than an ongoing store of structured business data.
- Job logs and spool files matter for developers, support teams, and operations
  staff doing troubleshooting, connecting to jobs, RPGLE, CLLE, files, and 5250
  usage covered in earlier lessons.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example, try
asking:

- "What's the difference between a job log and a spool file?"
