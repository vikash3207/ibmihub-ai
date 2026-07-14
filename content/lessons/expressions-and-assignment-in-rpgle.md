# Expressions and Assignment in RPGLE

## Learning Objective

By the end of this lesson, you will be able to read and write simple RPGLE
assignment statements, and recognize common arithmetic and comparison
operators used in expressions.

## Simple Explanation

You have already seen simple assignment statements, such as
`custName = 'Jordan Lee';`, in earlier lessons in this group. This lesson
looks more closely at assignment itself, and at **expressions**: the
combinations of values, variables, and operators that produce a result.

In free-format RPGLE, assignment is written simply as a variable name,
followed by an equals sign, followed by an expression:

```rpgle
dcl-s orderTotal packed(9:2);
dcl-s discountPct packed(3:0);
dcl-s finalTotal packed(9:2);

orderTotal = 100.00;
discountPct = 10;
finalTotal = orderTotal - (orderTotal * discountPct / 100);
```

Common arithmetic operators used in RPGLE expressions include `+`
(addition), `-` (subtraction), `*` (multiplication), and `/` (division).
RPGLE also supports comparison operators, commonly used together with the
conditional logic covered in the next lesson, including `=` (equal to),
`<>` (not equal to), `<` (less than), `>` (greater than), `<=` (less than
or equal to), and `>=` (greater than or equal to).

An expression can be as simple as a single literal or variable, or can
combine several values and operators together, as shown in the
`finalTotal` calculation above, which combines subtraction, multiplication,
and division into a single expression.

## Why It Matters

Assignment and expressions are how an RPGLE program actually calculates
and updates the values it works with. Nearly every meaningful piece of
business logic, applying a discount, totaling an order, checking whether a
value falls within an allowed range, depends on correctly written
expressions and assignment statements. This makes them one of the most
fundamental, frequently used building blocks in any RPGLE program.

## Practical Example

Imagine a program calculating a final order total after a discount, as
shown in the example above. Reading the expression
`orderTotal - (orderTotal * discountPct / 100)` step by step: first,
`orderTotal * discountPct / 100` calculates the discount amount, and then
that discount amount is subtracted from `orderTotal` to produce the final
total.

Being able to read an expression like this piece by piece, rather than all
at once, makes even a somewhat complex calculation approachable. This is a
simplified, illustrative example rather than a specific real order
calculation, but it reflects a genuinely common pattern in RPGLE business
logic.

## Common Confusions

**"Does the equals sign in an assignment statement mean the same thing as
in a math class?"**
Not exactly. In an assignment statement like `finalTotal = orderTotal;`,
the equals sign means "store the value on the right into the variable on
the left," rather than stating that two things are already equal to each
other.

**"Is `=` used for both assignment and comparison in RPGLE?"**
Yes, context tells them apart. Used in an assignment statement on its own,
like `discountPct = 10;`, `=` assigns a value. Used inside a condition, as
covered in the next lesson, `=` compares two values instead.

**"Do I need parentheses in every expression?"**
No. Parentheses are useful for making the order of operations clear,
especially in expressions combining more than one operator, as in the
`finalTotal` example. Simple expressions with only one operator often do
not need them.

## Quick Recap

- Assignment in free-format RPGLE is written as a variable name, an equals
  sign, and an expression.
- Common arithmetic operators include `+`, `-`, `*`, and `/`; common
  comparison operators include `=`, `<>`, `<`, `>`, `<=`, and `>=`.
- An expression can combine multiple values and operators, and parentheses
  help make the order of operations clear.
- The equals sign means different things depending on context: assignment
  on its own, or comparison inside a condition.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I divide by zero in an RPGLE expression?"
- "How does RPGLE decide the order to calculate an expression with more
  than one operator?"
