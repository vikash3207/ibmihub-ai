# SBMJOB and Batch Job Basics

## Learning Objective

By the end of this lesson, you will understand the difference between
running work interactively and submitting it as a batch job, and be able
to use a simple `SBMJOB` command to submit a command to run in batch.

## Simple Explanation

In the Job Logs and Spool Files Basics lesson, you learned that a job is a
unit of work running on IBM i. So far in this lesson group, every CLLE
example has run **interactively**: directly tied to a signed-on session,
with the session waiting for it to finish. IBM i also supports running
work as a **batch job**, submitted to run on its own, separate from any
interactive session.

A command, including a `CALL` to another program, is submitted to run in
batch using **`SBMJOB`** (Submit Job):

```clle
SBMJOB CMD(CALL PGM(PROCESSORDER) PARM(&CUSTNAME &ORDERTOTAL)) JOB(ORDERPROC)
```

Here, `CMD` names the command to run, in this case a `CALL` to
`PROCESSORDER`, and `JOB` gives the submitted batch job a name,
`ORDERPROC`, making it easier to find and recognize later, such as when
checking its job log, as covered in the Job Logs and Spool Files Basics
lesson.

Once submitted, the batch job runs independently: the interactive session
that submitted it is immediately free to continue with other work, rather
than waiting for the batch job to finish.

## Why It Matters

Understanding the difference between interactive and batch work explains
why some processes are deliberately submitted to run in the background
rather than run directly. Long-running or resource-intensive work, such as
processing a large batch of orders, is commonly submitted this way so it
does not tie up an interactive session or make a user wait at a screen for
it to complete.

## Practical Example

Imagine the nightly order-processing task described in earlier CLLE
lessons. Rather than an operator staying signed on and waiting while every
order is processed one at a time, a CLLE program uses `SBMJOB` to submit
that work as a named batch job, `ORDERPROC`, freeing the interactive
session immediately. Later, the operator can check that job's log to
confirm it completed successfully, exactly as covered in the Job Logs and
Spool Files Basics lesson.

This is a simplified, illustrative example rather than a specific real
nightly process, but it reflects a very common, practical reason IBM i
shops use `SBMJOB` for meaningful operational tasks.

## Common Confusions

**"Does SBMJOB run the command immediately, in the same job as the
program that submitted it?"**
No. `SBMJOB` starts a separate, independent batch job to run the command,
rather than running it within the submitting job itself. This is exactly
what allows the submitting session to continue on immediately rather than
waiting.

**"Do I need to give every submitted job a name using JOB?"**
Not strictly, since IBM i can assign a default name, but giving a submitted
job a clear, recognizable name using `JOB` makes it significantly easier
to find and check later, especially when several batch jobs might be
running around the same time.

**"Is a batch job the same thing as the CALL command it runs?"**
Not quite. `CALL` is the command being run; the batch job is the unit of
work IBM i creates to actually run that command independently, as
introduced conceptually in the Job Logs and Spool Files Basics lesson.

## Quick Recap

- Work can run interactively, tied to a signed-on session, or as a batch
  job, running independently.
- `SBMJOB CMD(...) JOB(...)` submits a command to run as a named batch
  job.
- Submitting work to batch frees the interactive session immediately,
  rather than making it wait for that work to finish.
- Batch jobs are commonly used for long-running or resource-intensive
  work, such as nightly processing.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How can I check whether a batch job submitted with SBMJOB has finished
  yet?"
- "What are some other reasons to use SBMJOB besides freeing up an
  interactive session?"
