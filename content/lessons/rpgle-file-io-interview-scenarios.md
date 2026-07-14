# RPGLE File I/O Interview Scenarios

## What This Lesson Prepares You For

File I/O is one of the most commonly tested areas in IBM i interviews,
because it is where beginner mistakes show up most often. This lesson
works through the interview questions and scenarios most likely to come
up around `CHAIN`, `%FOUND`, `WRITE`, `UPDATE`, and `DELETE`.

## Concepts to Revise First

- `dcl-f` and native file declarations, from the RPGLE File Declarations
  with dcl-f lesson.
- `CHAIN` and `%FOUND`, from the CHAIN for Keyed Access and Understanding
  %FOUND after CHAIN lessons.
- `WRITE`, `UPDATE`, and `DELETE`, from their respective lessons.
- Common mistakes, from the Common RPGLE File I/O Mistakes and Best
  Practices lesson.
- The Customer Inquiry Program and Debugging a Broken File I/O Program
  mini projects, which put these exact concepts into a small, complete
  program.

## Common Interview Questions

- "What happens if you call `UPDATE` right after a `CHAIN` that did not
  find a record?"
- "What is the difference between `CHAIN` and `SETLL` followed by
  `READE`?"
- "Why does a file need to be declared `keyed` for `CHAIN` to work?"
- "What is the difference between a runtime error and a compile error in
  the context of file I/O?"

## Good Beginner-Level Answers

For "what happens if you call `UPDATE` right after a `CHAIN` that did not
find a record?", a solid answer is: "It causes a runtime error, because
there is no current record for `UPDATE` to act on. That's why you always
check `%FOUND` after a `CHAIN` before doing anything with the record,
like updating or deleting it." This is exactly the mistake walked through
in the Debugging a Broken File I/O Program mini project, and being able
to describe it clearly is a strong, honest signal of real experience.

## Scenario-Based Questions

- "A program does a `CHAIN` on a customer number, then immediately
  subtracts a payment amount from the balance and calls `UPDATE`,
  without checking anything in between. What is wrong with this, and how
  would you fix it?"
- "You are asked to list every order for one customer, in order, without
  loading the entire file. What combination of operations would you use?"
- "A representative says a customer's balance update 'sometimes works and
  sometimes doesn't.' What would you ask about the input data first?"

## How to Explain Your Thinking

For the "sometimes works and sometimes doesn't" scenario, a strong
approach is to reason about what changes between the working and
non-working cases, rather than guessing at a fix immediately: "Since it
works sometimes, the code itself is probably fine. I would first check
whether the failing cases involve a customer number that doesn't
actually exist in the file, since an unchecked `CHAIN` miss is one of
the most common causes of exactly this kind of inconsistent behavior."

## Common Weak Answers to Avoid

- Saying `CHAIN` and `SETLL` "do the same thing," without explaining that
  `CHAIN` retrieves a specific record while `SETLL` only positions you
  for a subsequent read.
- Describing the fix for a missing `%FOUND` check as "wrap it in a
  monitor block," which hides the symptom rather than addressing the
  actual missing check, exactly the weak fix called out in the Debugging
  a Broken File I/O Program mini project.
- Not mentioning that `keyed` is required on the `dcl-f` for `CHAIN` and
  `SETLL` to work at all.

## Practical Examples

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);
dcl-s paymentAmt packed(9:2);

custNbr = 1042;
paymentAmt = 50.00;

chain custNbr CUSTMAST;
if %found(CUSTMAST);
  CUSTBAL -= paymentAmt;
  update CUSTMAST;
else;
  dsply 'Customer not found, payment not applied';
endif;
```

Being able to talk through this snippet line by line, out loud, is good
interview practice: `CHAIN` retrieves the record, `%FOUND` confirms it
exists before anything else happens, and the `else` branch handles the
not-found case explicitly instead of letting the program fail.

## Mini Practice Task

Rewrite the practical example above so that, instead of updating a
balance, it deletes the customer record if found, and displays a message
if not found. Then explain out loud what would happen if the `%found`
check were removed entirely.

## Quick Recap

- The single most common file I/O interview mistake to watch for is
  calling `UPDATE` or `DELETE` without checking `%FOUND` after a `CHAIN`.
- `CHAIN` retrieves a specific record; `SETLL` only positions you for a
  subsequent `READE` or `READ`.
- A strong answer explains why a fix works, not just that it does.

## Try Asking the AI Tutor

Use the AI Tutor to practice these scenarios. For example, try asking:

- "Can you give me a broken RPGLE file I/O snippet and ask me to find
  what's wrong with it?"
- "How would I explain the difference between CHAIN and SETLL plus READE
  in an interview?"
