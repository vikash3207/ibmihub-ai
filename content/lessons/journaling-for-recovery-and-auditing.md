# Journaling for Recovery and Auditing

## Learning Objective

By the end of this lesson, you will be able to explain how journaling
supports recovery and auditing as two related but distinct practical
use cases.

## Simple Explanation

Journaling, covered throughout this batch, keeps a record of every
change to a journaled table. That same record supports two genuinely
different practical goals:

- **Recovery**: restoring a table to a correct, consistent state after
  something goes wrong, such as a system failure partway through a
  batch job, by replaying or reversing journal entries as needed.
- **Auditing**: answering "what changed, when, and by whom" over time,
  similar in spirit to the `QAUDJRN` auditing lesson covered earlier in
  this course, but focused on business data changes specifically
  rather than system-wide security events.

## Why It Matters

Recovery and auditing ask different questions of the same underlying
journal entries. Recovery asks "how do I get this table back to a
correct state after a failure?" Auditing asks "what happened to this
data over time, and who was responsible?" Recognizing that journaling
serves both goals, using the same recorded entries, explains why it is
considered foundational IBM i knowledge rather than a narrow,
single-purpose feature.

## Practical Example

Imagine a batch job updating hundreds of customer records fails
partway through, after updating some records but not others. With
`CUSTMAST` journaled, and the update wrapped in commitment control
covered earlier in this batch, the incomplete transaction can be rolled
back, returning every record to its state before the batch job started,
rather than leaving some records updated and others not. Separately,
weeks later, a manager asks which employee's changes caused a specific
customer's credit limit to change; reviewing `CUSTJRN`'s entries for
that customer answers exactly that auditing question, using the same
kind of journal entries, for a completely different purpose.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects exactly how journaling supports both goals in
practice.

## Common Confusions

**"Are recovery and auditing really the same use of journaling?"**
They rely on the same underlying journal entries, but ask different
questions: recovery restores a correct state after a failure; auditing
answers what happened and by whom, often well after the fact, with no
failure necessarily involved at all.

**"Does journaling alone provide full disaster recovery for a
system?"**
No. Journaling supports recovering journaled tables to a consistent
state and is an important building block, but full system disaster
recovery, remote journaling to another system, and high-availability
replication are broader topics beyond this introductory lesson.

**"Is auditing through journal entries a replacement for QAUDJRN,
covered earlier in this course?"**
No. They serve complementary purposes: `QAUDJRN` records system-wide
security events; a table's own journal entries record that specific
table's data changes. Both may be relevant depending on the question
being asked.

## Quick Recap

- Journaling supports both recovery, restoring a correct state after a
  failure, and auditing, answering what changed and by whom over time.
- These are different questions asked of the same underlying journal
  entries, not two separate features.
- Journaling is a building block for recovery, not a complete disaster
  recovery solution on its own; remote journaling and HA replication
  are broader topics beyond this batch.
- Table-level journal entries and `QAUDJRN` serve complementary,
  distinct auditing purposes.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through how journal entries would help recover from
  a batch job that failed halfway through updating records?"
- "Why are recovery and auditing considered two separate use cases
  even though they use the same journal entries?"
