# Job Status Values Explained

## Learning Objective

By the end of this lesson, you will be able to recognize a few common IBM
i job status values and explain what each one generally means.

## Simple Explanation

The WRKACTJOB Basics for Developers lesson noted that a job's status can
show more than simply active and running, without going into detail. A
few common status values worth recognizing include:

- **`ACTIVE`**, meaning the job is currently running.
- **`JOBQ`**, meaning the job is waiting on a job queue, covered in the
  Job Queues and Output Queues lesson, not yet running.
- **`OUTQ`**, generally shown in the context of a job's produced spool
  file output waiting on an output queue, covered in the Spool Files and
  Output Queues lesson, rather than the job itself still running.
- **`MSGW`** (Message Waiting), meaning the job is paused, waiting for
  someone to respond to a message it sent, such as an inquiry message,
  covered in the Reading IBM i Message IDs lesson.

## Why It Matters

Recognizing these status values at a glance tells you immediately what
stage a job is actually in, without needing to dig further just to
understand the basics: whether it simply hasn't started yet, is actively
working, is stuck waiting for a reply, or has already produced output
waiting to be handled.

## Practical Example

Imagine checking on the nightly order-processing batch job with
`WRKSBMJOB`, covered in the previous lesson. Seeing its status as `JOBQ`
tells you it is still waiting its turn and has not started running yet.
Checking again later and seeing `ACTIVE` confirms it is now actually
running. If it instead showed `MSGW`, that would tell you the job has
paused, waiting for a reply to some message, rather than continuing to
work on its own.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, practical reason
recognizing these status values matters.

## Common Confusions

**"Does MSGW mean the job has failed?"**
Not necessarily. `MSGW` means the job is paused, waiting for a reply to a
message, which could be a normal, expected inquiry rather than a failure;
it does mean the job will not continue on its own until that message is
answered.

**"Is OUTQ status the same thing as an output queue itself?"**
No. An output queue, covered in the Spool Files and Output Queues lesson,
is the actual holding area for spool files. `OUTQ` as a status value
simply indicates that context, spool file output waiting on an output
queue, rather than being the output queue itself.

**"Are these the only status values a job can ever show?"**
No. These are a few common, especially useful ones to recognize at a
beginner level; IBM i supports additional status values beyond this
introduction, covering more specific or advanced situations.

## Quick Recap

- `ACTIVE` means a job is currently running.
- `JOBQ` means a job is waiting on a job queue, not yet running.
- `OUTQ` relates to a job's spool file output waiting on an output queue.
- `MSGW` means a job is paused, waiting for a reply to a message, and
  will not continue until it receives one.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would I need to do if I found a job stuck in MSGW status?"
- "What are some other job status values besides ACTIVE, JOBQ, OUTQ, and
  MSGW?"
