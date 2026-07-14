# Multi-Record Format Reports

## Learning Objective

By the end of this lesson, you will be able to distinguish a report-level
heading, printed once for the whole report, from a page-level heading,
printed again on every page, as two separate record formats.

## Simple Explanation

The Page Overflow Basics lesson reprinted `HDGFMT` on every new page,
which works well for column headings that should appear on every page.
Some reports also need something printed only once, at the very start of
the whole report, such as a report title or the date it was run. This
calls for a **second, separate record format**, used only once, alongside
the page heading that repeats.

```rpgle
dcl-f CUSTRPTP printer;
dcl-f CUSTMAST disk;

write RPTHDG;
write HDGFMT;

read CUSTMAST;
dow not %eof(CUSTMAST);
  if *inof;
    write HDGFMT;
  endif;

  write DTLFMT;

  read CUSTMAST;
enddo;
```

Here, `RPTHDG` is a new record format, written exactly once, before
anything else, showing something like the report's title and run date.
`HDGFMT` keeps its role from earlier lessons: printed once at the start
and again on every page after that, via the overflow indicator check. The
result is a report whose very first page shows both the one-time report
title and the recurring column headings, while every later page shows
only the recurring column headings.

## Why It Matters

Recognizing that a report can combine several record formats, each
serving a distinct purpose, print-once, print-per-page, and print-per-row,
explains why real IBM i reports often have more structure than a single
heading and a single detail line. Choosing the right record format for
each piece of a report is what makes its layout come out exactly as
intended.

## Practical Example

Imagine the daily customer balance report needing a title page element
reading "Customer Balance Report -- Run Date: Today," shown only once, at
the very top of the very first page, while "Customer Number," "Name," and
"Balance" column headings should still appear at the top of every single
page so a reader flipping to any page can see what each column means.
Using `RPTHDG` for the one-time title and `HDGFMT` for the recurring
column headings, exactly as shown above, achieves both at once.

This is a simplified, illustrative example rather than a specific real
report, but it reflects a genuinely common structure for longer,
multi-page IBM i reports.

## Common Confusions

**"Why not just put the report title inside HDGFMT itself, since it
already prints on every page?"**
That would work, but it would repeat the report title on every single
page, not just the first one. Using a separate, print-once record format
for the title keeps it appearing exactly once, while `HDGFMT` continues
to repeat only the column headings that are actually useful to see again
on every page.

**"Does RPTHDG need its own overflow check, like HDGFMT has?"**
No. `RPTHDG` is written exactly once, before the loop even begins, so
there is no need to check the overflow indicator for it; the overflow
check in this lesson's example still applies only to `HDGFMT`, reprinted
on later pages.

**"Can a report have more than two kinds of heading, beyond RPTHDG and
HDGFMT?"**
In principle, yes, additional record formats could serve other specific
purposes. This lesson focuses on the common, practical case of a
print-once report heading alongside a print-per-page column heading,
which covers the vast majority of everyday reports.

## Quick Recap

- A report-level heading, printed exactly once for the whole report, and
  a page-level heading, printed again on every page, are best kept as two
  separate record formats.
- The report-level heading is written once, before the loop begins, with
  no overflow check needed.
- The page-level heading keeps the same overflow-indicator pattern
  covered in the Page Overflow Basics lesson.
- Choosing the right record format for each part of a report, print-once,
  print-per-page, or print-per-row, is what gives a report its intended
  structure.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would this report look like if RPTHDG were accidentally written
  inside the read loop instead of before it?"
- "Could a report have a different one-time closing format, similar to
  RPTHDG but printed at the very end instead of the start?"
