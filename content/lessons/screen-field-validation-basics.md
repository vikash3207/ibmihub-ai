# Screen Field Validation Basics

## Learning Objective

By the end of this lesson, you will understand a few basic DDS keywords
that validate what a user types into a field, before the RPGLE program
ever sees that value.

## Simple Explanation

In the Input Fields, Output Fields, and Both Fields lesson, you learned
that an input field lets a user type a value the RPGLE program later
reads. Some basic rules about what counts as a valid value can be checked
directly by the display file itself, before the program receives it, using
simple DDS validation keywords:

- **`CHECK(MF)`** (Mandatory Fill) requires the user to actually enter a
  value in the field; the screen will not be accepted if it is left blank.
- **`RANGE`** restricts a numeric field to a specified minimum and maximum
  value, rejecting anything outside that range.
- **`VALUES`** restricts a field to a specific, explicit list of
  acceptable values, rejecting anything not in that list.
- **`COMP`** validates a numeric field against a single comparison, such
  as requiring it to be greater than a specific value.

If a user enters something that fails one of these checks, the display
file rejects the entry and does not pass control back to the RPGLE
program at all; the user sees an indication that something is wrong and
must correct it before the screen can be submitted successfully.

## Why It Matters

Basic field validation at the display file level catches simple, common
mistakes, a required field left blank, an out-of-range number, before an
RPGLE program ever has to deal with them. This keeps a program's own logic
focused on business rules rather than needing to check for every basic
data-entry mistake itself.

## Practical Example

Imagine the customer inquiry screen's customer number field, using
`CHECK(MF)` so the screen cannot be submitted with that field left blank.
If a user presses Enter without typing a customer number, the display
file itself catches this, and the RPGLE program never even receives
control for that attempt; the user simply sees that the field needs a
value and tries again.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical use of basic DDS
validation keywords.

## Common Confusions

**"Does the RPGLE program need to also check that a mandatory field was
filled in?"**
No, not for the basic case `CHECK(MF)` already covers. If the display file
rejects an incomplete entry before returning control, the RPGLE program
never sees that failed attempt at all; by the time the program does
receive control, a `CHECK(MF)` field is guaranteed to have a value.

**"Can these keywords validate more complex business rules, like checking
against stored customer data?"**
No. `CHECK(MF)`, `RANGE`, `VALUES`, and `COMP` validate simple, self-
contained rules about the field's own value. Validating something against
stored data, such as confirming a customer number actually exists, requires
the RPGLE program's own logic, not a basic DDS validation keyword.

**"What happens on the screen when a validation check fails?"**
The display file rejects the entry and keeps the user on the same screen
so they can correct it; exactly how this looks connects to the error
message concepts covered in the next lesson.

## Quick Recap

- `CHECK(MF)` requires a field to be filled in; `RANGE` restricts a
  numeric field to a minimum and maximum; `VALUES` restricts a field to a
  specific list; `COMP` validates against a single comparison.
- A field that fails one of these checks is rejected by the display file
  itself, before the RPGLE program regains control.
- Basic validation keywords handle simple, self-contained rules; more
  complex business rules still require the RPGLE program's own logic.
- These keywords keep an RPGLE program's logic focused on business rules
  rather than basic data-entry mistakes.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the difference between RANGE and COMP for validating a numeric
  field?"
- "Can I combine more than one validation keyword on the same field?"
