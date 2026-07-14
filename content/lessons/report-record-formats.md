# Report Record Formats

## Learning Objective

By the end of this lesson, you will be able to explain why a printer
file's DDS commonly defines more than one record format, each
representing a different kind of printed line.

## Simple Explanation

A physical file's record format, covered in earlier Db2 for i lessons,
describes one repeating kind of stored record. A printer file's DDS
commonly defines **several different record formats**, each one
describing a different kind of line that can appear on a report:

- A **heading record format** describes lines printed once, typically at
  the top of a page or report, such as a title and column headings.
- A **detail record format** describes one repeating line, printed once
  for each row of underlying data, such as one line per customer.
- A **total record format** describes a summary line, printed once at the
  end of a report, such as a grand total.

An RPGLE program controls which kind of line prints next simply by
writing to whichever record format matches that specific kind of line,
covered in full in the RPGLE Program Writing to a Printer File lesson.

## Why It Matters

Recognizing that a report is built from several distinct record formats,
rather than one single format repeated for everything, explains why a
printer file's DDS is organized the way it is, and sets up exactly how an
RPGLE program later controls a report's actual shape: headings once,
details many times, and a total once at the end.

## Practical Example

Imagine the daily customer balance report from earlier lessons in this
group. Its printer file DDS might define an `HDGFMT` heading record
format for the report title and column headings, a `DTLFMT` detail record
format for one customer's number, name, and balance, and a `TOTFMT` total
record format for the combined balance across every customer listed.

This is a simplified, illustrative example rather than a specific real
report, but it reflects exactly how most basic IBM i reports are
structured around heading, detail, and total record formats.

## Common Confusions

**"Does every printer file need a heading, detail, and total record
format?"**
Not necessarily every one. A very simple report might only need a detail
record format, without a separate total. Heading, detail, and total are
common, typical building blocks, not a strict requirement for every
printer file.

**"Is a detail record format the same thing as a physical file's record
format?"**
Conceptually similar, both describe one repeating unit, but a physical
file's record format describes stored data, while a printer file's detail
record format describes one printed line. They serve different purposes
even though the underlying idea of "one repeating structure" is similar.

**"Can a printer file have more than one detail record format?"**
Yes. A more complex report might need more than one kind of repeating
line, each with its own record format, though this lesson group focuses
on the common, simpler case of a single detail record format per report.

## Quick Recap

- A printer file's DDS commonly defines several record formats: heading,
  detail, and total are the most common kinds.
- A heading record format prints once, typically at the top of a page or
  report.
- A detail record format prints once per row of underlying data.
- A total record format prints once, typically at the end, summarizing
  the report's data.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would a report look like if it only had a detail record format
  and nothing else?"
- "Could a report have more than one total record format, such as a
  subtotal and a grand total?"
