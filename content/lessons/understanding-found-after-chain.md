# Understanding %FOUND after CHAIN

## Learning Objective

By the end of this lesson, you will understand exactly what `%FOUND`
checks, and why it must be tested immediately after every `CHAIN` before
using the fields it was supposed to retrieve.

## Simple Explanation

In the CHAIN for Keyed Access lesson, you saw that `CHAIN` might not find
a matching record at all. **`%FOUND`** is a built-in function that reports
whether the most recent operation, such as `CHAIN`, on a given file
actually succeeded in locating a record.

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);
dcl-s custDisplay char(50);

custNbr = 1042;
chain custNbr CUSTMAST;
if %found(CUSTMAST);
  custDisplay = 'Found: ' + CUSTNAME;
else;
  custDisplay = 'Customer not found';
endif;

dsply custDisplay;
```

Here, `%found(CUSTMAST)` becomes true only if the preceding `chain
custNbr CUSTMAST;` actually located a matching record. If it did, the
program can safely use `CUSTMAST`'s fields, such as `CUSTNAME`, knowing
they reflect a real, retrieved record. If not, those fields should not be
trusted, since no matching record was actually found, and the program
instead handles that case, here simply reporting that the customer was
not found.

## Why It Matters

Checking `%FOUND` immediately after `CHAIN` is essential: without it, a
program has no reliable way to know whether the fields it is about to use
actually came from a real record or are left over from some earlier,
unrelated state. This is exactly the kind of check-before-use discipline
that makes keyed lookups safe and predictable.

## Practical Example

Imagine the customer inquiry program from the previous lesson. A user
enters a customer number that does not actually exist in `CUSTMAST`. The
`CHAIN` operation completes without error, but finds nothing. Checking
`%found(CUSTMAST)` immediately afterward, the program correctly
recognizes this, and shows a "Customer not found" message instead of
trying to display fields from a record that was never actually retrieved.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly why checking `%FOUND` after `CHAIN`
matters in everyday RPGLE code.

## Common Confusions

**"If CHAIN doesn't find a record, does it cause an error?"**
No. `CHAIN` completes normally whether or not a matching record is
found; it does not raise an error on its own for a missing record. This is
exactly why `%FOUND` needs to be checked explicitly, rather than relying
on some kind of automatic failure.

**"Can I safely use a file's fields right after CHAIN without checking
%FOUND first?"**
No, not safely. Without checking `%FOUND`, there is no reliable way to
know whether those fields reflect an actual retrieved record or leftover
values from before the `CHAIN` was attempted.

**"Does %FOUND work with READ as well as CHAIN?"**
`%FOUND` is specifically associated with operations like `CHAIN` that
look for one specific record. `READ`, covered in an earlier lesson,
uses `%EOF` instead to report whether another record was available to
retrieve.

## Quick Recap

- `%FOUND` reports whether the most recent operation, such as `CHAIN`,
  actually located a matching record.
- `CHAIN` does not raise an error when no matching record is found; it
  simply does not retrieve one.
- Always check `%FOUND` immediately after `CHAIN` before using the file's
  fields, to confirm they reflect a real, retrieved record.
- `%FOUND` is used with key-based lookups like `CHAIN`; `%EOF` is used
  with sequential reads like `READ`.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if my program used a field's value after CHAIN
  without checking %FOUND first?"
- "Is there a built-in function similar to %FOUND used for other
  operations besides CHAIN?"
