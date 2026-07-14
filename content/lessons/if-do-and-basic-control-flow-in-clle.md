# IF, DO, and Basic Control Flow in CLLE

## Learning Objective

By the end of this lesson, you will be able to read and write a simple
`IF` / `THEN` / `ELSE` structure in CLLE, including a `DO` / `ENDDO` group
for more than one command, using CL's comparison operators.

## Simple Explanation

In the Variables in CLLE lesson, every example ran straight through from
top to bottom. CL's **`IF`** command lets a CLLE program's behavior depend
on a condition, similar in purpose to `if` in RPGLE, though with CL's own
keyword-based syntax.

A simple `IF` command looks like this:

```clle
DCL VAR(&ORDERTOTAL) TYPE(*DEC) LEN(9 2)
DCL VAR(&MSG) TYPE(*CHAR) LEN(50)

CHGVAR VAR(&ORDERTOTAL) VALUE(150.00)

IF COND(&ORDERTOTAL *GT 100) THEN(CHGVAR VAR(&MSG) VALUE('Large order'))
```

Here, `COND` holds the condition being checked, using CL's comparison
operators, such as `*GT` (greater than), `*LT` (less than), `*EQ` (equal
to), and `*NE` (not equal to). `THEN` holds the single command to run if
the condition is true.

When more than one command needs to run for a condition, `THEN` is paired
with **`DO`**, starting a group of commands that ends with **`ENDDO`**:

```clle
IF COND(&ORDERTOTAL *GT 100) THEN(DO)
  CHGVAR VAR(&MSG) VALUE('Large order')
  SNDPGMMSG MSG(&MSG)
ENDDO
ELSE CMD(CHGVAR VAR(&MSG) VALUE('Normal order'))
```

`ELSE` provides a command, or a `DO` group, to run when the condition was
false. `ELSE` is optional; an `IF` with only a `THEN` is a complete, valid
structure on its own.

## Why It Matters

Conditional logic in CLLE lets a program make decisions, such as choosing
a different message, a different program to call, or a different next
step, based on the data or situation it encounters, the same fundamental
role conditional logic plays in RPGLE. Recognizing `IF` / `THEN` / `ELSE`,
and knowing when a `DO` group is needed, is essential to reading or writing
any CLLE program more complex than a fixed sequence of commands.

## Practical Example

Imagine a CLLE program deciding how to handle an order based on its total.
For an order total of 150.00, the condition `&ORDERTOTAL *GT 100` is true,
so the `DO` group's commands run: setting `&MSG` to `'Large order'` and
sending that message. If the order total had instead been 50.00, the
condition would be false, and the `ELSE` command would run instead,
setting `&MSG` to `'Normal order'`.

This is a simplified, illustrative example rather than a specific real
order-handling policy, but it reflects a very common, everyday use of
conditional logic in CLLE.

## Common Confusions

**"Do I always need DO and ENDDO with IF?"**
No. `DO` and `ENDDO` are only needed when more than one command should run
for a condition. A single command can be given directly to `THEN`, as
shown in the first example, without a `DO` group at all.

**"Are CL's comparison operators like *GT the same as RPGLE's > and >=
operators?"**
They serve the same purpose, comparing two values, but CL uses its own
keyword-style operators, such as `*GT`, `*LT`, `*EQ`, and `*NE`, rather
than the symbolic operators used in RPGLE expressions.

**"Can I nest an IF inside a DO group?"**
Yes. A `DO` group can contain another `IF` command among its statements,
similar to nesting conditional logic in RPGLE, letting a program check
additional conditions within a branch that already matched an outer
condition.

## Quick Recap

- `IF COND(...) THEN(...)` runs a single command when a condition is true;
  `ELSE CMD(...)` runs a command when it is false, and is optional.
- `DO` and `ENDDO` group more than one command together under `THEN` or
  `ELSE`.
- CL uses keyword-style comparison operators, such as `*GT`, `*LT`, `*EQ`,
  and `*NE`, in place of RPGLE's symbolic operators.
- Conditional logic lets a CLLE program's behavior depend on the data or
  situation it encounters, just as it does in RPGLE.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other CL comparison operators besides *GT, *LT, *EQ, and
  *NE?"
- "Can ELSE be followed by its own DO group instead of a single command?"
