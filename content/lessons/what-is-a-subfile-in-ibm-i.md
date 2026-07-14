# What is a Subfile in IBM i?

## Learning Objective

By the end of this lesson, you will understand why subfiles exist, and be
able to explain what problem they solve compared to the single-record
screens covered so far in this lesson group.

## Simple Explanation

Every inquiry screen covered so far in this lesson group, including the
pattern described in the Basic Inquiry Screen Pattern lesson, shows exactly
one record's worth of information at a time: one customer, one order.
Real IBM i applications very often need to show a **list** of records at
once instead, such as every order placed by a customer, or every product
matching a search. This is exactly the problem a **subfile** solves.

A subfile is a special kind of display file record format that can hold
and display **more than one record at a time** on a single 5250 screen,
letting a user see and scroll through a list, rather than being limited to
one record per screen the way every regular record format covered so far
has been.

It helps to think of it this way: a regular record format, as covered in
the Display File Record Formats lesson, is like one page showing one
thing. A subfile is more like a small, scrollable table embedded within a
screen, where each row shows one record, and the user can page or scroll
through many rows without the program needing to build a separate screen
for every single one.

## Why It Matters

Understanding why subfiles exist, to show a list of records rather than
just one, is essential before learning the specific DDS keywords and
RPGLE patterns that make them work, covered in the lessons that follow.
Without this "why" first, the keywords covered later can feel like
arbitrary syntax rather than tools solving a genuine, common problem.

## Practical Example

Imagine needing to show every order a specific customer has placed. A
single-record screen, like the ones covered earlier in this lesson group,
could only show one order at a time, forcing a user to somehow step
through each order individually. A subfile instead lets the program load
that customer's orders into a scrollable list, all shown together on one
screen, letting the user see several orders at once and page through the
rest.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects exactly the kind of everyday problem subfiles are
built to solve.

## Common Confusions

**"Is a subfile a completely different kind of file object from a display
file?"**
No. A subfile is not a separate object; it is a special kind of record
format defined within an ordinary display file, alongside any regular
record formats that display file might also have.

**"Could I show a list of records using several regular record formats
instead of a subfile?"**
Not practically for more than a handful of records. A regular record
format has a fixed, predetermined layout; showing an unknown, potentially
large number of records this way would require a separate record format
for every possible count, which is not workable. Subfiles exist
specifically to handle this kind of variable-length list cleanly.

**"Do I need to learn subfiles to build any interactive IBM i screen?"**
No. Plenty of screens, including everything covered earlier in this lesson
group, work perfectly well without subfiles, whenever showing one record
at a time is enough. Subfiles matter specifically once a screen needs to
show a list.

## Quick Recap

- A subfile is a special kind of display file record format that can hold
  and display more than one record at once on a single 5250 screen.
- Subfiles solve the problem of showing a list, such as every order for a
  customer, which a regular, single-record record format cannot do
  practically.
- A subfile is not a separate object; it is defined within an ordinary
  display file, alongside any regular record formats.
- Understanding this underlying problem, showing a list rather than one
  record, is the foundation for the specific subfile keywords and patterns
  covered in the lessons that follow.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some real IBM i screens that commonly use subfiles?"
- "Is there a limit to how many records a subfile can hold?"
