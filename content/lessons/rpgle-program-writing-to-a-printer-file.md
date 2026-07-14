# RPGLE Program Writing to a Printer File

## Learning Objective

By the end of this lesson, you will be able to declare a printer file in
free-format RPGLE using `dcl-f`, and use `WRITE` to print a specific
record format.

## Simple Explanation

A printer file is declared in free-format RPGLE using **`dcl-f`**, the
same keyword used for database and display files, with the device type
**`printer`** identifying it as a printer file.

```rpgle
dcl-f CUSTRPTP printer;

dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBal packed(9:2);

custNbr = 1042;

exec sql
  select CUSTNAME, CUSTBAL into :custName, :custBal
  from CUSTMAST
  where CUSTNBR = :custNbr;

write HDGFMT;

if sqlcode = 0;
  write DTLFMT;
endif;
```

Here, `dcl-f CUSTRPTP printer;` declares `CUSTRPTP` as the printer file
this program writes to, using the heading and detail record formats,
`HDGFMT` and `DTLFMT`, covered in the Report Record Formats lesson.
`write HDGFMT;` prints the heading line, and `write DTLFMT;` prints one
detail line using whatever values are currently in the fields that
`DTLFMT` shares with the RPGLE program, such as `custName` and `custBal`
retrieved above.

## Why It Matters

`WRITE` is the same operation already covered for adding a new record to
a physical file in the Writing Records with WRITE lesson; here it means
something different again: printing one line to a printer file, using
whichever record format is named. Recognizing that `WRITE` behaves
differently depending on the kind of file it targets, physical, display,
or printer, is essential for reading RPGLE code correctly.

## Practical Example

Imagine the daily customer balance report described throughout this
lesson group. The program declares `CUSTRPTP` as its printer file, writes
`HDGFMT` once to print the report's title and column headings, then, for
each customer retrieved, writes `DTLFMT` to print that customer's number,
name, and balance as one line on the report.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the core pattern behind how an RPGLE program
actually produces a printed report.

## Common Confusions

**"Is this the same WRITE operation covered for physical files?"**
It is the same RPGLE operation name, `WRITE`, but it behaves differently
depending on the file it targets. On a physical file, `WRITE` adds a new
stored record, as covered in the Writing Records with WRITE lesson. On a
printer file, `WRITE` prints one line using the named record format.

**"Does writing HDGFMT and DTLFMT in this order guarantee the heading
prints before the detail line?"**
Yes, within a single program's flow: RPGLE statements execute in the
order written, so `write HDGFMT;` printing before `write DTLFMT;` in the
code means the heading line appears before the detail line on the
report.

**"Can a printer file be declared alongside a database file in the same
program, like CUSTRPTP and CUSTMAST here?"**
Yes. A single RPGLE program can declare more than one file, of different
kinds, at the same time, exactly as this lesson's example works with both
a database file, accessed here through embedded SQL, and a printer file
together.

## Quick Recap

- `dcl-f fileName printer;` declares a printer file in free-format RPGLE.
- `WRITE recordFormat;` prints one line to the printer file, using the
  named record format.
- `WRITE` behaves differently depending on the file it targets: adding a
  stored record for a physical file, versus printing a line for a printer
  file.
- A single RPGLE program can declare and use a printer file alongside a
  database file at the same time.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I write DTLFMT without ever writing HDGFMT first?"
- "Can a printer file's fields be filled in using native RPGLE file I/O
  instead of embedded SQL?"
