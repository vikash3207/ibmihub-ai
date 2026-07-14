# Mini Project: Batch Report Program

## What We Are Building

A printer file report program, `RPT001R`, listing every customer's
balance with a grand total, designed from the start to run as a batch
job rather than interactively.

## Business Scenario

Imagine an accounting team needing a printed customer balance report
every night, without anyone needing to sit and watch it run. This
project builds exactly that report, then the CLLE Wrapper to Run a
Report mini project, next in this batch, covers actually submitting it.

## Concepts Used

- Report record formats and the heading-then-detail-loop pattern, from
  the Report Record Formats and Report Headings and Detail Lines lessons.
- Page overflow handling, from the Page Overflow Basics lesson.
- Report totals, from the Report Totals and Summary Lines lesson.
- Native `READ` and `%EOF`, from the RPGLE File I/O lessons.

## Files and Programs Involved

- **`CUSTMAST`**, read natively from beginning to end.
- **`RPT001P`**, a new printer file with three record formats:
  **`HDGFMT`** (heading), **`DTLFMT`** (detail), and **`TOTFMT`**
  (total).
- **`RPT001R`**, the RPGLE program that produces the report.

## Step-by-Step Build Outline

1. Design `RPT001P`'s three record formats: `HDGFMT` with a title and
   column headings, `DTLFMT` with customer number, name, and balance,
   and `TOTFMT` with a single grand total field.
2. Declare `RPT001P` and `CUSTMAST` in `RPT001R` with `dcl-f`.
3. Write `HDGFMT` once, before the read loop begins.
4. Loop with native `READ` and `%EOF` over `CUSTMAST`, checking the
   overflow indicator before each detail line and accumulating a running
   total, exactly as covered in the Report Totals and Summary Lines
   lesson.
5. Write `TOTFMT` once, after the loop ends.

## Example Code

```rpgle
dcl-f RPT001P printer;
dcl-f CUSTMAST disk;

dcl-s balTotal packed(11:2) inz(0);

write HDGFMT;

read CUSTMAST;
dow not %eof(CUSTMAST);
  if *inof;
    write HDGFMT;
  endif;

  balTotal += CUSTBAL;
  write DTLFMT;

  read CUSTMAST;
enddo;

write TOTFMT;

*inlr = *on;
```

This is the same combined heading, overflow, and total pattern covered
individually across the Printer Files / Reports lesson group, now
brought together into one complete report program.

## How to Test It

Run the program interactively first, using `WRKSPLF` to view the
resulting spool file directly, confirming the heading appears once,
every customer's detail line appears, and the total at the end matches a
manually calculated sum for a small, known set of test customers.

## Common Mistakes

- Writing `HDGFMT` inside the read loop instead of before it, printing
  it once per customer instead of once per page.
- Writing `TOTFMT` inside the loop instead of after it, printing a
  partial, still-accumulating total.
- Forgetting the overflow indicator check, leaving later pages of a long
  report without column headings.

## Debugging Checklist

If the total looks wrong, follow the Report Totals and Summary Lines
lesson's guidance: confirm with `EVAL` that `balTotal` starts at zero and
is increased by exactly `CUSTBAL` on each pass, using a breakpoint set on
the `write DTLFMT;` line.

## Possible Extensions

A natural extension is adding a control break, printing a page break
between customers grouped by region, if such a field existed, using the
deliberate page-break pattern covered in the Controlling Page Breaks
lesson.

## Quick Recap

- `RPT001R` combines heading-once, detail-per-row, overflow handling,
  and a final total into one complete report program.
- `HDGFMT` writes once before the loop; `TOTFMT` writes once after it.
- Testing against a small, known set of customers lets you verify the
  total by hand.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add a count of customers alongside the balance total on
  this report?"
- "What would this report look like on a very long customer list if the
  overflow check were left out entirely?"
