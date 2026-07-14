# SFLDSP, SFLDSPCTL, and SFLCLR Explained

## Learning Objective

By the end of this lesson, you will understand what `SFLDSP`, `SFLDSPCTL`,
and `SFLCLR` each control, and how an RPGLE program uses conditioning
indicators to manage them.

## Simple Explanation

In the Subfile Record Format vs Subfile Control Record Format lesson, you
learned that the control record format manages a subfile as a whole. It
does this largely through three keywords, each conditioned by its own
indicator, connecting directly to the conditioning indicator concept from
the Display File Indicators Explained lesson:

- **`SFLDSP`** (Subfile Display) controls whether the subfile's rows are
  actually shown on screen. When its indicator is on, the loaded records
  appear; when off, they do not.
- **`SFLDSPCTL`** (Subfile Display Control) controls whether the control
  record format's own surrounding frame, headings, titles, and function
  key information, is active and displayed. It is generally turned on
  together with `SFLDSP`.
- **`SFLCLR`** (Subfile Clear) controls whether the subfile is cleared out,
  removing every record currently loaded into it. When its indicator is
  on, the subfile is emptied.

A common, basic pattern for setting up a subfile looks like this: turn on
the `SFLCLR` indicator and turn off the `SFLDSP` indicator, then show the
control record format once to actually perform the clear. Afterward, turn
`SFLCLR` back off, load the records you want into the subfile, and then
turn on both `SFLDSP` and `SFLDSPCTL` before showing the control record
format again, this time to actually display the loaded list.

## Why It Matters

These three keywords are how an RPGLE program directs a subfile through
its basic lifecycle: starting empty, being cleared and loaded, and then
being displayed. Understanding that each one is simply a conditioning
indicator the program sets, exactly the mechanism covered earlier for
regular display files, makes subfile behavior predictable rather than
mysterious.

## Practical Example

Imagine building the order list screen described in earlier lessons in
this group. Before loading a fresh list of orders, the program turns on
the `SFLCLR` indicator and turns off `SFLDSP`, then briefly shows the
control record format to clear out anything left over from a previous
use. It then turns `SFLCLR` back off, loads each order into the subfile
one at a time, and finally turns on `SFLDSP` and `SFLDSPCTL` before
showing the control record format again, this time displaying the
freshly loaded list to the user.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the standard, common lifecycle almost every basic
subfile follows.

## Common Confusions

**"Do SFLDSP and SFLDSPCTL do the same thing?"**
No, though they are usually turned on together. `SFLDSP` controls whether
the subfile's rows are shown; `SFLDSPCTL` controls whether the control
record format's own surrounding frame is active. In basic, everyday use,
both are generally turned on and off together, but they are conceptually
separate switches.

**"Why would I ever want to show the control record format without
showing the subfile itself?"**
This is exactly what happens during the clear step: showing the control
record format with `SFLCLR` on and `SFLDSP` off performs the clear
operation without actually displaying a list to the user, since there is
nothing meaningful to show at that point.

**"Does turning SFLCLR on delete the underlying data the subfile records
came from?"**
No. `SFLCLR` only empties the subfile itself, the temporary, on-screen
list. Whatever stored data those records originally came from, such as
records read from a physical file, is completely unaffected.

## Quick Recap

- `SFLDSP` controls whether the subfile's rows are shown; `SFLDSPCTL`
  controls whether the control record format's own frame is active,
  generally turned on together with `SFLDSP`.
- `SFLCLR` controls whether the subfile is emptied of all currently loaded
  records.
- A common pattern clears the subfile first, with `SFLDSP` off, then loads
  records, then turns `SFLDSP` and `SFLDSPCTL` on to display the list.
- These are all conditioning indicators, the same mechanism covered
  earlier for regular display files, applied specifically to managing a
  subfile's lifecycle.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I forget to turn SFLCLR back off after clearing a
  subfile?"
- "Can I show SFLDSPCTL without ever turning SFLDSP on?"
