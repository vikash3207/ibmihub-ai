# SQE vs CQE at a Beginner-Friendly Level

## Learning Objective

By the end of this lesson, you will be able to explain, at a
beginner-friendly level, what SQE and CQE are and why Db2 for i has two
query engines.

## Simple Explanation

The previous lesson introduced the optimizer as the part of Db2 for i
that decides how a query actually retrieves its rows. Db2 for i
actually has two different query engines capable of doing this work:

- **CQE** (Classic Query Engine): the older of the two, originally
  built to handle both DDS-described files and SQL tables, including
  older or more unusual query patterns.
- **SQE** (SQL Query Engine): a newer engine, built specifically around
  SQL tables and modern SQL features, generally able to make better
  optimization decisions for typical SQL queries.

For most modern SQL queries against SQL-created or well-described
tables, Db2 for i uses SQE automatically; certain older patterns or
DDS-specific cases may still be handled by CQE.

## Why It Matters

Knowing that two engines exist explains why some query behavior or
performance advice a developer reads may not apply universally: it may
be specific to one engine or the other. At a beginner-friendly level,
the important takeaway is simply that this distinction exists and why
it exists, not memorizing every rule for which engine handles which
case.

## Practical Example

Recall the `CUSTMAST` table used throughout this batch, created with
SQL DDL. A typical modern `SELECT` against it, like the queries used in
earlier lessons in this batch, is the kind of query SQE is built to
optimize well. An older query pattern against a DDS-described file with
unusual, legacy characteristics is more the kind of case CQE was
originally built to continue supporting.

This is a simplified, illustrative example rather than a specific real
performance comparison, but it reflects why Db2 for i maintains two
engines rather than one.

## Common Confusions

**"Do I need to choose between SQE and CQE myself when writing a
query?"**
No, not at this introductory level. Db2 for i decides which engine
handles a given query automatically. Understanding that this decision
happens, and roughly why, is the goal of this lesson, not manually
choosing an engine.

**"Is CQE outdated and about to be removed?"**
This lesson does not make claims about IBM's long-term plans for
either engine; what matters here is understanding that both currently
exist and serve different historical purposes, which is enough context
for a beginner-friendly introduction.

**"Does knowing about SQE and CQE help me write better SQL day to
day?"**
Mostly indirectly: it explains why some performance advice you might
encounter is engine-specific rather than universal. Writing well-formed
SQL against properly indexed SQL tables, already covered in this
batch, matters more day to day than tracking which engine handles a
specific query.

## Quick Recap

- Db2 for i has two query engines: CQE, the older engine, and SQE, the
  newer engine built around modern SQL and SQL tables.
- Db2 for i decides automatically which engine handles a given query;
  this is not something a developer chooses manually.
- Most modern SQL queries against SQL tables are handled by SQE.
- The main value of knowing this distinction is understanding that some
  performance advice is engine-specific, not universal.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why might a shop still have query patterns that end up handled by
  CQE instead of SQE?"
- "Does the SQE versus CQE distinction matter for the kind of everyday
  SQLRPGLE queries covered earlier in this course?"
