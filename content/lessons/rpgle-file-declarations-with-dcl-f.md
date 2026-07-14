# RPGLE File Declarations with dcl-f

## Learning Objective

By the end of this lesson, you will be able to declare a database file in
free-format RPGLE using `dcl-f`, and explain how this connects an RPGLE
program to an externally described physical or logical file.

## Simple Explanation

In the RPGLE Program Calling a Display File lesson, you saw `dcl-f` used
with the `workstn` keyword to declare a display file. `dcl-f` is also how
an RPGLE program declares a **database file**, a physical or logical file,
as covered in the Physical Files Explained in Depth and Logical Files
Explained in Depth lessons, giving the program access to its stored data.

```rpgle
dcl-f CUSTMAST disk keyed;
```

Here, `dcl-f CUSTMAST disk keyed;` declares `CUSTMAST`, the customer
physical file used throughout earlier Db2 for i lessons, as a database
file: **`disk`** identifies it as a database file rather than a
workstation or printer file, and **`keyed`** tells the compiler this
program intends to access it by key, connecting directly to the Keyed
Physical Files lesson.

Because `CUSTMAST` is an **externally described file**, meaning its
fields come from the file's own DDS definition rather than being
redeclared inside the RPGLE program, the program automatically gains
access to every field in `CUSTMAST`'s record format, such as customer
number, name, and balance, simply by declaring the file this way. This
connects directly to the DDS Field Definitions lesson: whatever fields and
data types were defined there are exactly what the RPGLE program now has
available to work with.

## Why It Matters

`dcl-f` is the starting point for any RPGLE program that reads or updates
stored data: without it, a program has no connection to a physical or
logical file at all. Understanding that an externally described file
brings its fields into the program automatically, rather than needing
them retyped, is what makes RPGLE's tight integration with Db2 for i
genuinely convenient.

## Practical Example

Imagine an RPGLE program that needs to look up customer information.
Declaring `dcl-f CUSTMAST disk keyed;` at the top of the program gives it
immediate access to every field defined in `CUSTMAST`'s DDS, such as
`CUSTNBR`, `CUSTNAME`, and `CUSTBAL`, without the program needing to
separately declare variables for each one. The lessons that follow in this
group cover how the program actually reads, writes, updates, and deletes
using this file declaration.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how most RPGLE programs begin working
with stored data.

## Common Confusions

**"Is dcl-f disk the same thing as dcl-f workstn?"**
No. Both use the same `dcl-f` keyword to declare a file, but `disk`
identifies a database file, a physical or logical file, while `workstn`,
covered in the RPGLE Program Calling a Display File lesson, identifies a
display file. The device type keyword tells the compiler what kind of
file, and what operations, to expect.

**"Do I need to declare every field in CUSTMAST separately, like with
dcl-s?"**
No. Because `CUSTMAST` is externally described, its fields are brought
into the program automatically when it is declared with `dcl-f`, unlike
the standalone variables covered in the Variables and Data Types in RPGLE
lesson, which are always declared individually with `dcl-s`.

**"Do I always need the keyed keyword?"**
Only if the program intends to access the file by key, using `CHAIN`,
`SETLL`, `READE`, or `READP`, all covered in later lessons in this group.
A program that only reads through a file from beginning to end, without
looking up or positioning by key, does not need `keyed`.

## Quick Recap

- `dcl-f fileName disk keyed;` declares a database file, a physical or
  logical file, connecting an RPGLE program to its stored data.
- `disk` identifies a database file, distinct from `workstn` used for
  display files.
- `keyed` is added when the program intends to access the file by key
  using `CHAIN`, `SETLL`, `READE`, or `READP`.
- An externally described file's fields are brought into the program
  automatically, without needing to be redeclared individually.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if CUSTMAST's DDS changes after my RPGLE program has
  already been compiled?"
- "Can one RPGLE program declare more than one database file at the same
  time?"
