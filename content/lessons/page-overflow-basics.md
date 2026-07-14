# Page Overflow Basics

## Learning Objective

By the end of this lesson, you will understand what page overflow is,
and how an RPGLE program uses an overflow indicator to reprint a heading
on each new page.

## Simple Explanation

The Report Headings and Detail Lines lesson printed one heading followed
by many detail lines, without considering what happens once those detail
lines fill an entire printed page. **Page overflow** is what IBM i calls
reaching the bottom of the current page; a printer file can be set up
with an **overflow indicator** that automatically turns on once the page
is nearly full.

```rpgle
dcl-f CUSTRPTP printer;
dcl-f CUSTMAST disk;

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

Here, `*inof` is the overflow indicator, tied to the printer file's DDS so
that IBM i turns it on automatically once the current page fills up.
Checking `if *inof;` inside the loop, before writing each detail line,
lets the program reprint `HDGFMT` at the top of the new page whenever
overflow occurs, so every page of the report has its own heading rather
than only the very first one.

## Why It Matters

Without handling page overflow, a multi-page report's later pages would
have no heading at all, just an unbroken run of detail lines, making a
long report much harder to read. Checking the overflow indicator and
reprinting the heading is what keeps every page of a report properly
labeled.

## Practical Example

Imagine the daily customer balance report running against a `CUSTMAST`
containing hundreds of customers, far more than fit on a single printed
page. As the detail lines fill the first page, IBM i turns on the
overflow indicator once the page is nearly full. The next time through the
loop, the program notices `*inof` is on, prints `HDGFMT` again at the top
of a fresh page, and continues printing detail lines from there.

This is a simplified, illustrative example rather than a specific real
report, but it reflects exactly how a long report stays readable across
many pages.

## Common Confusions

**"Does the program need to count lines itself to know when a page is
full?"**
No. The overflow indicator is turned on automatically by IBM i, based on
how the printer file's DDS is set up, without the RPGLE program needing
to count printed lines itself.

**"What happens if the overflow check is left out entirely?"**
The report would still print correctly in terms of its data, but later
pages would be missing their heading, making a long, multi-page report
significantly harder to read and navigate.

**"Is *inof a special indicator only usable for this one purpose?"**
Within the scope of this lesson, `*inof` specifically represents the
overflow condition tied to a printer file. Detailed configuration of
exactly how and where overflow is set up in a printer file's DDS is a
more advanced topic beyond this introduction.

## Quick Recap

- Page overflow is IBM i's term for reaching the bottom of the current
  printed page.
- An overflow indicator, such as `*inof`, turns on automatically once a
  page is nearly full.
- Checking the overflow indicator before writing each detail line lets a
  program reprint the heading at the top of every new page.
- Without handling overflow, a multi-page report's later pages would have
  no heading at all.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Does the overflow indicator turn itself back off after the heading is
  reprinted?"
- "Could a report have different behavior on overflow besides just
  reprinting the same heading?"
