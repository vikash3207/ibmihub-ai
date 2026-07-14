# Mini Project: Debugging a Broken File I/O Program

## What We Are Building

Not new code, but a debugging exercise: a small, deliberately broken
payment-processing program, walked through using the exact tools covered
across the Debugging & Troubleshooting lesson groups, to find and fix a
realistic, common bug.

## Business Scenario

Imagine a payment-processing program that occasionally fails partway
through with a runtime error, instead of cleanly rejecting an invalid
payment. This is a genuinely common real-world situation: a program that
mostly works, until it hits one specific, less common condition.

## Concepts Used

- The Basic Troubleshooting Flow for IBM i Developers lesson's five-step
  flow.
- `STRDBG`, breakpoints, and `EVAL`, from the STRDBG Basics, Setting and
  Using Breakpoints, and Watching Variables During Debug lessons.
- `%FOUND` after `CHAIN`, from the Understanding %FOUND after CHAIN
  lesson.

## Files and Programs Involved

- **`CUSTMAST`**, the file the broken program works against.
- **`PAYAPPLY`**, the broken program being debugged in this project.

## Step-by-Step Build Outline

1. Start with the broken version of `PAYAPPLY`, shown below.
2. Follow the troubleshooting flow: check the job log first.
3. Notice the job log shows a runtime error, not a compile error,
   pointing directly at the `UPDATE` statement inside `PAYAPPLY`.
4. Start `STRDBG PGM(PAYAPPLY)`, set a breakpoint on the `chain` line,
   and step forward one line at a time.
5. Use `EVAL` to check `%found(CUSTMAST)` immediately after the `CHAIN`,
   revealing it is `*off`, the actual root cause.

## Example Code

The broken version:

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);
dcl-s paymentAmt packed(9:2);

custNbr = 9999;
paymentAmt = 50.00;

chain custNbr CUSTMAST;
CUSTBAL -= paymentAmt;
update CUSTMAST;

*inlr = *on;
```

Here, `custNbr` is set to `9999`, a customer number that does not exist
in `CUSTMAST`. The `CHAIN` completes without error, exactly as covered in
the Understanding %FOUND after CHAIN lesson, but the program never
checks `%FOUND` before immediately changing `CUSTBAL` and calling
`UPDATE`, exactly the mistake called out in the Common RPGLE File I/O
Mistakes and Best Practices lesson: calling `UPDATE` after a `CHAIN`
that found nothing results in a runtime error.

The fixed version:

```rpgle
dcl-f CUSTMAST disk keyed;

dcl-s custNbr packed(6:0);
dcl-s paymentAmt packed(9:2);

custNbr = 9999;
paymentAmt = 50.00;

chain custNbr CUSTMAST;
if %found(CUSTMAST);
  CUSTBAL -= paymentAmt;
  update CUSTMAST;
else;
  dsply 'Customer not found, payment not applied';
endif;

*inlr = *on;
```

Adding the `%found(CUSTMAST)` check exactly resolves the runtime error:
now a nonexistent customer number results in a clear message instead of
a failed `UPDATE`.

## How to Test It

Run the broken version with a customer number known not to exist and
confirm it fails with a runtime error in the job log. Then run the fixed
version with the same customer number and confirm it instead displays
the "not found" message cleanly, without failing. Finally, run the fixed
version with a customer number that does exist, confirming the payment
still applies correctly.

## Common Mistakes

- Assuming a `CHAIN` that "worked" earlier in testing will always find a
  record, without checking `%FOUND` for every possible input.
- Jumping straight to `STRDBG` without checking the job log first, which
  in this case already names the exact failing statement.
- Fixing the immediate symptom by wrapping the `UPDATE` in a `monitor`
  block instead of addressing the actual missing `%FOUND` check, which
  would hide the problem rather than genuinely fix it.

## Debugging Checklist

- Check the job log first; here it names `PAYAPPLY` and the `UPDATE`
  statement directly.
- Confirm compile versus runtime: `PAYAPPLY` compiled and ran, so this is
  a runtime problem.
- Start `STRDBG`, set a breakpoint before the suspect statement, and step
  forward.
- Use `EVAL` on `%found(CUSTMAST)` immediately after the `CHAIN` to
  confirm the actual root cause before changing anything.

## Possible Extensions

A natural extension is adding a check for a negative resulting balance,
deciding whether payments should ever be allowed to push a customer's
balance below zero, and handling that case explicitly rather than
silently allowing it.

## Quick Recap

- The broken `PAYAPPLY` fails because it never checks `%FOUND` before
  calling `UPDATE`.
- The job log names the exact failing statement, making it the right
  first place to check, before starting a debug session.
- The fix is a `%found(CUSTMAST)` check, exactly the pattern covered
  throughout the RPGLE File I/O lessons.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "What would the job log message actually look like for this specific
  UPDATE failure?"
- "Why is fixing the missing %FOUND check better than just wrapping the
  UPDATE in a monitor block?"
