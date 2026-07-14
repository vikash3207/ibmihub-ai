# RPGLE Scenario-Based Interview Practice

## What This Lesson Prepares You For

This lesson builds on the RPGLE Basic Interview Questions and RPGLE File
I/O Interview Scenarios lessons with additional, code-reading style
practice: being shown a small snippet and asked to explain what it does
or find what's wrong with it, exactly the format many real interviews
use.

## Concepts to Revise First

- RPGLE Basic Interview Questions, and RPGLE File I/O Interview
  Scenarios.
- `CHAIN`, `%FOUND`, `WRITE`, `UPDATE`, and `DELETE`.
- The Customer Maintenance Add/Change/Delete mini project.

## Common Interview or Job Discussion Scenarios

- "Here's a short RPGLE snippet. Can you tell me what it does?"
- "What would happen if this specific line were removed?"
- "Is there a bug in this code, and if so, where?"

## Strong Beginner-Level Answer Approach

For code-reading questions, a strong approach is to narrate the code in
order, out loud, before jumping to conclusions: what each declaration is
for, then what happens on each meaningful line, then whether anything
looks missing. This shows a methodical reading process rather than a
guess.

## Weak Answers to Avoid

- Jumping straight to "this looks fine" without actually tracing through
  what happens for a specific input.
- Spotting a real issue but describing it vaguely, like "something's
  wrong with the update," instead of naming the exact missing check or
  line.
- Assuming every snippet must contain a bug, when sometimes the correct
  answer is that the code is genuinely fine.

## Scenario-Based Practice

Consider this snippet, adapted from the same shape of program as the
Customer Maintenance Add/Change/Delete mini project:

```rpgle
dcl-f CUSTMNTD workstn;
dcl-f CUSTMAST disk keyed;

dow not exitRequested;
  exfmt MNTFMT;

  if *in03;
    exitRequested = *on;
  elseif *in05;
    chain CUSTNBR CUSTMAST;
    update CUSTMAST;
  endif;
enddo;
```

Practice explaining what is wrong here before reading further: the F5
branch calls `CHAIN` but never checks `%FOUND` before calling `UPDATE`,
so entering a customer number that does not exist would cause a runtime
error, exactly the mistake called out in the Customer Maintenance
Add/Change/Delete mini project and the RPGLE File I/O Interview
Scenarios lesson.

## How to Explain Your Thinking Clearly

A useful structure for this kind of answer is: describe what the code is
trying to do, name the specific missing piece, and explain what would
actually happen without it. For example: "This branch is meant to update
a customer after looking them up by number. It's missing a `%found`
check between the `CHAIN` and the `UPDATE`. If the entered number
doesn't match any record, `UPDATE` would fail at runtime, because there's
no current record for it to act on."

## Practical IBM i Example

```rpgle
elseif *in05;
  chain CUSTNBR CUSTMAST;
  if %found(CUSTMAST);
    update CUSTMAST;
  else;
    *in50 = *on;
  endif;
endif;
```

This is the corrected version of the snippet above: adding the
`%found(CUSTMAST)` check before `UPDATE` closes the gap, and setting an
error indicator in the `else` branch gives the user a clear message
instead of letting the program fail.

## Mini Practice Task

Write a short RPGLE snippet, on paper, with one deliberate bug similar to
the one above, either a missing `%found` check or a missing `keyed`
keyword on a `dcl-f`. Then explain, out loud, what would happen when the
bug is triggered.

## Quick Recap

- Code-reading questions reward a methodical, line-by-line narration over
  a quick guess.
- A missing `%found` check before `UPDATE` or `DELETE` is one of the most
  common, realistic bugs to be asked to spot.
- Naming the exact missing line, and what happens without it, is a much
  stronger answer than a vague "something's off."

## Try Asking the AI Tutor

Use the AI Tutor to practice this format. For example, try asking:

- "Can you show me a short RPGLE snippet with a bug and ask me to find
  it, one snippet at a time?"
- "How would I explain, step by step, what happens when %found is
  skipped after a CHAIN?"
