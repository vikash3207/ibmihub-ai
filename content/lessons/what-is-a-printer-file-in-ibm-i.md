# What is a Printer File in IBM i?

## Learning Objective

By the end of this lesson, you will understand what a printer file is,
how it fits alongside the physical, logical, and display files you
already know about, and what its output typically becomes.

## Simple Explanation

You have already learned that a physical file stores business data, and
that a display file, a kind of workstation file, describes a 5250
screen's layout. A **printer file** is a third kind of IBM i file object,
type `*FILE`, that describes the layout of **printed or report output**
instead: what appears on a printed page, line by line.

Like physical and display files, a printer file is defined using **DDS**,
the same Data Description Specifications syntax covered in the DDS and
SQL: Two Ways to Define Db2 for i Data lesson, though a printer file's DDS
describes printed report lines rather than stored data or a screen. A
printer file is declared with the device type **`PRINTER`**, just as a
physical file uses `DISK` and a display file uses `WORKSTN`.

An RPGLE program does not format a printed page directly. Instead, it
works with a printer file, which handles the actual layout, and the
program's output generally becomes a **spool file**, the generated output
artifact introduced in the Job Logs and Spool Files Basics lesson, rather
than paper coming out of a printer immediately.

## Why It Matters

Understanding that printed reports come from a printer file object,
separate from the RPGLE program that writes to it, mirrors the same
division of responsibility already covered for display files: the file
object defines layout, while the program focuses on the business logic of
what data to report. This separation is exactly why the same basic report
pattern shows up across countless IBM i business applications.

## Practical Example

Imagine a program that needs to print a daily list of customer balances,
using the `CUSTMAST` physical file. A printer file object defines how each
line of that report should look, headings, columns, and spacing. The
RPGLE program reads through `CUSTMAST`'s records and writes each one to
the printer file, and IBM i produces a spool file containing the finished
report, ready to be viewed or actually printed.

This is a simplified, illustrative example rather than a specific real
report, but it reflects the basic shape of how printed reports are
produced on IBM i.

## Common Confusions

**"Is a printer file the same thing as a physical file?"**
No. Both share the `*FILE` object type, but a physical file stores actual
business data, while a printer file describes the layout of printed
output. Neither one stores the other's kind of information.

**"Does writing to a printer file immediately print something on paper?"**
Not directly. A program's output to a printer file generally becomes a
spool file first, as covered in the Job Logs and Spool Files Basics
lesson, and the Spool Files and Output Queues lesson later in this group
covers what happens to that spool file next.

**"Is a printer file the same kind of file as a display file?"**
Not quite. Both are defined with DDS and both describe output rather than
storing business data, but a display file describes an interactive 5250
screen, while a printer file describes printed report output; they use
different device types, `WORKSTN` and `PRINTER`, for exactly this reason.

## Quick Recap

- A printer file is an IBM i object, type `*FILE`, that describes the
  layout of printed or report output, defined using DDS.
- A printer file uses the device type `PRINTER`, just as physical files
  use `DISK` and display files use `WORKSTN`.
- An RPGLE program works with a printer file rather than formatting a
  printed page directly itself.
- Writing to a printer file generally produces a spool file, rather than
  immediately printing on paper.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why would IBM i produce a spool file instead of printing immediately?"
- "Can one RPGLE program write to more than one printer file?"
