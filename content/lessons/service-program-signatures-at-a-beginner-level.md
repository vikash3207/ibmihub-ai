# Service Program Signatures at a Beginner Level

## Learning Objective

By the end of this lesson, you will be able to explain, at a
conceptual level, what a service program's signature is and why it
matters for compatibility with programs that already call into it.

## Simple Explanation

A **signature** is essentially a fingerprint of a service program's
exported interface at a specific point in time: which procedures it
exposes, and in what form. When a program is bound to a service
program, it remembers the signature it was bound against, not just the
service program's name.

This matters because of what can happen later: if a service program's
exports change in a way that breaks that remembered signature, such as
removing an export a calling program depends on, programs that were
already bound against the earlier signature can fail at runtime, even
though the service program itself still compiles and builds
successfully on its own.

## Why It Matters

"It compiled" and "it is safe for every program that already depends
on it" are two different questions. A signature is the mechanism that
lets IBM i notice the difference: a calling program bound against an
older signature can be protected from a service program change that
would otherwise silently break it, rather than failing unpredictably
at runtime with little explanation.

## Practical Example

Imagine `CUSTUTIL` originally exports only `isValidCustNbr`, and
several programs are already bound to it. If a later update to
`CUSTUTIL` simply adds a new exported procedure alongside the existing
one, programs bound against the original signature generally continue
working correctly, since what they actually depend on has not changed.
If, instead, that update removed or fundamentally changed
`isValidCustNbr` itself, programs still bound against the original
signature are exactly the ones at risk of breaking, since the specific
thing they depend on no longer matches what they expect.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects exactly the kind of compatibility question
signatures exist to help manage.

## Common Confusions

**"If I just add a new exported procedure, does that break existing
callers?"**
Generally, no. Adding a new export alongside existing ones, without
touching what is already there, usually keeps prior signatures
compatible, since nothing already depended-upon has actually changed.

**"What if I genuinely need to remove or change an existing exported
procedure?"**
That is exactly the risky case signatures are meant to help you notice
and manage deliberately, rather than discovering the problem only
after something breaks in production. The next lesson in this batch
covers a safer approach to this kind of change.

**"Is a signature something I have to calculate or write by hand?"**
No, not at this introductory level. The signature concept is largely
managed through binder source's signature levels, covered briefly in
the previous lesson; the important thing at this stage is understanding
why signatures exist and what risk they protect against.

## Quick Recap

- A signature is a fingerprint of a service program's exported
  interface at a point in time.
- Programs remember which signature they were bound against, not just
  the service program's name.
- Adding new exports generally keeps existing signatures compatible;
  removing or changing existing exports is the risky case.
- Signatures exist to help catch compatibility problems deliberately,
  rather than letting them surface unpredictably at runtime.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would actually happen at runtime if a calling program's
  remembered signature no longer matched the service program?"
- "Why is 'it still compiles' not the same thing as 'it is safe to
  deploy' for a service program change?"
