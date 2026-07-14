# DSPJOB and Job Information Basics

## Learning Objective

By the end of this lesson, you will be able to explain what `DSPJOB`
shows, and use it to inspect a job's log, call stack, library list, and
basic attributes.

## Simple Explanation

The Working with IBM i Job Attributes in CLLE lesson covered `RTVJOBA`,
which retrieves specific job attributes into CL variables for a program
to use. **`DSPJOB`** (Display Job) is different: it is an interactive
command a developer runs directly, opening a menu of information about a
job for a person to actually look at.

From `DSPJOB`'s menu, a few especially useful options include:

- **Job log**, the same message history covered in the Understanding Job
  Logs lesson, viewable directly from within `DSPJOB` rather than only
  through a separate `DSPJOBLOG` command.
- **Call stack**, showing which programs and procedures are currently
  active in the job, and how they called each other, covered in full in
  the Understanding Call Stack Basics lesson later in this group.
- **Library list**, showing exactly which libraries the job will search,
  and in what order, when it looks for an object, connecting to the
  Library List Explained in Depth lesson.
- **Job attributes**, similar in spirit to what `RTVJOBA` retrieves
  programmatically, but shown here for a person to read directly.

## Why It Matters

`DSPJOB` is one of the most practical everyday tools for understanding
exactly what state a job is in right now: what it has logged, what
programs are currently active within it, and what library list it is
using. Rather than reaching for several separate commands, `DSPJOB`
brings this information together in one place.

## Practical Example

Imagine a developer investigating why a program cannot find an object it
expects to exist. Running `DSPJOB` and selecting the library list option
shows exactly which libraries the job is actually searching, and in what
order, quickly revealing whether the expected library is missing or
simply not being searched before the wrong one. The same `DSPJOB` session
could also show that job's log or call stack without needing separate
commands.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, everyday reason
developers reach for `DSPJOB`.

## Common Confusions

**"Is DSPJOB the same thing as RTVJOBA?"**
No. `RTVJOBA`, covered in the Working with IBM i Job Attributes in CLLE
lesson, retrieves specific attributes into CL variables for a program to
use programmatically. `DSPJOB` is an interactive command for a person to
directly view a job's information, including its log, call stack, and
library list, not just its attributes.

**"Do I need to already know a job's exact name and number to use
DSPJOB?"**
Not necessarily for your own current job; running `DSPJOB` without
specifying one shows information about the job you are currently signed
on to. Looking at a different job, such as one found with `WRKACTJOB`,
covered in the next lesson, generally does require identifying it first.

**"Does DSPJOB show live, constantly updating information, or a
snapshot?"**
It shows the job's information as of when you view it; if you need to
see how something has changed since then, you would run `DSPJOB` again to
get an updated view.

## Quick Recap

- `DSPJOB` (Display Job) is an interactive command opening a menu of
  information about a job, for a person to explore directly.
- Its options include the job log, call stack, library list, and job
  attributes.
- `RTVJOBA` retrieves specific attributes programmatically for a CLLE
  program; `DSPJOB` is for a person directly inspecting a job.
- Running `DSPJOB` without specifying a job shows information about your
  own current job.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What other information does DSPJOB show besides job log, call stack,
  and library list?"
- "How would I use DSPJOB to look at a job other than the one I'm
  currently signed on to?"
