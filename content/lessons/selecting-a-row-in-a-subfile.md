# Selecting a Row in a Subfile

## Learning Objective

By the end of this lesson, you will be able to use `READC` in a loop to
find every subfile row a user entered an option value on, and read the
RRN of each one.

## Simple Explanation

In the Option Fields in Subfile Screens lesson, you learned that a user
can type an option value into specific subfile rows. This lesson covers
how an RPGLE program actually finds out which rows those were, using the
**`READC`** operation (Read Next Changed Record).

`READC` reads the next subfile record the user has changed since it was
last displayed, which, for a subfile with an option field, effectively
means the next row the user typed something into. Used in a loop, `READC`
lets a program step through every changed row, one at a time, until none
remain:

```rpgle
dcl-s optValue char(1);
dcl-s rowRrn packed(5:0);

readc SFLREC;
dow not %eof(SFLREC);
  // optValue and rowRrn now hold this changed row's values,
  // using the SFLRCDNBR field covered in the Understanding RRN
  // in Subfile Programs lesson

  readc SFLREC;
enddo;
```

Here, the loop calls `readc SFLREC;` before checking `%eof(SFLREC)`, and
again at the bottom of the loop, so that each pass through the loop
processes one changed row, using whatever values, including the option
field and the RRN, that row currently holds. Once `READC` finds no more
changed rows, `%eof(SFLREC)` becomes true, and the loop ends.

## Why It Matters

`READC` is the essential link between what a user typed into a subfile's
option fields and what the RPGLE program actually does about it.
Understanding this loop pattern, combined with the RRN concept from the
Understanding RRN in Subfile Programs lesson, is what makes it possible to
process a user's row selections at all.

## Practical Example

Imagine the order list subfile with option fields from the previous
lesson, where a user has typed `2` next to one order and `4` next to
another before submitting the screen. After `exfmt` returns, the RPGLE
program uses a `READC` loop to find both of these changed rows, one at a
time, reading each row's option value and RRN so it knows exactly which
action, and which specific order, to act on next.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the essential, everyday pattern for processing
subfile row selections.

## Common Confusions

**"Does READC read every row in the subfile, not just changed ones?"**
No. `READC` specifically reads only rows the user has changed since the
last display, such as rows where an option value was typed. Rows the user
did not touch are skipped entirely by `READC`.

**"What happens if the user didn't enter an option value on any row at
all?"**
In that case, the very first `READC` call finds no changed rows at all,
`%eof(SFLREC)` becomes true immediately, and the loop body never runs.

**"Does the loop need to call READC both before and after the loop
body?"**
Yes, for this common loop shape: the first call, before the loop starts,
attempts to read the first changed row so the loop's condition can be
checked; the call at the bottom of the loop reads the next changed row
before looping back to check the condition again.

## Quick Recap

- `READC` reads the next subfile record the user has changed since it was
  last displayed, commonly meaning a row with an option value typed into
  it.
- A `READC` loop, checking `%eof()`, processes every changed row one at a
  time until none remain.
- Each changed row's option value and RRN, tied to `SFLRCDNBR`, tell the
  program what to do and which record to do it to.
- `READC` skips rows the user did not touch, and the loop naturally
  produces no iterations if the user entered no option values at all.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the difference between READC and a regular READ operation on a
  subfile?"
- "Can READC read rows in a different order than the user typed option
  values into them?"
