# Option Fields in Subfile Screens

## Learning Objective

By the end of this lesson, you will understand what an option field is,
how it lets a user choose an action for a specific subfile row, and a few
common option value conventions.

## Simple Explanation

In the Input Fields, Output Fields, and Both Fields lesson, you learned
that an input field lets a user type a value the RPGLE program later
reads. An **option field** applies this same idea to a subfile row: a
small input field, commonly just one or two characters wide, included in
the subfile record format, where the user types a short code indicating
what they want to do with that specific row.

A few widely followed conventions for option values include:

- **`1`** commonly means Select, choosing that row to view or work with
  further.
- **`2`** commonly means Change, indicating the user wants to edit that
  record.
- **`4`** commonly means Delete, indicating the user wants to remove that
  record.

These are conventions, similar in spirit to the function key conventions
covered in the Function Keys in More Depth lesson, not rules enforced by
IBM i itself, though following them makes a screen more familiar to users
who already know other IBM i applications.

Since an option field lives inside the subfile record format, it repeats
once per row, letting the user type a different option value next to each
individual record shown, rather than only being able to act on one record
at a time the way a single input field outside a subfile would work.

## Why It Matters

Option fields are how a subfile-based list screen lets a user act on
specific records within that list, rather than only being able to browse
it. Understanding this pattern is essential before the next lesson, which
covers how an RPGLE program actually detects and processes whatever option
values a user has typed.

## Practical Example

Imagine the order list subfile from earlier lessons in this group,
extended with an option field on each row. A user browsing the list could
type `2` next to a specific order to indicate they want to change it, or
`4` next to a different order to indicate they want to delete it,
entering these option values on however many rows they choose before
submitting the screen.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical way subfile screens let
users act on individual records in a list.

## Common Confusions

**"Does typing an option value immediately perform that action?"**
No. Typing an option value simply records what the user wants to do for
that row; the RPGLE program still needs to notice the option value was
entered and act on it, which is covered in the next lesson.

**"Can a user enter option values on more than one row at once?"**
Yes. Since an option field repeats once per subfile row, a user can
reasonably type option values on several different rows before submitting
the screen, and the program can process each one.

**"Are 1, 2, and 4 the only option values ever used?"**
No. These are common, widely followed conventions, but a screen can define
whatever option values make sense for its own actions; the numbers
themselves are not enforced by IBM i, only followed as convention for
familiarity.

## Quick Recap

- An option field is a small input field included in the subfile record
  format, letting a user type a short code indicating an action for that
  specific row.
- Common conventions include `1` for Select, `2` for Change, and `4` for
  Delete, though these are conventions rather than enforced rules.
- Because an option field repeats per row, a user can enter option values
  on more than one record before submitting the screen.
- Typing an option value only records the user's intent; the RPGLE
  program still needs to detect and act on it.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other common option value conventions besides 1, 2, and
  4?"
- "Can an option field validate that only certain option values are
  allowed?"
