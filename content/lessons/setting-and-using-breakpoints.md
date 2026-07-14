# Setting and Using Breakpoints

## Learning Objective

By the end of this lesson, you will be able to set a breakpoint at a
specific line, run a program until it stops there, and step through its
logic one statement at a time.

## Simple Explanation

Once `STRDBG` has opened a program's source, covered in the previous
lesson, a **breakpoint** tells the debugger to pause the program exactly
at a chosen line, rather than running straight through to completion.

```rpgle
dcl-s custBal packed(9:2);
dcl-s discountPct packed(5:2);
dcl-s discountedBal packed(9:2);

custBal = 1000;
discountPct = 10;
discountedBal = custBal - (custBal * discountPct / 100);

dsply discountedBal;
```

Imagine this calculation is producing a wrong result. From the debug
display opened by `STRDBG`, the `BREAK` debug command sets a breakpoint
on the `discountedBal = ...` line. Running the program then pauses
exactly there, before that line executes, letting the developer inspect
values up to that point. From a paused breakpoint, **stepping**, commonly
using the **F10** key, executes just the next single statement and pauses
again immediately after it, letting the developer watch the program's
logic unfold one line at a time.

## Why It Matters

Without a breakpoint, a program either runs to completion or fails
outright, giving little insight into what happened along the way.
Pausing at a specific line, then stepping through the following
statements one at a time, is what actually lets a developer watch a
calculation or a sequence of operations unfold, rather than only seeing
its final result.

## Practical Example

Imagine the discount calculation above is producing a discounted balance
that seems too low. A developer sets a breakpoint on the `discountedBal =
...` line, runs the program, and it pauses there as expected. Stepping
forward one line executes that calculation; checking `discountedBal`
immediately afterward, as covered in the next lesson, reveals whether the
formula itself, or perhaps `discountPct`'s value, is the actual source of
the problem.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a standard, everyday way breakpoints and
stepping are used together on IBM i.

## Common Confusions

**"Does setting a breakpoint change the program itself?"**
No. A breakpoint is part of the debug session, not a permanent change to
the program's compiled object. Ending the debug session removes any
breakpoints set during it.

**"What happens if I step past the line I actually wanted to inspect?"**
The program continues running from wherever stepping leaves it; getting
back to an earlier point generally means restarting the debug session and
setting the breakpoint again, rather than stepping backward.

**"Can more than one breakpoint be set at once?"**
Yes. A debug session can have several breakpoints set across different
lines, letting a program run freely between them and pause at whichever
one it reaches next.

## Quick Recap

- A breakpoint tells the debugger to pause a program exactly at a chosen
  line, rather than letting it run straight through.
- The `BREAK` debug command sets a breakpoint from within a debug session
  opened by `STRDBG`.
- Stepping, commonly with F10, executes just the next single statement
  and pauses again immediately after it.
- Breakpoints belong to the debug session, not the compiled program
  itself, and disappear once that session ends.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the difference between stepping over a statement and stepping
  into it?"
- "How would I remove a breakpoint I no longer need during the same debug
  session?"
