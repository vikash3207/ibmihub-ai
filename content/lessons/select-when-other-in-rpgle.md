# SELECT / WHEN / OTHER in RPGLE

## Learning Objective

By the end of this lesson, you will be able to read and write a simple
`select` / `when` / `other` block in free-format RPGLE, and explain when it
is a better fit than a long chain of `elseif` branches.

## Simple Explanation

In the IF / ELSE in RPGLE lesson, you learned how `elseif` lets you check
several conditions in sequence. When there are many possible conditions to
check against the same value, RPGLE offers an alternative structure,
**`select`**, that is often easier to read.

A simple `select` block looks like this:

```rpgle
dcl-s custTier char(1);
dcl-s discountPct packed(3:0);

custTier = 'G';

select;
  when custTier = 'P';
    discountPct = 15;
  when custTier = 'G';
    discountPct = 10;
  when custTier = 'S';
    discountPct = 5;
  other;
    discountPct = 0;
endsl;
```

A `select` block starts with `select` and ends with `endsl`. Each `when`
checks its own condition, similar to a separate `if`, and `other` covers
whatever case is left when none of the `when` conditions matched, similar in
spirit to `else` in an `if` block. As with `if` / `elseif`, only the first
matching branch runs, and the rest are skipped.

## Why It Matters

`select` becomes especially useful once you are checking many possible
values for essentially the same thing, such as a customer tier, a status
code, or a category. Writing this kind of logic as a long chain of `if` /
`elseif` branches works, but can become harder to read as the number of
conditions grows. `select` groups these checks together in a way that is
often clearer at a glance.

## Practical Example

Imagine the customer tier example above being used to determine a
discount percentage. For a customer tier of `'G'`, IBM i checks each `when`
in order: `custTier = 'P'` is false, `custTier = 'G'` is true, so
`discountPct` is set to 10, and the remaining `when` and `other` branches
are skipped.

Written instead as a long chain of `if` / `elseif` branches checking the
same `custTier` value repeatedly, the logic would work the same way, but
can feel more repetitive to read. This is a simplified, illustrative
example rather than a specific real tier system, but it reflects a
genuinely common, practical reason RPGLE developers reach for `select`.

## Common Confusions

**"Is select just a different way to write the same thing as if / elseif?"**
In terms of what it accomplishes, yes, for this kind of "check the same
value against several possibilities" pattern. `select` is often preferred
in that specific situation because it can be easier to read, not because it
does something `if` / `elseif` cannot.

**"Do I always need an other branch?"**
No. `other` is optional, similar to `else` in an `if` block. If none of the
`when` conditions match and there is no `other` branch, none of the
branches run at all.

**"Can each when check something completely different, not just the same
variable?"**
Yes. While checking the same variable against different values, as in the
customer tier example, is a very common pattern, each `when` has its own
independent condition and does not technically have to compare the same
variable.

## Quick Recap

- A `select` block starts with `select` and ends with `endsl`, containing
  one or more `when` branches and an optional `other` branch.
- Each `when` checks its own condition; `other` covers whatever case is
  left when no `when` condition matched.
- Only the first matching branch runs, the same as with `if` / `elseif`.
- `select` is often clearer than a long chain of `elseif` branches when
  checking many possible values for essentially the same thing.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "When should I use select instead of if / elseif?"
- "Can a when condition in RPGLE check more than one value at once?"
