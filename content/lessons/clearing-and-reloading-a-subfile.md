# Clearing and Reloading a Subfile

## Learning Objective

By the end of this lesson, you will understand why a subfile commonly
needs to be cleared and reloaded more than once during a single program
run, and be able to recognize this pattern in an interactive subfile
screen.

## Simple Explanation

In the SFLDSP, SFLDSPCTL, and SFLCLR Explained lesson, you learned the
basic clear-load-display lifecycle: `SFLCLR` on, load records, then
`SFLDSP` on to display them. That earlier lesson covered this happening
once. In a real, interactive subfile screen, this same clear-and-reload
sequence commonly happens **more than once** while the program keeps
running, not just at the very start.

A very common reason for this is a refresh function key, such as F5,
covered in the Function Keys in More Depth lesson: the user asks to see
updated information without leaving the screen entirely. Handling this
means repeating the same clear-load-display sequence again, from
scratch, rather than only performing it once when the program first
starts.

## Why It Matters

Recognizing that clearing and reloading is not a one-time setup step, but
something a subfile program commonly repeats in response to user actions,
matters because it shapes how the underlying logic is organized: the
clear-load-display sequence is generally written so it can run again
cleanly, any number of times, rather than being written as code that only
works correctly the very first time it runs.

## Practical Example

Imagine the order list subfile from earlier lessons in this group,
supporting F5 to refresh. When the user first opens the screen, the
program clears the subfile, loads the customer's current orders, and
displays them. If the user later presses F5, expecting to see any orders
that may have been added since, the program repeats that exact same clear-
load-display sequence again: clearing out the previously loaded orders,
reloading the current set, and displaying the refreshed list, without
the user ever leaving the screen.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical reason subfile clearing
and loading is written to repeat cleanly, not just run once.

## Common Confusions

**"Does refreshing a subfile require different keywords than the initial
load?"**
No. Refreshing reuses the exact same `SFLCLR`, load loop, and
`SFLDSP`/`SFLDSPCTL` sequence covered in the SFLDSP, SFLDSPCTL, and SFLCLR
Explained lesson; what changes is simply that this sequence runs again,
triggered by something like an F5 press, rather than running only once.

**"If I forget to clear the subfile before reloading it on a refresh,
what actually goes wrong?"**
Without clearing first, newly loaded records would be added alongside
whatever was already in the subfile from before, rather than replacing it,
producing a list with duplicated or stale entries mixed in with current
ones.

**"Does every function key that returns to this screen trigger a
reload?"**
Not necessarily. Some function keys, such as one that simply lets the
user page through an already-loaded list, do not need a reload at all. A
reload is specifically needed when the underlying data the subfile is
based on may have changed and the user needs to see that updated data.

## Quick Recap

- Clearing and reloading a subfile commonly happens more than once during
  a single program run, not just as a one-time setup step.
- A refresh function key, such as F5, is a common, practical reason to
  repeat the clear-load-display sequence.
- Refreshing reuses the same `SFLCLR`, load loop, and `SFLDSP`/`SFLDSPCTL`
  sequence already covered, simply run again.
- Skipping the clear step on a reload produces a list with duplicated or
  stale entries mixed in with current data.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Besides F5, what are some other realistic reasons a subfile might need
  to be reloaded during the same program run?"
- "Is there a way to refresh a subfile without a full clear-and-reload
  cycle?"
