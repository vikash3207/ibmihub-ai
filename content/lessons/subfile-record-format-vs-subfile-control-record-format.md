# Subfile Record Format vs Subfile Control Record Format

## Learning Objective

By the end of this lesson, you will be able to clearly explain the
difference between a subfile record format and a subfile control record
format, and why every subfile actually needs both.

## Simple Explanation

This is the single most important distinction to get right before working
with subfiles, and it is worth being especially careful about, since it is
a common early point of confusion. A working subfile is always built from
**two separate record formats**, not one:

- The **subfile record format** defines the layout of a single row within
  the list, the fields that repeat once for every record shown, such as an
  order number and order date in an order list. This record format is
  marked as a subfile using the DDS keyword **`SFL`**.
- The **subfile control record format** manages the subfile as a whole: it
  defines the fixed parts of the screen around the list, such as column
  headings, a title, and function key instructions, and it contains the
  keywords, covered in the next lesson, that actually control whether the
  subfile is displayed and how many rows are shown. This record format is
  tied to its subfile record format using the DDS keyword
  **`SFLCTL`**, naming the subfile record format it manages.

A helpful way to keep these straight: the subfile record format is the
**repeating row**, one for each record in the list. The subfile control
record format is the **surrounding frame**, appearing once, that holds
everything else on the screen and governs how the list behaves. Neither
one works on its own; a subfile is always this pair, working together.

## Why It Matters

Every subfile keyword and pattern covered in the lessons that follow
assumes you already know which of these two record formats it belongs to.
Column headings, titles, and function key indicators generally belong on
the control record format; the fields that repeat for each record belong
on the subfile record format itself. Getting this pairing backwards is one
of the most common early mistakes beginners make with subfiles.

## Practical Example

Imagine building the order list screen described in the previous lesson.
The subfile record format, perhaps named `ORDSFL`, would define fields for
one order's number and date, repeating for each order shown. A separate
subfile control record format, perhaps named `ORDCTL`, tied to `ORDSFL`
using `SFLCTL(ORDSFL)`, would define the screen's title, "Order List,"
column headings above the list, and a note at the bottom about which
function keys are available.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects exactly how every subfile is structured: one
record format for the repeating rows, one for the surrounding frame.

## Common Confusions

**"Can I combine the subfile record format and the control record format
into one?"**
No. A subfile always requires both as separate record formats; DDS does
not support combining them into a single record format. This separation is
a fundamental part of how subfiles work.

**"Does the RPGLE program show both record formats separately?"**
Not exactly separately in the way you might expect. The subfile record
format's individual rows are loaded one at a time, but the actual screen
display, the subfile alongside its surrounding frame, happens through the
control record format, using `exfmt` on the control record format's name,
covered in the next lesson.

**"Do the subfile record format and control record format need to look
similar in name?"**
Not strictly, but choosing clearly related names, such as `ORDSFL` and
`ORDCTL` in the example above, makes it much easier for anyone reading the
DDS later to see at a glance which control record format manages which
subfile record format.

## Quick Recap

- A subfile is always built from two record formats: the subfile record
  format, marked with `SFL`, defining one repeating row, and the subfile
  control record format, marked with `SFLCTL`, managing the subfile as a
  whole.
- The subfile record format holds the fields that repeat once per record;
  the control record format holds the surrounding frame: titles, headings,
  and function key information.
- `SFLCTL` names the specific subfile record format a control record
  format manages, tying the pair together.
- Mixing up which fields or keywords belong on which of these two record
  formats is one of the most common early subfile mistakes.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I put a column heading on the subfile record format
  instead of the control record format?"
- "Can one subfile control record format manage more than one subfile
  record format?"
