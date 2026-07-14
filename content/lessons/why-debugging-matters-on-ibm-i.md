# Why Debugging Matters on IBM i

## Learning Objective

By the end of this lesson, you will understand why debugging is a normal,
routine part of IBM i development, not a sign that something has gone
wrong with you as a developer.

## Simple Explanation

The Debugging RPGLE Programs lesson introduced a few beginner-friendly
starting points, `dsply` tracing, the ILE source debugger, and job logs,
without dwelling on why debugging matters in the first place. Every
program covered throughout this path, from a simple `dsply` statement to
a full report using embedded SQL, can behave unexpectedly the first time
it runs. **Debugging** is simply the systematic process of finding out
why, closing the gap between what a program was expected to do and what
it actually did.

This is completely normal. Every developer, no matter how experienced,
spends real time debugging. A program failing to work correctly on the
first try is not a mark of failure; it is an expected, routine part of
writing software, on IBM i exactly as on any other platform.

## Why It Matters

Treating debugging as a normal, expected activity, rather than something
to feel discouraged by, changes how a developer approaches an unexpected
result: as a solvable investigation with a systematic process, rather
than a personal setback. This mindset matters just as much as any
specific technique, since the lessons that follow in this group build on
exactly this kind of methodical, investigative approach.

## Practical Example

Imagine a new developer's first RPGLE program compiling successfully but
producing a wrong customer balance. A discouraged reaction might be to
assume something is fundamentally wrong with their understanding of
RPGLE. A more productive reaction, and the one this lesson group builds
toward, is to treat it as a normal debugging task: check the job log,
step through the calculation with the ILE source debugger, and narrow
down exactly where the expected and actual values diverge.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common first experience for anyone
new to IBM i development.

## Common Confusions

**"Does needing to debug a program mean I made a serious mistake?"**
Not inherently. Needing to debug simply means a program's actual
behavior did not match what was expected on the first try, which happens
to developers at every experience level, for reasons ranging from small
typos to genuine logic errors.

**"Is debugging something only beginners need to do a lot of?"**
No. Experienced developers debug regularly too, often on more complex
problems. What tends to change with experience is not how often
debugging happens, but how quickly and systematically a developer can
narrow down a problem.

**"Do I need to memorize every possible IBM i error before I can debug
effectively?"**
No. This lesson group focuses on a systematic process and a small set of
practical tools, covered in the lessons that follow, rather than
memorizing every specific error in advance.

## Quick Recap

- Debugging is the systematic process of finding out why a program's
  actual behavior does not match what was expected.
- Every developer, at every experience level, spends real time debugging;
  it is a normal, routine part of writing software.
- A program not working correctly on the first try is not a sign of
  failure, but an expected part of the development process.
- This lesson group builds a systematic, practical approach to debugging
  on IBM i, rather than relying on memorizing every possible error.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the difference between a systematic debugging approach and
  just guessing at what might be wrong?"
- "How do experienced IBM i developers usually decide where to start
  investigating a problem?"
