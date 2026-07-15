# Common IBM i Security Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize the most
common IBM i security mistakes developers make, drawn from across both
Security Fundamentals batches.

## Simple Explanation

A handful of mistakes come up repeatedly once the concepts across both
Security Fundamentals batches are put into practice:

- **Overusing `*ALLOBJ`.** As covered in the Special Authorities
  lesson, reaching for a broad special authority to make an authority
  failure disappear bypasses deliberate authority design entirely.
- **Relying on public authority instead of deliberate private
  grants.** As covered in the Public and Private Authority lesson,
  leaving public authority generous "just in case" undermines the whole
  point of designing authority deliberately.
- **Ignoring IFS permissions.** As covered in the IFS Security Basics
  lesson, securing a native database file carefully says nothing about
  the IFS directories and files integration work often depends on.
- **Adopting authority without understanding the risk.** As covered in
  the Adopted Authority lesson, a bug in a program that adopts its
  owner's authority runs with that elevated authority, not the caller's
  own, which deserves extra scrutiny.
- **Not checking job logs, or QAUDJRN, for authority failures.** As
  covered in this batch, both the job log and the audit journal provide
  real evidence about authority problems that guessing cannot replace.
- **Assuming development authority matches production authority.** A
  program that works fine in a development environment, where authority
  is often set more generously, can fail unexpectedly once it reaches a
  production environment with more carefully restricted authority.
- **Logging secrets.** As already covered in the Modern IBM i / APIs /
  Integration lessons, passwords and other sensitive values should
  never end up in a job log, spool file, or integration log.

## Why It Matters

Every one of these mistakes shares the same thread already familiar
from the mistakes lessons covering ILE, integration, and advanced SQL
work elsewhere in this course: something can look fine on the surface,
a program runs, an authority failure disappears, while a real gap is
quietly present underneath. Recognizing these patterns is what keeps a
system's security genuinely trustworthy as more developers, programs,
and environments accumulate over time.

## Practical Example

Imagine a program tested thoroughly in a development environment, where
the developer's own user profile happens to have broad authority, works
perfectly there. Once deployed to production, where authority is
correctly restricted following the least-privilege habits covered in
Batch 1, the same program suddenly fails with authority errors the
developer never saw during testing. Assuming development authority
would match production authority, rather than testing against
authority that actually resembles production, is exactly the kind of
mistake this lesson is describing.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common security mistake.

## Common Confusions

**"If a program works correctly in development, is that reasonable
evidence it will work in production?"**
Not for authority specifically. Development environments often have
more generous authority than production, so a program working in
development says little about whether it has the specific authority it
will actually need once deployed.

**"Are these mistakes only a concern for large, complex systems?"**
No. Even a small system with a handful of files and one or two
programs can run into any of these, particularly relying on generous
public authority or not checking the job log when something
unexpected happens.

**"Does multi-factor authentication (MFA) replace the need for careful
object authority design?"**
No. MFA strengthens confidence in who a user actually is at sign-on
time, which is a different, complementary concern from what that
authenticated user is then authorized to do, which is what object
authority, covered throughout both Security Fundamentals batches,
governs. Implementing MFA itself is a deeper topic beyond this
introductory course.

## Quick Recap

- Overusing `*ALLOBJ`, relying on public authority, ignoring IFS
  permissions, adopting authority without understanding the risk, not
  checking the job log or QAUDJRN, assuming development authority
  matches production, and logging secrets are the most common IBM i
  security mistakes covered across both batches.
- Every one of these lets a system look secure on the surface while a
  real gap is quietly present underneath.
- Testing a program's authority needs against production-like
  authority, not generous development authority, is essential before
  trusting that it will work once deployed.
- Deeper topics such as full audit-journal analysis, exit program
  coding, RCAC policy design, and MFA implementation build on these
  fundamentals and are natural next steps beyond this course's current
  scope.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a short scenario where a developer is tempted to
  skip one of these best practices, and ask me to spot the risk?"
- "Which of these mistakes would be hardest to notice until a program
  actually reaches production?"
