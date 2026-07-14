# Mini Project: Simple Order List Subfile

## What We Are Building

A subfile screen listing every order for one customer, combining
`SETLL`/`READE` native file I/O with the subfile load-display pattern
covered throughout the Subfiles lesson group.

## Business Scenario

Extending the Customer Inquiry Program mini project, imagine that
customer service representative now also needing to see a specific
customer's full order history in one scrollable list, rather than just
their current balance, before deciding how to help them.

## Concepts Used

- `SETLL` and `READE` for reading every record sharing a key value, from
  the SETLL in RPGLE and READE for Reading Matching Keys lessons.
- The subfile record format and control record format pair, from the
  Subfile Record Format vs Subfile Control Record Format lesson.
- The clear-load-display pattern, from the Simple Inquiry Subfile Pattern
  lesson.

## Files and Programs Involved

- **`ORDHIST`**, the existing order history file from the RPGLE File I/O
  lessons, keyed by `CUSTNBR`, holding `ORDNBR`, `CUSTNBR`, and
  `ORDAMT`.
- **`ORDSFLD`**, a new display file containing the subfile record
  format, **`ORDSFL`** (one row per order), and its control record
  format, **`ORDCTL`**.
- **`ORDLSTR`**, the RPGLE program tying `ORDSFLD` and `ORDHIST`
  together.

## Step-by-Step Build Outline

1. Design `ORDSFLD`'s `ORDSFL` subfile record format with fields for
   order number and amount, and `ORDCTL` as its control record format
   with `SFLCTL(ORDSFL)`, exactly as covered in the Subfile Record Format
   vs Subfile Control Record Format lesson.
2. Prompt for a customer number using a small input screen, or accept it
   as a parameter for simplicity.
3. Clear the subfile: turn `SFLCLR` on and `SFLDSP` off, then show
   `ORDCTL` once, exactly as covered in the SFLDSP, SFLDSPCTL, and SFLCLR
   Explained lesson.
4. Use `SETLL custNbr ORDHIST;` followed by a `READE` loop, writing one
   `ORDSFL` record per matching order, exactly the pattern covered in the
   READE for Reading Matching Keys lesson.
5. Turn `SFLDSP` and `SFLDSPCTL` on, then `exfmt ORDCTL` to display the
   loaded list.

## Example Code

```rpgle
dcl-f ORDSFLD workstn;
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;

*in30 = *on;
*in40 = *off;
write ORDCTL;

*in30 = *off;
setll custNbr ORDHIST;
reade custNbr ORDHIST;
dow not %eof(ORDHIST);
  write ORDSFL;

  reade custNbr ORDHIST;
enddo;

*in40 = *on;
*in41 = *on;
exfmt ORDCTL;

*inlr = *on;
```

This is the same clear-load-display shape covered in the Simple Inquiry
Subfile Pattern lesson, now using real `SETLL`/`READE` file I/O instead
of a fixed illustrative loop.

## How to Test It

Test with a customer who has several orders, confirming every one
appears in the subfile; a customer with exactly one order; and a
customer with no orders at all, confirming the subfile displays as
empty without producing an unexpected error.

## Common Mistakes

- Forgetting `SETLL` before the `READE` loop, which leaves the file
  positioned incorrectly.
- Writing `ORDCTL` for the clear step with `SFLDSP` still on, which
  would attempt to display a subfile that has not been loaded yet.
- Using `CHAIN` instead of `SETLL`/`READE`, which would only ever load
  one order rather than every matching one, exactly the mistake covered
  in the Processing Duplicate Keys in RPGLE lesson.

## Debugging Checklist

If the subfile appears empty for a customer known to have orders, follow
the Debugging Subfile Programs lesson's approach: `dsply custNbr;` right
before the `SETLL` to confirm the key value is correct, then check
`%EOF` immediately after the first `READE` to confirm whether any record
actually matched at all.

## Possible Extensions

A natural extension is adding page overflow handling so the column
headings reprint on every page for a customer with enough orders to fill
more than one screen, using the overflow indicator pattern covered in the
Page Overflow Basics lesson, applied here to a subfile control record
format instead of a printer file.

## Quick Recap

- `ORDLSTR` combines `SETLL`/`READE` with the subfile clear-load-display
  pattern to list every order for one customer.
- `SETLL` must come before the `READE` loop begins.
- Testing should include a customer with several orders, exactly one
  order, and no orders at all.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add a running total of order amounts to ORDCTL, updated
  as each order loads into the subfile?"
- "What would happen in this program if SETLL were accidentally left out
  before the READE loop?"
