# Variables in CLLE

## Learning Objective

By the end of this lesson, you will be able to declare a CL variable using
`DCL`, recognize common CL data types, and change a variable's value using
`CHGVAR`.

## Simple Explanation

In the CLLE Program Structure lesson, you saw a `DCL` statement without a
detailed explanation of its parts. This lesson looks specifically at CL
variables: how they are declared, what data types are common, and how
their values are changed.

A CL variable is declared using **`DCL`**, specifying the variable's name,
type, and, for some types, a length:

```clle
DCL VAR(&CUSTNAME) TYPE(*CHAR) LEN(30)
DCL VAR(&ORDERTOTAL) TYPE(*DEC) LEN(9 2)
DCL VAR(&ORDERCOUNT) TYPE(*INT) LEN(4)
```

Common CL data types include:

- **`*CHAR`**: character (text) data, similar to `char` in RPGLE.
- **`*DEC`**: decimal numeric data, with a length specifying total digits
  and decimal digits, similar to `packed` in RPGLE.
- **`*INT`**: whole number (integer) data.
- **`*LGL`**: logical data, holding a simple true/false style value.

Every CL variable name starts with an ampersand (`&`). Once declared, a
variable's value is changed using **`CHGVAR`** (Change Variable), giving
the variable's name and its new value:

```clle
CHGVAR VAR(&CUSTNAME) VALUE('Jordan Lee')
CHGVAR VAR(&ORDERTOTAL) VALUE(100.00)
```

## Why It Matters

CL variables let a CLLE program hold and work with changing values, such
as a customer name being processed, an order total, or a count of records
handled so far, in the same way variables serve this purpose in RPGLE.
Recognizing `DCL` and `CHGVAR`, and common CL data types like `*CHAR` and
`*DEC`, is foundational to reading or writing any CLLE program that does
more than run a fixed sequence of commands.

## Practical Example

Imagine a CLLE program that keeps track of how many records it has
processed so far, using a variable declared as
`DCL VAR(&ORDERCOUNT) TYPE(*INT) LEN(4)`. As the program runs, it uses
`CHGVAR` to update `&ORDERCOUNT` each time it processes another record,
letting later parts of the program, such as a message reporting how many
records were handled, refer to that same, current count.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a very common, everyday use of CL variables in
CLLE programs.

## Common Confusions

**"Is *DEC in CL the same thing as packed in RPGLE?"**
They serve the same general purpose, holding decimal numeric data with a
specified number of total and decimal digits, though `*DEC` is CL's own
keyword for this, distinct from RPGLE's `packed` data type.

**"Do I need to use CHGVAR every time I want to give a variable an initial
value?"**
Not always. `DCL` itself can optionally include an initial value using the
`VALUE` keyword parameter. `CHGVAR` is used specifically to change a
variable's value after it has already been declared, whether that is the
first meaningful assignment or a later update.

**"Can a CL variable change its data type after it is declared?"**
No. Like RPGLE variables, a CL variable's data type is fixed once declared
by `DCL` and cannot change while the program runs.

## Quick Recap

- `DCL` declares a CL variable, specifying its name, type, and, for some
  types, a length; every CL variable name starts with `&`.
- Common CL data types include `*CHAR` (text), `*DEC` (decimal numbers),
  `*INT` (whole numbers), and `*LGL` (true/false values).
- `CHGVAR` changes a variable's value after it has been declared.
- CL variables let a CLLE program hold and work with changing values, the
  same general purpose variables serve in RPGLE.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can I give a CL variable an initial value directly in its DCL
  statement?"
- "What is the CL equivalent of RPGLE's ind data type?"
