# Adopted Authority Basics

## Learning Objective

By the end of this lesson, you will be able to explain what adopted
authority is and why it must be used responsibly.

## Simple Explanation

Every authority check covered so far in this batch has asked "does
this user have authority?" **Adopted authority** changes that question,
for a specific program, to "does the program's owner have authority?"
instead. A program created with `USRPRF(*OWNER)` runs using its
owner's authority, not the calling user's own authority, for as long as
that program is active:

```clle
CRTBNDRPG PGM(MYLIB/CUSTINQR) SRCFILE(MYLIB/QRPGLESRC) USRPRF(*OWNER)
```

If `CUSTINQR` is owned by a user profile with `*CHANGE` authority to
`CUSTMAST`, any user who runs `CUSTINQR` can read and update `CUSTMAST`
through that program, even if their own user profile has no direct
authority to `CUSTMAST` at all.

## Why It Matters

Adopted authority is genuinely useful: it lets a carefully-written
program provide controlled access to data a user should not be able to
touch directly, similar in spirit to the external stored procedure
pattern covered in the Advanced SQL lessons, exposing a specific,
controlled capability without granting broad direct access. But this
power cuts both ways: if the program itself has a bug or an unintended
capability, that bug now runs with the owner's authority, not the
calling user's, potentially allowing far more than the user should ever
be able to do. This is exactly why adopted authority must be used
carefully and deliberately, never as a casual way to avoid granting
direct authority.

## Practical Example

Recall `CUSTINQR` from the Object Authority in Depth lesson earlier in
this batch. Instead of granting every user direct `*CHANGE` authority
to `CUSTMAST`, a shop might instead grant users only `*USE` authority
to run `CUSTINQR`, which adopts its owner's `*CHANGE` authority to
`CUSTMAST` while it runs. Users get exactly the controlled ability the
program provides, checking and updating customer records through
`CUSTINQR`'s own logic, without ever being granted broad, direct
authority to modify `CUSTMAST` any other way.

This is a simplified, illustrative example rather than a specific real
implementation, but it reflects exactly why adopted authority is used
in practice.

## Common Confusions

**"Does adopted authority mean the calling user's own authority no
longer matters at all?"**
While the adopting program is active, the owner's authority is what is
checked for that program's own operations. The calling user's own
authority still matters for anything outside that specific program's
adopted scope.

**"Is adopted authority risky by nature, or only risky if misused?"**
It is a powerful, legitimate tool, not inherently dangerous, but it
concentrates risk: any flaw in an adopting program's logic can now be
exploited with the owner's authority rather than the caller's own. This
is exactly why adopting programs deserve extra care in their own
correctness.

**"Should every program that needs elevated access use adopted
authority?"**
Not automatically. It is one legitimate option among others, including
granting authority through an authorization list, covered earlier in
this batch. Adopted authority is most appropriate when a specific,
well-understood program needs to provide controlled access to
something users should not be able to reach directly.

## Quick Recap

- Adopted authority lets a program run using its owner's authority
  instead of the calling user's own authority, for as long as that
  program is active.
- It enables controlled, indirect access to data a user cannot reach
  directly, similar in spirit to exposing a controlled capability
  through an external stored procedure.
- Because a flaw in an adopting program's logic runs with the owner's
  authority, adopting programs deserve extra scrutiny and care.
- Adopted authority is one legitimate option among several for
  providing controlled access, not a default choice for every case.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What kind of program would be a reasonable candidate for adopted
  authority, versus one that should not use it?"
- "Why does a bug in an adopting program matter more than a bug in a
  program that only uses the calling user's own authority?"
