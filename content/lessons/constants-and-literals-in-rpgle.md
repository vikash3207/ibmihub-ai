# Constants and Literals in RPGLE

## Learning Objective

By the end of this lesson, you will understand what a literal value is,
what an RPGLE constant is, and why using a named constant is often better
than repeating the same literal value throughout a program.

## Simple Explanation

In the Variables and Data Types in RPGLE lesson, you saw an assignment like
`custName = 'Jordan Lee';`. The value `'Jordan Lee'` written directly into
that line of code is called a **literal**: a fixed value typed directly
into the program, rather than stored in a variable.

RPGLE supports different kinds of literals matching the data types you
already know:

- **Character literals**, written inside single quotes, such as
  `'Jordan Lee'`.
- **Numeric literals**, written as plain numbers, such as `100` or `19.99`.
- **Indicator literals**, `*on` and `*off`, representing the two possible
  values of an indicator variable.

A **constant** is a named value, declared once using **`dcl-c`** (Declare
Constant), that behaves like a variable in that it has a name, but, unlike
a regular variable, its value cannot be changed after it is declared:

```rpgle
dcl-c MAX_DISCOUNT_PCT 20;

dcl-s discountPct packed(3:0);
discountPct = MAX_DISCOUNT_PCT;
```

Using a named constant instead of repeating the same literal value
throughout a program means that if that value ever needs to change, it only
needs to be updated in one place, the constant's declaration, rather than
everywhere it was typed directly into the code.

## Why It Matters

Recognizing the difference between literals and constants, and knowing when
to reach for a named constant, is a small but genuinely useful habit.
Repeating the same literal value in many places throughout a program makes
that value harder to find, easier to update inconsistently, and generally
harder for someone else, or your future self, to understand why that
specific value matters.

## Practical Example

Imagine a program that applies a maximum discount percentage in several
different places throughout its logic. If that percentage is typed directly
as the literal `20` in five different spots, changing the business rule
later means finding and updating all five, and easily missing one by
mistake.

Declaring `MAX_DISCOUNT_PCT` as a constant once, and referring to it by
name everywhere the value is needed, means a future change only requires
updating that one declaration. This is a simplified, illustrative example
rather than a specific real program, but it reflects a genuinely common,
practical reason RPGLE developers use named constants.

## Common Confusions

**"Is a constant the same thing as a variable?"**
Not quite. Both have a name and a declared value, but a constant's value is
fixed once declared and cannot be changed while the program runs, while a
regular variable, declared with `dcl-s`, can be assigned new values as the
program executes.

**"Do I need to use dcl-c for every literal value in my program?"**
No. Small, one-off literal values used only in a single place, such as
assigning a person's name in a simple example, are fine as plain literals.
Named constants are most valuable for values that are meaningful, reused in
multiple places, or likely to need updating later.

**"Can a constant's value be calculated from other variables?"**
No, not in the simple sense covered in this lesson. A constant declared
with `dcl-c` holds a fixed value known when the program is written, not a
value calculated while the program runs.

## Quick Recap

- A literal is a fixed value typed directly into RPGLE code, such as
  `'Jordan Lee'`, `100`, or `*on`.
- A constant, declared with `dcl-c`, is a named value that cannot be
  changed after it is declared.
- Using named constants instead of repeated literals makes a program easier
  to update consistently and easier for others to understand.
- Constants are most valuable for meaningful values reused in more than one
  place.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I try to change the value of a dcl-c constant while the
  program is running?"
- "What are some good examples of values that make sense as named
  constants?"
