# Printer File vs Display File vs Database File

## Learning Objective

By the end of this lesson, you will be able to clearly compare printer
files, display files, and database files: what each one is for, and which
RPGLE operations are typically used with each.

## Simple Explanation

This lesson group, together with the earlier Display Files and native
RPGLE File I/O lesson groups, has now covered all three major kinds of
files an RPGLE program commonly works with. Bringing them together in one
place:

- A **database file**, a physical or logical file, uses the device type
  `disk` and stores structured business data, read and changed with
  `READ`, `CHAIN`, `WRITE`, `UPDATE`, and `DELETE`, covered throughout the
  RPGLE File I/O lessons.
- A **display file** uses the device type `workstn` and describes an
  interactive 5250 screen, worked with primarily through `exfmt`, covered
  in the RPGLE Program Calling a Display File lesson.
- A **printer file** uses the device type `printer` and describes printed
  report output, worked with through `WRITE`, covered throughout this
  lesson group, though `WRITE` here prints a line rather than adding a
  stored record.

All three share the same underlying idea, an externally described `*FILE`
object defined with DDS, but each serves a genuinely different purpose,
and each pairs with different RPGLE operations that make sense for that
purpose.

## Why It Matters

Recognizing which kind of file a program is working with, from its device
type on `dcl-f`, immediately tells you what to expect: whether `WRITE`
means adding a stored record or printing a line, whether the file expects
interactive user input, or whether it exists purely to hold structured
data. This recognition is foundational for reading any RPGLE program
quickly and correctly.

## Practical Example

Imagine a single RPGLE program handling the daily customer balance
report end to end. It declares `CUSTMAST` as a database file with `disk`,
reading through it with native `READ`. It declares `CUSTRPTP` as a
printer file with `printer`, writing heading, detail, and total record
formats to it. If the same program also needed to show a summary screen
to an operator afterward, it might additionally declare a display file
with `workstn`, using `exfmt` to show that screen.

This is a simplified, illustrative example rather than a specific real
program, but it reflects how a single RPGLE program can genuinely combine
all three kinds of files, each used for exactly what it is meant for.

## Common Confusions

**"Since WRITE works on both database files and printer files, does it
always do the same thing?"**
No. `WRITE` on a database file adds a new stored record, as covered in
the Writing Records with WRITE lesson. `WRITE` on a printer file prints
one line using the named record format, as covered in the RPGLE Program
Writing to a Printer File lesson. Same operation name, genuinely
different behavior, depending on the device type.

**"Can a display file also produce a spool file, the way a printer file
does?"**
No, not in the way covered in this lesson group. Spool files, covered in
the Spool Files and Output Queues lesson, come from printer file output
specifically; a display file's purpose is interactive screen
communication, not generating report output.

**"Do all three file types require DDS?"**
Yes, all three are commonly defined using DDS, describing stored fields
for a database file, screen layout for a display file, or printed lines
for a printer file. The DDS syntax family is shared; what it describes
differs by file type.

## Quick Recap

- Database files (`disk`) store structured business data, used with
  `READ`, `CHAIN`, `WRITE`, `UPDATE`, and `DELETE`.
- Display files (`workstn`) describe interactive 5250 screens, used
  primarily with `exfmt`.
- Printer files (`printer`) describe printed report output, used with
  `WRITE` to print a specific record format.
- All three are externally described `*FILE` objects defined with DDS,
  but each serves a distinct purpose with its own typical RPGLE
  operations.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Could a single RPGLE program realistically use all three file types at
  once, and if so, why?"
- "Is there a fourth device type beyond disk, workstn, and printer that
  RPGLE programs commonly use?"
