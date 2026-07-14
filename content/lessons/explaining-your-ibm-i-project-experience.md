# Explaining Your IBM i Project Experience

## What This Lesson Prepares You For

Interviewers often ask beginners to describe a project they have worked
on, even a small course project, rather than only asking abstract
definition questions. This lesson helps you describe the mini projects
from this course clearly, honestly, and in a way that shows real
understanding.

## Concepts to Revise First

- The IBM i Developer Interview Roadmap lesson's overall approach to
  explaining your thinking.
- The Customer Inquiry Program, Customer Maintenance Add/Change/Delete,
  and End-to-End Mini DMS-Style Flow mini projects.
- The Order Entry Skeleton and Printer File Report with Totals mini
  projects.

## Common Interview or Job Discussion Scenarios

- "Tell me about a project you've worked on, even a small one."
- "What was the most difficult part of that project?"
- "If you had more time, what would you add to it?"
- "Did you work with a database, and what did that involve?"

## Strong Beginner-Level Answer Approach

A strong approach is to describe a project honestly, at the scale it
actually was, rather than exaggerating its scope. For example: "I built a
small customer inquiry program in RPGLE. It used a display file with an
input field for a customer number, and a `CHAIN` against a keyed physical
file to look up that customer's name and balance. I made sure to check
`%FOUND` before trusting the result, since I learned that skipping that
check is a common source of bugs." This is honest about the project
being small and course-based, while still showing specific, real
technical understanding.

## Weak Answers to Avoid

- Describing a small course project as a "full production system" or
  "enterprise application," which overstates its scope and tends to fall
  apart under a single follow-up question.
- Giving a vague answer like "I worked with RPGLE and files" without
  naming what the program actually did or which concepts it used.
- Claiming a project used techniques you did not actually apply, such as
  claiming advanced multi-file transaction handling for a project that
  was intentionally kept small.

## Scenario-Based Practice

Imagine being asked: "You mentioned an order entry program. Walk me
through what happens when a user saves a new order." A strong answer
walks through it in order: the user enters a customer number, item
number, and quantity on the screen; pressing the save key writes one
record to the order header file and one to the order detail file; and,
as covered in the Order Entry Skeleton mini project, both files needed a
`prefix` keyword on their `dcl-f` declarations, since they shared a field
name.

## How to Explain Your Thinking Clearly

When asked "what was the most difficult part?", a good structure is to
name one specific, real difficulty, and explain how you resolved it,
rather than saying everything went smoothly. For example: "The trickiest
part was that my order header and detail files both had a field called
`ORDNBR`. I learned that RPGLE would not let me declare both files
without conflict unless I added a `prefix` keyword to one of them, so I
prefixed the detail file's fields instead." This shows a real technical
detail and a real resolution, which is far more convincing than a vague
"it went fine."

## Practical IBM i Example

```rpgle
dcl-f ORDHDRPF disk keyed;
dcl-f ORDDTLPF disk keyed prefix('DTL_');

ORDNBR = 5001;
CUSTNBR = 1042;
write ORDHDRPF;

DTL_ORDNBR = 5001;
DTL_ITEMNBR = 2010;
DTL_QTY = 3;
write ORDDTLPF;
```

This is exactly the kind of small snippet worth being able to point to
and explain: "This is the actual write logic from my order entry
project. The header record and detail record are written separately,
and the `prefix('DTL_')` keeps the detail file's `ORDNBR` field distinct
from the header file's own `ORDNBR` field."

## Mini Practice Task

Pick one mini project you are comfortable with from this course, and
write two or three sentences describing it as you would in an interview:
what it does, one specific technical detail worth mentioning, and one
honest thing you would improve given more time.

## Quick Recap

- Describe your course projects honestly, at their real scale, rather
  than overstating them.
- Naming one specific technical detail is far more convincing than a
  vague summary.
- Being able to name a real difficulty and how you resolved it is a
  strong signal, not a weakness to hide.

## Try Asking the AI Tutor

Use the AI Tutor to practice describing your project experience. For
example, try asking:

- "Can you ask me to describe one of my mini projects and give me
  feedback on how specific my answer was?"
- "How would I explain the prefix keyword issue from the Order Entry
  Skeleton project in an interview?"
