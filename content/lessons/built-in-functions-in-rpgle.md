# Built-in Functions in RPGLE

## Learning Objective

By the end of this lesson, you will understand what a built-in function is
in RPGLE, and be able to use a few of the most common ones: `%TRIM`,
`%LEN`, `%SUBST`, `%CHAR`, and `%DEC`.

## Simple Explanation

In the Expressions and Assignment in RPGLE lesson, you learned how to
combine variables, literals, and operators into expressions. RPGLE also
provides **built-in functions**, sometimes called BIFs, which are
ready-made operations you can use inside an expression, always written
starting with a percent sign (`%`).

A few especially common built-in functions include:

- **`%TRIM(value)`**: removes extra blank spaces from the beginning and end
  of a character value.
- **`%LEN(value)`**: returns how many characters long a value currently is.
- **`%SUBST(value : start : length)`**: pulls out a portion of a character
  value, starting at position `start`, for `length` characters.
- **`%CHAR(value)`**: converts a numeric value into its character (text)
  representation.
- **`%DEC(value : totalDigits : decimalDigits)`**: converts a character
  value into a packed decimal number with the specified total digits and
  decimal digits.

```rpgle
dcl-s rawName char(30);
dcl-s trimmedName char(30);
dcl-s nameLength int(10);
dcl-s firstThree char(3);

rawName = 'Jordan Lee                   ';
trimmedName = %trim(rawName);
nameLength = %len(trimmedName);
firstThree = %subst(trimmedName : 1 : 3);
```

## Why It Matters

Built-in functions handle small, common tasks, cleaning up text, converting
between data types, pulling out part of a value, that would otherwise
require writing extra logic by hand every time. Recognizing a handful of
frequently used ones, especially `%TRIM`, `%LEN`, `%SUBST`, `%CHAR`, and
`%DEC`, covers a large share of what you will actually reach for in
everyday RPGLE code.

## Practical Example

Imagine a program that receives a customer name with extra trailing spaces,
perhaps from an external system. Before displaying or comparing that name,
the program uses `%trim` to remove the extra spaces, ensuring the value is
clean and predictable to work with, rather than accidentally including
blank padding when the name is used elsewhere in the program.

This is a simplified, illustrative example rather than a specific real
integration, but it reflects a very common, everyday reason `%TRIM`
specifically is one of the most frequently used RPGLE built-in functions.

## Common Confusions

**"Is a built-in function the same thing as a procedure I write myself?"**
Not quite. Built-in functions are provided directly by the RPGLE language
itself, always starting with `%`, and are ready to use without any
declaration. Procedures, covered in a later lesson, are blocks of logic you
define yourself.

**"Why do %SUBST and %DEC use colons between their arguments?"**
The colon separates multiple pieces of information a built-in function
needs, such as `%SUBST(value : start : length)` needing the value, a
starting position, and a length. This is simply RPGLE's syntax for
built-in functions that take more than one piece of information.

**"Does %CHAR always produce a fixed-length result?"**
No. `%CHAR` produces a character value only as long as it needs to be to
represent the number, without extra padding, which is worth keeping in mind
if you plan to combine or compare its result with other character values.

## Quick Recap

- Built-in functions (BIFs) are ready-made RPGLE operations, always written
  starting with `%`.
- `%TRIM` removes extra blank spaces; `%LEN` returns a value's current
  length; `%SUBST` pulls out part of a character value.
- `%CHAR` converts a number to character data; `%DEC` converts character
  data to a packed decimal number.
- Built-in functions handle common, everyday tasks without needing to write
  extra logic by hand.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What are some other commonly used RPGLE built-in functions besides
  %TRIM, %LEN, %SUBST, %CHAR, and %DEC?"
- "What happens if %SUBST tries to pull out more characters than the
  value actually has?"
