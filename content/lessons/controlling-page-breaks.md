# Controlling Page Breaks

## Learning Objective

By the end of this lesson, you will be able to explain the difference
between automatic page overflow and a deliberate page break triggered by
a change in the underlying data, and write a simple example of the
latter.

## Simple Explanation

The Page Overflow Basics lesson covered overflow that IBM i triggers
automatically once a page fills up. Sometimes a report needs a new page
to start **deliberately**, based on the data itself, rather than waiting
for the page to physically fill. A common example is starting a new page
every time the data moves to a new group, such as a new customer's
orders.

```rpgle
dcl-f CUSTRPTP printer;
dcl-f ORDHIST disk keyed;

dcl-s prevCustNbr packed(6:0) inz(0);

write HDGFMT;

read ORDHIST;
dow not %eof(ORDHIST);
  if CUSTNBR <> prevCustNbr and prevCustNbr <> 0;
    write HDGFMT;
  endif;

  write DTLFMT;
  prevCustNbr = CUSTNBR;

  read ORDHIST;
enddo;
```

Here, `prevCustNbr` remembers the customer number from the previous
record. Each pass compares the current record's `CUSTNBR` against it: if
they differ, and this is not simply the very first record, `write
HDGFMT;` forces a new page before printing that customer's first order,
regardless of whether the current page happens to be physically full.
This is a deliberate, data-driven page break, distinct from the automatic
overflow indicator check covered in the Page Overflow Basics lesson.

## Why It Matters

Automatic overflow alone cannot express "start a new page whenever the
customer changes"; it only knows when a page is physically full.
Recognizing that a report can also force a new page based on a change in
the data itself, commonly called a **control break**, is essential for
producing reports organized by group, such as one page per customer or
one section per region.

## Practical Example

Imagine a report listing every order in `ORDHIST`, organized so that each
customer's orders start on a fresh page, making it easy for someone to
pull out just one customer's section. As the program reads through
`ORDHIST` in customer order, it compares each order's customer number
against the previous one; the moment the customer number changes, it
forces a new page before printing that customer's next order, exactly as
shown above.

This is a simplified, illustrative example rather than a specific real
report, but it reflects a genuinely common report requirement:
organizing printed output by group rather than leaving page breaks purely
to chance.

## Common Confusions

**"Is a control break the same thing as page overflow?"**
No. Page overflow, covered in the Page Overflow Basics lesson, is
automatic and based purely on how much of the current page is already
used. A control break is deliberate and based on the data itself, such as
a key field changing from one record to the next, regardless of how full
the page is.

**"Why does the example check prevCustNbr <> 0 as well as CUSTNBR <>
prevCustNbr?"**
Without that extra check, the very first record would also be treated as
a customer change, since `prevCustNbr` starts at zero and no real
customer number equals zero. The extra check specifically avoids forcing
an unnecessary page break before the very first order has even printed.

**"Can a report use both automatic overflow and a deliberate control
break together?"**
Yes. A single report can check both conditions, forcing a new page either
when the page overflows automatically or when a control break in the
data occurs, whichever happens first; this lesson focuses on the control
break specifically, building on the overflow check already covered.

## Quick Recap

- Automatic page overflow, covered in the Page Overflow Basics lesson, is
  based purely on how full the current page is.
- A control break forces a deliberate new page based on a change in the
  underlying data, such as a customer number changing from one record to
  the next.
- Remembering the previous record's key value, and comparing it to the
  current record's, is the basic mechanism behind detecting a control
  break.
- A report can combine both automatic overflow and a deliberate control
  break in the same program.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would this pattern change if the report needed to break on a
  region field instead of a customer number?"
- "Could a control break also be used to print a subtotal for each
  customer, rather than just forcing a new page?"
