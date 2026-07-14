# SETLL in RPGLE

## Learning Objective

By the end of this lesson, you will be able to use `SETLL` to position a
keyed file at a specific key value, and explain how this differs from
`CHAIN`.

## Simple Explanation

In the CHAIN for Keyed Access lesson, `CHAIN` both positioned the file at a
key value and immediately retrieved the matching record. Sometimes a
program only needs to **position** the file at a key value, without
retrieving a record yet, usually because it is about to read a whole group
of records from that point forward with `READ` or `READE`, covered in the
next lesson. This is what **`SETLL`** (Set Lower Limit) is for.

```rpgle
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
setll custNbr ORDHIST;
```

Here, `setll custNbr ORDHIST;` positions `ORDHIST` immediately before the
first record whose key is greater than or equal to `custNbr`, but it does
not actually retrieve that record into the program. Whether a record with
exactly that key value exists is checked using `%EQUAL`, IBM i's built-in
function for testing whether `SETLL` landed on an exact match rather than
simply the next-highest key.

`SETLL` requires the file to be declared `keyed`, exactly the same
requirement covered for `CHAIN` in the RPGLE File Declarations with dcl-f
lesson, since it depends on the file's key to find the correct position.

## Why It Matters

`SETLL` is the standard first step before reading a group of related
records in key order, such as every order belonging to one customer. On
its own it does not retrieve anything, which is exactly why it is paired
with `READ` or `READE` immediately afterward, rather than being used by
itself the way `CHAIN` is.

## Practical Example

Imagine `ORDHIST`, a physical file recording every order a customer has
ever placed, keyed by customer number, with more than one order record
sharing the same customer number. Before reading through one customer's
full order history, a program first calls `setll custNbr ORDHIST;` to
position the file at that customer's first order, ready for a `READE` loop,
covered in the next lesson, to step through every matching record from
there.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how `SETLL` is used to prepare for reading
a related group of records, such as the orders loaded in the Simple Inquiry
Subfile Pattern lesson earlier in this path.

## Common Confusions

**"Isn't SETLL basically the same thing as CHAIN?"**
No, even though both take a key value and a keyed file. `CHAIN` retrieves a
matching record immediately. `SETLL` only positions the file at that key
value; no record is retrieved until a following `READ` or `READE` is
called.

**"What happens if no record with that exact key value exists?"**
`SETLL` still succeeds, positioning the file at the next record with a key
greater than or equal to the value given, rather than failing. `%EQUAL` is
used immediately afterward to check whether that position happens to be an
exact match.

**"Do I always need to check %EQUAL after SETLL?"**
It depends on what comes next. If the following step is a `READE` loop
expecting to process only exact matches, checking `%EQUAL` first, or
relying on `READE`'s own matching behavior, covered in the next lesson,
matters. If the goal is simply to position before reading forward
regardless of an exact match, `%EQUAL` may not be needed.

## Quick Recap

- `SETLL keyValue fileName;` positions a keyed file at a key value without
  retrieving a record.
- `%EQUAL` checks whether `SETLL` landed on an exact match for that key
  value.
- `SETLL` requires the file to be declared `keyed`, the same requirement as
  `CHAIN`.
- `SETLL` is almost always followed by `READ` or `READE` to actually
  retrieve records from that position forward.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the practical difference between using SETLL and using CHAIN?"
- "What would happen if I called READ right after SETLL without checking
  %EQUAL first?"
