# Updating Records with UPDATE

## Learning Objective

By the end of this lesson, you will be able to use `UPDATE` to save
changes to a record that was already successfully retrieved with `CHAIN`.

## Simple Explanation

Once a specific record has been retrieved with `CHAIN` and confirmed with
`%FOUND`, as covered in the previous two lessons, a program can change
that record's field values and use **`UPDATE`** to save those changes
back to the file.

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
chain custNbr CUSTMAST;
if %found(CUSTMAST);
  custBal = 500.00;
  update CUSTMAST;
endif;
```

Here, the program first uses `chain custNbr CUSTMAST;` to retrieve the
specific customer record, checks `%found(CUSTMAST)` to confirm it was
actually located, and only then changes `custBal` and calls `update
CUSTMAST;` to save that new balance back into the same record in the
file. `UPDATE` generally operates on whichever record was most recently
retrieved for that file, whether by `CHAIN` or `READ`.

## Why It Matters

`UPDATE` is how existing business data actually gets changed on IBM i: an
updated balance, a changed address, a revised status. Understanding that
`UPDATE` depends on a record having already been successfully retrieved
first is essential; there is no way to update a record the program has
not first read.

## Practical Example

Imagine a program processing a payment against a customer's balance. It
first uses `CHAIN` to retrieve that customer's record by customer number,
confirms the record was found with `%FOUND`, then reduces `custBal` by
the payment amount and calls `UPDATE` to save the new balance back into
`CUSTMAST`. The next time that customer's record is retrieved, it
reflects the updated balance.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how balance and status changes are
commonly applied to existing records in RPGLE.

## Common Confusions

**"Can I call UPDATE without first using CHAIN or READ?"**
No. `UPDATE` saves changes to whichever record was most recently
retrieved for that file; without a preceding successful `CHAIN` or
`READ`, there is no specific record for `UPDATE` to apply changes to.

**"Does UPDATE change every field in the record, or only the ones I
assigned?"**
`UPDATE` saves the record's current field values as they stand in the
program at the moment `UPDATE` is called, which includes both fields you
explicitly changed and any that were retrieved unchanged from the
original `CHAIN` or `READ`.

**"What happens if I call UPDATE after a CHAIN that didn't find a
record?"**
This results in an error, since there is no actual retrieved record for
`UPDATE` to apply changes to. This is exactly why checking `%FOUND`
before making any changes, and before calling `UPDATE`, matters.

## Quick Recap

- `UPDATE fileName;` saves changes to whichever record was most recently
  retrieved with `CHAIN` or `READ` for that file.
- A record must be successfully retrieved, and confirmed with `%FOUND` or
  a successful `READ`, before `UPDATE` can be used.
- `UPDATE` saves the record's current field values as they stand at the
  moment it is called.
- Calling `UPDATE` without a preceding successful retrieval results in an
  error.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can I retrieve a record with READ instead of CHAIN and still use
  UPDATE on it afterward?"
- "What happens if two different parts of a program try to update the
  same record around the same time?"
