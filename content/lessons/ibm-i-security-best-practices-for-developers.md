# IBM i Security Best Practices for Developers

## Learning Objective

By the end of this lesson, you will be able to apply a set of practical
security habits to everyday IBM i development work, drawn from across
this batch.

## Simple Explanation

A handful of habits make the difference between security that stays
manageable over time and security that quietly erodes, drawn from the
concepts covered across this batch:

- **Grant least privilege.** Give a user or program exactly the
  authority it needs, no more, using the object, group profile, and
  authorization list concepts covered earlier in this batch, rather
  than defaulting to broad access.
- **Do not overuse `*ALLOBJ`.** As covered earlier in this batch,
  reaching for a special authority to quickly make an authority failure
  disappear bypasses the deliberate authority design entirely.
- **Avoid hardcoded privileged assumptions.** Do not write program
  logic that assumes it will always run with elevated or adopted
  authority; be explicit about which parts of a design genuinely rely
  on that, as covered in the Adopted Authority lesson.
- **Protect sensitive files with restrictive public authority.** As
  covered in the Public and Private Authority lesson, default sensitive
  objects to something restrictive, and grant private authority
  deliberately, rather than leaving public authority generous.
- **Avoid logging secrets.** Passwords, and other sensitive values,
  should never end up in a job log, a spool file, or an integration log
  like the ones covered in the Modern IBM i / APIs / Integration
  lessons.
- **Coordinate with security or admin teams.** Authority decisions,
  especially anything involving special authorities or adopted
  authority, are rarely a developer's decision to make entirely alone.

## Why It Matters

Every one of these habits addresses the same underlying risk: security
that looks fine on the surface while a real gap or bad habit is quietly
present underneath, the same pattern already familiar from the mistakes
lessons covering ILE, integration, and advanced SQL work elsewhere in
this course. Getting into these habits early is what keeps a system's
security genuinely trustworthy as more developers, programs, and data
accumulate over time.

## Practical Example

Imagine a developer under time pressure grants their own user profile
`*ALLOBJ` to get past a stubborn authority failure while testing a new
report. The report works immediately, but the underlying authority gap,
whatever specific file or library actually needed authority, is never
actually identified or fixed for the next developer who hits the same
wall, and the `*ALLOBJ` grant lingers indefinitely, exactly the kind of
quietly accumulating risk this lesson is about. Taking the time to
identify and grant the specific authority actually needed, using the
concepts covered earlier in this batch, avoids this entirely.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common pressure every developer
eventually faces.

## Common Confusions

**"Are these best practices only relevant to security specialists, not
regular developers?"**
No. Every one of these habits applies directly to everyday development
work: writing programs, granting test authority, and logging
integration activity, not just formal security administration.

**"Is granting *ALLOBJ ever an acceptable shortcut under time
pressure?"**
It might feel like the fastest fix in the moment, but it trades a
quick, narrow problem for a broad, lingering one. Identifying the
specific authority actually needed is almost always the better choice,
even under time pressure.

**"Do these practices only matter for genuinely sensitive data, like
payroll or financial records?"**
No. Good authority habits, least privilege, restrictive public
authority defaults, and not logging secrets, are worth applying broadly,
not reserved only for the most obviously sensitive systems.

## Quick Recap

- Least privilege, avoiding `*ALLOBJ` overuse, avoiding hardcoded
  privileged assumptions, restrictive public authority defaults,
  avoiding logging secrets, and coordinating with security or admin
  teams are the core habits covered across this batch.
- These habits address the same underlying risk: security that looks
  fine on the surface while a real problem is quietly present
  underneath.
- Advanced topics such as audit journal analysis, exit point
  programming, row and column access control, and multi-factor
  authentication build on these fundamentals, and are natural next
  steps for a future, deeper security batch.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a short scenario where a developer is tempted to
  take a security shortcut, and ask me what the better approach would
  be?"
- "Which of these best practices would be easiest to accidentally skip
  under a tight deadline, and why?"
