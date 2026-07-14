# Simple Inquiry Subfile Pattern

## Learning Objective

By the end of this lesson, you will be able to read a complete, simple
RPGLE program that clears, loads, and displays a load-all subfile showing
a list of records.

## Simple Explanation

This lesson brings together everything covered so far in this lesson
group: the subfile record format and control record format pair, `SFLCLR`,
`SFLDSP`, and `SFLDSPCTL`, and the load-all strategy. Here is a small,
complete example listing a customer's orders, using the `ORDSFL` subfile
record format and `ORDCTL` control record format introduced in earlier
lessons:

```rpgle
**free
ctl-opt dftactgrp(*no);

dcl-f ORDLISTD workstn;

dcl-s i int(10);
dcl-s ordNbr packed(6:0);

// Step 1: Clear the subfile before loading it
*in30 = *on;
*in40 = *off;
write ORDCTL;

// Step 2: Load records into the subfile
for i = 1 to 5;
  ordNbr = 1000 + i;
  write ORDSFL;
endfor;

// Step 3: Display the loaded subfile
*in30 = *off;
*in40 = *on;
*in41 = *on;
exfmt ORDCTL;

*inlr = *on;
```

Reading this step by step: `*in30`, the `SFLCLR` indicator, is turned on
and `*in40`, the `SFLDSP` indicator, is turned off, then `write ORDCTL`
performs the clear without showing anything meaningful. The program then
loops, writing five order records into the `ORDSFL` subfile record format,
one at a time. Finally, `*in30` is turned back off, and `*in40` and
`*in41`, the `SFLDSP` and `SFLDSPCTL` indicators, are turned on before
`exfmt ORDCTL` actually shows the control record format, along with the
five loaded orders, to the user.

## Why It Matters

This is the complete, basic shape behind a large number of real IBM i list
screens: clear, load, display. Seeing every piece from earlier lessons in
this group working together in one small, complete example helps each
individual concept, the subfile and control record format pair, the
clear/load/display indicators, and load-all loading, click into a working
whole.

## Practical Example

Imagine a customer service representative pulling up an order history
screen. Behind the scenes, this program clears any previous subfile
contents, loads that customer's orders one at a time in a loop, and then
displays the control record format, showing the representative every
loaded order at once, ready to scroll through.

This is a simplified, illustrative example rather than a specific real
program, and a real version would load actual order records from stored
data rather than generating fixed order numbers in a loop, but it reflects
the genuine, everyday shape of a simple load-all subfile program.

## Common Confusions

**"Why is exfmt used only at the end, and write used for the clear step
and each loaded record?"**
`write` sends something to the screen without waiting for a response, as
covered in the READ, WRITE, EXFMT, and Screen Flow lesson, which is exactly
what is needed for the clear step and for loading each record; none of
those steps should pause and wait for the user. `exfmt` is used only at
the very end, once everything is ready, to actually show the completed
list and wait for the user's response.

**"Does the order of turning indicators on and off matter?"**
Yes. Clearing must happen with `SFLDSP` off, so the clear operation
completes cleanly, before switching back to loading and then finally
turning `SFLDSP` and `SFLDSPCTL` on for the actual display step. Reversing
this order would show an incomplete or already-cleared subfile.

**"Does this program load real data from a physical file?"**
No, not in this simplified version. The order numbers are generated in a
simple loop to keep the focus on the subfile pattern itself. A real
version would replace that loop with actual reads against stored order
data, building on the Db2 for i lessons covered earlier in this path.

## Quick Recap

- A basic load-all subfile program follows a clear, load, display
  sequence, using `write` for the clear step and each loaded record, and
  `exfmt` only for the final display.
- Clearing happens with `SFLCLR` on and `SFLDSP` off; displaying happens
  with `SFLCLR` off and `SFLDSP`/`SFLDSPCTL` on.
- This pattern combines the subfile and control record format pair,
  clear/load/display indicators, and load-all loading from earlier lessons
  into one complete, working example.
- A real version of this program would load actual stored data instead of
  generating fixed example values.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would need to change in this program to load real order data
  instead of generated values?"
- "What would happen if I forgot to turn SFLDSP back on before the final
  exfmt call?"
