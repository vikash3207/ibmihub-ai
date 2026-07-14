# Understanding RRN in Subfile Programs

## Learning Objective

By the end of this lesson, you will understand what the Relative Record
Number, or RRN, actually is at a mechanical level, and how an RPGLE
program uses it to know exactly which subfile row it is working with.

## Simple Explanation

In the Page-at-a-Time Subfile Concept lesson, RRN was introduced
conceptually as a way of tracking position, without going into the
mechanics. Since RRN is one of the most common sources of confusion for
beginners working with subfiles, it is worth explaining carefully and
concretely here.

Every record written into a subfile occupies a specific, numbered
position: the first record is relative record 1, the second is relative
record 2, and so on. This position is the **RRN**. A subfile record format
commonly includes a small, hidden field tied to this position using the
DDS keyword **`SFLRCDNBR`** (Subfile Record Number), which links a program
variable directly to the RRN of the current record.

This matters because a subfile row, once shown on screen, no longer
directly carries the business fields you originally used to identify a
specific record, such as a customer number, in the program's mind. When
the user does something to a specific row later, such as selecting it or
changing an option field, the program needs a reliable way to know exactly
which underlying record that row corresponds to. RRN is that reliable
way: by reading a row's RRN, the program can look up or act on exactly the
right record, regardless of how the rows happen to be sorted or displayed
on screen.

## Why It Matters

Without a clear, concrete grasp of RRN, working with anything beyond a
simple load-all display, such as processing a user's row selection,
becomes confusing: it is easy to assume a row's position on screen always
matches some other value, like an array index or a business key, when
what actually identifies a specific subfile row is its RRN. Getting this
clear now makes the lessons that follow, covering row selection and
update/delete patterns, much easier to understand.

## Practical Example

Imagine the order list subfile from earlier lessons in this group, where
each row shown corresponds to one order record written into the subfile.
The subfile record format includes a hidden field, tied to `SFLRCDNBR`,
that holds each row's RRN as it is written. If a user later selects the
third row shown, the program does not need to guess which order that
was; it reads that row's RRN, which reliably identifies exactly which
subfile record was written third, regardless of what business data that
particular order happened to contain.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how RRN is used to reliably connect a
displayed row back to a specific record.

## Common Confusions

**"Is RRN the same thing as a business key, like a customer or order
number?"**
No. RRN identifies a record's position within the subfile itself, unrelated
to any business meaning. An order's RRN might be 3 while its actual order
number is a completely different value, such as 1042. RRN and business
keys serve entirely different purposes.

**"Does every subfile record format need an SFLRCDNBR field?"**
Not strictly for very simple, load-all-only screens where the user never
selects or acts on individual rows. `SFLRCDNBR` becomes important
specifically once a program needs to reliably identify which record a
displayed row corresponds to, such as for row selection, covered in a
later lesson.

**"Does RRN change if the subfile is resorted or filtered?"**
RRN reflects the order records were actually written into the subfile,
not any particular business ordering. If a program clears and reloads a
subfile in a different order, the RRN values are effectively reassigned to
whatever new order the records are written in.

## Quick Recap

- RRN, the Relative Record Number, identifies a record's position within
  a subfile: first written, second written, and so on.
- `SFLRCDNBR` ties a hidden field on the subfile record format to a
  program variable holding each record's RRN.
- RRN lets a program reliably identify exactly which underlying record a
  displayed row corresponds to, independent of that record's own business
  data.
- RRN is unrelated to business keys, such as a customer or order number,
  and reflects write order, not any business ordering.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does a program actually read a specific record back out of a
  subfile using its RRN?"
- "What happens to RRN values if I clear and reload a subfile with the
  same records in a different order?"
