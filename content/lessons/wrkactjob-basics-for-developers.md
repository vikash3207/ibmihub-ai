# WRKACTJOB Basics for Developers

## Learning Objective

By the end of this lesson, you will be able to use `WRKACTJOB` to find
active jobs on the system and read their basic status.

## Simple Explanation

The previous lesson covered `DSPJOB` for inspecting one specific job in
detail. Before you can inspect a job with `DSPJOB`, you often need to
actually find it first. **`WRKACTJOB`** (Work with Active Jobs) lists
every job currently active on the system, or a subsystem, showing basic
status information for each one: its name, user, type, whether it is
interactive or batch, and a general status such as running or waiting.

From `WRKACTJOB`'s list, selecting a specific job offers options
including opening `DSPJOB` for that job directly, letting you move
naturally from "which job is this" to "what is this job actually doing."

## Why It Matters

A developer investigating a problem often does not start already knowing
a job's exact name; they instead know roughly what it should be, such as
"the nightly order processing batch job" or "my own interactive session."
`WRKACTJOB` is the practical everyday way to locate that job among
everything currently running, before drilling into it further with
`DSPJOB`.

## Practical Example

Imagine a developer checking on the nightly batch job submitted with
`SBMJOB`, covered in the SBMJOB and Batch Job Basics lesson. Running
`WRKACTJOB` shows every currently active job; scanning the list for the
job name given to `SBMJOB` confirms whether it is still running, and its
general status. Selecting that job from the list and choosing the option
to display it opens `DSPJOB`, letting the developer check its job log or
call stack directly from there.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, everyday way
`WRKACTJOB` and `DSPJOB` are used together.

## Common Confusions

**"Does WRKACTJOB show every job on the entire system, no matter what?"**
Generally yes, though its exact scope can be limited or filtered
depending on how it is run and what authority you have. For a beginner's
everyday use, it is reasonable to expect it to show the active jobs
relevant to what you are investigating.

**"Is WRKACTJOB the right command for looking at one specific job's job
log or call stack?"**
Not directly; `WRKACTJOB` is for finding and getting a basic status
overview of jobs. Once you have identified the specific job you care
about, `DSPJOB`, covered in the previous lesson, is the right tool for
looking at its job log, call stack, or library list in detail.

**"What does it mean if a job's status shows something other than
simply running?"**
`WRKACTJOB` can show a variety of statuses beyond simply active and
running, such as a job waiting on something else to happen. This lesson
focuses on recognizing that status information exists and is worth
reading; a detailed breakdown of every possible status is a more advanced
topic beyond this introduction.

## Quick Recap

- `WRKACTJOB` (Work with Active Jobs) lists every currently active job,
  showing basic status information such as name, user, type, and general
  status.
- `WRKACTJOB` is the practical starting point for locating a specific job
  before inspecting it further.
- Selecting a job from `WRKACTJOB`'s list and choosing to display it opens
  `DSPJOB` for that job directly.
- `WRKACTJOB` shows an overview across many jobs; `DSPJOB` shows detail
  for one specific job.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I use WRKACTJOB to find a batch job by the name I gave it
  with SBMJOB?"
- "What are some of the different statuses a job might show in
  WRKACTJOB?"
