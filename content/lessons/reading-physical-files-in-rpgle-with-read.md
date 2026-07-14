# Reading Physical Files in RPGLE with READ

## Learning Objective

By the end of this lesson, you will be able to use `READ` in a loop to
process every record in a physical file from beginning to end.

## Simple Explanation

Once a database file is declared with `dcl-f`, as covered in the previous
lesson, the RPGLE **`READ`** operation retrieves the next record from that
file, one at a time, in whatever order the file naturally stores them,
commonly arrival sequence for an unkeyed file. This is distinct from the
`read` operation covered for display files, which waits for a user's
response to a screen; here, `READ` retrieves the next stored record from
a database file instead.

```rpgle
dcl-f CUSTMAST disk;

read CUSTMAST;
dow not %eof(CUSTMAST);
  dsply CUSTNAME;

  read CUSTMAST;
enddo;

*inlr = *on;
```

This loop follows the same shape as the `READC` loop covered in the
Selecting a Row in a Subfile lesson: `READ` is called once before the
loop starts, and again at the bottom of the loop, with `%EOF`, covered
fully in the next lesson, checked as the loop's condition. Each pass
through the loop processes one record retrieved from `CUSTMAST`, here
simply displaying its customer name.

## Why It Matters

`READ` is the most basic way an RPGLE program processes every record in a
file, one at a time, which underlies many real business tasks: producing
a report, checking every record for a condition, or performing the same
action across an entire file. Understanding this loop shape is
foundational to nearly all native RPGLE file processing.

## Practical Example

Imagine a program that needs to display every customer's name in
`CUSTMAST`. Using the loop shown above, the program reads the first
customer record, displays its name, reads the next one, and continues
until every record has been processed, at which point the loop ends
naturally.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the essential, everyday shape of reading through
an entire physical file in RPGLE.

## Common Confusions

**"Is this the same READ operation covered for display files?"**
No, though the operation name is the same. `READ` on a database file
retrieves the next stored record from that file. `read` on a display
file, covered in the READ, WRITE, EXFMT, and Screen Flow lesson, waits
for a user's response to a screen already shown. The same operation name
behaves differently depending on the kind of file it is used with.

**"What order does READ retrieve records in?"**
For a file without a key, `READ` retrieves records in arrival sequence,
the order they were originally stored, as covered in the Keyed Physical
Files lesson. A keyed file can also be read this way, though `CHAIN`,
covered in a later lesson, is used instead when looking up one specific
record by key.

**"Do I need the keyed keyword on dcl-f just to use READ this way?"**
No. Reading through a file from beginning to end with `READ` does not
require `keyed`; `keyed` is specifically needed for `CHAIN`-based key
lookups, covered later in this lesson group.

## Quick Recap

- `READ` retrieves the next record from a database file, one at a time,
  commonly in arrival sequence for an unkeyed file.
- A basic read loop calls `READ` once before the loop and again at the
  bottom, the same shape used for `READC` with subfiles.
- `READ` on a database file is a different operation, despite the shared
  name, from `read` on a display file, which waits for user input instead.
- Reading through an entire file this way is foundational to many common
  RPGLE tasks, such as reports or full-file processing.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I call READ on a file that has no records at all?"
- "Can I read a physical file in a specific field order without adding a
  key to it?"
