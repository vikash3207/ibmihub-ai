# Introduction to SFLNXTCHG

## Learning Objective

By the end of this lesson, you will understand, at a conceptual level,
what `SFLNXTCHG` does and why a program might want a subfile row to be
reprocessed by `READC` even though the user did not type anything new
into it.

## Simple Explanation

In the Selecting a Row in a Subfile lesson, you learned that `READC` finds
subfile rows the user has changed since the last display. Normally, "changed"
means the user actually typed something, such as an option value. The DDS
keyword **`SFLNXTCHG`** (Subfile Next Change) lets an RPGLE program mark a
specific subfile row as changed itself, programmatically, even if the user
never touched it again, so that a later `READC` loop will pick that row up
again.

This is useful specifically when a program needs to reprocess a row after
something goes wrong. For example, if a user marks two rows for deletion,
and one deletion fails a validation check, the program can use
`SFLNXTCHG` on that specific row so that, after showing an error message
and redisplaying the screen, the next `READC` loop finds that row again
automatically, without requiring the user to retype the option value
themselves.

## Why It Matters

Without something like `SFLNXTCHG`, a row that failed processing would
simply be treated as unchanged the next time the user submits the screen,
easy to lose track of. `SFLNXTCHG` gives a program a way to say, in
effect, "treat this row as still needing attention," which is a
genuinely useful tool once update/delete patterns, covered in the previous
lesson, need to handle failures gracefully.

## Practical Example

Imagine the update/delete pattern from the previous lesson, where a user
marks an order for deletion, but that specific order cannot actually be
deleted due to a business rule, such as still having an open, unshipped
status. Rather than silently dropping that row's option value, the
program uses `SFLNXTCHG` on it, shows an error message explaining why the
deletion failed, and redisplays the screen. The next `READC` loop finds
that same row again automatically, letting the program remind the user of
the problem without requiring them to retype the delete option
themselves.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common, practical reason
`SFLNXTCHG` exists.

## Common Confusions

**"Does SFLNXTCHG change what the user actually typed into the option
field?"**
No. `SFLNXTCHG` does not change the row's actual field values; it simply
marks the row so that a later `READC` treats it as changed again,
regardless of whether the user retyped anything.

**"Do I need SFLNXTCHG for a basic update/delete pattern that always
succeeds?"**
Not necessarily. `SFLNXTCHG` becomes valuable specifically when handling
failures or situations where a row genuinely needs to be reprocessed; a
simple pattern where every action always succeeds may not need it at all.

**"Is this lesson expected to make me able to fully implement
SFLNXTCHG-based error recovery?"**
No. This lesson introduces `SFLNXTCHG` conceptually, why it exists and
what problem it solves, rather than walking through detailed, complex
changed-record processing logic, which goes beyond this introductory
lesson group.

## Quick Recap

- `SFLNXTCHG` lets a program mark a specific subfile row as changed
  itself, so a later `READC` loop finds it again even if the user did not
  retype anything.
- This is commonly used to reprocess a row after its action failed, such
  as a delete blocked by a business rule.
- `SFLNXTCHG` does not alter the row's actual field values; it only
  affects whether `READC` treats that row as changed.
- This lesson introduces `SFLNXTCHG` at a conceptual level only; detailed
  changed-record processing logic goes beyond this introductory lesson
  group.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other realistic situations where SFLNXTCHG would be
  useful besides a failed delete?"
- "Does SFLNXTCHG affect every row in the subfile or just one at a time?"
