# STRCMTCTL, COMMIT, and ROLLBACK Basics

## Learning Objective

By the end of this lesson, you will be able to use `STRCMTCTL`,
`COMMIT`, and `ROLLBACK` to group a set of changes into a transaction.

## Simple Explanation

The previous lesson introduced commitment control conceptually. Using
it in practice involves three pieces:

- **`STRCMTCTL`**: starts commitment control for a job, before any
  transaction begins.
- **`COMMIT`**: marks the end of a successful transaction, making all
  its changes permanent together.
- **`ROLLBACK`**: undoes every change made since the last `COMMIT`, as
  if the transaction never happened.

```clle
STRCMTCTL LCKLVL(*CHG)
```

```rpgle
exec sql
  UPDATE MYLIB.CUSTMAST
  SET CREDITLIMIT = CREDITLIMIT - 500
  WHERE CUSTNBR = :custNbr;

exec sql
  INSERT INTO MYLIB.ORDERS (CUSTNBR, ORDERAMT)
  VALUES (:custNbr, 500);

if sqlcode = 0;
  exec sql COMMIT;
else;
  exec sql ROLLBACK;
endif;
```

## Why It Matters

This is the practical mechanism behind the transaction concept
introduced in the previous lesson: `STRCMTCTL` establishes that changes
should be grouped, and the program itself decides, based on whether
everything succeeded, whether to make the group permanent with
`COMMIT` or undo it entirely with `ROLLBACK`. Without deliberately
checking for success and calling one or the other, a program cannot
actually take advantage of commitment control's protection.

## Practical Example

Recall the credit-limit-and-order example from the previous lesson.
After both the `UPDATE` and `INSERT` run, checking `SQLCODE`, covered
in the Advanced SQL lessons, decides which path to take: `COMMIT` if
both succeeded, making the credit limit reduction and new order
permanent together, or `ROLLBACK` if the `INSERT` failed, undoing the
credit limit reduction so the customer's account is left exactly as it
was before the attempt.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how `COMMIT` and `ROLLBACK` are used
in practice.

## Common Confusions

**"Does a transaction end automatically if I never call COMMIT or
ROLLBACK?"**
Not on its own in any dependable way; a program should always
explicitly decide between `COMMIT` and `ROLLBACK` once it knows whether
a transaction's steps succeeded, rather than leaving that decision
unhandled.

**"Does ROLLBACK undo changes made before STRCMTCTL started?"**
No. `ROLLBACK` only undoes changes made since the last `COMMIT` within
an active commitment-control scope, not changes made outside that
scope entirely.

**"Is ENDCMTCTL something I need to worry about for a simple
program?"**
`ENDCMTCTL` ends commitment control for a job entirely. For most
everyday programs, commitment control simply stays active for the
job's normal lifetime; `ENDCMTCTL` matters more in situations where a
job deliberately needs to stop using commitment control, which is
beyond this introductory lesson's everyday scope.

## Quick Recap

- `STRCMTCTL` starts commitment control for a job, before a
  transaction's changes begin.
- `COMMIT` makes all of a transaction's changes permanent together;
  `ROLLBACK` undoes all of them, as if the transaction never happened.
- A program must explicitly decide between `COMMIT` and `ROLLBACK`
  once it knows whether a transaction's steps succeeded.
- `ROLLBACK` only affects changes made since the last `COMMIT`, not
  changes made outside the active commitment-control scope.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through what happens step by step if the INSERT in
  this example failed but the UPDATE had already succeeded?"
- "Why does a program need to check something like SQLCODE before
  deciding between COMMIT and ROLLBACK?"
