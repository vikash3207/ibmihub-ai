# IBM i Support Ticket Walkthrough

## What This Lesson Prepares You For

Real Support Ticket Analysis for Beginners covered six short tickets at
a glance. This lesson slows down and walks through one ticket at a time,
start to finish, in the kind of depth a job discussion or interview might
actually expect.

## Concepts to Revise First

- Real Support Ticket Analysis for Beginners.
- Understanding Job Logs, and Library List in Real Job Execution.
- Object Locks Basics, and Debugging Report Output Problems.

## Common Interview or Job Discussion Scenarios

- "Walk me through, start to finish, how you'd handle this ticket."
- "What would you tell the user while you're still investigating?"
- "How would you confirm your fix actually worked?"

## Strong Beginner-Level Answer Approach

A strong walkthrough has a clear beginning, middle, and end: what the
ticket says, what you checked and what you found, what the actual cause
turned out to be, and how you confirmed the fix worked. Skipping straight
to "I fixed it" without describing the investigation misses most of what
the question is actually testing.

## Weak Answers to Avoid

- Jumping straight to a fix without describing what you checked to
  confirm the cause first.
- Assuming the ticket's own wording is exactly correct, instead of
  confirming the actual symptom with specifics.
- Never mentioning how you would confirm the fix actually resolved the
  issue.

## Scenario-Based Practice

**Ticket: "Program fails saying a file can't be found, but it worked
yesterday."**

A full walkthrough: First, get specifics — which program, which file
name does the job log actually name, and what changed since yesterday.
Second, check the job log's message detail, which usually names the
exact object and library it looked for. Third, check the job's actual
library list at the time it ran, since a common cause is that a
library was removed from, or reordered in, the library list, as covered
in the Library List Problems in Real Applications lesson, not that the
file itself was deleted. Fourth, once the library list is corrected,
confirm the fix by re-running the exact same job and watching for the
same failure.

## How to Explain Your Thinking Clearly

A useful phrase to structure this kind of answer is: "Before I assumed
X, I checked Y, which told me Z." For example: "Before I assumed the
file was deleted, I checked the job's library list, which showed the
library containing that file had been removed from it since yesterday's
run." This makes the investigation concrete instead of vague.

## Practical IBM i Example

```text
Job log message detail (example):
  Message . . . . :   File CUSTMAST in library *LIBL not found.
  Cause . . . . . :   Library list used by this job did not include
                       MYAPPLIB at the time this program ran.
```

Being able to read a message like this and connect it back to "the
library list, not the file itself, is the actual problem" is exactly the
kind of reasoning this ticket is testing.

## Mini Practice Task

Pick one other ticket type: a job in `MSGW`, a record lock, a `SQLCODE`
of `100` when a row was expected, or a missing spool file. Write a full
walkthrough for it in the same four-part structure used above: get
specifics, check the most informative source first, name the likely
cause, and describe how you would confirm a fix worked.

## Quick Recap

- A strong ticket walkthrough has a clear structure: specifics, checks,
  cause, and confirmation, not just a final answer.
- Many "file not found" or "program worked yesterday" tickets trace back
  to library list changes, not the underlying object being deleted.
- Confirming a fix by reproducing the original conditions is as important
  as identifying the cause in the first place.

## Try Asking the AI Tutor

Use the AI Tutor to practice a full walkthrough. For example, try asking:

- "Can you give me one support ticket and ask me to walk through it
  start to finish, including how I'd confirm my fix?"
- "How would I explain a library list problem to a user who doesn't know
  what a library list is?"
