# Debugging Checklist for Beginners

## Learning Objective

By the end of this lesson, you will have a condensed, practical checklist
to run through during an actual debugging session, drawing on both
Debugging Batches covered in this path.

## Simple Explanation

The Basic Troubleshooting Flow for IBM i Developers lesson explained the
reasoning behind a five-step flow. This lesson condenses that, and the
rest of both debugging lesson groups, into a quick checklist for use in
the moment, without re-explaining the reasoning behind each item.

- [ ] Checked the job log with `DSPJOBLOG` or `DSPJOB`.
- [ ] Identified the message ID and displayed its full detail.
- [ ] Confirmed which program, and ideally which operation, the message
  points to.
- [ ] Checked the call stack if the failure happened several calls deep.
- [ ] Confirmed whether it is a compile error or a runtime error.
- [ ] If runtime: confirmed the program was compiled with debugging data.
- [ ] If runtime: started `STRDBG` and set a breakpoint at the relevant
  line.
- [ ] Used `EVAL` to check relevant variables before and after the
  suspect line.
- [ ] If batch: used `WRKACTJOB` to confirm the job's status before
  checking its own job log.
- [ ] If SQLRPGLE: confirmed whether `SQLCODE` was actually checked after
  the relevant statement.

## Why It Matters

A condensed checklist is faster to actually use during a real debugging
session than re-reading full explanations each time. Having it available
as a quick reference turns everything covered across both Debugging
Batches into something immediately actionable, rather than knowledge that
has to be recalled from scratch each time.

## Practical Example

Imagine sitting down to investigate a report producing a wrong total,
with this checklist open alongside. Working through it in order: the job
log shows nothing unusual, the problem is confirmed as a runtime issue
rather than a compile error, and the program is confirmed to already have
debugging data from an earlier compile. `STRDBG` is started, a breakpoint
is set at the total calculation, and `EVAL` confirms the running total
variable's value at each step, quickly narrowing down exactly where it
diverges from the expected amount.

This is a simplified, illustrative example rather than a specific real
session, but it reflects exactly how this checklist is meant to be used
in practice.

## Common Confusions

**"Do I need to check every single item on this list for every
problem?"**
No, exactly as covered in the Basic Troubleshooting Flow for IBM i
Developers lesson. Some items only apply in specific situations, such as
the batch-job and SQLRPGLE-specific items; skip whichever ones do not
apply to the particular problem at hand.

**"Is this checklist a replacement for actually understanding why each
step matters?"**
No. This checklist is meant as a quick reference once the reasoning
behind each step, covered throughout both Debugging Batches, is already
understood. Skipping straight to a checklist without understanding why
each step matters makes it harder to adapt when a specific situation does
not fit neatly into one of these items.

**"Should this checklist be followed in the exact order listed?"**
Generally yes, since it mirrors the flow covered in the Basic
Troubleshooting Flow for IBM i Developers lesson, though, as covered
there, some steps can reasonably be skipped once earlier ones already
explain the problem.

## Quick Recap

- This checklist condenses both Debugging Batches into a quick, practical
  reference for use during an actual debugging session.
- It generally follows the same order as the Basic Troubleshooting Flow
  for IBM i Developers lesson.
- Not every item applies to every problem; batch-job and SQLRPGLE-
  specific items only matter when relevant.
- The checklist is meant to be used once the reasoning behind each step
  is already understood, not as a substitute for that understanding.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Which items on this checklist would I skip if a program failed with a
  compile error?"
- "How would I adapt this checklist for a problem that doesn't seem to
  fit any of these items directly?"
