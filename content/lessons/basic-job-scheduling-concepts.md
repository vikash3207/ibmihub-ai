# Basic Job Scheduling Concepts

## Learning Objective

By the end of this lesson, you will be able to explain the basic
difference between submitting a job to run immediately and scheduling one
to run automatically later.

## Simple Explanation

Every `SBMJOB` example covered so far in this path submits a batch job to
run essentially right away, waiting only on its job queue, covered in the
Job Queues and Output Queues lesson, before starting. IBM i also supports
**scheduling** a job to run automatically at a specific future time, or
on a recurring basis, such as every night, without anyone needing to
submit it manually each time.

At a basic level, a scheduled job entry specifies what to run and when,
and IBM i itself submits that job automatically once the scheduled time
arrives, rather than a person running `SBMJOB` by hand at that exact
moment.

## Why It Matters

Understanding that scheduling exists as a distinct concept from a manual
`SBMJOB` explains how routine, repeating processes, such as a nightly
report, actually run without someone remembering to submit them every
single night. Recognizing this distinction also helps when investigating
why a job ran: was it manually submitted, or did it start automatically
based on a schedule.

## Practical Example

Imagine the nightly order-processing job needing to run automatically
every night at a specific time, without an operator needing to remember
to submit it manually. A scheduled job entry specifies the program to run
and the nightly time to run it, and IBM i itself submits that job as a
batch job at the scheduled time each night, landing on a job queue and
proceeding exactly like any other submitted job from that point onward.

This is a simplified, illustrative example rather than a specific real
schedule, but it reflects a genuinely common, practical reason job
scheduling exists on IBM i.

## Common Confusions

**"Once a job is scheduled, does it skip the job queue entirely?"**
No. A scheduled job still becomes a submitted batch job at its scheduled
time, waiting on a job queue exactly like one submitted manually with
`SBMJOB`, covered in the Job Queues and Output Queues lesson.

**"Is scheduling only useful for jobs that repeat every day?"**
No, though repeating jobs are a common use. A scheduled job entry can
also be set for a single specific future time, run only once, rather than
necessarily repeating on a recurring basis.

**"Do I need to learn a separate enterprise scheduling tool to
understand this lesson?"**
No. This lesson covers IBM i's own basic scheduling concept at a
beginner level. More advanced, separate enterprise scheduling tools exist
but are beyond this introduction.

## Quick Recap

- Scheduling lets a job run automatically at a specific future time, or
  on a recurring basis, without someone submitting it manually each time.
- A scheduled job still becomes a submitted batch job, waiting on a job
  queue, at its scheduled time.
- Scheduling can be set for a single future run or a recurring pattern.
- This lesson covers IBM i's own basic scheduling concept; separate
  enterprise scheduling tools are a more advanced topic beyond this
  introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I check whether a specific job ran because it was scheduled
  or because someone submitted it manually?"
- "What would happen if a scheduled job's scheduled time arrived while
  its job queue was already busy with other work?"
