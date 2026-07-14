# Spool Files and Output Queues

## Learning Objective

By the end of this lesson, you will be able to explain what happens to a
printer file's output after it is written, and how a spool file relates
to an output queue.

## Simple Explanation

The Job Logs and Spool Files Basics lesson introduced a spool file as
generated output, such as a report. Now that you have seen how an RPGLE
program actually writes a report to a printer file, this lesson connects
the two: writing to a printer file is exactly what produces a spool file.

Once created, a spool file does not print immediately. It is placed on an
**output queue**, a holding area where one or more spool files wait before
actually being sent to a printer, similar in spirit to how a submitted
batch job waits on a job queue before running, as covered in the SBMJOB
and Batch Job Basics lesson. IBM i provides commands such as **`WRKOUTQ`**
(Work with Output Queue) to see what spool files are currently waiting on
a specific output queue, and **`WRKSPLF`** (Work with Spooled Files) to
see spool files more broadly.

## Why It Matters

Beginners often blur spool files and output queues together, but they are
genuinely different things: a spool file is one specific piece of
generated output, such as one run of a report, while an output queue is a
holding area that can contain many spool files at once, waiting to be
printed. Understanding this distinction matters for anyone who needs to
find, check, or manage report output on a real IBM i system.

## Practical Example

Imagine the daily customer balance report running and completing
successfully. Its output becomes a single spool file, placed onto an
output queue alongside spool files from other reports and jobs that ran
around the same time. A support person checking on that day's report
would use `WRKOUTQ` to look at the output queue and find that specific
spool file waiting there, or already printed.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuinely common, everyday troubleshooting task
on IBM i.

## Common Confusions

**"Is a spool file the same thing as an output queue?"**
No. A spool file is one specific piece of generated output, such as one
report run. An output queue is a holding area that can contain many
different spool files at once, waiting to be printed.

**"Does a spool file disappear immediately once it prints?"**
Not necessarily; this lesson does not go into how long a spool file
remains available after printing, since that depends on system and
output queue configuration beyond this introduction. The key idea at this
level is simply that a spool file is held on an output queue before, and
generally for some time after, printing.

**"Is WRKOUTQ the only way to see spool file output?"**
No. `WRKSPLF` shows spool files more broadly, not tied to one specific
output queue. Both commands are common, practical starting points for
looking at generated report output, though this lesson introduces their
existence rather than covering every option each one offers.

## Quick Recap

- Writing to a printer file produces a spool file, the generated output
  artifact introduced in the Job Logs and Spool Files Basics lesson.
- A spool file is placed on an output queue, a holding area for one or
  more spool files waiting to be printed, similar in spirit to a job
  queue holding batch jobs.
- `WRKOUTQ` shows spool files waiting on a specific output queue;
  `WRKSPLF` shows spool files more broadly.
- A spool file and an output queue are different things: one specific
  piece of output versus a holding area that can contain many.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can a spool file be moved from one output queue to another?"
- "What are some reasons a spool file might stay on an output queue
  without ever actually printing?"
