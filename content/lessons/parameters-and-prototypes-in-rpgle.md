# Parameters and Prototypes in RPGLE

## Learning Objective

By the end of this lesson, you will be able to write a subprocedure that
accepts parameters and returns a value, using `dcl-pi`, and explain what a
prototype is for.

## Simple Explanation

In the Procedures and Subprocedures in RPGLE lesson, `showGreeting` always
did exactly the same thing every time it was called, since it took no
input. A **parameter** lets a subprocedure receive a value from whoever
calls it, and a subprocedure can also **return** a value back to its
caller.

A subprocedure's parameters and return value are declared using
**`dcl-pi`** (Declare Procedure Interface), placed inside the subprocedure:

```rpgle
**free
ctl-opt dftactgrp(*no);

dcl-proc calculateDiscount;
  dcl-pi *n packed(7:2);
    amount packed(9:2) const;
    discountPct packed(3:0) const;
  end-pi;

  return amount - (amount * discountPct / 100);
end-proc;

dcl-s finalPrice packed(7:2);

finalPrice = calculateDiscount(100.00 : 10);
dsply finalPrice;

*inlr = *on;
```

Here, `dcl-pi *n packed(7:2);` states that `calculateDiscount` returns a
`packed(7:2)` value; `*n` simply tells the compiler to reuse the
subprocedure's own name rather than retyping it. Inside the parentheses,
`amount` and `discountPct` are the subprocedure's parameters, each marked
`const` to indicate the subprocedure only reads their values rather than
changing them. The `return` statement sends a value back to whoever called
the subprocedure.

A **prototype**, declared separately using `dcl-pr`, describes how a
procedure is meant to be called, its parameters and return value, without
containing the procedure's actual logic. For the simple, single-program
subprocedures covered in this lesson group, a separate prototype is not
required; prototypes become more important once procedures are called
across separate modules, a topic beyond this introductory lesson group.

## Why It Matters

Parameters let a single subprocedure handle many different situations,
rather than needing a separate, near-identical subprocedure for every
possible input. Combined with a return value, a subprocedure becomes a
small, reusable calculation you can call with different values wherever
it is needed, similar in spirit to a built-in function, but one you define
yourself.

## Practical Example

Imagine `calculateDiscount` being called with different order amounts and
discount percentages throughout a program: once for a 100.00 order with a
10 percent discount, and again elsewhere for a 250.00 order with a 5
percent discount. The same subprocedure handles both cases correctly,
because the specific values are passed in as parameters each time, rather
than being hardcoded inside the subprocedure itself.

This is a simplified, illustrative example rather than a specific real
pricing system, but it reflects a genuinely common, practical reason RPGLE
developers use parameters and return values.

## Common Confusions

**"What does const mean on a parameter?"**
`const` tells the compiler that the subprocedure will only read that
parameter's value, not change it. This is common for parameters that
represent input the subprocedure uses in a calculation, as in the
`calculateDiscount` example.

**"Do I need a separate dcl-pr prototype for every subprocedure?"**
Not for the simple, single-program subprocedures covered in this lesson
group, where the subprocedure is declared and called within the same
source. Separate prototypes matter more once procedures are shared across
separate modules, which goes beyond this introductory lesson group.

**"Can a subprocedure have more than one return value?"**
No, not in the way `return` works here. A subprocedure declared this way
returns exactly one value. Passing back more than one piece of information
generally involves techniques, such as parameters that are not `const`, or
data structures, that go beyond this introductory lesson group.

## Quick Recap

- Parameters let a subprocedure receive values from its caller; `dcl-pi`
  declares a subprocedure's parameters and return value.
- `const` marks a parameter as read-only within the subprocedure; `return`
  sends a value back to the caller.
- A prototype (`dcl-pr`) describes how a procedure is called without
  containing its logic, and matters most once procedures are shared across
  separate modules.
- Parameters let one subprocedure handle many different situations, rather
  than needing a separate subprocedure for each one.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I try to change a const parameter's value inside a
  subprocedure?"
- "Why does dcl-pi use *n instead of just retyping the subprocedure's
  name?"
