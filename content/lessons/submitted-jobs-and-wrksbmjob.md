# Submitted Jobs and WRKSBMJOB

## Learning Objective

By the end of this lesson, you will be able to use `WRKSBMJOB` to track a
submitted batch job from the moment it is submitted through to
completion.

## Simple Explanation

The Common IBM i Operations Commands for Developers lesson briefly
mentioned `WRKSBMJOB` as a more focused alternative to `WRKACTJOB`. This
lesson covers it in full.

**`WRKSBMJOB`** (Work with Submitted Jobs) lists jobs submitted with
`SBMJOB`, covered in the SBMJOB and Batch Job Basics lesson, showing each
one's current status as it moves through its lifecycle: waiting on a job
queue, covered in the Job Queues and Output Queues lesson, actively
running, or already completed. Unlike `WRKACTJOB`, which lists every
active job regardless of how it started, `WRKSBMJOB` specifically tracks
jobs that came from `SBMJOB`, including ones that have already finished,
for a period of time after they end.

## Why It Matters

`WRKSBMJOB` gives a developer one consistent place to watch a specific
submitted job's entire journey, rather than needing to check a job
queue, then `WRKACTJOB`, then somewhere else once it finishes. This
matters especially for a batch job whose progress needs to be tracked
across all three of those stages.

## Practical Example

Imagine submitting the nightly order-processing job with `SBMJOB` and
wanting to follow it through to completion. Running `WRKSBMJOB`
immediately after submitting it shows the job waiting on its job queue.
Checking again later shows its status has changed to actively running.
Checking once more after it finishes shows it as completed, still
listed for a period of time, letting the developer confirm it actually
ran and select it to check its job log, without needing to switch
between several different commands along the way.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, practical way
`WRKSBMJOB` is used to follow one specific job's progress.

## Common Confusions

**"Does WRKSBMJOB show jobs that started some other way besides
SBMJOB?"**
No. It is specifically scoped to jobs submitted with `SBMJOB`, which is
exactly what makes it a more focused view than `WRKACTJOB`'s broader list
of every active job, covered in the WRKACTJOB Basics for Developers
lesson.

**"Once a submitted job finishes, does it disappear from WRKSBMJOB
immediately?"**
Not immediately; a completed submitted job typically remains listed for
some time afterward, letting a developer confirm it finished and check
its results, before eventually aging off the list.

**"Is WRKSBMJOB a replacement for checking the job's job log
directly?"**
No. `WRKSBMJOB` tracks a submitted job's status and progress; checking
its actual job log, covered in the Job Logs in Batch Jobs lesson later in
this group, is still a separate, necessary step to see exactly what
happened during that job's run.

## Quick Recap

- `WRKSBMJOB` (Work with Submitted Jobs) lists jobs submitted with
  `SBMJOB`, tracking each one's status from waiting, to running, to
  completed.
- Unlike `WRKACTJOB`, it stays scoped specifically to submitted jobs, and
  continues showing a job for some time after it completes.
- `WRKSBMJOB` is a practical, single place to follow one submitted job's
  entire lifecycle.
- Checking a job's actual job log is still a separate step beyond simply
  tracking its status with `WRKSBMJOB`.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How long does a completed job typically stay listed in WRKSBMJOB
  before it disappears?"
- "Could I use WRKSBMJOB to confirm a job hasn't even started running
  yet?"
