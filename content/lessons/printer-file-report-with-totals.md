# Mini Project: Printer File Report with Totals

## What We Are Building

`RPT002R`, an order history report listing every order grouped by
customer, printing a subtotal each time the customer changes, and a
final grand total at the end, combining the Batch Report Program mini
project's grand total with the control-break pattern from the
Controlling Page Breaks lesson.

## Business Scenario

The Batch Report Program mini project produced one flat list with a
single grand total. Accounting now wants to see each customer's orders
grouped together, with that customer's own subtotal clearly shown before
moving on to the next customer, still finishing with an overall grand
total.

## Concepts Used

- Report record formats and totals, from the Report Record Formats and
  Report Totals and Summary Lines lessons.
- The control-break pattern, from the Controlling Page Breaks lesson,
  used here to trigger a subtotal rather than a forced new page.
- Native `READ` and `%EOF` over `ORDHIST`, already keyed by customer
  number.

## Files and Programs Involved

- **`ORDHIST`**, read from beginning to end, naturally in customer
  order since it is keyed by `CUSTNBR`.
- **`RPT002P`**, a new printer file with four record formats:
  **`HDGFMT`**, **`DTLFMT`**, **`SUBFMT`** (customer subtotal), and
  **`TOTFMT`** (grand total).
- **`RPT002R`**, the RPGLE program producing the report.

## Step-by-Step Build Outline

1. Design `RPT002P`'s four record formats: heading, one order detail
   line, one customer subtotal line, and one grand total line.
2. Declare `RPT002P` and `ORDHIST` in `RPT002R`.
3. Write `HDGFMT` once before the loop.
4. Loop with native `READ` and `%EOF`, comparing each record's
   `CUSTNBR` against the previous one, exactly the control-break
   detection covered in the Controlling Page Breaks lesson.
5. When the customer number changes, print that customer's subtotal
   with `SUBFMT`, then reset the subtotal accumulator before continuing.
6. Accumulate both the customer subtotal and the grand total on every
   detail line.
7. After the loop ends, print the final customer's subtotal, then the
   grand total with `TOTFMT`.

## Example Code

```rpgle
dcl-f RPT002P printer;
dcl-f ORDHIST disk keyed;

dcl-s prevCustNbr packed(6:0) inz(0);
dcl-s custSubtotal packed(9:2) inz(0);
dcl-s grandTotal packed(11:2) inz(0);

write HDGFMT;

read ORDHIST;
dow not %eof(ORDHIST);
  if CUSTNBR <> prevCustNbr and prevCustNbr <> 0;
    write SUBFMT;
    custSubtotal = 0;
  endif;

  write DTLFMT;
  custSubtotal += ORDAMT;
  grandTotal += ORDAMT;
  prevCustNbr = CUSTNBR;

  read ORDHIST;
enddo;

write SUBFMT;
write TOTFMT;

*inlr = *on;
```

Here, the control-break check is exactly the pattern covered in the
Controlling Page Breaks lesson, but instead of forcing a new page, it
prints `SUBFMT` for the customer that just finished and resets
`custSubtotal` back to zero. `grandTotal` accumulates across every
order regardless of customer, and is never reset. After the loop ends,
one final `write SUBFMT;` prints the last customer's subtotal, since the
control-break check inside the loop only catches a change between two
different customers, not the very last one.

## How to Test It

Run against a small, known set of orders across two or three customers,
confirming each customer's subtotal matches a manual sum of their own
orders, and the final grand total matches the sum of every order across
every customer.

## Common Mistakes

- Forgetting the final `write SUBFMT;` after the loop ends, leaving the
  last customer's subtotal missing from the report entirely.
- Resetting `custSubtotal` before printing `SUBFMT` instead of after,
  which would print a subtotal of zero instead of the actual amount.
- Accidentally resetting `grandTotal` alongside `custSubtotal`, losing
  the running total across customers.

## Debugging Checklist

If a customer's subtotal looks wrong, follow the Report Totals and
Summary Lines lesson's guidance: set a breakpoint on the `write SUBFMT;`
line and use `EVAL` on `custSubtotal` to confirm it holds the expected
sum at exactly the moment the customer changes.

## Possible Extensions

A natural extension is adding a count of orders per customer alongside
the amount subtotal, accumulating a second counter variable the same way
`custSubtotal` is accumulated, exactly the multiple-running-totals
pattern covered in the Report Totals and Summary Lines lesson.

## Quick Recap

- `RPT002R` combines a control break with running totals, printing a
  subtotal each time the customer changes and a grand total at the end.
- The final customer's subtotal needs its own `write SUBFMT;` after the
  loop, since the control break only fires on a change between two
  different customers.
- Testing against a small, known set of orders lets you verify subtotals
  and the grand total by hand.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add an order count alongside the amount subtotal for each
  customer?"
- "What would this report look like if the final write SUBFMT after the
  loop were accidentally left out?"
