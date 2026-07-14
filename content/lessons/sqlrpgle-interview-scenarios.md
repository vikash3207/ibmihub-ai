# SQLRPGLE Interview Scenarios

## What This Lesson Prepares You For

SQLRPGLE questions in interviews often focus on how embedded SQL differs
from native file I/O, and on handling cases where a query finds no rows.
This lesson works through the questions and scenarios most likely to come
up.

## Concepts to Revise First

- What is SQLRPGLE?, and Native RPGLE File I/O vs Embedded SQL.
- Host Variables in SQLRPGLE.
- SELECT INTO for Reading One Row.
- SQLCODE and SQLSTATE Basics in SQLRPGLE, and Handling No Row Found in
  SQLRPGLE.
- The SQLRPGLE Customer Lookup and SQLRPGLE Search Screen mini projects.

## Common Interview Questions

- "What is the SQLRPGLE equivalent of a native `CHAIN`?"
- "What does `SQLCODE` tell you after a `SELECT INTO`?"
- "Why do host variables need a colon in front of them inside `EXEC SQL`?"
- "How would you search for customers by partial name instead of an
  exact match?"

## Good Beginner-Level Answers

For "what is the SQLRPGLE equivalent of a native `CHAIN`?", a strong
answer is: "A `SELECT INTO` statement does the equivalent job: it
retrieves one row into host variables. Instead of checking `%FOUND` like
you would after `CHAIN`, you check `SQLCODE`. A value of `0` means a row
was found; `100` specifically means no row matched." This shows the
direct correspondence between native and embedded SQL approaches, which
is exactly what the Native RPGLE File I/O vs Embedded SQL lesson covers.

## Scenario-Based Questions

- "A `SELECT INTO` runs without any errors, but the screen shows blank
  fields for a customer you know exists. What would you check first?"
- "You need to let a user search by partial customer name instead of an
  exact number. What SQL feature would you use, and what mistake would
  make that search silently behave like an exact match?"
- "What is the difference between checking `sqlcode = 0` and checking
  `sqlcode <> 0` after a `SELECT INTO` meant to find one row?"

## How to Explain Your Thinking

For the "blank fields" scenario, a good approach is to separate the query
succeeding from the screen actually displaying the result: "First I'd
check `SQLCODE` right after the `SELECT INTO` to confirm it actually came
back `0`. If it did, the next thing I'd check is whether the retrieved
host variable values were actually copied into the display file's own
output fields before the next `exfmt`, since host variables and screen
fields are often kept separately named on purpose." This mirrors the
debugging checklist covered in the SQLRPGLE Customer Lookup mini project.

## Common Weak Answers to Avoid

- Treating any nonzero `SQLCODE` the same way, instead of distinguishing
  `100` (no row found, often expected) from a genuine database error.
- Forgetting the colon prefix on host variables inside `EXEC SQL`, or not
  being able to explain why it is required.
- Forgetting the `%` wildcards around search text when building a `LIKE`
  pattern, which silently turns a partial-name search into an exact
  match.

## Practical Examples

```rpgle
dcl-s hCustNbr packed(6:0);
dcl-s hCustName char(30);
dcl-s hCustBal packed(9:2);

hCustNbr = 1042;

exec sql
  select CUSTNAME, CUSTBAL into :hCustName, :hCustBal
  from CUSTMAST
  where CUSTNBR = :hCustNbr;

if sqlcode = 0;
  // row found, hCustName and hCustBal now hold the result
else;
  // sqlcode = 100 means no matching customer; other values mean a
  // genuine error worth investigating separately
endif;
```

A strong interview answer distinguishes the two branches clearly: `0`
means the lookup succeeded and the host variables are populated; a
nonzero value could be `100` (simply not found) or a real error, and a
careful answer says you would not treat those two cases identically in
a more thorough version of this check.

## Mini Practice Task

Rewrite the practical example above as a partial-name search using
`LIKE`, building `hSearchPattern` from a search term, and explain out
loud what would happen to the search results if the `%` wildcards were
left out.

## Quick Recap

- `SELECT INTO` plus `SQLCODE` is the embedded SQL equivalent of `CHAIN`
  plus `%FOUND`.
- `SQLCODE = 0` means found, `100` specifically means no row matched, and
  other values indicate a genuine error.
- Host variables need a colon prefix inside `EXEC SQL`, and `LIKE`
  patterns need `%` wildcards for a genuine partial match.

## Try Asking the AI Tutor

Use the AI Tutor to practice these scenarios. For example, try asking:

- "Can you give me a SQLRPGLE snippet with a subtle SQLCODE mistake and
  ask me to spot it?"
- "How would I explain SELECT INTO and SQLCODE to someone who already
  knows CHAIN and %FOUND?"
