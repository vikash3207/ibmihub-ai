# Updating Service Programs Safely

## Learning Objective

By the end of this lesson, you will be able to describe, at a
conceptual level, a safe process for updating a service program
without breaking programs that already depend on it.

## Simple Explanation

The Service Program Signatures lesson established the core risk: a
service program can compile and build successfully while still
breaking programs that were already bound against an earlier
signature. A safe update process is mostly about managing that risk
deliberately, rather than assuming a successful build means everything
downstream is fine.

A few practical habits make this safer:

- Prefer **adding** new exported procedures over removing or changing
  existing ones, whenever the goal can be met that way.
- When an existing exported procedure's behavior or interface
  genuinely must change, treat that as a deliberate, planned change:
  identify which programs actually call it, and plan to recompile and
  retest them rather than assuming they will keep working.
- Keep the previous, working version of the service program available
  until the update has been verified, so there is a way back if
  something is not right.

## Why It Matters

Without this discipline, a service program update can look completely
successful, compiling cleanly and building without error, while quietly
breaking every program still bound against the interface it used to
have. Treating updates to existing exports as genuinely riskier than
adding new ones is what keeps a shared service program trustworthy as
more and more programs come to depend on it over time.

## Practical Example

Imagine `CUSTUTIL` needs a new capability: validating a customer's
email address, in addition to its existing `isValidCustNbr` check.
Adding a new exported procedure, `isValidEmail`, alongside the
existing one is the safer path: every program already bound to
`CUSTUTIL` continues working exactly as before, and only programs that
actually want the new check need to be updated to call it. Changing
the existing `isValidCustNbr` procedure's parameters instead, even for
a good reason, would be the riskier path, since it directly affects
every program that already depends on it exactly as it is today.

This is a simplified, illustrative example rather than a specific real
change, but it reflects the everyday shape of this decision.

## Common Confusions

**"If it compiles and builds without error, isn't that proof it's
safe?"**
No. A successful build only confirms the service program itself is
internally consistent. It says nothing about whether programs already
bound against an earlier signature will still work correctly, which is
exactly the gap a deliberate update process is meant to cover.

**"Do I need to redeploy every program that uses the service program,
every time I update it?"**
Not if the update only added new exports without touching existing
ones. Redeploying, recompiling, and retesting calling programs matters
specifically when an existing export's behavior or interface has
genuinely changed.

**"Is keeping a previous working version just for emergencies?"**
It is a safety net more than a routine step, but it matters
specifically because service program problems can surface in calling
programs rather than in the service program itself, which can make
them harder to notice immediately after an update.

## Quick Recap

- A successful compile and build does not guarantee a service program
  update is safe for programs that already depend on it.
- Adding new exported procedures is generally safer than changing or
  removing existing ones.
- When an existing export must genuinely change, identify its actual
  callers and plan to recompile and retest them deliberately.
- Keeping a previous working version available provides a way back if
  an update turns out to cause a problem.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I find out which programs actually call a specific
  exported procedure before changing it?"
- "Why is adding a new export generally safer than changing an
  existing one, even if the change seems small?"
