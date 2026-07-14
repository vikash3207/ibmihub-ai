# SELECT INTO for Reading One Row

## Learning Objective

By the end of this lesson, you will be able to use an embedded
`SELECT INTO` statement to retrieve one specific row into host variables,
and check `SQLCODE` to confirm whether a row was actually found.

## Simple Explanation

`SELECT INTO` is embedded SQL's equivalent of `CHAIN`, covered in the
CHAIN for Keyed Access lesson: it retrieves exactly one row, matching
whatever condition the `WHERE` clause describes, and places its column
values directly into host variables.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBal packed(9:2);

custNbr = 1042;

exec sql
  select CUSTNAME, CUSTBAL into :custName, :custBal
  from CUSTMAST
  where CUSTNBR = :custNbr;

if sqlcode = 0;
  dsply custName;
else;
  dsply 'Customer not found';
endif;
```

Here, the `select ... into :custName, :custBal` statement retrieves
`CUSTNAME` and `CUSTBAL` for the one row where `CUSTNBR` matches
`:custNbr`, placing each retrieved column into its matching host variable
in order. **`SQLCODE`** is a built-in value the SQL runtime sets after
every embedded SQL statement: `0` means the statement succeeded and, for
`SELECT INTO`, that a row was actually found; `100` specifically means no
row matched. Checking `SQLCODE` after `SELECT INTO` plays the same role
`%FOUND` plays after `CHAIN`.

## Why It Matters

Just as `CHAIN` might not find a matching record, `SELECT INTO` might not
find a matching row, and checking `SQLCODE` immediately afterward is what
tells the program whether the host variables now hold real, retrieved
values or should not be trusted. Skipping this check is exactly as risky
in embedded SQL as skipping `%FOUND` is with `CHAIN`.

## Practical Example

Imagine the same customer inquiry task covered earlier with `CHAIN`, now
written using embedded SQL instead. A user enters a customer number that
does exist in `CUSTMAST`; the `SELECT INTO` statement retrieves that
customer's name and balance into `:custName` and `:custBal`, `SQLCODE`
comes back `0`, and the program displays the retrieved name. If the
customer number did not exist, `SQLCODE` would come back `100` instead,
and the program would report that the customer was not found, without
ever trusting whatever value happened to already be sitting in
`custName`.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how `SELECT INTO` replaces a `CHAIN` and
`%FOUND` check with its embedded SQL equivalent.

## Common Confusions

**"Is SQLCODE = 0 the only value that means success?"**
For a basic `SELECT INTO` at this introductory level, `0` means a row was
found successfully, and `100` means no row matched. Other SQLCODE values
exist for genuine error conditions, but detailed handling of every
possible value is beyond this introduction.

**"What happens to custName and custBal if SQLCODE comes back 100?"**
They are not reliably updated with real retrieved values, exactly like
`CUSTMAST`'s fields after a `CHAIN` that found nothing. This is exactly
why `SQLCODE` must be checked before trusting or displaying those host
variables.

**"Can SELECT INTO retrieve more than one row at once?"**
No. `SELECT INTO` is specifically for retrieving exactly one row into
host variables. Retrieving many rows requires a cursor, covered in the
next lesson.

## Quick Recap

- `SELECT ... INTO :hostVar1, :hostVar2 FROM table WHERE condition;`
  retrieves one matching row's columns directly into host variables.
- `SQLCODE` reports the result of the most recent embedded SQL statement:
  `0` means success, `100` means no row matched.
- Checking `SQLCODE` after `SELECT INTO` plays the same role `%FOUND`
  plays after `CHAIN`.
- `SELECT INTO` retrieves exactly one row; reading many rows requires a
  cursor, covered in the next lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if my program used custName right after SELECT INTO
  without checking SQLCODE first?"
- "What is SQLSTATE, and how is it different from SQLCODE?"
