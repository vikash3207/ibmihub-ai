# Auditing Basics and QAUDJRN Overview

## Learning Objective

By the end of this lesson, you will be able to explain what `QAUDJRN`
is and what kind of security events it records.

## Simple Explanation

The Investigating Authority Failures lesson earlier in this batch
covered checking the job log for a specific failure a user just
experienced. `QAUDJRN` is different: it is the system-wide **security
audit journal**, a running record of security-relevant events across
the whole system over time, not just what a single job's log happens
to capture in the moment.

```clle
DSPJRN JRN(QAUDJRN) JRNCDE((T)) ENTTYP((AF))
```

A command like this displays entries from `QAUDJRN`, filtered to
authority-failure entries (`AF`), giving a historical view of authority
failures across the system, not limited to one job's own log.

## Why It Matters

A job log only shows what happened in one specific job. `QAUDJRN`, when
enabled, provides a broader, ongoing record: which authority failures
happened, when, and for which user, across the whole system, over
time. This matters for understanding patterns, such as a specific
object repeatedly causing authority failures for multiple users, that a
single job log could never reveal on its own.

## Practical Example

Recall the authority-failure investigation process covered earlier in
this batch, which starts from one user's specific complaint and job
log. If several different users have quietly hit similar authority
failures against the same file over the past week, checking each of
their individual job logs one at a time would be slow and easy to miss
the pattern entirely. Reviewing `QAUDJRN` entries for authority
failures across that same period could reveal the pattern immediately,
pointing to a systemic authority problem rather than several unrelated,
individual issues.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects why the audit journal exists alongside
the job log.

## Common Confusions

**"Is QAUDJRN the same thing as a job log?"**
No. A job log is specific to one job's execution. `QAUDJRN` is a
system-wide journal recording security-relevant events across every
job, over whatever time period it has been enabled and retained.

**"Does every IBM i system automatically record everything in
QAUDJRN?"**
No. Auditing needs to be deliberately enabled, and what specific kinds
of events get recorded is configurable. This introductory lesson
focuses on what `QAUDJRN` is conceptually, not on configuring exactly
which event types to record, which is a deeper topic beyond this
lesson.

**"Is analyzing QAUDJRN entries in depth something every developer
needs to do regularly?"**
Not typically. Day-to-day authority-failure investigation, covered
earlier in this batch, usually starts with the job log. `QAUDJRN`
becomes relevant for broader, historical, or pattern-level questions,
often in coordination with whoever administers security for the
system.

## Quick Recap

- `QAUDJRN` is the system-wide security audit journal, recording
  security-relevant events across the whole system over time.
- It provides a broader, historical view than any single job's own log
  can offer.
- Auditing needs to be deliberately enabled, and exactly what gets
  recorded is configurable.
- Day-to-day authority-failure investigation typically starts with the
  job log; `QAUDJRN` matters more for broader, pattern-level questions.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me an example of a security question that a job log
  could never answer, but QAUDJRN could?"
- "Why might a company want to keep QAUDJRN entries for a long
  retention period rather than a short one?"
