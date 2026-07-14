# Debugging Scenario-Based Questions

## What This Lesson Prepares You For

Debugging questions in interviews are almost always scenario-based:
"here's a symptom, walk me through how you'd investigate it." This
lesson works through the most common versions of that question and how
to structure a clear, ordered answer.

## Concepts to Revise First

- The Basic Troubleshooting Flow for IBM i Developers lesson's ordered
  flow: job log first, then narrow down from there.
- STRDBG Basics for RPGLE, Setting and Using Breakpoints, and Watching
  Variables During Debug.
- Compile Errors vs Runtime Errors.
- The Debugging a Broken File I/O Program, Troubleshooting Locked Record
  Scenario, and Batch Job Failure Investigation mini projects.

## Common Interview Questions

- "Walk me through how you would start debugging a program that just
  crashed."
- "What is the difference between a compile error and a runtime error,
  and why does that distinction matter for where you look first?"
- "When would you reach for `STRDBG` versus just reading the job log?"

## Good Beginner-Level Answers

For "walk me through how you would start debugging a program that just
crashed," a strong, structured answer is: "First I'd check the job log,
since it usually names the failing program and statement directly. If
the job log points to a specific line, I would only start `STRDBG` and
set a breakpoint there if the cause isn't already obvious from the
message itself." This shows you don't skip straight to a debugger before
using the information already available.

## Scenario-Based Questions

- "A program that updates a customer balance fails with a runtime error.
  The job log names the `UPDATE` statement specifically. What would you
  check first, before starting a debug session?"
- "Two users report the exact same program failing for one of them but
  not the other, using the same customer number, one right after the
  other. What kind of problem does this suggest?"
- "A report that runs every night is simply missing this morning, with no
  error message anywhere obvious. How would you start investigating
  that?"

## How to Explain Your Thinking

For the "job log names the `UPDATE` statement" scenario, a strong
approach is to reason backward from the failing statement to its likely
cause: "If `UPDATE` is failing at runtime, the program compiled fine, so
this isn't a syntax problem. The most common cause of an `UPDATE` failing
right after a `CHAIN` is that the `CHAIN` didn't actually find a record,
and the program never checked `%FOUND` before trying to update it. I'd
confirm that with `EVAL` on `%found` right after the `CHAIN`, using
`STRDBG`, before assuming anything else." This shows a specific,
reasoned hypothesis, not a vague "I'd look around."

## Common Weak Answers to Avoid

- Jumping straight to "I'd start the debugger" without mentioning the job
  log at all, even though it often already names the problem.
- Treating "two users, same code, one fails" as a code bug before
  considering timing and locking, which is a very common real cause
  covered in the Troubleshooting Locked Record Scenario mini project.
- For a missing overnight report, assuming the wrapper program itself
  must have failed without separately checking the batch job's own job
  log, as covered in the Batch Job Failure Investigation mini project.

## Practical Examples

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);
dcl-s paymentAmt packed(9:2);

custNbr = 9999;
paymentAmt = 50.00;

chain custNbr CUSTMAST;
CUSTBAL -= paymentAmt;
update CUSTMAST;
```

A strong interview answer identifies the missing check immediately:
there is no `%found(CUSTMAST)` check between the `CHAIN` and the
`UPDATE`, so if `custNbr` does not exist in `CUSTMAST`, the `UPDATE` has
no current record to act on and fails at runtime, exactly the scenario
walked through in the Debugging a Broken File I/O Program mini project.

## Mini Practice Task

Given only the symptom "a batch report job ended successfully according
to `WRKSBMJOB`, but no spool file was produced," write out, in order, the
three or four things you would check before assuming the report program
itself has a bug.

## Quick Recap

- Always check the job log before starting a debug session; it often
  already names the failing statement.
- A runtime error means the program compiled; a compile error means it
  never ran at all, and the two point you toward very different causes.
- Two jobs failing inconsistently on the same code often points toward
  timing, locking, or data issues, not a code bug.

## Try Asking the AI Tutor

Use the AI Tutor to practice these scenarios. For example, try asking:

- "Can you give me a debugging scenario and ask me to explain my
  investigation steps out loud, one at a time?"
- "How would I explain the difference between a compile error and a
  runtime error in an interview?"
