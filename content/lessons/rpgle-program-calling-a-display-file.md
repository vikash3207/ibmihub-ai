# RPGLE Program Calling a Display File

## Learning Objective

By the end of this lesson, you will be able to declare a display file in
free-format RPGLE using `dcl-f`, and use `exfmt` to show a record format
and read back what the user entered.

## Simple Explanation

You now understand what a display file is, how its record formats and
fields work, and how function keys tie to indicators. This lesson connects
all of that to actual RPGLE code, showing how a program works with a
display file.

A display file is declared in free-format RPGLE using **`dcl-f`**, the
same keyword used to declare other kinds of files, with the special
keyword **`workstn`** identifying it as a workstation file:

```rpgle
**free
ctl-opt dftactgrp(*no);

dcl-f CUSTINQD workstn;

dcl-s exitRequested ind;

dow not exitRequested;
  exfmt INQFMT;

  if *in03;
    exitRequested = *on;
  endif;
enddo;

*inlr = *on;
```

Here, `dcl-f CUSTINQD workstn;` declares `CUSTINQD` as the display file
this program works with. The **`exfmt`** operation shows a specific record
format, `INQFMT` here, and then waits for the user to respond, in one
combined step: it writes the format to the screen and reads back whatever
the user entered once they submit it. After `exfmt` returns, the program
checks `*in03`, the indicator tied to F3 as covered in the Function Keys
and Response Indicators lesson, deciding whether to exit the loop.

## Why It Matters

`exfmt` is the core operation connecting an RPGLE program to a 5250
screen: it is how a program actually shows something to the user and gets
their response back, all in a single step. Understanding `dcl-f` and
`exfmt` together explains, at a code level, exactly how the display file
concepts covered earlier in this lesson group connect to a real, running
RPGLE program.

## Practical Example

Imagine the customer inquiry program described throughout this lesson
group. It declares `CUSTINQD` as its display file, then repeatedly calls
`exfmt INQFMT` inside a loop: each time, the screen appears, the user
either enters a customer number or presses F3 to exit, and the program
checks `*in03` to decide whether to keep looping or stop. This is exactly
the shape of a simple, interactive 5250 program.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the core pattern behind many interactive 5250
RPGLE programs.

## Common Confusions

**"Is exfmt the same as separately writing a screen and then reading
it?"**
`exfmt` combines both steps, showing the format and reading the user's
response, into one operation. This lesson focuses on `exfmt` specifically
because it is the most common, straightforward way beginners work with
display files; separate write and read operations exist but are a more
detailed topic beyond this introductory lesson.

**"Does dcl-f work the same way for display files as for other kinds of
files?"**
`dcl-f` is used to declare any kind of file in free-format RPGLE, but the
keyword `workstn` specifically identifies a workstation file, such as a
display file, telling the compiler to expect this particular kind of
interactive file rather than a physical or logical file.

**"What happens if the user enters something in the customer number field
before exfmt returns?"**
Whatever the user typed into an input or both field, as covered in the
Input Fields, Output Fields, and Both Fields lesson, becomes available to
the RPGLE program as soon as `exfmt` returns, ready to be used in the
program's logic, such as looking up that customer.

## Quick Recap

- A display file is declared in free-format RPGLE using
  `dcl-f fileName workstn;`.
- `exfmt formatName;` shows a record format to the user and reads back
  their response in a single operation.
- After `exfmt` returns, the program can check relevant indicators, such
  as `*in03`, to see which function key the user pressed.
- `dcl-f` and `exfmt` together are the core building blocks connecting an
  RPGLE program to a 5250 screen.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the difference between exfmt and using separate write and read
  operations?"
- "Can one RPGLE program use more than one display file?"
