# Simple Inquiry Screen Flow

## Learning Objective

By the end of this lesson, you will be able to read a complete, simple
RPGLE program that shows an entry screen, processes what the user typed,
and shows a results screen, looping until the user exits.

## Simple Explanation

This lesson brings together everything covered in this lesson group: a
display file with more than one record format, input and output fields,
function keys tied to indicators, and `dcl-f` with `exfmt`. Here is a
small, complete inquiry screen flow, using the customer inquiry example
referenced throughout this lesson group:

```rpgle
**free
ctl-opt dftactgrp(*no);

dcl-f CUSTINQD workstn;

dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBalance packed(9:2);
dcl-s exitRequested ind;

dow not exitRequested;
  exfmt INQFMT;

  if *in03;
    exitRequested = *on;
  else;
    // Look up the customer using custNbr entered on INQFMT
    custName = 'Jordan Lee';
    custBalance = 250.00;

    exfmt RESULTFMT;

    if *in03;
      exitRequested = *on;
    endif;
  endif;
enddo;

*inlr = *on;
```

Reading this step by step: the program shows `INQFMT`, the entry screen,
using `exfmt`, and waits for the user. If the user presses F3, `*in03`
turns on and the loop ends. Otherwise, the program looks up the customer
using whatever value was entered, here simplified to fixed values rather
than a real lookup, and then shows `RESULTFMT`, the results screen, again
using `exfmt`. From the results screen, pressing F3 also ends the loop;
otherwise, control returns to the top, showing `INQFMT` again for another
inquiry.

## Why It Matters

This kind of loop, show a screen, react to what happened, show another
screen or loop back, is the basic shape behind a huge number of real,
simple interactive 5250 programs. Seeing every piece, the display file
declaration, multiple record formats, function key indicators, and the
loop structure, working together in one small example makes each
individual concept covered earlier in this lesson group click into a
complete, working picture.

## Practical Example

Imagine a customer service representative using this program throughout
their shift. Each time they enter a customer number and press Enter, they
see that customer's name and balance on the results screen. Pressing F3
from the results screen returns them to the entry screen for the next
customer, and pressing F3 from the entry screen ends the program entirely
when they are done for the day.

This is a simplified, illustrative example rather than a specific real
application, and a real version would replace the fixed `custName` and
`custBalance` values with an actual lookup against stored data, but it
reflects the genuine, everyday shape of a simple 5250 inquiry program.

## Common Confusions

**"Why does *in03 need to be checked twice, once after each exfmt?"**
Because F3 could be pressed from either screen, `INQFMT` or `RESULTFMT`,
and each `exfmt` call gets its own fresh response from whichever screen
was just shown. Checking `*in03` after each `exfmt` lets the program react
correctly no matter which screen the user was on when they pressed F3.

**"Does this program actually look up real customer data?"**
No, not in this simplified version. The `custName` and `custBalance`
values are fixed here to keep the focus on the screen flow itself. A real
version would replace those fixed assignments with an actual lookup
against stored data, a topic that builds on the Db2 for i lessons covered
earlier in this path.

**"Could this same flow use a select statement instead of nested if
blocks?"**
The overall shape could be restructured in more than one valid way, using
`if`, `select`, or other approaches covered in earlier RPGLE lessons; this
example uses simple `if` checks to keep the flow easy to follow for an
introductory example.

## Quick Recap

- A simple inquiry screen flow commonly loops: show an entry screen,
  react to the user's input or function key, then show a results screen
  or loop back.
- Checking a function key indicator like `*in03` after each `exfmt` call
  lets the program correctly react no matter which screen the user was on.
- This example combines display file declaration, multiple record
  formats, function key indicators, and RPGLE control flow into one
  complete, working pattern.
- A real version of this program would replace the fixed example values
  with an actual data lookup.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would this program change if it needed to look up real customer
  data instead of using fixed values?"
- "What would happen if I forgot to check *in03 after the second exfmt
  call?"
