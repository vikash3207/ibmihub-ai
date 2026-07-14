# Mini Project: SQLRPGLE Customer Lookup

## What We Are Building

The same customer inquiry task as the Customer Inquiry Program mini
project, rebuilt using embedded SQL instead of native `CHAIN`, as a
direct, side-by-side comparison between the two approaches.

## Business Scenario

Imagine the same customer service representative's inquiry need, but a
development team that has decided new lookup programs should use
embedded SQL going forward. This project shows exactly what changes, and
what stays the same, when moving from native file I/O to SQLRPGLE for
this kind of task.

## Concepts Used

- `SELECT INTO` and host variables, from the SELECT INTO for Reading One
  Row and Host Variables in SQLRPGLE lessons.
- `SQLCODE`, from the SQLCODE and SQLSTATE Basics in SQLRPGLE and
  Handling No Row Found in SQLRPGLE lessons.
- The same display file concepts as the Customer Inquiry Program mini
  project.

## Files and Programs Involved

- **`CUSTMAST`**, queried here through embedded SQL rather than native
  `dcl-f`/`CHAIN`.
- **`CUSTDSPF`**, the same display file built in the Customer Inquiry
  Program mini project, reused without changes.
- **`CUSTINQS`**, a new RPGLE program, the SQLRPGLE counterpart to
  `CUSTINQR`.

## Step-by-Step Build Outline

1. Declare `CUSTDSPF` with `dcl-f`, exactly as before; `CUSTMAST` does
   not need its own `dcl-f`, since embedded SQL accesses it directly.
2. Declare host variables for the customer number, name, and balance,
   covered in the Host Variables in SQLRPGLE lesson.
3. Loop calling `exfmt INQFMT`, reading the customer number entered.
4. Use an embedded `SELECT INTO` statement to retrieve the name and
   balance for that customer number.
5. Check `SQLCODE`: `0` means found, anything else means not found,
   setting the same error message indicator as `CUSTINQR`.

## Example Code

```rpgle
dcl-f CUSTDSPF workstn;

dcl-s hCustNbr packed(6:0);
dcl-s hCustName char(30);
dcl-s hCustBal packed(9:2);
dcl-s exitRequested ind;

dow not exitRequested;
  exfmt INQFMT;

  if *in03;
    exitRequested = *on;
  else;
    hCustNbr = CUSTNBR;

    exec sql
      select CUSTNAME, CUSTBAL into :hCustName, :hCustBal
      from CUSTMAST
      where CUSTNBR = :hCustNbr;

    if sqlcode = 0;
      CUSTNAME = hCustName;
      CUSTBAL = hCustBal;
      *in50 = *off;
    else;
      *in50 = *on;
    endif;
  endif;
enddo;

*inlr = *on;
```

Notice the overall shape, loop, `exfmt`, check-then-branch, is identical
to `CUSTINQR` from the Customer Inquiry Program mini project. What
differs is entirely inside the lookup step itself: a `SELECT INTO`
statement and `SQLCODE` check replace `CHAIN` and `%FOUND`, exactly the
correspondence covered in the Native RPGLE File I/O vs Embedded SQL
lesson.

## How to Test It

Use the exact same three test cases as the Customer Inquiry Program mini
project: a customer number that exists, one that does not, and pressing
F3 immediately. The screen's behavior should look identical to `CUSTINQR`
from the outside, even though the lookup mechanism underneath is
completely different.

## Common Mistakes

- Forgetting the colon prefix on host variables inside the `EXEC SQL`
  block, covered in the Host Variables in SQLRPGLE lesson.
- Checking `sqlcode <> 0` generically instead of specifically
  distinguishing `100` from a genuine error, covered in the Handling No
  Row Found in SQLRPGLE lesson, though for this simple lookup a basic
  `sqlcode = 0` check is sufficient.
- Forgetting to copy the retrieved host variable values back into
  `CUSTDSPF`'s own output fields, `CUSTNAME` and `CUSTBAL`, before the
  next `exfmt` displays them.

## Debugging Checklist

If the screen shows blank or stale fields for a customer known to exist,
follow the SELECT INTO for Reading One Row lesson's guidance: use `EVAL`
on `sqlcode` right after the `SELECT INTO` statement to confirm it
actually came back `0`, and separately confirm `hCustName` and
`hCustBal` were actually copied into `CUSTNAME` and `CUSTBAL` afterward.

## Possible Extensions

A natural extension is rewriting the Simple Order List Subfile mini
project's loading loop using a cursor and `FETCH` instead of
`SETLL`/`READE`, following the same native-versus-SQL comparison
demonstrated here.

## Quick Recap

- `CUSTINQS` rebuilds the Customer Inquiry Program mini project's exact
  behavior using `SELECT INTO` and `SQLCODE` instead of `CHAIN` and
  `%FOUND`.
- The overall program shape stays the same; only the lookup mechanism
  changes.
- The same three test cases apply, and the screen should behave
  identically from a user's point of view.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "What would this program look like if it needed to distinguish
  SQLCODE = 100 from a genuine database error, rather than treating any
  nonzero value the same way?"
- "Could CUSTINQR and CUSTINQS both exist in the same application,
  calling the same CUSTDSPF display file?"
