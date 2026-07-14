# Watching Variables During Debug

## Learning Objective

By the end of this lesson, you will be able to display a variable's
current value while paused in a debug session, and use that to confirm
or rule out where a calculation goes wrong.

## Simple Explanation

Setting a breakpoint and stepping, covered in the previous lesson, pauses
a program at a specific point. From that paused state, the `EVAL` debug
command displays a variable's current value, letting a developer confirm
exactly what a program actually holds at that moment, rather than
guessing from its final output.

```rpgle
dcl-s custBal packed(9:2);
dcl-s discountPct packed(5:2);
dcl-s discountedBal packed(9:2);

custBal = 1000;
discountPct = 10;
discountedBal = custBal - (custBal * discountPct / 100);

dsply discountedBal;
```

Imagine a breakpoint set on the `discountedBal = ...` line, exactly as
covered in the previous lesson. Before stepping past it, `EVAL custBal`
and `EVAL discountPct` show their current values, confirming whether they
already hold what is expected at that point. Stepping past the
calculation, `EVAL discountedBal` then shows the actual computed result,
letting the developer compare it directly against what they expected.

## Why It Matters

A wrong final result can come from many different places: a variable
holding an unexpected value coming in, or the calculation itself being
written incorrectly. Watching specific variables at specific points in a
debug session is what actually distinguishes these two possibilities,
rather than only being able to see that the final output is wrong.

## Practical Example

Imagine the discount calculation producing a discounted balance far
lower than expected. Checking `custBal` and `discountPct` with `EVAL`
right before the calculation runs shows both already hold correct,
expected values. Stepping past the calculation and checking
`discountedBal` afterward shows it is still wrong, narrowing the problem
down specifically to how the formula itself is written, rather than to
either input variable.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects exactly how watching variables narrows
down where a problem actually lives.

## Common Confusions

**"Does EVAL change a variable's value, or just show it?"**
By default, `EVAL` displays a variable's current value without changing
it. Some debuggers also support using `EVAL` to set a new value for
testing purposes, but simply displaying a value is the basic, most common
use covered in this lesson.

**"Do I need to check every variable in a program, or just specific
ones?"**
Just the specific ones relevant to the problem being investigated,
typically the inputs and output of whatever calculation or logic looks
suspicious, exactly as shown checking `custBal`, `discountPct`, and
`discountedBal` above.

**"Can I watch a variable's value change automatically as I step through
several lines, without re-checking it every time?"**
This lesson covers checking a variable's value with `EVAL` at a specific
paused point. Automatically tracking a variable's value continuously
across multiple steps is a more detailed debugger feature beyond this
introduction.

## Quick Recap

- `EVAL variableName` displays a variable's current value while paused in
  a debug session.
- Checking a variable's value before and after a specific line of code
  helps confirm whether that specific line is behaving as expected.
- Watching relevant input and output variables narrows down whether a
  problem comes from unexpected input data or from the logic itself.
- Checking every single variable in a program is unnecessary; focus on
  the ones relevant to the specific problem being investigated.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would it mean if custBal itself already held an unexpected value
  before the calculation even ran?"
- "Is there a way to watch a variable automatically every time it
  changes, rather than checking it manually with EVAL?"
