# Understanding Job Logs

## Learning Objective

By the end of this lesson, you will be able to explain what a job log
actually contains, use `DSPJOBLOG` to view one, and recognize it as one
of the most important everyday IBM i troubleshooting tools.

## Simple Explanation

The Job Logs and Spool Files Basics lesson introduced a job log at a
conceptual level: a record of messages and events related to a job as it
runs. This lesson goes further into actually using one.

A job log is not just a list of errors; it records the ongoing sequence
of messages a job generates as it runs, including informational messages,
warnings, and genuine errors, roughly in the order they occurred. The
**`DSPJOBLOG`** (Display Job Log) command shows the log for a specific
job, letting you scroll through exactly what happened, in order, rather
than only seeing whatever final error a program happened to report.

## Why It Matters

When a program fails or behaves unexpectedly, the job log is often the
single most useful place to start, since it shows not just that
something went wrong, but the sequence of messages leading up to it. This
is exactly why checking the job log is one of the very first steps
covered across nearly every domain-specific debugging lesson in this
path, for RPGLE, file I/O, subfiles, and reports alike.

## Practical Example

Imagine the `CUSTRPT` report program ending abruptly partway through,
without producing a complete report. Running `DSPJOBLOG` against that job
shows the sequence of messages leading up to the failure: perhaps an
earlier informational message about the report starting, followed by an
error message indicating exactly which operation failed and why, giving a
developer a concrete starting point rather than only knowing the report
did not finish.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects one of the most common, practical
everyday uses of a job log on IBM i.

## Common Confusions

**"Does a job log only contain error messages?"**
No. A job log contains the full sequence of messages a job generates,
including informational and warning messages alongside genuine errors.
Not everything in a job log signals a problem.

**"Is DSPJOBLOG the only way to see a job's messages?"**
It is the standard, direct way to view a specific job's log. This lesson
focuses on `DSPJOBLOG` as the practical everyday tool; other, more
specialized ways of working with job messages exist but are beyond this
introduction.

**"Should I check the job log before or after using STRDBG to
investigate a problem?"**
Often before, or alongside. The job log can quickly reveal whether a
program failed with a specific, identifiable error, which then tells you
exactly where to focus a debug session, rather than stepping through
code blindly from the very beginning.

## Quick Recap

- A job log records the full sequence of messages a job generates as it
  runs, not only errors.
- `DSPJOBLOG` (Display Job Log) shows a specific job's log, letting you
  scroll through what happened in order.
- Checking the job log is often one of the first, most practical steps
  when investigating a program that failed or behaved unexpectedly.
- The job log and a debug session complement each other: the job log
  often points to where to focus, and a debug session lets you inspect
  that spot in detail.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I find the job log for a job that already ended?"
- "What is the difference between an informational message and an error
  message in a job log?"
