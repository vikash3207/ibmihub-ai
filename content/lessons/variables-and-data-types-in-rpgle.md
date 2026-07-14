# Variables and Data Types in RPGLE

## Learning Objective

By the end of this lesson, you will be able to declare a simple RPGLE
variable using `dcl-s`, and recognize a few of the most common RPGLE data
types and what kind of value each one holds.

## Simple Explanation

In the RPGLE Program Structure lesson, you saw a declaration like
`dcl-s custName char(30);` without a detailed explanation of what it means.
This lesson looks specifically at how variables are declared in free-format
RPGLE, and what data types are commonly used.

A **variable** is a named piece of storage a program uses to hold a value
while it runs. In free-format RPGLE, a simple, standalone variable is
declared using **`dcl-s`** (Declare Standalone), followed by the variable's
name and its data type:

```rpgle
dcl-s custName char(30);
dcl-s custBalance packed(9:2);
dcl-s isActive ind;
```

Some of the most common RPGLE data types you will encounter include:

- **`char(n)`**: character (text) data, holding up to `n` characters.
- **`packed(n:d)`**: packed decimal numeric data, where `n` is the total
  number of digits and `d` is how many of those digits fall after the
  decimal point. This connects directly to the packed decimal data type you
  learned about in the DDS Field Definitions lesson.
- **`int(n)`**: whole number (integer) data, where `n` is the size in bits,
  such as `int(10)`.
- **`ind`**: indicator data, holding a simple on/off, true/false style value
  (`*on` or `*off`).

Every variable must be declared with a specific data type before it is
used, and, once declared, a variable can only hold values consistent with
that type: a `char` variable holds text, a `packed` variable holds a
decimal number, and so on.

## Why It Matters

Understanding variable declarations and data types is foundational to
reading or writing any RPGLE program: essentially every calculation,
comparison, and decision in a program works with values stored in
variables of a specific, declared type. Recognizing common data types like
`char`, `packed`, `int`, and `ind` lets you understand what kind of value a
variable is actually meant to hold just by glancing at its declaration.

## Practical Example

Imagine a simple program that needs to track a customer's name and account
balance. It declares `custName` as `char(30)`, able to hold up to 30
characters of text, and `custBalance` as `packed(9:2)`, able to hold a
numeric value with up to 9 total digits, 2 of them after the decimal point,
suitable for representing a dollar amount with cents.

Because these data types are declared up front, the rest of the program can
safely assume `custName` always holds text and `custBalance` always holds a
properly structured decimal number, without needing to check this
constantly. This is a simplified, illustrative example rather than a
specific real program, but it reflects a very common, everyday pattern in
RPGLE code.

## Common Confusions

**"Do I need to specify a length or size for every data type?"**
Most RPGLE data types, including `char`, `packed`, and `int`, require you to
specify a size, such as `char(30)` or `packed(9:2)`. This tells IBM i
exactly how much storage the variable needs and what values it can hold.

**"Can a variable change its data type after it is declared?"**
No. A variable's data type is fixed once it is declared, similar in spirit
to how a DDS field's data type is fixed once defined, as covered in the DDS
Field Definitions lesson. To store a fundamentally different kind of value,
you declare a different variable with the appropriate type.

**"Is `dcl-s` the only way to declare something in RPGLE?"**
For simple, standalone variables of the kind covered in this lesson group,
`dcl-s` is the form you will use. Other declaration forms exist for more
advanced situations, such as defining reusable structures, but those go
beyond the scope of this introductory lesson group.

## Quick Recap

- A variable is declared in free-format RPGLE using `dcl-s`, followed by
  its name and data type.
- Common RPGLE data types include `char(n)` for text, `packed(n:d)` for
  decimal numbers, `int(n)` for whole numbers, and `ind` for on/off values.
- A variable's data type is fixed once declared and determines what kind of
  value it can hold.
- Recognizing common data types helps you understand what a variable
  declaration actually means at a glance.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What is the difference between packed and int data types in RPGLE?"
- "What happens if I try to assign text to a packed decimal variable?"
