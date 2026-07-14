# IF / ELSE in RPGLE

## Learning Objective

By the end of this lesson, you will be able to read and write a simple
`if` / `elseif` / `else` block in free-format RPGLE, using the comparison
operators covered in the previous lesson.

## Simple Explanation

In the Expressions and Assignment in RPGLE lesson, you learned about
comparison operators such as `=`, `<`, and `>=`. This lesson shows how those
comparisons are used together with **`if`** to make a program's behavior
depend on a condition.

A simple free-format `if` block looks like this:

```rpgle
dcl-s orderTotal packed(9:2);
dcl-s shippingFee packed(7:2);

orderTotal = 45.00;

if orderTotal >= 50;
  shippingFee = 0;
elseif orderTotal >= 25;
  shippingFee = 5.00;
else;
  shippingFee = 9.99;
endif;
```

Every `if` block starts with `if`, followed by a condition, and ends with
`endif`. The `elseif` keyword lets you check an additional condition if the
first one was false, and `else` covers whatever case is left when none of
the earlier conditions matched. Both `elseif` and `else` are optional; a
simple `if` / `endif` on its own is a complete, valid block.

Only one branch of an `if` block runs: IBM i checks each condition in order,
top to bottom, runs the statements under the first one that matches, and
skips the rest.

## Why It Matters

Conditional logic is how a program makes decisions rather than always doing
exactly the same thing regardless of the data it is working with.
Practically every real business rule, applying different shipping fees
based on order size, approving or rejecting a request, choosing which
message to show, depends on `if`-style conditional logic at its core.

## Practical Example

Imagine the shipping fee example above being used in an order-processing
program. For an order total of 45.00, IBM i checks `orderTotal >= 50` first,
which is false, then checks `orderTotal >= 25`, which is true, so
`shippingFee` is set to 5.00, and the `else` branch is skipped entirely.

If the order total had instead been 60.00, the very first condition would
have matched, setting `shippingFee` to 0 and skipping both the `elseif` and
`else` branches. This is a simplified, illustrative example rather than a
specific real shipping policy, but it reflects a very common, everyday use
of conditional logic in RPGLE.

## Common Confusions

**"Do I need an elseif or else in every if block?"**
No. A simple `if` / `endif`, with no `elseif` or `else` at all, is
completely valid when you only need to handle one specific condition and do
nothing otherwise.

**"What happens if more than one condition would technically be true?"**
Only the first matching condition's branch runs. IBM i checks conditions in
order, from the first `if` down through any `elseif` branches, and stops at
the first one that matches, even if a later condition would also have been
true.

**"Do I need parentheses around the condition, like in some other
languages?"**
No. Free-format RPGLE conditions, such as `orderTotal >= 50`, do not require
surrounding parentheses, though you can use them within a condition to
group parts of a more complex expression if needed.

## Quick Recap

- An `if` block starts with `if` and a condition, and ends with `endif`.
- `elseif` checks an additional condition if earlier ones were false; `else`
  covers whatever is left; both are optional.
- Only the first matching branch of an `if` block runs; the rest are
  skipped.
- Conditional logic is how a program's behavior depends on the data it is
  actually working with.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "Can I nest one if block inside another in RPGLE?"
- "What is the difference between using multiple elseif branches and using
  SELECT / WHEN?"
