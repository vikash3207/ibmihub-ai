# Printer File DDS Basics

## Learning Objective

By the end of this lesson, you will understand how a printer file's DDS
describes printed report lines, and how this compares to DDS used for
physical and display files.

## Simple Explanation

You already know that DDS describes a physical file's stored fields and a
display file's screen layout. Printer file DDS uses the same underlying
syntax, but describes something different again: the actual lines that
will appear on a printed page.

Where a display file's DDS positions fields on a 24-by-80 screen grid, as
covered in the Basic Display File DDS Keywords lesson, a printer file's
DDS positions text and fields on printed lines instead, describing things
like which column a piece of text or a field starts at, and how far down
the page one line appears relative to the next. Fields on a printer file
can be constant text, such as a column heading printed exactly the same
way every time, or variable fields whose actual value the RPGLE program
supplies when it writes that line.

## Why It Matters

Recognizing that printer file DDS follows the same core DDS ideas already
covered, fields, positioning, and record formats, means the DDS knowledge
built up across physical and display files transfers directly to reading
and understanding printed report layouts, rather than requiring an
entirely new mental model.

## Practical Example

Imagine the daily customer balance report introduced in the previous
lesson. Its printer file DDS might describe a heading line with constant
text like "Customer Balance Report" positioned near the top of the page,
column headings such as "Customer Number," "Name," and "Balance"
positioned above where the actual data will print, and then variable
fields for each customer's actual number, name, and balance, positioned
in aligned columns below those headings.

This is a simplified, illustrative example rather than exact real DDS
syntax, but it reflects the kind of layout information printer file DDS
is meant to describe.

## Common Confusions

**"Is printer file DDS a completely different syntax from physical or
display file DDS?"**
No. It is the same underlying DDS syntax family, describing different
things: physical file DDS describes stored fields, display file DDS
describes a screen, and printer file DDS describes printed lines. The
core idea of describing structure through DDS carries across all three.

**"Can a printer file's DDS include constant text, like column
headings?"**
Yes. Constant text that should print exactly the same way every time,
such as a report title or column headings, is a normal, common part of
printer file DDS, alongside variable fields whose value the program
supplies.

**"Do I need to specify exactly where every line and field goes on the
page?"**
At a basic level, yes, printer file DDS describes specific positioning,
similar in spirit to how display file DDS positions fields on a screen,
covered in the Basic Display File DDS Keywords lesson. The full range of
detailed positioning options is a more advanced topic beyond this
introduction.

## Quick Recap

- Printer file DDS uses the same core DDS syntax as physical and display
  files, but describes printed report lines instead of stored fields or a
  screen.
- A printer file's fields can be constant text, printed the same way every
  time, or variable fields whose value the RPGLE program supplies.
- Printer file DDS positions text and fields on the printed page, similar
  in spirit to how display file DDS positions fields on a screen.
- DDS knowledge from physical and display files transfers directly to
  reading printer file DDS.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does a printer file know when to start printing on a new page?"
- "Can the same field appear in more than one place on a printed report?"
