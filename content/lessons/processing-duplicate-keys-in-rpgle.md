# Processing Duplicate Keys in RPGLE

## Learning Objective

By the end of this lesson, you will be able to explain what a duplicate key
is, and use `SETLL` and `READE` together to process every record sharing
one key value.

## Simple Explanation

In the Keyed Physical Files lesson, a key was described as a field, or
combination of fields, used to look up or order records. A key does not
have to be unique: when more than one record shares the same key value,
those records are said to have a **duplicate key**. `ORDHIST`, keyed by
customer number, is a natural example: one customer can have many orders,
so many records legitimately share the same customer number key.

```rpgle
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);
dcl-s orderCount int(10) inz(0);

custNbr = 1042;
setll custNbr ORDHIST;
reade custNbr ORDHIST;
dow not %eof(ORDHIST);
  orderCount += 1;
  reade custNbr ORDHIST;
enddo;
```

This is exactly the `SETLL` and `READE` pattern from the previous lesson,
now specifically framed around duplicate keys: every record sharing
`custNbr`'s value is counted here, one at a time, until `%EOF` shows that
no more matching records remain.

## Why It Matters

Duplicate keys are common and completely normal in everyday IBM i data,
not an error condition. Understanding that a key can legitimately repeat
across many records, and that `SETLL` plus `READE` is the standard way to
process every one of those records, is essential for correctly handling
data like one customer's full order history, rather than accidentally
processing only the first matching record with `CHAIN`.

## Practical Example

Imagine generating a summary report of how many orders each customer has
placed. For one customer number, the program uses `setll custNbr ORDHIST;`
followed by a `reade custNbr ORDHIST;` loop, counting every order record
sharing that customer's key, exactly as shown above. Using `CHAIN` instead
would only ever find the customer's first order, silently ignoring every
other one sharing that same key.

This is a simplified, illustrative example rather than a specific real
report, but it reflects a genuinely common IBM i task: correctly
accounting for every record behind a key value that is expected to repeat.

## Common Confusions

**"Is a duplicate key a mistake or a data problem?"**
Not necessarily. Some keys, such as a customer number over an order
history file, are expected to repeat across many records by design. Other
keys, such as a customer number over a customer master file, are expected
to be unique, and a repeat there might indicate a real problem. Whether
duplicates are expected depends entirely on how a specific file is
designed to be used.

**"Why not just use CHAIN in a loop to get every matching record?"**
`CHAIN` always retrieves the same first matching record for a given key
value; it has no way to continue on to the next matching record after
that. `SETLL` and `READE` together are specifically designed to step
through every record sharing a key value, one at a time.

**"Does the order of duplicate-key records matter?"**
Records sharing the same key value are still retrieved in a consistent
order relative to each other, generally the order they were added unless
the file's design says otherwise, so a `READE` loop processes them in a
predictable, repeatable sequence rather than an arbitrary one.

## Quick Recap

- A duplicate key means more than one record shares the same key value,
  which is normal and expected for some files, such as an order history
  file keyed by customer number.
- `SETLL` followed by a `READE` loop is the standard way to process every
  record sharing one key value.
- `CHAIN` only ever retrieves the first matching record, silently ignoring
  any others sharing that key.
- Whether duplicate keys are expected or a sign of a problem depends on how
  a specific file is designed to be used.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I count how many orders each different customer has, not just
  one specific customer?"
- "What would happen if I mistakenly expected a key to be unique but it
  actually had duplicates?"
