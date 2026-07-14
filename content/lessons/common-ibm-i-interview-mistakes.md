# Common IBM i Interview Mistakes

## What This Lesson Prepares You For

This lesson pulls together the weak-answer patterns spread across the
Interview and Professional Readiness lessons into one focused list, so
you can recognize and avoid them as a group, not just topic by topic.

## Concepts to Revise First

- RPGLE Basic Interview Questions, and CLLE Interview Scenarios.
- SQLRPGLE Interview Scenarios, and Display File and Subfile Interview
  Questions.
- Debugging Scenario-Based Questions.

## Common Interview or Job Discussion Scenarios

- Being asked a definition question and answering with a memorized
  phrase that doesn't actually connect to a real example.
- Being asked a scenario question and jumping straight to a fix.
- Being asked about a project and describing it in vague, inflated
  terms.

## Strong Beginner-Level Answer Approach

The common thread across strong answers in every lesson in this batch is
specificity: naming an actual concept, an actual line of code, or an
actual check, rather than speaking in generalities. Reviewing your own
practice answers and asking "could this answer apply to almost any
question?" is a good way to catch a too-generic response before an
interview does.

## Weak Answers to Avoid

- **Reciting definitions without application**: correctly defining
  `%FOUND` but being unable to say what happens if it's not checked.
- **Skipping the job log**: jumping straight to a debugger or a guess
  instead of checking the job log first, as covered in the Basic
  Troubleshooting Flow for IBM i Developers lesson.
- **Treating a lock conflict as broken code**: assuming two jobs failing
  on the same record must mean a bug, rather than recognizing normal
  timing behavior, as covered in the Troubleshooting Locked Record
  Scenario mini project.
- **Confusing SBMJOB with waiting**: assuming a submitted job finishes
  before the calling program continues, rather than understanding
  `SBMJOB` runs independently.
- **Treating any nonzero SQLCODE the same way**: not distinguishing
  `100` (no row found) from a genuine SQL error.
- **Overstating project scope**: describing a small mini project as a
  "full production system," which tends to unravel under one follow-up
  question.

## Scenario-Based Practice

Read this answer and identify which mistake above it demonstrates: "A
report didn't run last night, so I'd start the debugger and look for
issues." The mistake is skipping the job log: the batch job's own job
log, separate from whatever submitted it, usually names the actual
failure directly, as covered in the Batch Job Failure Investigation mini
project, and should be checked before reaching for a debugger.

## How to Explain Your Thinking Clearly

A good habit across every one of these mistake categories is pausing
before answering and asking yourself: "Am I about to say something
generic, or something specific to this exact situation?" If the honest
answer is generic, naming one concrete detail, a line of code, a
command, a check, usually turns a weak answer into a strong one.

## Practical IBM i Example

```rpgle
chain custNbr CUSTMAST;
CUSTBAL -= paymentAmt;
update CUSTMAST;
```

An interviewer showing this snippet is testing whether you catch the
missing `%found(CUSTMAST)` check, exactly the mistake covered in the
Debugging a Broken File I/O Program mini project. Naming the missing
line specifically, rather than saying "this looks risky," is the
difference between a weak and a strong answer here.

## Mini Practice Task

Look back at your own practice answers from earlier lessons in this
batch. Pick one, and rewrite it to be more specific: name one exact
concept, command, or line of code you could point to if asked a
follow-up question.

## Quick Recap

- Most interview mistakes come down to being too generic instead of
  specific.
- Skipping the job log, misreading lock conflicts, misunderstanding
  `SBMJOB`, mishandling `SQLCODE`, and overstating project scope are the
  most common, recurring patterns.
- Reviewing your own answers for specificity is a genuinely useful habit
  before an interview.

## Try Asking the AI Tutor

Use the AI Tutor to check your own answers for these mistakes. For
example, try asking:

- "Can you review my answer to a debugging question and tell me if it's
  too generic?"
- "What's a mistake I'm likely to make when explaining SBMJOB in an
  interview?"
