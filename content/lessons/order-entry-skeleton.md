# Mini Project: Order Entry Skeleton

## What We Are Building

`ORDENR`, a proper interactive order entry screen, building the small
`ORDENTR` sketch from the End-to-End Mini DMS-Style Flow mini project
out into a real, display-file-driven program.

## Business Scenario

The End-to-End Mini DMS-Style Flow mini project introduced `ORDHDRPF`
and `ORDDTLPF` with a minimal, hard-coded example writing one order.
This project builds the actual screen a representative would use to
enter a new order interactively, typing in the customer number, item
number, and quantity themselves.

## Concepts Used

- `WRITE` against a header-detail file pair, from the End-to-End Mini
  DMS-Style Flow mini project.
- The `prefix` keyword on `dcl-f`, from the same project, needed since
  `ORDHDRPF` and `ORDDTLPF` share a field name.
- Display files and function keys, from the Customer Inquiry Program
  mini project.

## Files and Programs Involved

- **`ORDHDRPF`** and **`ORDDTLPF`**, reused without changes from the
  End-to-End Mini DMS-Style Flow mini project.
- **`ORDDSPF`**, a new display file with one record format, **`ENTFMT`**,
  containing input fields for customer number, item number, and
  quantity, plus an F10 "save" function key.
- **`ORDENR`**, the RPGLE program tying `ORDDSPF`, `ORDHDRPF`, and
  `ORDDTLPF` together.

## Step-by-Step Build Outline

1. Design `ORDDSPF`'s `ENTFMT` record format with input fields for
   customer number, item number, and quantity, and an F10 save key.
2. Declare `ORDDSPF`, `ORDHDRPF`, and `ORDDTLPF` in `ORDENR`. Since
   `ORDDSPF`'s own screen fields now also include a customer number,
   both `ORDHDRPF` and `ORDDTLPF` need their own `prefix` this time,
   avoiding a three-way field name collision rather than just the
   two-way one covered in the End-to-End Mini DMS-Style Flow mini
   project.
3. Loop calling `exfmt ENTFMT`.
4. On F10, assign a new, unique order number, then use the screen's
   entered fields to write one `ORDHDRPF` record and one `ORDDTLPF`
   record.
5. Clear the input fields and redisplay the screen, ready for the next
   order.

## Example Code

```rpgle
dcl-f ORDDSPF workstn;
dcl-f ORDHDRPF disk keyed prefix('HDR_');
dcl-f ORDDTLPF disk keyed prefix('DTL_');

dcl-s exitRequested ind;
dcl-s nextOrdNbr packed(6:0) inz(5001);

dow not exitRequested;
  exfmt ENTFMT;

  if *in03;
    exitRequested = *on;
  elseif *in10;
    HDR_ORDNBR = nextOrdNbr;
    HDR_CUSTNBR = CUSTNBR;
    write ORDHDRPF;

    DTL_ORDNBR = nextOrdNbr;
    DTL_ITEMNBR = ITEMNBR;
    DTL_QTY = QTY;
    write ORDDTLPF;

    nextOrdNbr += 1;
  endif;
enddo;

*inlr = *on;
```

Here, `nextOrdNbr` is a simple in-program counter standing in for real
order number assignment, kept intentionally simple for this small
project. `CUSTNBR`, `ITEMNBR`, and `QTY` are `ORDDSPF`'s own screen
fields, left unprefixed. `HDR_ORDNBR` and `HDR_CUSTNBR` are
`ORDHDRPF`'s prefixed fields; `DTL_ORDNBR`, `DTL_ITEMNBR`, and
`DTL_QTY` are `ORDDTLPF`'s prefixed fields. Prefixing both database
files, rather than just one, keeps every field distinct across all
three open files at once.

## How to Test It

Enter a new order and press F10, then use the Simple Order List Subfile
mini project's pattern, adapted to `ORDHDRPF`, to confirm the new order
appears for the right customer. Enter a second order for the same
customer number and confirm both appear, with distinct order numbers.

## Common Mistakes

- Forgetting the `prefix` keyword on `ORDHDRPF`'s `dcl-f`, which would
  collide with `ORDDSPF`'s own `CUSTNBR` screen field.
- Reusing the same order number for two different orders, since a
  realistic program would need a genuine, reliable way to generate a
  unique order number, beyond this project's simple in-program counter.
- Writing `ORDDTLPF` before `ORDHDRPF`, leaving a brief window where a
  detail record technically exists without its header, even though both
  writes happen in quick succession.

## Debugging Checklist

If a new order does not appear where expected afterward, follow the
Library List Problems in Real Applications lesson's mindset applied
here: confirm first, with `EVAL`, that `nextOrdNbr` and the screen's
entered fields actually held the values you expected at the moment each
`WRITE` executed.

## Possible Extensions

A natural extension is validating the entered customer number with a
`CHAIN` against `CUSTMAST` before accepting the order, rejecting the
entry with a message if the customer does not exist, exactly the
`%FOUND` check pattern covered throughout the RPGLE File I/O lessons.

## Quick Recap

- `ORDENR` builds the End-to-End Mini DMS-Style Flow mini project's
  minimal order-writing sketch into a real, interactive screen.
- `ORDDTLPF`'s `dcl-f` needs `prefix('DTL_')` since it shares an
  `ORDNBR` field with `ORDHDRPF`.
- Testing should confirm multiple orders can be entered in sequence,
  each with a distinct order number.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I validate the customer number against CUSTMAST before
  accepting a new order?"
- "What would a more realistic way to generate unique order numbers look
  like, compared to this project's simple counter?"
