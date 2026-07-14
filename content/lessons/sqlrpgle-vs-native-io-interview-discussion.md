# SQLRPGLE vs Native I/O Interview Discussion

## What This Lesson Prepares You For

Interviewers sometimes ask a more open, discussion-style question:
"when would you choose embedded SQL over native file I/O, or the other
way around?" This lesson helps you build a clear, balanced answer rather
than treating one approach as simply better than the other.

## Concepts to Revise First

- Native RPGLE File I/O vs Embedded SQL.
- SQLRPGLE Interview Scenarios, and RPGLE File I/O Interview Scenarios.
- The SQLRPGLE Customer Lookup mini project, which rebuilds the Customer
  Inquiry Program mini project using embedded SQL as a direct comparison.

## Common Interview or Job Discussion Scenarios

- "When would you use embedded SQL instead of CHAIN?"
- "Is one approach always better than the other?"
- "How would you decide between SETLL plus READE and a cursor with
  FETCH?"

## Strong Beginner-Level Answer Approach

A strong answer avoids declaring one approach universally better, and
instead describes what each is naturally good at: "Native file I/O, like
CHAIN, is simple and direct for a single keyed lookup. Embedded SQL is
often clearer when the logic is naturally set-based, like a partial-name
search with LIKE, or when you're joining data in a way that would be
awkward with native operations alone." This shows judgment, not just
memorized preference.

## Weak Answers to Avoid

- Claiming embedded SQL is "always better" or "always slower" than native
  file I/O without any actual reasoning behind the claim.
- Describing the two approaches as completely unrelated, instead of
  recognizing the direct correspondence between `CHAIN`/`%FOUND` and
  `SELECT INTO`/`SQLCODE`.
- Being unable to say when you would personally reach for one over the
  other, only reciting the general theory.

## Scenario-Based Practice

Imagine being asked: "You need to build a search screen where a user
types part of a customer's name. Would you use native file I/O or
embedded SQL, and why?" A strong answer: "I'd use embedded SQL here,
specifically a cursor with a `LIKE` condition and `FETCH`, since matching
a partial name naturally fits a `WHERE ... LIKE` clause. Doing the
equivalent with native operations alone would mean reading every record
and checking the name manually, which is exactly the pattern the
SQLRPGLE Search Screen mini project uses instead."

## How to Explain Your Thinking Clearly

A useful way to frame this kind of answer is by naming the shape of the
problem first, then matching it to the tool that fits: an exact,
single-record lookup by key maps naturally to `CHAIN`; a filtered list of
several rows maps naturally to a cursor and `FETCH`. Explaining the
match, rather than a blanket preference, is what shows real
understanding.

## Practical IBM i Example

```rpgle
// Native: a single, exact lookup by key
chain custNbr CUSTMAST;
if %found(CUSTMAST);
  // use CUSTNAME, CUSTBAL directly
endif;

// Embedded SQL: a filtered list of several rows
exec sql
  declare custSrchCursor cursor for
    select CUSTNBR, CUSTNAME, CUSTBAL
    from CUSTMAST
    where CUSTNAME like :hSearchPattern;
```

Being able to point at both of these side by side and explain why each
one fits its own scenario is a strong, concrete way to answer this kind
of discussion question.

## Mini Practice Task

Write one sentence explaining which approach, native file I/O or
embedded SQL, you would use for each of these: looking up one order by
order number; listing every order over a certain amount; and checking
whether a specific customer number already exists before inserting a new
one.

## Quick Recap

- Neither native file I/O nor embedded SQL is universally better; each
  fits certain shapes of problem more naturally.
- `CHAIN`/`%FOUND` and `SELECT INTO`/`SQLCODE` are direct equivalents for
  a single-record lookup.
- A search or filter across many rows usually fits embedded SQL more
  naturally than manual native record-by-record checking.

## Try Asking the AI Tutor

Use the AI Tutor to practice this discussion. For example, try asking:

- "Can you give me a small IBM i scenario and ask me whether I'd use
  native file I/O or embedded SQL, and why?"
- "How would I explain the relationship between CHAIN/%FOUND and SELECT
  INTO/SQLCODE in an interview?"
