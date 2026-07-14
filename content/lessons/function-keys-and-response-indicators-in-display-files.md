# Function Keys and Response Indicators

## Learning Objective

By the end of this lesson, you will understand how a display file connects
a function key press to a numbered indicator, and how an RPGLE program
uses that indicator to know what the user did.

## Simple Explanation

In the Indicators in Modern RPGLE lesson, you learned that older, numbered
indicators such as `*IN03` were especially tied to controlling display
file screen behavior, though that lesson did not go into the details. This
lesson picks up exactly that thread.

A display file's DDS can associate a specific function key with a specific
numbered indicator, so that when a user presses that key, IBM i turns the
matching indicator on before control returns to the RPGLE program. Common
DDS keywords for this include:

- **`CFxx`** (Command Function), which allows a function key to be
  pressed and passes control back to the program along with the matching
  indicator, without automatically validating the rest of the screen's
  input first.
- **`CAxx`** (Command Attention), similar in spirit to `CFxx`, generally
  used for function keys meant to interrupt the current screen
  immediately, such as a cancel action.

In both keywords, `xx` is the function key number, so `CF03` associates
function key F3 with an indicator, commonly `*IN03` by convention, matching
the indicator number to the function key number for clarity.

Once the RPGLE program regains control after the screen is submitted, it
checks the relevant indicator, such as `*IN03`, to find out which function
key the user actually pressed, and decides what to do next based on that.

## Why It Matters

Function keys are one of the most common ways a user tells a 5250 screen
what to do next, exiting, canceling, requesting help, or moving to another
step. Understanding how a display file ties a function key to an
indicator, and how an RPGLE program checks that indicator afterward,
explains a core part of how interactive 5250 applications actually
respond to what a user does.

## Practical Example

Imagine the customer inquiry screen from earlier lessons in this group,
where the display file's DDS includes `CF03` on the inquiry record format,
tying function key F3 to indicator `*IN03`. If the user presses F3 instead
of entering a customer number, the RPGLE program, after the screen is
submitted, checks `if *in03;` and recognizes that the user wants to exit,
ending the program rather than trying to look up a customer number that
was never entered.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical pattern for handling
function keys in 5250 applications.

## Common Confusions

**"Does the RPGLE program decide which function keys are active on a
screen?"**
No. Which function keys are active, and which indicator each one is tied
to, is defined in the display file's DDS using keywords like `CF03`, not
decided by the RPGLE program itself. The RPGLE program only checks the
resulting indicator afterward.

**"Do I have to use *IN03 specifically for F3?"**
No, not strictly, though matching the indicator number to the function key
number, such as `*IN03` for F3, is a very common, easy-to-follow
convention. The specific indicator used is determined by what the DDS
associates with that function key.

**"What is the real difference between CFxx and CAxx?"**
Both associate a function key with an indicator, but they are generally
used differently: `CFxx` is commonly used for function keys where the
program may still want to see the rest of the screen's entered
information, while `CAxx` is generally used for function keys meant to
interrupt the screen immediately, without depending on other fields being
filled in correctly.

## Quick Recap

- DDS keywords like `CF03` and `CA03` associate a specific function key
  with a specific numbered indicator on a display file record format.
- When a user presses that function key, IBM i turns on the matching
  indicator before returning control to the RPGLE program.
- The RPGLE program checks the relevant indicator, such as `*IN03`, to
  find out which function key the user pressed.
- Matching the indicator number to the function key number, like `*IN03`
  for F3, is a common, easy-to-follow convention.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "When would I choose CAxx instead of CFxx for a function key?"
- "Can more than one function key be active on the same record format at
  once?"
