# Encoded Vector Indexes Introduction

## Learning Objective

By the end of this lesson, you will be able to explain what an Encoded
Vector Index (EVI) is and what kind of query pattern it is generally
built for.

## Simple Explanation

The SQL Indexes and Views lesson earlier in this batch covered regular
SQL indexes, useful for finding a specific row or small set of rows
quickly by key. An **Encoded Vector Index (EVI)** is a different,
specialized kind of index, better suited to queries that summarize or
group large amounts of data rather than look up individual rows, such
as counting or grouping by a column with a relatively small number of
distinct values.

```sql
CREATE ENCODED VECTOR INDEX MYLIB.CUST_STATUS_EVI
  ON MYLIB.CUSTMAST (ISACTIVE);
```

An EVI like this one is built around a column with few distinct
values, here just `'Y'` and `'N'`, and is designed to make queries that
group or summarize by that column, rather than look up one exact row,
more efficient.

## Why It Matters

A regular index and an EVI are optimized for genuinely different kinds
of queries. Knowing that an EVI exists as a distinct index type, built
for grouping and summarizing rather than exact-row lookups, is useful
context even without needing to become an indexing-strategy expert:
it explains why "just add an index" is not always the same
recommendation once large-scale reporting or analytical-style queries
are involved.

## Practical Example

Imagine a report that counts how many customers are active versus
inactive across a very large `CUSTMAST` table. That kind of grouping
query is the situation an EVI on `ISACTIVE` is built to help with,
distinct from a query that looks up one specific customer by
`CUSTNBR`, which the earlier `CUSTNBR_IDX` regular index is built to
help with instead.

This is a simplified, illustrative example rather than a specific real
performance case, but it reflects the general kind of query pattern an
EVI is intended for.

## Common Confusions

**"Is an EVI just a faster version of a regular index?"**
No. It is a different kind of index, suited to a different kind of
query, grouping and summarizing rather than exact-row lookups. Using
an EVI for the wrong kind of query would not provide the same benefit
a regular index provides for row lookups.

**"Do I need an EVI for every table?"**
No. This lesson stays at an introductory level: EVIs are a specialized
tool for specific reporting or analytical-style query patterns on
large tables, not a general-purpose recommendation for every table or
column.

**"Should I decide on my own which columns need an EVI?"**
At this introductory level, the goal is recognizing that EVIs exist and
roughly what kind of query pattern they help with. Deciding exactly
which columns genuinely benefit from an EVI in a real system is a
deeper indexing-strategy topic beyond this lesson.

## Quick Recap

- An Encoded Vector Index (EVI) is a specialized index type, distinct
  from a regular SQL index, built for grouping and summarizing large
  amounts of data rather than exact-row lookups.
- EVIs are typically built around columns with a relatively small
  number of distinct values.
- A regular index and an EVI are optimized for genuinely different
  kinds of queries, not interchangeable.
- Deciding exactly which columns need an EVI in a real system is a
  deeper topic beyond this introductory lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another example of a column that might be a good
  candidate for an EVI, and explain why?"
- "Why would an EVI built on a column with thousands of distinct
  values generally not be a good fit?"
