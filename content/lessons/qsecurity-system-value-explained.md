# QSECURITY System Value Explained

## Learning Objective

By the end of this lesson, you will be able to explain what the
`QSECURITY` system value is and why its level shapes how much every
other security concept in this course actually matters.

## Simple Explanation

Every authority concept covered in Security Batch 1, object authority,
public and private authority, special authorities, and adopted
authority, is checked and enforced according to the system's overall
security posture. `QSECURITY` is the system value that sets this
posture, as a single number from `10` to `50`, with each higher level
enforcing security more strictly than the one before it. At the
highest common levels used in practice, the system fully enforces
object-level authority checking for every user, exactly as described
throughout this batch.

```clle
DSPSYSVAL SYSVAL(QSECURITY)
```

## Why It Matters

`QSECURITY` is the setting that determines whether the careful,
deliberate authority design covered throughout this course, public and
private authority, authorization lists, special authorities, actually
gets enforced consistently for every user. A system running at a lower
security level can behave in ways that surprise a developer who
assumes the object-authority rules already covered in this course are
always fully enforced. Knowing that `QSECURITY` exists, and roughly
what it controls, explains why the same authority design can behave
differently on different systems.

## Practical Example

Imagine a developer who carefully sets `CUSTMAST`'s public authority to
`*EXCLUDE` and grants access only through `ORDERGRP`, exactly as
covered in the Public and Private Authority lesson earlier in this
batch. On a system running at a security level that fully enforces
object authority, this design works exactly as intended. Understanding
that `QSECURITY` is the setting controlling this enforcement helps a
developer reason correctly about what to expect, and know that
checking `QSECURITY` is a reasonable early step if authority behavior
ever seems inconsistent with what this course describes.

This is a simplified, illustrative example rather than a specific real
system, but it reflects why this system value matters conceptually.

## Common Confusions

**"Is QSECURITY something a developer changes routinely?"**
No. `QSECURITY` is a fundamental, system-wide setting, generally
decided and managed by whoever administers security for the system,
not changed casually or often. A developer's role is usually
understanding what it means, not changing it.

**"Does a higher QSECURITY level make object authority design
unnecessary?"**
No, the opposite: a higher level is what makes the careful object
authority, public/private authority, and authorization list design
covered throughout this course actually matter and get enforced
consistently. Without that enforcement, the same careful design would
provide a weaker guarantee.

**"Do I need to memorize every QSECURITY level and its exact
differences?"**
Not for this introductory lesson. Understanding that this system value
exists, that it is expressed as a level, and that higher levels enforce
security more strictly, is the useful conceptual takeaway here.

## Quick Recap

- `QSECURITY` is the system value that sets the system's overall
  security enforcement level, expressed as a number.
- Higher levels enforce object authority and other security concepts
  covered in this course more strictly and consistently.
- It is a fundamental, system-wide setting, not something a developer
  typically changes routinely.
- Checking `QSECURITY` is a reasonable step if authority behavior ever
  seems inconsistent with the concepts covered throughout this course.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why would a company running important business applications
  generally want a higher QSECURITY level rather than a lower one?"
- "Who would typically be responsible for deciding and changing a
  system's QSECURITY level in a real organization?"
