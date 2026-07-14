# Mini Project: SQLRPGLE Search Screen

## What We Are Building

`CUSTSRCH`, a search screen letting a user type part of a customer's
name and see every matching customer in a subfile, using an embedded SQL
cursor with a `WHERE` clause, rather than the SQLRPGLE Customer Lookup
mini project's single exact-match lookup.

## Business Scenario

The SQLRPGLE Customer Lookup mini project required knowing a customer's
exact number. A representative on the phone often only has a partial
name to go on. This project builds the natural next step: searching by
partial name and choosing from a list of matches.

## Concepts Used

- `WHERE` conditions and the `LIKE` pattern, from the Basic WHERE
  Conditions in Embedded SQL lesson.
- A cursor with `FETCH`, from the Using SQL Cursor to Read Multiple Rows
  and FETCH Loop for Reading Multiple Rows lessons.
- Loading a subfile, from the Simple Order List Subfile mini project,
  applied here to embedded SQL results instead of native `READE`.

## Files and Programs Involved

- **`CUSTMAST`**, queried through embedded SQL.
- **`CUSTSRCD`**, a new display file with an input field for search
  text and a subfile record format, **`CUSTSFL`**, showing matching
  customers.
- **`CUSTSRCH`**, the RPGLE program tying `CUSTSRCD` and `CUSTMAST`
  together.

## Step-by-Step Build Outline

1. Design `CUSTSRCD` with an input field for search text and a
   `CUSTSFL` subfile record format showing customer number, name, and
   balance.
2. Prompt for search text, then clear and prepare the subfile exactly as
   covered in the Simple Inquiry Subfile Pattern lesson.
3. Declare a cursor whose query filters `CUSTNAME` with `LIKE`, using a
   host variable built from the entered search text.
4. Loop with `FETCH`, writing one subfile row per matching customer,
   exactly the accumulation pattern covered in the FETCH Loop for
   Reading Multiple Rows lesson.
5. Display the loaded subfile.

## Example Code

```rpgle
dcl-f CUSTSRCD workstn;

dcl-s hSearchPattern char(32);
dcl-s hCustNbr packed(6:0);
dcl-s hCustName char(30);
dcl-s hCustBal packed(9:2);

exfmt SRCHFMT;

hSearchPattern = '%' + %trim(SEARCHNAME) + '%';

*in30 = *on;
*in40 = *off;
write CUSTCTL;
*in30 = *off;

exec sql
  declare custSrchCursor cursor for
    select CUSTNBR, CUSTNAME, CUSTBAL
    from CUSTMAST
    where CUSTNAME like :hSearchPattern;

exec sql open custSrchCursor;

exec sql fetch custSrchCursor into :hCustNbr, :hCustName, :hCustBal;
dow sqlcode = 0;
  CUSTNBR = hCustNbr;
  CUSTNAME = hCustName;
  CUSTBAL = hCustBal;
  write CUSTSFL;

  exec sql fetch custSrchCursor into :hCustNbr, :hCustName, :hCustBal;
enddo;

exec sql close custSrchCursor;

*in40 = *on;
*in41 = *on;
exfmt CUSTCTL;

*inlr = *on;
```

Here, `hSearchPattern` builds a `LIKE` pattern with `%` wildcards around
whatever the user typed into `SEARCHNAME`, `CUSTSRCD`'s own input field.
Each `FETCH` retrieves one matching customer into the `h`-prefixed host
variables, which are then copied into `CUSTSFL`'s own `CUSTNBR`,
`CUSTNAME`, and `CUSTBAL` fields before `write CUSTSFL;`, exactly the
same copy-back step covered in the SQLRPGLE Customer Lookup mini
project, needed here because the host variables and the subfile's
fields are kept distinctly named.

## How to Test It

Search for a common partial name matching several customers, confirming
every match appears in the subfile. Search for text matching no one,
confirming the subfile displays as empty without error. Search for an
exact full name, confirming it still works as a special case of a
partial match.

## Common Mistakes

- Forgetting the `%` wildcards around the search text, which would turn
  the `LIKE` condition into an exact match instead of a genuine search.
- Reusing `CUSTNBR`, `CUSTNAME`, and `CUSTBAL` as both the host variable
  names and the subfile's own field names, causing the same collision
  covered in the SQLRPGLE Customer Lookup mini project.
- Forgetting to check `sqlcode = 0` inside the `FETCH` loop, which
  would attempt to write a subfile row using stale values once every
  match has already been fetched.

## Debugging Checklist

If the subfile shows no results for a search text known to match
someone, follow the Basic WHERE Conditions in Embedded SQL lesson's
guidance: use `EVAL` on `hSearchPattern` right after it is built, to
confirm it actually includes the `%` wildcards and the expected search
text.

## Possible Extensions

A natural extension is adding row selection to this subfile, following
the exact pattern covered in the Subfile Row Selection with Detail
Screen mini project, letting a user drill from a search result directly
into that customer's full detail.

## Quick Recap

- `CUSTSRCH` searches `CUSTMAST` by partial name using a `LIKE`-based
  cursor, loading every match into a subfile.
- Host variables are kept distinctly named from `CUSTSFL`'s own fields,
  requiring an explicit copy-back step before each `write CUSTSFL;`.
- Testing should include a search matching several customers, one
  matching none, and one matching an exact full name.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I change this search to match only names starting with the
  entered text, rather than containing it anywhere?"
- "What would happen if the % wildcards were left out of
  hSearchPattern entirely?"
