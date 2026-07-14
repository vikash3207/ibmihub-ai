# NULL Handling Basics in SQLRPGLE

## Learning Objective

By the end of this lesson, you will be able to explain what `NULL` means
in Db2 for i, why it is different from a blank or zero value, and how to
detect it using a null indicator.

## Simple Explanation

Every column read so far in this lesson group has held a real value.
**`NULL`** means a column has **no value at all**, which is different
from a blank string or a zero number; a `CHAR` column holding blanks, or
a numeric column holding zero, are both still real, specific values,
while `NULL` means the column's value is simply unknown or not
applicable.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBal packed(9:2);
dcl-s balNullInd int(5);

custNbr = 1042;

exec sql
  select CUSTNAME, CUSTBAL into :custName, :custBal :balNullInd
  from CUSTMAST
  where CUSTNBR = :custNbr;

if balNullInd < 0;
  dsply 'Balance not yet set';
else;
  dsply custBal;
endif;
```

Here, `balNullInd` is a **null indicator**, an ordinary small integer
variable paired with `custBal` in the `INTO` clause. RPGLE variables
cannot directly represent SQL `NULL`, so Db2 for i uses this paired
indicator instead: a negative value means `CUSTBAL` was actually `NULL`
for that row, and `custBal` itself should not be trusted; zero or
positive means a real value was retrieved normally.

## Why It Matters

Beginners often assume a `NULL` column behaves like a blank or a zero,
leading to incorrect assumptions, such as treating a `NULL` balance as
"balance of zero" when it actually means "balance not yet recorded at
all." A null indicator is what lets an RPGLE program correctly tell these
two very different situations apart.

## Practical Example

Imagine `CUSTMAST` includes new customers whose starting balance has not
been set yet, stored as `NULL` rather than `0`, to distinguish "not yet
determined" from "confirmed zero balance." A report reading `CUSTBAL`
without a null indicator would have no way to tell these two cases apart,
possibly displaying a misleading `0` for a customer whose real balance is
still unknown. Checking `balNullInd`, as shown above, correctly
distinguishes the two.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuine, common reason `NULL` exists separately
from zero or blank.

## Common Confusions

**"Is NULL the same thing as a blank CHAR field or a zero numeric
field?"**
No. A blank or a zero is still a real, specific value stored in the
column. `NULL` means no value was stored at all. Confusing the two can
lead to real, meaningful mistakes, such as this lesson's example.

**"Do I need a null indicator for every column I retrieve?"**
Only for columns that can actually contain `NULL`. A column defined so it
can never be `NULL` does not need a paired indicator. Whether a specific
column allows `NULL` is a detail of how that table or physical file was
originally defined.

**"What happens if I ignore the null indicator and just use custBal
directly?"**
If `CUSTBAL` was actually `NULL` for that row, `custBal`'s value cannot be
trusted to reflect anything meaningful. This is exactly why checking the
null indicator first, before using the retrieved value, matters.

## Quick Recap

- `NULL` means a column has no value at all, different from a blank
  string or a zero number, which are both still real, specific values.
- A null indicator is a paired integer variable that reports whether a
  retrieved column was actually `NULL`.
- A negative indicator value means the column was `NULL`; zero or
  positive means a real value was retrieved.
- Only columns that can actually contain `NULL` need a paired null
  indicator.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I set a column to NULL using an embedded INSERT or UPDATE
  statement?"
- "Does a native CHAIN or READ have any equivalent to a null indicator?"
