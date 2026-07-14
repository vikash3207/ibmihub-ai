# READE for Reading Matching Keys

## Learning Objective

By the end of this lesson, you will be able to use `SETLL` together with
`READE` to read every record sharing the same key value, stopping cleanly
once the key no longer matches.

## Simple Explanation

`CHAIN` retrieves only the first record matching a key value. Many
real-world lookups need every record sharing that value, such as every
order belonging to one customer. This is what **`READE`** (Read Equal) is
for, always used together with `SETLL`, covered in the previous lesson.

```rpgle
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
setll custNbr ORDHIST;
reade custNbr ORDHIST;
dow not %eof(ORDHIST);
  // process one matching order record here
  reade custNbr ORDHIST;
enddo;
```

Here, `setll custNbr ORDHIST;` positions the file at customer 1042's first
order, and each `reade custNbr ORDHIST;` retrieves the next record whose
key still matches `custNbr`. As soon as a record's key no longer matches,
`READE` sets `%EOF` to `*on` instead of retrieving another record, exactly
like `READ` does at the true end of a file, covered in the Understanding
%EOF in RPGLE File Processing lesson, giving the loop a clean, natural
stopping point.

## Why It Matters

`READE` is how an RPGLE program processes an entire group of related
records sharing one key value, rather than only the first one. This is
precisely the native operation behind patterns like loading every order a
customer has placed, the kind of loading step described conceptually with a
simple fixed loop in the Simple Inquiry Subfile Pattern lesson earlier in
this path.

## Practical Example

Imagine the order history screen from the Simple Inquiry Subfile Pattern
lesson, but now loading a real customer's actual orders instead of
generating fixed order numbers. The program calls `setll custNbr ORDHIST;`
to position at that customer's first order, then loops on `reade custNbr
ORDHIST;`, loading one real order record into the `ORDSFL` subfile record
format on each pass, until `%EOF` becomes `*on` once every order for that
customer has been loaded.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how `SETLL` and `READE` together replace
a fixed, illustrative loop with real, key-driven file processing.

## Common Confusions

**"Do I need SETLL before every READE?"**
Yes, for the pattern covered in this lesson. `SETLL` positions the file at
the first record for a key value; `READE` then reads forward from that
position, checking each record's key as it goes. Without the initial
`SETLL`, `READE` would have no defined starting point for that key value.

**"What is the difference between READE and CHAIN when duplicate keys are
involved?"**
`CHAIN` always retrieves only the first record matching a key value, even
if others share that same key. `READE`, used in a loop after `SETLL`,
retrieves every record sharing that key value, one at a time, which is
exactly what processing duplicate keys, covered in a later lesson, requires.

**"How does READE know when to stop?"**
`READE` checks the key of each next record against the key value it was
given. As soon as a record's key no longer matches, `READE` does not
retrieve it; instead it sets `%EOF` to `*on`, giving the loop its natural
stopping point.

## Quick Recap

- `READE keyValue fileName;`, used after `SETLL`, reads the next record
  only if its key still matches the given key value.
- `%EOF` becomes `*on` once a record's key no longer matches, stopping the
  loop cleanly.
- `SETLL` and `READE` together process every record sharing one key value,
  unlike `CHAIN`, which only ever retrieves the first match.
- This pattern is the real, native operation behind loading a related group
  of records, such as one customer's full order history.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I used READ instead of READE inside this kind of
  loop?"
- "Can READE be used on a file that isn't keyed?"
