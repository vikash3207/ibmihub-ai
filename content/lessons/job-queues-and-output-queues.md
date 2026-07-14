# Job Queues and Output Queues

## Learning Objective

By the end of this lesson, you will be able to clearly distinguish a job
queue from an output queue, and use `WRKJOBQ` to look at a job queue.

## Simple Explanation

The SBMJOB and Batch Job Basics lesson briefly introduced a **job
queue**: a holding area where submitted batch jobs wait to actually
start running. The Spool Files and Output Queues lesson introduced an
**output queue**: a holding area where spool files wait to actually be
printed. These names sound similar, and beginners commonly mix them up,
but they hold two completely different things.

A job queue holds **jobs waiting to run**. An output queue holds **spool
files waiting to print**. `WRKJOBQ` (Work with Job Queues) shows job
queues and the batch jobs currently waiting on them, the job-queue
equivalent of `WRKOUTQ`, covered in the Working with Output Queues using
WRKOUTQ lesson, for spool files.

## Why It Matters

Confusing these two can send a developer looking in completely the wrong
place: checking an output queue for a batch job that has not even started
running yet, or checking a job queue for a report that already finished
and produced a spool file. Keeping the distinction clear, waiting jobs
versus waiting output, avoids this mix-up.

## Practical Example

Imagine a nightly batch job submitted with `SBMJOB` that seems to be
taking a long time. Checking `WRKJOBQ` shows the job is still sitting on
its job queue, waiting for a turn to actually start, perhaps behind other
batch jobs already using that queue. Once it does start and eventually
finishes, producing a report, that report's resulting spool file would
then be found on an output queue instead, checked with `WRKOUTQ`, a
completely separate, later stage of the same overall process.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common source of beginner
confusion when a submitted job seems to be taking too long.

## Common Confusions

**"Is a job queue the same thing as an output queue?"**
No. A job queue holds batch jobs waiting to start running. An output
queue holds spool files waiting to print. They serve entirely different
stages of a batch job's life: before it runs, versus after it produces
output.

**"If WRKOUTQ shows nothing for my batch job, does that mean it
failed?"**
Not necessarily. It may simply not have produced any spool file output
yet, either because it has not started running, still waiting on a job
queue, or because it has not reached the part of its logic that produces
output.

**"Does every batch job use both a job queue and an output queue?"**
Every batch job submitted with `SBMJOB` uses a job queue to wait before
starting, as covered in the SBMJOB and Batch Job Basics lesson. Whether
it later uses an output queue depends on whether it actually produces
spool file output, such as a printed report, during its run.

## Quick Recap

- A job queue holds batch jobs waiting to start running; an output queue
  holds spool files waiting to print.
- `WRKJOBQ` (Work with Job Queues) shows job queues and the jobs
  currently waiting on them.
- A batch job passes through a job queue before it runs, and may later
  produce spool file output that lands on an output queue afterward.
- Checking the wrong kind of queue is a common, easy mix-up worth
  avoiding by keeping "waiting jobs" and "waiting output" clearly
  separate.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would make a batch job wait a long time on a job queue before
  starting?"
- "Can a single job queue feed jobs into more than one subsystem?"
