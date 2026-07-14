# Input Fields, Output Fields, and Both Fields

## Learning Objective

By the end of this lesson, you will be able to explain the difference
between an input field, an output field, and a "both" field on a 5250
screen, and recognize why this distinction matters to an RPGLE program.

## Simple Explanation

In the DDS Field Definitions lesson, you learned that a DDS field
definition specifies a field's name, data type, and length. A field
defined inside a display file's record format has one more important
property: its **usage**, which states how that field is meant to be used
on the screen.

Three common usage types cover most fields you will encounter:

- **Input fields** let the user type a value in, which the RPGLE program
  then reads after the screen is submitted, such as a customer number
  entry field.
- **Output fields** are filled in by the RPGLE program and displayed to
  the user, but the user cannot type into them, such as a customer's name
  or balance shown as a lookup result.
- **Both fields** can work in either direction: the RPGLE program can
  display a value in them, and the user can also type a new value into the
  same field, useful for something like a quantity field that starts with
  a suggested value the user can change.

## Why It Matters

Understanding field usage explains exactly how information moves between
an RPGLE program and the person using a 5250 screen: input fields carry
information from the user to the program, output fields carry information
from the program to the user, and both fields allow information to flow
both ways in the same field. Getting this right is essential to designing
a screen that behaves the way you intend.

## Practical Example

Imagine the customer inquiry screen from earlier lessons in this group.
The customer number field is an input field: the user types a value in,
and the RPGLE program reads it to know which customer to look up. The
customer name and balance fields are output fields: the RPGLE program
fills them in after the lookup, and the user only sees the result rather
than being able to change it directly on this screen.

Now imagine a different screen where a user can adjust a suggested order
quantity before confirming it. That quantity field would commonly be a
both field: the RPGLE program displays a suggested starting quantity, and
the user can type a different value before submitting the screen.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical use of all three field
usage types.

## Common Confusions

**"Can a user type into an output field?"**
No. An output field is meant only to display information the RPGLE
program provides; the user cannot type into it. If a field needs to
accept typed input, it needs to be defined as an input field or a both
field instead.

**"Is a both field the same as having two separate fields, one input and
one output, in the same spot?"**
No. A both field is a single field definition that supports both
directions at once: the program can set an initial value, and the user
can then change it, all within that one field, rather than needing two
separate field definitions layered on top of each other.

**"Does the RPGLE program need to do anything different to read an input
field versus a both field?"**
Generally, no. Once the screen is submitted, the RPGLE program reads
whatever value is currently in an input field or a both field the same
way; the meaningful difference is in what the user was allowed to do with
that field on the screen itself.

## Quick Recap

- A DDS field's usage states how it behaves on screen: input, output, or
  both.
- Input fields let a user type a value the RPGLE program reads; output
  fields display a value the program provides, without allowing typed
  input.
- Both fields combine the two: the program can display a starting value,
  and the user can change it.
- Choosing the right field usage is essential to designing a screen that
  behaves the way you intend.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I accidentally define a field that should be input-only
  as output instead?"
- "Are there other field usage types beyond input, output, and both?"
