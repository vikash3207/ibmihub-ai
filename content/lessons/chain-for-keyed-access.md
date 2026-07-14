# CHAIN for Keyed Access

## Learning Objective

By the end of this lesson, you will be able to use `CHAIN` to look up one
specific record in a keyed physical file by its key value.

## Simple Explanation

In the Reading Physical Files in RPGLE with READ lesson, `READ` retrieved
records one at a time from beginning to end. Often, a program instead
needs exactly one specific record, identified by a known key value, such
as looking up one customer by customer number. This is what **`CHAIN`**
is for.

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
chain custNbr CUSTMAST;
```

Here, `chain custNbr CUSTMAST;` looks up the record in `CUSTMAST` whose
key matches the value in `custNbr`, exactly the kind of keyed lookup
described conceptually in the Keyed Physical Files lesson. If a matching
record is found, its fields, such as `CUSTNAME` and `CUSTBAL`, are
immediately available in the program, just as if that record had been
read with `READ`. Whether a matching record was actually found is checked
using `%FOUND`, covered in the next lesson.

`CHAIN` requires the file to be declared with `keyed`, as covered in the
RPGLE File Declarations with dcl-f lesson, since it depends on the file's
key to locate the correct record directly, without scanning through
every record in between.

## Why It Matters

`CHAIN` is how an RPGLE program efficiently retrieves exactly the one
record it needs, rather than reading through a file from the beginning
until the right record happens to come up. This directly supports common,
everyday tasks like an inquiry screen looking up one customer, one order,
or one product by a known key value.

## Practical Example

Imagine a customer inquiry program, connecting directly to the customer
inquiry screens covered in earlier lessons in this path. A user enters a
customer number, and the program uses `chain custNbr CUSTMAST;` to
retrieve exactly that customer's record directly, without needing to read
through every other customer record in the file first.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly the kind of keyed lookup that underlies
a huge number of everyday IBM i inquiry and lookup tasks.

## Common Confusions

**"Does CHAIN work on a file that isn't keyed?"**
No. `CHAIN` depends on a file's key to locate a record directly, so the
file must be declared with `keyed` on its `dcl-f` statement, as covered in
the RPGLE File Declarations with dcl-f lesson.

**"What happens if no record matches the key value I chain with?"**
The chain operation completes without error, but no record is actually
retrieved; the fields from the file are left in whatever state they were
in before, rather than reflecting a real record. This is exactly why
checking `%FOUND`, covered in the next lesson, matters after every
`CHAIN`.

**"Is CHAIN faster than reading through a file with READ to find the same
record?"**
Generally, yes, for a keyed file, since `CHAIN` uses the file's key
structure to go directly to the matching record, rather than checking
records one at a time from the beginning the way a `READ` loop would.

## Quick Recap

- `CHAIN keyValue fileName;` looks up one specific record in a keyed file
  by its key value.
- The file must be declared with `keyed` on `dcl-f` for `CHAIN` to work.
- If a matching record is found, its fields become available in the
  program, the same as with `READ`.
- `%FOUND`, covered in the next lesson, is used to check whether `CHAIN`
  actually located a matching record.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can CHAIN look up a record using more than one key field at once?"
- "What is the difference between CHAIN and using READ in a loop to find
  one specific record?"
