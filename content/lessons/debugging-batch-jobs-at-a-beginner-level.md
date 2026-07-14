# Debugging Batch Jobs at a Beginner Level

## Learning Objective

By the end of this lesson, you will be able to explain the basic
practical difference between debugging an interactive job and a batch
job, and apply a simple approach to investigating a batch job at a
beginner level.

## Simple Explanation

Every debugging technique covered so far in this lesson group, `STRDBG`,
breakpoints, and watching variables, works naturally with an interactive
job: you are sitting right there, running the program yourself. A
**batch job**, submitted with `SBMJOB` as covered in the SBMJOB and Batch
Job Basics lesson, runs independently, which changes the practical
approach: you cannot simply watch it run in real time the way you can an
interactive session.

At a beginner level, investigating a batch job generally means: finding
it first, with `WRKACTJOB` if it is still running, then checking its job
log, either while it runs or after it finishes, to see what actually
happened. `DSPJOB`'s call stack option can also show what a still-running
batch job is currently doing, without needing to interrupt it.

## Why It Matters

Assuming batch job debugging works exactly like interactive debugging can
lead to real confusion, expecting to simply step through a batch program
the way you would an interactive one. Understanding that a batch job's
job log and call stack are the primary practical tools, rather than
live, in-the-moment stepping, sets realistic expectations for
beginner-level batch job investigation.

## Practical Example

Imagine the nightly order-processing batch job submitted with `SBMJOB`
appearing to have failed. A developer first uses `WRKACTJOB` to check
whether it is still running at all; finding that it already ended, they
instead check its job log directly, using the job name given to `SBMJOB`
to find the right one, and see the specific message explaining what went
wrong, exactly the same job log reading skill covered in the Understanding
Job Logs and Finding Program Failures from Error Messages lessons.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a realistic, beginner-appropriate approach
to a batch job that did not behave as expected.

## Common Confusions

**"Can I use STRDBG to step through a batch job the same way as an
interactive program?"**
Attaching a debugger to an already-running batch job, and more advanced
batch debugging techniques generally, are beyond this introduction. At a
beginner level, checking the job log and call stack, as covered in this
lesson, is the practical, accessible starting point.

**"Does a batch job have its own separate job log from the job that
submitted it with SBMJOB?"**
Yes. A batch job runs as its own independent job, with its own job log,
separate from the job that used `SBMJOB` to submit it, which is exactly
why finding the batch job's own name and number matters for checking its
specific job log.

**"If WRKACTJOB shows the batch job is still running, is that enough to
know it will finish successfully?"**
No, only that it has not finished yet, successfully or otherwise. Still
running only tells you the job is in progress; checking its job log once
it completes is what actually confirms whether it succeeded.

## Quick Recap

- A batch job runs independently, so it cannot simply be watched and
  stepped through in real time the way an interactive job can.
- `WRKACTJOB` confirms whether a batch job is still running; its job log,
  found using the name given to `SBMJOB`, shows what actually happened.
- `DSPJOB`'s call stack option can show what a still-running batch job is
  currently doing without interrupting it.
- Beginner-level batch job investigation relies primarily on the job log
  and call stack, not live interactive stepping.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I find a specific batch job's job log once it has already
  finished running?"
- "What are some more advanced ways experienced developers debug batch
  jobs that go beyond this introduction?"
