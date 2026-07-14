# Mini Project: Customer Inquiry Program

## What We Are Building

A small, complete interactive RPGLE program: a 5250 screen where a user
types a customer number and sees that customer's name and balance. This
project combines a display file, a native keyed lookup, and basic error
handling into one working program, `CUSTINQR`.

## Business Scenario

Imagine a customer service representative on the phone with a customer
who wants to know their current balance. Rather than paging through a
report, the representative types the customer's number into a simple
inquiry screen and sees the answer immediately. This is one of the most
common, everyday shapes of an IBM i business program.

## Concepts Used

This project brings together, without re-explaining any of them in
depth:

- Display files and record formats, from the Display Files lesson group.
- `dcl-f` and `exfmt`, from the RPGLE Program Calling a Display File
  lesson.
- `CHAIN` and `%FOUND`, from the CHAIN for Keyed Access and Understanding
  %FOUND after CHAIN lessons.
- Function keys and indicators, from the Function Keys and Response
  Indicators in Display Files lesson.

## Files and Programs Involved

- **`CUSTMAST`**, the existing keyed physical file used throughout this
  path, with `CUSTNBR`, `CUSTNAME`, and `CUSTBAL`.
- **`CUSTDSPF`**, a new display file with one record format,
  `INQFMT`, containing an input field for the customer number and output
  fields for the customer's name and balance.
- **`CUSTINQR`**, the RPGLE program tying `CUSTDSPF` and `CUSTMAST`
  together.

## Step-by-Step Build Outline

1. Design `CUSTDSPF`'s `INQFMT` record format: an input field for
   customer number, output fields for name and balance, and an "F3=Exit"
   function key indicator, exactly the shape covered in the Basic
   Inquiry Screen Pattern lesson.
2. Declare both `CUSTDSPF` and `CUSTMAST` in `CUSTINQR` with `dcl-f`.
3. Loop calling `exfmt INQFMT`, reading the customer number the user
   typed.
4. Use `CHAIN` to look up that customer number in `CUSTMAST`.
5. Check `%FOUND`: if found, the shared field names already populate the
   screen's output fields automatically; if not, set a message
   indicator, as covered in the Displaying Error Messages on 5250 Screens
   lesson.
6. Check the F3 indicator each time through the loop to exit cleanly.

## Example Code

```rpgle
dcl-f CUSTDSPF workstn;
dcl-f CUSTMAST disk keyed;

dcl-s exitRequested ind;

dow not exitRequested;
  exfmt INQFMT;

  if *in03;
    exitRequested = *on;
  else;
    chain CUSTNBR CUSTMAST;
    if %found(CUSTMAST);
      *in50 = *off;
    else;
      *in50 = *on;
    endif;
  endif;
enddo;

*inlr = *on;
```

Here, `*in50` is a message indicator tied to an error message
constant in `CUSTDSPF`'s DDS, shown only when `%FOUND` comes back false,
exactly the pattern covered in the Displaying Error Messages on 5250
Screens lesson.

## How to Test It

Test with three cases: a customer number that exists, confirming the
name and balance display correctly; a customer number that does not
exist, confirming the error message appears instead of stale or blank
fields; and pressing F3 immediately, confirming the program exits
cleanly without attempting a lookup at all.

## Common Mistakes

- Forgetting to check `%FOUND` before trusting the screen's output
  fields, covered in the Understanding %FOUND after CHAIN lesson.
- Forgetting `keyed` on `CUSTMAST`'s `dcl-f`, which `CHAIN` requires.
- Checking the F3 indicator only once, outside the loop, instead of on
  every pass.

## Debugging Checklist

If this program does not behave as expected, apply the Basic
Troubleshooting Flow for IBM i Developers lesson's flow: check the job
log first, then, if it is a runtime problem, use `STRDBG` and a
breakpoint right after the `CHAIN`, using `EVAL` to confirm `%FOUND`'s
actual value and whether `CUSTNBR` holds what you expect.

## Possible Extensions

A natural next step is adding an update capability, letting the
representative change the customer's balance directly from this screen,
using `UPDATE` after a successful `CHAIN`, exactly as covered in the
Updating Records with UPDATE lesson.

## Quick Recap

- `CUSTINQR` combines a display file, `CHAIN`, and `%FOUND` into one
  small, complete inquiry program.
- Checking `%FOUND` and the F3 indicator on every pass through the loop
  are both essential.
- Testing should cover a found customer, a not-found customer, and
  immediate exit.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add a second input field to CUSTDSPF for the user to
  search by customer name instead of number?"
- "What would happen in this program if CUSTMAST were declared without
  the keyed keyword?"
