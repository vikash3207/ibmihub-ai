# Mini Project: Item Master Lookup Program

## What We Are Building

A second, independent inquiry program, structurally similar to the
Customer Inquiry Program mini project, but introducing a brand new file:
`ITEMPF`, an item master. This project is a chance to apply the same
pattern again on your own, with a new business object.

## Business Scenario

Imagine a warehouse worker checking an item's description and current
price before pulling stock for an order. Rather than digging through a
paper catalog, they type the item number into a simple screen and see the
answer immediately, the same everyday need as the customer inquiry
project, applied to a different kind of data.

## Concepts Used

The same core pattern as the Customer Inquiry Program mini project:
display files, `dcl-f` and `exfmt`, `CHAIN` and `%FOUND`, and function
keys. This project is deliberately similar in shape, so the focus is on
applying the pattern to new fields and a new file rather than learning
new mechanics.

## Files and Programs Involved

- **`ITEMPF`**, a new keyed physical file, with fields for **`ITEMNBR`**
  (item number, the key), **`ITEMDESC`** (description), and
  **`ITEMPRICE`** (current price).
- **`ITEMDSPF`**, a new display file with one record format,
  **`ITEMFMT`**, containing an input field for item number and output
  fields for description and price.
- **`ITEMINQR`**, the RPGLE program tying `ITEMDSPF` and `ITEMPF`
  together.

## Step-by-Step Build Outline

1. Define `ITEMPF` as a keyed physical file, `ITEMNBR` as its key, exactly
   as covered in the Keyed Physical Files lesson.
2. Design `ITEMDSPF`'s `ITEMFMT` record format: an input field for item
   number, output fields for description and price, and an F3 exit key.
3. Declare both files in an RPGLE program, `ITEMINQR`, with `dcl-f`.
4. Loop calling `exfmt ITEMFMT`, reading the item number entered.
5. Use `CHAIN` against `ITEMPF`, check `%FOUND`, and set an error message
   indicator if nothing was found.
6. Check the F3 indicator each pass to exit cleanly.

## Example Code

```rpgle
dcl-f ITEMDSPF workstn;
dcl-f ITEMPF disk keyed;

dcl-s exitRequested ind;

dow not exitRequested;
  exfmt ITEMFMT;

  if *in03;
    exitRequested = *on;
  else;
    chain ITEMNBR ITEMPF;
    if %found(ITEMPF);
      *in50 = *off;
    else;
      *in50 = *on;
    endif;
  endif;
enddo;

*inlr = *on;
```

Notice this is structurally the same shape as the Customer Inquiry
Program mini project's code, with `ITEMNBR` and `ITEMPF` in place of
`CUSTNBR` and `CUSTMAST`. Recognizing this repeatable shape is exactly
the point of building a second, similar project.

## How to Test It

Test with an item number that exists, confirming description and price
display correctly; an item number that does not exist, confirming the
error message appears; and pressing F3 immediately to confirm a clean
exit, the same three cases used for the customer inquiry project.

## Common Mistakes

- Copying the pattern but forgetting to change every `CUSTNBR`/`CUSTMAST`
  reference to `ITEMNBR`/`ITEMPF`, leaving a mismatched, broken program.
- Defining `ITEMPF` without a key, which would prevent `CHAIN` from
  working at all.
- Reusing the same message indicator number as another program without
  checking whether that matters for this specific program's own DDS.

## Debugging Checklist

If item descriptions or prices show as blank or stale, follow the same
checklist as the Customer Inquiry Program mini project: check `%FOUND`'s
actual value with `EVAL` right after the `CHAIN`, and confirm `ITEMNBR`
holds the exact value expected at that point.

## Possible Extensions

A natural extension is adding a low-stock or discontinued flag to
`ITEMPF`, displayed as a highlighted message on `ITEMDSPF` when set,
using `DSPATR`, covered in the Basic Display File DDS Keywords lesson.

## Quick Recap

- `ITEMINQR` applies the exact same inquiry pattern as the Customer
  Inquiry Program mini project, to a new file and new fields.
- Recognizing and reusing a repeatable pattern, rather than learning
  something new each time, is a genuinely valuable developer skill.
- The same three test cases, found, not found, and immediate exit, apply
  here as well.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "What would change in this program if ITEMPF needed to be looked up by
  a description search instead of an exact item number?"
- "How similar is this program's structure to CUSTINQR from the Customer
  Inquiry Program project, and why does that similarity matter?"
