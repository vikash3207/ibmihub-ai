# Commitment Control Overview

## Learning Objective

By the end of this lesson, you will be able to explain what commitment
control is and why it depends on the journaling concepts already
covered in this batch.

## Simple Explanation

Every `WRITE`, `UPDATE`, and `DELETE` covered elsewhere in this course
takes effect on a table immediately, one operation at a time.
**Commitment control** introduces a different idea: grouping a set of
related changes into a single **transaction**, so that either all of
them take effect together, or none of them do, if something goes wrong
partway through.

```rpgle
exec sql
  UPDATE MYLIB.CUSTMAST
  SET CREDITLIMIT = CREDITLIMIT - 500
  WHERE CUSTNBR = :custNbr;

exec sql
  INSERT INTO MYLIB.ORDERS (CUSTNBR, ORDERAMT)
  VALUES (:custNbr, 500);
```

Without commitment control, if the `INSERT` failed after the `UPDATE`
already succeeded, the customer's credit limit would be reduced with
no matching order ever created. Commitment control groups both
statements as one transaction, so either both succeed together or
neither does.

## Why It Matters

Some business operations genuinely need multiple related changes to
succeed or fail together, exactly like the credit-limit-and-order
example above. Without commitment control, a failure partway through
such a sequence can leave a table in an inconsistent state, matching
neither the state before the operation started nor a fully completed
one. Commitment control exists specifically to prevent that partial,
inconsistent outcome.

## Practical Example

Recall the running order-processing example used throughout this
course. Reducing a customer's credit limit and creating their new
order are two separate statements, but they represent one real business
event: placing an order. Commitment control treats them as a single
transaction, so a failure creating the order also undoes the credit
limit reduction, leaving the customer's account exactly as it was
before the attempt, rather than partially updated.

This is a simplified, illustrative example rather than a specific real
transaction, but it reflects exactly why commitment control matters.

## Common Confusions

**"Is commitment control the same thing as journaling, covered earlier
in this batch?"**
Not the same thing, but commitment control depends on journaling:
tables involved in a commitment-control transaction generally need to
be journaled first, since the journal is what makes it possible to
undo a partially completed transaction.

**"Does commitment control apply automatically to every SQL statement I
write?"**
No. Commitment control needs to be deliberately started, covered in
the next lesson in this batch, and applies to the statements run within
that scope, not automatically to every statement everywhere.

**"Is grouping changes into a transaction only relevant for financial
data?"**
No. Any situation where multiple related changes genuinely need to
succeed or fail together benefits from this idea, not only financial
examples, even though a financial example is a clear, intuitive
illustration.

## Quick Recap

- Commitment control groups a set of related changes into a single
  transaction, so they all succeed together or none of them take
  effect.
- Without it, a failure partway through a multi-step operation can
  leave a table in an inconsistent, partially updated state.
- Commitment control depends on journaling, covered earlier in this
  batch, to make undoing a partial transaction possible.
- This concept applies to any genuinely related set of changes, not
  only financial examples.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic example of a business operation
  that would need multiple changes to succeed or fail together?"
- "Why does commitment control specifically depend on journaling to
  work?"
