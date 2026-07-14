# Report Headings and Detail Lines

## Learning Objective

By the end of this lesson, you will be able to write a complete report
loop that prints a heading once and a detail line for every row of
underlying data.

## Simple Explanation

The previous lesson showed `write HDGFMT;` and `write DTLFMT;` in
isolation. A real report combines them into a specific, repeatable
pattern: print the heading once, then loop through the underlying data,
printing one detail line per row.

```rpgle
dcl-f CUSTRPTP printer;
dcl-f CUSTMAST disk;

write HDGFMT;

read CUSTMAST;
dow not %eof(CUSTMAST);
  write DTLFMT;

  read CUSTMAST;
enddo;
```

Here, `write HDGFMT;` prints the report's heading exactly once, before
the loop begins. The loop itself follows the same native `READ` and
`%EOF` shape covered in the Reading Physical Files in RPGLE with READ and
Understanding %EOF in RPGLE File Processing lessons: each pass reads the
next `CUSTMAST` record and, as long as one was actually found, writes
`DTLFMT` to print that customer as one detail line. The heading prints
once; the detail line prints once per customer.

## Why It Matters

This heading-then-loop-of-details shape is the single most common pattern
behind basic IBM i reports. Recognizing it means being able to read or
write almost any simple report program, since the same shape applies
whether the underlying data comes from native file I/O, as shown here, or
embedded SQL, as shown in the previous lesson.

## Practical Example

Imagine running the daily customer balance report. The program first
prints the heading, "Customer Balance Report" with column headings, then
reads through `CUSTMAST` one record at a time, printing one detail line
per customer showing their number, name, and balance, until every
customer has been read and printed.

This is a simplified, illustrative example rather than a specific real
report, but it reflects exactly how a basic report moves from raw stored
data to a finished, readable printed page.

## Common Confusions

**"Does the heading need to be written before the read loop starts, or
could it go inside the loop?"**
It needs to be written once, before the loop, exactly as shown above.
Writing it inside the loop would print the heading again for every
record, which is not the intended behavior for a report with a single
heading at the top.

**"Could this same pattern use a cursor and FETCH instead of native READ
and %EOF?"**
Yes. The underlying data could come from a cursor's `FETCH` loop, covered
in the Using SQL Cursor to Read Multiple Rows lesson, instead of native
`READ` and `%EOF`; the heading-then-loop-of-details shape stays the same
either way.

**"What happens if CUSTMAST has no records at all?"**
The heading still prints once, since `write HDGFMT;` happens before the
loop runs at all, but the loop body, and therefore `DTLFMT`, never
executes, since the very first `READ` immediately sets `%EOF` to `*on`.

## Quick Recap

- A basic report prints its heading once, before the loop, then loops
  through the underlying data, printing one detail line per row.
- This shape works the same way whether the underlying data comes from
  native `READ`/`%EOF` or an embedded SQL cursor's `FETCH` loop.
- The heading always prints, even if there is no underlying data at all;
  only the detail lines depend on there being rows to process.
- Recognizing this heading-then-loop-of-details shape covers the
  structure of most basic IBM i reports.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I add a total record format that prints once at the very
  end of this loop?"
- "What would need to change in this pattern to print the heading again
  on each new page?"
