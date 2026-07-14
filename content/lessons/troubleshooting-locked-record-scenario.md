# Mini Project: Troubleshooting Locked Record Scenario

## What We Are Building

Not new code, but a guided troubleshooting exercise: two users both
trying to update the same customer in `CUSTMNT` at nearly the same
moment, walked through using the tools covered across the Object Locks
and Operations lesson groups.

## Business Scenario

Imagine two representatives, unaware of each other, both pulling up the
same customer in the Customer Maintenance Add/Change/Delete mini
project's `CUSTMNT` at the same time, both trying to update that
customer's balance. One of them is going to run into a record lock.

## Concepts Used

- Record locks, from the Basic File Locking Concept in RPGLE lesson.
- Object locks and `WRKOBJLCK`, from the Object Locks Basics lesson.
- The wait-ask-end decision process, from the Handling Object Locks as a
  Developer lesson.

## Files and Programs Involved

- **`CUSTMAST`**, the file both users' `CUSTMNT` sessions are working
  against.
- **`CUSTMNT`**, reused without changes from the Customer Maintenance
  Add/Change/Delete mini project.

## Step-by-Step Build Outline

1. User A runs `CUSTMNT`, enters a customer number, and `CHAIN`s
   successfully, holding a lock on that record while deciding what to
   change.
2. Before User A presses F5 to save, User B runs `CUSTMNT` for the exact
   same customer number and also successfully `CHAIN`s.
3. User A presses F5; their `UPDATE` succeeds normally, since they
   locked the record first.
4. User B, still working from their own earlier `CHAIN`, presses F5;
   their `UPDATE` fails, since the record they retrieved has since
   changed and their own lock attempt on it conflicts.
5. Investigate: use `WRKOBJLCK` against `CUSTMAST` to see the conflict
   directly, following the Handling Object Locks as a Developer lesson's
   decision process.

## Example Code

```rpgle
chain custNbr CUSTMAST;
if %found(CUSTMAST);
  CUSTBAL = 500.00;
  update CUSTMAST;
endif;
```

This is the exact same `CHAIN`-then-`UPDATE` sequence from
`CUSTMNT`, covered in the Customer Maintenance Add/Change/Delete mini
project. The code itself is not the problem here; the problem is purely
about timing between two separate jobs running this exact same code
against the same record at nearly the same moment.

## How to Test It

With two separate sessions signed on, have each one run `CUSTMNT` for
the same customer number, deliberately pausing one of them before
pressing F5 while the other completes its update first, then observing
what happens when the second one finally does press F5.

## Common Mistakes

- Assuming a lock conflict means something is broken in `CUSTMNT`
  itself, rather than recognizing it as expected, normal behavior when
  two jobs genuinely try to change the same record at once.
- Reflexively ending one of the two jobs immediately, rather than first
  checking, as covered in the Handling Object Locks as a Developer
  lesson, whether simply waiting for the first update to finish would
  resolve things on its own.
- Forgetting that each user's own `CHAIN` reflects the record's state at
  the moment they retrieved it, which may already be outdated by the
  time they finally press F5.

## Debugging Checklist

- Confirm the failure is genuinely a lock conflict, not an authority
  problem, by reading the job log message detail, covered in the
  Finding Program Failures from Error Messages lesson.
- Run `WRKOBJLCK` against `CUSTMAST` while both sessions are still
  active, to see which job holds which lock at that exact moment.
- Apply the wait-ask-end decision process from the Handling Object
  Locks as a Developer lesson before taking any disruptive action.

## Possible Extensions

A natural extension is having `CUSTMNT` explicitly report a lock
conflict to the user with a clear on-screen message, using a `monitor`
block around the `UPDATE`, covered in the Handling File I/O Errors at a
Beginner Level lesson, rather than letting the job simply fail.

## Quick Recap

- Two jobs `CHAIN`ing the same record and both later trying to `UPDATE`
  it is a normal, expected scenario that can produce a lock conflict.
- `WRKOBJLCK` shows exactly which job holds a lock at a given moment.
- The wait-ask-end decision process applies here just as it does for
  any other object lock scenario.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would CUSTMNT be changed to show a clear message to User B
  instead of just failing?"
- "Why does User A's update succeed while User B's fails, even though
  they ran the exact same code?"
